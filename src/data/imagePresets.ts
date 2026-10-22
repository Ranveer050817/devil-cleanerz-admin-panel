// Realistic high-quality SVG data-URIs representing cleaning transformations and services
// Guaranteed zero-broken images, fast hermetic rendering, crisp on retina displays

export const createCleaningSvg = (type: string, title: string, subtitle?: string, isBefore?: boolean): string => {
  const bgGradient = isBefore 
    ? 'linear-gradient(135deg, #78716c 0%, #44403c 100%)' 
    : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
  
  const accentColor = isBefore ? '#e7e5e4' : '#38bdf8';
  const badgeBg = isBefore ? '#ef4444' : '#10b981';
  const badgeText = isBefore ? 'BEFORE' : 'AFTER';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${isBefore ? '#57534e' : '#0369a1'}"/>
        <stop offset="100%" stop-color="${isBefore ? '#292524' : '#0f172a'}"/>
      </linearGradient>
      <linearGradient id="surface" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${isBefore ? '#78716c' : '#38bdf8'}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${isBefore ? '#44403c' : '#0284c7'}" stop-opacity="0.6"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bg)"/>
    
    <!-- Floor and Room Geometry -->
    <path d="M 0,420 L 800,420 L 800,600 L 0,600 Z" fill="${isBefore ? '#3d3835' : '#1e293b'}" />
    <path d="M 0,420 L 240,320 L 560,320 L 800,420 Z" fill="${isBefore ? '#44403c' : '#334155'}" opacity="0.4" />
    
    <!-- Tiles/Surface Lines -->
    <line x1="160" y1="420" x2="80" y2="600" stroke="${isBefore ? '#292524' : '#475569'}" stroke-width="2"/>
    <line x1="320" y1="420" x2="260" y2="600" stroke="${isBefore ? '#292524' : '#475569'}" stroke-width="2"/>
    <line x1="480" y1="420" x2="520" y2="600" stroke="${isBefore ? '#292524' : '#475569'}" stroke-width="2"/>
    <line x1="640" y1="420" x2="720" y2="600" stroke="${isBefore ? '#292524' : '#475569'}" stroke-width="2"/>

    <!-- Countertop / Main Fixture -->
    <rect x="180" y="240" width="440" height="150" rx="12" fill="url(#surface)" stroke="${accentColor}" stroke-width="2" stroke-opacity="0.4"/>
    
    ${isBefore ? `
      <!-- Dirt / Grease / Stains markings for BEFORE -->
      <circle cx="260" cy="280" r="28" fill="#1c1917" opacity="0.6" filter="blur(3px)" />
      <circle cx="480" cy="310" r="36" fill="#1c1917" opacity="0.7" filter="blur(4px)" />
      <circle cx="370" cy="270" r="22" fill="#292524" opacity="0.5" filter="blur(2px)" />
      <path d="M 220,340 Q 300,360 400,345 T 580,355" stroke="#1c1917" stroke-width="8" stroke-linecap="round" opacity="0.7"/>
      <path d="M 280,300 Q 320,330 350,305" stroke="#292524" stroke-width="6" opacity="0.6"/>
      <rect x="230" y="470" width="180" height="24" rx="4" fill="#1c1917" opacity="0.4"/>
      <text x="400" y="200" font-family="system-ui, sans-serif" font-size="28" fill="#d6d3d1" font-weight="bold" text-anchor="middle">Surface Staining &amp; Residue</text>
    ` : `
      <!-- Gleam, Polish sparkles and reflection for AFTER -->
      <!-- Sparkle 1 -->
      <path d="M 240,230 L 246,250 L 266,256 L 246,262 L 240,282 L 234,262 L 214,256 L 234,250 Z" fill="#ffffff" />
      <!-- Sparkle 2 -->
      <path d="M 520,260 L 524,272 L 536,276 L 524,280 L 520,292 L 516,280 L 504,276 L 516,272 Z" fill="#ffffff" />
      <!-- Sparkle 3 -->
      <path d="M 380,300 L 385,315 L 400,320 L 385,325 L 380,340 L 375,325 L 360,320 L 375,315 Z" fill="#bae6fd" />
      <!-- High gloss reflection strip -->
      <path d="M 210,255 L 590,255 L 560,270 L 240,270 Z" fill="#ffffff" opacity="0.5" />
      <text x="400" y="200" font-family="system-ui, sans-serif" font-size="28" fill="#f0f9ff" font-weight="bold" text-anchor="middle">Sanitized &amp; Diamond Polished</text>
    `}

    <!-- Label Badges -->
    <g transform="translate(40, 40)">
      <rect width="110" height="34" rx="6" fill="${badgeBg}"/>
      <text x="55" y="23" font-family="system-ui, sans-serif" font-size="14" fill="#ffffff" font-weight="800" text-anchor="middle" letter-spacing="1">${badgeText}</text>
    </g>

    <g transform="translate(40, 520)">
      <text x="0" y="20" font-family="system-ui, sans-serif" font-size="22" fill="#ffffff" font-weight="700">${title}</text>
      <text x="0" y="44" font-family="system-ui, sans-serif" font-size="14" fill="#94a3b8">${subtitle || 'Professional Grade Execution'}</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const createProductSvg = (title: string, category: string, color: string = '#E31B23'): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="#f8fafc"/>
    <circle cx="300" cy="300" r="220" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
    
    <!-- Bottle Shape -->
    <rect x="230" y="140" width="140" height="50" rx="8" fill="#334155"/>
    <rect x="270" y="110" width="60" height="30" rx="4" fill="#64748b"/>
    <path d="M 230,190 Q 210,220 200,270 L 200,450 Q 200,470 220,470 L 380,470 Q 400,470 400,450 L 400,270 Q 390,220 370,190 Z" fill="${color}" opacity="0.9"/>
    
    <!-- Bottle Label -->
    <rect x="220" y="270" width="160" height="150" rx="10" fill="#ffffff"/>
    <rect x="235" y="290" width="130" height="8" rx="4" fill="${color}"/>
    <text x="300" y="330" font-family="system-ui, sans-serif" font-size="16" fill="#0f172a" font-weight="bold" text-anchor="middle">DEVIL CLEANERZ</text>
    <text x="300" y="355" font-family="system-ui, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">PRO FORMULA</text>
    <text x="300" y="390" font-family="system-ui, sans-serif" font-size="12" fill="${color}" font-weight="bold" text-anchor="middle">5 Litre / Heavy Duty</text>

    <!-- Liquid Level Accent -->
    <path d="M 205,430 L 395,430 L 395,445 Q 395,465 375,465 L 225,465 Q 205,465 205,445 Z" fill="#991b1b" opacity="0.4"/>
    
    <!-- Title Text below -->
    <text x="300" y="530" font-family="system-ui, sans-serif" font-size="18" fill="#1e293b" font-weight="bold" text-anchor="middle">${title}</text>
    <text x="300" y="555" font-family="system-ui, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">${category}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const createPackageSvg = (bhkName: string, areaSqFt: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="pkgBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f1f5f9"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" rx="16" fill="url(#pkgBg)" stroke="#e2e8f0" stroke-width="2"/>
    
    <!-- Architectural plan styling -->
    <path d="M 60,60 L 540,60 L 540,300 L 60,300 Z" fill="none" stroke="#E31B23" stroke-width="2" stroke-dasharray="6,4" opacity="0.3"/>
    <rect x="80" y="80" width="200" height="120" rx="6" fill="#fee2e2" opacity="0.4" stroke="#E31B23" stroke-width="1.5"/>
    <rect x="300" y="80" width="220" height="120" rx="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="80" y="215" width="440" height="70" rx="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>

    <circle cx="180" cy="140" r="28" fill="#E31B23" opacity="0.1"/>
    <path d="M 180,125 L 180,155 M 165,140 L 195,140" stroke="#E31B23" stroke-width="3"/>
    
    <text x="300" y="345" font-family="system-ui, sans-serif" font-size="24" fill="#0f172a" font-weight="bold" text-anchor="middle">${bhkName} Deep Cleaning</text>
    <text x="300" y="375" font-family="system-ui, sans-serif" font-size="14" fill="#64748b" text-anchor="middle">Covers up to ${areaSqFt} • Mechanized Equipment</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const createServiceSvg = (name: string, isCommercial: boolean = false): string => {
  const primary = isCommercial ? '#0f172a' : '#E31B23';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#f8fafc"/>
    <rect x="40" y="40" width="520" height="320" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    
    <circle cx="300" cy="160" r="50" fill="${primary}" opacity="0.1"/>
    <!-- Cleaning Sparkle & Shield Icon -->
    <path d="M 300,120 L 335,135 L 335,175 Q 335,205 300,215 Q 265,205 265,175 L 265,135 Z" fill="${primary}"/>
    <path d="M 285,165 L 295,175 L 315,150" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    
    <text x="300" y="270" font-family="system-ui, sans-serif" font-size="22" fill="#0f172a" font-weight="bold" text-anchor="middle">${name}</text>
    <text x="300" y="300" font-family="system-ui, sans-serif" font-size="14" fill="#64748b" text-anchor="middle">${isCommercial ? 'Commercial & Enterprise Grade' : 'Residential Specialist Services'}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
