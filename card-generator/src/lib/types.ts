// 卡片生成器核心类型定义

export type ThemeType =
  | "birthday"
  | "invitation"
  | "opening"
  | "wedding"
  | "festival"
  | "thanks";

export type ToneType = "warm" | "humor" | "formal" | "poetic" | "playful";

export type CanvasRatio = "4:3" | "3:4";

export interface Background {
  source: "custom" | "library";
  url: string;
  gradient?: string; // 渐变 CSS（如 linear-gradient(...)），url 为空时使用
  overlay: string; // 遮罩色 hex
  overlayOpacity: number; // 0-1
}

export interface Music {
  id: string;
  title: string;
  url: string;
  enabled: boolean;
}

export interface Photo {
  id: string;
  name: string;
  url: string;
  x: number; // 百分比 0-100（左上角）
  y: number; // 百分比 0-100
  width: number; // 百分比 0-100（相对画布宽度）
  rotation: number; // -180~180
  opacity: number; // 0-1
  zIndex: number;
  visible: boolean;
}

export interface TextContent {
  title: string;
  body: string;
  signature: string;
  font: string; // 字体族标识
  fontSize: number; // px
  color: string; // hex
  align: "left" | "center" | "right";
}

// 自由文字标签：可拖拽、旋转、缩放的独立文字块（用于装饰性文字、日期、地点等）
export interface FreeText {
  id: string;
  content: string;
  x: number; // 百分比 0-100（左上角）
  y: number; // 百分比 0-100
  width: number; // 百分比 0-100（相对画布宽度）
  fontSize: number; // px
  color: string; // hex
  font: string; // 字体族标识
  rotation: number; // -180~180
  opacity: number; // 0-1
  zIndex: number;
  visible: boolean;
  weight: number; // 400 | 600 | 700
  align: "left" | "center" | "right";
}

// 粒子样式标识：auto=跟随主题，其余为用户手动指定
export type ParticleStyle =
  | "auto"
  | "balloon"
  | "petal"
  | "snow"
  | "sparkle"
  | "confetti"
  | "heart"
  | "leaf"
  | "star"
  | "bubble"
  | "butterfly"
  | "rain"
  | "firefly";

// 动效开关：控制查看模式下各类动画是否启用
export interface EffectsConfig {
  particles: boolean; // 粒子飘落（主题联动）
  cardOpen: boolean; // 贺卡翻开入场动画
  photoFloat: boolean; // 照片浮动
  typewriter: boolean; // 文字打字机效果
  // 粒子样式（可选，默认 auto 跟随主题）
  particleStyle?: ParticleStyle;
}

export interface CardState {
  id: string;
  theme: ThemeType;
  sender: string;
  recipient: string;
  salutation: string;
  background: Background;
  music: Music | null;
  photos: Photo[];
  freeTexts: FreeText[];
  text: TextContent;
  canvasRatio: CanvasRatio;
  // 动效开关（可选，旧数据通过 normalizeCard 补全为默认全开）
  effects?: EffectsConfig;
  createdAt: string;
  // 最后更新时间（可选，用于草稿排序与相对时间展示）
  updatedAt?: string;
}

export interface GenerateParams {
  theme: ThemeType;
  tone: ToneType;
  wordCount: number;
  font: string;
  fontSize: number;
  sender: string;
  recipient: string;
  salutation?: string;
}

export interface GeneratedContent {
  title: string;
  body: string;
  signature: string;
}

// AI 生成参数（编辑器内的临时配置，不持久化为卡片状态）
export interface GenConfig {
  tone: ToneType;
  wordCount: number;
  font: string;
  fontSize: number;
}
