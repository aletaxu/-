import { useState, useRef } from "react";
import { useCardStore, createDefaultEnvelope, type EnvelopeAsset } from "@/store/cardStore";
import { SectionTitle, GhostButton, PrimaryButton, Field, TextInput } from "@/components/ui/Controls";
import { Mail, Upload, Trash2, Check, AlertCircle, X, Eye } from "lucide-react";

// 上传信封图大小上限：3MB（base64 后约 4MB）
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;

export function EnvelopeTab() {
  const {
    present,
    toggleEnvelope,
    setEnvelope,
    userEnvelopes,
    addUserEnvelope,
    removeUserEnvelope,
  } = useCardStore();
  const [uploadError, setUploadError] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

  const envelope = present.envelope;
  const enabled = !!envelope?.enabled;

  // 启用/关闭信封
  const handleToggle = (on: boolean) => {
    toggleEnvelope(on);
  };

  // 上传信封封面图
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(`文件过大（${(file.size / 1024 / 1024).toFixed(1)}MB），请上传小于 3MB 的图片`);
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("仅支持图片文件（jpg/png/webp 等）");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const id = `env_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const name = file.name.replace(/\.[^.]+$/, "");
      // 加入用户信封图库
      addUserEnvelope({
        id,
        url: dataUrl,
        name,
        addedAt: new Date().toISOString(),
      });
      // 同时设为当前信封封面
      setEnvelope({ coverUrl: dataUrl, coverSource: "custom" });
    };
    reader.onerror = () => setUploadError("读取文件失败，请重试");
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // 上传印章图
  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setUploadError("印章图片过大，请上传小于 500KB 的图片");
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("印章仅支持图片文件");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setEnvelope({ stampUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // 选用库中的信封图
  const handleSelectLib = (asset: EnvelopeAsset) => {
    if (envelope?.coverUrl === asset.url) {
      setEnvelope({ coverUrl: "" });
    } else {
      setEnvelope({ coverUrl: asset.url, coverSource: "custom" });
    }
  };

  // 删除库中的信封图
  const handleDeleteLib = (id: string) => {
    removeUserEnvelope(id);
  };

  return (
    <div className="p-4">
      <SectionTitle>
        <span className="flex items-center gap-1.5">
          <Mail size={14} className="text-clay" />
          信封
        </span>
      </SectionTitle>

      {/* 启用开关 */}
      <div className="mb-4 p-3 rounded-xl bg-paper border border-line flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink">启用信封</p>
          <p className="text-[10px] text-muted mt-0.5">查看卡片时先展示信封，点击翻盖打开露出卡片</p>
        </div>
        <button
          onClick={() => handleToggle(!enabled)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            enabled ? "bg-clay" : "bg-line"
          }`}
          aria-label={enabled ? "关闭信封" : "启用信封"}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-transform ${
              enabled ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      {!enabled ? (
        <p className="text-[11px] text-muted leading-relaxed text-center py-6">
          开启后，可在下方自定义信封封面图、收件人、寄件人和印章。
          <br />
          接收方打开分享链接时会先看到信封，点击后翻盖打开露出卡片。
        </p>
      ) : (
        <>
          {/* 上传信封封面 */}
          <div className="mb-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
            <PrimaryButton
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload size={14} />
              上传信封封面图
            </PrimaryButton>
            {uploadError && (
              <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-clay/8 border border-clay/20">
                <AlertCircle size={12} className="text-clay shrink-0 mt-0.5" />
                <p className="text-[11px] text-clay leading-relaxed">{uploadError}</p>
              </div>
            )}
            <p className="text-[10px] text-muted mt-1.5 leading-relaxed">
              建议 3:2 横版图片，≤ 3MB。上传的图片保存在本地浏览器，不会上传到服务器。
            </p>

            {/* 分享限制提示 */}
            {envelope?.coverUrl && envelope.coverUrl.startsWith("data:") && (
              <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200">
                <AlertCircle size={12} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  自定义信封图体积较大，分享链接可能过长。建议改用「下载图片」分享，或保持信封图较小。
                </p>
              </div>
            )}
          </div>

          {/* 当前封面预览 */}
          {envelope?.coverUrl && (
            <div className="mb-5">
              <SectionTitle>
                <span className="text-xs">当前封面</span>
                <button
                  onClick={() => setEnvelope({ coverUrl: "" })}
                  className="text-[11px] text-muted hover:text-clay transition-colors flex items-center gap-0.5"
                >
                  <X size={11} /> 移除
                </button>
              </SectionTitle>
              <div
                className="w-full rounded-lg overflow-hidden border border-line"
                style={{
                  aspectRatio: "3 / 2",
                  backgroundImage: `url(${envelope.coverUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          )}

          {/* 收件人 / 寄件人 */}
          <Field label="收件人" hint="信封正中显示">
            <TextInput
              value={envelope?.recipientName ?? ""}
              onChange={(e) => setEnvelope({ recipientName: e.target.value })}
              placeholder="例如：小满"
            />
          </Field>
          <Field label="寄件人" hint="信封左下角显示">
            <TextInput
              value={envelope?.senderName ?? ""}
              onChange={(e) => setEnvelope({ senderName: e.target.value })}
              placeholder="例如：你的朋友"
            />
          </Field>

          {/* 印章图（可选） */}
          <Field label="印章 / 邮票图" hint="右上角，可选">
            <input
              ref={stampInputRef}
              type="file"
              accept="image/*"
              onChange={handleStampUpload}
              className="hidden"
            />
            <div className="flex items-center gap-2">
              {envelope?.stampUrl ? (
                <div className="relative w-10 h-12 rounded-sm overflow-hidden border border-line">
                  <img src={envelope.stampUrl} alt="印章" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setEnvelope({ stampUrl: "" })}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-clay text-white flex items-center justify-center"
                    aria-label="移除印章"
                  >
                    <X size={9} />
                  </button>
                </div>
              ) : (
                <GhostButton onClick={() => stampInputRef.current?.click()} className="text-xs">
                  <Upload size={12} />
                  上传印章
                </GhostButton>
              )}
            </div>
          </Field>

          {/* 封口颜色 */}
          <Field label="封口颜色">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={envelope?.sealColor ?? "#D97757"}
                onChange={(e) => setEnvelope({ sealColor: e.target.value })}
                className="w-10 h-9 rounded cursor-pointer border border-line"
              />
              <span className="text-xs text-muted font-mono">
                {envelope?.sealColor ?? "#D97757"}
              </span>
            </div>
          </Field>

          {/* 我的信封图库 */}
          {userEnvelopes.length > 0 && (
            <div className="mt-5">
              <SectionTitle>
                <span className="text-xs">我的信封图（{userEnvelopes.length}）</span>
              </SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                {userEnvelopes.map((asset) => {
                  const selected = envelope?.coverUrl === asset.url;
                  return (
                    <div
                      key={asset.id}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all group ${
                        selected ? "border-clay" : "border-line hover:border-clay/40"
                      }`}
                      style={{ aspectRatio: "3 / 2" }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${asset.url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      {/* 选中标记 */}
                      {selected && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-clay text-white flex items-center justify-center">
                          <Check size={11} />
                        </div>
                      )}
                      {/* 操作按钮 */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end justify-end gap-1 p-1">
                        <button
                          onClick={() => handleSelectLib(asset)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-white/90 text-ink hover:bg-white flex items-center justify-center"
                          aria-label="选用"
                          title="选用"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteLib(asset.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-white/90 text-clay hover:bg-white flex items-center justify-center"
                          aria-label="删除"
                          title="删除"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 预览信封效果 */}
          <GhostButton
            onClick={() => setPreviewOpen(true)}
            className="w-full mt-4 text-xs"
          >
            <Eye size={12} />
            预览信封效果
          </GhostButton>
        </>
      )}

      {/* 信封预览弹层 */}
      {previewOpen && envelope && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="bg-paper rounded-2xl shadow-card p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ink">信封预览</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-muted hover:text-ink"
                aria-label="关闭"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex justify-center">
              <div
                className="relative rounded-lg overflow-hidden shadow-lift"
                style={{
                  width: "280px",
                  aspectRatio: "3 / 2",
                  background: envelope.coverUrl
                    ? `url(${envelope.coverUrl}) center/cover`
                    : "linear-gradient(135deg, #F5E6D3 0%, #ECD7BC 100%)",
                }}
              >
                <div className="absolute inset-0 bg-black/15" />
                {envelope.stampUrl && (
                  <div className="absolute top-3 right-3 w-10 h-12 rounded-sm overflow-hidden border-2 border-white/70 rotate-3">
                    <img src={envelope.stampUrl} alt="印章" className="w-full h-full object-cover" />
                  </div>
                )}
                {envelope.recipientName && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[9px] tracking-widest text-ink/50 uppercase mb-1">TO</p>
                      <p className="font-display text-lg font-semibold text-ink/85">
                        {envelope.recipientName}
                      </p>
                    </div>
                  </div>
                )}
                {envelope.senderName && (
                  <div className="absolute bottom-3 left-3">
                    <p className="text-[8px] tracking-wider text-ink/50 uppercase">FROM</p>
                    <p className="text-[11px] text-ink/70 font-medium">{envelope.senderName}</p>
                  </div>
                )}
                {/* 封口三角 */}
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{
                    height: "50%",
                    background: envelope.coverUrl
                      ? `url(${envelope.coverUrl}) center/cover`
                      : "linear-gradient(135deg, #ECD7BC 0%, #D9B890 100%)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  }}
                />
              </div>
            </div>
            <p className="text-[11px] text-muted text-center mt-4 leading-relaxed">
              接收方打开分享链接时会看到此信封，点击翻盖后露出卡片
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
