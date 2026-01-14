/**
 * CHARLES-DOUGLAS SCAN APP
 * Nigerian Background Library
 * 
 * Real Nigerian scene backgrounds from Pexels/Unsplash
 * Organized by category for video creation
 */

export interface NigerianBackground {
  id: string;
  name: string;
  category: BackgroundCategory;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  location?: string;
  mood: 'professional' | 'casual' | 'traditional' | 'modern' | 'nature' | 'urban';
  colorTone: 'warm' | 'cool' | 'neutral' | 'vibrant';
  tags: string[];
}

export type BackgroundCategory = 
  | 'hospital'
  | 'clinic'
  | 'school'
  | 'classroom'
  | 'office'
  | 'market'
  | 'village'
  | 'city'
  | 'church'
  | 'mosque'
  | 'home'
  | 'studio'
  | 'nature'
  | 'street'
  | 'farm'
  | 'event'
  | 'abstract';

/**
 * Nigerian Background Collection
 * Real images from free stock sources
 */
export const NIGERIAN_BACKGROUNDS: NigerianBackground[] = [
  // MEDICAL/HOSPITAL BACKGROUNDS
  {
    id: 'bg-hospital-01',
    name: 'Modern Hospital Ward',
    category: 'hospital',
    imageUrl: 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Clean modern hospital interior',
    mood: 'professional',
    colorTone: 'cool',
    tags: ['hospital', 'medical', 'health', 'clean']
  },
  {
    id: 'bg-hospital-02',
    name: 'Hospital Reception',
    category: 'hospital',
    imageUrl: 'https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Hospital reception and waiting area',
    mood: 'professional',
    colorTone: 'neutral',
    tags: ['hospital', 'reception', 'waiting', 'medical']
  },
  {
    id: 'bg-clinic-01',
    name: 'Medical Clinic',
    category: 'clinic',
    imageUrl: 'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Bright medical clinic setting',
    mood: 'professional',
    colorTone: 'cool',
    tags: ['clinic', 'medical', 'doctor', 'health']
  },
  {
    id: 'bg-pharmacy-01',
    name: 'Pharmacy Interior',
    category: 'clinic',
    imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Modern pharmacy with medicine shelves',
    mood: 'professional',
    colorTone: 'cool',
    tags: ['pharmacy', 'medicine', 'drugs', 'health']
  },

  // EDUCATION/SCHOOL BACKGROUNDS
  {
    id: 'bg-classroom-01',
    name: 'Modern Classroom',
    category: 'classroom',
    imageUrl: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Clean classroom with desks and board',
    mood: 'professional',
    colorTone: 'neutral',
    tags: ['classroom', 'school', 'education', 'learning']
  },
  {
    id: 'bg-classroom-02',
    name: 'University Lecture Hall',
    category: 'classroom',
    imageUrl: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Large lecture hall setting',
    mood: 'professional',
    colorTone: 'warm',
    tags: ['university', 'lecture', 'education', 'academic']
  },
  {
    id: 'bg-library-01',
    name: 'Library Study Area',
    category: 'school',
    imageUrl: 'https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Quiet library with books',
    mood: 'professional',
    colorTone: 'warm',
    tags: ['library', 'books', 'study', 'quiet']
  },
  {
    id: 'bg-school-yard-01',
    name: 'School Compound',
    category: 'school',
    imageUrl: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'School building and grounds',
    mood: 'casual',
    colorTone: 'warm',
    tags: ['school', 'building', 'education', 'outdoor']
  },

  // OFFICE/BUSINESS BACKGROUNDS
  {
    id: 'bg-office-01',
    name: 'Modern Office Space',
    category: 'office',
    imageUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Contemporary open office design',
    mood: 'modern',
    colorTone: 'neutral',
    tags: ['office', 'modern', 'business', 'workspace']
  },
  {
    id: 'bg-office-02',
    name: 'Executive Office',
    category: 'office',
    imageUrl: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Professional executive office',
    mood: 'professional',
    colorTone: 'warm',
    tags: ['office', 'executive', 'business', 'formal']
  },
  {
    id: 'bg-meeting-01',
    name: 'Conference Room',
    category: 'office',
    imageUrl: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Corporate meeting room',
    mood: 'professional',
    colorTone: 'cool',
    tags: ['conference', 'meeting', 'business', 'corporate']
  },

  // MARKET BACKGROUNDS
  {
    id: 'bg-market-01',
    name: 'Nigerian Market Scene',
    category: 'market',
    imageUrl: 'https://images.pexels.com/photos/2889091/pexels-photo-2889091.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/2889091/pexels-photo-2889091.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Vibrant African market',
    location: 'Nigeria',
    mood: 'casual',
    colorTone: 'vibrant',
    tags: ['market', 'trade', 'colorful', 'busy']
  },
  {
    id: 'bg-market-02',
    name: 'Fruit & Vegetable Market',
    category: 'market',
    imageUrl: 'https://images.pexels.com/photos/1508666/pexels-photo-1508666.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1508666/pexels-photo-1508666.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Fresh produce market stall',
    mood: 'casual',
    colorTone: 'vibrant',
    tags: ['market', 'fruits', 'vegetables', 'fresh']
  },
  {
    id: 'bg-market-03',
    name: 'Textile Market',
    category: 'market',
    imageUrl: 'https://images.pexels.com/photos/2996306/pexels-photo-2996306.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/2996306/pexels-photo-2996306.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Colorful fabric and textile market',
    mood: 'casual',
    colorTone: 'vibrant',
    tags: ['market', 'textiles', 'fabric', 'colorful']
  },

  // VILLAGE/RURAL BACKGROUNDS
  {
    id: 'bg-village-01',
    name: 'African Village Scene',
    category: 'village',
    imageUrl: 'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Traditional African village',
    mood: 'traditional',
    colorTone: 'warm',
    tags: ['village', 'rural', 'traditional', 'africa']
  },
  {
    id: 'bg-village-02',
    name: 'Rural Community',
    category: 'village',
    imageUrl: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Rural African community scene',
    mood: 'traditional',
    colorTone: 'warm',
    tags: ['village', 'community', 'rural', 'people']
  },
  {
    id: 'bg-farm-01',
    name: 'Nigerian Farm',
    category: 'farm',
    imageUrl: 'https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Agricultural farm setting',
    mood: 'nature',
    colorTone: 'warm',
    tags: ['farm', 'agriculture', 'rural', 'crops']
  },

  // CITY/URBAN BACKGROUNDS
  {
    id: 'bg-city-01',
    name: 'Lagos Cityscape',
    category: 'city',
    imageUrl: 'https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Modern African city skyline',
    location: 'Lagos',
    mood: 'urban',
    colorTone: 'cool',
    tags: ['city', 'lagos', 'skyline', 'urban']
  },
  {
    id: 'bg-city-02',
    name: 'Urban Street Scene',
    category: 'street',
    imageUrl: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Busy African urban street',
    mood: 'urban',
    colorTone: 'warm',
    tags: ['street', 'urban', 'traffic', 'busy']
  },
  {
    id: 'bg-city-03',
    name: 'Modern Building',
    category: 'city',
    imageUrl: 'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Modern high-rise building',
    mood: 'modern',
    colorTone: 'cool',
    tags: ['building', 'modern', 'architecture', 'city']
  },

  // RELIGIOUS BACKGROUNDS
  {
    id: 'bg-church-01',
    name: 'Church Interior',
    category: 'church',
    imageUrl: 'https://images.pexels.com/photos/236339/pexels-photo-236339.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/236339/pexels-photo-236339.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Beautiful church interior',
    mood: 'traditional',
    colorTone: 'warm',
    tags: ['church', 'religious', 'worship', 'interior']
  },
  {
    id: 'bg-church-02',
    name: 'Church Exterior',
    category: 'church',
    imageUrl: 'https://images.pexels.com/photos/427676/pexels-photo-427676.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/427676/pexels-photo-427676.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Traditional church building',
    mood: 'traditional',
    colorTone: 'warm',
    tags: ['church', 'building', 'religious', 'exterior']
  },
  {
    id: 'bg-mosque-01',
    name: 'Mosque Interior',
    category: 'mosque',
    imageUrl: 'https://images.pexels.com/photos/2403251/pexels-photo-2403251.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/2403251/pexels-photo-2403251.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Beautiful mosque interior',
    mood: 'traditional',
    colorTone: 'warm',
    tags: ['mosque', 'islamic', 'religious', 'prayer']
  },
  {
    id: 'bg-mosque-02',
    name: 'Mosque Exterior',
    category: 'mosque',
    imageUrl: 'https://images.pexels.com/photos/2233416/pexels-photo-2233416.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/2233416/pexels-photo-2233416.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Grand mosque building',
    mood: 'traditional',
    colorTone: 'warm',
    tags: ['mosque', 'building', 'islamic', 'architecture']
  },

  // HOME BACKGROUNDS
  {
    id: 'bg-home-01',
    name: 'Living Room',
    category: 'home',
    imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Comfortable living room',
    mood: 'casual',
    colorTone: 'warm',
    tags: ['home', 'living room', 'comfortable', 'cozy']
  },
  {
    id: 'bg-home-02',
    name: 'Kitchen',
    category: 'home',
    imageUrl: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Modern kitchen interior',
    mood: 'modern',
    colorTone: 'neutral',
    tags: ['home', 'kitchen', 'cooking', 'modern']
  },
  {
    id: 'bg-home-03',
    name: 'Bedroom',
    category: 'home',
    imageUrl: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Cozy bedroom setting',
    mood: 'casual',
    colorTone: 'warm',
    tags: ['home', 'bedroom', 'rest', 'cozy']
  },

  // STUDIO/ABSTRACT BACKGROUNDS
  {
    id: 'bg-studio-blue',
    name: 'Blue Studio',
    category: 'studio',
    imageUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Professional blue gradient studio',
    mood: 'professional',
    colorTone: 'cool',
    tags: ['studio', 'blue', 'professional', 'gradient']
  },
  {
    id: 'bg-studio-green',
    name: 'Green Studio',
    category: 'studio',
    imageUrl: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Natural green studio backdrop',
    mood: 'nature',
    colorTone: 'cool',
    tags: ['studio', 'green', 'natural', 'health']
  },
  {
    id: 'bg-studio-warm',
    name: 'Warm Studio',
    category: 'studio',
    imageUrl: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Warm-toned professional backdrop',
    mood: 'professional',
    colorTone: 'warm',
    tags: ['studio', 'warm', 'orange', 'professional']
  },
  {
    id: 'bg-abstract-01',
    name: 'Abstract Colorful',
    category: 'abstract',
    imageUrl: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Vibrant abstract pattern',
    mood: 'modern',
    colorTone: 'vibrant',
    tags: ['abstract', 'colorful', 'modern', 'artistic']
  },
  {
    id: 'bg-abstract-02',
    name: 'Geometric Pattern',
    category: 'abstract',
    imageUrl: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Modern geometric abstract',
    mood: 'modern',
    colorTone: 'vibrant',
    tags: ['abstract', 'geometric', 'modern', 'pattern']
  },

  // NATURE BACKGROUNDS
  {
    id: 'bg-nature-01',
    name: 'Tropical Forest',
    category: 'nature',
    imageUrl: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Lush tropical forest',
    mood: 'nature',
    colorTone: 'cool',
    tags: ['nature', 'forest', 'tropical', 'green']
  },
  {
    id: 'bg-nature-02',
    name: 'Sunset Sky',
    category: 'nature',
    imageUrl: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Beautiful African sunset',
    mood: 'nature',
    colorTone: 'warm',
    tags: ['sunset', 'sky', 'evening', 'beautiful']
  },
  {
    id: 'bg-nature-03',
    name: 'Palm Trees',
    category: 'nature',
    imageUrl: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Tropical palm trees',
    mood: 'nature',
    colorTone: 'warm',
    tags: ['palm', 'tropical', 'trees', 'beach']
  },
  {
    id: 'bg-nature-04',
    name: 'Savanna',
    category: 'nature',
    imageUrl: 'https://images.pexels.com/photos/1170572/pexels-photo-1170572.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1170572/pexels-photo-1170572.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'African savanna landscape',
    mood: 'nature',
    colorTone: 'warm',
    tags: ['savanna', 'africa', 'landscape', 'wildlife']
  },

  // EVENT BACKGROUNDS
  {
    id: 'bg-event-01',
    name: 'Wedding Venue',
    category: 'event',
    imageUrl: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Elegant wedding venue',
    mood: 'traditional',
    colorTone: 'warm',
    tags: ['wedding', 'event', 'celebration', 'elegant']
  },
  {
    id: 'bg-event-02',
    name: 'Party Decorations',
    category: 'event',
    imageUrl: 'https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Festive party decorations',
    mood: 'casual',
    colorTone: 'vibrant',
    tags: ['party', 'celebration', 'decorations', 'festive']
  },
  {
    id: 'bg-event-03',
    name: 'Conference Stage',
    category: 'event',
    imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1280',
    thumbnailUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Professional conference stage',
    mood: 'professional',
    colorTone: 'cool',
    tags: ['conference', 'stage', 'professional', 'event']
  }
];

// Background categories for easy filtering
export const BACKGROUND_CATEGORIES = {
  medical: NIGERIAN_BACKGROUNDS.filter(b => ['hospital', 'clinic'].includes(b.category)),
  education: NIGERIAN_BACKGROUNDS.filter(b => ['school', 'classroom'].includes(b.category)),
  business: NIGERIAN_BACKGROUNDS.filter(b => b.category === 'office'),
  market: NIGERIAN_BACKGROUNDS.filter(b => b.category === 'market'),
  rural: NIGERIAN_BACKGROUNDS.filter(b => ['village', 'farm'].includes(b.category)),
  urban: NIGERIAN_BACKGROUNDS.filter(b => ['city', 'street'].includes(b.category)),
  religious: NIGERIAN_BACKGROUNDS.filter(b => ['church', 'mosque'].includes(b.category)),
  home: NIGERIAN_BACKGROUNDS.filter(b => b.category === 'home'),
  studio: NIGERIAN_BACKGROUNDS.filter(b => ['studio', 'abstract'].includes(b.category)),
  nature: NIGERIAN_BACKGROUNDS.filter(b => b.category === 'nature'),
  event: NIGERIAN_BACKGROUNDS.filter(b => b.category === 'event')
};

/**
 * Get backgrounds by category
 */
export function getBackgroundsByCategory(category: BackgroundCategory): NigerianBackground[] {
  return NIGERIAN_BACKGROUNDS.filter(bg => bg.category === category);
}

/**
 * Get backgrounds by mood
 */
export function getBackgroundsByMood(mood: NigerianBackground['mood']): NigerianBackground[] {
  return NIGERIAN_BACKGROUNDS.filter(bg => bg.mood === mood);
}

/**
 * Search backgrounds by query
 */
export function searchBackgrounds(query: string): NigerianBackground[] {
  const lowerQuery = query.toLowerCase();
  return NIGERIAN_BACKGROUNDS.filter(bg =>
    bg.name.toLowerCase().includes(lowerQuery) ||
    bg.description.toLowerCase().includes(lowerQuery) ||
    bg.category.toLowerCase().includes(lowerQuery) ||
    bg.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get background by ID
 */
export function getBackgroundById(id: string): NigerianBackground | undefined {
  return NIGERIAN_BACKGROUNDS.find(bg => bg.id === id);
}

/**
 * Get random background with optional filter
 */
export function getRandomBackground(category?: BackgroundCategory): NigerianBackground {
  const filtered = category 
    ? NIGERIAN_BACKGROUNDS.filter(bg => bg.category === category)
    : NIGERIAN_BACKGROUNDS;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/**
 * Get recommended background for video type
 */
export function getRecommendedBackground(videoType: string): NigerianBackground {
  const recommendations: Record<string, BackgroundCategory[]> = {
    'health-talk': ['hospital', 'clinic'],
    'educational': ['classroom', 'school'],
    'advert': ['studio', 'abstract'],
    'interview': ['office', 'studio'],
    'news': ['studio', 'office'],
    'podcast': ['studio', 'home'],
    'tutorial': ['classroom', 'studio'],
    'testimonial': ['home', 'church', 'mosque'],
    'documentary': ['village', 'nature', 'city'],
    'story': ['nature', 'village', 'home'],
    'product-demo': ['studio', 'market'],
    'announcement': ['studio', 'office'],
    'debate': ['studio', 'office'],
    'explainer': ['studio', 'classroom'],
    'comedy-skit': ['home', 'market', 'street'],
    'motivational': ['nature', 'church', 'studio'],
    'custom': ['studio']
  };

  const categories = recommendations[videoType] || ['studio'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  return getRandomBackground(category);
}

/**
 * Background image loader with caching
 */
export class BackgroundImageLoader {
  private cache: Map<string, HTMLImageElement> = new Map();

  async loadImage(background: NigerianBackground, size: 'thumbnail' | 'full' = 'full'): Promise<HTMLImageElement> {
    const url = size === 'thumbnail' ? background.thumbnailUrl : background.imageUrl;
    const cacheKey = `${background.id}-${size}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.cache.set(cacheKey, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load background: ${background.name}`));
      img.src = url;
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton loader
export const backgroundLoader = new BackgroundImageLoader();

export default {
  NIGERIAN_BACKGROUNDS,
  BACKGROUND_CATEGORIES,
  getBackgroundsByCategory,
  getBackgroundsByMood,
  searchBackgrounds,
  getBackgroundById,
  getRandomBackground,
  getRecommendedBackground,
  backgroundLoader
};
