import { forwardRef, useEffect, useRef, useState } from "react";
import type { CardState } from "@/lib/types";
import { backgroundToStyle, useCardStore, DEFAULT_EFFECTS } from "@/store/cardStore";
import { getFontStack } from "@/lib/constants";
import { EditablePhoto } from "@/components/editor/EditablePhoto";
import { EditableText } from "@/components/editor/EditableText";

interface CardCanvasProps {
  card: CardState;
  editable?: boolean;
  className?: string;
}

// 打字机效果：逐字显示正文，仅在查看模式启用
function TypewriterText({ text, delayMs = 0, totalMs = 3000 }: { text: string; delayMs?: number; totalMs?: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    if (!text) return;
    const len = text.length;
    const speed = Math.max(15, Math.min(50, totalMs / Math.max(len, 1)));
    const timers: number[] = [];
    for (let i = 0; i < len; i++) {
      timers.push(window.setTimeout(() => setShown(i + 1), delayMs + i * speed));
    }
    return () => timers.forEach((t) => clearTimeout(t));
  }, [text, delayMs, totalMs]);
  return <>{text.slice(0, shown)}</>;
}

// 卡片画布：渲染背景、照片、文字、自由文字。编辑模式下照片与自由文字可拖拽缩放。
export const CardCanvas = forwardRef<HTMLDivElement, CardCanvasProps>(
  ({ card, editable = false, className }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });

    // 合并外部 ref 与内部 ref
    useEffect(() => {
      if (typeof ref === "function") ref(innerRef.current);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = innerRef.current;
    }, [ref]);

    // 测量画布尺寸（用于百分比↔像素换算）
    useEffect(() => {
      if (!editable) return;
      const el = innerRef.current;
      if (!el) return;
      const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, [editable]);

    // 画布最小高度：保证比正文大，内容多时自动撑高
    const minHeight = card.canvasRatio === "4:3" ? 360 : 480;

    const text = card.text;
    const fontStack = getFontStack(text.font);

    // 动效开关（兜底默认全开）
    const effects = { ...DEFAULT_EFFECTS, ...card.effects };
    // 仅在查看模式且对应开关开启时才启用动效；编辑模式始终静态
    const useTypewriter = !editable && effects.typewriter;
    const usePhotoFloat = !editable && effects.photoFloat;

    // 查看模式动效时序：标题淡入 → 正文打字机 → 署名淡入
    const bodyLen = text.body.length;
    const bodySpeed = Math.max(15, Math.min(50, 3000 / Math.max(bodyLen, 1)));
    const signatureDelay = (600 + bodyLen * bodySpeed) / 1000 + 0.3;

    return (
      <div
        ref={innerRef}
        className={`relative w-full overflow-hidden rounded-2xl ${className ?? ""}`}
        style={{
          ...backgroundToStyle(card.background),
          minHeight,
        }}
        onPointerDown={editable ? (e) => {
          // 点击空白处取消选中（照片与自由文字）
          if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.bg === "1") {
            const st = useCardStore.getState();
            st.selectPhoto(null);
            st.selectFreeText(null);
          }
        } : undefined}
      >
        {/* 背景遮罩层 */}
        {card.background.overlayOpacity > 0 && (
          <div
            data-bg="1"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: card.background.overlay,
              opacity: card.background.overlayOpacity,
            }}
          />
        )}

        {/* 文字层（normal flow 撑开画布高度，照片 absolute 叠加在上） */}
        <div
          data-bg="1"
          className="relative z-0 flex flex-col items-center justify-center p-[8%] min-h-full text-center"
          style={{
            color: text.color,
            fontFamily: fontStack,
            textAlign: text.align,
            alignItems: text.align === "left" ? "flex-start" : text.align === "right" ? "flex-end" : "center",
            minHeight,
          }}
        >
          {card.salutation && card.recipient && (
            <p
              data-bg="1"
              className={`mb-3 ${useTypewriter ? "kayan-text-typing" : ""}`}
              style={{ fontSize: text.fontSize * 0.85, lineHeight: 1.6, animationDelay: "0.1s" }}
            >
              {card.salutation} {card.recipient}：
            </p>
          )}
          <h2
            data-bg="1"
            className={`font-semibold mb-4 leading-tight ${useTypewriter ? "kayan-text-typing" : ""}`}
            style={{ fontSize: text.fontSize * 1.8, lineHeight: 1.25, animationDelay: "0.3s" }}
          >
            {text.title}
          </h2>
          <p
            data-bg="1"
            className="leading-relaxed whitespace-pre-wrap max-w-full"
            style={{ fontSize: text.fontSize, lineHeight: 1.8 }}
          >
            {useTypewriter ? <TypewriterText text={text.body} delayMs={600} /> : text.body}
          </p>
          {text.signature && (
            <p
              data-bg="1"
              className={`mt-5 self-end ${useTypewriter ? "kayan-text-typing" : ""}`}
              style={{ fontSize: text.fontSize * 0.9, opacity: 0.92, animationDelay: `${signatureDelay}s` }}
            >
              {text.signature}
            </p>
          )}
        </div>

        {/* 照片层 */}
        {editable && size.w > 0
          ? card.photos
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((p) => <EditablePhoto key={p.id} photo={p} canvasWidth={size.w} canvasHeight={size.h} />)
          : card.photos
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .filter((p) => p.visible)
              .map((p) => (
                <div
                  key={p.id}
                  className={`absolute overflow-hidden rounded-md shadow-card ${usePhotoFloat ? "kayan-photo-float" : ""}`}
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: `${p.width}%`,
                    opacity: p.opacity,
                    zIndex: 10 + p.zIndex,
                    transform: `rotate(${p.rotation}deg)`,
                    animationDelay: `${((p.x + p.y) % 4) * 0.5}s`,
                    ["--base-rotate" as string]: `${p.rotation}deg`,
                  }}
                >
                  <img src={p.url} alt={p.name} className="w-full block" draggable={false} />
                </div>
              ))}

        {/* 自由文字层 */}
        {editable && size.w > 0
          ? card.freeTexts
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((t) => (
                <EditableText key={t.id} freeText={t} canvasWidth={size.w} canvasHeight={size.h} />
              ))
          : card.freeTexts
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .filter((t) => t.visible)
              .map((t) => (
                <div
                  key={t.id}
                  className="absolute flex items-center"
                  style={{
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    width: `${t.width}%`,
                    opacity: t.opacity,
                    zIndex: 10 + t.zIndex,
                    transform: `rotate(${t.rotation}deg)`,
                    justifyContent:
                      t.align === "left" ? "flex-start" : t.align === "right" ? "flex-end" : "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: getFontStack(t.font),
                      fontSize: t.fontSize,
                      color: t.color,
                      fontWeight: t.weight,
                      lineHeight: 1.3,
                      textAlign: t.align,
                      wordBreak: "break-word",
                      display: "inline-block",
                      maxWidth: "100%",
                    }}
                  >
                    {t.content}
                  </span>
                </div>
              ))}

        {/* 装饰角标 */}
        <div className="absolute top-3 left-3 text-[10px] tracking-widest uppercase text-ink/30 font-display italic select-none pointer-events-none">
          ka·yan
        </div>
      </div>
    );
  }
);
CardCanvas.displayName = "CardCanvas";
