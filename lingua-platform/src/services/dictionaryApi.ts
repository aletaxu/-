// Free Dictionary API (freedictionaryapi.com)
// 免费、无需API Key，覆盖12种目标语言
// 数据源：英文版Wiktionary，CC BY-SA 4.0
// 限制：450次请求/5分钟/IP
// 注意：返回的释义为英文视角（即用英文解释目标语言词汇）

import { cachedFetch } from '../utils/cache';
import type { Language } from '../types';

// API支持的语言代码映射（与languageCodes不同，这是API端点用的代码）
const apiLangMap: Record<Language, string> = {
  english: 'en',
  german: 'de',
  french: 'fr',
  finnish: 'fi',
  norwegian: 'no',
  japanese: 'ja',
  korean: 'ko',
  spanish: 'es',
  portuguese: 'pt',
  italian: 'it',
  russian: 'ru',
  thai: 'th',
};

export interface DictionaryDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryPhonetic {
  text?: string;     // 音标，如 /ˈæpəl/
  audio?: string;    // 音频URL
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: DictionaryPhonetic[];
  origin?: string;   // 词源
  meanings: Array<{
    partOfSpeech: string;
    definitions: DictionaryDefinition[];
  }>;
  audioUrl?: string; // 提取出的最佳音频URL
}

/**
 * 查询单词的词典数据
 * @param word 要查询的单词
 * @param language 目标语言
 */
export const lookupWord = async (
  word: string,
  language: Language
): Promise<DictionaryEntry | null> => {
  const langCode = apiLangMap[language] || 'en';
  const cacheKey = `dict_${langCode}_${word.toLowerCase()}`;

  return cachedFetch<DictionaryEntry | null>(
    cacheKey,
    async () => {
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/${langCode}/${encodeURIComponent(word)}`
        );

        if (!response.ok) return null;

        const data: any[] = await response.json();
        if (!data || data.length === 0) return null;

        const entry = data[0];
        const phonetics: DictionaryPhonetic[] = (entry.phonetics || []).map((p: any) => ({
          text: p.text,
          audio: p.audio?.startsWith('//') ? `https:${p.audio}` : p.audio,
        }));

        // 找到第一个有音频的phonetic
        const audioUrl = phonetics.find(p => p.audio)?.audio;

        return {
          word: entry.word || word,
          phonetic: entry.phonetic || phonetics.find(p => p.text)?.text,
          phonetics,
          origin: entry.origin,
          meanings: (entry.meanings || []).map((m: any) => ({
            partOfSpeech: m.partOfSpeech || '',
            definitions: (m.definitions || []).map((d: any) => ({
              definition: d.definition || '',
              example: d.example,
              synonyms: d.synonyms,
              antonyms: d.antonyms,
            })),
          })),
          audioUrl,
        };
      } catch {
        return null;
      }
    },
    7 * 24 * 60 * 60 * 1000 // 词典数据缓存7天
  );
};

/**
 * 批量查询多个单词
 */
export const lookupWords = async (
  words: string[],
  language: Language
): Promise<(DictionaryEntry | null)[]> => {
  return Promise.all(words.map(w => lookupWord(w, language)));
};
