import { useState, useEffect, useCallback } from "react";
import type { EnvelopeConfig } from "@/lib/types";
import { Mail } from "lucide-react";

interface EnvelopeProps {
  envelope: EnvelopeConfig;
  onOpened: () => void; // 信封打开动画完成后回调（用于切换到卡片展示）
  autoOpenDelayMs?: number; // 自动打开延迟（毫秒），0 表示不自动打开
}

type Stage = "closed" | "opening" | "opened";

/**
 * 信封组件：先展示带封口的信封，点击后翻盖打开，露出卡片。
 *
 * 视觉结构（CSS 3D）：
 *   ┌────────────────────────┐
 *   │ △ 信封封口（顶部三角） │  ← 点击后绕顶边 rotateX -180° 翻开
 *   ├────────────────────────┤
 *   │   收件人 / 寄件人       │
 *   │   [自定义封面图]        │
 *   └────────────────────────┘
 */
export function Envelope({ envelope, onOpened, autoOpenDelayMs = 0 }: EnvelopeProps) {
  const [stage, setStage] = useState<Stage>("closed");

  // 自动打开（用于分享链接打开后自动播放）
  useEffect(() => {
    if (autoOpenDelayMs > 0 && stage === "closed") {
      const t = setTimeout(() => setStage("opening"), autoOpenDelayMs);
      return () => clearTimeout(t);
    }
  }, [autoOpenDelayMs, stage]);

  const handleOpen = useCallback(() => {
    if (stage !== "closed") return;
    setStage("opening");
    // 翻盖动画 800ms + 卡片上升 900ms，约 1.5s 后完成
    setTimeout(() => {
      setStage("opened");
      onOpened();
    }, 1500);
  }, [stage, onOpened]);

  const openDuration = envelope.openDuration ?? 1.2;
  // 信封呼吸提示：仅未打开时启用
  const breatheClass = stage === "closed" ? "kayan-env-breathe" : "";

  return (
    <div className="flex flex-col items-center select-none">
      {/* 信封主体 */}
      <div
        className={`relative ${breatheClass}`}
        style={{
          width: "min(360px, 86vw)",
          aspectRatio: "3 / 2",
          perspective: "1400px",
        }}
      >
        {/* 信封底盒（始终显示） */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden shadow-lift"
          style={{
            background: envelope.coverUrl
              ? `url(${envelope.coverUrl}) center/cover`
              : "linear-gradient(135deg, #F5E6D3 0%, #ECD7BC 100%)",
          }}
        >
          {/* 半透明遮罩，让文字更清晰 */}
          <div className="absolute inset-0 bg-black/15" />

          {/* 邮票/印章（右上角） */}
          {envelope.stampUrl && (
            <div className="absolute top-3 right-3 w-12 h-14 rounded-sm overflow-hidden border-2 border-white/70 shadow-soft rotate-3">
              <img src={envelope.stampUrl} alt="印章" className="w-full h-full object-cover" />
            </div>
          )}

          {/* 收件人（正中） */}
          {envelope.recipientName && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <p className="text-[10px] tracking-widest text-ink/50 uppercase mb-1">TO</p>
                <p className="font-display text-xl font-semibold text-ink/85 leading-snug">
                  {envelope.recipientName}
                </p>
              </div>
            </div>
          )}

          {/* 寄件人（左下角） */}
          {envelope.senderName && (
            <div className="absolute bottom-3 left-3">
              <p className="text-[9px] tracking-wider text-ink/50 uppercase">FROM</p>
              <p className="text-xs text-ink/70 font-medium">{envelope.senderName}</p>
            </div>
          )}
        </div>

        {/* 信封封口（顶部三角，点击翻盖） */}
        <div
          className="absolute top-0 left-0 right-0 origin-top"
          style={{
            height: "50%",
            transformStyle: "preserve-3d",
            transform: stage === "closed" ? "rotateX(0deg)" : "rotateX(-180deg)",
            transition: stage === "opening" || stage === "opened"
              ? `transform ${openDuration}s cubic-bezier(0.6, 0, 0.4, 1) forwards`
              : "none",
            zIndex: 5,
          }}
        >
          {/* 封口正面（封闭时可见） */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              background: envelope.coverUrl
                ? `url(${envelope.coverUrl}) center/cover`
                : "linear-gradient(135deg, #ECD7BC 0%, #D9B890 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {/* 封口蜡封（正中下方） */}
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center shadow-soft"
              style={{
                bottom: "12%",
                width: "40px",
                height: "40px",
                background: envelope.sealColor,
              }}
            >
              <Mail size={16} className="text-white/90" />
            </div>
          </div>
          {/* 封口背面（翻开后可见，颜色稍暗） */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
              background: envelope.coverUrl
                ? `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${envelope.coverUrl}) center/cover`
                : "linear-gradient(135deg, #D9B890 0%, #B89370 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
        </div>

        {/* 点击区域（未打开时整个信封可点击） */}
        {stage === "closed" && (
          <button
            onClick={handleOpen}
            className="absolute inset-0 z-10 cursor-pointer"
            aria-label="点击打开信封"
            title="点击打开信封"
          />
        )}
      </div>

      {/* 提示文字 */}
      {stage === "closed" && (
        <p className="mt-5 text-xs text-muted animate-pulse">
          ↑ 点击信封打开查看
        </p>
      )}
      {stage === "opening" && (
        <p className="mt-5 text-xs text-muted">正在打开…</p>
      )}
    </div>
  );
}
