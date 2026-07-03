// Datamuse API (api.datamuse.com)
// 免费、无需API Key（2027年1月前无限制），主要用于英语
// 数据源：大规模语料库统计（含Google Ngrams）
// 用途：同义词、反义词、关联词、拼写建议、押韵词
// 限制：2027年起需Key，10万次/天/Key

import { cachedFetch } from '../utils/cache';

export interface DatamuseWord {
  word: string;
  score: number;
  tags?: string[];
}

/**
 * 获取同义词
 */
export const getSynonyms = async (word: string, limit: number = 5): Promise<string[]> => {
  const cacheKey = `datamuse_syn_${word.toLowerCase()}`;

  return cachedFetch<string[]>(
    cacheKey,
    async () => {
      try {
        const response = await fetch(
          `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&max=${limit}`
        );
        if (!response.ok) return [];
        const data: DatamuseWord[] = await response.json();
        return data.map(d => d.word);
      } catch {
        return [];
      }
    },
    7 * 24 * 60 * 60 * 1000
  );
};

/**
 * 获取反义词
 */
export const getAntonyms = async (word: string, limit: number = 5): Promise<string[]> => {
  const cacheKey = `datamuse_ant_${word.toLowerCase()}`;

  return cachedFetch<string[]>(
    cacheKey,
    async () => {
      try {
        const response = await fetch(
          `https://api.datamuse.com/words?rel_ant=${encodeURIComponent(word)}&max=${limit}`
        );
        if (!response.ok) return [];
        const data: DatamuseWord[] = await response.json();
        return data.map(d => d.word);
      } catch {
        return [];
      }
    },
    7 * 24 * 60 * 60 * 1000
  );
};

/**
 * 获取语义关联词（意思相近的词）
 */
export const getRelatedWords = async (word: string, limit: number = 8): Promise<DatamuseWord[]> => {
  const cacheKey = `datamuse_rel_${word.toLowerCase()}`;

  return cachedFetch<DatamuseWord[]>(
    cacheKey,
    async () => {
      try {
        const response = await fetch(
          `https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=${limit}`
        );
        if (!response.ok) return [];
        return await response.json();
      } catch {
        return [];
      }
    },
    7 * 24 * 60 * 60 * 1000
  );
};

/**
 * 获取拼写建议
 */
export const getSuggestions = async (prefix: string, limit: number = 5): Promise<string[]> => {
  if (!prefix || prefix.length < 2) return [];

  try {
    const response = await fetch(
      `https://api.datamuse.com/sug?s=${encodeURIComponent(prefix)}&max=${limit}`
    );
    if (!response.ok) return [];
    const data: DatamuseWord[] = await response.json();
    return data.map(d => d.word);
  } catch {
    return [];
  }
};

/**
 * 获取押韵词
 */
export const getRhymes = async (word: string, limit: number = 5): Promise<string[]> => {
  const cacheKey = `datamuse_rhy_${word.toLowerCase()}`;

  return cachedFetch<string[]>(
    cacheKey,
    async () => {
      try {
        const response = await fetch(
          `https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}&max=${limit}`
        );
        if (!response.ok) return [];
        const data: DatamuseWord[] = await response.json();
        return data.map(d => d.word);
      } catch {
        return [];
      }
    },
    7 * 24 * 60 * 60 * 1000
  );
};
