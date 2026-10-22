import React from 'react';
import { 
  Menu, 
  ChevronRight, 
  Database
} from 'lucide-react';
import { TabType, AdminSettings } from '../../types';

interface TopNavbarProps {
  currentTab: TabType;
  onOpenMobileMenu: () => void;
  settings: AdminSettings;
  onNavigate: (tab: TabType) => void;
  onResetDemoData?: () => void;
  isLiveConnected?: boolean;
  isLoading?: boolean;
  connectionError?: string | null;
  onLogout?: () => void;
  onOpenPublicPreview?: () => void;
}

const tabTitles: Record<TabType, string> = {
  dashboard: 'Executive Dashboard',
  packages: 'Cleaning Packages',
  products: 'Chemical & Cleaning Products',
  services: 'Service Portfolio & Inclusions',
  results: 'Before & After Results Gallery',
  settings: 'Business & Brand Settings'
};

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onOpenMobileMenu,
  onNavigate,
  isLiveConnected = false,
  isLoading = false,
  connectionError = null
}) => {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[#EAEAEA] h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-[#666666]">
          <span className="hidden sm:inline hover:text-[#171717] cursor-pointer" onClick={() => onNavigate('dashboard')}>
            Devil Cleanerz
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
          <span className="font-semibold text-[#171717] text-sm">
            {tabTitles[currentTab]}
          </span>
        </div>
      </div>

      {/* Right: Actions, Stage notice & Status */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Supabase Status Indicator - Only shows Supabase Live if real check succeeds */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
          isLiveConnected 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isLoading
            ? 'bg-blue-50 text-blue-800 border-blue-200'
            : connectionError
            ? 'bg-red-50 text-red-800 border-red-200'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          <Database className={`w-3.5 h-3.5 ${
            isLiveConnected ? 'text-emerald-600' : isLoading ? 'text-blue-600 animate-spin' : connectionError ? 'text-red-600' : 'text-amber-600'
          }`} />
          <span>
            {isLiveConnected 
              ? 'Supabase Live' 
              : isLoading 
              ? 'Connecting...' 
              : connectionError 
              ? 'Supabase Error' 
              : 'Demo State'}
          </span>
        </div>
      </div>
    </header>
  );
};

