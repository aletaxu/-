// 翻译服务层 —— 调用免费免 key 的翻译 API，为目标语言单词/短语提供中文释义
//
// 数据源：MyMemory Translation API
//   端点：https://api.mymemory.translated.net/get?q=<text>&langpair=<src>|zh-CN
//   特点：免费、无需 API Key、支持 CORS、匿名调用 5000 字/天
//   覆盖：支持 ISO 639-1 双字母语言代码，覆盖本平台全部 12 种语言
//
// 设计原则与其它 service 一致：
// 1. 永不抛错——任何失败都返回空字符串，保证前端可用
// 2. 走缓存——同一词翻译结果缓存 30 天，避免重复消耗每日额度
// 3. 仅查单词/短语——传入文本应控制在 500 字符以内，超长直接返回空

import { cachedFetch, fetchWithTimeout } from '../utils/cache';
import type { Language } from '../types';

// 平台语言 → MyMemory 源语言代码（ISO 639-1）映射
const translationLangMap: Record<Language, string> = {
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

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
    match?: number;
  };
  responseStatus?: number;
  matches?: Array<{
    translation?: string;
    quality?: string | number;
  }>;
}

/**
 * 将目标语言的文本翻译为中文
 * @param text 待翻译文本（单词/短语/句子/段落，不超过 1500 字符）
 * @param language 源语言
 * @returns 中文翻译；失败或无结果返回空字符串
 */
export const translateToChinese = async (
  text: string,
  language: Language
): Promise<string> => {
  const trimmed = text?.trim();
  if (!trimmed) return '';
  if (trimmed.length > 1500) return ''; // MyMemory 单次请求有长度限制

  const srcCode = translationLangMap[language];
  if (!srcCode) return '';

  const cacheKey = `trans_${srcCode}_${trimmed.toLowerCase()}`;
  try {
    return await cachedFetch<string>(
      cacheKey,
      async () => {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${srcCode}|zh-CN`;
        const res = await fetchWithTimeout(url, { headers: { Accept: 'application/json' } }, 8000);
        if (!res.ok) return '';
        const data: MyMemoryResponse = await res.json();
        const translated = data?.responseData?.translatedText || '';
        // 过滤明显异常的返回：MYMEMORY WARNING / 重复原文 / 过长
        if (!translated) return '';
        if (/MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(translated)) return '';
        // 若翻译结果与原文完全相同（且原文非中文），多半是翻译失败
        if (translated.trim().toLowerCase() === trimmed.toLowerCase()) return '';
        return translated.trim();
      },
      30 * 24 * 60 * 60 * 1000 // 30 天
    );
  } catch {
    return '';
  }
};

/** 该语种是否支持中英翻译 */
export const supportsTranslation = (language: Language): boolean =>
  !!translationLangMap[language];
