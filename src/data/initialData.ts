import { CleaningPackage, CleaningProduct, CleaningService, ResultItem, AdminSettings } from '../types';
import { createCleaningSvg, createProductSvg, createPackageSvg, createServiceSvg } from './imagePresets';

export const initialPackages: CleaningPackage[] = [
  {
    id: 'pkg-1bhk',
    name: '1 BHK Complete Deep Cleaning',
    price: 2499,
    description: 'Intensive mechanized scrub and sanitization of 1 Bedroom, Hall, Kitchen, Bathroom and Balcony areas.',
    imageUrl: createPackageSvg('1 BHK', '550 sq.ft'),
    includedServices: [
      'Single-disc floor buffing & scrubbing',
      'Kitchen chimney degreasing & tile de-scaling',
      'Bathroom sanitization & hard water stain removal',
      'Ceiling fan, switchboard & window track cleaning',
      'Balcony washing & glass wipedown'
    ],
    displayOrder: 1,
    status: 'published',
    createdAt: '2026-09-15'
  },
  {
    id: 'pkg-2bhk',
    name: '2 BHK Premium Deep Cleaning',
    price: 3899,
    description: 'Comprehensive deep cleaning tailored for 2 BHK apartments, including 2 bathrooms and utility area.',
    imageUrl: createPackageSvg('2 BHK', '950 sq.ft'),
    includedServices: [
      'Mechanized rotary scrubbing on all tiled flooring',
      'Full kitchen degreasing + cabinet interior wipe',
      '2 Bathrooms acid-free chemical scaling',
      'Sofa & mattress dry vacuuming',
      'Cobweb eradication & wall dry dusting'
    ],
    displayOrder: 2,
    status: 'published',
    createdAt: '2026-09-18'
  },
  {
    id: 'pkg-3bhk',
    name: '3 BHK Executive Deep Cleaning',
    price: 5499,
    description: 'Heavy-duty sanitization and mechanized scrubbing for spacious 3 BHK homes, 3 bathrooms, and balconies.',
    imageUrl: createPackageSvg('3 BHK', '1,450 sq.ft'),
    includedServices: [
      'Heavy-duty floor scrubbing with Taski chemicals',
      'Exhaust & chimney filter oil extraction',
      'Sanitization of 3 bathrooms + shower glass polishing',
      'Balconies pressure washing & railing polishing',
      'Upholstery wet shampoo vacuuming'
    ],
    displayOrder: 3,
    status: 'published',
    createdAt: '2026-09-22'
  },
  {
    id: 'pkg-4bhk',
    name: '4 BHK Luxury Villa & Apartment Cleaning',
    price: 7499,
    description: 'Elite 8-stage deep cleaning package designed for luxury duplex apartments and large 4 BHK residences.',
    imageUrl: createPackageSvg('4 BHK', '2,200 sq.ft'),
    includedServices: [
      'Industrial grade floor buffing & marble restoration wipe',
      'Complete modular kitchen degreasing & appliance wipe',
      '4 Bathrooms germicidal sanitization',
      'All sliding door tracks & high windows cleaning',
      'Terrace / double balcony pressure washing'
    ],
    displayOrder: 4,
    status: 'published',
    createdAt: '2026-10-01'
  },
  {
    id: 'pkg-movein',
    name: 'Post-Construction & Move-In Cleaning',
    price: 9999,
    description: 'Removal of paint splatters, cement residue, plaster dust, and adhesive marks before moving in.',
    imageUrl: createPackageSvg('Move-In', 'Up to 2,500 sq.ft'),
    includedServices: [
      'Paint & grout splatter scraping with safe blades',
      'Complete wall dust extraction with HEPA vacuums',
      'All woodwork polishing & dust clearance',
      'Sanitization of all sanitaryware & mirrors'
    ],
    displayOrder: 5,
    status: 'draft',
    createdAt: '2026-10-05'
  }
];

export const initialProducts: CleaningProduct[] = [
  {
    id: 'prod-degreaser',
    name: 'Devil Max Heavy-Duty Degreaser 5L',
    price: 1450,
    imageUrl: createProductSvg('Devil Max Degreaser 5L', 'Kitchen Degreaser', '#E31B23'),
    description: 'Industrial alkali-based degreaser specifically formulated for commercial kitchen chimneys, exhaust fans, and stoves.',
    category: 'Degreasers',
    displayOrder: 1,
    status: 'published',
    createdAt: '2026-09-10'
  },
  {
    id: 'prod-tilecleaner',
    name: 'Pro-Shine Tile & Grout Acid-Free Cleaner 5L',
    price: 1200,
    imageUrl: createProductSvg('Pro-Shine Tile Cleaner', 'Tile & Grout', '#0284c7'),
    description: 'Safe for Italian marble, granite, and glazed porcelain tiles. Eliminates stubborn yellowish stains and soap scum.',
    category: 'Floor Cleaners',
    displayOrder: 2,
    status: 'published',
    createdAt: '2026-09-12'
  },
  {
    id: 'prod-glasspolish',
    name: 'CrystalClear Glass & Mirror Cleaner 5L',
    price: 850,
    imageUrl: createProductSvg('CrystalClear Glass', 'Glass Polish', '#0d9488'),
    description: 'Streak-free anti-static glass polish that repels dust and finger smudges on storefronts, facade glass, and mirrors.',
    category: 'Glass Polish',
    displayOrder: 3,
    status: 'published',
    createdAt: '2026-09-20'
  },
  {
    id: 'prod-sanitizer',
    name: 'Sani-Shield Surface Multi-Action Sanitizer 5L',
    price: 1650,
    imageUrl: createProductSvg('Sani-Shield Sanitizer', 'Sanitizers', '#7c3aed'),
    description: 'Hospital grade QAC disinfectant cleaner approved for food-contact surfaces, schools, and clinic rooms.',
    category: 'Sanitizers',
    displayOrder: 4,
    status: 'published',
    createdAt: '2026-09-25'
  },
  {
    id: 'prod-microfiber',
    name: 'Pro Microfiber Heavy Weave Towels (Pack of 12)',
    price: 990,
    imageUrl: createProductSvg('Pro Microfiber Pack', 'Cleaning Kits', '#ea580c'),
    description: '400 GSM lint-free edgeless microfiber cloths color-coded for kitchen, bathroom, glass, and general areas.',
    category: 'Cleaning Kits',
    displayOrder: 5,
    status: 'published',
    createdAt: '2026-10-02'
  }
];

export const initialServices: CleaningService[] = [
  {
    id: 'srv-home-deep',
    name: 'Home Deep Cleaning',
    category: 'Home Deep Cleaning',
    description: 'Complete top-to-bottom sanitization and mechanized scrubbing for residences of all sizes.',
    imageUrl: createServiceSvg('Home Deep Cleaning', false),
    inclusions: [
      'Mechanized floor scrubbing with eco-certified solutions',
      'Deep dusting of ceiling fans, lamps, and chandeliers',
      'Window panes, sliding channels, and mesh cleaning',
      'Door frames, baseboards, and switch plate wipedown',
      'Balcony tile washing and drainage flush'
    ],
    displayOrder: 1,
    status: 'published',
    createdAt: '2026-09-01'
  },
  {
    id: 'srv-kitchen-deep',
    name: 'Kitchen Deep Cleaning',
    category: 'Kitchen Deep Cleaning',
    description: 'Rigorous grease extraction, oil removal, and food hygiene restoration.',
    imageUrl: createServiceSvg('Kitchen Deep Cleaning', false),
    inclusions: [
      'Chimney hood baffle filters chemical degreasing',
      'Modular cabinets interior and exterior degreasing',
      'Gas hob burners, knobs, and backsplash tile scrub',
      'Kitchen sink descaling and drain pipe sanitization',
      'Exterior wipe of microwave, refrigerator, and oven'
    ],
    displayOrder: 2,
    status: 'published',
    createdAt: '2026-09-05'
  },
  {
    id: 'srv-bathroom',
    name: 'Bathroom Deep Cleaning',
    category: 'Bathroom Cleaning',
    description: 'Elimination of stubborn hard water limescale, calcium rings, and bacteria colonies.',
    imageUrl: createServiceSvg('Bathroom Cleaning', false),
    inclusions: [
      'Hard water scaling removal from shower glass partitions',
      'WC commode inside-out acid-free germicidal scrub',
      'Wash basin, faucet, and shower fixture chrome buffing',
      'Grout dirt extraction and wall tile buffing',
      'Exhaust fan blade degreasing and mirror buffing'
    ],
    displayOrder: 3,
    status: 'published',
    createdAt: '2026-09-08'
  },
  {
    id: 'srv-office',
    name: 'Corporate Office Cleaning',
    category: 'Office Cleaning',
    description: 'Professional commercial grade sanitization for tech parks, startups, and executive suites.',
    imageUrl: createServiceSvg('Corporate Office Cleaning', true),
    inclusions: [
      'Workstation desk disinfection and phone sanitization',
      'Carpet spot extraction and high-traffic area vacuuming',
      'Conference room table buffing and glass partitions wipedown',
      'Pantry counter sanitization and microwave cleaning',
      'Restrooms automated hygiene replenishment'
    ],
    displayOrder: 4,
    status: 'published',
    createdAt: '2026-09-14'
  },
  {
    id: 'srv-hotel',
    name: 'Hotel & Hospitality Cleaning',
    category: 'Hotel Cleaning',
    description: 'Guest room turnover and lobby maintenance adhering to 5-star hospitality hygiene protocols.',
    imageUrl: createServiceSvg('Hotel Cleaning', true),
    inclusions: [
      'Mattress UV sanitization and linen turn-around deep cleaning',
      'En-suite marble bathroom polishing',
      'Lobby high-ceiling dust clearance and chandelier cleaning',
      'Buffet area and dining floor mechanized polishing'
    ],
    displayOrder: 5,
    status: 'published',
    createdAt: '2026-09-18'
  },
  {
    id: 'srv-restaurant',
    name: 'Restaurant & Commercial Kitchen Cleaning',
    category: 'Restaurant Cleaning',
    description: 'FSSAI compliance cleaning for commercial kitchens, tandoor areas, and dining halls.',
    imageUrl: createServiceSvg('Restaurant Cleaning', true),
    inclusions: [
      'Commercial duct and exhaust canopy grease removal',
      'Deep fryer, grill, and prep table steam wash',
      'Tile anti-slip degreasing treatment',
      'Cold room floor scrub and rack disinfection'
    ],
    displayOrder: 6,
    status: 'published',
    createdAt: '2026-09-21'
  },
  {
    id: 'srv-shop',
    name: 'Retail Shop & Showroom Cleaning',
    category: 'Shop Cleaning',
    description: 'High-visibility cleaning for flagship showrooms, fashion stores, and jewelers.',
    imageUrl: createServiceSvg('Shop & Showroom Cleaning', true),
    inclusions: [
      'Storefront glass facade streak-free cleaning',
      'Display rack dusting and spotlight fixture wipe',
      'High-traffic vinyl or vitrified tile buffer glossing',
      'Trial room sanitization'
    ],
    displayOrder: 7,
    status: 'published',
    createdAt: '2026-09-24'
  },
  {
    id: 'srv-warehouse',
    name: 'Warehouse & Industrial Cleaning',
    category: 'Warehouse Cleaning',
    description: 'Mechanized ride-on sweeping and scrubber drying for large logistics centers.',
    imageUrl: createServiceSvg('Warehouse Cleaning', true),
    inclusions: [
      'Industrial scrubber-drier bay cleaning',
      'Racking aisle dust extraction',
      'Loading dock spill cleanup and oil stain remediation',
      'High-bay lighting spider web clearance'
    ],
    displayOrder: 8,
    status: 'published',
    createdAt: '2026-09-28'
  },
  {
    id: 'srv-resort',
    name: 'Resort & Clubhouse Cleaning',
    category: 'Resort Cleaning',
    description: 'Outdoor and indoor cleaning for luxury getaways, clubs, and pool lounge decks.',
    imageUrl: createServiceSvg('Resort Cleaning', true),
    inclusions: [
      'Poolside deck pressure wash and algae treatment',
      'Clubhouse lounge deep upholstery steaming',
      'Gazebo, cabana, and outdoor stone pathway washing'
    ],
    displayOrder: 9,
    status: 'draft',
    createdAt: '2026-10-03'
  },
  {
    id: 'srv-villa',
    name: 'Bungalow & Villa Cleaning',
    category: 'Bungalow & Villa Cleaning',
    description: 'White-glove care for multi-storey residential bungalows, stairways, and private terraces.',
    imageUrl: createServiceSvg('Bungalow & Villa Cleaning', false),
    inclusions: [
      'Full architectural glass facade cleaning',
      'Spiral staircase and banister hand-buffing',
      'Terrace waterproofing wash and drain clearance',
      'Private driveway pressure cleaning'
    ],
    displayOrder: 10,
    status: 'published',
    createdAt: '2026-10-07'
  }
];

export const initialResults: ResultItem[] = [
  {
    id: 'res-kitchen-grease',
    title: 'Severe Modular Kitchen Grease & Carbon Restoration',
    category: 'Kitchen Deep Cleaning',
    location: 'Bandra West, Mumbai',
    description: '5-year heavy grease layer on stainless steel chimney filters and tiled backsplash completely emulsified and polished to showroom finish using Devil Max Degreaser.',
    beforeImageUrl: createCleaningSvg('Kitchen', 'Oily Chimney & Carbon Build-up', 'Thick grease residues on extractor hood', true),
    afterImageUrl: createCleaningSvg('Kitchen', 'Gleaming Degreased Stainless Steel', '100% degreased, polished mirror sheen', false),
    additionalImages: [],
    completionDate: '2026-10-04',
    displayOrder: 1,
    status: 'published',
    createdAt: '2026-10-05'
  },
  {
    id: 'res-sofa-upholstery',
    title: 'Italian Velvet Sofa Stain & Watermark Extraction',
    category: 'Home Deep Cleaning',
    location: 'Golf Course Road, Gurugram',
    description: 'High-pressure hot water extraction and fabric conditioning to remove coffee spills, pet hair, and dust mites without damaging delicate fibers.',
    beforeImageUrl: createCleaningSvg('Living Room', 'Deep Set Beverage Stains & Dust', 'Water rings and micro-debris', true),
    afterImageUrl: createCleaningSvg('Living Room', 'Sanitized & Revitalized Velvet', 'Fresh allergen-free fiber restoration', false),
    additionalImages: [],
    completionDate: '2026-10-08',
    displayOrder: 2,
    status: 'published',
    createdAt: '2026-10-09'
  },
  {
    id: 'res-bathroom-tiles',
    title: 'Hard Water Limescale & Glass Descaling',
    category: 'Bathroom Cleaning',
    location: 'Whitefield, Bengaluru',
    description: 'Extreme groundwater calcium buildup on shower cubicle glass and ceramic wall tiles removed using non-acidic descalers, restoring crystal transparency.',
    beforeImageUrl: createCleaningSvg('Bathroom', 'Opaque Calcium & Soap Scum Layer', 'Frosted hard water deposits on glass', true),
    afterImageUrl: createCleaningSvg('Bathroom', 'Diamond Clear Glass Partition', '100% transparent streak-free glass', false),
    additionalImages: [],
    completionDate: '2026-09-29',
    displayOrder: 3,
    status: 'published',
    createdAt: '2026-09-30'
  },
  {
    id: 'res-office-carpet',
    title: '12,000 Sq.Ft Tech Office Post-Event Clean',
    category: 'Office Cleaning',
    location: 'Kalyani Nagar, Pune',
    description: 'Overnight turnaround cleaning of auditorium carpets, 140 executive workstations, conference room glass walls, and cafeteria floors before Monday opening.',
    beforeImageUrl: createCleaningSvg('Office', 'Heavy Footfall Soil & Spills', 'Footprint tracks and beverage stains', true),
    afterImageUrl: createCleaningSvg('Office', 'Hospital Grade Pristine Workspaces', 'Mechanized buffed floors & sanitized desks', false),
    additionalImages: [],
    completionDate: '2026-09-22',
    displayOrder: 4,
    status: 'published',
    createdAt: '2026-09-23'
  },
  {
    id: 'res-restaurant-exhaust',
    title: 'Commercial Restaurant Kitchen FSSAI Prep',
    category: 'Restaurant Cleaning',
    location: 'Jubilee Hills, Hyderabad',
    description: 'Commercial cooking hood, deep fryers, and tandoor surroundings degreased using industrial steam generators to pass hygiene audits.',
    beforeImageUrl: createCleaningSvg('Kitchen', 'Accumulated Cooking Oil Sludge', 'Hazardous greasy residue along duct', true),
    afterImageUrl: createCleaningSvg('Kitchen', 'Hygienic Food-Grade Kitchen State', 'Certified clean and sanitized surfaces', false),
    additionalImages: [],
    completionDate: '2026-09-17',
    displayOrder: 5,
    status: 'draft',
    createdAt: '2026-09-18'
  }
];

export const initialSettings: AdminSettings = {
  businessName: 'Devil Cleanerz & Enterprises',
  tagline: 'Precision Deep Cleaning & Enterprise Facility Management',
  logoUrl: '',
  primaryColor: '#E31B23',
  primaryBg: '#FFFFFF',
  adminName: 'Ranveer Kumar',
  adminEmail: 'ranveerkumar2753@gmail.com',
  adminPhone: '+91 98765 43210',
  adminRole: 'Super Administrator',
  currency: 'INR (₹)'
};

export const serviceCategoryOptions = [
  'Home Deep Cleaning',
  'Kitchen Deep Cleaning',
  'Bathroom Cleaning',
  'Office Cleaning',
  'Hotel Cleaning',
  'Restaurant Cleaning',
  'Shop Cleaning',
  'Warehouse Cleaning',
  'Resort Cleaning',
  'Bungalow & Villa Cleaning'
];

export const productCategoryOptions = [
  'Degreasers',
  'Floor Cleaners',
  'Glass Polish',
  'Sanitizers',
  'Cleaning Kits',
  'Industrial Chemicals'
];
