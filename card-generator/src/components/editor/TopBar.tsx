import { useState } from "react";
import { useCardStore } from "../../store/cardStore";
import { THEMES } from "../../lib/constants";
import type { ThemeType } from "../../lib/types";
import { IconButton } from "../ui/Controls";
import { DraftsPanel } from "./DraftsPanel";
import { Undo2, Redo2, RotateCcw, Save, Sparkles, FileText } from "lucide-react";

export function TopBar() {
  const { present, undo, redo, canUndo, canRedo, reset } = useCardStore();
  const [draftsOpen, setDraftsOpen] = useState(false);

  const handleSave = () => {
    // 已通过 persist 自动保存，这里给个提示
    const btn = document.getElementById("save-hint");
    if (btn) {
      btn.classList.remove("opacity-0");
      setTimeout(() => btn.classList.add("opacity-0"), 1500);
    }
  };

  return (
    <header className="flex items-center justify-between px-3 sm:px-4 h-14 bg-paper border-b border-line shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-clay to-clay-deep flex items-center justify-center shadow-soft">
          <Sparkles size={16} className="text-white" />
        </div>
        <div className="leading-tight">
          <h1 className="font-display text-base font-semibold text-ink">卡言</h1>
          {/* 副标题在小屏隐藏 */}
          <p className="text-[10px] text-muted -mt-0.5 hidden sm:block">电子卡片生成器</p>
        </div>
      </div>

      {/* 主题快速切换 */}
      <div className="hidden md:flex items-center gap-1 bg-canvas rounded-full p-1 border border-line">
        {THEMES.map((t) => {
          const active = present.theme === t.type;
          return (
            <button
              key={t.type}
              onClick={() => useCardStore.getState().setTheme(t.type as ThemeType)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                active ? "bg-paper text-clay shadow-soft" : "text-muted hover:text-ink"
              }`}
            >
              <span className="mr-1">{t.emoji}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-1 shrink-0">
        <IconButton onClick={undo} disabled={!canUndo()} aria-label="撤销" title="撤销">
          <Undo2 size={16} />
        </IconButton>
        <IconButton onClick={redo} disabled={!canRedo()} aria-label="重做" title="重做">
          <Redo2 size={16} />
        </IconButton>
        <div className="w-px h-5 bg-line mx-1 hidden sm:block" />
        <IconButton
          onClick={() => {
            if (confirm("确认重置卡片？所有内容将被清除。")) reset();
          }}
          aria-label="重置"
          title="重置卡片"
        >
          <RotateCcw size={16} />
        </IconButton>
        {/* 我的草稿入口：小屏只显示图标，sm 以上显示图标+文字 */}
        <button
          onClick={() => setDraftsOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-lg text-ink/70 hover:bg-paper hover:text-clay transition-colors"
          aria-label="我的草稿"
          title="我的草稿"
        >
          <FileText size={16} />
          <span className="hidden sm:inline text-sm font-medium">我的草稿</span>
        </button>
        <div className="relative">
          <IconButton onClick={handleSave} aria-label="保存草稿" title="保存草稿">
            <Save size={16} />
          </IconButton>
          <span
            id="save-hint"
            className="absolute right-0 top-full mt-1 text-[10px] text-moss opacity-0 transition-opacity pointer-events-none whitespace-nowrap"
          >
            已自动保存
          </span>
        </div>
      </div>

      {/* 草稿管理弹层 */}
      <DraftsPanel open={draftsOpen} onClose={() => setDraftsOpen(false)} />
    </header>
  );
}
