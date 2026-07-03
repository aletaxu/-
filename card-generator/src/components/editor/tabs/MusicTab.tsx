import { useState, useEffect, useRef } from "react";
import { useCardStore } from "@/store/cardStore";
import { SYNTH_MUSICS, getPlayer, findMusic } from "@/lib/musicSynth";
import { SectionTitle, GhostButton, PrimaryButton } from "@/components/ui/Controls";
import { Play, Pause, Check, Music2, X, Upload, Trash2, AlertCircle } from "lucide-react";
import type { Music } from "@/lib/types";

// 上传音乐大小上限：2MB（base64 后约 2.7MB，localStorage 容量有限）
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

export function MusicTab() {
  const { present, setMusic, userMusics, addUserMusic, removeUserMusic } = useCardStore();
  const [playingId, setPlayingId] = useState<string | null>(null);
  // 标记当前试听的是合成还是上传：synth | user
  const [playingKind, setPlayingKind] = useState<"synth" | "user" | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const player = getPlayer();
    return () => {
      // 离开 Tab 时停止所有试听
      player.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
      setPlayingKind(null);
    };
  }, []);

  // 统一停止所有试听
  const stopAll = () => {
    getPlayer().stop();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingId(null);
    setPlayingKind(null);
  };

  // 试听合成音乐
  const toggleSynth = (id: string) => {
    if (playingKind === "synth" && playingId === id) {
      stopAll();
      return;
    }
    // 切换前先停掉另一类
    if (audioRef.current) audioRef.current.pause();
    const player = getPlayer();
    player.stop();
    const m = findMusic(id);
    if (m) {
      player.play(m, () => {
        setPlayingId(null);
        setPlayingKind(null);
      });
      setPlayingId(id);
      setPlayingKind("synth");
    }
  };

  // 试听用户上传音乐
  const toggleUser = (m: Music) => {
    if (playingKind === "user" && playingId === m.id) {
      stopAll();
      return;
    }
    // 切换前先停掉合成
    getPlayer().stop();
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("ended", () => {
        setPlayingId(null);
        setPlayingKind(null);
      });
    }
    audioRef.current.src = m.url;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      setUploadError("试听失败，该音频格式可能不被浏览器支持");
      setPlayingId(null);
      setPlayingKind(null);
    });
    setPlayingId(m.id);
    setPlayingKind("user");
  };

  // 选用合成音乐
  const handleSelectSynth = (id: string) => {
    if (present.music?.id === id) {
      setMusic(null);
    } else {
      const m = findMusic(id);
      if (m) {
        setMusic({
          id: m.id,
          title: m.title,
          url: "", // 合成音乐不需要 url
          enabled: true,
        });
      }
    }
  };

  // 选用上传音乐
  const handleSelectUser = (m: Music) => {
    if (present.music?.id === m.id) {
      setMusic(null);
    } else {
      setMusic({
        id: m.id,
        title: m.title,
        url: m.url,
        enabled: true,
      });
    }
  };

  // 处理上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // 校验大小
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(`文件过大（${(file.size / 1024 / 1024).toFixed(1)}MB），请上传小于 2MB 的音频`);
      e.target.value = "";
      return;
    }

    // 校验类型
    if (!file.type.startsWith("audio/")) {
      setUploadError("仅支持音频文件（mp3/wav/ogg/m4a 等）");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const id = `um_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      // 去掉扩展名作为标题
      const title = file.name.replace(/\.[^.]+$/, "");
      addUserMusic({
        id,
        title,
        url: dataUrl,
        enabled: true,
      });
    };
    reader.onerror = () => {
      setUploadError("读取文件失败，请重试");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // 删除上传音乐
  const handleDeleteUser = (id: string) => {
    if (playingKind === "user" && playingId === id) {
      stopAll();
    }
    removeUserMusic(id);
  };

  return (
    <div className="p-4">
      <SectionTitle>
        <span className="flex items-center gap-1.5">
          <Music2 size={14} className="text-moss" />
          为卡片搭配音乐
        </span>
      </SectionTitle>

      {present.music && (
        <div className="mb-4 p-3 rounded-xl bg-moss/8 border border-moss/20 flex items-center gap-2">
          <Music2 size={14} className="text-moss shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink truncate">{present.music.title}</p>
            <p className="text-[10px] text-muted">
              已搭配 · {present.music.url ? "上传音乐" : "合成音乐"}
            </p>
          </div>
          <button
            onClick={() => setMusic(null)}
            className="text-muted hover:text-clay transition-colors"
            aria-label="移除音乐"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 上传区域 */}
      <div className="mb-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <PrimaryButton
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload size={14} />
          上传我的音乐
        </PrimaryButton>
        {uploadError && (
          <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-clay/8 border border-clay/20">
            <AlertCircle size={12} className="text-clay shrink-0 mt-0.5" />
            <p className="text-[11px] text-clay leading-relaxed">{uploadError}</p>
          </div>
        )}
        <p className="text-[10px] text-muted mt-1.5 leading-relaxed">
          支持 mp3/wav/ogg/m4a，单文件 ≤ 2MB。上传的音乐保存在本地浏览器，不会上传到服务器。
        </p>

        {/* 分享限制提示：仅当选用上传音乐时显示 */}
        {present.music?.url && present.music.url.startsWith("data:") && (
          <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200">
            <AlertCircle size={12} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              上传音乐体积较大，无法放入分享链接。分享卡片时接收方将听不到音乐，建议改用合成音乐或下载图片分享。
            </p>
          </div>
        )}
      </div>

      {/* 用户上传音乐列表 */}
      {userMusics.length > 0 && (
        <div className="mb-5">
          <SectionTitle>
            <span className="text-xs">我的音乐（{userMusics.length}）</span>
          </SectionTitle>
          <div className="space-y-2">
            {userMusics.map((m) => {
              const selected = present.music?.id === m.id;
              const playing = playingKind === "user" && playingId === m.id;
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                    selected ? "border-moss bg-moss/5" : "border-line bg-paper hover:border-moss/40"
                  }`}
                >
                  <button
                    onClick={() => toggleUser(m)}
                    className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                      playing
                        ? "bg-moss text-white"
                        : "bg-moss/10 hover:bg-moss/20 text-moss"
                    }`}
                    aria-label={playing ? "暂停" : "试听"}
                  >
                    {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{m.title}</p>
                    <p className="text-[11px] text-muted">上传音乐</p>
                  </div>
                  <button
                    onClick={() => handleSelectUser(m)}
                    className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                      selected
                        ? "border-moss bg-moss text-white"
                        : "border-line text-transparent hover:border-moss/50"
                    }`}
                    aria-label="选用"
                  >
                    <Check size={12} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(m.id)}
                    className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-muted hover:text-clay hover:bg-clay/8 transition-colors"
                    aria-label="删除"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 合成音乐库 */}
      <SectionTitle>
        <span className="text-xs">合成音乐库</span>
      </SectionTitle>
      <div className="space-y-2">
        {SYNTH_MUSICS.map((m) => {
          const selected = present.music?.id === m.id;
          const playing = playingKind === "synth" && playingId === m.id;
          return (
            <div
              key={m.id}
              className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                selected ? "border-moss bg-moss/5" : "border-line bg-paper hover:border-moss/40"
              }`}
            >
              <button
                onClick={() => toggleSynth(m.id)}
                className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                  playing
                    ? "bg-moss text-white"
                    : "bg-moss/10 hover:bg-moss/20 text-moss"
                }`}
                aria-label={playing ? "暂停" : "试听"}
              >
                {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{m.title}</p>
                <p className="text-[11px] text-muted">
                  {m.timbre === "piano" ? "钢琴" : m.timbre === "bell" ? "钟铃" : m.timbre === "music_box" ? "八音盒" : "温暖铺垫"} · {Math.floor(m.duration)}s 循环
                </p>
              </div>
              <button
                onClick={() => handleSelectSynth(m.id)}
                className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected
                    ? "border-moss bg-moss text-white"
                    : "border-line text-transparent hover:border-moss/50"
                }`}
                aria-label="选用"
              >
                <Check size={12} />
              </button>
            </div>
          );
        })}
      </div>

      <GhostButton
        onClick={stopAll}
        className="w-full mt-4 text-xs"
      >
        停止试听
      </GhostButton>

      <p className="text-[11px] text-muted mt-4 leading-relaxed">
        合成音乐由 Web Audio API 实时生成，离线可用、无版权限制，可通过分享链接播放。上传音乐仅在本地点播时可用。
      </p>
    </div>
  );
}
