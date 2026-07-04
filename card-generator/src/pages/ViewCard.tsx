import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { decodeCardFromUrl } from "../lib/urlCodec";
import { getThemeMeta } from "../lib/constants";
import { CardCanvas } from "../components/editor/CardCanvas";
import { getPlayer, findMusic } from "@/lib/musicSynth";
import { DEFAULT_EFFECTS, normalizeCard } from "@/store/cardStore";
import { ParticleEffect } from "@/components/editor/ParticleEffect";
import type { CardState } from "../lib/types";
import { Play, Pause, Music2, ArrowLeft, Sparkles } from "lucide-react";

export default function ViewCard() {
  const { data } = useParams<{ data: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardState | null>(null);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!data) {
      setError(true);
      return;
    }
    const decoded = decodeCardFromUrl(data);
    if (!decoded) {
      setError(true);
      return;
    }
    // 兜底：补齐缺失的 effects/freeTexts 等字段，兼容旧链接
    setCard(normalizeCard(decoded));
    document.title = `卡言 · ${decoded.text.title || "电子卡片"}`;
    // 离开页面时停止音乐
    return () => {
      getPlayer().stop();
    };
  }, [data]);

  const toggleMusic = () => {
    if (!card?.music) return;
    const player = getPlayer();
    if (playing) {
      player.stop();
      setPlaying(false);
    } else {
      // 分享链接已剥离上传音乐（dataURL 过大），这里只会是合成音乐
      const m = findMusic(card.music.id);
      if (m) {
        player.play(m, () => setPlaying(false));
        setPlaying(true);
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas p-6 text-center">
        <Sparkles size={40} className="text-line mb-4" />
        <h1 className="text-xl font-display font-semibold text-ink mb-2">卡片链接已失效</h1>
        <p className="text-sm text-muted mb-6">无法解析该卡片数据，可能链接不完整</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-clay text-white rounded-lg text-sm hover:bg-clay-deep transition-colors"
        >
          去创建一张新卡片
        </button>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="w-8 h-8 border-2 border-clay border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const themeMeta = getThemeMeta(card.theme);
  // 动效开关（兜底默认全开）
  const effects = { ...DEFAULT_EFFECTS, ...card.effects };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-canvas via-canvas to-paper">
      {/* 顶部信息条 */}
      <header className="px-5 py-4 flex items-center justify-between max-w-3xl mx-auto w-full">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-clay transition-colors"
        >
          <ArrowLeft size={16} />
          返回编辑器
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-clay to-clay-deep flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-display text-sm font-semibold text-ink">卡言</span>
        </div>
      </header>

      {/* 卡片展示 */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-4">
        <div className="text-center mb-5">
          <p className="text-xs text-muted mb-1">
            {card.sender} 寄给 {card.recipient} 的一张电子卡片
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {themeMeta.emoji} {themeMeta.label}
          </h1>
        </div>

        <div className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-card bg-paper ${effects.cardOpen ? "kayan-card-enter" : ""}`}>
          <CardCanvas card={card} editable={false} />
          {effects.particles && <ParticleEffect theme={card.theme} style={effects.particleStyle ?? "auto"} />}
        </div>

        {card.music && (
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={toggleMusic}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-moss text-white text-sm font-medium shadow-soft hover:bg-moss-deep transition-colors"
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
              {playing ? "暂停" : "播放"} {card.music.title}
              <Music2 size={12} className="opacity-70" />
            </button>
          </div>
        )}

        <p className="mt-6 text-[11px] text-muted">
          这是一张由「卡言」生成的电子卡片 · 用心传递每一份祝福
        </p>
      </main>

      <footer className="py-4 text-center">
        <button
          onClick={() => navigate("/")}
          className="text-xs text-clay hover:underline"
        >
          我也要做一张卡片 →
        </button>
      </footer>
    </div>
  );
}
