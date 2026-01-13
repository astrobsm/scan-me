/**
 * CHARLES-DOUGLAS SCAN APP
 * Speech Module - Text-to-Speech & Speech-to-Text
 */

export { TextToSpeechService } from './TextToSpeech';
export type { TTSOptions, CustomVoice, TTSResult } from './TextToSpeech';

export { SpeechToTextService } from './SpeechToText';
export type { STTOptions, TranscriptionResult, TranscriptionSession } from './SpeechToText';

export { NigerianLanguagesService, nigerianLanguages, NIGERIAN_LANGUAGES } from './NigerianLanguages';
export type { NigerianLanguage, TranslationResult, LanguageInfo } from './NigerianLanguages';
