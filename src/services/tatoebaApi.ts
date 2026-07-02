// Tatoeba API (api.tatoeba.org)
// 免费、无需API Key，470+种语言，1200万+句子
// 数据源：社区协作，CC BY 2.0
// 用途：获取真实语境例句、双语对照句子、听力素材

import { cachedFetch } from '../utils/cache';
import type { Language } from '../types';

// 平台语言 → Tatoeba语言代码映射
const tatoebaLangMap: Record<Language, string> = {
  english: 'eng',
  german: 'deu',
  french: 'fra',
  finnish: 'fin',
  norwegian: 'nob',
  japanese: 'jpn',
  korean: 'kor',
  spanish: 'spa',
  portuguese: 'por',
  italian: 'ita',
  russian: 'rus',
  thai: 'tha',
};

export interface TatoebaSentence {
  id: number;
  text: string;
  lang: string;
  translations: Array<{
    lang: string;
    text: string;
  }>;
}

/**
 * 搜索例句（返回目标语言+中文翻译的对照句子）
 * @param keyword 搜索关键词
 * @param language 目标语言
 * @param limit 返回数量
 */
export const searchSentences = async (
  keyword: string,
  language: Language,
  limit: number = 5
): Promise<TatoebaSentence[]> => {
  const langCode = tatoebaLangMap[language] || 'eng';
  const cacheKey = `tatoeba_${langCode}_${keyword.toLowerCase()}_${limit}`;

  return cachedFetch<TatoebaSentence[]>(
    cacheKey,
    async () => {
      try {
        // 使用旧API（仍可用），搜索目标语言句子，带中文翻译
        // 参数：query=关键词, from=目标语言, to=中文(chi)
        const response = await fetch(
          `https://tatoeba.org/eng/api_v0/search?query=${encodeURIComponent(keyword)}&from=${langCode}&to=chi&sort=relevance&count=${limit}`
        );

        if (!response.ok) return [];

        const data = await response.json();
        const results = data?.results || [];

        return results.map((item: any) => ({
          id: item.id,
          text: item.text || '',
          lang: item.lang || langCode,
          translations: (item.translations || [])
            .flat()
            .filter((t: any) => t && t.lang === 'cmn' || t?.lang === 'chi')
            .map((t: any) => ({ lang: t.lang, text: t.text }))
            .slice(0, 1), // 每句只取一条中文翻译
        }));
      } catch {
        return [];
      }
    },
    7 * 24 * 60 * 60 * 1000 // 例句缓存7天
  );
};

/**
 * 获取一个单词的例句
 */
export const getWordExamples = async (
  word: string,
  language: Language,
  limit: number = 3
): Promise<string[]> => {
  const sentences = await searchSentences(word, language, limit);
  return sentences.map(s => s.text);
};
