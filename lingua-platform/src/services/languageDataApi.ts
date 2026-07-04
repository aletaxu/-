// 统一语言数据服务层
// 整合 Free Dictionary API + Tatoeba + Datamuse 三套免费权威 API
// 为前端提供单一入口，自动聚合释义、音标、音频、例句、同义词等数据
//
// 数据源说明：
// - Free Dictionary API (freedictionaryapi.com) —— 基于 Wiktionary，CC BY-SA，覆盖12种语言
// - Tatoeba (tatoeba.org) —— 社区协作例句库，CC BY 2.0，470+ 种语言
// - Datamuse (api.datamuse.com) —— 大规模语料库统计（含 Google Ngrams），主要支持英语
//
// 设计原则：
// 1. 永不抛错——任何 API 失败都返回 null/空数组，保证前端可用
// 2. 多源兜底——优先 Dictionary，缺失则尝试 Datamuse（英语）或 Tatoeba
// 3. 全部走缓存——7 天 TTL，避免重复请求

import { lookupWord, type DictionaryEntry } from './dictionaryApi';
import { searchSentences, type TatoebaSentence } from './tatoebaApi';
import { getSynonyms, getAntonyms, getRelatedWords, getSuggestions } from './datamuseApi';
import { translateToChinese } from './translationApi';
import type { Language } from '../types';

// ============ 统一数据结构 ============

export interface WordDetail {
  word: string;
  language: Language;

  // 音标与发音
  phonetic?: string;          // 如 /ˈæpəl/
  audioUrl?: string;          // 真人发音 URL（部分语言/单词提供）

  // 中文释义（来自 MyMemory 翻译 API，便于初学者快速理解词义）
  chineseTranslation?: string;

  // 释义（按词性分组）
  meanings: Array<{
    partOfSpeech: string;     // noun / verb / adjective ...
    definitions: Array<{
      definition: string;     // 释义（英文表述）
      example?: string;       // 词典自带例句
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;

  // 真实语境例句（来自 Tatoeba，含中文翻译）
  examples: Array<{
    text: string;             // 目标语言原句
    translation?: string;     // 中文翻译
  }>;

  // 同义词/反义词（主要英语可用）
  synonyms: string[];
  antonyms: string[];

  // 词源
  origin?: string;

  // 数据来源标记
  sources: string[];          // ['dictionary', 'tatoeba', 'datamuse', 'translation']
}

// ============ 内部工具 ============

const isEnglish = (language: Language) => language === 'english';

// 把 DictionaryEntry 转换为统一格式的基础字段
const mapDictionary = (entry: DictionaryEntry): Partial<WordDetail> => ({
  phonetic: entry.phonetic,
  audioUrl: entry.audioUrl,
  meanings: entry.meanings,
  origin: entry.origin,
});

// 把 Tatoeba 结果映射为例句结构
const mapTatoeba = (sentences: TatoebaSentence[]): WordDetail['examples'] => {
  return sentences
    .filter(s => s.text)
    .map(s => ({
      text: s.text,
      translation: s.translations?.[0]?.text,
    }));
};

// ============ 核心方法 ============

/**
 * 获取单词的完整详情（聚合三套 API）
 * 这是前端推荐使用的统一入口
 */
export const getWordDetail = async (
  word: string,
  language: Language
): Promise<WordDetail | null> => {
  if (!word?.trim()) return null;
  const trimmed = word.trim();
  const sources: string[] = [];

  // 1) 词典释义（多语言）
  const dictEntry = await lookupWord(trimmed, language);
  const base = dictEntry ? mapDictionary(dictEntry) : {};
  if (dictEntry) sources.push('dictionary');

  // 2) 真实例句 + 中文翻译 并行拉取
  const [tatoebaSentences, chineseTranslation] = await Promise.all([
    searchSentences(trimmed, language, 3),
    translateToChinese(trimmed, language),
  ]);
  const examples = mapTatoeba(tatoebaSentences);
  if (examples.length > 0) sources.push('tatoeba');
  if (chineseTranslation) sources.push('translation');

  // 3) 同义词/反义词（仅英语有效）
  let synonyms: string[] = [];
  let antonyms: string[] = [];
  if (isEnglish(language)) {
    [synonyms, antonyms] = await Promise.all([
      getSynonyms(trimmed, 6),
      getAntonyms(trimmed, 6),
    ]);
    if (synonyms.length > 0 || antonyms.length > 0) sources.push('datamuse');
  }

  // 全部失败则返回 null
  if (!dictEntry && examples.length === 0 && synonyms.length === 0 && !chineseTranslation) {
    return null;
  }

  return {
    word: dictEntry?.word || trimmed,
    language,
    ...base,
    chineseTranslation: chineseTranslation || undefined,
    meanings: base.meanings || [],
    examples,
    synonyms,
    antonyms,
    sources,
  };
};

/**
 * 批量获取单词详情
 */
export const getWordDetails = async (
  words: string[],
  language: Language
): Promise<(WordDetail | null)[]> => {
  // 控制并发，避免一次性打爆 API
  const CONCURRENCY = 4;
  const results: (WordDetail | null)[] = new Array(words.length).fill(null);

  for (let i = 0; i < words.length; i += CONCURRENCY) {
    const batch = words.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(w => getWordDetail(w, language))
    );
    batchResults.forEach((r, j) => {
      results[i + j] = r;
    });
  }
  return results;
};

/**
 * 仅获取例句（轻量调用，给测试题/听力题用）
 */
export const getExamples = async (
  word: string,
  language: Language,
  limit: number = 3
): Promise<WordDetail['examples']> => {
  const sentences = await searchSentences(word, language, limit);
  return mapTatoeba(sentences);
};

/**
 * 获取英语同义词（用于扩展题库干扰项）
 */
export const getEnglishSynonyms = async (word: string, limit: number = 6): Promise<string[]> => {
  if (!word?.trim()) return [];
  return getSynonyms(word, limit);
};

/**
 * 获取英语语义关联词（用于出题时生成近义干扰项）
 */
export const getEnglishRelatedWords = async (
  word: string,
  limit: number = 8
): Promise<{ word: string; score: number; tags?: string[] }[]> => {
  if (!word?.trim()) return [];
  return getRelatedWords(word, limit);
};

/**
 * 拼写建议（用于搜索框自动补全）
 */
export const getSpellingSuggestions = async (prefix: string, limit: number = 5): Promise<string[]> => {
  return getSuggestions(prefix, limit);
};

// ============ 能力测试用：生成 API 增强版题目数据 ============

export interface VocabEnhancement {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  example?: string;        // 真实例句
  exampleTranslation?: string;
  synonyms: string[];
}

/**
 * 给本地题库的单词补充 API 数据（音标、例句、同义词）
 * 用于 AssessmentPage 在题目下方展示真实语境
 */
export const enhanceVocabQuestions = async (
  words: string[],
  language: Language
): Promise<Map<string, VocabEnhancement>> => {
  const result = new Map<string, VocabEnhancement>();

  // 用去重后的单词并行查询
  const uniqueWords = Array.from(new Set(words.map(w => w.toLowerCase())));
  const details = await getWordDetails(uniqueWords, language);

  details.forEach((detail, idx) => {
    const w = uniqueWords[idx];
    if (!detail) {
      result.set(w, { word: w, synonyms: [] });
      return;
    }
    // 取第一个非空例句
    const firstExample = detail.examples[0];
    result.set(w, {
      word: detail.word,
      phonetic: detail.phonetic,
      audioUrl: detail.audioUrl,
      example: firstExample?.text,
      exampleTranslation: firstExample?.translation,
      synonyms: detail.synonyms,
    });
  });

  return result;
};

// ============ 导出子模块便于精细调用 ============

export { lookupWord } from './dictionaryApi';
export type { DictionaryEntry, DictionaryPhonetic, DictionaryDefinition } from './dictionaryApi';

export { searchSentences } from './tatoebaApi';
export type { TatoebaSentence } from './tatoebaApi';

export {
  getSynonyms,
  getAntonyms,
  getRelatedWords,
  getRhymes,
  getSuggestions,
} from './datamuseApi';
