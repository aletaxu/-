// 每日确定性种子工具
// 用途：让"在线语料"每个模块每天稳定展示 5-8 篇文章，
// 同一天多次访问看到相同的文章，第二天自动刷新。
//
// 设计：
// - getTodayKey() 返回 YYYYMMDD 字符串，用作缓存键的一部分
// - getDailySeed() 返回数字种子，喂给 mulberry32 PRNG
// - seededShuffle() 用种子做确定性洗牌：相同种子 → 相同顺序

/** 今日日期 key（YYYYMMDD），用于每日缓存键 */
export const getTodayKey = (date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

/** 今日数字种子（用于确定性洗牌） */
export const getDailySeed = (date = new Date()): number => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // 简单哈希：日期 → 32 位整数
  return (y * 10000 + m * 100 + d) >>> 0;
};

/** mulberry32 确定性 PRNG：相同 seed 返回相同的伪随机序列 */
const mulberry32 = (seed: number) => () => {
  let a = seed >>> 0;
  a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * 确定性洗牌：相同输入 + 相同 seed → 相同输出
 * 用于"每天固定 N 篇"的场景
 */
export const seededShuffle = <T>(arr: T[], seed: number): T[] => {
  if (!arr.length) return [];
  const rng = mulberry32(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/** 从数组中按种子确定性取前 N 个 */
export const seededPick = <T>(arr: T[], seed: number, n: number): T[] => {
  return seededShuffle(arr, seed).slice(0, n);
};

/**
 * 将文本截断到最多 maxChars 个字符，尽量在句末断开
 * 用于控制阅读篇幅上限（如限制 800 字符以内）
 * - 优先在 maxChars 窗口内的最近句末标点处断开
 * - 退而求其次在词边界断开
 * - 实在找不到合适断点则硬切
 */
export const truncateToCharCount = (text: string, maxChars: number): string => {
  if (!text) return '';
  if (text.length <= maxChars) return text;
  const slice = text.slice(0, maxChars);
  // 找最近的句末标点（中英文）
  const lastSentenceEnd = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('! '),
    slice.lastIndexOf('? '),
    slice.lastIndexOf('。'),
    slice.lastIndexOf('！'),
    slice.lastIndexOf('？'),
  );
  if (lastSentenceEnd > maxChars * 0.6) {
    return slice.slice(0, lastSentenceEnd + 1).trim();
  }
  // 找不到句末则在词边界断开
  const lastSpace = slice.lastIndexOf(' ');
  if (lastSpace > maxChars * 0.8) {
    return slice.slice(0, lastSpace).trim();
  }
  return slice.trim();
};
