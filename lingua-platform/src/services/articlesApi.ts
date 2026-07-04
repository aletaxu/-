// 文章语料接入层（免 key、CORS 友好的免费 API）
// 为阅读中心提供「科技/编程/科普」等题材的长文素材，补充 RSS 新闻的短摘要
//
// 数据源：
// 1. Hacker News (Algolia API) —— 科技/创业/编程，免 key，CORS 友好
//    端点：https://hn.algolia.com/api/v1/search?tags=story
//    返回：title + url + points + num_comments（正文需二次拉取，这里用 story_text/摘要）
// 2. Dev.to API —— 编程/技术博客，免 key，CORS 友好
//    端点：https://dev.to/api/articles
//    返回：title + description + readable_url + body_markdown（正文）
//
// 设计原则与 newsApi 一致：永不抛错、走缓存、HTML/Markdown→纯文本、分段

import { cachedFetch, fetchWithTimeout } from '../utils/cache';
import { getTodayKey, getDailySeed, seededPick } from '../utils/dailySeed';
import type { Language, ReadingArticle, ReadingCategory } from '../types';

// ============ 类型定义 ============

export interface ArticleItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;     // 纯文本摘要
  content: string;         // 正文（如有）
  author?: string;
  sourceName: string;      // 'Hacker News' / 'Dev.to'
  sourceId: string;
  language: Language;      // 当前仅英语
  category: ReadingCategory;
}

// ============ 文本清洗 ============

const stripHtml = (html: string): string =>
  (html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Markdown → 纯文本（粗略去标签，保留可读性）
const stripMarkdown = (md: string): string =>
  (md || '')
    .replace(/```[\s\S]*?```/g, '')        // 代码块
    .replace(/`[^`]*`/g, '')               // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')  // 图片
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // 链接保留文字
    .replace(/^#{1,6}\s+/gm, '')           // 标题符号
    .replace(/^\s*[-*+]\s+/gm, '')         // 无序列表符号
    .replace(/^\s*\d+\.\s+/gm, '')         // 有序列表符号
    .replace(/^\s*>\s+/gm, '')             // 引用
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // 粗体
    .replace(/\*([^*]+)\*/g, '$1')         // 斜体
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

// 按句号/换行分段，控制每段长度
const splitIntoParagraphs = (text: string, minParagraphs = 3): string[] => {
  const clean = stripHtml(text).trim();
  if (!clean) return [];
  const sentences = clean.split(/(?<=[.!?])\s+|\n+/).filter(s => s.trim().length > 15);
  if (sentences.length === 0) return [clean];

  const paragraphs: string[] = [];
  let current = '';
  for (const s of sentences) {
    current += (current ? ' ' : '') + s.trim();
    if (current.length > 180) {
      paragraphs.push(current);
      current = '';
    }
  }
  if (current) paragraphs.push(current);
  return paragraphs.length >= minParagraphs ? paragraphs : [clean];
};

// ============ Hacker News (Algolia API) ============

interface HNHit {
  objectID: string;
  title?: string;
  story_text?: string;       // 部分帖子有正文 HTML
  url?: string;              // 外链
  author?: string;
  created_at?: string;
  points?: number;
  num_comments?: number;
}

const fetchHackerNews = async (limit = 8): Promise<ArticleItem[]> => {
  const cacheKey = `hn_articles_${getTodayKey()}`;
  try {
    return await cachedFetch<ArticleItem[]>(
      cacheKey,
      async () => {
        // 取近期高分帖（按点数倒序，取前 40 条再筛有正文的）
        const res = await fetchWithTimeout(
          `https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=40&numericFilters=points>50`,
          { headers: { Accept: 'application/json' } },
          10000
        );
        if (!res.ok) return [];
        const data = await res.json();
        const hits: HNHit[] = data?.hits || [];

        return hits
          .filter(h => h.title && (h.story_text || h.url))  // 必须有标题且正文或外链
          .slice(0, limit)
          .map(h => ({
            id: `hn-${h.objectID}`,
            title: stripHtml(h.title || ''),
            link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
            pubDate: h.created_at || new Date().toISOString(),
            description: stripHtml(h.story_text || '').slice(0, 300) || h.title || '',
            content: stripHtml(h.story_text || ''),
            author: h.author,
            sourceName: 'Hacker News',
            sourceId: 'hackernews',
            language: 'english' as Language,
            category: 'tech' as ReadingCategory,
          }));
      },
      6 * 60 * 60 * 1000 // 6小时
    );
  } catch {
    return [];
  }
};

// ============ Dev.to API ============

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  readable_publish_date?: string;
  published_at?: string;
  body_markdown?: string;
  user?: { name?: string; username?: string };
  tag_list?: string | string[];
}

const fetchDevTo = async (limit = 8): Promise<ArticleItem[]> => {
  const cacheKey = `devto_articles_${getTodayKey()}`;
  try {
    return await cachedFetch<ArticleItem[]>(
      cacheKey,
      async () => {
        const res = await fetchWithTimeout(
          `https://dev.to/api/articles?per_page=${limit}&top=7`,
          { headers: { Accept: 'application/json' } },
          10000
        );
        if (!res.ok) return [];
        const data: DevToArticle[] = await res.json();
        if (!Array.isArray(data)) return [];

        return data.map(a => {
          const tags = Array.isArray(a.tag_list) ? a.tag_list : (a.tag_list || '').toString().split(',');
          // 根据标签映射题材
          const tagStr = tags.join(' ').toLowerCase();
          const category: ReadingCategory =
            /psycholog|mental|wellness|productivit/.test(tagStr) ? 'psychology' :
            /life|social|career/.test(tagStr) ? 'social' :
            /movie|film|tv|drama/.test(tagStr) ? 'entertainment' :
            'tech';
          return {
            id: `devto-${a.id}`,
            title: stripHtml(a.title || ''),
            link: a.url,
            pubDate: a.published_at || a.readable_publish_date || new Date().toISOString(),
            description: stripHtml(a.description || ''),
            content: a.body_markdown ? stripMarkdown(a.body_markdown) : '',
            author: a.user?.name || a.user?.username,
            sourceName: 'Dev.to',
            sourceId: 'devto',
            language: 'english' as Language,
            category,
          };
        });
      },
      6 * 60 * 60 * 1000 // 6小时
    );
  } catch {
    return [];
  }
};

// ============ 聚合 + 每日推荐 ============

/**
 * 拉取所有文章源（Hacker News + Dev.to）的最新文章
 */
export const fetchAllArticles = async (limit = 16): Promise<ArticleItem[]> => {
  const [hn, devto] = await Promise.all([
    fetchHackerNews(Math.ceil(limit / 2)),
    fetchDevTo(Math.ceil(limit / 2)),
  ]);
  return [...hn, ...devto]
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit);
};

/**
 * 每日推荐文章（确定性选篇，同一天结果稳定）
 * @param language 目标语种（当前仅英语有源，其他语种返回空）
 * @param count 推荐条数
 */
export const fetchDailyArticles = async (
  language: Language,
  count = 6
): Promise<ArticleItem[]> => {
  if (language !== 'english') return [];
  const all = await fetchAllArticles(20);
  if (all.length === 0) return [];
  // 过滤掉正文过短/只有一句话的（转换后段落数 < 2 或总字数 < 150 视为无内容）
  const readable = all.filter(item => {
    const article = articleToReadingArticle(item);
    const totalChars = article.paragraphs.join('').length;
    return article.paragraphs.length >= 2 && totalChars >= 150;
  });
  const pool = readable.length >= count ? readable : all; // 兜底：达标的太少就用全部
  const seed = getDailySeed() + language.length * 7;
  return seededPick(pool, seed, count);
};

/**
 * 按关键词在文章中筛选
 */
export const searchArticlesByKeyword = async (
  language: Language,
  keyword: string
): Promise<ArticleItem[]> => {
  if (!keyword.trim() || language !== 'english') return [];
  const all = await fetchAllArticles(20);
  const kw = keyword.toLowerCase().trim();
  return all.filter(item =>
    item.title.toLowerCase().includes(kw) ||
    item.description.toLowerCase().includes(kw)
  );
};

// ============ 转换为阅读模块可用结构 ============

/**
 * 将一篇文章转为 ReadingArticle
 */
export const articleToReadingArticle = (item: ArticleItem): ReadingArticle => {
  const fullText = item.content && item.content.length > 100
    ? item.content
    : item.description;
  const paragraphs = splitIntoParagraphs(fullText, 3);

  // 难度判定：按句长
  const sentences = fullText.split(/[.!?]+/).filter(s => s.trim());
  const avgWordsPerSentence = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) /
    Math.max(sentences.length, 1);

  const level = avgWordsPerSentence > 22 ? 'advanced'
    : avgWordsPerSentence > 12 ? 'intermediate'
    : 'beginner';

  return {
    id: `article-${item.id}`,
    title: item.title,
    language: item.language,
    level: level as any,
    category: item.category,
    paragraphs,
    collocations: [],
    questions: [],
    shadowingText: paragraphs[0] || fullText.slice(0, 200),
    estimatedMinutes: Math.max(4, Math.ceil(paragraphs.length * 2.5)),
  };
};

// ============ 能力检测 ============

export const supportsArticles = (language: Language): boolean => language === 'english';
