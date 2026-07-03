import { useRef } from "react";
import { useCardStore } from "@/store/cardStore";
import { BACKGROUNDS, getBackgroundStyle } from "@/lib/assets";
import { OVERLAY_COLORS } from "@/lib/constants";
import { Field, Slider, SectionTitle, PrimaryButton, GhostButton } from "@/components/ui/Controls";
import { Upload, Check, Image as ImageIcon } from "lucide-react";

export function BackgroundTab() {
  const { present, setBackground } = useCardStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setBackground({ source: "custom", url: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handlePickLibrary = (bg: (typeof BACKGROUNDS)[number]) => {
    if (bg.gradient) {
      // 渐变存为 "gradient:" 前缀
      setBackground({ source: "library", url: `gradient:${bg.gradient}` });
    } else if (bg.url) {
      setBackground({ source: "library", url: bg.url });
    }
  };

  const currentUrl = present.background.url;
  const isGradient = currentUrl.startsWith("gradient:");

  return (
    <div className="p-4">
      <SectionTitle>自定义上传</SectionTitle>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleUpload(f);
          e.target.value = "";
        }}
      />
      <PrimaryButton onClick={() => fileRef.current?.click()} className="w-full mb-2">
        <Upload size={14} />
        上传本地图片
      </PrimaryButton>
      {present.background.source === "custom" && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-clay/8 border border-clay/20 mb-4">
          <ImageIcon size={14} className="text-clay shrink-0" />
          <span className="text-xs text-ink/70 truncate">已使用自定义图片</span>
          <Check size={14} className="text-clay ml-auto shrink-0" />
        </div>
      )}

      <SectionTitle>在线素材库</SectionTitle>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {BACKGROUNDS.map((bg) => {
          const active =
            (isGradient && currentUrl === `gradient:${bg.gradient}`) ||
            (!isGradient && currentUrl === bg.url && bg.url !== "");
          return (
            <button
              key={bg.id}
              onClick={() => handlePickLibrary(bg)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                active ? "border-clay scale-[1.02]" : "border-transparent hover:border-clay/40"
              }`}
              style={getBackgroundStyle(bg)}
              title={bg.label}
            >
              <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white font-medium drop-shadow truncate">
                {bg.label}
              </span>
              {active && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-clay flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <SectionTitle>背景遮罩</SectionTitle>
      <p className="text-xs text-muted mb-3">为背景叠加一层半透明颜色，让文字更易读</p>
      <Field label="遮罩颜色">
        <div className="flex flex-wrap gap-1.5">
          {OVERLAY_COLORS.map((c) => {
            const active = present.background.overlay === c;
            return (
              <button
                key={c}
                onClick={() => setBackground({ overlay: c })}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  active ? "border-clay scale-110" : "border-line hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            );
          })}
        </div>
      </Field>

      <Slider
        label="遮罩浓度"
        value={Math.round(present.background.overlayOpacity * 100)}
        min={0}
        max={90}
        step={5}
        suffix="%"
        onChange={(v) => setBackground({ overlayOpacity: v / 100 })}
      />

      {present.background.overlayOpacity > 0 && (
        <GhostButton onClick={() => setBackground({ overlayOpacity: 0 })} className="w-full text-xs">
          清除遮罩
        </GhostButton>
      )}
    </div>
  );
}
