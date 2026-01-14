/**
 * Nigerian Voice Library
 * Rich collection of Nigerian language voices with emotional expressions
 * Supports Igbo, Yoruba, Hausa, and Nigerian Pidgin with various emotions
 */

export interface NigerianVoice {
  id: string;
  name: string;
  displayName: string;
  language: NigerianLanguage;
  languageCode: string;
  gender: 'male' | 'female';
  ageGroup: 'young' | 'middle' | 'senior';
  voiceType: 'deep' | 'medium' | 'high' | 'soft' | 'strong';
  description: string;
  samplePhrases: VoicePhrase[];
  emotionSupport: EmotionType[];
  defaultPitch: number;
  defaultRate: number;
  accentStrength: 'light' | 'moderate' | 'strong';
}

export type NigerianLanguage = 'igbo' | 'yoruba' | 'hausa' | 'pidgin' | 'english';

export type EmotionType = 
  | 'neutral'
  | 'happy'
  | 'excited'
  | 'serious'
  | 'concerned'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'loving'
  | 'encouraging'
  | 'warning'
  | 'prayerful';

export interface VoicePhrase {
  text: string;
  translation: string;
  emotion: EmotionType;
  context: string;
}

export interface EmotionSettings {
  pitch: number;
  rate: number;
  volume: number;
  emphasis: 'low' | 'medium' | 'high';
}

// Emotion modifiers for voice synthesis
export const EMOTION_VOICE_SETTINGS: Record<EmotionType, EmotionSettings> = {
  neutral: { pitch: 1.0, rate: 1.0, volume: 1.0, emphasis: 'medium' },
  happy: { pitch: 1.15, rate: 1.1, volume: 1.0, emphasis: 'high' },
  excited: { pitch: 1.25, rate: 1.2, volume: 1.1, emphasis: 'high' },
  serious: { pitch: 0.9, rate: 0.9, volume: 1.0, emphasis: 'high' },
  concerned: { pitch: 0.95, rate: 0.95, volume: 0.95, emphasis: 'medium' },
  sad: { pitch: 0.85, rate: 0.8, volume: 0.85, emphasis: 'low' },
  angry: { pitch: 1.1, rate: 1.15, volume: 1.15, emphasis: 'high' },
  surprised: { pitch: 1.3, rate: 1.1, volume: 1.05, emphasis: 'high' },
  loving: { pitch: 1.05, rate: 0.9, volume: 0.9, emphasis: 'medium' },
  encouraging: { pitch: 1.1, rate: 1.0, volume: 1.0, emphasis: 'high' },
  warning: { pitch: 0.95, rate: 0.85, volume: 1.1, emphasis: 'high' },
  prayerful: { pitch: 0.9, rate: 0.8, volume: 0.85, emphasis: 'low' }
};

// ==================== IGBO VOICES ====================
const IGBO_VOICES: NigerianVoice[] = [
  {
    id: 'igbo-female-young-chioma',
    name: 'Chioma',
    displayName: 'Chioma (Igbo Female)',
    language: 'igbo',
    languageCode: 'ig-NG',
    gender: 'female',
    ageGroup: 'young',
    voiceType: 'high',
    description: 'Young, energetic Igbo female voice, perfect for youth content',
    samplePhrases: [
      { text: 'Nnọọ! Kedu ka ị mere?', translation: 'Welcome! How are you?', emotion: 'happy', context: 'greeting' },
      { text: 'Ọ dị mma, daalụ.', translation: 'I am fine, thank you.', emotion: 'neutral', context: 'response' },
      { text: 'Biko, gee m ntị!', translation: 'Please, listen to me!', emotion: 'serious', context: 'attention' },
      { text: 'Nke a dị oke mma!', translation: 'This is very good!', emotion: 'excited', context: 'appreciation' },
      { text: 'Ọ na-ewute m.', translation: 'I am sorry / It saddens me.', emotion: 'sad', context: 'sympathy' }
    ],
    emotionSupport: ['neutral', 'happy', 'excited', 'serious', 'concerned', 'sad', 'loving'],
    defaultPitch: 1.1,
    defaultRate: 1.0,
    accentStrength: 'moderate'
  },
  {
    id: 'igbo-female-middle-adaeze',
    name: 'Adaeze',
    displayName: 'Adaeze (Igbo Female)',
    language: 'igbo',
    languageCode: 'ig-NG',
    gender: 'female',
    ageGroup: 'middle',
    voiceType: 'medium',
    description: 'Mature, authoritative Igbo female voice, ideal for professional content',
    samplePhrases: [
      { text: 'Daalụ nke ukwuu maka ịbịa.', translation: 'Thank you very much for coming.', emotion: 'happy', context: 'welcome' },
      { text: 'Ka anyị kwurịta okwu banyere ahụike.', translation: "Let's discuss about health.", emotion: 'serious', context: 'medical' },
      { text: 'Ọ dị mkpa ka ị na-elekọta ahụ gị.', translation: 'It is important to take care of your body.', emotion: 'concerned', context: 'health_advice' },
      { text: 'Chineke gozie gị!', translation: 'God bless you!', emotion: 'loving', context: 'blessing' },
      { text: 'Nzọpụta dị nso!', translation: 'Help is near!', emotion: 'encouraging', context: 'encouragement' }
    ],
    emotionSupport: ['neutral', 'happy', 'serious', 'concerned', 'loving', 'encouraging', 'prayerful'],
    defaultPitch: 1.0,
    defaultRate: 0.95,
    accentStrength: 'strong'
  },
  {
    id: 'igbo-male-young-chidi',
    name: 'Chidi',
    displayName: 'Chidi (Igbo Male)',
    language: 'igbo',
    languageCode: 'ig-NG',
    gender: 'male',
    ageGroup: 'young',
    voiceType: 'medium',
    description: 'Young, friendly Igbo male voice for relatable content',
    samplePhrases: [
      { text: "Nna, kedu? Ihe niile ọ dị mma?", translation: "Bro, how are you? Is everything okay?", emotion: 'happy', context: 'casual_greeting' },
      { text: 'Ọ bụghị ihe egwu!', translation: "It's not a joke!", emotion: 'serious', context: 'warning' },
      { text: 'Anyị ga-emeri!', translation: 'We will win!', emotion: 'excited', context: 'motivation' },
      { text: "Nwanne, biko dere anya.", translation: "Brother, please be careful.", emotion: 'concerned', context: 'warning' },
      { text: 'Ọ tọrọ ụtọ nke ukwuu!', translation: 'It is very sweet/nice!', emotion: 'happy', context: 'appreciation' }
    ],
    emotionSupport: ['neutral', 'happy', 'excited', 'serious', 'concerned', 'surprised', 'encouraging'],
    defaultPitch: 0.95,
    defaultRate: 1.05,
    accentStrength: 'moderate'
  },
  {
    id: 'igbo-male-senior-obiora',
    name: 'Chief Obiora',
    displayName: 'Chief Obiora (Igbo Elder)',
    language: 'igbo',
    languageCode: 'ig-NG',
    gender: 'male',
    ageGroup: 'senior',
    voiceType: 'deep',
    description: 'Wise, authoritative Igbo elder voice for traditional content',
    samplePhrases: [
      { text: 'Ụmụ m, geenụ ntị nke ọma.', translation: 'My children, listen carefully.', emotion: 'serious', context: 'teaching' },
      { text: 'Nke a bụ omenala anyị.', translation: 'This is our tradition.', emotion: 'neutral', context: 'cultural' },
      { text: "Ndụ bụ ihe dị mkpa karịa ego.", translation: "Life is more important than money.", emotion: 'serious', context: 'wisdom' },
      { text: 'Ka Chukwu nyere anyị aka.', translation: 'May God help us.', emotion: 'prayerful', context: 'prayer' },
      { text: 'Unu emekwana nke a ọzọ!', translation: 'Do not do this again!', emotion: 'angry', context: 'warning' }
    ],
    emotionSupport: ['neutral', 'serious', 'concerned', 'angry', 'prayerful', 'loving', 'warning'],
    defaultPitch: 0.8,
    defaultRate: 0.85,
    accentStrength: 'strong'
  },
  {
    id: 'igbo-female-senior-mama',
    name: 'Mama Nkechi',
    displayName: 'Mama Nkechi (Igbo Elder)',
    language: 'igbo',
    languageCode: 'ig-NG',
    gender: 'female',
    ageGroup: 'senior',
    voiceType: 'soft',
    description: 'Warm, maternal Igbo grandmother voice',
    samplePhrases: [
      { text: 'Nwa m, bịa ebe a.', translation: 'My child, come here.', emotion: 'loving', context: 'calling' },
      { text: 'Ka m kọọrọ gị akụkọ.', translation: 'Let me tell you a story.', emotion: 'neutral', context: 'storytelling' },
      { text: 'Chukwu na-ahụ anya ihe niile.', translation: 'God sees everything.', emotion: 'prayerful', context: 'spiritual' },
      { text: 'Ọ ga-adị mma, nwa m.', translation: 'It will be fine, my child.', emotion: 'encouraging', context: 'comfort' },
      { text: 'Ị mụtara ihe ọhụrụ taa?', translation: 'Did you learn something new today?', emotion: 'happy', context: 'education' }
    ],
    emotionSupport: ['neutral', 'happy', 'loving', 'concerned', 'prayerful', 'encouraging', 'sad'],
    defaultPitch: 0.95,
    defaultRate: 0.8,
    accentStrength: 'strong'
  }
];

// ==================== YORUBA VOICES ====================
const YORUBA_VOICES: NigerianVoice[] = [
  {
    id: 'yoruba-female-young-adeola',
    name: 'Adeola',
    displayName: 'Adeola (Yoruba Female)',
    language: 'yoruba',
    languageCode: 'yo-NG',
    gender: 'female',
    ageGroup: 'young',
    voiceType: 'high',
    description: 'Young, vibrant Yoruba female voice',
    samplePhrases: [
      { text: 'Ẹ káàárọ̀! Báwo ni?', translation: 'Good morning! How are you?', emotion: 'happy', context: 'greeting' },
      { text: 'Mo wa dáadáa, ẹ ṣé.', translation: 'I am fine, thank you.', emotion: 'neutral', context: 'response' },
      { text: 'Ó dára púpọ̀!', translation: 'Very good!', emotion: 'excited', context: 'appreciation' },
      { text: 'Ẹ jọ̀wọ́, ẹ gbọ́ tèmi.', translation: 'Please, listen to me.', emotion: 'serious', context: 'attention' },
      { text: 'Inú mi dùn púpọ̀!', translation: 'I am very happy!', emotion: 'happy', context: 'joy' }
    ],
    emotionSupport: ['neutral', 'happy', 'excited', 'serious', 'loving', 'surprised'],
    defaultPitch: 1.1,
    defaultRate: 1.0,
    accentStrength: 'moderate'
  },
  {
    id: 'yoruba-female-middle-yetunde',
    name: 'Yetunde',
    displayName: 'Yetunde (Yoruba Female)',
    language: 'yoruba',
    languageCode: 'yo-NG',
    gender: 'female',
    ageGroup: 'middle',
    voiceType: 'medium',
    description: 'Professional, articulate Yoruba female voice',
    samplePhrases: [
      { text: 'Ẹ káàbọ̀ sí ilé ìwòsàn wa.', translation: 'Welcome to our hospital.', emotion: 'happy', context: 'medical_welcome' },
      { text: 'Ìlera ara yín ṣe pàtàkì.', translation: 'Your health is important.', emotion: 'serious', context: 'health' },
      { text: 'Ẹ máṣe páàánú, a ó ṣe ọ́ lọ́wọ́.', translation: "Don't worry, we will help you.", emotion: 'encouraging', context: 'reassurance' },
      { text: 'Ẹ tẹ̀lé àwọn ìlànà wọ̀nyí.', translation: 'Follow these instructions.', emotion: 'neutral', context: 'instruction' },
      { text: 'Ọlọ́run á bùkún yín.', translation: 'God will bless you.', emotion: 'prayerful', context: 'blessing' }
    ],
    emotionSupport: ['neutral', 'happy', 'serious', 'concerned', 'encouraging', 'prayerful'],
    defaultPitch: 1.0,
    defaultRate: 0.95,
    accentStrength: 'strong'
  },
  {
    id: 'yoruba-male-young-tunde',
    name: 'Tunde',
    displayName: 'Tunde (Yoruba Male)',
    language: 'yoruba',
    languageCode: 'yo-NG',
    gender: 'male',
    ageGroup: 'young',
    voiceType: 'medium',
    description: 'Friendly, energetic Yoruba male voice',
    samplePhrases: [
      { text: 'Ògbéni, báwo ni?', translation: 'Hey man, how are you?', emotion: 'happy', context: 'casual' },
      { text: "Kò sí wàhálà!", translation: "No problem!", emotion: 'happy', context: 'reassurance' },
      { text: 'A ó ṣègún!', translation: 'We will win!', emotion: 'excited', context: 'motivation' },
      { text: 'Ẹ ṣọ́ra o!', translation: 'Be careful!', emotion: 'warning', context: 'warning' },
      { text: 'Ẹ wá ra!', translation: 'Come and buy!', emotion: 'excited', context: 'commercial' }
    ],
    emotionSupport: ['neutral', 'happy', 'excited', 'warning', 'encouraging', 'surprised'],
    defaultPitch: 0.95,
    defaultRate: 1.05,
    accentStrength: 'moderate'
  },
  {
    id: 'yoruba-male-senior-baba',
    name: 'Baba Oladele',
    displayName: 'Baba Oladele (Yoruba Elder)',
    language: 'yoruba',
    languageCode: 'yo-NG',
    gender: 'male',
    ageGroup: 'senior',
    voiceType: 'deep',
    description: 'Wise, respected Yoruba elder voice',
    samplePhrases: [
      { text: 'Àwọn ọmọ mi, ẹ gbọ́ tèmi.', translation: 'My children, listen to me.', emotion: 'serious', context: 'teaching' },
      { text: 'Àṣà wa kò gbọdọ̀ kú.', translation: 'Our tradition must not die.', emotion: 'serious', context: 'cultural' },
      { text: "Ogbón ju agbára lọ.", translation: "Wisdom is greater than power.", emotion: 'neutral', context: 'wisdom' },
      { text: 'Kí Olódùmarè bùkún yín.', translation: 'May the Almighty bless you.', emotion: 'prayerful', context: 'blessing' },
      { text: 'Ẹ máṣe ṣe irú èyí mọ́!', translation: 'Do not do this again!', emotion: 'angry', context: 'reprimand' }
    ],
    emotionSupport: ['neutral', 'serious', 'angry', 'prayerful', 'concerned', 'warning'],
    defaultPitch: 0.8,
    defaultRate: 0.85,
    accentStrength: 'strong'
  },
  {
    id: 'yoruba-female-senior-iya',
    name: 'Iya Adunni',
    displayName: 'Iya Adunni (Yoruba Elder)',
    language: 'yoruba',
    languageCode: 'yo-NG',
    gender: 'female',
    ageGroup: 'senior',
    voiceType: 'soft',
    description: 'Warm, maternal Yoruba grandmother voice',
    samplePhrases: [
      { text: 'Ọmọ mi, wá síbí.', translation: 'My child, come here.', emotion: 'loving', context: 'calling' },
      { text: 'Ẹ jẹ́ kí n ṣe àlọ́ fún yín.', translation: 'Let me tell you a story.', emotion: 'neutral', context: 'storytelling' },
      { text: 'Ọlọ́run ń wo gbogbo wa.', translation: 'God is watching over all of us.', emotion: 'prayerful', context: 'spiritual' },
      { text: 'Ó máa dára, ọmọ mi.', translation: 'It will be fine, my child.', emotion: 'encouraging', context: 'comfort' },
      { text: 'Ṣé ẹ jẹun tán?', translation: 'Have you finished eating?', emotion: 'concerned', context: 'caring' }
    ],
    emotionSupport: ['neutral', 'happy', 'loving', 'concerned', 'prayerful', 'encouraging'],
    defaultPitch: 0.95,
    defaultRate: 0.8,
    accentStrength: 'strong'
  }
];

// ==================== HAUSA VOICES ====================
const HAUSA_VOICES: NigerianVoice[] = [
  {
    id: 'hausa-female-young-amina',
    name: 'Amina',
    displayName: 'Amina (Hausa Female)',
    language: 'hausa',
    languageCode: 'ha-NG',
    gender: 'female',
    ageGroup: 'young',
    voiceType: 'soft',
    description: 'Young, gentle Hausa female voice',
    samplePhrases: [
      { text: 'Sannu! Yaya kuke?', translation: 'Hello! How are you?', emotion: 'happy', context: 'greeting' },
      { text: 'Lafiya lau, na gode.', translation: 'Very well, thank you.', emotion: 'neutral', context: 'response' },
      { text: 'Da kyau sosai!', translation: 'Very good!', emotion: 'excited', context: 'appreciation' },
      { text: 'Don Allah, ku saurare ni.', translation: 'Please, listen to me.', emotion: 'serious', context: 'attention' },
      { text: 'Ina jin daɗi!', translation: 'I am happy!', emotion: 'happy', context: 'joy' }
    ],
    emotionSupport: ['neutral', 'happy', 'excited', 'serious', 'loving', 'concerned'],
    defaultPitch: 1.1,
    defaultRate: 0.95,
    accentStrength: 'moderate'
  },
  {
    id: 'hausa-female-middle-halima',
    name: 'Hajiya Halima',
    displayName: 'Hajiya Halima (Hausa Female)',
    language: 'hausa',
    languageCode: 'ha-NG',
    gender: 'female',
    ageGroup: 'middle',
    voiceType: 'medium',
    description: 'Respected, professional Hausa female voice',
    samplePhrases: [
      { text: 'Barka da zuwa asibitin mu.', translation: 'Welcome to our hospital.', emotion: 'happy', context: 'medical_welcome' },
      { text: "Lafiyar jikin ku yana da muhimmanci.", translation: 'Your health is important.', emotion: 'serious', context: 'health' },
      { text: 'Kada ku damu, za mu taimake ku.', translation: "Don't worry, we will help you.", emotion: 'encouraging', context: 'reassurance' },
      { text: 'Ku bi waɗannan umarni.', translation: 'Follow these instructions.', emotion: 'neutral', context: 'instruction' },
      { text: 'Allah ya yi muku albarka.', translation: 'May Allah bless you.', emotion: 'prayerful', context: 'blessing' }
    ],
    emotionSupport: ['neutral', 'happy', 'serious', 'concerned', 'encouraging', 'prayerful'],
    defaultPitch: 1.0,
    defaultRate: 0.9,
    accentStrength: 'strong'
  },
  {
    id: 'hausa-male-young-musa',
    name: 'Musa',
    displayName: 'Musa (Hausa Male)',
    language: 'hausa',
    languageCode: 'ha-NG',
    gender: 'male',
    ageGroup: 'young',
    voiceType: 'medium',
    description: 'Friendly, energetic Hausa male voice',
    samplePhrases: [
      { text: 'Yaya dai? Kome lafiya?', translation: 'How are you? Is everything okay?', emotion: 'happy', context: 'casual' },
      { text: 'Babu matsala!', translation: 'No problem!', emotion: 'happy', context: 'reassurance' },
      { text: 'Za mu yi nasara!', translation: 'We will succeed!', emotion: 'excited', context: 'motivation' },
      { text: 'Ku yi hankali!', translation: 'Be careful!', emotion: 'warning', context: 'warning' },
      { text: 'Ku zo ku saya!', translation: 'Come and buy!', emotion: 'excited', context: 'commercial' }
    ],
    emotionSupport: ['neutral', 'happy', 'excited', 'warning', 'encouraging', 'surprised'],
    defaultPitch: 0.95,
    defaultRate: 1.0,
    accentStrength: 'moderate'
  },
  {
    id: 'hausa-male-senior-alhaji',
    name: 'Alhaji Suleiman',
    displayName: 'Alhaji Suleiman (Hausa Elder)',
    language: 'hausa',
    languageCode: 'ha-NG',
    gender: 'male',
    ageGroup: 'senior',
    voiceType: 'deep',
    description: 'Wise, authoritative Hausa elder voice',
    samplePhrases: [
      { text: "Yan'uwa na, ku saurare ni.", translation: 'My brothers, listen to me.', emotion: 'serious', context: 'teaching' },
      { text: "Al'adunmu ba za su ɓace ba.", translation: 'Our traditions will not be lost.', emotion: 'serious', context: 'cultural' },
      { text: 'Hikima ta fi ƙarfi.', translation: 'Wisdom is greater than strength.', emotion: 'neutral', context: 'wisdom' },
      { text: 'Allah ya yi muku jagora.', translation: 'May Allah guide you.', emotion: 'prayerful', context: 'blessing' },
      { text: 'Kada ku ƙara yin haka!', translation: 'Do not do this again!', emotion: 'angry', context: 'reprimand' }
    ],
    emotionSupport: ['neutral', 'serious', 'angry', 'prayerful', 'concerned', 'warning'],
    defaultPitch: 0.75,
    defaultRate: 0.8,
    accentStrength: 'strong'
  },
  {
    id: 'hausa-female-senior-hajiya',
    name: 'Hajiya Fatima',
    displayName: 'Hajiya Fatima (Hausa Elder)',
    language: 'hausa',
    languageCode: 'ha-NG',
    gender: 'female',
    ageGroup: 'senior',
    voiceType: 'soft',
    description: 'Warm, maternal Hausa grandmother voice',
    samplePhrases: [
      { text: 'Ɗana, zo nan.', translation: 'My child, come here.', emotion: 'loving', context: 'calling' },
      { text: 'Bari in ba ka labari.', translation: 'Let me tell you a story.', emotion: 'neutral', context: 'storytelling' },
      { text: 'Allah yana ganin komai.', translation: 'Allah sees everything.', emotion: 'prayerful', context: 'spiritual' },
      { text: 'Za a yi, ɗana.', translation: 'It will be done, my child.', emotion: 'encouraging', context: 'comfort' },
      { text: 'Kun gama cin abinci?', translation: 'Have you finished eating?', emotion: 'concerned', context: 'caring' }
    ],
    emotionSupport: ['neutral', 'happy', 'loving', 'concerned', 'prayerful', 'encouraging'],
    defaultPitch: 0.9,
    defaultRate: 0.75,
    accentStrength: 'strong'
  }
];

// ==================== NIGERIAN PIDGIN VOICES ====================
const PIDGIN_VOICES: NigerianVoice[] = [
  {
    id: 'pidgin-female-young-blessing',
    name: 'Blessing',
    displayName: 'Blessing (Pidgin Female)',
    language: 'pidgin',
    languageCode: 'pcm-NG',
    gender: 'female',
    ageGroup: 'young',
    voiceType: 'high',
    description: 'Young, vibrant Nigerian Pidgin female voice',
    samplePhrases: [
      { text: 'How far? How body?', translation: "Hey! How are you doing?", emotion: 'happy', context: 'greeting' },
      { text: 'I dey fine, no wahala.', translation: "I'm fine, no problem.", emotion: 'neutral', context: 'response' },
      { text: 'E sweet die!', translation: "It's so sweet/nice!", emotion: 'excited', context: 'appreciation' },
      { text: 'Abeg, hear me now!', translation: 'Please, listen to me now!', emotion: 'serious', context: 'attention' },
      { text: 'I dey happy well well!', translation: 'I am very happy!', emotion: 'happy', context: 'joy' }
    ],
    emotionSupport: ['neutral', 'happy', 'excited', 'serious', 'surprised', 'angry'],
    defaultPitch: 1.15,
    defaultRate: 1.1,
    accentStrength: 'strong'
  },
  {
    id: 'pidgin-male-young-emeka',
    name: 'Emeka',
    displayName: 'Emeka (Pidgin Male)',
    language: 'pidgin',
    languageCode: 'pcm-NG',
    gender: 'male',
    ageGroup: 'young',
    voiceType: 'medium',
    description: 'Energetic, relatable Nigerian Pidgin male voice',
    samplePhrases: [
      { text: 'Wetin dey happen?', translation: "What's going on?", emotion: 'neutral', context: 'casual' },
      { text: 'No worry, e go better!', translation: "Don't worry, it will get better!", emotion: 'encouraging', context: 'encouragement' },
      { text: 'Na we go win!', translation: 'We will win!', emotion: 'excited', context: 'motivation' },
      { text: 'Sharp sharp, make we go!', translation: 'Quickly, let us go!', emotion: 'excited', context: 'urgency' },
      { text: 'This thing sweet me die!', translation: 'I really love this!', emotion: 'happy', context: 'appreciation' }
    ],
    emotionSupport: ['neutral', 'happy', 'excited', 'encouraging', 'warning', 'surprised'],
    defaultPitch: 0.95,
    defaultRate: 1.1,
    accentStrength: 'strong'
  },
  {
    id: 'pidgin-female-middle-ngozi',
    name: 'Ngozi',
    displayName: 'Ngozi (Pidgin Female)',
    language: 'pidgin',
    languageCode: 'pcm-NG',
    gender: 'female',
    ageGroup: 'middle',
    voiceType: 'medium',
    description: 'Mature, friendly Nigerian Pidgin female voice',
    samplePhrases: [
      { text: 'Welcome o! How una dey?', translation: 'Welcome! How are you all?', emotion: 'happy', context: 'welcome' },
      { text: 'Make una take care of una body o.', translation: 'Please take care of your health.', emotion: 'concerned', context: 'health' },
      { text: 'This one important well well.', translation: 'This is very important.', emotion: 'serious', context: 'emphasis' },
      { text: 'God go bless una.', translation: 'God will bless you.', emotion: 'prayerful', context: 'blessing' },
      { text: 'No fear, everything go dey alright.', translation: "Don't be afraid, everything will be alright.", emotion: 'encouraging', context: 'reassurance' }
    ],
    emotionSupport: ['neutral', 'happy', 'serious', 'concerned', 'prayerful', 'encouraging'],
    defaultPitch: 1.0,
    defaultRate: 1.0,
    accentStrength: 'strong'
  },
  {
    id: 'pidgin-male-middle-sunday',
    name: 'Sunday',
    displayName: 'Sunday (Pidgin Male)',
    language: 'pidgin',
    languageCode: 'pcm-NG',
    gender: 'male',
    ageGroup: 'middle',
    voiceType: 'deep',
    description: 'Deep, authoritative Nigerian Pidgin male voice',
    samplePhrases: [
      { text: 'Bros, how far na?', translation: 'Brother, how are you?', emotion: 'happy', context: 'casual' },
      { text: 'Make una listen well well o.', translation: 'Please listen carefully.', emotion: 'serious', context: 'attention' },
      { text: 'This medicine go help you.', translation: 'This medicine will help you.', emotion: 'encouraging', context: 'medical' },
      { text: 'Wahala no dey finish for this life.', translation: 'Problems never end in this life.', emotion: 'concerned', context: 'philosophical' },
      { text: 'We go dey together!', translation: "We'll be together!", emotion: 'happy', context: 'solidarity' }
    ],
    emotionSupport: ['neutral', 'happy', 'serious', 'concerned', 'encouraging', 'warning'],
    defaultPitch: 0.85,
    defaultRate: 0.95,
    accentStrength: 'strong'
  }
];

// ==================== NIGERIAN ENGLISH VOICES ====================
const ENGLISH_VOICES: NigerianVoice[] = [
  {
    id: 'english-female-professional',
    name: 'Dr. Chidinma',
    displayName: 'Dr. Chidinma (Nigerian English)',
    language: 'english',
    languageCode: 'en-NG',
    gender: 'female',
    ageGroup: 'middle',
    voiceType: 'medium',
    description: 'Professional Nigerian English female voice',
    samplePhrases: [
      { text: 'Good morning and welcome to our facility.', translation: 'Good morning and welcome to our facility.', emotion: 'happy', context: 'welcome' },
      { text: 'Your health is our top priority.', translation: 'Your health is our top priority.', emotion: 'serious', context: 'medical' },
      { text: 'Please follow these instructions carefully.', translation: 'Please follow these instructions carefully.', emotion: 'neutral', context: 'instruction' },
      { text: "Don't worry, we are here to help you.", translation: "Don't worry, we are here to help you.", emotion: 'encouraging', context: 'reassurance' },
      { text: 'Thank you for choosing our services.', translation: 'Thank you for choosing our services.', emotion: 'happy', context: 'appreciation' }
    ],
    emotionSupport: ['neutral', 'happy', 'serious', 'concerned', 'encouraging', 'excited'],
    defaultPitch: 1.0,
    defaultRate: 1.0,
    accentStrength: 'light'
  },
  {
    id: 'english-male-professional',
    name: 'Dr. Olumide',
    displayName: 'Dr. Olumide (Nigerian English)',
    language: 'english',
    languageCode: 'en-NG',
    gender: 'male',
    ageGroup: 'middle',
    voiceType: 'deep',
    description: 'Authoritative Nigerian English male voice',
    samplePhrases: [
      { text: 'Welcome, let me explain the procedure.', translation: 'Welcome, let me explain the procedure.', emotion: 'neutral', context: 'medical' },
      { text: 'This is a critical matter that requires attention.', translation: 'This is a critical matter that requires attention.', emotion: 'serious', context: 'warning' },
      { text: 'I am confident that you will recover fully.', translation: 'I am confident that you will recover fully.', emotion: 'encouraging', context: 'reassurance' },
      { text: 'Please ensure you take your medications as prescribed.', translation: 'Please ensure you take your medications as prescribed.', emotion: 'serious', context: 'instruction' },
      { text: 'It gives me great pleasure to announce this.', translation: 'It gives me great pleasure to announce this.', emotion: 'happy', context: 'announcement' }
    ],
    emotionSupport: ['neutral', 'happy', 'serious', 'concerned', 'encouraging', 'warning'],
    defaultPitch: 0.9,
    defaultRate: 0.95,
    accentStrength: 'light'
  }
];

// Combine all voices
export const NIGERIAN_VOICE_LIBRARY: NigerianVoice[] = [
  ...IGBO_VOICES,
  ...YORUBA_VOICES,
  ...HAUSA_VOICES,
  ...PIDGIN_VOICES,
  ...ENGLISH_VOICES
];

// Language categories for filtering
export const LANGUAGE_CATEGORIES = [
  { id: 'all', name: 'All Languages', icon: '🗣️', count: NIGERIAN_VOICE_LIBRARY.length },
  { id: 'igbo', name: 'Igbo', icon: '🇳🇬', count: IGBO_VOICES.length },
  { id: 'yoruba', name: 'Yorùbá', icon: '🇳🇬', count: YORUBA_VOICES.length },
  { id: 'hausa', name: 'Hausa', icon: '🇳🇬', count: HAUSA_VOICES.length },
  { id: 'pidgin', name: 'Nigerian Pidgin', icon: '🇳🇬', count: PIDGIN_VOICES.length },
  { id: 'english', name: 'Nigerian English', icon: '🇳🇬', count: ENGLISH_VOICES.length }
];

// Common phrases by context
export const COMMON_PHRASES: Record<string, VoicePhrase[]> = {
  greetings: [
    { text: 'Nnọọ!', translation: 'Welcome! (Igbo)', emotion: 'happy', context: 'igbo_greeting' },
    { text: 'Ẹ káàárọ̀!', translation: 'Good morning! (Yoruba)', emotion: 'happy', context: 'yoruba_greeting' },
    { text: 'Sannu!', translation: 'Hello! (Hausa)', emotion: 'happy', context: 'hausa_greeting' },
    { text: 'How far!', translation: 'Hey there! (Pidgin)', emotion: 'happy', context: 'pidgin_greeting' }
  ],
  medical: [
    { text: 'Ka anyị kwurịta okwu banyere ahụike.', translation: "Let's discuss health. (Igbo)", emotion: 'serious', context: 'igbo_medical' },
    { text: 'Ìlera ara yín ṣe pàtàkì.', translation: 'Your health is important. (Yoruba)', emotion: 'serious', context: 'yoruba_medical' },
    { text: "Lafiyar jikin ku yana da muhimmanci.", translation: 'Your health is important. (Hausa)', emotion: 'serious', context: 'hausa_medical' },
    { text: 'Make una take care of una body o.', translation: 'Take care of your health. (Pidgin)', emotion: 'concerned', context: 'pidgin_medical' }
  ],
  encouragement: [
    { text: 'Ọ ga-adị mma!', translation: 'It will be fine! (Igbo)', emotion: 'encouraging', context: 'igbo_encourage' },
    { text: 'Ó máa dára!', translation: 'It will be fine! (Yoruba)', emotion: 'encouraging', context: 'yoruba_encourage' },
    { text: 'Za a yi!', translation: 'It will be done! (Hausa)', emotion: 'encouraging', context: 'hausa_encourage' },
    { text: 'E go better!', translation: 'It will get better! (Pidgin)', emotion: 'encouraging', context: 'pidgin_encourage' }
  ],
  blessings: [
    { text: 'Chineke gozie gị!', translation: 'God bless you! (Igbo)', emotion: 'prayerful', context: 'igbo_blessing' },
    { text: 'Ọlọ́run á bùkún yín!', translation: 'God will bless you! (Yoruba)', emotion: 'prayerful', context: 'yoruba_blessing' },
    { text: 'Allah ya yi muku albarka!', translation: 'May Allah bless you! (Hausa)', emotion: 'prayerful', context: 'hausa_blessing' },
    { text: 'God go bless una!', translation: 'God will bless you! (Pidgin)', emotion: 'prayerful', context: 'pidgin_blessing' }
  ]
};

// Helper functions
export const getVoicesByLanguage = (language: string): NigerianVoice[] => {
  if (language === 'all') return NIGERIAN_VOICE_LIBRARY;
  return NIGERIAN_VOICE_LIBRARY.filter(v => v.language === language);
};

export const getVoicesByGender = (gender: 'male' | 'female'): NigerianVoice[] => {
  return NIGERIAN_VOICE_LIBRARY.filter(v => v.gender === gender);
};

export const getVoicesByAgeGroup = (ageGroup: NigerianVoice['ageGroup']): NigerianVoice[] => {
  return NIGERIAN_VOICE_LIBRARY.filter(v => v.ageGroup === ageGroup);
};

export const getVoicesWithEmotion = (emotion: EmotionType): NigerianVoice[] => {
  return NIGERIAN_VOICE_LIBRARY.filter(v => v.emotionSupport.includes(emotion));
};

export const searchVoices = (query: string): NigerianVoice[] => {
  const lowerQuery = query.toLowerCase();
  return NIGERIAN_VOICE_LIBRARY.filter(v =>
    v.name.toLowerCase().includes(lowerQuery) ||
    v.displayName.toLowerCase().includes(lowerQuery) ||
    v.language.toLowerCase().includes(lowerQuery) ||
    v.description.toLowerCase().includes(lowerQuery)
  );
};

// Apply emotion settings to voice parameters
export const applyEmotionToVoice = (
  voice: NigerianVoice,
  emotion: EmotionType
): { pitch: number; rate: number; volume: number } => {
  const emotionSettings = EMOTION_VOICE_SETTINGS[emotion];
  return {
    pitch: voice.defaultPitch * emotionSettings.pitch,
    rate: voice.defaultRate * emotionSettings.rate,
    volume: emotionSettings.volume
  };
};

export default NIGERIAN_VOICE_LIBRARY;
