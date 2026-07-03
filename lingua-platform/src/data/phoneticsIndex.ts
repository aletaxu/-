// 音标数据统一入口：注册所有语种的音标数据并导出访问器
import { registerPhoneticsData } from './phonetics';
import { englishPhoneticsData } from './phonetics';
import { germanPhoneticsData, frenchPhoneticsData } from './phoneticsGermanFrench';
import {
  spanishPhoneticsData, italianPhoneticsData, portuguesePhoneticsData,
  russianPhoneticsData, finnishPhoneticsData, norwegianPhoneticsData,
} from './phoneticsRomanceSlavicNordic';
import { japanesePhoneticsData, koreanPhoneticsData } from './phoneticsJapaneseKorean';

// 注册全部语种
[
  englishPhoneticsData,
  germanPhoneticsData, frenchPhoneticsData,
  spanishPhoneticsData, italianPhoneticsData, portuguesePhoneticsData,
  russianPhoneticsData, finnishPhoneticsData, norwegianPhoneticsData,
  japanesePhoneticsData, koreanPhoneticsData,
].forEach(registerPhoneticsData);

export {
  getPhoneticsData,
  getAvailablePhoneticsLanguages,
  getPhonemeDisplay,
  type LanguagePhoneticsData,
  type AccentOption,
  type Phoneme,
  type PhonemeGroup,
} from './phonetics';
