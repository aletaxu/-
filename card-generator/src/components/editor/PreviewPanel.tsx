import { useState, useRef } from "react";
import { useCardStore, DEFAULT_EFFECTS } from "../../store/cardStore";
import { getThemeMeta } from "../../lib/constants";
import { CardCanvas } from "./CardCanvas";
import { ParticleEffect } from "./ParticleEffect";
import { buildShareUrl, copyToClipboard } from "../../lib/urlCodec";
import { exportCardAsImage, makeFileName } from "../../lib/exportImage";
import { PrimaryButton, GhostButton } from "../ui/Controls";
import { Download, Link2, Check, Monitor, Smartphone, Music2, Loader2, RotateCcw } from "lucide-react";
import type { CardState } from "@/lib/types";

export function PreviewPanel() {
  const { present } = useCardStore();
  const [previewRatio, setPreviewRatio] = useState<"4:3" | "3:4">("3:4");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  // 动效重播：改变 key 强制 CardCanvas 重新挂载，让一次性动画（翻开/打字机/淡入）重新播放
  const [replayKey, setReplayKey] = useState(0);
  // 导出中：临时关闭粒子和动画，确保导出图片干净无偏移
  const [isExporting, setIsExporting] = useState(false);
  // 导出专用 ref：始终指向预览区的 CardCanvas（editable=false，无 react-rnd 包裹、无选中边框）
  const exportRef = useRef<HTMLDivElement>(null);

  // 动效开关（兜底默认全开）
  const effects = { ...DEFAULT_EFFECTS, ...present.effects };
  // 把 effects 纳入 key：切换动效开关时自动重播
  const cardKey = `${replayKey}-${JSON.stringify(effects)}-${isExporting ? "export" : "live"}`;

  const replay = () => setReplayKey((k) => k + 1);

  const handleShare = async () => {
    try {
      const { url } = await buildShareUrl(present);
      setShareUrl(url);
      const ok = await copyToClipboard(url);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error("buildShareUrl failed", e);
    }
  };

  const handleDownload = async () => {
    const node = exportRef.current;
    if (!node) return;
    setDownloading(true);
    setIsExporting(true);
    try {
      // 等待 React 重新渲染（isExporting=true → 关闭粒子/动画的 CardCanvas 已挂载）
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const meta = getThemeMeta(present.theme);
      await exportCardAsImage(node, makeFileName(meta.label));
    } catch (e) {
      console.error(e);
      alert("导出失败，请重试");
    } finally {
      setIsExporting(false);
      setDownloading(false);
    }
  };

  // 预览用的卡片状态（使用预览比例）
  const previewCard: CardState = { ...present, canvasRatio: previewRatio };
  // 导出时强制关闭所有动效，避免粒子遮挡、照片浮动偏移、打字机截断
  const exportCard: CardState = {
    ...previewCard,
    effects: { particles: false, cardOpen: false, photoFloat: false, typewriter: false },
  };

  return (
    <aside className="flex flex-col h-full bg-canvas border-l border-line">
      <div className="px-4 py-3 border-b border-line">
        <h2 className="text-sm font-semibold text-ink">实时预览</h2>
        <p className="text-[11px] text-muted">同步显示卡片最终效果</p>
      </div>

      {/* 预览图 */}
      <div className="flex-1 overflow-y-auto scroll-thin p-4">
        <div className="flex items-center gap-1 mb-3 justify-center">
          <button
            onClick={() => setPreviewRatio("4:3")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${
              previewRatio === "4:3" ? "bg-clay/10 text-clay" : "text-muted hover:text-ink"
            }`}
          >
            <Monitor size={12} />
            横版
          </button>
          <button
            onClick={() => setPreviewRatio("3:4")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${
              previewRatio === "3:4" ? "bg-clay/10 text-clay" : "text-muted hover:text-ink"
            }`}
          >
            <Smartphone size={12} />
            竖版
          </button>
          <button
            onClick={replay}
            disabled={isExporting}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-muted hover:text-clay hover:bg-clay/8 transition-colors ml-auto disabled:opacity-50"
            title="重播动效"
          >
            <RotateCcw size={12} />
            重播动效
          </button>
        </div>

        <div className="rounded-xl overflow-hidden shadow-card bg-paper p-3">
          <div className={`relative origin-top mx-auto ${effects.cardOpen && !isExporting ? "kayan-card-enter" : ""}`} style={{ maxWidth: "100%" }}>
            <CardCanvas
              key={cardKey}
              ref={exportRef}
              card={isExporting ? exportCard : previewCard}
              editable={false}
            />
            {effects.particles && !isExporting && (
              <ParticleEffect theme={present.theme} style={effects.particleStyle ?? "auto"} />
            )}
          </div>
        </div>

        {present.music && (
          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-moss/8 border border-moss/15">
            <Music2 size={14} className="text-moss shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ink truncate">{present.music.title}</p>
              <p className="text-[10px] text-muted">已搭配音乐</p>
            </div>
          </div>
        )}
      </div>

      {/* 操作区 */}
      <div className="p-4 border-t border-line space-y-2 bg-paper">
        <PrimaryButton onClick={handleDownload} disabled={downloading} className="w-full">
          {downloading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              导出中…
            </>
          ) : (
            <>
              <Download size={14} />
              下载图片
            </>
          )}
        </PrimaryButton>
        <GhostButton onClick={handleShare} className="w-full">
          {copied ? (
            <>
              <Check size={14} className="text-moss" />
              链接已复制
            </>
          ) : (
            <>
              <Link2 size={14} />
              分享电子卡片
            </>
          )}
        </GhostButton>
        <p className="text-[10px] text-muted text-center leading-relaxed pt-1">
          分享链接包含完整卡片状态，接收方打开即见，无需注册
        </p>
      </div>
    </aside>
  );
}
