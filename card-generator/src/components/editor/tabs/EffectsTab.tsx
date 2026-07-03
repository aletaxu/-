import { useCardStore, DEFAULT_EFFECTS } from "@/store/cardStore";
import type { EffectsConfig, ParticleStyle } from "@/lib/types";
import { PARTICLE_LIBRARY } from "@/components/editor/ParticleEffect";
import { SectionTitle, GhostButton } from "@/components/ui/Controls";
import { Sparkles, PartyPopper, BookOpen, Image, Type, RotateCcw } from "lucide-react";

// 每个动效的元信息：图标、标题、描述、预览
interface EffectMeta {
  key: "particles" | "cardOpen" | "photoFloat" | "typewriter";
  icon: React.ReactNode;
  title: string;
  desc: string;
  preview: string;
}

const EFFECTS: EffectMeta[] = [
  {
    key: "particles",
    icon: <PartyPopper size={15} className="text-clay" />,
    title: "粒子飘落",
    desc: "根据主题自动配特效：生日气球上升、婚礼花瓣飘落、节日雪花、感谢星光闪烁",
    preview: "🎈🌸❄️✨",
  },
  {
    key: "cardOpen",
    icon: <BookOpen size={15} className="text-clay" />,
    title: "贺卡翻开入场",
    desc: "接收方打开卡片时，从对折状态缓缓展开，仪式感拉满",
    preview: "📖→ unfolding",
  },
  {
    key: "photoFloat",
    icon: <Image size={15} className="text-clay" />,
    title: "照片浮动",
    desc: "卡片里的照片轻微上下漂浮，让静态照片「活」起来",
    preview: "🖼️ floating",
  },
  {
    key: "typewriter",
    icon: <Type size={15} className="text-clay" />,
    title: "文字打字机",
    desc: "标题淡入、正文逐字浮现、署名延迟出现，增强阅读节奏",
    preview: "T|y|p|e...",
  },
];

export function EffectsTab() {
  const { present, setEffects } = useCardStore();
  // normalizeCard 已确保 effects 存在，这里兜底
  const effects: EffectsConfig = { ...DEFAULT_EFFECTS, ...present.effects };
  const enabledCount = EFFECTS.filter((e) => effects[e.key]).length;

  const toggle = (key: EffectMeta["key"]) => {
    setEffects({ [key]: !effects[key] } as Partial<EffectsConfig>);
  };

  return (
    <div className="p-4">
      <SectionTitle>
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-clay" />
          动效设置
        </span>
      </SectionTitle>

      <p className="text-xs text-muted mb-4 leading-relaxed">
        为卡片添加动态效果，让接收方打开时有惊喜感。动效仅在「查看卡片」时播放，编辑时保持静态便于操作。已启用 {enabledCount}/{EFFECTS.length} 项。
      </p>

      <div className="space-y-2 mb-5">
        {EFFECTS.map((eff) => {
          const on = effects[eff.key];
          return (
            <div
              key={eff.key}
              className={`relative flex items-start gap-3 p-3 rounded-xl border transition-all ${
                on ? "border-clay bg-clay/8" : "border-line bg-paper"
              }`}
            >
              <div className="shrink-0 mt-0.5">{eff.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-medium text-ink">{eff.title}</p>
                  {/* 自定义开关 */}
                  <button
                    onClick={() => toggle(eff.key)}
                    role="switch"
                    aria-checked={on}
                    aria-label={eff.title}
                    className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
                      on ? "bg-clay" : "bg-line"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        on ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-muted leading-relaxed mb-1.5">{eff.desc}</p>
                <p className="text-[11px] font-mono text-clay/70 truncate">{eff.preview}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 粒子样式选择：仅在粒子开启时显示 */}
      {effects.particles && (
        <div className="mb-4">
          <SectionTitle>
            <span className="text-xs">粒子模样</span>
          </SectionTitle>
          <p className="text-[11px] text-muted mb-3 leading-relaxed">
            选择喜欢的粒子样式，默认跟随主题（生日气球 / 婚礼花瓣 / 节日雪花…）
          </p>
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {/* 跟随主题 */}
            <button
              onClick={() => setEffects({ particleStyle: "auto" })}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all ${
                (effects.particleStyle ?? "auto") === "auto"
                  ? "border-clay bg-clay/8 shadow-soft"
                  : "border-line bg-paper hover:border-clay/40"
              }`}
              title="根据主题自动选择"
            >
              <span className="text-xl">🎯</span>
              <span className="text-[10px] text-ink/80">跟随主题</span>
            </button>
            {PARTICLE_LIBRARY.map((p) => {
              const active = effects.particleStyle === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setEffects({ particleStyle: p.id as ParticleStyle })}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all ${
                    active
                      ? "border-clay bg-clay/8 shadow-soft"
                      : "border-line bg-paper hover:border-clay/40"
                  }`}
                  title={p.label}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-[10px] text-ink/80">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-3 rounded-xl bg-canvas border border-line mb-4">
        <p className="text-[11px] text-muted leading-relaxed">
          💡 小贴士：动效遵循系统「减少动画」偏好，接收方若开启了该选项会自动禁用。分享链接会携带动效设置。
        </p>
      </div>

      <GhostButton
        onClick={() => setEffects({ ...DEFAULT_EFFECTS })}
        className="w-full text-xs"
      >
        <RotateCcw size={12} />
        重置全部
      </GhostButton>
    </div>
  );
}
