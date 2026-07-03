import { useState, useEffect, type RefObject } from "react";
import QRCode from "qrcode";
import { useCardStore, DEFAULT_EFFECTS } from "../../store/cardStore";
import { getThemeMeta } from "../../lib/constants";
import { CardCanvas } from "./CardCanvas";
import { ParticleEffect } from "./ParticleEffect";
import { buildShareUrl } from "../../lib/urlCodec";
import { exportCardAsImage, makeFileName } from "../../lib/exportImage";
import { PrimaryButton, GhostButton } from "../ui/Controls";
import { Download, Link2, Check, Monitor, Smartphone, Music2, Loader2, QrCode, X, RotateCcw } from "lucide-react";

interface PreviewPanelProps {
  canvasRef: RefObject<HTMLDivElement>;
}

export function PreviewPanel({ canvasRef }: PreviewPanelProps) {
  const { present } = useCardStore();
  const [previewRatio, setPreviewRatio] = useState<"4:3" | "3:4">("3:4");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string>("");
  // 动效重播：改变 key 强制 CardCanvas 重新挂载，让一次性动画（翻开/打字机/淡入）重新播放
  const [replayKey, setReplayKey] = useState(0);

  // 动效开关（兜底默认全开）
  const effects = { ...DEFAULT_EFFECTS, ...present.effects };
  // 把 effects 纳入 key：切换动效开关时自动重播
  const cardKey = `${replayKey}-${JSON.stringify(effects)}`;

  const replay = () => setReplayKey((k) => k + 1);

  const handleShare = () => {
    const url = buildShareUrl(present);
    setShareUrl(url);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 生成二维码
  useEffect(() => {
    if (!showQr || !shareUrl) return;
    QRCode.toDataURL(shareUrl, {
      width: 240,
      margin: 1,
      color: { dark: "#1A1A1A", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    })
      .then(setQrDataUrl)
      .catch((e) => console.error("QR generate failed", e));
  }, [showQr, shareUrl]);

  const handleDownload = async () => {
    const node = canvasRef.current;
    if (!node) return;
    setDownloading(true);
    try {
      const meta = getThemeMeta(present.theme);
      await exportCardAsImage(node, makeFileName(meta.label));
    } catch (e) {
      console.error(e);
      alert("导出失败，请重试");
    } finally {
      setDownloading(false);
    }
  };

  // 预览用的卡片状态（使用预览比例）
  const previewCard = { ...present, canvasRatio: previewRatio };

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
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-muted hover:text-clay hover:bg-clay/8 transition-colors ml-auto"
            title="重播动效"
          >
            <RotateCcw size={12} />
            重播动效
          </button>
        </div>

        <div className="rounded-xl overflow-hidden shadow-card bg-paper p-3">
          <div className={`relative origin-top mx-auto ${effects.cardOpen ? "kayan-card-enter" : ""}`} style={{ maxWidth: "100%" }}>
            <CardCanvas key={cardKey} card={previewCard} editable={false} />
            {effects.particles && <ParticleEffect theme={present.theme} style={effects.particleStyle ?? "auto"} />}
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
        <GhostButton
          onClick={() => {
            if (!shareUrl) handleShare();
            setShowQr(true);
          }}
          className="w-full"
        >
          <QrCode size={14} />
          生成二维码
        </GhostButton>
        <p className="text-[10px] text-muted text-center leading-relaxed pt-1">
          分享链接包含完整卡片状态，接收方打开即见，无需注册
        </p>
      </div>

      {/* 二维码弹层 */}
      {showQr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
          onClick={() => setShowQr(false)}
        >
          <div
            className="bg-paper rounded-2xl p-5 shadow-card max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-ink flex items-center gap-1.5">
                <QrCode size={15} className="text-clay" />
                扫码查看卡片
              </h3>
              <button
                onClick={() => setShowQr(false)}
                className="text-muted hover:text-ink transition-colors"
                aria-label="关闭"
              >
                <X size={16} />
              </button>
            </div>
            <div className="bg-white p-3 rounded-xl flex items-center justify-center mb-3">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="卡片二维码" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-line" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted text-center leading-relaxed mb-3">
              用手机相机或微信扫一扫，直接打开电子卡片
            </p>
            {qrDataUrl && (
              <GhostButton
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = qrDataUrl;
                  a.download = `kayan-qr-${Date.now()}.png`;
                  a.click();
                }}
                className="w-full text-xs"
              >
                <Download size={12} />
                保存二维码图片
              </GhostButton>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
