import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { useCardStore, DEFAULT_EFFECTS } from "../../store/cardStore";
import { getThemeMeta } from "../../lib/constants";
import { CardCanvas } from "./CardCanvas";
import { ParticleEffect } from "./ParticleEffect";
import { buildShareUrl, copyToClipboard } from "../../lib/urlCodec";
import { exportCardAsImage, makeFileName } from "../../lib/exportImage";
import { PrimaryButton, GhostButton } from "../ui/Controls";
import { Download, Link2, Check, Monitor, Smartphone, Music2, Loader2, QrCode, X, RotateCcw, ExternalLink } from "lucide-react";
import type { CardState } from "@/lib/types";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
}

// 分享/下载弹窗：所有屏幕尺寸都可用（小屏看不到右侧 PreviewPanel 时的替代入口）
export function ShareDialog({ open, onClose }: ShareDialogProps) {
  const { present } = useCardStore();
  const [previewRatio, setPreviewRatio] = useState<"4:3" | "3:4">("3:4");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string>("");
  const [replayKey, setReplayKey] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<string>("");
  const [shareGenerating, setShareGenerating] = useState(false);
  const [shareWarn, setShareWarn] = useState<string>("");
  const exportRef = useRef<HTMLDivElement>(null);

  const effects = { ...DEFAULT_EFFECTS, ...present.effects };
  const cardKey = `${replayKey}-${JSON.stringify(effects)}-${isExporting ? "export" : "live"}`;

  const replay = () => setReplayKey((k) => k + 1);

  // 显示轻提示，3 秒后消失
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleShare = async () => {
    setShareGenerating(true);
    setShareWarn("");
    try {
      const { url, tooLong, bytes } = await buildShareUrl(present);
      setShareUrl(url);
      const ok = await copyToClipboard(url);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast("分享链接已复制到剪贴板");
      } else {
        showToast("自动复制失败，请手动选中下方链接复制");
      }
      // 超长警告（微信等环境可能打不开）
      if (tooLong) {
        const kb = (bytes / 1024).toFixed(1);
        setShareWarn(`链接较大（${kb}KB），部分浏览器或微信可能打不开。建议改用「下载图片」分享。`);
      }
    } catch (e) {
      console.error("buildShareUrl failed", e);
      showToast("生成分享链接失败");
    } finally {
      setShareGenerating(false);
    }
  };

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
    const node = exportRef.current;
    if (!node) {
      showToast("画布未就绪，请稍后再试");
      return;
    }
    setDownloading(true);
    setIsExporting(true);
    try {
      // 等两帧让 DOM 在关闭动效后完成重渲染
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const meta = getThemeMeta(present.theme);
      await exportCardAsImage(node, makeFileName(meta.label));
      showToast("图片已开始下载，请检查浏览器下载列表");
    } catch (e) {
      console.error("导出失败:", e);
      showToast("导出失败：" + (e instanceof Error ? e.message : "未知错误"));
    } finally {
      setIsExporting(false);
      setDownloading(false);
    }
  };

  const previewCard: CardState = { ...present, canvasRatio: previewRatio };
  const exportCard: CardState = {
    ...previewCard,
    effects: { particles: false, cardOpen: false, photoFloat: false, typewriter: false },
  };

  if (!open) return null;

  return (
    <>
      {/* 隐藏的导出专用画布：固定尺寸，不受弹窗布局影响，html2canvas 截图更稳定 */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "600px",
          pointerEvents: "none",
          opacity: 1,
        }}
      >
        <div ref={exportRef} className="rounded-2xl overflow-hidden bg-paper">
          <CardCanvas card={exportCard} editable={false} />
        </div>
      </div>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        onClick={onClose}
      >
        <div
          className="bg-paper rounded-2xl shadow-card w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          <h3 className="text-sm font-semibold text-ink">分享 / 下载</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink transition-colors"
            aria-label="关闭"
          >
            <X size={16} />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto scroll-thin p-4">
          {/* 预览图 */}
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

          <div className="rounded-xl overflow-hidden shadow-card bg-paper p-3 mb-3">
            <div className={`relative origin-top mx-auto ${effects.cardOpen && !isExporting ? "kayan-card-enter" : ""}`} style={{ maxWidth: "100%" }}>
              <CardCanvas
                key={cardKey}
                card={isExporting ? exportCard : previewCard}
                editable={false}
              />
              {effects.particles && !isExporting && (
                <ParticleEffect theme={present.theme} style={effects.particleStyle ?? "auto"} />
              )}
            </div>
          </div>

          {present.music && (
            <div className="mb-3 flex items-center gap-2 p-2.5 rounded-lg bg-moss/8 border border-moss/15">
              <Music2 size={14} className="text-moss shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-ink truncate">{present.music.title}</p>
                <p className="text-[10px] text-muted">已搭配音乐</p>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="space-y-2">
            <PrimaryButton onClick={handleDownload} disabled={downloading} className="w-full">
              {downloading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  导出中…
                </>
              ) : (
                <>
                  <Download size={14} />
                  下载图片到本地
                </>
              )}
            </PrimaryButton>
            <GhostButton onClick={handleShare} disabled={shareGenerating} className="w-full">
              {shareGenerating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  正在压缩图片生成链接…
                </>
              ) : copied ? (
                <>
                  <Check size={14} className="text-moss" />
                  分享链接已复制
                </>
              ) : (
                <>
                  <Link2 size={14} />
                  生成分享链接
                </>
              )}
            </GhostButton>
            <GhostButton
              onClick={async () => {
                // 必须先确保 shareUrl 已生成，再显示二维码
                if (!shareUrl) {
                  await handleShare();
                }
                setShowQr(true);
              }}
              className="w-full"
            >
              <QrCode size={14} />
              生成二维码
            </GhostButton>
            {shareUrl && (
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 h-10 rounded-lg bg-moss/10 text-moss hover:bg-moss/20 transition-colors text-sm font-medium w-full"
              >
                <ExternalLink size={14} />
                在新标签页预览（验证链接）
              </a>
            )}
          </div>

          {shareUrl && (
            <div className="mt-3 p-2.5 rounded-lg bg-canvas border border-line">
              <p className="text-[10px] text-muted mb-1">分享链接（点击下方框可全选复制）：</p>
              <textarea
                value={shareUrl}
                readOnly
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                className="w-full text-[10px] text-ink/70 break-all font-mono leading-relaxed bg-transparent outline-none resize-none border-none"
                rows={3}
              />
            </div>
          )}

          {shareWarn && (
            <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-[11px] text-amber-700 leading-relaxed">⚠️ {shareWarn}</p>
            </div>
          )}

          <p className="text-[10px] text-muted text-center leading-relaxed pt-2">
            分享链接包含完整卡片状态，接收方打开即见，无需注册
          </p>
        </div>

        {/* toast 提示 */}
        {toast && (
          <div className="border-t border-line px-4 py-2 bg-clay/8 text-center">
            <p className="text-[11px] text-clay">{toast}</p>
          </div>
        )}

        {/* 二维码内嵌区 */}
        {showQr && (
          <div className="border-t border-line p-4 bg-canvas">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-ink flex items-center gap-1.5">
                <QrCode size={13} className="text-clay" />
                扫码查看卡片
              </h4>
              <button
                onClick={() => setShowQr(false)}
                className="text-muted hover:text-ink transition-colors"
                aria-label="关闭二维码"
              >
                <X size={14} />
              </button>
            </div>
            <div className="bg-white p-2 rounded-xl flex items-center justify-center mb-2">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="卡片二维码" className="w-40 h-40" />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center">
                  <Loader2 size={22} className="animate-spin text-line" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-muted text-center mb-2">
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
        )}
      </div>
    </div>
    </>
  );
}
