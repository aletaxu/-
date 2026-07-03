import { useMemo } from "react";
import type { ThemeType, ParticleStyle } from "@/lib/types";

// 粒子运动类型
type ParticleKind = "rise" | "fall" | "twinkle";

interface ParticleConfig {
  emoji: string;
  kind: ParticleKind;
  count: number;
  minSize: number;
  maxSize: number;
}

// 主题默认粒子（auto 模式使用）
const THEME_PARTICLES: Record<ThemeType, ParticleStyle> = {
  birthday: "balloon",
  wedding: "petal",
  festival: "snow",
  thanks: "sparkle",
  invitation: "confetti",
  opening: "confetti",
};

// 粒子样式库：12 种可选模样
export const PARTICLE_LIBRARY: { id: ParticleStyle; label: string; emoji: string; config: ParticleConfig }[] = [
  { id: "balloon", label: "气球", emoji: "🎈", config: { emoji: "🎈", kind: "rise", count: 10, minSize: 18, maxSize: 32 } },
  { id: "petal", label: "花瓣", emoji: "🌸", config: { emoji: "🌸", kind: "fall", count: 16, minSize: 14, maxSize: 26 } },
  { id: "snow", label: "雪花", emoji: "❄️", config: { emoji: "❄️", kind: "fall", count: 18, minSize: 12, maxSize: 24 } },
  { id: "sparkle", label: "星光", emoji: "✨", config: { emoji: "✨", kind: "twinkle", count: 14, minSize: 12, maxSize: 22 } },
  { id: "confetti", label: "彩纸", emoji: "🎊", config: { emoji: "🎊", kind: "fall", count: 14, minSize: 16, maxSize: 28 } },
  { id: "heart", label: "爱心", emoji: "❤️", config: { emoji: "❤️", kind: "rise", count: 12, minSize: 14, maxSize: 24 } },
  { id: "leaf", label: "落叶", emoji: "🍂", config: { emoji: "🍂", kind: "fall", count: 14, minSize: 14, maxSize: 26 } },
  { id: "star", label: "星星", emoji: "⭐", config: { emoji: "⭐", kind: "twinkle", count: 16, minSize: 12, maxSize: 22 } },
  { id: "bubble", label: "气泡", emoji: "🫧", config: { emoji: "🫧", kind: "rise", count: 14, minSize: 14, maxSize: 28 } },
  { id: "butterfly", label: "蝴蝶", emoji: "🦋", config: { emoji: "🦋", kind: "rise", count: 8, minSize: 16, maxSize: 26 } },
  { id: "rain", label: "雨滴", emoji: "💧", config: { emoji: "💧", kind: "fall", count: 22, minSize: 10, maxSize: 18 } },
  { id: "firefly", label: "萤火", emoji: "🟡", config: { emoji: "🟡", kind: "twinkle", count: 18, minSize: 8, maxSize: 14 } },
];

// 根据 id 查找粒子配置
function resolveConfig(style: ParticleStyle, theme: ThemeType): ParticleConfig {
  // auto 模式：根据主题映射到具体样式
  const resolved = style === "auto" ? THEME_PARTICLES[theme] : style;
  return PARTICLE_LIBRARY.find((p) => p.id === resolved)?.config ?? PARTICLE_LIBRARY[0].config;
}

interface ParticleItem {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
}

interface ParticleEffectProps {
  theme: ThemeType;
  // 粒子样式，默认 auto（跟随主题）
  style?: ParticleStyle;
}

// 主题联动的粒子飘落/上升/闪烁特效层
// 覆盖在卡片上方，pointer-events:none，不影响交互
export function ParticleEffect({ theme, style = "auto" }: ParticleEffectProps) {
  const config = resolveConfig(style, theme);

  // 用 useMemo 固定随机参数，style/theme 变化时重新生成
  const particles = useMemo<ParticleItem[]>(() => {
    return Array.from({ length: config.count }, (_, i) => {
      const r = (n: number) => Math.random() * n;
      return {
        id: i,
        left: r(100),
        size: config.minSize + r(config.maxSize - config.minSize),
        delay: r(config.kind === "twinkle" ? 3 : 8),
        duration:
          config.kind === "twinkle"
            ? 2 + r(2)
            : config.kind === "rise"
            ? 6 + r(4)
            : 7 + r(5),
        drift: 20 + r(40),
        rotate: r(360),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.emoji, config.kind, config.count]);

  const animName =
    config.kind === "rise"
      ? "kayan-particle-rise"
      : config.kind === "fall"
      ? "kayan-particle-fall"
      : "kayan-particle-twinkle";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.left}%`,
            top: config.kind === "rise" ? "100%" : config.kind === "fall" ? "-5%" : `${p.left}%`,
            fontSize: `${p.size}px`,
            animationName: animName,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: config.kind === "twinkle" ? "ease-in-out" : "linear",
            ["--drift" as string]: `${p.drift}px`,
            ["--rotate" as string]: `${p.rotate}deg`,
            opacity: config.kind === "twinkle" ? 0 : 0.85,
          }}
        >
          {config.emoji}
        </span>
      ))}
    </div>
  );
}
