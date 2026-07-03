import { useCardStore } from "@/store/cardStore";
import { THEMES } from "@/lib/constants";
import { getTemplatesByTheme, applyTemplateToCard } from "@/lib/templates";
import type { ThemeType } from "@/lib/types";
import { Field, TextInput, Select, SectionTitle, GhostButton } from "@/components/ui/Controls";
import { LayoutTemplate, Check } from "lucide-react";

export function ThemeTab() {
  const { present, setTheme, setSender, setRecipient, setSalutation, applyTemplate } = useCardStore();
  const templates = getTemplatesByTheme(present.theme);

  const handleApply = (templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;
    const patch = applyTemplateToCard(tpl);
    applyTemplate(patch);
  };

  return (
    <div className="p-4">
      <p className="text-xs text-muted mb-3 leading-relaxed">
        选择一个主题，系统将自动适配色调与示例文案。
      </p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {THEMES.map((t) => {
          const active = present.theme === t.type;
          return (
            <button
              key={t.type}
              onClick={() => setTheme(t.type as ThemeType)}
              className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                active
                  ? "border-clay bg-clay/8 shadow-soft"
                  : "border-line bg-paper hover:border-clay/40"
              }`}
            >
              <span className="text-2xl mb-1">{t.emoji}</span>
              <span className="text-sm font-medium text-ink">{t.label}</span>
              <span
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: t.accent }}
              />
            </button>
          );
        })}
      </div>

      {/* 模板预设 */}
      <SectionTitle>
        <span className="flex items-center gap-1.5">
          <LayoutTemplate size={14} className="text-clay" />
          排版模板
        </span>
      </SectionTitle>
      <p className="text-[11px] text-muted mb-3 leading-relaxed">
        一键套用预设排版（背景、字体、字号、装饰文字），保留你已输入的文案内容
      </p>
      <div className="grid grid-cols-1 gap-2 mb-6">
        {templates.map((tpl) => {
          // 判断是否当前已应用该模板（粗略匹配：背景url相同）
          const applied = present.background.url === tpl.background.url;
          return (
            <button
              key={tpl.id}
              onClick={() => handleApply(tpl.id)}
              className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                applied
                  ? "border-clay bg-clay/8 shadow-soft"
                  : "border-line bg-paper hover:border-clay/40"
              }`}
            >
              {/* 缩略色块 */}
              <div
                className="w-10 h-10 shrink-0 rounded-lg border border-line overflow-hidden relative"
                style={
                  tpl.background.url.startsWith("gradient:")
                    ? { background: tpl.background.url.slice("gradient:".length) }
                    : { backgroundImage: `url(${tpl.background.url})`, backgroundSize: "cover" }
                }
              >
                <span
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
                  style={{ color: tpl.color, fontFamily: tpl.font }}
                >
                  Aa
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{tpl.name}</p>
                <p className="text-[11px] text-muted truncate">{tpl.desc}</p>
              </div>
              {applied && <Check size={16} className="text-clay shrink-0" />}
            </button>
          );
        })}
      </div>

      <Field label="称谓" hint="如：亲爱的 / 敬爱的">
        <TextInput
          value={present.salutation}
          onChange={(e) => setSalutation(e.target.value)}
          placeholder="亲爱的"
        />
      </Field>

      <Field label="收信人">
        <TextInput
          value={present.recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="收信人姓名"
        />
      </Field>

      <Field label="发信人">
        <TextInput
          value={present.sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="你的署名"
        />
      </Field>

      <Field label="卡片画幅">
        <Select
          value={present.canvasRatio}
          onChange={(e) => useCardStore.getState().setCanvasRatio(e.target.value as "4:3" | "3:4")}
        >
          <option value="3:4">竖版 3:4（贺卡）</option>
          <option value="4:3">横版 4:3（邀请函）</option>
        </Select>
      </Field>

      <GhostButton onClick={() => useCardStore.getState().reset()} className="w-full mt-2 text-xs">
        重置全部
      </GhostButton>
    </div>
  );
}
