import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Sparkles, 
  SplitSquareVertical, 
  Settings, 
  X,
  ShieldCheck, 
  Flame,
  Globe,
  Database,
  ExternalLink
} from 'lucide-react';
import { TabType } from '../../types';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
  counts: {
    packages: number;
    products: number;
    services: number;
    results: number;
  };
  isLiveConnected?: boolean;
  isLoading?: boolean;
  onOpenPublicPreview?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  counts,
  isLiveConnected = false,
  isLoading = false,
  onOpenPublicPreview
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />
    },
    {
      id: 'packages',
      label: 'Packages',
      icon: <Package className="w-4 h-4 shrink-0" />,
      count: counts.packages
    },
    {
      id: 'products',
      label: 'Products',
      icon: <ShoppingBag className="w-4 h-4 shrink-0" />,
      count: counts.products
    },
    {
      id: 'services',
      label: 'Services',
      icon: <Sparkles className="w-4 h-4 shrink-0" />,
      count: counts.services
    },
    {
      id: 'results',
      label: 'Results Gallery',
      icon: <SplitSquareVertical className="w-4 h-4 shrink-0" />,
      count: counts.results
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4 shrink-0" />
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#EAEAEA]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#EAEAEA] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#E31B23] flex items-center justify-center text-white shadow-xs shrink-0 font-black">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-[#171717] leading-tight truncate">
              Devil Cleanerz
            </h1>
            <p className="text-[11px] font-medium text-[#666666] truncate">
              &amp; Enterprises Admin
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mode Tag */}
      <div className="px-5 py-2.5 bg-[#F7F7F7]/70 border-b border-[#EAEAEA]">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#666666] font-medium flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Executive Portal</span>
          </span>
          <span className={`font-bold text-[10px] tracking-wide px-1.5 py-0.5 rounded ${
            isLiveConnected ? 'bg-emerald-100 text-emerald-800' : isLoading ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-[#E31B23]'
          }`}>
            {isLiveConnected ? 'SUPABASE' : isLoading ? 'SYNCING...' : 'PREVIEW'}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Management
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#E31B23] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#171717] hover:bg-gray-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-[#666666]'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {typeof item.count === 'number' && (
                <span
                  className={`text-[11px] tabular-nums font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-[#666666]'
                  }`}
                >
                  {isLoading ? '...' : item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Public Website Preview Link */}
        {onOpenPublicPreview && (
          <div className="pt-4">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Live Customer View
            </div>
            <button
              onClick={() => {
                onOpenPublicPreview();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#171717] bg-gray-50 hover:bg-gray-100 transition-colors border border-[#EAEAEA] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#E31B23]" />
                <span>Public Website</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* Supabase Connection Details Notice */}
      <div className="p-4 border-t border-[#EAEAEA] bg-[#F7F7F7]/50">
        <div className="p-3 bg-white rounded-xl border border-[#EAEAEA] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#171717] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#E31B23]" />
              Supabase Storage
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-mono">
              4 Buckets
            </span>
          </div>
          <p className="text-[10px] text-[#666666] leading-snug">
            packages • services • results • products
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop & sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
