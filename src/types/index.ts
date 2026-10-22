export type TabType = 'dashboard' | 'packages' | 'products' | 'services' | 'results' | 'settings';

export type StatusType = 'published' | 'draft';

export interface CleaningPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  includedServices: string[];
  displayOrder: number;
  status: StatusType;
  createdAt: string;
}

export interface CleaningProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  category: string;
  displayOrder: number;
  status: StatusType;
  createdAt: string;
}

export interface CleaningService {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  inclusions: string[];
  displayOrder: number;
  status: StatusType;
  createdAt: string;
}

export interface ResultItem {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  additionalImages?: string[];
  completionDate: string;
  displayOrder: number;
  status: StatusType;
  createdAt: string;
}

export interface AdminSettings {
  businessName: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
  primaryBg: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminRole: string;
  currency: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
