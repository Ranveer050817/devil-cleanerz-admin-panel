import React, { useState } from 'react';
import { 
  Flame, 
  Check, 
  MapPin, 
  Calendar, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeftRight, 
  ShoppingBag, 
  Sparkles, 
  Package, 
  X,
  ExternalLink,
  ChevronRight,
  Clock
} from 'lucide-react';
import { CleaningPackage, CleaningProduct, CleaningService, ResultItem, AdminSettings } from '../../types';

interface PublicWebsitePreviewProps {
  packages: CleaningPackage[];
  products: CleaningProduct[];
  services: CleaningService[];
  results: ResultItem[];
  settings: AdminSettings;
  onBackToAdmin: () => void;
}

export const PublicWebsitePreview: React.FC<PublicWebsitePreviewProps> = ({
  packages,
  products,
  services,
  results,
  settings,
  onBackToAdmin
}) => {
  // Only show PUBLISHED items on the public website
  const publishedPackages = packages.filter(p => p.status === 'published').sort((a, b) => a.displayOrder - b.displayOrder);
  const publishedProducts = products.filter(p => p.status === 'published').sort((a, b) => a.displayOrder - b.displayOrder);
  const publishedServices = services.filter(s => s.status === 'published').sort((a, b) => a.displayOrder - b.displayOrder);
  const publishedResults = results.filter(r => r.status === 'published').sort((a, b) => a.displayOrder - b.displayOrder);

  // Active section filter or slider
  const [selectedResult, setSelectedResult] = useState<ResultItem | null>(null);
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="bg-[#FFFFFF] text-[#171717] min-h-screen flex flex-col font-sans">
      {/* Top Banner Notice */}
      <div className="bg-[#171717] text-white px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold">Public Customer Website Preview</span>
          <span className="text-gray-400 hidden sm:inline">• Live sync with published Supabase records</span>
        </div>
        <button
          onClick={onBackToAdmin}
          className="px-3 py-1 bg-[#E31B23] hover:bg-[#c9151c] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
        >
          ← Return to Admin Panel
        </button>
      </div>

      {/* Website Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E31B23] flex items-center justify-center text-white shadow-xs font-black">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-[#171717] leading-none">
              {settings.businessName}
            </h1>
            <p className="text-[10px] text-[#666666] font-medium tracking-wide mt-0.5">
              {settings.tagline}
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#666666]">
          <a href="#packages" className="hover:text-[#E31B23] transition-colors">Packages</a>
          <a href="#services" className="hover:text-[#E31B23] transition-colors">Services</a>
          <a href="#results" className="hover:text-[#E31B23] transition-colors">Results Gallery</a>
          <a href="#products" className="hover:text-[#E31B23] transition-colors">Pro Chemicals</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${settings.adminPhone}`}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#171717] bg-[#F7F7F7] border border-[#EAEAEA] rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>{settings.adminPhone}</span>
          </a>
          <a
            href="#packages"
            className="px-4 py-2 text-xs font-bold text-white bg-[#E31B23] hover:bg-[#c9151c] rounded-xl shadow-xs transition-colors"
          >
            Book Deep Clean
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F7F7F7] to-white py-14 sm:py-20 px-4 sm:px-8 border-b border-[#EAEAEA]">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#E31B23] text-xs font-bold border border-red-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ISO Certified Mechanized Cleaning Protocols</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-tight">
            Restoring Spaces to <span className="text-[#E31B23]">Showroom Perfection</span>
          </h2>
          <p className="text-sm sm:text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Professional residential deep cleaning, commercial kitchen degreasing, and industrial facility sanitization across India.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#packages"
              className="px-6 py-3 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Explore Packages &amp; Rates</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#results"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-[#171717] border border-[#EAEAEA] text-xs font-bold rounded-xl transition-all"
            >
              See Real Before &amp; Afters
            </a>
          </div>
        </div>
      </section>

      {/* 1. Results Gallery Section */}
      <section id="results" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#EAEAEA] gap-4">
          <div>
            <span className="text-xs font-bold text-[#E31B23] tracking-wider uppercase">
              Proven Transformations
            </span>
            <h3 className="text-2xl font-black text-[#171717] mt-1">
              Real Cleaning Results &amp; Comparisons
            </h3>
            <p className="text-xs text-[#666666] mt-1">
              Interactive dual-view comparisons of genuine cleaning projects executed by our specialized crews
            </p>
          </div>
          <span className="text-xs font-bold text-gray-500 font-mono">
            {publishedResults.length} Projects Live
          </span>
        </div>

        {publishedResults.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-gray-200 rounded-2xl text-xs text-gray-400">
            No published results currently live. Publish records from the Admin Panel to display them here.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {publishedResults.map((result) => (
              <div 
                key={result.id}
                className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-xs hover:border-gray-300 transition-all flex flex-col group"
              >
                {/* Side-by-side images */}
                <div className="grid grid-cols-2 bg-gray-900 border-b border-[#EAEAEA] divide-x divide-white/20">
                  <div className="relative aspect-4/3 bg-stone-900">
                    <img
                      src={result.beforeImageUrl}
                      alt={`Before - ${result.title}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white shadow-xs">
                      BEFORE
                    </span>
                  </div>

                  <div className="relative aspect-4/3 bg-sky-950">
                    <img
                      src={result.afterImageUrl}
                      alt={`After - ${result.title}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                      AFTER
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#E31B23] uppercase">{result.category}</span>
                      <span className="flex items-center gap-1 text-gray-500 font-mono">
                        <Calendar className="w-3 h-3" />
                        {result.completionDate}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#171717]">{result.title}</h4>
                    <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">{result.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
                    <span className="text-xs text-[#666666] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {result.location}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedResult(result);
                        setSliderPos(50);
                      }}
                      className="px-3 py-1.5 bg-[#F7F7F7] hover:bg-gray-100 text-[#171717] text-xs font-bold rounded-lg border border-[#EAEAEA] flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#E31B23]" />
                      Interactive Slider
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Packages Section */}
      <section id="packages" className="py-16 px-4 sm:px-8 bg-[#F7F7F7] border-y border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#E31B23] tracking-wider uppercase">
              Transparent Pricing
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#171717] mt-1">
              Residential Cleaning Packages
            </h3>
            <p className="text-xs text-[#666666] mt-2">
              Fixed rate deep cleaning packages covering bedrooms, hall, kitchen, and washrooms with mechanized buffing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-xs hover:border-[#E31B23] transition-all flex flex-col group"
              >
                <div className="aspect-16/10 bg-gray-50 overflow-hidden border-b border-[#EAEAEA]">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#171717]">{pkg.name}</h4>
                    <p className="text-xs text-[#666666] mt-2 leading-relaxed">{pkg.description}</p>

                    <div className="mt-5 pt-4 border-t border-[#EAEAEA]">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                        Inclusions
                      </p>
                      <ul className="space-y-2">
                        {pkg.includedServices.map((inc, i) => (
                          <li key={i} className="text-xs text-[#171717] flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#EAEAEA] flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">All Inclusive Rate</span>
                      <span className="text-xl font-black text-[#E31B23] tabular-nums">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer">
                      Select Package
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#E31B23] tracking-wider uppercase">
            Specialized Care
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#171717] mt-1">
            Complete Cleaning Services Portfolio
          </h3>
          <p className="text-xs text-[#666666] mt-2">
            Tailored services executed by trained technicians with specialized chemical solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#E31B23] uppercase">{srv.category}</span>
                <h4 className="text-sm font-bold text-[#171717] mt-1">{srv.name}</h4>
                <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">{srv.description}</p>

                <div className="mt-4 pt-3 border-t border-[#EAEAEA]">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Scope of work
                  </p>
                  <ul className="space-y-1.5">
                    {srv.inclusions.map((item, idx) => (
                      <li key={idx} className="text-xs text-[#171717] flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Inclusions: {srv.inclusions.length} tasks</span>
                <button className="text-xs font-bold text-[#E31B23] hover:underline flex items-center gap-1 cursor-pointer">
                  Inquire Service <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Products Section */}
      <section id="products" className="py-16 px-4 sm:px-8 bg-[#F7F7F7] border-t border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#EAEAEA] gap-4">
            <div>
              <span className="text-xs font-bold text-[#E31B23] tracking-wider uppercase">
                Pro Chemical Formulations
              </span>
              <h3 className="text-2xl font-black text-[#171717] mt-1">
                Devil Cleanerz Chemical Catalog
              </h3>
              <p className="text-xs text-[#666666] mt-1">
                Industrial grade degreasers, descalers, glass polish, and hospital disinfectants
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {publishedProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between p-4 group"
              >
                <div>
                  <div className="aspect-square bg-[#F7F7F7] rounded-xl p-3 flex items-center justify-center mb-3">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#E31B23] uppercase">{prod.category}</span>
                  <h4 className="text-xs font-bold text-[#171717] mt-1 line-clamp-1">{prod.name}</h4>
                  <p className="text-[11px] text-[#666666] mt-1 line-clamp-2 leading-relaxed">{prod.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#171717] tabular-nums">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </span>
                  <button className="px-3 py-1.5 bg-[#171717] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">
                    Order Supply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Website Footer */}
      <footer className="bg-white border-t border-[#EAEAEA] py-10 px-4 sm:px-8 text-center text-xs text-[#666666]">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-bold text-[#171717]">
            {settings.businessName} • {settings.tagline}
          </p>
          <p className="text-[11px]">
            Official Support: {settings.adminEmail} • Direct Helpline: {settings.adminPhone}
          </p>
          <p className="text-[10px] text-gray-400">
            Powered by Supabase Real-Time Backend &amp; Devil Cleanerz Executive Portal.
          </p>
        </div>
      </footer>

      {/* Interactive Slider Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#EAEAEA] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#171717]">{selectedResult.title}</h4>
                <p className="text-xs text-[#666666]">{selectedResult.location}</p>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-1 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden select-none bg-black">
                <img
                  src={selectedResult.afterImageUrl}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded text-xs font-black bg-emerald-600 text-white shadow-md">
                  AFTER CLEANING
                </span>

                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={selectedResult.beforeImageUrl}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded text-xs font-black bg-red-600 text-white shadow-md">
                    BEFORE CLEANING
                  </span>
                </div>

                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-300 flex items-center justify-center text-gray-800">
                    <ArrowLeftRight className="w-4 h-4 text-[#E31B23]" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="w-full accent-[#E31B23] cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#EAEAEA] bg-gray-50 flex items-center justify-end">
              <button
                onClick={() => setSelectedResult(null)}
                className="px-4 py-2 bg-[#171717] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
