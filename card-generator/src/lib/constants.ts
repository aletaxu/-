import type { ThemeType, ToneType } from "./types";

// 主题元数据
export interface ThemeMeta {
  type: ThemeType;
  label: string;
  emoji: string;
  accent: string;
  sampleRecipient: string;
}

export const THEMES: ThemeMeta[] = [
  { type: "birthday", label: "生日庆祝", emoji: "🎂", accent: "#D97757", sampleRecipient: "小满" },
  { type: "invitation", label: "活动邀请", emoji: "✉️", accent: "#7A9B83", sampleRecipient: "各位朋友" },
  { type: "opening", label: "开业恭喜", emoji: "🎊", accent: "#C0392B", sampleRecipient: "贵店" },
  { type: "wedding", label: "婚礼喜帖", emoji: "💍", accent: "#B85C7A", sampleRecipient: "亲友" },
  { type: "festival", label: "节日祝福", emoji: "🧧", accent: "#C0392B", sampleRecipient: "家人" },
  { type: "thanks", label: "感谢致意", emoji: "🌸", accent: "#7A9B83", sampleRecipient: "恩师" },
];

// 语气风格
export interface ToneMeta {
  type: ToneType;
  label: string;
  desc: string;
}

export const TONES: ToneMeta[] = [
  { type: "warm", label: "温馨", desc: "柔软真挚，如暖阳在心" },
  { type: "humor", label: "幽默", desc: "俏皮轻快，会心一笑" },
  { type: "formal", label: "正式", desc: "端庄得体，礼数周全" },
  { type: "poetic", label: "诗意", desc: "意象绵长，字字含情" },
  { type: "playful", label: "俏皮", desc: "活泼跳跃，元气满满" },
];

// 字体选项（卡片内文字）
export interface FontMeta {
  id: string;
  label: string;
  stack: string;
  preview: string;
}

export const FONTS: FontMeta[] = [
  { id: "serif", label: "思源宋体", stack: '"Noto Serif SC", serif', preview: "岁月静好" },
  { id: "sans", label: "思源黑体", stack: '"Noto Sans SC", sans-serif', preview: "岁月静好" },
  { id: "display", label: "Playfair", stack: '"Playfair Display", "Noto Serif SC", serif', preview: "Happy Day" },
  { id: "script", label: "Dancing", stack: '"Dancing Script", cursive', preview: "Best Wishes" },
  { id: "hand", label: "Caveat", stack: '"Caveat", cursive', preview: "For You" },
  { id: "brush", label: "马善政楷书", stack: '"Ma Shan Zheng", cursive', preview: "岁月静好" },
  { id: "xiaowei", label: "站酷小薇", stack: '"ZCOOL XiaoWei", serif', preview: "岁月静好" },
];

export function getFontStack(id: string): string {
  return FONTS.find((f) => f.id === id)?.stack ?? '"Noto Serif SC", serif';
}

export function getThemeMeta(type: ThemeType): ThemeMeta {
  return THEMES.find((t) => t.type === type) ?? THEMES[0];
}

// 文字颜色预设
export const TEXT_COLORS: string[] = [
  "#1A1A1A",
  "#FFFFFF",
  "#D97757",
  "#7A9B83",
  "#B85C7A",
  "#C0392B",
  "#2C3E50",
  "#8A847A",
];

// 遮罩颜色预设
export const OVERLAY_COLORS: string[] = [
  "#000000",
  "#1A1A1A",
  "#FAF7F2",
  "#FFFFFF",
  "#D97757",
  "#7A9B83",
  "#2C3E50",
];
