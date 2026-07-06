import { useState } from "react";
import { ThemeTab } from "./tabs/ThemeTab";
import { TextTab } from "./tabs/TextTab";
import { BackgroundTab } from "./tabs/BackgroundTab";
import { MusicTab } from "./tabs/MusicTab";
import { PhotoTab } from "./tabs/PhotoTab";
import { EffectsTab } from "./tabs/EffectsTab";
import { EnvelopeTab } from "./tabs/EnvelopeTab";
import { Palette, Type, Image, Music, Images, Sparkles, Mail } from "lucide-react";

type TabKey = "theme" | "text" | "background" | "music" | "photo" | "effect" | "envelope";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "theme", label: "主题", icon: <Palette size={15} /> },
  { key: "text", label: "文案", icon: <Type size={15} /> },
  { key: "background", label: "背景", icon: <Image size={15} /> },
  { key: "music", label: "音乐", icon: <Music size={15} /> },
  { key: "photo", label: "照片", icon: <Images size={15} /> },
  { key: "effect", label: "动效", icon: <Sparkles size={15} /> },
  { key: "envelope", label: "信封", icon: <Mail size={15} /> },
];

export function ControlPanel() {
  const [active, setActive] = useState<TabKey>("theme");

  return (
    <div className="flex flex-col h-full bg-canvas border-r border-line">
      {/* Tab 栏 */}
      <div className="flex border-b border-line bg-paper overflow-x-auto scroll-thin">
        {TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex-1 min-w-[52px] flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-all relative ${
                isActive ? "text-clay" : "text-muted hover:text-ink"
              }`}
            >
              {t.icon}
              {t.label}
              {isActive && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-clay rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 内容 */}
      <div className="flex-1 overflow-y-auto scroll-thin">
        {active === "theme" && <ThemeTab />}
        {active === "text" && <TextTab />}
        {active === "background" && <BackgroundTab />}
        {active === "music" && <MusicTab />}
        {active === "photo" && <PhotoTab />}
        {active === "effect" && <EffectsTab />}
        {active === "envelope" && <EnvelopeTab />}
      </div>
    </div>
  );
}
