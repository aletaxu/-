import type { ThemeType, Background, FreeText } from "./types";

// 模板风格
export type TemplateStyle = "minimal" | "elegant" | "playful";

export interface CardTemplate {
  id: string;
  theme: ThemeType;
  style: TemplateStyle;
  name: string;
  desc: string;
  // 应用时覆盖到卡片的字段（freeTexts 会重新生成 id）
  background: Background;
  font: string;
  fontSize: number;
  color: string;
  align: "left" | "center" | "right";
  canvasRatio: "4:3" | "3:4";
  // 装饰自由文字（不含 id，应用时生成）
  decorations: Omit<FreeText, "id" | "zIndex">[];
}

// 生成新 id 的装饰文字
function deco(content: string, opts: Partial<Omit<FreeText, "id" | "zIndex" | "content">>): Omit<FreeText, "id" | "zIndex"> {
  return {
    content,
    x: 10,
    y: 8,
    width: 40,
    fontSize: 24,
    color: "#FFFFFF",
    font: "display",
    rotation: 0,
    opacity: 0.85,
    visible: true,
    weight: 600,
    align: "center",
    ...opts,
  };
}

export const TEMPLATES: CardTemplate[] = [
  // ===== 生日 =====
  {
    id: "birthday-minimal",
    theme: "birthday",
    style: "minimal",
    name: "素雅",
    desc: "浅色背景 · 宋体 · 竖版",
    background: { source: "library", url: "gradient:linear-gradient(160deg, #FAF7F2 0%, #F0E6D6 100%)", overlay: "#000000", overlayOpacity: 0 },
    font: "serif",
    fontSize: 18,
    color: "#2C3E50",
    align: "center",
    canvasRatio: "3:4",
    decorations: [],
  },
  {
    id: "birthday-elegant",
    theme: "birthday",
    style: "elegant",
    name: "华丽",
    desc: "暖色渐变 · Playfair · 横版",
    background: { source: "library", url: "gradient:linear-gradient(135deg, #FBC2EB 0%, #A6C1EE 100%)", overlay: "#2C3E50", overlayOpacity: 0.25 },
    font: "display",
    fontSize: 20,
    color: "#FFFFFF",
    align: "center",
    canvasRatio: "4:3",
    decorations: [
      deco("Happy Birthday", { x: 8, y: 6, width: 50, fontSize: 32, color: "#FFFFFF", font: "script", rotation: -6, weight: 600 }),
      deco("Best Wishes", { x: 35, y: 82, width: 30, fontSize: 16, color: "#FFFFFF", font: "display", rotation: 0, weight: 400, opacity: 0.7 }),
    ],
  },
  {
    id: "birthday-playful",
    theme: "birthday",
    style: "playful",
    name: "童趣",
    desc: "彩色渐变 · 手写字体 · 竖版",
    background: { source: "library", url: "gradient:linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%)", overlay: "#000000", overlayOpacity: 0 },
    font: "hand",
    fontSize: 22,
    color: "#FFFFFF",
    align: "center",
    canvasRatio: "3:4",
    decorations: [
      deco("🎂 Make a Wish", { x: 12, y: 10, width: 45, fontSize: 26, color: "#FFFFFF", font: "hand", rotation: -4, weight: 700 }),
      deco("🎉", { x: 70, y: 75, width: 20, fontSize: 40, color: "#FFFFFF", font: "sans", rotation: 12, weight: 400, opacity: 0.9 }),
    ],
  },

  // ===== 邀请 =====
  {
    id: "invitation-minimal",
    theme: "invitation",
    style: "minimal",
    name: "素雅",
    desc: "米白背景 · 黑体 · 横版",
    background: { source: "library", url: "gradient:linear-gradient(160deg, #FFFFFF 0%, #F5F0E8 100%)", overlay: "#000000", overlayOpacity: 0 },
    font: "sans",
    fontSize: 18,
    color: "#1A1A1A",
    align: "center",
    canvasRatio: "4:3",
    decorations: [],
  },
  {
    id: "invitation-elegant",
    theme: "invitation",
    style: "elegant",
    name: "华丽",
    desc: "墨绿渐变 · 小薇 · 竖版",
    background: { source: "library", url: "gradient:linear-gradient(135deg, #2C5364 0%, #0F2027 100%)", overlay: "#000000", overlayOpacity: 0.15 },
    font: "xiaowei",
    fontSize: 19,
    color: "#FFFFFF",
    align: "center",
    canvasRatio: "3:4",
    decorations: [
      deco("INVITATION", { x: 30, y: 6, width: 40, fontSize: 14, color: "#FFFFFF", font: "display", rotation: 0, weight: 700, opacity: 0.6 }),
      deco("You're Invited", { x: 25, y: 85, width: 50, fontSize: 22, color: "#FFFFFF", font: "script", rotation: -3, weight: 600 }),
    ],
  },

  // ===== 开业 =====
  {
    id: "opening-elegant",
    theme: "opening",
    style: "elegant",
    name: "华丽",
    desc: "中国红 · 楷书 · 竖版",
    background: { source: "library", url: "gradient:linear-gradient(135deg, #C0392B 0%, #8E1A1A 100%)", overlay: "#000000", overlayOpacity: 0.1 },
    font: "brush",
    fontSize: 20,
    color: "#FFD700",
    align: "center",
    canvasRatio: "3:4",
    decorations: [
      deco("盛大开业", { x: 25, y: 8, width: 50, fontSize: 36, color: "#FFD700", font: "brush", rotation: 0, weight: 700 }),
      deco("Grand Opening", { x: 30, y: 84, width: 40, fontSize: 16, color: "#FFD700", font: "display", rotation: 0, weight: 400, opacity: 0.7 }),
    ],
  },
  {
    id: "opening-minimal",
    theme: "opening",
    style: "minimal",
    name: "素雅",
    desc: "暖米背景 · 宋体 · 横版",
    background: { source: "library", url: "gradient:linear-gradient(160deg, #FAF7F2 0%, #F5E6D3 100%)", overlay: "#000000", overlayOpacity: 0 },
    font: "serif",
    fontSize: 18,
    color: "#C0392B",
    align: "center",
    canvasRatio: "4:3",
    decorations: [
      deco("🎊", { x: 70, y: 8, width: 20, fontSize: 36, color: "#C0392B", font: "sans", rotation: 10, weight: 400 }),
    ],
  },

  // ===== 婚礼 =====
  {
    id: "wedding-elegant",
    theme: "wedding",
    style: "elegant",
    name: "华丽",
    desc: "粉米渐变 · Dancing · 竖版",
    background: { source: "library", url: "gradient:linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)", overlay: "#FFFFFF", overlayOpacity: 0.2 },
    font: "script",
    fontSize: 20,
    color: "#B85C7A",
    align: "center",
    canvasRatio: "3:4",
    decorations: [
      deco("Save the Date", { x: 25, y: 6, width: 50, fontSize: 26, color: "#B85C7A", font: "script", rotation: -4, weight: 600 }),
      deco("💍 Forever", { x: 30, y: 85, width: 40, fontSize: 18, color: "#B85C7A", font: "display", rotation: 0, weight: 400, opacity: 0.7 }),
    ],
  },
  {
    id: "wedding-minimal",
    theme: "wedding",
    style: "minimal",
    name: "素雅",
    desc: "纯白背景 · 宋体 · 横版",
    background: { source: "library", url: "gradient:linear-gradient(160deg, #FFFFFF 0%, #FAF7F2 100%)", overlay: "#000000", overlayOpacity: 0 },
    font: "serif",
    fontSize: 19,
    color: "#8A847A",
    align: "center",
    canvasRatio: "4:3",
    decorations: [],
  },

  // ===== 节日 =====
  {
    id: "festival-elegant",
    theme: "festival",
    style: "elegant",
    name: "华丽",
    desc: "深红渐变 · 楷书 · 竖版",
    background: { source: "library", url: "gradient:linear-gradient(135deg, #8E1A1A 0%, #C0392B 100%)", overlay: "#000000", overlayOpacity: 0.15 },
    font: "brush",
    fontSize: 21,
    color: "#FFD700",
    align: "center",
    canvasRatio: "3:4",
    decorations: [
      deco("🧧", { x: 12, y: 8, width: 18, fontSize: 40, color: "#FFD700", font: "sans", rotation: -8, weight: 400 }),
      deco("Happy Holidays", { x: 28, y: 85, width: 44, fontSize: 18, color: "#FFD700", font: "display", rotation: 0, weight: 400, opacity: 0.7 }),
    ],
  },
  {
    id: "festival-playful",
    theme: "festival",
    style: "playful",
    name: "童趣",
    desc: "暖橙渐变 · 手写 · 横版",
    background: { source: "library", url: "gradient:linear-gradient(135deg, #F6D365 0%, #FDA085 100%)", overlay: "#000000", overlayOpacity: 0 },
    font: "hand",
    fontSize: 22,
    color: "#FFFFFF",
    align: "center",
    canvasRatio: "4:3",
    decorations: [
      deco("✨ Happy Festivities ✨", { x: 15, y: 8, width: 70, fontSize: 24, color: "#FFFFFF", font: "hand", rotation: -2, weight: 700 }),
      deco("🎉", { x: 72, y: 80, width: 18, fontSize: 36, color: "#FFFFFF", font: "sans", rotation: 15, weight: 400 }),
    ],
  },

  // ===== 感谢 =====
  {
    id: "thanks-minimal",
    theme: "thanks",
    style: "minimal",
    name: "素雅",
    desc: "米白背景 · 宋体 · 竖版",
    background: { source: "library", url: "gradient:linear-gradient(160deg, #FAF7F2 0%, #EFEBE0 100%)", overlay: "#000000", overlayOpacity: 0 },
    font: "serif",
    fontSize: 18,
    color: "#2C3E50",
    align: "center",
    canvasRatio: "3:4",
    decorations: [],
  },
  {
    id: "thanks-elegant",
    theme: "thanks",
    style: "elegant",
    name: "华丽",
    desc: "墨绿渐变 · 小薇 · 横版",
    background: { source: "library", url: "gradient:linear-gradient(135deg, #7A9B83 0%, #4A6B5A 100%)", overlay: "#000000", overlayOpacity: 0.2 },
    font: "xiaowei",
    fontSize: 20,
    color: "#FFFFFF",
    align: "center",
    canvasRatio: "4:3",
    decorations: [
      deco("Thank You", { x: 30, y: 8, width: 40, fontSize: 28, color: "#FFFFFF", font: "script", rotation: -3, weight: 600 }),
      deco("🌸 With Gratitude", { x: 25, y: 84, width: 50, fontSize: 16, color: "#FFFFFF", font: "display", rotation: 0, weight: 400, opacity: 0.7 }),
    ],
  },
];

export function getTemplatesByTheme(theme: ThemeType): CardTemplate[] {
  return TEMPLATES.filter((t) => t.theme === theme);
}

// 应用模板：生成带新 id 的装饰文字
export function applyTemplateToCard(template: CardTemplate): {
  background: Background;
  text: { font: string; fontSize: number; color: string; align: "left" | "center" | "right" };
  canvasRatio: "4:3" | "3:4";
  freeTexts: FreeText[];
} {
  const freeTexts: FreeText[] = template.decorations.map((d, i) => ({
    ...d,
    id: `ft_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`,
    zIndex: i,
  }));
  return {
    background: { ...template.background },
    text: { font: template.font, fontSize: template.fontSize, color: template.color, align: template.align },
    canvasRatio: template.canvasRatio,
    freeTexts,
  };
}
