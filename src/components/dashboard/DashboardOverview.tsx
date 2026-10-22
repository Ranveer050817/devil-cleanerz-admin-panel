import React from 'react';
import { 
  Package, 
  ShoppingBag, 
  Sparkles, 
  SplitSquareVertical, 
  Plus, 
  ArrowUpRight, 
  MapPin, 
  Calendar, 
  Eye, 
  Info,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Database,
  ExternalLink,
  Layers
} from 'lucide-react';
import { 
  CleaningPackage, 
  CleaningProduct, 
  CleaningService, 
  ResultItem, 
  TabType 
} from '../../types';

interface DashboardOverviewProps {
  packages: CleaningPackage[];
  products: CleaningProduct[];
  services: CleaningService[];
  results: ResultItem[];
  onNavigate: (tab: TabType) => void;
  onOpenAddPackage: () => void;
  onOpenAddProduct: () => void;
  onOpenAddService: () => void;
  onOpenAddResult: () => void;
  isLoading?: boolean;
  connectionError?: string | null;
  isLiveConnected?: boolean;
  onRetryConnection?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  packages,
  products,
  services,
  results,
  onNavigate,
  onOpenAddPackage,
  onOpenAddProduct,
  onOpenAddService,
  onOpenAddResult,
  isLoading = false,
  connectionError = null,
  isLiveConnected = false,
  onRetryConnection
}) => {
  const publishedPackagesCount = packages.filter(p => p.status === 'published').length;
  const publishedProductsCount = products.filter(p => p.status === 'published').length;
  const publishedServicesCount = services.filter(s => s.status === 'published').length;
  const publishedResultsCount = results.filter(r => r.status === 'published').length;

  const statCards = [
    {
      title: 'Total Packages',
      count: packages.length,
      subtitle: `${publishedPackagesCount} Published on site`,
      icon: <Package className="w-5 h-5 text-[#E31B23]" />,
      targetTab: 'packages' as TabType,
      action: onOpenAddPackage,
      actionLabel: 'Add Package',
      tableName: 'packages'
    },
    {
      title: 'Total Products',
      count: products.length,
      subtitle: `${publishedProductsCount} In chemical catalog`,
      icon: <ShoppingBag className="w-5 h-5 text-[#E31B23]" />,
      targetTab: 'products' as TabType,
      action: onOpenAddProduct,
      actionLabel: 'Add Product',
      tableName: 'products'
    },
    {
      title: 'Total Services',
      count: services.length,
      subtitle: `${publishedServicesCount} Standard & commercial`,
      icon: <Sparkles className="w-5 h-5 text-[#E31B23]" />,
      targetTab: 'services' as TabType,
      action: onOpenAddService,
      actionLabel: 'Add Service',
      tableName: 'services'
    },
    {
      title: 'Published Results',
      count: publishedResultsCount,
      subtitle: `${results.length} Total before/after cases`,
      icon: <SplitSquareVertical className="w-5 h-5 text-[#E31B23]" />,
      targetTab: 'results' as TabType,
      action: onOpenAddResult,
      actionLabel: 'Add Result',
      tableName: 'results'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Connection Error Alert Banner (if Supabase queries fail) */}
      {connectionError ? (
        <div className="bg-red-50/90 border border-red-200 rounded-2xl p-4 sm:p-5 shadow-xs animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-100 text-[#E31B23] shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#171717]">
                    Supabase Database Connection Issue
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-200/60 text-[#E31B23]">
                    Disconnected
                  </span>
                </div>
                <p className="text-xs text-[#666666] mt-1 leading-relaxed max-w-2xl">
                  {connectionError}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Ensure your tables exist in Supabase and your publishable/anon key has read permissions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
              {onRetryConnection && (
                <button
                  onClick={onRetryConnection}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-[#171717] hover:bg-black rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry Connection
                </button>
              )}
              <button
                onClick={() => onNavigate('settings')}
                className="px-3.5 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      ) : isLiveConnected ? (
        /* 2. Supabase Live Connected Status Banner */
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#171717]">
                  Connected to Live Supabase Database
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  LIVE SYNC
                </span>
              </div>
              <p className="text-xs text-[#666666] mt-0.5 leading-relaxed max-w-2xl">
                All metrics and listings are loaded directly from your Supabase tables (<code className="font-mono text-gray-800">packages</code>, <code className="font-mono text-gray-800">products</code>, <code className="font-mono text-gray-800">services</code>, <code className="font-mono text-gray-800">results</code>).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            {onRetryConnection && (
              <button
                onClick={onRetryConnection}
                disabled={isLoading}
                className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-[#F7F7F7] hover:bg-gray-100 border border-[#EAEAEA] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Refresh database records"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('results')}
              className="px-4 py-2 text-xs font-bold text-white bg-[#E31B23] hover:bg-[#c9151c] rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              Results Gallery
            </button>
          </div>
        </div>
      ) : isLoading ? (
        /* Loading Banner */
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4 sm:p-5 flex items-center gap-3 shadow-xs">
          <div className="w-5 h-5 border-2 border-[#E31B23]/30 border-t-[#E31B23] rounded-full animate-spin shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-[#171717]">Querying Supabase Database...</h3>
            <p className="text-xs text-[#666666] mt-0.5">Fetching live packages, products, services, and results counts.</p>
          </div>
        </div>
      ) : (
        /* 3. Credentials Unset Notice */
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 shrink-0 mt-0.5">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171717]">
                Supabase Credentials Not Yet Detected
              </h3>
              <p className="text-xs text-[#666666] mt-0.5 leading-relaxed max-w-2xl">
                Provide <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono text-[11px]">VITE_SUPABASE_URL</code> and <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono text-[11px]">VITE_SUPABASE_PUBLISHABLE_KEY</code> in environment variables or Settings to sync directly with your database.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#171717] hover:bg-black rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Configure Credentials
          </button>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#666666] tracking-tight">{stat.title}</span>
              <div className="p-2 rounded-xl bg-red-50/70 border border-red-100 group-hover:bg-red-50 transition-colors">
                {stat.icon}
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between min-h-[36px]">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-lg" />
              ) : (
                <span className="text-3xl font-extrabold text-[#171717] tabular-nums tracking-tight">
                  {stat.count}
                </span>
              )}
              <button
                onClick={() => onNavigate(stat.targetTab)}
                className="text-xs font-semibold text-gray-400 group-hover:text-[#E31B23] flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                Manage
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {isLoading ? (
              <div className="h-3.5 w-24 bg-gray-100 animate-pulse rounded mt-2" />
            ) : (
              <p className="text-xs text-[#666666] mt-1 font-medium">{stat.subtitle}</p>
            )}

            <div className="mt-4 pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
              <button
                onClick={stat.action}
                className="text-xs font-semibold text-[#E31B23] hover:text-[#991b1b] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {stat.actionLabel}
              </button>
              <span className="text-[10px] text-gray-400 font-mono">
                {isLiveConnected ? `table: ${stat.tableName}` : 'Supabase table'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Row */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Quick Actions
          </h3>
          <span className="text-[11px] text-[#666666]">Direct Content Creation</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={onOpenAddPackage}
            className="p-3 bg-[#F7F7F7] hover:bg-red-50/40 border border-[#EAEAEA] hover:border-[#E31B23]/40 rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <Package className="w-4 h-4 text-[#E31B23]" />
              <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E31B23]" />
            </div>
            <p className="text-xs font-bold text-[#171717] mt-2 group-hover:text-[#E31B23] transition-colors">
              Add Package
            </p>
            <p className="text-[11px] text-[#666666] mt-0.5">1-4 BHK or Move-in</p>
          </button>

          <button
            onClick={onOpenAddProduct}
            className="p-3 bg-[#F7F7F7] hover:bg-red-50/40 border border-[#EAEAEA] hover:border-[#E31B23]/40 rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <ShoppingBag className="w-4 h-4 text-[#E31B23]" />
              <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E31B23]" />
            </div>
            <p className="text-xs font-bold text-[#171717] mt-2 group-hover:text-[#E31B23] transition-colors">
              Add Product
            </p>
            <p className="text-[11px] text-[#666666] mt-0.5">Degreaser, Polish, Kits</p>
          </button>

          <button
            onClick={onOpenAddService}
            className="p-3 bg-[#F7F7F7] hover:bg-red-50/40 border border-[#EAEAEA] hover:border-[#E31B23]/40 rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-4 h-4 text-[#E31B23]" />
              <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E31B23]" />
            </div>
            <p className="text-xs font-bold text-[#171717] mt-2 group-hover:text-[#E31B23] transition-colors">
              Add Service
            </p>
            <p className="text-[11px] text-[#666666] mt-0.5">With dynamic inclusions</p>
          </button>

          <button
            onClick={onOpenAddResult}
            className="p-3 bg-[#F7F7F7] hover:bg-red-50/40 border border-[#EAEAEA] hover:border-[#E31B23]/40 rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <SplitSquareVertical className="w-4 h-4 text-[#E31B23]" />
              <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E31B23]" />
            </div>
            <p className="text-xs font-bold text-[#171717] mt-2 group-hover:text-[#E31B23] transition-colors">
              Add Result
            </p>
            <p className="text-[11px] text-[#666666] mt-0.5">Before &amp; After Showcase</p>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent Results & Recent Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results Spotlight */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
            <div>
              <h3 className="text-sm font-bold text-[#171717]">
                Featured Cleaning Transformations
              </h3>
              <p className="text-xs text-[#666666]">Real before-and-after project comparisons</p>
            </div>
            <button
              onClick={() => onNavigate('results')}
              className="text-xs font-semibold text-[#E31B23] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All ({results.length})
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#EAEAEA] flex-1">
            {isLoading ? (
              <div className="py-8 space-y-3">
                <div className="h-12 bg-gray-100 animate-pulse rounded-xl" />
                <div className="h-12 bg-gray-100 animate-pulse rounded-xl" />
              </div>
            ) : results.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#E31B23] mb-2">
                  <SplitSquareVertical className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#171717]">No transformation results recorded yet</p>
                <p className="text-[11px] text-[#666666] mt-0.5 max-w-xs">
                  Your Supabase results table is currently empty.
                </p>
                <button
                  onClick={onOpenAddResult}
                  className="mt-3 px-3 py-1.5 bg-[#E31B23] text-white text-xs font-bold rounded-lg hover:bg-[#c9151c] transition-colors cursor-pointer"
                >
                  Add First Result
                </button>
              </div>
            ) : (
              results.slice(0, 3).map((result) => (
                <div key={result.id} className="py-3.5 flex items-center gap-3 group">
                  <div className="flex -space-x-2 shrink-0">
                    <div className="w-12 h-12 rounded-lg border-2 border-white overflow-hidden shadow-xs bg-gray-100">
                      <img
                        src={result.beforeImageUrl}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-12 h-12 rounded-lg border-2 border-white overflow-hidden shadow-xs bg-gray-100">
                      <img
                        src={result.afterImageUrl}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#171717] truncate group-hover:text-[#E31B23] transition-colors">
                        {result.title}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        result.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#666666] mt-1">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        {result.location}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {result.completionDate}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('results')}
                    className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    title="Inspect result"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Packages */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
            <div>
              <h3 className="text-sm font-bold text-[#171717]">
                Active Cleaning Packages
              </h3>
              <p className="text-xs text-[#666666]">Standard apartment &amp; villa cleaning rates</p>
            </div>
            <button
              onClick={() => onNavigate('packages')}
              className="text-xs font-semibold text-[#E31B23] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All ({packages.length})
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#EAEAEA] flex-1">
            {isLoading ? (
              <div className="py-8 space-y-3">
                <div className="h-12 bg-gray-100 animate-pulse rounded-xl" />
                <div className="h-12 bg-gray-100 animate-pulse rounded-xl" />
              </div>
            ) : packages.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#E31B23] mb-2">
                  <Package className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#171717]">No cleaning packages in database</p>
                <p className="text-[11px] text-[#666666] mt-0.5 max-w-xs">
                  Your Supabase packages table has 0 records.
                </p>
                <button
                  onClick={onOpenAddPackage}
                  className="mt-3 px-3 py-1.5 bg-[#E31B23] text-white text-xs font-bold rounded-lg hover:bg-[#c9151c] transition-colors cursor-pointer"
                >
                  Create First Package
                </button>
              </div>
            ) : (
              packages.slice(0, 4).map((pkg) => (
                <div key={pkg.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-[#EAEAEA] overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#171717] truncate">
                        {pkg.name}
                      </p>
                      <p className="text-[11px] text-[#666666] truncate mt-0.5">
                        {pkg.includedServices.length} Inclusions · Order #{pkg.displayOrder}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-extrabold text-[#171717] tabular-nums">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </p>
                    <span className={`text-[10px] font-semibold ${
                      pkg.status === 'published' ? 'text-emerald-700' : 'text-gray-500'
                    }`}>
                      {pkg.status === 'published' ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Products & Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
            <div>
              <h3 className="text-sm font-bold text-[#171717]">
                Chemical &amp; Cleaning Products
              </h3>
              <p className="text-xs text-[#666666]">Degreasers, sanitizers and buffing kits</p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-semibold text-[#E31B23] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Catalog ({products.length})
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#EAEAEA]">
            {isLoading ? (
              <div className="py-8 space-y-3">
                <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
                <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <p className="text-xs font-bold text-[#171717]">No products in database</p>
                <p className="text-[11px] text-[#666666] mt-0.5">Your Supabase products table has 0 records.</p>
                <button
                  onClick={onOpenAddProduct}
                  className="mt-3 px-3 py-1.5 bg-[#E31B23] text-white text-xs font-bold rounded-lg hover:bg-[#c9151c] transition-colors cursor-pointer"
                >
                  Add First Product
                </button>
              </div>
            ) : (
              products.slice(0, 3).map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-[#EAEAEA] overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#171717] truncate">{prod.name}</p>
                      <p className="text-[11px] text-[#666666] truncate mt-0.5">
                        {prod.category} · Priority #{prod.displayOrder}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-extrabold text-[#171717] tabular-nums">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {prod.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Services */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
            <div>
              <h3 className="text-sm font-bold text-[#171717]">
                Specialized Cleaning Services
              </h3>
              <p className="text-xs text-[#666666]">Residential, commercial, and hospitality solutions</p>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="text-xs font-semibold text-[#E31B23] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Services ({services.length})
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#EAEAEA]">
            {isLoading ? (
              <div className="py-8 space-y-3">
                <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
                <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
              </div>
            ) : services.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <p className="text-xs font-bold text-[#171717]">No services in database</p>
                <p className="text-[11px] text-[#666666] mt-0.5">Your Supabase services table has 0 records.</p>
                <button
                  onClick={onOpenAddService}
                  className="mt-3 px-3 py-1.5 bg-[#E31B23] text-white text-xs font-bold rounded-lg hover:bg-[#c9151c] transition-colors cursor-pointer"
                >
                  Add First Service
                </button>
              </div>
            ) : (
              services.slice(0, 3).map((srv) => (
                <div key={srv.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-red-50/50 border border-red-100 overflow-hidden shrink-0 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#E31B23]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#171717] truncate">{srv.name}</p>
                      <p className="text-[11px] text-[#666666] truncate mt-0.5">
                        {srv.category} · {srv.inclusions.length} Inclusions
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      srv.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {srv.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
