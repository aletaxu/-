import type { ThemeType } from "./types";

// 在线背景素材库（使用 Picsum 与渐变作为可靠来源）
export interface BackgroundAsset {
  id: string;
  label: string;
  url: string;
  // 纯渐变背景用 style 表达，url 留空
  gradient?: string;
  theme?: ThemeType | "common";
}

// 渐变背景（不依赖网络，稳定可用）
function grad(id: string, label: string, from: string, to: string, theme?: ThemeType | "common"): BackgroundAsset {
  return {
    id,
    label,
    url: "",
    gradient: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
    theme,
  };
}

export const BACKGROUNDS: BackgroundAsset[] = [
  // 通用渐变
  grad("g-warm", "暖阳", "#F5E6D3", "#E89A7E", "common"),
  grad("g-cream", "奶霜", "#FAF7F2", "#E8E3DA", "common"),
  grad("g-dusk", "暮色", "#FFB88C", "#DE6262", "common"),
  grad("g-ocean", "深海", "#2C3E50", "#4CA1AF", "common"),
  grad("g-forest", "山林", "#134E5E", "#71B280", "common"),
  grad("g-night", "夜空", "#0F2027", "#2C5364", "common"),
  grad("g-blush", "绯红", "#FF9A9E", "#FAD0C4", "common"),
  grad("g-mist", "晨雾", "#B6FBFF", "#83A4D4", "common"),
  // 生日主题
  grad("g-bd1", "蜜糖", "#FBC2EB", "#A6C1EE", "birthday"),
  grad("g-bd2", "烛光", "#FA709A", "#FEE140", "birthday"),
  // 婚礼主题
  grad("g-wd1", "玫瑰金", "#F6D365", "#FDA085", "wedding"),
  grad("g-wd2", "香槟", "#E6DADA", "#274046", "wedding"),
  // 节日/开业
  grad("g-ny1", "朱砂", "#C0392B", "#E74C3C", "festival"),
  grad("g-op1", "金辉", "#F7971E", "#FFD200", "opening"),
  // 图片背景（使用 Picsum，稳定且无需 key）
  {
    id: "p-mountain",
    label: "远山",
    url: "https://picsum.photos/seed/card-mountain/1200/900",
    theme: "common",
  },
  {
    id: "p-flower",
    label: "花田",
    url: "https://picsum.photos/seed/card-flower/1200/900",
    theme: "common",
  },
  {
    id: "p-sea",
    label: "海景",
    url: "https://picsum.photos/seed/card-sea/1200/900",
    theme: "common",
  },
  {
    id: "p-city",
    label: "城市",
    url: "https://picsum.photos/seed/card-city/1200/900",
    theme: "common",
  },
  {
    id: "p-forest",
    label: "林间",
    url: "https://picsum.photos/seed/card-forest/1200/900",
    theme: "common",
  },
  {
    id: "p-stars",
    label: "星空",
    url: "https://picsum.photos/seed/card-stars/1200/900",
    theme: "common",
  },
];

export function getBackgroundStyle(bg: BackgroundAsset): React.CSSProperties {
  if (bg.gradient) return { background: bg.gradient };
  if (bg.url) return { backgroundImage: `url(${bg.url})`, backgroundSize: "cover", backgroundPosition: "center" };
  return { background: "#FAF7F2" };
}

// 在线音乐库（使用可公开访问的免费音频）
export interface MusicAsset {
  id: string;
  title: string;
  artist: string;
  url: string;
  theme?: ThemeType | "common";
  duration: string;
}

export const MUSICS: MusicAsset[] = [
  {
    id: "m-piano1",
    title: "Quiet Reflection",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3",
    theme: "common",
    duration: "3:46",
  },
  {
    id: "m-piano2",
    title: "Tenderness",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-tenderness.mp3",
    theme: "thanks",
    duration: "3:36",
  },
  {
    id: "m-ukulele",
    title: "Happy Ukulele",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
    theme: "birthday",
    duration: "2:36",
  },
  {
    id: "m-acoustic",
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
    theme: "invitation",
    duration: "2:36",
  },
  {
    id: "m-romantic",
    title: "Romantic",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-romantic.mp3",
    theme: "wedding",
    duration: "3:46",
  },
  {
    id: "m-creative",
    title: "Creative Minds",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
    theme: "opening",
    duration: "2:36",
  },
  {
    id: "m-piano3",
    title: "Piano Moment",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-piano.mp3",
    theme: "thanks",
    duration: "3:36",
  },
];
