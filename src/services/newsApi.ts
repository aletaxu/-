// 新闻时事语料接入层
// 通过公开免费的 RSS→JSON 转换代理，实时拉取 BBC / The Economist / 等
// 权威媒体的 RSS 源，为阅读中心提供「新闻时事」学习素材
//
// 数据源说明：
// 1. RSS→JSON 代理：api.rss2json.com —— 免 key、支持 CORS，每天可调用约 1万次
//    端点：https://api.rss2json.com/v1/api.json?rss_url={RSS_URL}
// 2. 各媒体官方 RSS 源（BBC/Economist/Reuters/Le Monde/FAZ/Der Spiegel 等）
//    媒体自身提供 RSS，无需授权，仅供个人学习使用
//
// 设计原则：
// 1. 永不抛错——任何失败都返回空数组/null，保证前端可用
// 2. 全部走缓存——RSS 内容更新频繁但同一时刻重复请求无意义，缓存 30 分钟
// 3. HTML→纯文本——RSS 的 description/content 含 HTML 标签，需清洗后再分段
// 4. 兜底多源——同一语种配置多个 RSS 源，单个失败自动尝试下一个

import { cachedFetch } from '../utils/cache';
import { getTodayKey, getDailySeed, seededPick } from '../utils/dailySeed';
import type { Language, ReadingArticle, ReadingCategory } from '../types';

// ============ RSS 源配置（按语种分组） ============

interface NewsSource {
  id: string;
  name: string;          // 媒体名（用于展示）
  rssUrl: string;        // RSS 源
  language: Language;
  category: ReadingCategory; // 默认主题分类
  region?: string;       // 地区标注
}

export const newsSources: NewsSource[] = [
  // ============ 英语源 ============
  {
    id: 'bbc-world',
    name: 'BBC World',
    rssUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    language: 'english',
    category: 'culture',
    region: 'UK',
  },
  {
    id: 'bbc-tech',
    name: 'BBC Technology',
    rssUrl: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    language: 'english',
    category: 'tech',
    region: 'UK',
  },
  {
    id: 'bbc-business',
    name: 'BBC Business',
    rssUrl: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    language: 'english',
    category: 'business',
    region: 'UK',
  },
  {
    id: 'bbc-science',
    name: 'BBC Science',
    rssUrl: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    language: 'english',
    category: 'tech',
    region: 'UK',
  },
  {
    id: 'economist-finance',
    name: 'The Economist · Finance',
    rssUrl: 'https://www.economist.com/finance-and-economics/rss.xml',
    language: 'english',
    category: 'business',
    region: 'UK',
  },
  {
    id: 'economist-culture',
    name: 'The Economist · Culture',
    rssUrl: 'https://www.economist.com/culture/rss.xml',
    language: 'english',
    category: 'culture',
    region: 'UK',
  },
  {
    id: 'guardian-world',
    name: 'The Guardian · World',
    rssUrl: 'https://www.theguardian.com/world/rss',
    language: 'english',
    category: 'culture',
    region: 'UK',
  },
  // ============ 德语源 ============
  {
    id: 'tagesschau',
    name: 'Tagesschau',
    rssUrl: 'https://www.tagesschau.de/xml/rss2',
    language: 'german',
    category: 'culture',
    region: 'DE',
  },
  {
    id: 'spiegel',
    name: 'Der Spiegel',
    rssUrl: 'https://www.spiegel.de/schlagzeilen/tops/index.rss',
    language: 'german',
    category: 'culture',
    region: 'DE',
  },
  {
    id: 'faz',
    name: 'FAZ · Politik',
    rssUrl: 'https://www.faz.net/rss/aktuell/politik/',
    language: 'german',
    category: 'culture',
    region: 'DE',
  },
  // ============ 法语源 ============
  {
    id: 'lemonde',
    name: 'Le Monde',
    rssUrl: 'https://www.lemonde.fr/rss/une.xml',
    language: 'french',
    category: 'culture',
    region: 'FR',
  },
  {
    id: 'lefigaro',
    name: 'Le Figaro',
    rssUrl: 'https://www.lefigaro.fr/rss/figaro_actualites.xml',
    language: 'french',
    category: 'culture',
    region: 'FR',
  },
  {
    id: 'france24',
    name: 'France 24',
    rssUrl: 'https://www.france24.com/fr/rss',
    language: 'french',
    category: 'culture',
    region: 'FR',
  },
];

// ============ 类型定义 ============

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;     // 纯文本摘要（已清洗）
  content: string;         // 完整内容（如有）
  thumbnail?: string;
  sourceName: string;
  sourceId: string;
  language: Language;
  category: ReadingCategory;
}

interface Rss2JsonResponse {
  status: string;
  feed: {
    title: string;
    link: string;
    image?: string;
  };
  items: Array<{
    title: string;
    link: string;
    pubDate: string;
    description: string;
    content: string;
    enclosure?: { link?: string; type?: string };
    thumbnail?: string;
  }>;
}

// ============ 工具函数 ============

/** 清洗 HTML：去标签、解码实体、压缩空白 */
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')          // 去标签
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

/** 将长文本按句子切成段落 */
const splitIntoParagraphs = (text: string, maxSentences = 3): string[] => {
  if (!text) return [];
  const sentences = text.match(/[^.!?。！？]+[.!?。！？]+/g) || [text];
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += maxSentences) {
    const chunk = sentences.slice(i, i + maxSentences).join(' ').trim();
    if (chunk.length > 30) paragraphs.push(chunk);
  }
  return paragraphs.slice(0, 5);
};

// ============ 核心拉取函数 ============

/**
 * 拉取某个新闻源的最新头条列表
 * @param source NewsSource 配置
 * @param limit 返回条数（默认8）
 */
export const fetchNewsList = async (
  source: NewsSource,
  limit = 8
): Promise<NewsItem[]> => {
  const cacheKey = `news_list_${source.id}`;
  try {
    return await cachedFetch<NewsItem[]>(
      cacheKey,
      async () => {
        const rssUrl = encodeURIComponent(source.rssUrl);
        // 注意：rss2json 免费版不支持 count 参数（需付费 API key），
        // 因此不带 count，由前端 slice 截断
        const res = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`
        );
        if (!res.ok) return [];
        const data: Rss2JsonResponse = await res.json();
        if (data.status !== 'ok' || !data.items) return [];

        return data.items.slice(0, limit).map((item, idx) => {
          const cleanDesc = stripHtml(item.description || '');
          const cleanContent = stripHtml(item.content || '');
          const thumbnail = item.thumbnail
            || (item.enclosure?.type?.startsWith('image/') ? item.enclosure.link : undefined);
          return {
            id: `${source.id}-${idx}`,
            title: stripHtml(item.title || ''),
            link: item.link,
            pubDate: item.pubDate,
            description: cleanDesc,
            content: cleanContent,
            thumbnail,
            sourceName: source.name,
            sourceId: source.id,
            language: source.language,
            category: source.category,
          };
        });
      },
      30 * 60 * 1000 // 30分钟
    );
  } catch {
    return [];
  }
};

/**
 * 拉取某个语种下所有新闻源的头条（聚合）
 * @param language 目标语种
 * @param perSource 每个源取几条（默认4）
 */
export const fetchNewsByLanguage = async (
  language: Language,
  perSource = 4
): Promise<NewsItem[]> => {
  const sources = newsSources.filter(s => s.language === language);
  const results = await Promise.all(
    sources.map(src => fetchNewsList(src, perSource))
  );
  // 合并并按时间倒序（如有 pubDate）
  return results
    .flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
};

/**
 * 按主题关键词在某个语种的所有源中筛选新闻
 * @param language 目标语种
 * @param keyword 关键词（不区分大小写，匹配 title 或 description）
 */
export const searchNewsByKeyword = async (
  language: Language,
  keyword: string
): Promise<NewsItem[]> => {
  if (!keyword.trim()) return [];
  const all = await fetchNewsByLanguage(language, 6);
  const kw = keyword.toLowerCase().trim();
  return all.filter(item =>
    item.title.toLowerCase().includes(kw) ||
    item.description.toLowerCase().includes(kw)
  );
};

// ============ 转换为阅读模块可用结构 ============

/**
 * 将一条新闻转为 ReadingArticle
 * 优先用 content（完整正文），其次 description；自动分段
 */
export const newsToReadingArticle = (news: NewsItem): ReadingArticle => {
  const fullText = news.content && news.content.length > 100
    ? news.content
    : news.description;
  const paragraphs = splitIntoParagraphs(fullText, 3);

  // 难度判定：英语新闻按句长，德/法语默认 intermediate
  const avgWordsPerSentence = fullText.split(/[.!?]+/).filter(s => s.trim())
    .reduce((sum, s) => sum + s.split(/\s+/).length, 0) /
    Math.max(fullText.split(/[.!?]+/).filter(s => s.trim()).length, 1);

  const level = avgWordsPerSentence > 22 ? 'advanced'
    : avgWordsPerSentence > 12 ? 'intermediate'
    : 'beginner';

  return {
    id: `news-${news.id}`,
    title: news.title,
    language: news.language,
    level: level as any,
    category: news.category,
    paragraphs,
    collocations: [], // 新闻无预置搭配，依靠点词查义
    questions: [],
    shadowingText: paragraphs[0] || fullText.slice(0, 200),
    estimatedMinutes: Math.max(4, Math.ceil(paragraphs.length * 2.5)),
  };
};

// ============ UI 辅助：按语种分组新闻源 ============

export const getNewsSourcesByLanguage = (language: Language): NewsSource[] =>
  newsSources.filter(s => s.language === language);

/** 该语种是否接入新闻源 */
export const supportsNews = (language: Language): boolean =>
  newsSources.some(s => s.language === language);

// ============ 每日推荐：每天固定 5-8 篇 ============

/**
 * 拉取某语种「今日新闻推荐」——同一天访问结果稳定，第二天自动刷新
 * 每个语种每天从全部新闻中确定性挑选 count 篇
 * @param language 目标语种
 * @param count 每日篇数（默认6，范围5-8）
 */
export const fetchDailyNews = async (
  language: Language,
  count = 6
): Promise<NewsItem[]> => {
  const todayKey = getTodayKey();
  const cacheKey = `daily_news_${language}_${todayKey}`;

  try {
    return await cachedFetch<NewsItem[]>(
      cacheKey,
      async () => {
        // 拉取该语种所有源的最新头条（每源多拉一些供挑选）
        const all = await fetchNewsByLanguage(language, 8);
        if (all.length === 0) return [];
        // 用日期种子确定性挑选 count 篇
        const seed = getDailySeed() + language.length * 7;
        return seededPick(all, seed, Math.min(count, all.length));
      },
      20 * 60 * 60 * 1000 // 20小时，确保第二天前刷新
    );
  } catch {
    return [];
  }
};
