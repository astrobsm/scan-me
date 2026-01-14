/**
 * Background Library
 * Rich collection of backgrounds for Nigerian video content
 * Includes medical facilities, villages, studios, urban scenes, and more
 */

export interface Background {
  id: string;
  name: string;
  category: BackgroundCategory;
  description: string;
  gradient?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    floor?: string;
    sky?: string;
  };
  elements: BackgroundElement[];
  lighting: 'bright' | 'normal' | 'dim' | 'dramatic';
  mood: 'professional' | 'warm' | 'clinical' | 'natural' | 'modern' | 'traditional';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export type BackgroundCategory = 
  | 'medical' 
  | 'village' 
  | 'studio' 
  | 'urban' 
  | 'educational' 
  | 'religious' 
  | 'outdoor' 
  | 'abstract'
  | 'commercial';

export interface BackgroundElement {
  type: string;
  position: 'left' | 'right' | 'center' | 'background' | 'foreground';
  description: string;
}

// ==================== MEDICAL BACKGROUNDS ====================
const MEDICAL_BACKGROUNDS: Background[] = [
  {
    id: 'hospital-reception',
    name: 'Hospital Reception',
    category: 'medical',
    description: 'Modern hospital reception and waiting area',
    gradient: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 50%, #e0e7ff 100%)',
    colors: {
      primary: '#0ea5e9',
      secondary: '#f0f9ff',
      accent: '#0284c7',
      floor: '#e2e8f0'
    },
    elements: [
      { type: 'reception-desk', position: 'center', description: 'Modern reception counter' },
      { type: 'waiting-chairs', position: 'left', description: 'Blue waiting room chairs' },
      { type: 'hospital-logo', position: 'background', description: 'Hospital emblem on wall' },
      { type: 'plants', position: 'right', description: 'Indoor plants for comfort' },
      { type: 'information-screen', position: 'background', description: 'Digital display board' }
    ],
    lighting: 'bright',
    mood: 'clinical'
  },
  {
    id: 'doctors-office',
    name: "Doctor's Consultation Room",
    category: 'medical',
    description: 'Private consultation room with desk and examination area',
    gradient: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ede9fe 100%)',
    colors: {
      primary: '#7c3aed',
      secondary: '#faf5ff',
      accent: '#6d28d9',
      floor: '#ddd6fe'
    },
    elements: [
      { type: 'doctor-desk', position: 'center', description: 'Wooden desk with computer' },
      { type: 'medical-certificates', position: 'background', description: 'Framed certificates' },
      { type: 'examination-bed', position: 'right', description: 'Medical examination couch' },
      { type: 'medical-equipment', position: 'left', description: 'BP monitor, stethoscope' },
      { type: 'bookshelf', position: 'background', description: 'Medical books and journals' }
    ],
    lighting: 'normal',
    mood: 'professional'
  },
  {
    id: 'operating-theatre',
    name: 'Operating Theatre',
    category: 'medical',
    description: 'Sterile surgical operating room',
    gradient: 'linear-gradient(180deg, #d1fae5 0%, #ecfdf5 50%, #d1fae5 100%)',
    colors: {
      primary: '#10b981',
      secondary: '#ecfdf5',
      accent: '#059669',
      floor: '#a7f3d0'
    },
    elements: [
      { type: 'operating-table', position: 'center', description: 'Surgical table with lights' },
      { type: 'surgical-lights', position: 'center', description: 'Overhead surgical lamps' },
      { type: 'monitors', position: 'left', description: 'Vital signs monitors' },
      { type: 'surgical-equipment', position: 'right', description: 'Surgical instruments tray' },
      { type: 'anesthesia-machine', position: 'left', description: 'Anesthesia equipment' }
    ],
    lighting: 'bright',
    mood: 'clinical'
  },
  {
    id: 'wound-care-clinic',
    name: 'Wound Care Office',
    category: 'medical',
    description: 'Specialized wound care and treatment room',
    gradient: 'linear-gradient(180deg, #fef3c7 0%, #fffbeb 50%, #fef9c3 100%)',
    colors: {
      primary: '#f59e0b',
      secondary: '#fffbeb',
      accent: '#d97706',
      floor: '#fde68a'
    },
    elements: [
      { type: 'treatment-bed', position: 'center', description: 'Adjustable treatment bed' },
      { type: 'dressing-cart', position: 'right', description: 'Cart with bandages and supplies' },
      { type: 'wound-care-posters', position: 'background', description: 'Educational posters' },
      { type: 'medical-cabinet', position: 'left', description: 'Supply cabinet' },
      { type: 'hand-sanitizer', position: 'foreground', description: 'Hygiene station' }
    ],
    lighting: 'bright',
    mood: 'clinical'
  },
  {
    id: 'hospital-ward',
    name: 'Hospital Ward',
    category: 'medical',
    description: 'General hospital ward with patient beds',
    gradient: 'linear-gradient(180deg, #e0f2fe 0%, #f8fafc 50%, #e2e8f0 100%)',
    colors: {
      primary: '#3b82f6',
      secondary: '#f8fafc',
      accent: '#2563eb',
      floor: '#cbd5e1'
    },
    elements: [
      { type: 'hospital-beds', position: 'center', description: 'Multiple patient beds' },
      { type: 'curtain-dividers', position: 'left', description: 'Privacy curtains' },
      { type: 'nurse-station', position: 'background', description: 'Central nurse station' },
      { type: 'iv-stands', position: 'right', description: 'IV drip stands' },
      { type: 'windows', position: 'background', description: 'Large windows with light' }
    ],
    lighting: 'bright',
    mood: 'clinical'
  },
  {
    id: 'pharmacy',
    name: 'Hospital Pharmacy',
    category: 'medical',
    description: 'Pharmacy dispensary with medicine shelves',
    gradient: 'linear-gradient(180deg, #dcfce7 0%, #f0fdf4 50%, #d1fae5 100%)',
    colors: {
      primary: '#22c55e',
      secondary: '#f0fdf4',
      accent: '#16a34a',
      floor: '#bbf7d0'
    },
    elements: [
      { type: 'medicine-shelves', position: 'background', description: 'Organized medicine racks' },
      { type: 'dispensing-counter', position: 'center', description: 'Pharmacy counter' },
      { type: 'computer-system', position: 'center', description: 'POS and inventory system' },
      { type: 'medication-fridge', position: 'left', description: 'Cold storage for medicines' },
      { type: 'prescription-area', position: 'right', description: 'Prescription checking area' }
    ],
    lighting: 'bright',
    mood: 'clinical'
  },
  {
    id: 'laboratory',
    name: 'Medical Laboratory',
    category: 'medical',
    description: 'Clinical laboratory for tests and analysis',
    gradient: 'linear-gradient(180deg, #dbeafe 0%, #eff6ff 50%, #dbeafe 100%)',
    colors: {
      primary: '#3b82f6',
      secondary: '#eff6ff',
      accent: '#1d4ed8',
      floor: '#bfdbfe'
    },
    elements: [
      { type: 'lab-benches', position: 'center', description: 'Lab workbenches' },
      { type: 'microscopes', position: 'left', description: 'Analysis microscopes' },
      { type: 'test-tubes', position: 'right', description: 'Sample racks and tubes' },
      { type: 'centrifuge', position: 'left', description: 'Lab centrifuge machine' },
      { type: 'specimen-fridge', position: 'background', description: 'Sample storage' }
    ],
    lighting: 'bright',
    mood: 'clinical'
  },
  {
    id: 'maternity-ward',
    name: 'Maternity Ward',
    category: 'medical',
    description: 'Maternity and newborn care unit',
    gradient: 'linear-gradient(180deg, #fce7f3 0%, #fdf2f8 50%, #fbcfe8 100%)',
    colors: {
      primary: '#ec4899',
      secondary: '#fdf2f8',
      accent: '#db2777',
      floor: '#f9a8d4'
    },
    elements: [
      { type: 'delivery-beds', position: 'center', description: 'Maternity beds' },
      { type: 'baby-cots', position: 'right', description: 'Newborn baby cots' },
      { type: 'monitoring-equipment', position: 'left', description: 'Fetal monitors' },
      { type: 'nursing-station', position: 'background', description: 'Midwife station' },
      { type: 'warmers', position: 'right', description: 'Baby warmers' }
    ],
    lighting: 'normal',
    mood: 'warm'
  },
  {
    id: 'emergency-room',
    name: 'Emergency Room',
    category: 'medical',
    description: 'Hospital emergency and trauma unit',
    gradient: 'linear-gradient(180deg, #fee2e2 0%, #fef2f2 50%, #fecaca 100%)',
    colors: {
      primary: '#ef4444',
      secondary: '#fef2f2',
      accent: '#dc2626',
      floor: '#fca5a5'
    },
    elements: [
      { type: 'trauma-beds', position: 'center', description: 'Emergency treatment beds' },
      { type: 'defibrillator', position: 'left', description: 'Emergency equipment' },
      { type: 'crash-cart', position: 'right', description: 'Emergency medication cart' },
      { type: 'triage-area', position: 'background', description: 'Patient assessment area' },
      { type: 'ambulance-bay', position: 'background', description: 'Emergency entrance' }
    ],
    lighting: 'bright',
    mood: 'clinical'
  }
];

// ==================== VILLAGE BACKGROUNDS ====================
const VILLAGE_BACKGROUNDS: Background[] = [
  {
    id: 'village-square',
    name: 'Village Square',
    category: 'village',
    description: 'Traditional Nigerian village meeting place',
    gradient: 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 30%, #84cc16 70%, #65a30d 100%)',
    colors: {
      primary: '#84cc16',
      secondary: '#fef3c7',
      accent: '#a16207',
      floor: '#854d0e',
      sky: '#7dd3fc'
    },
    elements: [
      { type: 'iroko-tree', position: 'center', description: 'Large shade tree' },
      { type: 'clay-benches', position: 'left', description: 'Traditional seating' },
      { type: 'village-huts', position: 'background', description: 'Mud houses with thatch' },
      { type: 'elders-chair', position: 'center', description: "Chief's traditional seat" },
      { type: 'village-shrine', position: 'right', description: 'Traditional sacred space' }
    ],
    lighting: 'bright',
    mood: 'traditional',
    timeOfDay: 'afternoon'
  },
  {
    id: 'village-compound',
    name: 'Village Family Compound',
    category: 'village',
    description: 'Traditional family compound with mud houses',
    gradient: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 30%, #d97706 70%, #92400e 100%)',
    colors: {
      primary: '#d97706',
      secondary: '#fef3c7',
      accent: '#92400e',
      floor: '#78350f',
      sky: '#38bdf8'
    },
    elements: [
      { type: 'main-house', position: 'center', description: 'Main family building' },
      { type: 'cooking-area', position: 'left', description: 'Outdoor kitchen with firewood' },
      { type: 'palm-trees', position: 'background', description: 'Palm trees around compound' },
      { type: 'water-pot', position: 'right', description: 'Clay water storage pots' },
      { type: 'chickens', position: 'foreground', description: 'Free-range poultry' }
    ],
    lighting: 'bright',
    mood: 'warm',
    timeOfDay: 'morning'
  },
  {
    id: 'village-market',
    name: 'Village Market',
    category: 'village',
    description: 'Rural market day scene',
    gradient: 'linear-gradient(180deg, #fcd34d 0%, #fef3c7 30%, #d97706 70%, #a16207 100%)',
    colors: {
      primary: '#f59e0b',
      secondary: '#fffbeb',
      accent: '#b45309',
      floor: '#78350f',
      sky: '#fcd34d'
    },
    elements: [
      { type: 'market-stalls', position: 'center', description: 'Wooden market stalls' },
      { type: 'produce-display', position: 'left', description: 'Fresh vegetables and fruits' },
      { type: 'fabric-seller', position: 'right', description: 'Ankara and cloth stall' },
      { type: 'umbrellas', position: 'background', description: 'Colorful market umbrellas' },
      { type: 'traders', position: 'background', description: 'Busy trading scene' }
    ],
    lighting: 'bright',
    mood: 'warm',
    timeOfDay: 'morning'
  },
  {
    id: 'village-stream',
    name: 'Village Stream',
    category: 'village',
    description: 'Peaceful stream where villagers fetch water',
    gradient: 'linear-gradient(180deg, #7dd3fc 0%, #a7f3d0 40%, #22c55e 70%, #15803d 100%)',
    colors: {
      primary: '#22c55e',
      secondary: '#0ea5e9',
      accent: '#15803d',
      floor: '#14532d',
      sky: '#7dd3fc'
    },
    elements: [
      { type: 'stream-water', position: 'center', description: 'Clear flowing stream' },
      { type: 'stepping-stones', position: 'center', description: 'River crossing stones' },
      { type: 'palm-trees', position: 'left', description: 'Riverside palm trees' },
      { type: 'water-pots', position: 'right', description: 'Women with water containers' },
      { type: 'bridge', position: 'background', description: 'Simple wooden bridge' }
    ],
    lighting: 'bright',
    mood: 'natural',
    timeOfDay: 'morning'
  },
  {
    id: 'village-farm',
    name: 'Village Farmland',
    category: 'village',
    description: 'Agricultural land with crops',
    gradient: 'linear-gradient(180deg, #38bdf8 0%, #bae6fd 30%, #84cc16 60%, #4d7c0f 100%)',
    colors: {
      primary: '#84cc16',
      secondary: '#4ade80',
      accent: '#365314',
      floor: '#3f6212',
      sky: '#38bdf8'
    },
    elements: [
      { type: 'crop-rows', position: 'center', description: 'Planted crop rows' },
      { type: 'cassava-plants', position: 'left', description: 'Cassava farm' },
      { type: 'yam-heaps', position: 'right', description: 'Yam mounds' },
      { type: 'farmer-hut', position: 'background', description: 'Small farm shelter' },
      { type: 'farm-tools', position: 'foreground', description: 'Hoes and cutlasses' }
    ],
    lighting: 'bright',
    mood: 'natural',
    timeOfDay: 'morning'
  },
  {
    id: 'village-evening',
    name: 'Village at Sunset',
    category: 'village',
    description: 'Peaceful village evening scene',
    gradient: 'linear-gradient(180deg, #f97316 0%, #fb923c 30%, #7c2d12 70%, #451a03 100%)',
    colors: {
      primary: '#f97316',
      secondary: '#fed7aa',
      accent: '#c2410c',
      floor: '#451a03',
      sky: '#f97316'
    },
    elements: [
      { type: 'sunset-sky', position: 'background', description: 'Orange sunset' },
      { type: 'silhouette-huts', position: 'background', description: 'Hut silhouettes' },
      { type: 'cooking-fire', position: 'center', description: 'Evening cooking fire' },
      { type: 'palm-silhouettes', position: 'left', description: 'Palm tree shadows' },
      { type: 'moonrise', position: 'background', description: 'Rising moon' }
    ],
    lighting: 'dramatic',
    mood: 'warm',
    timeOfDay: 'evening'
  }
];

// ==================== STUDIO BACKGROUNDS ====================
const STUDIO_BACKGROUNDS: Background[] = [
  {
    id: 'tv-studio',
    name: 'TV Broadcast Studio',
    category: 'studio',
    description: 'Professional television studio setup',
    gradient: 'linear-gradient(180deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e293b',
      accent: '#60a5fa',
      floor: '#0f172a'
    },
    elements: [
      { type: 'anchor-desk', position: 'center', description: 'News anchor desk' },
      { type: 'studio-lights', position: 'background', description: 'Professional lighting rig' },
      { type: 'cameras', position: 'foreground', description: 'Broadcast cameras' },
      { type: 'green-screen', position: 'background', description: 'Chroma key background' },
      { type: 'monitors', position: 'left', description: 'Preview monitors' }
    ],
    lighting: 'dramatic',
    mood: 'professional'
  },
  {
    id: 'podcast-studio',
    name: 'Podcast Recording Studio',
    category: 'studio',
    description: 'Modern podcast and audio recording setup',
    gradient: 'linear-gradient(180deg, #7c3aed 0%, #4c1d95 50%, #2e1065 100%)',
    colors: {
      primary: '#a855f7',
      secondary: '#2e1065',
      accent: '#c084fc',
      floor: '#1e1b4b'
    },
    elements: [
      { type: 'microphones', position: 'center', description: 'Professional microphones' },
      { type: 'soundproofing', position: 'background', description: 'Acoustic panels' },
      { type: 'mixing-desk', position: 'left', description: 'Audio mixing console' },
      { type: 'headphones', position: 'foreground', description: 'Studio headphones' },
      { type: 'led-lights', position: 'background', description: 'RGB ambient lighting' }
    ],
    lighting: 'dim',
    mood: 'modern'
  },
  {
    id: 'photo-studio',
    name: 'Photography Studio',
    category: 'studio',
    description: 'Professional photography backdrop',
    gradient: 'linear-gradient(180deg, #e5e7eb 0%, #d1d5db 50%, #9ca3af 100%)',
    colors: {
      primary: '#6b7280',
      secondary: '#f3f4f6',
      accent: '#4b5563',
      floor: '#374151'
    },
    elements: [
      { type: 'backdrop', position: 'background', description: 'Seamless paper backdrop' },
      { type: 'softboxes', position: 'left', description: 'Studio soft lighting' },
      { type: 'reflectors', position: 'right', description: 'Light reflector panels' },
      { type: 'camera-tripod', position: 'foreground', description: 'Camera on tripod' },
      { type: 'props-table', position: 'right', description: 'Props and accessories' }
    ],
    lighting: 'bright',
    mood: 'professional'
  },
  {
    id: 'green-screen-studio',
    name: 'Green Screen Studio',
    category: 'studio',
    description: 'Chroma key green screen background',
    gradient: 'linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
    colors: {
      primary: '#22c55e',
      secondary: '#4ade80',
      accent: '#166534',
      floor: '#14532d'
    },
    elements: [
      { type: 'green-backdrop', position: 'background', description: 'Chroma key green' },
      { type: 'studio-lights', position: 'left', description: 'Even lighting setup' },
      { type: 'floor-mat', position: 'center', description: 'Green floor extension' }
    ],
    lighting: 'bright',
    mood: 'professional'
  },
  {
    id: 'interview-set',
    name: 'Interview Set',
    category: 'studio',
    description: 'Professional interview and talk show setup',
    gradient: 'linear-gradient(180deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
    colors: {
      primary: '#f59e0b',
      secondary: '#fef3c7',
      accent: '#92400e',
      floor: '#78350f'
    },
    elements: [
      { type: 'interview-chairs', position: 'center', description: 'Two comfortable chairs' },
      { type: 'coffee-table', position: 'center', description: 'Small table between chairs' },
      { type: 'bookshelf', position: 'background', description: 'Decorative bookshelf' },
      { type: 'plants', position: 'left', description: 'Decorative plants' },
      { type: 'art-pieces', position: 'background', description: 'Nigerian art decor' }
    ],
    lighting: 'normal',
    mood: 'warm'
  },
  {
    id: 'webinar-studio',
    name: 'Webinar Background',
    category: 'studio',
    description: 'Professional webinar and virtual meeting background',
    gradient: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 50%, #172554 100%)',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e3a8a',
      accent: '#60a5fa',
      floor: '#0f172a'
    },
    elements: [
      { type: 'modern-desk', position: 'center', description: 'Clean modern desk' },
      { type: 'company-logo', position: 'background', description: 'Branded backdrop' },
      { type: 'ring-light', position: 'foreground', description: 'Professional ring light' },
      { type: 'laptop', position: 'center', description: 'Laptop on desk' },
      { type: 'decorative-lights', position: 'background', description: 'Ambient LED strips' }
    ],
    lighting: 'normal',
    mood: 'modern'
  }
];

// ==================== URBAN BACKGROUNDS ====================
const URBAN_BACKGROUNDS: Background[] = [
  {
    id: 'lagos-skyline',
    name: 'Lagos City Skyline',
    category: 'urban',
    description: 'Modern Lagos cityscape with skyscrapers',
    gradient: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 30%, #94a3b8 70%, #64748b 100%)',
    colors: {
      primary: '#0ea5e9',
      secondary: '#e0f2fe',
      accent: '#0284c7',
      floor: '#475569',
      sky: '#0ea5e9'
    },
    elements: [
      { type: 'skyscrapers', position: 'background', description: 'High-rise buildings' },
      { type: 'third-mainland-bridge', position: 'center', description: 'Iconic bridge' },
      { type: 'lagoon', position: 'center', description: 'Lagos lagoon waters' },
      { type: 'boats', position: 'foreground', description: 'Boats on water' },
      { type: 'clouds', position: 'background', description: 'Tropical clouds' }
    ],
    lighting: 'bright',
    mood: 'modern',
    timeOfDay: 'afternoon'
  },
  {
    id: 'abuja-cityscape',
    name: 'Abuja City Center',
    category: 'urban',
    description: 'Modern Abuja with government buildings',
    gradient: 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 30%, #94a3b8 70%, #64748b 100%)',
    colors: {
      primary: '#22c55e',
      secondary: '#f0fdf4',
      accent: '#16a34a',
      floor: '#64748b',
      sky: '#7dd3fc'
    },
    elements: [
      { type: 'national-assembly', position: 'center', description: 'Government buildings' },
      { type: 'aso-rock', position: 'background', description: 'Aso Rock in distance' },
      { type: 'eagle-square', position: 'foreground', description: 'National monument' },
      { type: 'palm-lined-roads', position: 'center', description: 'Wide boulevards' },
      { type: 'modern-architecture', position: 'left', description: 'Modern buildings' }
    ],
    lighting: 'bright',
    mood: 'professional',
    timeOfDay: 'morning'
  },
  {
    id: 'market-scene',
    name: 'Busy Nigerian Market',
    category: 'urban',
    description: 'Vibrant market scene with traders and goods',
    gradient: 'linear-gradient(180deg, #fcd34d 0%, #fef3c7 30%, #f59e0b 70%, #d97706 100%)',
    colors: {
      primary: '#f59e0b',
      secondary: '#fffbeb',
      accent: '#b45309',
      floor: '#78350f',
      sky: '#fcd34d'
    },
    elements: [
      { type: 'market-stalls', position: 'center', description: 'Colorful market stalls' },
      { type: 'umbrellas', position: 'background', description: 'Market umbrellas' },
      { type: 'produce', position: 'foreground', description: 'Fresh goods display' },
      { type: 'traders', position: 'background', description: 'Busy traders' },
      { type: 'signage', position: 'background', description: 'Market signs' }
    ],
    lighting: 'bright',
    mood: 'warm',
    timeOfDay: 'morning'
  },
  {
    id: 'bank-interior',
    name: 'Bank Interior',
    category: 'urban',
    description: 'Modern Nigerian bank interior',
    gradient: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    colors: {
      primary: '#0ea5e9',
      secondary: '#f8fafc',
      accent: '#0284c7',
      floor: '#94a3b8'
    },
    elements: [
      { type: 'bank-counter', position: 'center', description: 'Teller counter' },
      { type: 'waiting-area', position: 'left', description: 'Customer seating' },
      { type: 'atm-machines', position: 'right', description: 'ATM station' },
      { type: 'bank-logo', position: 'background', description: 'Bank branding' },
      { type: 'security-door', position: 'background', description: 'Security entrance' }
    ],
    lighting: 'bright',
    mood: 'professional'
  },
  {
    id: 'corporate-office',
    name: 'Modern Corporate Office',
    category: 'urban',
    description: 'Professional corporate office space',
    gradient: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
    colors: {
      primary: '#6366f1',
      secondary: '#f8fafc',
      accent: '#4f46e5',
      floor: '#94a3b8'
    },
    elements: [
      { type: 'office-desks', position: 'center', description: 'Modern workstations' },
      { type: 'glass-partitions', position: 'left', description: 'Glass office walls' },
      { type: 'conference-room', position: 'background', description: 'Meeting room visible' },
      { type: 'plants', position: 'right', description: 'Office plants' },
      { type: 'whiteboard', position: 'background', description: 'Presentation board' }
    ],
    lighting: 'bright',
    mood: 'modern'
  }
];

// ==================== EDUCATIONAL BACKGROUNDS ====================
const EDUCATIONAL_BACKGROUNDS: Background[] = [
  {
    id: 'classroom',
    name: 'School Classroom',
    category: 'educational',
    description: 'Traditional Nigerian classroom setting',
    gradient: 'linear-gradient(180deg, #fef3c7 0%, #fef9c3 50%, #fde68a 100%)',
    colors: {
      primary: '#84cc16',
      secondary: '#fefce8',
      accent: '#65a30d',
      floor: '#78350f'
    },
    elements: [
      { type: 'blackboard', position: 'center', description: 'Green chalkboard' },
      { type: 'teacher-desk', position: 'foreground', description: "Teacher's desk" },
      { type: 'student-desks', position: 'foreground', description: 'Wooden student desks' },
      { type: 'windows', position: 'left', description: 'Classroom windows' },
      { type: 'charts', position: 'background', description: 'Educational posters' }
    ],
    lighting: 'bright',
    mood: 'professional'
  },
  {
    id: 'university-lecture-hall',
    name: 'University Lecture Hall',
    category: 'educational',
    description: 'Large university auditorium',
    gradient: 'linear-gradient(180deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)',
    colors: {
      primary: '#7c3aed',
      secondary: '#f5f3ff',
      accent: '#6d28d9',
      floor: '#4c1d95'
    },
    elements: [
      { type: 'tiered-seating', position: 'center', description: 'Lecture hall seats' },
      { type: 'podium', position: 'center', description: 'Lecturer podium' },
      { type: 'projector-screen', position: 'background', description: 'Large projection screen' },
      { type: 'whiteboard', position: 'background', description: 'Writing boards' },
      { type: 'audio-system', position: 'left', description: 'Sound system speakers' }
    ],
    lighting: 'normal',
    mood: 'professional'
  },
  {
    id: 'library',
    name: 'Library Study Area',
    category: 'educational',
    description: 'Quiet library with bookshelves',
    gradient: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
    colors: {
      primary: '#a16207',
      secondary: '#fffbeb',
      accent: '#92400e',
      floor: '#78350f'
    },
    elements: [
      { type: 'bookshelves', position: 'background', description: 'Tall book shelves' },
      { type: 'reading-tables', position: 'center', description: 'Study tables' },
      { type: 'desk-lamps', position: 'foreground', description: 'Reading lamps' },
      { type: 'computers', position: 'left', description: 'Computer stations' },
      { type: 'quiet-sign', position: 'background', description: 'Silence please sign' }
    ],
    lighting: 'dim',
    mood: 'warm'
  },
  {
    id: 'science-lab',
    name: 'School Science Laboratory',
    category: 'educational',
    description: 'Chemistry/Biology laboratory',
    gradient: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
    colors: {
      primary: '#10b981',
      secondary: '#ecfdf5',
      accent: '#059669',
      floor: '#064e3b'
    },
    elements: [
      { type: 'lab-benches', position: 'center', description: 'Laboratory workbenches' },
      { type: 'microscopes', position: 'left', description: 'Student microscopes' },
      { type: 'chemistry-equipment', position: 'right', description: 'Beakers and burners' },
      { type: 'periodic-table', position: 'background', description: 'Periodic table chart' },
      { type: 'safety-equipment', position: 'background', description: 'Eye wash and extinguisher' }
    ],
    lighting: 'bright',
    mood: 'clinical'
  },
  {
    id: 'computer-lab',
    name: 'Computer Laboratory',
    category: 'educational',
    description: 'School computer room with workstations',
    gradient: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
    colors: {
      primary: '#3b82f6',
      secondary: '#eff6ff',
      accent: '#2563eb',
      floor: '#1e3a8a'
    },
    elements: [
      { type: 'computer-desks', position: 'center', description: 'Computer workstations' },
      { type: 'monitors', position: 'center', description: 'Desktop computers' },
      { type: 'server-rack', position: 'background', description: 'Server equipment' },
      { type: 'projector', position: 'background', description: 'Ceiling projector' },
      { type: 'ac-unit', position: 'background', description: 'Air conditioning' }
    ],
    lighting: 'normal',
    mood: 'modern'
  }
];

// ==================== RELIGIOUS BACKGROUNDS ====================
const RELIGIOUS_BACKGROUNDS: Background[] = [
  {
    id: 'church-interior',
    name: 'Church Interior',
    category: 'religious',
    description: 'Nigerian church sanctuary',
    gradient: 'linear-gradient(180deg, #fef3c7 0%, #fef9c3 50%, #fbbf24 100%)',
    colors: {
      primary: '#7c3aed',
      secondary: '#fefce8',
      accent: '#6d28d9',
      floor: '#92400e'
    },
    elements: [
      { type: 'altar', position: 'center', description: 'Church altar' },
      { type: 'pews', position: 'foreground', description: 'Church seating' },
      { type: 'cross', position: 'background', description: 'Christian cross' },
      { type: 'pulpit', position: 'center', description: 'Preaching podium' },
      { type: 'stained-glass', position: 'background', description: 'Decorative windows' }
    ],
    lighting: 'dramatic',
    mood: 'warm'
  },
  {
    id: 'mosque-interior',
    name: 'Mosque Interior',
    category: 'religious',
    description: 'Nigerian mosque prayer hall',
    gradient: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
    colors: {
      primary: '#22c55e',
      secondary: '#f0fdf4',
      accent: '#16a34a',
      floor: '#14532d'
    },
    elements: [
      { type: 'prayer-carpet', position: 'center', description: 'Prayer rugs' },
      { type: 'mihrab', position: 'center', description: 'Prayer niche' },
      { type: 'minbar', position: 'right', description: "Imam's pulpit" },
      { type: 'calligraphy', position: 'background', description: 'Arabic inscriptions' },
      { type: 'chandelier', position: 'background', description: 'Mosque lighting' }
    ],
    lighting: 'normal',
    mood: 'warm'
  }
];

// ==================== OUTDOOR BACKGROUNDS ====================
const OUTDOOR_BACKGROUNDS: Background[] = [
  {
    id: 'beach-scene',
    name: 'Nigerian Beach',
    category: 'outdoor',
    description: 'Beautiful beach coastline',
    gradient: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 30%, #fcd34d 70%, #f59e0b 100%)',
    colors: {
      primary: '#0ea5e9',
      secondary: '#fef3c7',
      accent: '#0284c7',
      floor: '#fcd34d',
      sky: '#0ea5e9'
    },
    elements: [
      { type: 'ocean-waves', position: 'center', description: 'Atlantic ocean waves' },
      { type: 'sandy-beach', position: 'foreground', description: 'Golden sand' },
      { type: 'palm-trees', position: 'left', description: 'Coastal palms' },
      { type: 'beach-huts', position: 'right', description: 'Beach cabanas' },
      { type: 'boats', position: 'background', description: 'Fishing boats' }
    ],
    lighting: 'bright',
    mood: 'natural',
    timeOfDay: 'afternoon'
  },
  {
    id: 'savanna',
    name: 'Nigerian Savanna',
    category: 'outdoor',
    description: 'Open savanna grassland',
    gradient: 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 30%, #84cc16 60%, #65a30d 100%)',
    colors: {
      primary: '#84cc16',
      secondary: '#fef9c3',
      accent: '#4d7c0f',
      floor: '#a16207',
      sky: '#7dd3fc'
    },
    elements: [
      { type: 'grassland', position: 'center', description: 'Tall grass plains' },
      { type: 'acacia-trees', position: 'background', description: 'Scattered acacia trees' },
      { type: 'distant-hills', position: 'background', description: 'Rolling hills' },
      { type: 'cattle', position: 'foreground', description: 'Grazing cattle' },
      { type: 'birds', position: 'background', description: 'Flying birds' }
    ],
    lighting: 'bright',
    mood: 'natural',
    timeOfDay: 'afternoon'
  },
  {
    id: 'rainforest',
    name: 'Tropical Rainforest',
    category: 'outdoor',
    description: 'Dense Nigerian rainforest',
    gradient: 'linear-gradient(180deg, #166534 0%, #15803d 30%, #22c55e 60%, #4ade80 100%)',
    colors: {
      primary: '#22c55e',
      secondary: '#dcfce7',
      accent: '#15803d',
      floor: '#14532d',
      sky: '#166534'
    },
    elements: [
      { type: 'tall-trees', position: 'background', description: 'Rainforest canopy' },
      { type: 'vines', position: 'left', description: 'Hanging vines' },
      { type: 'forest-floor', position: 'center', description: 'Leaf-covered ground' },
      { type: 'stream', position: 'foreground', description: 'Forest stream' },
      { type: 'butterflies', position: 'foreground', description: 'Tropical butterflies' }
    ],
    lighting: 'dim',
    mood: 'natural',
    timeOfDay: 'afternoon'
  }
];

// ==================== ABSTRACT BACKGROUNDS ====================
const ABSTRACT_BACKGROUNDS: Background[] = [
  {
    id: 'gradient-blue',
    name: 'Professional Blue',
    category: 'abstract',
    description: 'Clean blue gradient background',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#1e40af',
      floor: '#1e3a8a'
    },
    elements: [],
    lighting: 'normal',
    mood: 'professional'
  },
  {
    id: 'gradient-green',
    name: 'Health Green',
    category: 'abstract',
    description: 'Soothing green medical gradient',
    gradient: 'linear-gradient(135deg, #166534 0%, #22c55e 50%, #4ade80 100%)',
    colors: {
      primary: '#22c55e',
      secondary: '#4ade80',
      accent: '#166534',
      floor: '#14532d'
    },
    elements: [],
    lighting: 'normal',
    mood: 'clinical'
  },
  {
    id: 'gradient-warm',
    name: 'Warm Sunset',
    category: 'abstract',
    description: 'Warm orange and red gradient',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 50%, #fbbf24 100%)',
    colors: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      accent: '#dc2626',
      floor: '#92400e'
    },
    elements: [],
    lighting: 'normal',
    mood: 'warm'
  },
  {
    id: 'gradient-purple',
    name: 'Creative Purple',
    category: 'abstract',
    description: 'Creative purple gradient',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a855f7 100%)',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#4c1d95',
      floor: '#2e1065'
    },
    elements: [],
    lighting: 'normal',
    mood: 'modern'
  },
  {
    id: 'gradient-dark',
    name: 'Professional Dark',
    category: 'abstract',
    description: 'Dark professional background',
    gradient: 'linear-gradient(180deg, #1e293b 0%, #0f172a 50%, #020617 100%)',
    colors: {
      primary: '#475569',
      secondary: '#1e293b',
      accent: '#64748b',
      floor: '#020617'
    },
    elements: [],
    lighting: 'dim',
    mood: 'professional'
  },
  {
    id: 'nigerian-flag',
    name: 'Nigerian Colors',
    category: 'abstract',
    description: 'Green white green Nigerian theme',
    gradient: 'linear-gradient(90deg, #008751 0%, #008751 33%, #ffffff 33%, #ffffff 66%, #008751 66%, #008751 100%)',
    colors: {
      primary: '#008751',
      secondary: '#ffffff',
      accent: '#008751',
      floor: '#006241'
    },
    elements: [],
    lighting: 'bright',
    mood: 'professional'
  }
];

// ==================== COMMERCIAL BACKGROUNDS ====================
const COMMERCIAL_BACKGROUNDS: Background[] = [
  {
    id: 'supermarket',
    name: 'Supermarket Interior',
    category: 'commercial',
    description: 'Modern Nigerian supermarket',
    gradient: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    colors: {
      primary: '#dc2626',
      secondary: '#f8fafc',
      accent: '#b91c1c',
      floor: '#94a3b8'
    },
    elements: [
      { type: 'product-shelves', position: 'background', description: 'Store shelving' },
      { type: 'checkout', position: 'right', description: 'Checkout counters' },
      { type: 'shopping-carts', position: 'foreground', description: 'Shopping trolleys' },
      { type: 'signage', position: 'background', description: 'Aisle signs' },
      { type: 'promotions', position: 'left', description: 'Promotional displays' }
    ],
    lighting: 'bright',
    mood: 'modern'
  },
  {
    id: 'restaurant',
    name: 'Nigerian Restaurant',
    category: 'commercial',
    description: 'Local restaurant or bukateria',
    gradient: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
    colors: {
      primary: '#d97706',
      secondary: '#fffbeb',
      accent: '#b45309',
      floor: '#78350f'
    },
    elements: [
      { type: 'dining-tables', position: 'center', description: 'Restaurant tables' },
      { type: 'food-display', position: 'background', description: 'Food warmers' },
      { type: 'menu-board', position: 'background', description: 'Menu on wall' },
      { type: 'ceiling-fans', position: 'background', description: 'Overhead fans' },
      { type: 'african-decor', position: 'background', description: 'Cultural decorations' }
    ],
    lighting: 'normal',
    mood: 'warm'
  },
  {
    id: 'filling-station',
    name: 'Fuel Filling Station',
    category: 'commercial',
    description: 'Nigerian petrol station',
    gradient: 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 30%, #e2e8f0 70%, #94a3b8 100%)',
    colors: {
      primary: '#dc2626',
      secondary: '#fef2f2',
      accent: '#16a34a',
      floor: '#64748b',
      sky: '#7dd3fc'
    },
    elements: [
      { type: 'fuel-pumps', position: 'center', description: 'Petrol dispensers' },
      { type: 'canopy', position: 'background', description: 'Station canopy' },
      { type: 'cars', position: 'foreground', description: 'Vehicles refueling' },
      { type: 'shop', position: 'right', description: 'Convenience store' },
      { type: 'signage', position: 'background', description: 'Brand signage' }
    ],
    lighting: 'bright',
    mood: 'modern',
    timeOfDay: 'afternoon'
  }
];

// Combine all backgrounds
export const BACKGROUND_LIBRARY: Background[] = [
  ...MEDICAL_BACKGROUNDS,
  ...VILLAGE_BACKGROUNDS,
  ...STUDIO_BACKGROUNDS,
  ...URBAN_BACKGROUNDS,
  ...EDUCATIONAL_BACKGROUNDS,
  ...RELIGIOUS_BACKGROUNDS,
  ...OUTDOOR_BACKGROUNDS,
  ...ABSTRACT_BACKGROUNDS,
  ...COMMERCIAL_BACKGROUNDS
];

// Background Categories for filtering
export const BACKGROUND_CATEGORIES = [
  { id: 'all', name: 'All Backgrounds', icon: '🎨', count: BACKGROUND_LIBRARY.length },
  { id: 'medical', name: 'Medical Facilities', icon: '🏥', count: MEDICAL_BACKGROUNDS.length },
  { id: 'village', name: 'Village Scenes', icon: '🏡', count: VILLAGE_BACKGROUNDS.length },
  { id: 'studio', name: 'Studios', icon: '🎬', count: STUDIO_BACKGROUNDS.length },
  { id: 'urban', name: 'Urban/City', icon: '🏙️', count: URBAN_BACKGROUNDS.length },
  { id: 'educational', name: 'Educational', icon: '📚', count: EDUCATIONAL_BACKGROUNDS.length },
  { id: 'religious', name: 'Religious', icon: '🙏', count: RELIGIOUS_BACKGROUNDS.length },
  { id: 'outdoor', name: 'Outdoor/Nature', icon: '🌳', count: OUTDOOR_BACKGROUNDS.length },
  { id: 'abstract', name: 'Abstract/Gradients', icon: '🎭', count: ABSTRACT_BACKGROUNDS.length },
  { id: 'commercial', name: 'Commercial', icon: '🏪', count: COMMERCIAL_BACKGROUNDS.length }
];

// Helper functions
export const getBackgroundsByCategory = (category: string): Background[] => {
  if (category === 'all') return BACKGROUND_LIBRARY;
  return BACKGROUND_LIBRARY.filter(bg => bg.category === category);
};

export const getBackgroundsByMood = (mood: Background['mood']): Background[] => {
  return BACKGROUND_LIBRARY.filter(bg => bg.mood === mood);
};

export const searchBackgrounds = (query: string): Background[] => {
  const lowerQuery = query.toLowerCase();
  return BACKGROUND_LIBRARY.filter(bg =>
    bg.name.toLowerCase().includes(lowerQuery) ||
    bg.description.toLowerCase().includes(lowerQuery) ||
    bg.category.toLowerCase().includes(lowerQuery)
  );
};

export default BACKGROUND_LIBRARY;
