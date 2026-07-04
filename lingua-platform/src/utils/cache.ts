// 本地缓存层 - 使用LocalStorage缓存API响应，避免重复请求
const CACHE_PREFIX = 'll_cache_';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 默认缓存24小时

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export const cache = {
  /**
   * 读取缓存
   */
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const item: CacheItem<T> = JSON.parse(raw);
      if (Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return item.data;
    } catch {
      return null;
    }
  },

  /**
   * 写入缓存
   */
  set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    try {
      const item: CacheItem<T> = { data, timestamp: Date.now(), ttl };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch {
      // LocalStorage已满或不可用，静默失败
    }
  },

  /**
   * 删除指定缓存
   */
  remove(key: string): void {
    localStorage.removeItem(CACHE_PREFIX + key);
  },

  /**
   * 清除所有缓存
   */
  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },

  /**
   * 清除每日推荐相关的旧版本缓存（v1 / v2 / 无版本号），用于筛选逻辑变更后强制刷新
   * 当前每日缓存版本为 v3，凡是不含 _v3_ 的每日缓存键一律清除
   */
  clearStaleDailyCache(): void {
    Object.keys(localStorage)
      .filter(k => {
        const inner = k.startsWith(CACHE_PREFIX) ? k.slice(CACHE_PREFIX.length) : k;
        // 旧版每日缓存键（不含 _v3_ 后缀）：daily_news_/daily_wiki_/daily_gutenberg_/daily_articles_ 开头
        const isDaily = inner.startsWith('daily_news_') ||
          inner.startsWith('daily_wiki_') ||
          inner.startsWith('daily_gutenberg_') ||
          inner.startsWith('daily_articles_');
        return isDaily && !inner.includes('_v3_');
      })
      .forEach(k => localStorage.removeItem(k));
  },
};

/**
 * 带缓存的API请求函数
 * @param cacheKey 缓存键
 * @param fetcher 请求函数
 * @param ttl 缓存有效期（毫秒）
 */
export const cachedFetch = async <T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  const cached = cache.get<T>(cacheKey);
  if (cached) return cached;

  const data = await fetcher();
  cache.set(cacheKey, data, ttl);
  return data;
};

/**
 * 带超时的 fetch（用 AbortController 实现）
 * 外部 API（Wikipedia 等）在网络受限时可能长时间无响应，加超时避免卡死
 * @param url 请求地址
 * @param options fetch 配置
 * @param timeoutMs 超时毫秒（默认 8000）
 */
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};
