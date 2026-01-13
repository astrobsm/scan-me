/**
 * CHARLES-DOUGLAS SCAN APP
 * Nigerian Languages Translation Page
 */

import React, { useState, useEffect, useCallback } from 'react';
import './TranslationPage.css';

// Nigerian language types and data
type NigerianLanguage = 'igbo' | 'hausa' | 'yoruba' | 'pidgin' | 'english';

interface LanguageInfo {
  code: NigerianLanguage;
  name: string;
  nativeName: string;
  voiceCode: string;
  flag: string;
}

interface PhraseEntry {
  key: string;
  translations: Record<NigerianLanguage, string>;
}

const NIGERIAN_LANGUAGES: LanguageInfo[] = [
  { code: 'english', name: 'English', nativeName: 'English', voiceCode: 'en-NG', flag: '🇬🇧' },
  { code: 'igbo', name: 'Igbo', nativeName: 'Asụsụ Igbo', voiceCode: 'ig-NG', flag: '🇳🇬' },
  { code: 'hausa', name: 'Hausa', nativeName: 'Harshen Hausa', voiceCode: 'ha-NG', flag: '🇳🇬' },
  { code: 'yoruba', name: 'Yoruba', nativeName: 'Èdè Yorùbá', voiceCode: 'yo-NG', flag: '🇳🇬' },
  { code: 'pidgin', name: 'Nigerian Pidgin', nativeName: 'Naijá', voiceCode: 'pcm-NG', flag: '🇳🇬' },
];

// Common phrases dictionary
const PHRASE_DICTIONARY: Record<string, Record<NigerianLanguage, string>> = {
  'hello': { english: 'Hello', igbo: 'Nnọọ', hausa: 'Sannu', yoruba: 'Ẹ káàárọ̀', pidgin: 'How far' },
  'good morning': { english: 'Good morning', igbo: 'Ụtụtụ ọma', hausa: 'Ina kwana', yoruba: 'Ẹ káàárọ̀', pidgin: 'Good morning o' },
  'good afternoon': { english: 'Good afternoon', igbo: 'Ehihie ọma', hausa: 'Ina wuni', yoruba: 'Ẹ káàsán', pidgin: 'Good afternoon o' },
  'good evening': { english: 'Good evening', igbo: 'Mgbede ọma', hausa: 'Ina yini', yoruba: 'Ẹ kúùrọ̀lẹ́', pidgin: 'Good evening o' },
  'good night': { english: 'Good night', igbo: 'Ka chi fọ', hausa: 'Sai da safe', yoruba: 'Ó dàárọ̀', pidgin: 'Good night o' },
  'how are you': { english: 'How are you?', igbo: 'Kedu ka ị mere?', hausa: 'Yaya kake?', yoruba: 'Ṣé àlàáfíà ni?', pidgin: 'How you dey?' },
  'i am fine': { english: 'I am fine', igbo: 'Adị m mma', hausa: 'Lafiya lau', yoruba: 'Mo wà dáadáa', pidgin: 'I dey okay' },
  'thank you': { english: 'Thank you', igbo: 'Daalụ', hausa: 'Na gode', yoruba: 'Ẹ ṣé', pidgin: 'Thank you well well' },
  'please': { english: 'Please', igbo: 'Biko', hausa: 'Don Allah', yoruba: 'Ẹ jọ̀wọ́', pidgin: 'Abeg' },
  'sorry': { english: 'Sorry', igbo: 'Ndo', hausa: 'Yi hakuri', yoruba: 'Má bínú', pidgin: 'Sorry o' },
  'yes': { english: 'Yes', igbo: 'Ee', hausa: 'Eh', yoruba: 'Bẹ́ẹ̀ ni', pidgin: 'Yes na' },
  'no': { english: 'No', igbo: 'Mba', hausa: "A'a", yoruba: 'Rárá', pidgin: 'No be so' },
  'goodbye': { english: 'Goodbye', igbo: 'Ka ọ dị', hausa: 'Sai anjima', yoruba: 'Ó dàbọ̀', pidgin: 'I dey go' },
  'welcome': { english: 'Welcome', igbo: 'Nnọọ', hausa: 'Maraba', yoruba: 'Ẹ káàbọ̀', pidgin: 'You are welcome' },
  'what is your name': { english: 'What is your name?', igbo: 'Kedụ aha gị?', hausa: 'Menene sunanka?', yoruba: 'Kí ni orúkọ rẹ?', pidgin: 'Wetin be your name?' },
  'my name is': { english: 'My name is', igbo: 'Aha m bụ', hausa: 'Sunana', yoruba: 'Orúkọ mi ni', pidgin: 'My name na' },
  'i love you': { english: 'I love you', igbo: "Ahụrụ m gị n'anya", hausa: 'Ina son ka', yoruba: 'Mo nífẹ̀ẹ́ rẹ', pidgin: 'I love you die' },
  'i am hungry': { english: 'I am hungry', igbo: 'Agụụ na-agụ m', hausa: 'Ina jin yunwa', yoruba: 'Ebi n pa mí', pidgin: 'Hunger dey catch me' },
  'i am thirsty': { english: 'I am thirsty', igbo: 'Akpịrị kpọrọ m nkụ', hausa: 'Ina jin ƙishirwa', yoruba: 'Òǹgbẹ n gbẹ mí', pidgin: 'Thirst dey catch me' },
  'where is': { english: 'Where is', igbo: 'Ebee ka', hausa: 'Ina ne', yoruba: 'Níbo ni', pidgin: 'Where' },
  'how much': { english: 'How much?', igbo: 'Ego ole?', hausa: 'Nawa ne?', yoruba: 'Ẹlo ni?', pidgin: 'How much?' },
  'i want': { english: 'I want', igbo: 'Achọrọ m', hausa: 'Ina so', yoruba: 'Mo fẹ́', pidgin: 'I wan' },
  'i need help': { english: 'I need help', igbo: 'Achọrọ m enyemaka', hausa: 'Ina bukatar taimako', yoruba: 'Mo nílò ìrànlọ́wọ́', pidgin: 'I need help o' },
  'come here': { english: 'Come here', igbo: 'Bịa ebe a', hausa: 'Zo nan', yoruba: 'Wá síbí', pidgin: 'Come here' },
  'go away': { english: 'Go away', igbo: 'Pụọ', hausa: 'Tafi', yoruba: 'Lọ kúrò', pidgin: 'Comot here' },
  'wait': { english: 'Wait', igbo: 'Chere', hausa: 'Jira', yoruba: 'Dúró', pidgin: 'Wait small' },
  'stop': { english: 'Stop', igbo: 'Kwụsị', hausa: 'Tsaya', yoruba: 'Dúró', pidgin: 'Stop am' },
  'one': { english: 'One', igbo: 'Otu', hausa: 'Ɗaya', yoruba: 'Ọ̀kan', pidgin: 'One' },
  'two': { english: 'Two', igbo: 'Abụọ', hausa: 'Biyu', yoruba: 'Èjì', pidgin: 'Two' },
  'three': { english: 'Three', igbo: 'Atọ', hausa: 'Uku', yoruba: 'Ẹ̀ta', pidgin: 'Three' },
  'four': { english: 'Four', igbo: 'Anọ', hausa: 'Huɗu', yoruba: 'Ẹ̀rin', pidgin: 'Four' },
  'five': { english: 'Five', igbo: 'Ise', hausa: 'Biyar', yoruba: 'Àrún', pidgin: 'Five' },
  'six': { english: 'Six', igbo: 'Isii', hausa: 'Shida', yoruba: 'Ẹ̀fà', pidgin: 'Six' },
  'seven': { english: 'Seven', igbo: 'Asaa', hausa: 'Bakwai', yoruba: 'Èje', pidgin: 'Seven' },
  'eight': { english: 'Eight', igbo: 'Asatọ', hausa: 'Takwas', yoruba: 'Ẹ̀jọ', pidgin: 'Eight' },
  'nine': { english: 'Nine', igbo: 'Itoolu', hausa: 'Tara', yoruba: 'Ẹ̀sán', pidgin: 'Nine' },
  'ten': { english: 'Ten', igbo: 'Iri', hausa: 'Goma', yoruba: 'Ẹ̀wá', pidgin: 'Ten' },
  'i am sick': { english: 'I am sick', igbo: 'Arịa na-arịa m', hausa: 'Ina ciwo', yoruba: 'Mo ṣàìsàn', pidgin: 'Sickness dey worry me' },
  'hospital': { english: 'Hospital', igbo: 'Ụlọ ọgwụ', hausa: 'Asibiti', yoruba: 'Ilé ìwòsàn', pidgin: 'Hospital' },
  'doctor': { english: 'Doctor', igbo: 'Dọkịta', hausa: 'Likita', yoruba: 'Dókítà', pidgin: 'Doctor' },
  'medicine': { english: 'Medicine', igbo: 'Ọgwụ', hausa: 'Magani', yoruba: 'Oògùn', pidgin: 'Medicine' },
  'pain': { english: 'Pain', igbo: 'Ụfụ', hausa: 'Ciwo', yoruba: 'Ìrora', pidgin: 'Pain' },
  'headache': { english: 'Headache', igbo: 'Isi ọwụwa', hausa: 'Ciwon kai', yoruba: 'Orí fífọ́', pidgin: 'Head dey pain me' },
  'fever': { english: 'Fever', igbo: 'Ahụ ọkụ', hausa: 'Zazzabi', yoruba: 'Ibà', pidgin: 'Body dey hot' },
  'food': { english: 'Food', igbo: 'Nri', hausa: 'Abinci', yoruba: 'Oúnjẹ', pidgin: 'Chop' },
  'water': { english: 'Water', igbo: 'Mmiri', hausa: 'Ruwa', yoruba: 'Omi', pidgin: 'Water' },
  'rice': { english: 'Rice', igbo: 'Osikapa', hausa: 'Shinkafa', yoruba: 'Ìrẹsì', pidgin: 'Rice' },
  'mother': { english: 'Mother', igbo: 'Nne', hausa: 'Uwa', yoruba: 'Ìyá', pidgin: 'Mama' },
  'father': { english: 'Father', igbo: 'Nna', hausa: 'Uba', yoruba: 'Bàbá', pidgin: 'Papa' },
  'child': { english: 'Child', igbo: 'Nwa', hausa: 'Yaro', yoruba: 'Ọmọ', pidgin: 'Pikin' },
  'family': { english: 'Family', igbo: 'Ezinụlọ', hausa: 'Iyali', yoruba: 'Ẹbí', pidgin: 'Family' },
  'friend': { english: 'Friend', igbo: 'Enyi', hausa: 'Aboki', yoruba: 'Ọ̀rẹ́', pidgin: 'Paddy' },
  'today': { english: 'Today', igbo: 'Taa', hausa: 'Yau', yoruba: 'Òní', pidgin: 'Today' },
  'tomorrow': { english: 'Tomorrow', igbo: 'Echi', hausa: 'Gobe', yoruba: 'Ọ̀la', pidgin: 'Tomorrow' },
  'yesterday': { english: 'Yesterday', igbo: 'Ụnyaahụ', hausa: 'Jiya', yoruba: 'Àná', pidgin: 'Yesterday' },
  'no wahala': { english: 'No problem', igbo: 'Enweghị nsogbu', hausa: 'Babu matsala', yoruba: 'Kò sí wàhálà', pidgin: 'No wahala' },
  'wetin dey happen': { english: 'What is happening?', igbo: 'Kedu ihe na-eme?', hausa: 'Mene ne ke faruwa?', yoruba: 'Kí ló n ṣẹlẹ̀?', pidgin: 'Wetin dey happen?' },
  'i no sabi': { english: "I don't know", igbo: 'Amaghị m', hausa: 'Ban sani ba', yoruba: 'N kò mọ̀', pidgin: 'I no sabi' },
  'make we go': { english: "Let's go", igbo: 'Ka anyị gaa', hausa: 'Mu tafi', yoruba: 'Ẹ jẹ́ ká lọ', pidgin: 'Make we go' },
  'e don do': { english: "It's enough", igbo: 'O zuru', hausa: 'Ya isa', yoruba: 'Ó ti tó', pidgin: 'E don do' },
  'na so': { english: "That's right", igbo: 'Ọ bụ eziokwu', hausa: 'Haka ne', yoruba: 'Bẹ́ẹ̀ ni', pidgin: 'Na so' },
  'i dey come': { english: 'I am coming', igbo: 'Ana m abịa', hausa: 'Ina zuwa', yoruba: 'Mo n bọ̀', pidgin: 'I dey come' },
  'sharp sharp': { english: 'Quickly', igbo: 'Ngwa ngwa', hausa: 'Da sauri', yoruba: 'Kíákíá', pidgin: 'Sharp sharp' },
};

// Helper function to get phrases
const getCommonPhrases = (): PhraseEntry[] => {
  return Object.entries(PHRASE_DICTIONARY).map(([key, translations]) => ({
    key,
    translations,
  }));
};

// Translation function
const translateText = async (
  text: string,
  sourceLanguage: NigerianLanguage,
  targetLanguage: NigerianLanguage
): Promise<{ translatedText: string; confidence: number }> => {
  if (sourceLanguage === targetLanguage) {
    return { translatedText: text, confidence: 1.0 };
  }

  const normalizedText = text.toLowerCase().trim();

  // Check for exact phrase match
  if (PHRASE_DICTIONARY[normalizedText]) {
    const translation = PHRASE_DICTIONARY[normalizedText][targetLanguage];
    if (translation) {
      return { translatedText: translation, confidence: 0.95 };
    }
  }

  // Try to find the source phrase by matching in source language
  for (const [, translations] of Object.entries(PHRASE_DICTIONARY)) {
    if (translations[sourceLanguage].toLowerCase() === normalizedText) {
      return { translatedText: translations[targetLanguage], confidence: 0.9 };
    }
  }

  // Word-by-word translation for longer texts
  const words = text.split(/\s+/);
  const translatedWords: string[] = [];
  let totalConfidence = 0;
  let matchedWords = 0;

  for (const word of words) {
    const normalizedWord = word.toLowerCase().replace(/[.,!?]/g, '');
    let translated = false;

    if (PHRASE_DICTIONARY[normalizedWord]) {
      translatedWords.push(PHRASE_DICTIONARY[normalizedWord][targetLanguage]);
      totalConfidence += 0.9;
      matchedWords++;
      translated = true;
    }

    if (!translated) {
      for (const translations of Object.values(PHRASE_DICTIONARY)) {
        if (translations[sourceLanguage].toLowerCase() === normalizedWord) {
          translatedWords.push(translations[targetLanguage]);
          totalConfidence += 0.85;
          matchedWords++;
          translated = true;
          break;
        }
      }
    }

    if (!translated) {
      translatedWords.push(word);
      totalConfidence += 0.3;
      matchedWords++;
    }
  }

  return {
    translatedText: translatedWords.join(' '),
    confidence: matchedWords > 0 ? totalConfidence / matchedWords : 0,
  };
};

export const TranslationPage: React.FC = () => {
  const [sourceLanguage, setSourceLanguage] = useState<NigerianLanguage>('english');
  const [targetLanguage, setTargetLanguage] = useState<NigerianLanguage>('igbo');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('greetings');
  const [stopListening, setStopListening] = useState<(() => void) | null>(null);

  const categories = [
    { id: 'greetings', name: 'Greetings', icon: '👋' },
    { id: 'common', name: 'Common Phrases', icon: '💬' },
    { id: 'numbers', name: 'Numbers', icon: '🔢' },
    { id: 'medical', name: 'Medical', icon: '🏥' },
    { id: 'food', name: 'Food & Drinks', icon: '🍲' },
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'time', name: 'Time', icon: '⏰' },
    { id: 'pidgin', name: 'Pidgin Expressions', icon: '🇳🇬' },
  ];

  const phrases = getCommonPhrases();

  const getCategoryPhrases = (): PhraseEntry[] => {
    const categoryKeywords: Record<string, string[]> = {
      greetings: ['hello', 'good morning', 'good afternoon', 'good evening', 'good night', 'how are you', 'i am fine', 'goodbye', 'welcome'],
      common: ['thank you', 'please', 'sorry', 'yes', 'no', 'what is your name', 'my name is', 'i love you', 'wait', 'stop', 'come here', 'go away'],
      numbers: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
      medical: ['i am sick', 'hospital', 'doctor', 'medicine', 'pain', 'headache', 'fever', 'i need help'],
      food: ['i am hungry', 'i am thirsty', 'food', 'water', 'rice'],
      family: ['mother', 'father', 'child', 'family', 'friend'],
      time: ['today', 'tomorrow', 'yesterday'],
      pidgin: ['no wahala', 'wetin dey happen', 'i no sabi', 'make we go', 'e don do', 'na so', 'i dey come', 'sharp sharp'],
    };

    const keywords = categoryKeywords[selectedCategory] || [];
    return phrases.filter((p: PhraseEntry) => keywords.includes(p.key));
  };

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    try {
      const result = await translateText(inputText, sourceLanguage, targetLanguage);
      setTranslatedText(result.translatedText);
      setConfidence(result.confidence);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, sourceLanguage, targetLanguage]);

  // Auto-translate when input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.trim()) {
        handleTranslate();
      } else {
        setTranslatedText('');
        setConfidence(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputText, handleTranslate]);

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  // Speech synthesis
  const handleSpeak = async (text: string, language: NigerianLanguage) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const langInfo = NIGERIAN_LANGUAGES.find((l: LanguageInfo) => l.code === language);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langInfo?.voiceCode || 'en-NG';
    utterance.rate = 0.9;

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Speech recognition
  const handleListen = () => {
    if (isListening && stopListening) {
      stopListening();
      setStopListening(null);
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    const langInfo = NIGERIAN_LANGUAGES.find((l: LanguageInfo) => l.code === sourceLanguage);
    recognition.lang = langInfo?.voiceCode || 'en-NG';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInputText((prev: string) => prev + ' ' + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    setIsListening(true);
    recognition.start();
    setStopListening(() => () => recognition.stop());
  };

  const handlePhraseClick = (phrase: PhraseEntry) => {
    setInputText(phrase.translations[sourceLanguage]);
    setTranslatedText(phrase.translations[targetLanguage]);
    setConfidence(0.95);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const getLanguageInfo = (code: NigerianLanguage): LanguageInfo => {
    return NIGERIAN_LANGUAGES.find((l: LanguageInfo) => l.code === code)!;
  };

  return (
    <div className="translation-page">
      <div className="translation-header">
        <h1>🇳🇬 Nigerian Languages</h1>
        <p>Translate between Igbo, Hausa, Yoruba, Pidgin English</p>
      </div>

      <div className="translation-container">
        {/* Language Selector */}
        <div className="language-selector">
          <div className="language-dropdown">
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value as NigerianLanguage)}
            >
              {NIGERIAN_LANGUAGES.map((lang: LanguageInfo) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <button className="swap-button" onClick={handleSwapLanguages} title="Swap languages">
            ⇄
          </button>

          <div className="language-dropdown">
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value as NigerianLanguage)}
            >
              {NIGERIAN_LANGUAGES.map((lang: LanguageInfo) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Translation Boxes */}
        <div className="translation-boxes">
          {/* Source */}
          <div className="translation-box source-box">
            <div className="box-header">
              <span className="lang-label">
                {getLanguageInfo(sourceLanguage).flag} {getLanguageInfo(sourceLanguage).name}
              </span>
              <div className="box-actions">
                <button
                  className={`action-btn ${isListening ? 'active' : ''}`}
                  onClick={handleListen}
                  title="Voice input"
                >
                  🎤
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleSpeak(inputText, sourceLanguage)}
                  disabled={!inputText}
                  title="Listen"
                >
                  🔊
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleCopy(inputText)}
                  disabled={!inputText}
                  title="Copy"
                >
                  📋
                </button>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter text in ${getLanguageInfo(sourceLanguage).name}...`}
              rows={6}
            />
            {isListening && (
              <div className="listening-indicator">
                <span className="pulse"></span>
                Listening...
              </div>
            )}
          </div>

          {/* Target */}
          <div className="translation-box target-box">
            <div className="box-header">
              <span className="lang-label">
                {getLanguageInfo(targetLanguage).flag} {getLanguageInfo(targetLanguage).name}
              </span>
              <div className="box-actions">
                <button
                  className={`action-btn ${isSpeaking ? 'active' : ''}`}
                  onClick={() => handleSpeak(translatedText, targetLanguage)}
                  disabled={!translatedText}
                  title="Listen"
                >
                  {isSpeaking ? '⏹️' : '🔊'}
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleCopy(translatedText)}
                  disabled={!translatedText}
                  title="Copy"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="translated-text">
              {isTranslating ? (
                <div className="translating">Translating...</div>
              ) : (
                translatedText || <span className="placeholder">Translation will appear here...</span>
              )}
            </div>
            {confidence !== null && confidence > 0 && (
              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${confidence * 100}%` }}
                />
                <span className="confidence-label">
                  {Math.round(confidence * 100)}% confidence
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Phrases Toggle */}
        <button
          className="phrases-toggle"
          onClick={() => setShowPhrases(!showPhrases)}
        >
          {showPhrases ? '▲ Hide' : '▼ Show'} Common Phrases
        </button>

        {/* Phrases Section */}
        {showPhrases && (
          <div className="phrases-section">
            <div className="category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            <div className="phrases-grid">
              {getCategoryPhrases().map((phrase: PhraseEntry) => (
                <div
                  key={phrase.key}
                  className="phrase-card"
                  onClick={() => handlePhraseClick(phrase)}
                >
                  <div className="phrase-source">
                    {phrase.translations[sourceLanguage]}
                  </div>
                  <div className="phrase-arrow">→</div>
                  <div className="phrase-target">
                    {phrase.translations[targetLanguage]}
                  </div>
                  <button
                    className="phrase-speak"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(phrase.translations[targetLanguage], targetLanguage);
                    }}
                  >
                    🔊
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Language Cards */}
        <div className="language-cards">
          <h3>Quick Access</h3>
          <div className="cards-grid">
            {NIGERIAN_LANGUAGES.filter((l: LanguageInfo) => l.code !== 'english').map((lang: LanguageInfo) => (
              <div
                key={lang.code}
                className="language-card"
                onClick={() => {
                  setSourceLanguage('english');
                  setTargetLanguage(lang.code);
                }}
              >
                <div className="card-flag">{lang.flag}</div>
                <div className="card-name">{lang.name}</div>
                <div className="card-native">{lang.nativeName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationPage;
