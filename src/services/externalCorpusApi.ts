// 外部公开免费语料源接入层
// 整合三套免授权、无 key 的公开语料 API，为阅读中心提供「在线语料」实时拉取能力
//
// 数据源说明：
// 1. Wikipedia REST API —— 多语种百科条目摘要（en/de/fr/ja/ko/es/...）
//    端点：https://{lang}.wikipedia.org/api/rest_v1/page/random/summary
//    特点：内容权威、覆盖面广、难度中等偏上
// 2. Gutendex API —— Project Gutenberg 7万+公版书元数据 + 全文下载链接
//    端点：https://gutendex.com/books/?languages={lang}
//    特点：经典文学原文，适合中高级学习者精读
// 3. Tatoeba —— 已通过 tatoebaApi.ts 接入，此处不再重复
//
// 设计原则与 languageDataApi 一致：
// 1. 永不抛错——任何 API 失败都返回 null，保证前端可用
// 2. 全部走缓存——避免重复请求外部资源
// 3. 多语言映射——前端 Language 联合类型 → 各 API 的语言代码

import { cachedFetch } from '../utils/cache';
import { getTodayKey, getDailySeed, seededPick } from '../utils/dailySeed';
import type { Language, ReadingArticle, ReadingCategory } from '../types';

// ============ 语言代码映射 ============

// Wikipedia 子域名：与 ISO 639-1 一致
const wikipediaLangCode: Record<Language, string> = {
  english: 'en',
  japanese: 'ja',
  korean: 'ko',
  french: 'fr',
  spanish: 'es',
  german: 'de',
  italian: 'it',
  portuguese: 'pt',
  russian: 'ru',
  thai: 'th',
  finnish: 'fi',
  norwegian: 'no',
};

// Gutendex 语言代码（Project Gutenberg 主要收录西方语言）
const gutendexLangCode: Partial<Record<Language, string>> = {
  english: 'en',
  french: 'fr',
  german: 'de',
  spanish: 'es',
  italian: 'it',
  portuguese: 'pt',
  finnish: 'fi',
};

// ============ 通用工具：文本分段 ============

/**
 * 将一段长文本按句子切成段落，每段约 2-4 句
 * 用于把 Wikipedia / Gutenberg 的扁平文本转成可点击 token 的段落结构
 */
const splitIntoParagraphs = (text: string, maxSentencesPerParagraph = 3): string[] => {
  // 按句号/问号/感叹号切分（保留标点）
  const sentences = text
    .replace(/\s+/g, ' ')
    .match(/[^.!?。！？]+[.!?。！？]+/g) || [text];

  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += maxSentencesPerParagraph) {
    const chunk = sentences.slice(i, i + maxSentencesPerParagraph).join(' ').trim();
    if (chunk.length > 30) paragraphs.push(chunk); // 过滤过短片段
  }
  return paragraphs.slice(0, 6); // 最多保留6段，避免文章过长
};

// ============ Wikipedia 语料 ============

export interface WikipediaArticle {
  title: string;
  language: Language;
  extract: string;        // 纯文本摘要
  thumbnailUrl?: string;  // 缩略图
  contentUrl: string;     // 完整条目 URL
}

/**
 * 拉取一篇随机 Wikipedia 条目摘要
 * @param language 目标语种
 */
export const fetchRandomWikipediaArticle = async (
  language: Language
): Promise<WikipediaArticle | null> => {
  const langCode = wikipediaLangCode[language];
  if (!langCode) return null;

  const cacheKey = `wiki_random_${langCode}_${Date.now() % 3600000}`; // 1小时内不重复
  try {
    return await cachedFetch<WikipediaArticle | null>(
      cacheKey,
      async () => {
        const res = await fetch(
          `https://${langCode}.wikipedia.org/api/rest_v1/page/random/summary`,
          { headers: { Accept: 'application/json' } }
        );
        if (!res.ok) return null;
        const data = await res.json();

        // 过滤过短或非标准条目
        const extract: string = data.extract || '';
        if (extract.length < 100) return null;

        return {
          title: data.title || '未知条目',
          language,
          extract,
          thumbnailUrl: data.thumbnail?.source,
          contentUrl: data.content_urls?.desktop?.page || `https://${langCode}.wikipedia.org/`,
        };
      },
      60 * 60 * 1000 // 1小时
    );
  } catch {
    return null;
  }
};

/**
 * 按主题关键词拉取 Wikipedia 条目摘要
 * @param language 目标语种
 * @param topic 主题关键词（如 "Artificial Intelligence"）
 */
export const fetchWikipediaArticleByTopic = async (
  language: Language,
  topic: string
): Promise<WikipediaArticle | null> => {
  const langCode = wikipediaLangCode[language];
  if (!langCode || !topic.trim()) return null;

  const cacheKey = `wiki_topic_${langCode}_${topic.toLowerCase().trim()}`;
  try {
    return await cachedFetch<WikipediaArticle | null>(
      cacheKey,
      async () => {
        // 用 Wikipedia REST summary 端点按标题查询
        const title = encodeURIComponent(topic.trim().replace(/\s+/g, '_'));
        const res = await fetch(
          `https://${langCode}.wikipedia.org/api/rest_v1/page/summary/${title}`,
          { headers: { Accept: 'application/json' } }
        );
        if (!res.ok) return null;
        const data = await res.json();

        const extract: string = data.extract || '';
        if (extract.length < 100) return null;

        return {
          title: data.title || topic,
          language,
          extract,
          thumbnailUrl: data.thumbnail?.source,
          contentUrl: data.content_urls?.desktop?.page || `https://${langCode}.wikipedia.org/wiki/${title}`,
        };
      },
      24 * 60 * 60 * 1000 // 24小时
    );
  } catch {
    return null;
  }
};

// ============ Wikipedia 模糊搜索（返回多条相关结果） ============

export interface WikipediaSearchResult {
  title: string;
  snippet: string;       // 清洗后的预览片段（纯文本）
  contentUrl: string;    // 条目完整 URL
}

/**
 * 按关键词模糊搜索 Wikipedia，返回多条相关条目
 * 使用 MediaWiki action=query&list=search 端点，支持 CORS（origin=*）
 * @param language 目标语种
 * @param keyword 搜索关键词（支持模糊匹配，如 "ai"、"coffee"、"Einstein"）
 * @param limit 返回条数（默认 8）
 */
export const searchWikipediaArticles = async (
  language: Language,
  keyword: string,
  limit = 8
): Promise<WikipediaSearchResult[]> => {
  const langCode = wikipediaLangCode[language];
  if (!langCode || !keyword.trim()) return [];

  const cacheKey = `wiki_search_${langCode}_${keyword.toLowerCase().trim()}`;
  try {
    return await cachedFetch<WikipediaSearchResult[]>(
      cacheKey,
      async () => {
        const res = await fetch(
          `https://${langCode}.wikipedia.org/w/api.php?action=query&list=search` +
          `&srsearch=${encodeURIComponent(keyword.trim())}&srlimit=${limit}` +
          `&format=json&origin=*`
        );
        if (!res.ok) return [];
        const data = await res.json();
        const items: Array<{ title: string; snippet: string }> = data?.query?.search || [];
        if (items.length === 0) return [];

        return items.map(item => ({
          title: item.title,
          // snippet 含 <span class="searchmatch"> 高亮标签，清洗成纯文本
          snippet: (item.snippet || '')
            .replace(/<[^>]+>/g, '')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#39;/g, "'")
            .replace(/\s+/g, ' ')
            .trim(),
          contentUrl: `https://${langCode}.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/\s+/g, '_'))}`,
        }));
      },
      30 * 60 * 1000 // 30分钟
    );
  } catch {
    return [];
  }
};

// ============ Gutendex / Project Gutenberg 语料 ============

export interface GutenbergBook {
  id: number;
  title: string;
  authors: string[];
  languages: string[];
  subjects: string[];
  downloadCount: number;
  textUrl?: string;     // 纯文本下载链接
  htmlUrl?: string;     // HTML 下载链接
  coverUrl?: string;
}

interface GutendexResponse {
  count: number;
  results: Array<{
    id: number;
    title: string;
    authors: Array<{ name: string; birth_year: number | null; death_year: number | null }>;
    languages: string[];
    subjects: string[];
    download_count: number;
    formats: Record<string, string>;
  }>;
}

/**
 * 按语言拉取 Project Gutenberg 书籍列表（热门优先）
 * @param language 目标语种（仅支持英语/法语/德语/西语/意语/葡语/芬兰语）
 * @param topic 可选主题关键词
 * @param limit 返回条数（默认10）
 */
export const fetchGutenbergBooks = async (
  language: Language,
  topic?: string,
  limit = 10
): Promise<GutenbergBook[]> => {
  const langCode = gutendexLangCode[language];
  if (!langCode) return [];

  const params = new URLSearchParams();
  params.set('languages', langCode);
  if (topic && topic.trim()) params.set('search', topic.trim());

  const cacheKey = `gutenberg_list_${langCode}_${topic?.toLowerCase().trim() || 'all'}`;
  try {
    return await cachedFetch<GutenbergBook[]>(
      cacheKey,
      async () => {
        const res = await fetch(`https://gutendex.com/books/?${params.toString()}`);
        if (!res.ok) return [];
        const data: GutendexResponse = await res.json();

        return data.results.slice(0, limit).map(book => ({
          id: book.id,
          title: book.title,
          authors: book.authors.map(a => a.name),
          languages: book.languages,
          subjects: book.subjects,
          downloadCount: book.download_count,
          textUrl: book.formats['text/plain; charset=utf-8'] || book.formats['text/plain'],
          htmlUrl: book.formats['text/html; charset=utf-8'] || book.formats['text/html'],
          coverUrl: book.formats['image/jpeg'],
        }));
      },
      7 * 24 * 60 * 60 * 1000 // 7天
    );
  } catch {
    return [];
  }
};

/**
 * 拉取单本 Gutenberg 书籍的正文片段（前 N 段）
 * 用于阅读中心实时精读
 * @param book GutenbergBook 对象
 * @param maxChars 最大字符数（默认 3000，约2-3段）
 */
export const fetchGutenbergBookExcerpt = async (
  book: GutenbergBook,
  maxChars = 3000
): Promise<string | null> => {
  if (!book.textUrl) return null;

  const cacheKey = `gutenberg_text_${book.id}`;
  try {
    return await cachedFetch<string | null>(
      cacheKey,
      async () => {
        const res = await fetch(book.textUrl!);
        if (!res.ok) return null;
        const fullText = await res.text();

        // 移除 Gutenberg 头尾版权声明（*** START OF ... *** / *** END OF ... ***）
        const startMatch = fullText.indexOf('*** START OF');
        const endMatch = fullText.indexOf('*** END OF');
        let body = fullText;
        if (startMatch > 0 && endMatch > startMatch) {
          body = fullText.slice(startMatch, endMatch);
          // 去掉 START 标记行
          const firstNewline = body.indexOf('\n', body.indexOf('*** START OF'));
          if (firstNewline > 0) body = body.slice(firstNewline + 1);
        }

        // 截取前 maxChars 字符，尽量在句末断开
        let excerpt = body.replace(/\r\n/g, '\n').trim();
        if (excerpt.length > maxChars) {
          excerpt = excerpt.slice(0, maxChars);
          const lastPeriod = excerpt.lastIndexOf('. ');
          if (lastPeriod > maxChars * 0.7) excerpt = excerpt.slice(0, lastPeriod + 1);
        }
        return excerpt || null;
      },
      30 * 24 * 60 * 60 * 1000 // 30天
    );
  } catch {
    return null;
  }
};

// ============ 统一适配：转为 ReadingArticle ============

/**
 * 将 Wikipedia 摘要转换为阅读模块可用的 ReadingArticle
 * 自动判定难度：按 extract 长度
 */
export const wikipediaToReadingArticle = (
  wiki: WikipediaArticle,
  category: ReadingCategory = 'culture'
): ReadingArticle => {
  const paragraphs = splitIntoParagraphs(wiki.extract);
  // 按平均句长估判难度
  const avgWordsPerSentence =
    wiki.extract.split(/[.!?]+/).filter(s => s.trim()).reduce((sum, s) => sum + s.split(/\s+/).length, 0) /
    Math.max(wiki.extract.split(/[.!?]+/).filter(s => s.trim()).length, 1);

  const level = avgWordsPerSentence > 22 ? 'advanced' : avgWordsPerSentence > 14 ? 'intermediate' : 'beginner';

  return {
    id: `wiki-${wiki.language}-${Date.now()}`,
    title: wiki.title,
    language: wiki.language,
    level: level as any,
    category,
    paragraphs,
    collocations: [], // 在线语料无预置搭配，依靠点词查义
    questions: [],
    shadowingText: paragraphs[0] || wiki.extract.slice(0, 200),
    estimatedMinutes: Math.max(5, Math.ceil(paragraphs.length * 3)),
  };
};

/**
 * 将 Gutenberg 书籍片段转换为 ReadingArticle
 */
export const gutenbergToReadingArticle = async (
  book: GutenbergBook,
  language: Language,
  category: ReadingCategory = 'novel'
): Promise<ReadingArticle | null> => {
  const excerpt = await fetchGutenbergBookExcerpt(book);
  if (!excerpt) return null;

  const paragraphs = splitIntoParagraphs(excerpt, 2); // 文学作品段落短一些

  return {
    id: `gutenberg-${book.id}`,
    title: book.title,
    language,
    level: 'advanced', // Gutenberg 多为 19-20 世纪经典文学，默认高级
    category,
    paragraphs,
    collocations: [],
    questions: [],
    shadowingText: paragraphs[0] || excerpt.slice(0, 200),
    estimatedMinutes: Math.max(8, Math.ceil(paragraphs.length * 4)),
  };
};

// ============ 对外暴露的语种能力（用于前端 UI 提示） ============

/** 该语种是否支持 Wikipedia 实时拉取 */
export const supportsWikipedia = (language: Language): boolean =>
  !!wikipediaLangCode[language];

/** 该语种是否支持 Project Gutenberg 实时拉取 */
export const supportsGutenberg = (language: Language): boolean =>
  !!gutendexLangCode[language];

// ============ 每日推荐：每天固定 5-8 篇 ============

/**
 * 拉取某语种「今日 Wikipedia 推荐」——同一天访问结果稳定，第二天自动刷新
 * 当天首次访问时并发拉取 count 篇随机条目，过滤过短的后缓存
 * @param language 目标语种
 * @param count 每日篇数（默认6）
 */
export const fetchDailyWikipediaArticles = async (
  language: Language,
  count = 6
): Promise<WikipediaArticle[]> => {
  if (!supportsWikipedia(language)) return [];
  const todayKey = getTodayKey();
  const cacheKey = `daily_wiki_${language}_${todayKey}`;

  try {
    return await cachedFetch<WikipediaArticle[]>(
      cacheKey,
      async () => {
        // 并发拉 count + 2 篇，过滤过短/失败的，取前 count 篇
        const fetchCount = count + 2;
        const results = await Promise.all(
          Array.from({ length: fetchCount }, () => fetchRandomWikipediaArticle(language))
        );
        const valid = results.filter((w): w is WikipediaArticle =>
          !!w && w.extract.length >= 120
        );
        // 用日期种子确定性挑选（虽然 random 本身随机，但当天缓存后稳定）
        const seed = getDailySeed() + language.length * 11;
        return seededPick(valid, seed, Math.min(count, valid.length));
      },
      20 * 60 * 60 * 1000 // 20小时
    );
  } catch {
    return [];
  }
};

/**
 * 拉取某语种「今日 Gutenberg 书单」——同一天访问结果稳定，第二天自动刷新
 * @param language 目标语种
 * @param count 每日书目数（默认6）
 */
export const fetchDailyGutenbergBooks = async (
  language: Language,
  count = 6
): Promise<GutenbergBook[]> => {
  if (!supportsGutenberg(language)) return [];
  const todayKey = getTodayKey();
  const cacheKey = `daily_gutenberg_${language}_${todayKey}`;

  try {
    return await cachedFetch<GutenbergBook[]>(
      cacheKey,
      async () => {
        // 拉取热门书单（多拉一些供挑选）
        const all = await fetchGutenbergBooks(language, undefined, 24);
        if (all.length === 0) return [];
        // 用日期种子确定性挑选 count 本
        const seed = getDailySeed() + language.length * 13;
        return seededPick(all, seed, Math.min(count, all.length));
      },
      20 * 60 * 60 * 1000 // 20小时
    );
  } catch {
    return [];
  }
};
