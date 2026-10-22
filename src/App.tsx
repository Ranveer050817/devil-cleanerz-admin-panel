/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  TabType, 
  CleaningPackage, 
  CleaningProduct, 
  CleaningService, 
  ResultItem, 
  AdminSettings, 
  ToastMessage 
} from './types';
import { 
  initialPackages, 
  initialProducts, 
  initialServices, 
  initialResults, 
  initialSettings 
} from './data/initialData';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { Toast } from './components/common/Toast';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { PackagesManagement } from './components/packages/PackagesManagement';
import { ProductsManagement } from './components/products/ProductsManagement';
import { ServicesManagement } from './components/services/ServicesManagement';
import { ResultsGalleryManagement } from './components/results/ResultsGalleryManagement';
import { SettingsManagement } from './components/settings/SettingsManagement';
import { AdminLogin } from './components/auth/AdminLogin';
import { PublicWebsitePreview } from './components/preview/PublicWebsitePreview';
import { 
  supabase, 
  isSupabaseConfigured, 
  mapDbToPackage, 
  mapPackageToDb,
  mapDbToProduct,
  mapProductToDb,
  mapDbToService,
  mapServiceToDb,
  mapDbToResult,
  mapResultToDb
} from './lib/supabase';

export default function App() {
  // Navigation & view states
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isPublicPreview, setIsPublicPreview] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // If running in development without auth configured, allow preview
    return !isSupabaseConfigured;
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Content Data States
  // When Supabase is configured, initialize with empty arrays so no misleading demo items appear
  const [packages, setPackages] = useState<CleaningPackage[]>(() => {
    if (isSupabaseConfigured) return [];
    const saved = localStorage.getItem('devil_packages');
    return saved ? JSON.parse(saved) : initialPackages;
  });

  const [products, setProducts] = useState<CleaningProduct[]>(() => {
    if (isSupabaseConfigured) return [];
    const saved = localStorage.getItem('devil_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [services, setServices] = useState<CleaningService[]>(() => {
    if (isSupabaseConfigured) return [];
    const saved = localStorage.getItem('devil_services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [results, setResults] = useState<ResultItem[]>(() => {
    if (isSupabaseConfigured) return [];
    const saved = localStorage.getItem('devil_results');
    return saved ? JSON.parse(saved) : initialResults;
  });

  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('devil_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Supabase Database Query & Connection States
  const [dataLoading, setDataLoading] = useState<boolean>(isSupabaseConfigured);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Clean out stale demo arrays from localStorage when Supabase is configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      localStorage.removeItem('devil_packages');
      localStorage.removeItem('devil_products');
      localStorage.removeItem('devil_services');
      localStorage.removeItem('devil_results');
    }
  }, []);

  // Sync to local storage only if running in standalone offline preview mode
  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('devil_packages', JSON.stringify(packages));
    }
  }, [packages]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('devil_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('devil_services', JSON.stringify(services));
    }
  }, [services]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('devil_results', JSON.stringify(results));
    }
  }, [results]);

  useEffect(() => {
    localStorage.setItem('devil_settings', JSON.stringify(settings));
  }, [settings]);

  // ==========================================
  // Supabase Authentication & Session Watcher
  // ==========================================
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentUser(session.user);
        setSettings(prev => ({
          ...prev,
          adminEmail: session.user.email || prev.adminEmail,
          adminName: session.user.user_metadata?.full_name || prev.adminName
        }));
      } else {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentUser(session.user);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================
  // Fetch Real Data from Supabase Tables
  // ==========================================
  const loadSupabaseData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setDataLoading(false);
      setIsLiveConnected(false);
      return;
    }

    setDataLoading(true);
    setConnectionError(null);

    try {
      // 1. Packages
      const { data: pkgData, error: pkgError } = await supabase
        .from('packages')
        .select('*')
        .order('display_order', { ascending: true });

      if (pkgError) {
        throw new Error(`packages table: ${pkgError.message}`);
      }

      // 2. Products
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true });

      if (prodError) {
        throw new Error(`products table: ${prodError.message}`);
      }

      // 3. Services
      const { data: srvData, error: srvError } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (srvError) {
        throw new Error(`services table: ${srvError.message}`);
      }

      // 4. Results
      const { data: resData, error: resError } = await supabase
        .from('results')
        .select('*')
        .order('display_order', { ascending: true });

      if (resError) {
        throw new Error(`results table: ${resError.message}`);
      }

      // Map real database records into state (or empty array if 0 records exist)
      setPackages((pkgData || []).map(mapDbToPackage));
      setProducts((prodData || []).map(mapDbToProduct));
      setServices((srvData || []).map(mapDbToService));
      setResults((resData || []).map(mapDbToResult));

      // Successfully verified live Supabase connection
      setIsLiveConnected(true);
      setConnectionError(null);
    } catch (err: any) {
      console.error('Supabase query error:', err);
      setIsLiveConnected(false);
      setConnectionError(err.message || 'Failed to query Supabase database');
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) {
      loadSupabaseData();
    }
  }, [isAuthenticated, loadSupabaseData]);

  // Logout Handler
  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    addToast('Signed Out', 'You have been securely signed out of the admin panel.', 'info');
  };

  const handleResetDemoData = () => {
    if (isSupabaseConfigured) {
      loadSupabaseData();
      addToast('Refreshed', 'Live database records re-queried from Supabase.', 'info');
      return;
    }
    setPackages(initialPackages);
    setProducts(initialProducts);
    setServices(initialServices);
    setResults(initialResults);
    setSettings(initialSettings);
    localStorage.removeItem('devil_packages');
    localStorage.removeItem('devil_products');
    localStorage.removeItem('devil_services');
    localStorage.removeItem('devil_results');
    localStorage.removeItem('devil_settings');
    addToast('Demo Data Reset', 'Initial sample packages, services, and results reloaded.', 'info');
  };

  // ==========================================
  // Packages CRUD
  // ==========================================
  // ==========================================
  // ==========================================
  // Packages CRUD
  // ==========================================
  const handleSavePackage = async (pkg: CleaningPackage) => {
    // Optimistic local state update so admin input is always preserved
    setPackages(prev => {
      const exists = prev.some(p => p.id === pkg.id);
      return exists ? prev.map(p => p.id === pkg.id ? pkg : p) : [pkg, ...prev];
    });

    if (!isSupabaseConfigured) {
      addToast('Package Saved', `"${pkg.name}" updated in preview state.`, 'success');
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasAuth = Boolean(sessionData?.session?.user);

      if (!hasAuth) {
        addToast(
          'Saved in Session',
          `Package "${pkg.name}" saved in your session. Sign in with admin credentials to sync directly to live database.`,
          'info'
        );
        return;
      }

      const payload = mapPackageToDb(pkg);
      const isDbId = pkg.id && !pkg.id.startsWith('pkg-');
      if (isDbId) {
        payload.id = pkg.id;
      }

      const { data, error } = await supabase.from('packages').upsert(payload).select().single();
      if (error) {
        if (error.code === '42501' || error.message?.includes('row-level security')) {
          addToast(
            'Saved in Session (RLS Notice)',
            `Package "${pkg.name}" saved in session. Your Supabase role requires an INSERT/UPDATE RLS policy on the "packages" table.`,
            'info'
          );
          return;
        }
        addToast('Saved in Session', `DB notice: ${error.message}`, 'info');
        return;
      }

      const savedPkg = data ? mapDbToPackage(data) : pkg;
      setPackages(prev => {
        const exists = prev.some(p => p.id === savedPkg.id || p.id === pkg.id);
        return exists ? prev.map(p => (p.id === savedPkg.id || p.id === pkg.id) ? savedPkg : p) : [savedPkg, ...prev];
      });
      addToast('Saved to Supabase', `Package "${savedPkg.name}" saved in database (₹${savedPkg.price.toLocaleString('en-IN')}).`, 'success');
    } catch (err: any) {
      addToast('Package Saved', `"${pkg.name}" updated in session.`, 'info');
    }
  };

  const handleDeletePackage = async (id: string) => {
    const pkg = packages.find(p => p.id === id);
    setPackages(prev => prev.filter(p => p.id !== id));

    if (isSupabaseConfigured && !id.startsWith('pkg-')) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user) {
          addToast('Removed from Session', `"${pkg?.name || 'Package'}" removed in current session.`, 'info');
          return;
        }

        const { error } = await supabase.from('packages').delete().eq('id', id);
        if (error) {
          if (error.code === '42501' || error.message?.includes('row-level security')) {
            addToast('Removed from Session', `"${pkg?.name || 'Package'}" removed in session (RLS policy restricts live delete).`, 'info');
            return;
          }
          addToast('Delete Notice', `Removed in session. DB notice: ${error.message}`, 'info');
          return;
        }
        addToast('Deleted from Supabase', `"${pkg?.name || 'Package'}" removed from database.`, 'info');
      } catch (err: any) {
        addToast('Package Removed', `"${pkg?.name || 'Package'}" removed in session.`, 'info');
      }
    } else {
      addToast('Package Deleted', `"${pkg?.name || 'Package'}" removed.`, 'info');
    }
  };

  const handleTogglePackageStatus = async (id: string) => {
    const target = packages.find(p => p.id === id);
    if (!target) return;
    const nextStatus = target.status === 'published' ? 'draft' : 'published';

    setPackages(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));

    if (isSupabaseConfigured && !id.startsWith('pkg-')) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const { error } = await supabase.from('packages').update({ status: nextStatus }).eq('id', id);
          if (error) {
            if (error.code === '42501' || error.message?.includes('row-level security')) {
              addToast('Status Updated in Session', `Package "${target.name}" is now ${nextStatus} (RLS restriction on live update).`, 'info');
              return;
            }
          }
        }
      } catch (err: any) {
        // Fallback already updated in local state
      }
    }
    addToast('Status Updated', `Package "${target.name}" is now ${nextStatus === 'published' ? 'published on website' : 'draft'}.`, 'info');
  };

  // ==========================================
  // Products CRUD
  // ==========================================
  const handleSaveProduct = async (prod: CleaningProduct) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === prod.id);
      return exists ? prev.map(p => p.id === prod.id ? prod : p) : [prod, ...prev];
    });

    if (!isSupabaseConfigured) {
      addToast('Product Saved', `"${prod.name}" updated in catalog.`, 'success');
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasAuth = Boolean(sessionData?.session?.user);

      if (!hasAuth) {
        addToast(
          'Saved in Session',
          `Product "${prod.name}" saved in session. Sign in with admin credentials to sync directly to live catalog.`,
          'info'
        );
        return;
      }

      const payload = mapProductToDb(prod);
      const isDbId = prod.id && !prod.id.startsWith('prod-');
      if (isDbId) {
        payload.id = prod.id;
      }
      const { data, error } = await supabase.from('products').upsert(payload).select().single();
      if (error) {
        if (error.code === '42501' || error.message?.includes('row-level security')) {
          addToast(
            'Saved in Session (RLS Notice)',
            `Product "${prod.name}" saved in session. Your Supabase role requires an INSERT/UPDATE policy on "products".`,
            'info'
          );
          return;
        }
        addToast('Saved in Session', `DB response: ${error.message}`, 'info');
        return;
      }

      const savedProd = data ? mapDbToProduct(data) : prod;
      setProducts(prev => {
        const exists = prev.some(p => p.id === savedProd.id || p.id === prod.id);
        return exists ? prev.map(p => (p.id === savedProd.id || p.id === prod.id) ? savedProd : p) : [savedProd, ...prev];
      });
      addToast('Saved to Supabase', `Product "${savedProd.name}" saved in database catalog.`, 'success');
    } catch (err: any) {
      addToast('Product Saved', `"${prod.name}" updated in session.`, 'info');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));

    if (isSupabaseConfigured && !id.startsWith('prod-')) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user) {
          addToast('Removed from Session', `"${prod?.name || 'Product'}" removed in session.`, 'info');
          return;
        }

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
          if (error.code === '42501' || error.message?.includes('row-level security')) {
            addToast('Removed from Session', `"${prod?.name || 'Product'}" removed in session.`, 'info');
            return;
          }
          addToast('Delete Notice', `Removed in session. DB notice: ${error.message}`, 'info');
          return;
        }
        addToast('Deleted from Supabase', `"${prod?.name || 'Product'}" removed from database.`, 'info');
      } catch (err: any) {
        addToast('Product Removed', `"${prod?.name || 'Product'}" removed in session.`, 'info');
      }
    } else {
      addToast('Product Deleted', `"${prod?.name || 'Product'}" removed.`, 'info');
    }
  };

  const handleToggleProductStatus = async (id: string) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const nextStatus = target.status === 'published' ? 'draft' : 'published';

    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));

    if (isSupabaseConfigured && !id.startsWith('prod-')) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const { error } = await supabase.from('products').update({ status: nextStatus }).eq('id', id);
          if (error) {
            if (error.code === '42501' || error.message?.includes('row-level security')) {
              addToast('Status Updated in Session', `Product "${target.name}" is now ${nextStatus}.`, 'info');
              return;
            }
          }
        }
      } catch (err: any) {
        // Handled in local state
      }
    }
    addToast('Status Updated', `Product "${target.name}" is now ${nextStatus === 'published' ? 'published on website' : 'draft'}.`, 'info');
  };

  // ==========================================
  // Services CRUD
  // ==========================================
  const handleSaveService = async (srv: CleaningService) => {
    setServices(prev => {
      const exists = prev.some(s => s.id === srv.id);
      return exists ? prev.map(s => s.id === srv.id ? srv : s) : [srv, ...prev];
    });

    if (!isSupabaseConfigured) {
      addToast('Service Saved', `"${srv.name}" and inclusions updated.`, 'success');
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasAuth = Boolean(sessionData?.session?.user);

      if (!hasAuth) {
        addToast(
          'Saved in Session',
          `Service "${srv.name}" saved in session. Sign in with admin credentials to sync directly to live services.`,
          'info'
        );
        return;
      }

      const payload = mapServiceToDb(srv);
      const isDbId = srv.id && !srv.id.startsWith('srv-');
      if (isDbId) {
        payload.id = srv.id;
      }
      const { data, error } = await supabase.from('services').upsert(payload).select().single();
      if (error) {
        if (error.code === '42501' || error.message?.includes('row-level security')) {
          addToast(
            'Saved in Session (RLS Notice)',
            `Service "${srv.name}" saved in session. Your Supabase role requires an INSERT/UPDATE policy on "services".`,
            'info'
          );
          return;
        }
        addToast('Saved in Session', `DB response: ${error.message}`, 'info');
        return;
      }

      const savedSrv = data ? mapDbToService(data) : srv;
      setServices(prev => {
        const exists = prev.some(s => s.id === savedSrv.id || s.id === srv.id);
        return exists ? prev.map(s => (s.id === savedSrv.id || s.id === srv.id) ? savedSrv : s) : [savedSrv, ...prev];
      });
      addToast('Saved to Supabase', `Service "${savedSrv.name}" saved in database.`, 'success');
    } catch (err: any) {
      addToast('Service Saved', `"${srv.name}" updated in session.`, 'info');
    }
  };

  const handleDeleteService = async (id: string) => {
    const srv = services.find(s => s.id === id);
    setServices(prev => prev.filter(s => s.id !== id));

    if (isSupabaseConfigured && !id.startsWith('srv-')) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user) {
          addToast('Removed from Session', `"${srv?.name || 'Service'}" removed in session.`, 'info');
          return;
        }

        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) {
          if (error.code === '42501' || error.message?.includes('row-level security')) {
            addToast('Removed from Session', `"${srv?.name || 'Service'}" removed in session.`, 'info');
            return;
          }
          addToast('Delete Notice', `Removed in session. DB notice: ${error.message}`, 'info');
          return;
        }
        addToast('Deleted from Supabase', `"${srv?.name || 'Service'}" removed from database.`, 'info');
      } catch (err: any) {
        addToast('Service Removed', `"${srv?.name || 'Service'}" removed in session.`, 'info');
      }
    } else {
      addToast('Service Deleted', `"${srv?.name || 'Service'}" removed.`, 'info');
    }
  };

  const handleToggleServiceStatus = async (id: string) => {
    const target = services.find(s => s.id === id);
    if (!target) return;
    const nextStatus = target.status === 'published' ? 'draft' : 'published';

    setServices(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus } : s));

    if (isSupabaseConfigured && !id.startsWith('srv-')) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const { error } = await supabase.from('services').update({ status: nextStatus }).eq('id', id);
          if (error) {
            if (error.code === '42501' || error.message?.includes('row-level security')) {
              addToast('Status Updated in Session', `Service "${target.name}" is now ${nextStatus}.`, 'info');
              return;
            }
          }
        }
      } catch (err: any) {
        // Handled in local state
      }
    }
    addToast('Status Updated', `Service "${target.name}" is now ${nextStatus === 'published' ? 'published on website' : 'draft'}.`, 'info');
  };

  // ==========================================
  // Results CRUD
  // ==========================================
  const handleSaveResult = async (res: ResultItem) => {
    setResults(prev => {
      const exists = prev.some(r => r.id === res.id);
      return exists ? prev.map(r => r.id === res.id ? res : r) : [res, ...prev];
    });

    if (!isSupabaseConfigured) {
      addToast('Transformation Saved', `"${res.title}" saved with before & after assets.`, 'success');
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasAuth = Boolean(sessionData?.session?.user);

      if (!hasAuth) {
        addToast(
          'Saved in Session',
          `Result "${res.title}" saved in session. Sign in with admin credentials to sync directly to live gallery.`,
          'info'
        );
        return;
      }

      const payload = mapResultToDb(res);
      const isDbId = res.id && !res.id.startsWith('res-');
      if (isDbId) {
        payload.id = res.id;
      }
      const { data, error } = await supabase.from('results').upsert(payload).select().single();
      if (error) {
        if (error.code === '42501' || error.message?.includes('row-level security')) {
          addToast(
            'Saved in Session (RLS Notice)',
            `Result "${res.title}" saved in session. Your Supabase role requires an INSERT/UPDATE policy on "results".`,
            'info'
          );
          return;
        }
        addToast('Saved in Session', `DB response: ${error.message}`, 'info');
        return;
      }

      const savedRes = data ? mapDbToResult(data) : res;
      setResults(prev => {
        const exists = prev.some(r => r.id === savedRes.id || r.id === res.id);
        return exists ? prev.map(r => (r.id === savedRes.id || r.id === res.id) ? savedRes : r) : [savedRes, ...prev];
      });
      addToast('Saved to Supabase', `Result "${savedRes.title}" updated with before/after imagery.`, 'success');
    } catch (err: any) {
      addToast('Transformation Saved', `"${res.title}" saved in session.`, 'info');
    }
  };

  const handleDeleteResult = async (id: string) => {
    const res = results.find(r => r.id === id);
    setResults(prev => prev.filter(r => r.id !== id));

    if (isSupabaseConfigured && !id.startsWith('res-')) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user) {
          addToast('Removed from Session', `"${res?.title || 'Transformation'}" removed in session.`, 'info');
          return;
        }

        const { error } = await supabase.from('results').delete().eq('id', id);
        if (error) {
          if (error.code === '42501' || error.message?.includes('row-level security')) {
            addToast('Removed from Session', `"${res?.title || 'Transformation'}" removed in session.`, 'info');
            return;
          }
          addToast('Delete Notice', `Removed in session. DB notice: ${error.message}`, 'info');
          return;
        }
        addToast('Deleted from Supabase', `"${res?.title || 'Transformation'}" removed from database.`, 'info');
      } catch (err: any) {
        addToast('Result Removed', `"${res?.title || 'Transformation'}" removed in session.`, 'info');
      }
    } else {
      addToast('Result Deleted', `"${res?.title || 'Transformation'}" removed.`, 'info');
    }
  };

  const handleToggleResultStatus = async (id: string) => {
    const target = results.find(r => r.id === id);
    if (!target) return;
    const nextStatus = target.status === 'published' ? 'draft' : 'published';

    setResults(prev => prev.map(r => r.id === id ? { ...r, status: nextStatus } : r));

    if (isSupabaseConfigured && !id.startsWith('res-')) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const { error } = await supabase.from('results').update({ status: nextStatus }).eq('id', id);
          if (error) {
            if (error.code === '42501' || error.message?.includes('row-level security')) {
              addToast('Status Updated in Session', `"${target.title}" is now ${nextStatus}.`, 'info');
              return;
            }
          }
        }
      } catch (err: any) {
        // Handled in local state
      }
    }
    addToast('Visibility Changed', `"${target.title}" is now ${nextStatus === 'published' ? 'live on website' : 'draft'}.`, 'info');
  };

  // Settings
  const handleUpdateSettings = (newSettings: AdminSettings) => {
    setSettings(newSettings);
    addToast('Settings Updated', 'Business identity & admin preferences saved.', 'success');
  };

  // ==========================================
  // Render: Loading Screen
  // ==========================================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#E31B23]/20 border-t-[#E31B23] rounded-full animate-spin mb-3" />
        <p className="text-xs font-bold text-[#171717]">Connecting Devil Cleanerz Portal...</p>
      </div>
    );
  }

  // ==========================================
  // Render: Customer Public Website Preview
  // ==========================================
  if (isPublicPreview) {
    return (
      <PublicWebsitePreview
        packages={packages}
        products={products}
        services={services}
        results={results}
        settings={settings}
        onBackToAdmin={() => setIsPublicPreview(false)}
      />
    );
  }

  // ==========================================
  // Render: Admin Authentication Gate
  // ==========================================
  if (!isAuthenticated) {
    return (
      <>
        <AdminLogin
          onLoginSuccess={(user) => {
            setIsAuthenticated(true);
            setCurrentUser(user);
            addToast('Welcome Admin', `Signed in as ${user.email}`, 'success');
          }}
          onContinueOfflineDemo={() => {
            setIsAuthenticated(true);
            addToast('Preview Session', 'Proceeding in local browser preview mode.', 'info');
          }}
        />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  // ==========================================
  // Render: Admin Panel Main View
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#171717] flex">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        counts={{
          packages: packages.length,
          products: products.length,
          services: services.length,
          results: results.length
        }}
        isLiveConnected={isLiveConnected}
        isLoading={dataLoading}
        onOpenPublicPreview={() => setIsPublicPreview(true)}
      />

      {/* Main Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <TopNavbar
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          settings={settings}
          onNavigate={setCurrentTab}
          onResetDemoData={handleResetDemoData}
          isLiveConnected={isLiveConnected}
          isLoading={dataLoading}
          connectionError={connectionError}
          onLogout={handleLogout}
          onOpenPublicPreview={() => setIsPublicPreview(true)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardOverview
              packages={packages}
              products={products}
              services={services}
              results={results}
              onNavigate={setCurrentTab}
              onOpenAddPackage={() => setCurrentTab('packages')}
              onOpenAddProduct={() => setCurrentTab('products')}
              onOpenAddService={() => setCurrentTab('services')}
              onOpenAddResult={() => setCurrentTab('results')}
              isLoading={dataLoading}
              connectionError={connectionError}
              isLiveConnected={isLiveConnected}
              onRetryConnection={loadSupabaseData}
            />
          )}

          {currentTab === 'packages' && (
            <PackagesManagement
              packages={packages}
              onSavePackage={handleSavePackage}
              onDeletePackage={handleDeletePackage}
              onToggleStatus={handleTogglePackageStatus}
            />
          )}

          {currentTab === 'products' && (
            <ProductsManagement
              products={products}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
              onToggleStatus={handleToggleProductStatus}
            />
          )}

          {currentTab === 'services' && (
            <ServicesManagement
              services={services}
              onSaveService={handleSaveService}
              onDeleteService={handleDeleteService}
              onToggleStatus={handleToggleServiceStatus}
            />
          )}

          {currentTab === 'results' && (
            <ResultsGalleryManagement
              results={results}
              onSaveResult={handleSaveResult}
              onDeleteResult={handleDeleteResult}
              onToggleStatus={handleToggleResultStatus}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsManagement
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
