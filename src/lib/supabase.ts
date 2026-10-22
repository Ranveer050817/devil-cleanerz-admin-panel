import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CleaningPackage, CleaningProduct, CleaningService, ResultItem } from '../types';

// Retrieve credentials from environment variables (safe for Vite client and Node.js testing)
const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || '';

const envKey = (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY)) || 
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_PUBLISHABLE_KEY || process.env?.VITE_SUPABASE_ANON_KEY)) || '';

// Local session storage override for convenience if env variables are added in UI
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('devil_supabase_url') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('devil_supabase_key') || '' : '';

export const supabaseUrl = envUrl || storedUrl;
export const supabasePublishableKey = envKey || storedKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabasePublishableKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('your-project')
);

// Fallback dummy for development when keys are not yet provided
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-key';

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : fallbackUrl,
  isSupabaseConfigured ? supabasePublishableKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Save credentials from UI
export const setRuntimeSupabaseCredentials = (url: string, key: string) => {
  if (url && key) {
    localStorage.setItem('devil_supabase_url', url.trim());
    localStorage.setItem('devil_supabase_key', key.trim());
    window.location.reload();
  }
};

// Clear runtime credentials
export const clearRuntimeSupabaseCredentials = () => {
  localStorage.removeItem('devil_supabase_url');
  localStorage.removeItem('devil_supabase_key');
  window.location.reload();
};

/**
 * Perform a real lightweight query to verify connectivity and API key validity.
 */
export async function checkSupabaseHealth(): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase credentials are not configured in environment or settings.' };
  }
  try {
    const { error } = await supabase.from('packages').select('id', { count: 'exact', head: true });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Network request failed' };
  }
}

export type StorageBucket = 'packages' | 'services' | 'results' | 'products';

export interface StorageUploadResult {
  publicUrl: string;
  path: string;
  isLocalFallback?: boolean;
  message?: string;
}

/**
 * Safely read a file into a base64 Data URL for local preview when storage is inaccessible or unauthenticated
 */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file to the designated Supabase Storage bucket.
 * Bucket names: packages | services | results | products
 * If unauthenticated or if bucket RLS restricts anon writes, falls back gracefully to preview data URL.
 */
export async function uploadImageToStorage(
  bucket: StorageBucket,
  file: File,
  prefix: string = 'img'
): Promise<StorageUploadResult> {
  if (!isSupabaseConfigured) {
    const localUrl = await readFileAsDataUrl(file);
    return {
      publicUrl: localUrl,
      path: `local_${Date.now()}`,
      isLocalFallback: true,
      message: 'Supabase credentials pending. Image preserved locally for preview.'
    };
  }

  try {
    // 1. Check if user is authenticated with Supabase Auth
    // Anonymous users cannot write to RLS-protected storage buckets
    const { data: sessionData } = await supabase.auth.getSession();
    const hasAuthSession = Boolean(sessionData?.session?.user);

    if (!hasAuthSession) {
      // Gracefully store as data URL without attempting a failing storage API call
      const localUrl = await readFileAsDataUrl(file);
      return {
        publicUrl: localUrl,
        path: `local_preview_${Date.now()}`,
        isLocalFallback: true,
        message: 'No active Supabase admin session. Image preserved in preview (sign in with admin account to upload to cloud bucket).'
      };
    }

    // 2. Generate safe sanitized filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${prefix}_${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/jpeg'
      });

    if (error) {
      const isRls = error.message?.includes('row-level security') || (error as any).statusCode === '403';
      const localUrl = await readFileAsDataUrl(file);
      return {
        publicUrl: localUrl,
        path: `local_fallback_${Date.now()}`,
        isLocalFallback: true,
        message: isRls
          ? `Bucket "${bucket}" RLS Notice: User lacks storage.objects INSERT permission. Image preserved in preview.`
          : `Storage notice: ${error.message}. Preserved locally.`
      };
    }

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      publicUrl: publicData.publicUrl,
      path: data.path,
      isLocalFallback: false
    };
  } catch (err: any) {
    const localUrl = await readFileAsDataUrl(file);
    return {
      publicUrl: localUrl,
      path: `local_error_${Date.now()}`,
      isLocalFallback: true,
      message: err.message || 'Image loaded in local preview.'
    };
  }
}

/**
 * Delete image file from Supabase storage bucket
 */
export async function deleteImageFromStorage(bucket: StorageBucket, pathOrUrl: string): Promise<boolean> {
  if (!isSupabaseConfigured || !pathOrUrl) return false;

  try {
    // If it's a full public URL, extract the path after bucket name
    let path = pathOrUrl;
    if (pathOrUrl.includes(bucket)) {
      const parts = pathOrUrl.split(`${bucket}/`);
      if (parts.length > 1) {
        path = parts[1].split('?')[0];
      }
    }

    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      console.warn(`Failed to delete ${path} from ${bucket}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Error during storage deletion:`, err);
    return false;
  }
}

// ==========================================
// Database Transformers (Bidirectional snake_case / camelCase)
// ==========================================

// ==========================================
// Database Transformers (Bidirectional snake_case / camelCase)
// ==========================================

export function mapDbToPackage(row: any): CleaningPackage {
  const inclusions = Array.isArray(row.inclusions) 
    ? row.inclusions 
    : Array.isArray(row.included_services) 
    ? row.included_services 
    : typeof row.inclusions === 'string'
    ? row.inclusions.split(',').map((s: string) => s.trim())
    : [];

  return {
    id: String(row.id),
    name: row.name || 'Untitled Package',
    price: Number(row.price) || 0,
    description: row.description || '',
    imageUrl: row.image_url || row.imageUrl || '',
    includedServices: inclusions,
    displayOrder: Number(row.display_order ?? row.displayOrder ?? 1),
    status: (row.status === 'published' ? 'published' : 'draft'),
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  };
}

export function mapPackageToDb(pkg: CleaningPackage): any {
  return {
    name: pkg.name,
    price: Number(pkg.price) || 0,
    description: pkg.description,
    image_url: pkg.imageUrl,
    inclusions: pkg.includedServices || [],
    display_order: Number(pkg.displayOrder) || 1,
    status: pkg.status
  };
}

export function mapDbToProduct(row: any): CleaningProduct {
  return {
    id: String(row.id),
    name: row.name || 'Untitled Product',
    price: Number(row.price) || 0,
    imageUrl: row.image_url || row.imageUrl || '',
    description: row.description || '',
    category: row.category || 'General',
    displayOrder: Number(row.display_order ?? row.displayOrder ?? 1),
    status: (row.status === 'published' ? 'published' : 'draft'),
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  };
}

export function mapProductToDb(prod: CleaningProduct): any {
  return {
    name: prod.name,
    price: Number(prod.price) || 0,
    description: prod.description,
    category: prod.category,
    image_url: prod.imageUrl,
    display_order: Number(prod.displayOrder) || 1,
    status: prod.status
  };
}

export function mapDbToService(row: any): CleaningService {
  const inclusions = Array.isArray(row.inclusions) 
    ? row.inclusions 
    : typeof row.inclusions === 'string' 
    ? row.inclusions.split(',').map((s: string) => s.trim())
    : [];

  return {
    id: String(row.id),
    name: row.name || 'Untitled Service',
    category: row.category || 'Home Deep Cleaning',
    description: row.description || '',
    imageUrl: row.image_url || row.imageUrl || '',
    inclusions: inclusions,
    displayOrder: Number(row.display_order ?? row.displayOrder ?? 1),
    status: (row.status === 'published' ? 'published' : 'draft'),
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  };
}

export function mapServiceToDb(srv: CleaningService): any {
  return {
    name: srv.name,
    category: srv.category,
    description: srv.description,
    image_url: srv.imageUrl,
    inclusions: srv.inclusions || [],
    display_order: Number(srv.displayOrder) || 1,
    status: srv.status
  };
}

export function mapDbToResult(row: any): ResultItem {
  return {
    id: String(row.id),
    title: row.title || 'Untitled Result',
    category: row.category || 'Deep Cleaning',
    location: row.location || 'Pan-India',
    description: row.description || '',
    beforeImageUrl: row.before_image_url || row.beforeImageUrl || '',
    afterImageUrl: row.after_image_url || row.afterImageUrl || '',
    additionalImages: Array.isArray(row.additional_images) 
      ? row.additional_images 
      : Array.isArray(row.additionalImages)
      ? row.additionalImages
      : [],
    completionDate: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    displayOrder: Number(row.display_order ?? row.displayOrder ?? 1),
    status: (row.status === 'published' ? 'published' : 'draft'),
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  };
}

export function mapResultToDb(res: ResultItem): any {
  return {
    title: res.title,
    category: res.category,
    location: res.location,
    description: res.description,
    before_image_url: res.beforeImageUrl,
    after_image_url: res.afterImageUrl,
    additional_images: res.additionalImages || [],
    display_order: Number(res.displayOrder) || 1,
    status: res.status
  };
}
