/**
 * CHARLES-DOUGLAS SCAN APP
 * Photorealistic Avatar Library
 * 
 * Real human avatars sourced from free stock photography (Pexels/Unsplash)
 * Each avatar has lip-sync landmarks for realistic talking head animations
 */

export interface PhotorealisticAvatar {
  id: string;
  name: string;
  gender: 'male' | 'female';
  ageGroup: 'young' | 'adult' | 'middle-aged' | 'elderly';
  ethnicity: 'igbo' | 'yoruba' | 'hausa' | 'fulani' | 'edo' | 'ijaw' | 'efik' | 'tiv' | 'mixed';
  profession: string;
  imageUrl: string;
  thumbnailUrl: string;
  lipSyncPoints: LipSyncLandmarks;
  faceRect: FaceRectangle;
  description: string;
  tags: string[];
}

export interface LipSyncLandmarks {
  // Mouth corners and key points for animation
  mouthLeft: { x: number; y: number };
  mouthRight: { x: number; y: number };
  mouthTop: { x: number; y: number };
  mouthBottom: { x: number; y: number };
  lipUpperOuter: { x: number; y: number };
  lipLowerOuter: { x: number; y: number };
  // Eye positions for blinking
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  // Head center for movement
  noseCenter: { x: number; y: number };
}

export interface FaceRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Standard lip sync points for a centered face portrait (normalized 0-1)
const STANDARD_LIP_SYNC: LipSyncLandmarks = {
  mouthLeft: { x: 0.38, y: 0.73 },
  mouthRight: { x: 0.62, y: 0.73 },
  mouthTop: { x: 0.50, y: 0.70 },
  mouthBottom: { x: 0.50, y: 0.76 },
  lipUpperOuter: { x: 0.50, y: 0.69 },
  lipLowerOuter: { x: 0.50, y: 0.77 },
  leftEye: { x: 0.35, y: 0.45 },
  rightEye: { x: 0.65, y: 0.45 },
  noseCenter: { x: 0.50, y: 0.58 }
};

const STANDARD_FACE_RECT: FaceRectangle = {
  x: 0.2,
  y: 0.1,
  width: 0.6,
  height: 0.8
};

/**
 * Photorealistic Nigerian Avatar Collection
 * Using high-quality stock photos from Pexels (free commercial use)
 */
export const PHOTOREALISTIC_AVATARS: PhotorealisticAvatar[] = [
  // MALE AVATARS
  {
    id: 'pm-doctor-01',
    name: 'Dr. Chukwuemeka',
    gender: 'male',
    ageGroup: 'adult',
    ethnicity: 'igbo',
    profession: 'Doctor',
    imageUrl: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Professional male doctor in white coat',
    tags: ['doctor', 'health', 'professional', 'medical']
  },
  {
    id: 'pm-teacher-01',
    name: 'Mr. Adebayo',
    gender: 'male',
    ageGroup: 'adult',
    ethnicity: 'yoruba',
    profession: 'Teacher',
    imageUrl: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Male teacher with glasses',
    tags: ['teacher', 'education', 'professional', 'academic']
  },
  {
    id: 'pm-businessman-01',
    name: 'Chief Musa',
    gender: 'male',
    ageGroup: 'middle-aged',
    ethnicity: 'hausa',
    profession: 'Businessman',
    imageUrl: 'https://images.pexels.com/photos/30789849/pexels-photo-30789849.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/30789849/pexels-photo-30789849.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Stylish businessman in professional attire',
    tags: ['business', 'executive', 'professional', 'formal']
  },
  {
    id: 'pm-engineer-01',
    name: 'Engr. Ifeanyi',
    gender: 'male',
    ageGroup: 'young',
    ethnicity: 'igbo',
    profession: 'Engineer',
    imageUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Young engineer in work environment',
    tags: ['engineer', 'tech', 'professional', 'young']
  },
  {
    id: 'pm-farmer-01',
    name: 'Baba Tanko',
    gender: 'male',
    ageGroup: 'elderly',
    ethnicity: 'fulani',
    profession: 'Farmer',
    imageUrl: 'https://images.pexels.com/photos/13033068/pexels-photo-13033068.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/13033068/pexels-photo-13033068.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Traditional man in cultural attire',
    tags: ['traditional', 'farmer', 'elder', 'cultural']
  },
  {
    id: 'pm-journalist-01',
    name: 'Segun Okonkwo',
    gender: 'male',
    ageGroup: 'adult',
    ethnicity: 'mixed',
    profession: 'Journalist',
    imageUrl: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Professional media personality',
    tags: ['media', 'journalist', 'presenter', 'news']
  },
  {
    id: 'pm-pastor-01',
    name: 'Pastor Emeka',
    gender: 'male',
    ageGroup: 'middle-aged',
    ethnicity: 'igbo',
    profession: 'Pastor',
    imageUrl: 'https://images.pexels.com/photos/5384598/pexels-photo-5384598.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/5384598/pexels-photo-5384598.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Religious leader in formal attire',
    tags: ['pastor', 'religious', 'speaker', 'leader']
  },
  {
    id: 'pm-student-01',
    name: 'Chidi',
    gender: 'male',
    ageGroup: 'young',
    ethnicity: 'igbo',
    profession: 'Student',
    imageUrl: 'https://images.pexels.com/photos/6147276/pexels-photo-6147276.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/6147276/pexels-photo-6147276.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'University student',
    tags: ['student', 'youth', 'education', 'young']
  },
  {
    id: 'pm-lawyer-01',
    name: 'Barrister Yakubu',
    gender: 'male',
    ageGroup: 'adult',
    ethnicity: 'hausa',
    profession: 'Lawyer',
    imageUrl: 'https://images.pexels.com/photos/5668481/pexels-photo-5668481.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/5668481/pexels-photo-5668481.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Legal professional',
    tags: ['lawyer', 'legal', 'professional', 'barrister']
  },
  {
    id: 'pm-musician-01',
    name: 'DJ Kola',
    gender: 'male',
    ageGroup: 'young',
    ethnicity: 'yoruba',
    profession: 'Musician',
    imageUrl: 'https://images.pexels.com/photos/29260763/pexels-photo-29260763.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/29260763/pexels-photo-29260763.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Young artist with modern style',
    tags: ['musician', 'artist', 'entertainment', 'young']
  },
  {
    id: 'pm-athlete-01',
    name: 'Uche Sportsman',
    gender: 'male',
    ageGroup: 'young',
    ethnicity: 'igbo',
    profession: 'Athlete',
    imageUrl: 'https://images.pexels.com/photos/3621183/pexels-photo-3621183.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/3621183/pexels-photo-3621183.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Professional athlete',
    tags: ['athlete', 'sports', 'fitness', 'young']
  },
  {
    id: 'pm-chef-01',
    name: 'Chef Kayode',
    gender: 'male',
    ageGroup: 'adult',
    ethnicity: 'yoruba',
    profession: 'Chef',
    imageUrl: 'https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Professional chef',
    tags: ['chef', 'food', 'cooking', 'professional']
  },
  {
    id: 'pm-traditional-01',
    name: 'Oba Adesanya',
    gender: 'male',
    ageGroup: 'elderly',
    ethnicity: 'yoruba',
    profession: 'Traditional Ruler',
    imageUrl: 'https://images.pexels.com/photos/29484739/pexels-photo-29484739.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/29484739/pexels-photo-29484739.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Traditional ruler in cultural attire',
    tags: ['traditional', 'chief', 'cultural', 'royalty']
  },
  {
    id: 'pm-tech-01',
    name: 'Tunde Tech',
    gender: 'male',
    ageGroup: 'young',
    ethnicity: 'yoruba',
    profession: 'Tech Entrepreneur',
    imageUrl: 'https://images.pexels.com/photos/33645094/pexels-photo-33645094.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/33645094/pexels-photo-33645094.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Stylish tech professional',
    tags: ['tech', 'entrepreneur', 'startup', 'modern']
  },
  {
    id: 'pm-imam-01',
    name: 'Imam Ibrahim',
    gender: 'male',
    ageGroup: 'middle-aged',
    ethnicity: 'hausa',
    profession: 'Imam',
    imageUrl: 'https://images.pexels.com/photos/2897462/pexels-photo-2897462.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/2897462/pexels-photo-2897462.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Religious leader',
    tags: ['imam', 'religious', 'islamic', 'leader']
  },
  
  // FEMALE AVATARS
  {
    id: 'pf-doctor-01',
    name: 'Dr. Adaeze',
    gender: 'female',
    ageGroup: 'adult',
    ethnicity: 'igbo',
    profession: 'Doctor',
    imageUrl: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Professional female doctor',
    tags: ['doctor', 'health', 'professional', 'medical']
  },
  {
    id: 'pf-teacher-01',
    name: 'Mrs. Aisha',
    gender: 'female',
    ageGroup: 'adult',
    ethnicity: 'hausa',
    profession: 'Teacher',
    imageUrl: 'https://images.pexels.com/photos/32420642/pexels-photo-32420642.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/32420642/pexels-photo-32420642.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Elegant female teacher in hijab',
    tags: ['teacher', 'education', 'hijab', 'professional']
  },
  {
    id: 'pf-nurse-01',
    name: 'Nurse Blessing',
    gender: 'female',
    ageGroup: 'young',
    ethnicity: 'edo',
    profession: 'Nurse',
    imageUrl: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Young nurse in medical setting',
    tags: ['nurse', 'health', 'medical', 'caring']
  },
  {
    id: 'pf-businesswoman-01',
    name: 'Madam Folake',
    gender: 'female',
    ageGroup: 'middle-aged',
    ethnicity: 'yoruba',
    profession: 'Businesswoman',
    imageUrl: 'https://images.pexels.com/photos/29644656/pexels-photo-29644656.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/29644656/pexels-photo-29644656.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Stylish professional woman',
    tags: ['business', 'executive', 'professional', 'formal']
  },
  {
    id: 'pf-lawyer-01',
    name: 'Barrister Ngozi',
    gender: 'female',
    ageGroup: 'adult',
    ethnicity: 'igbo',
    profession: 'Lawyer',
    imageUrl: 'https://images.pexels.com/photos/35592441/pexels-photo-35592441.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/35592441/pexels-photo-35592441.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Professional female lawyer',
    tags: ['lawyer', 'legal', 'professional', 'barrister']
  },
  {
    id: 'pf-traditional-01',
    name: 'Mama Aduke',
    gender: 'female',
    ageGroup: 'elderly',
    ethnicity: 'yoruba',
    profession: 'Traditional',
    imageUrl: 'https://images.pexels.com/photos/31426996/pexels-photo-31426996.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/31426996/pexels-photo-31426996.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Traditional woman in cultural attire',
    tags: ['traditional', 'elder', 'cultural', 'wise']
  },
  {
    id: 'pf-bride-01',
    name: 'Bride Amara',
    gender: 'female',
    ageGroup: 'young',
    ethnicity: 'igbo',
    profession: 'Bride',
    imageUrl: 'https://images.pexels.com/photos/31426999/pexels-photo-31426999.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/31426999/pexels-photo-31426999.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Beautiful bride in traditional attire',
    tags: ['bride', 'wedding', 'celebration', 'traditional']
  },
  {
    id: 'pf-student-01',
    name: 'Ada',
    gender: 'female',
    ageGroup: 'young',
    ethnicity: 'igbo',
    profession: 'Student',
    imageUrl: 'https://images.pexels.com/photos/32782512/pexels-photo-32782512.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/32782512/pexels-photo-32782512.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Young university student',
    tags: ['student', 'youth', 'education', 'young']
  },
  {
    id: 'pf-market-01',
    name: 'Iya Basira',
    gender: 'female',
    ageGroup: 'middle-aged',
    ethnicity: 'yoruba',
    profession: 'Market Woman',
    imageUrl: 'https://images.pexels.com/photos/35599905/pexels-photo-35599905.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/35599905/pexels-photo-35599905.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Market woman in vibrant setting',
    tags: ['market', 'vendor', 'business', 'colorful']
  },
  {
    id: 'pf-elegant-01',
    name: 'Princess Zainab',
    gender: 'female',
    ageGroup: 'adult',
    ethnicity: 'hausa',
    profession: 'Elegant Lady',
    imageUrl: 'https://images.pexels.com/photos/35652986/pexels-photo-35652986.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/35652986/pexels-photo-35652986.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Elegant woman in white with henna',
    tags: ['elegant', 'traditional', 'henna', 'beautiful']
  },
  {
    id: 'pf-fashion-01',
    name: 'Bunmi Style',
    gender: 'female',
    ageGroup: 'young',
    ethnicity: 'yoruba',
    profession: 'Fashion Designer',
    imageUrl: 'https://images.pexels.com/photos/35592444/pexels-photo-35592444.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/35592444/pexels-photo-35592444.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Fashionable young woman',
    tags: ['fashion', 'designer', 'style', 'modern']
  },
  {
    id: 'pf-traditional-02',
    name: 'Queen Fatima',
    gender: 'female',
    ageGroup: 'adult',
    ethnicity: 'fulani',
    profession: 'Traditional',
    imageUrl: 'https://images.pexels.com/photos/31426998/pexels-photo-31426998.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/31426998/pexels-photo-31426998.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Beautiful woman in traditional Nigerian attire',
    tags: ['traditional', 'cultural', 'elegant', 'colorful']
  },
  {
    id: 'pf-journalist-01',
    name: 'Kemi News',
    gender: 'female',
    ageGroup: 'young',
    ethnicity: 'yoruba',
    profession: 'Journalist',
    imageUrl: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Young media professional',
    tags: ['journalist', 'media', 'news', 'presenter']
  },
  {
    id: 'pf-healthcare-01',
    name: 'Pharmacist Chioma',
    gender: 'female',
    ageGroup: 'adult',
    ethnicity: 'igbo',
    profession: 'Pharmacist',
    imageUrl: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Professional pharmacist',
    tags: ['pharmacist', 'health', 'medical', 'professional']
  },
  {
    id: 'pf-modern-01',
    name: 'Yetunde Modern',
    gender: 'female',
    ageGroup: 'young',
    ethnicity: 'yoruba',
    profession: 'Influencer',
    imageUrl: 'https://images.pexels.com/photos/31427020/pexels-photo-31427020.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnailUrl: 'https://images.pexels.com/photos/31427020/pexels-photo-31427020.jpeg?auto=compress&cs=tinysrgb&w=200',
    lipSyncPoints: STANDARD_LIP_SYNC,
    faceRect: STANDARD_FACE_RECT,
    description: 'Modern African woman in sunlight',
    tags: ['modern', 'influencer', 'social', 'stylish']
  }
];

// Avatar categories for easy filtering
export const AVATAR_CATEGORIES = {
  byGender: {
    male: PHOTOREALISTIC_AVATARS.filter(a => a.gender === 'male'),
    female: PHOTOREALISTIC_AVATARS.filter(a => a.gender === 'female')
  },
  byEthnicity: {
    igbo: PHOTOREALISTIC_AVATARS.filter(a => a.ethnicity === 'igbo'),
    yoruba: PHOTOREALISTIC_AVATARS.filter(a => a.ethnicity === 'yoruba'),
    hausa: PHOTOREALISTIC_AVATARS.filter(a => a.ethnicity === 'hausa'),
    fulani: PHOTOREALISTIC_AVATARS.filter(a => a.ethnicity === 'fulani'),
    other: PHOTOREALISTIC_AVATARS.filter(a => !['igbo', 'yoruba', 'hausa', 'fulani'].includes(a.ethnicity))
  },
  byAgeGroup: {
    young: PHOTOREALISTIC_AVATARS.filter(a => a.ageGroup === 'young'),
    adult: PHOTOREALISTIC_AVATARS.filter(a => a.ageGroup === 'adult'),
    middleAged: PHOTOREALISTIC_AVATARS.filter(a => a.ageGroup === 'middle-aged'),
    elderly: PHOTOREALISTIC_AVATARS.filter(a => a.ageGroup === 'elderly')
  },
  byProfession: {
    medical: PHOTOREALISTIC_AVATARS.filter(a => ['doctor', 'nurse', 'pharmacist'].some(p => a.profession.toLowerCase().includes(p.toLowerCase())) || a.tags.includes('medical')),
    education: PHOTOREALISTIC_AVATARS.filter(a => a.profession.toLowerCase().includes('teacher') || a.profession.toLowerCase().includes('student') || a.tags.includes('education')),
    business: PHOTOREALISTIC_AVATARS.filter(a => a.profession.toLowerCase().includes('business') || a.tags.includes('business')),
    traditional: PHOTOREALISTIC_AVATARS.filter(a => a.profession.toLowerCase().includes('traditional') || a.tags.includes('traditional')),
    religious: PHOTOREALISTIC_AVATARS.filter(a => ['pastor', 'imam'].some(p => a.profession.toLowerCase().includes(p)) || a.tags.includes('religious')),
    entertainment: PHOTOREALISTIC_AVATARS.filter(a => ['musician', 'athlete', 'influencer'].some(p => a.profession.toLowerCase().includes(p)) || a.tags.includes('entertainment'))
  }
};

/**
 * Search avatars by query
 */
export function searchAvatars(query: string): PhotorealisticAvatar[] {
  const lowerQuery = query.toLowerCase();
  return PHOTOREALISTIC_AVATARS.filter(avatar => 
    avatar.name.toLowerCase().includes(lowerQuery) ||
    avatar.profession.toLowerCase().includes(lowerQuery) ||
    avatar.ethnicity.toLowerCase().includes(lowerQuery) ||
    avatar.description.toLowerCase().includes(lowerQuery) ||
    avatar.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get avatar by ID
 */
export function getAvatarById(id: string): PhotorealisticAvatar | undefined {
  return PHOTOREALISTIC_AVATARS.find(avatar => avatar.id === id);
}

/**
 * Get random avatar with optional filters
 */
export function getRandomAvatar(options?: {
  gender?: 'male' | 'female';
  ethnicity?: string;
  profession?: string;
}): PhotorealisticAvatar {
  let filtered = [...PHOTOREALISTIC_AVATARS];
  
  if (options?.gender) {
    filtered = filtered.filter(a => a.gender === options.gender);
  }
  if (options?.ethnicity) {
    filtered = filtered.filter(a => a.ethnicity === options.ethnicity);
  }
  if (options?.profession) {
    filtered = filtered.filter(a => 
      a.profession.toLowerCase().includes(options.profession!.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(options.profession!.toLowerCase()))
    );
  }
  
  if (filtered.length === 0) {
    filtered = PHOTOREALISTIC_AVATARS;
  }
  
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/**
 * Preload avatar images for faster display
 */
export async function preloadAvatarImages(avatars: PhotorealisticAvatar[]): Promise<void> {
  const promises = avatars.map(avatar => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load: ${avatar.thumbnailUrl}`));
      img.src = avatar.thumbnailUrl;
    });
  });
  
  await Promise.allSettled(promises);
}

/**
 * Avatar image loader with caching
 */
export class AvatarImageLoader {
  private cache: Map<string, HTMLImageElement> = new Map();
  
  async loadImage(avatar: PhotorealisticAvatar, size: 'thumbnail' | 'full' = 'full'): Promise<HTMLImageElement> {
    const url = size === 'thumbnail' ? avatar.thumbnailUrl : avatar.imageUrl;
    const cacheKey = `${avatar.id}-${size}`;
    
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
      img.onerror = () => reject(new Error(`Failed to load avatar: ${avatar.name}`));
      img.src = url;
    });
  }
  
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton loader
export const avatarLoader = new AvatarImageLoader();

export default {
  PHOTOREALISTIC_AVATARS,
  AVATAR_CATEGORIES,
  searchAvatars,
  getAvatarById,
  getRandomAvatar,
  preloadAvatarImages,
  avatarLoader
};
