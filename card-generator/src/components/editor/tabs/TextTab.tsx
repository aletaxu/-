import { useState, useRef, useEffect, useCallback } from "react";
import { useCardStore } from "@/store/cardStore";
import { TONES, FONTS, TEXT_COLORS } from "@/lib/constants";
import { generateCandidates } from "@/lib/aiGenerator";
import { buildPrompt, AI_TOOLS } from "@/lib/promptBuilder";
import type { GeneratedContent, FreeText } from "@/lib/types";
import { Field, TextInput, TextArea, Select, Slider, PrimaryButton, GhostButton, SectionTitle } from "@/components/ui/Controls";
import { Sparkles, RefreshCw, Check, Wand2, Plus, Trash2, Copy, Eye, EyeOff, ChevronUp, ChevronDown, Type, Clipboard, ExternalLink } from "lucide-react";

export function TextTab() {
  const {
    present,
    genConfig,
    setGenConfig,
    setText,
    applyGenerated,
    addFreeText,
    updateFreeText,
    removeFreeText,
    duplicateFreeText,
    moveFreeTextUp,
    moveFreeTextDown,
    selectFreeText,
    selectedFreeTextId,
  } = useCardStore();
  const [candidates, setCandidates] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [appliedIdx, setAppliedIdx] = useState<number | null>(null);
  // 标记是否已生成过，用于切换参数时自动重新生成
  const didGenerate = useRef(false);

  // AI Prompt 相关状态
  const [showPromptPanel, setShowPromptPanel] = useState(false);
  const [promptDetails, setPromptDetails] = useState("");
  const [copied, setCopied] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const generatedPrompt = buildPrompt({
    card: present,
    genConfig,
    details: promptDetails,
  });

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setShowTools(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级方案：选中文本
      const ta = document.createElement("textarea");
      ta.value = generatedPrompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setShowTools(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const runGenerate = useCallback(() => {
    setLoading(true);
    // 模拟 AI 思考延迟
    setTimeout(() => {
      const result = generateCandidates(
        {
          theme: present.theme,
          tone: genConfig.tone,
          wordCount: genConfig.wordCount,
          font: genConfig.font,
          fontSize: genConfig.fontSize,
          sender: present.sender,
          recipient: present.recipient,
          salutation: present.salutation,
        },
        3
      );
      setCandidates(result);
      setAppliedIdx(null);
      setLoading(false);
    }, 450);
  }, [present.theme, present.sender, present.recipient, present.salutation, genConfig.tone, genConfig.wordCount, genConfig.font, genConfig.fontSize]);

  const handleGenerate = () => {
    didGenerate.current = true;
    runGenerate();
  };

  // 切换语气或字数时，若已生成过则自动重新生成
  useEffect(() => {
    if (didGenerate.current) runGenerate();
  }, [genConfig.tone, genConfig.wordCount, runGenerate]);

  const handleApply = (c: GeneratedContent, idx: number) => {
    applyGenerated({
      title: c.title,
      body: c.body,
      signature: c.signature,
      font: genConfig.font,
      fontSize: genConfig.fontSize,
    });
    setAppliedIdx(idx);
  };

  return (
    <div className="p-4">
      <SectionTitle>
        <span className="flex items-center gap-1.5">
          <Wand2 size={14} className="text-clay" />
          AI 智能文案
        </span>
      </SectionTitle>

      <Field label="语气风格">
        <div className="grid grid-cols-3 gap-1.5">
          {TONES.map((t) => {
            const active = genConfig.tone === t.type;
            return (
              <button
                key={t.type}
                onClick={() => setGenConfig({ tone: t.type })}
                title={t.desc}
                className={`px-2 py-2 text-xs rounded-lg border transition-all ${
                  active
                    ? "border-clay bg-clay/10 text-clay font-medium"
                    : "border-line bg-paper text-ink/70 hover:border-clay/40"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </Field>

      <Slider
        label="字数"
        value={genConfig.wordCount}
        min={30}
        max={300}
        step={10}
        suffix=" 字"
        onChange={(v) => setGenConfig({ wordCount: v })}
      />

      <Field label="字体">
        <Select value={genConfig.font} onChange={(e) => setGenConfig({ font: e.target.value })}>
          {FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label} — {f.preview}
            </option>
          ))}
        </Select>
      </Field>

      <Slider
        label="字号"
        value={genConfig.fontSize}
        min={12}
        max={48}
        step={1}
        suffix="px"
        onChange={(v) => setGenConfig({ fontSize: v })}
      />

      <PrimaryButton
        onClick={handleGenerate}
        disabled={loading}
        className="w-full mb-2"
      >
        {loading ? (
          <>
            <RefreshCw size={14} className="animate-spin" />
            正在生成…
          </>
        ) : (
          <>
            <Sparkles size={14} />
            快速生成（本地模板）
          </>
        )}
      </PrimaryButton>

      {/* AI 深度生成：复制 Prompt 去外部 AI 工具 */}
      <GhostButton
        onClick={() => setShowPromptPanel((v) => !v)}
        className="w-full mb-4"
      >
        <Wand2 size={14} />
        {showPromptPanel ? "收起 AI 深度生成" : "AI 深度生成（复制 Prompt）"}
      </GhostButton>

      {showPromptPanel && (
        <div className="mb-6 p-3 rounded-xl bg-canvas border border-line">
          <p className="text-[11px] text-muted mb-3 leading-relaxed">
            根据当前主题、语气、收发信人等信息，自动生成一份定制 Prompt。
            复制后粘贴到任意 AI 工具（智谱清言、通义、ChatGPT 等）即可生成更高质量、更个性化的文案。
          </p>

          {/* 个性化细节输入 */}
          <Field label="个性化细节（可选）" hint="让 AI 写得更贴合场景">
            <TextArea
              rows={2}
              value={promptDetails}
              onChange={(e) => setPromptDetails(e.target.value)}
              placeholder="如：相识 10 年的老友 / 帮我度过失业期的恩师 / 给 60 岁长辈的生日"
            />
          </Field>

          {/* Prompt 预览 */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-ink/70">生成的 Prompt</span>
              <span className="text-[10px] text-muted">{generatedPrompt.length} 字</span>
            </div>
            <pre className="text-[11px] text-ink/80 bg-paper border border-line rounded-lg p-2.5 max-h-40 overflow-y-auto scroll-thin whitespace-pre-wrap break-words font-mono leading-relaxed">
              {generatedPrompt}
            </pre>
          </div>

          {/* 复制按钮 */}
          <PrimaryButton onClick={handleCopyPrompt} className="w-full mb-3">
            {copied ? (
              <>
                <Check size={14} />
                已复制，去 AI 工具粘贴
              </>
            ) : (
              <>
                <Clipboard size={14} />
                复制 Prompt
              </>
            )}
          </PrimaryButton>

          {/* AI 工具快捷链接 */}
          {(showTools || copied) && (
            <div className="animate-in fade-in">
              <p className="text-[11px] text-muted mb-2">推荐粘贴到以下 AI 工具：</p>
              <div className="grid grid-cols-2 gap-1.5">
                {AI_TOOLS.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-2 text-xs rounded-lg border border-line bg-paper hover:border-clay/40 hover:bg-clay/5 transition-all"
                    title={tool.desc}
                  >
                    <ExternalLink size={12} className="text-clay shrink-0" />
                    <span className="text-ink/80 truncate">{tool.name}</span>
                  </a>
                ))}
              </div>
              <p className="text-[10px] text-muted mt-2 leading-relaxed">
                提示：AI 生成后，把结果粘贴回上方「手动微调」区域即可
              </p>
            </div>
          )}
        </div>
      )}

      {/* 候选文案 */}
      {candidates.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs text-muted">点击「应用」采用该组文案，可重新生成</p>
          {candidates.map((c, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border transition-all ${
                appliedIdx === i ? "border-clay bg-clay/5" : "border-line bg-paper"
              }`}
            >
              <p className="text-sm font-semibold text-ink mb-1">{c.title}</p>
              <p className="text-xs text-ink/70 leading-relaxed mb-2 line-clamp-3">{c.body}</p>
              <p className="text-[11px] text-muted mb-2">{c.signature}</p>
              <GhostButton
                onClick={() => handleApply(c, i)}
                className="w-full py-1.5 text-xs"
              >
                {appliedIdx === i ? (
                  <>
                    <Check size={12} /> 已应用
                  </>
                ) : (
                  "应用此文案"
                )}
              </GhostButton>
            </div>
          ))}
        </div>
      )}

      {/* 手动编辑 */}
      <SectionTitle>手动微调</SectionTitle>

      <Field label="主题词">
        <TextInput
          value={present.text.title}
          onChange={(e) => setText({ title: e.target.value })}
        />
      </Field>

      <Field label="正文">
        <TextArea
          rows={5}
          value={present.text.body}
          onChange={(e) => setText({ body: e.target.value })}
        />
      </Field>

      <Field label="落款">
        <TextInput
          value={present.text.signature}
          onChange={(e) => setText({ signature: e.target.value })}
        />
      </Field>

      <Field label="文字颜色">
        <div className="flex flex-wrap gap-1.5">
          {TEXT_COLORS.map((c) => {
            const active = present.text.color === c;
            return (
              <button
                key={c}
                onClick={() => setText({ color: c })}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  active ? "border-clay scale-110" : "border-line hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            );
          })}
        </div>
      </Field>

      <Field label="对齐方式">
        <div className="grid grid-cols-3 gap-1.5">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setText({ align: a })}
              className={`px-2 py-2 text-xs rounded-lg border transition-all ${
                present.text.align === a
                  ? "border-clay bg-clay/10 text-clay font-medium"
                  : "border-line bg-paper text-ink/70 hover:border-clay/40"
              }`}
            >
              {a === "left" ? "左对齐" : a === "center" ? "居中" : "右对齐"}
            </button>
          ))}
        </div>
      </Field>

      {/* 自由文字：可拖拽旋转的独立文字标签 */}
      <SectionTitle>
        <span className="flex items-center gap-1.5">
          <Type size={14} className="text-clay" />
          自由文字标签
        </span>
        <span className="text-[11px] text-muted font-normal">{present.freeTexts.length} 个</span>
      </SectionTitle>
      <p className="text-[11px] text-muted mb-3 leading-relaxed">
        添加可在画布上自由拖拽、旋转的文字，适合放日期、地点、英文标语等装饰性文字
      </p>

      <PrimaryButton
        onClick={() => {
          const ft: FreeText = {
            id: `ft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            content: "Happy Day",
            x: 20 + Math.random() * 30,
            y: 10 + Math.random() * 20,
            width: 40,
            fontSize: 28,
            color: present.text.color,
            font: present.text.font,
            rotation: -8,
            opacity: 0.9,
            zIndex: present.freeTexts.length + present.photos.length,
            visible: true,
            weight: 600,
            align: "center",
          };
          addFreeText(ft);
          selectFreeText(ft.id);
        }}
        className="w-full mb-4"
      >
        <Plus size={14} />
        添加自由文字
      </PrimaryButton>

      {present.freeTexts.length > 0 && (
        <div className="space-y-2 mb-4">
          {present.freeTexts.map((t, idx) => {
            const isSel = selectedFreeTextId === t.id;
            return (
              <div
                key={t.id}
                className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                  isSel ? "border-clay bg-clay/5" : "border-line bg-paper hover:border-clay/30"
                }`}
                onClick={() => selectFreeText(t.id)}
              >
                <Type size={14} className="text-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink truncate">{t.content || "（空文字）"}</p>
                  <p className="text-[10px] text-muted">{t.fontSize}px · 层级 {idx + 1}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-ink/70 hover:bg-paper hover:text-clay transition-colors disabled:opacity-30"
                    onClick={(e) => { e.stopPropagation(); moveFreeTextUp(t.id); }}
                    disabled={idx === present.freeTexts.length - 1}
                    aria-label="上移层级"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-ink/70 hover:bg-paper hover:text-clay transition-colors disabled:opacity-30"
                    onClick={(e) => { e.stopPropagation(); moveFreeTextDown(t.id); }}
                    disabled={idx === 0}
                    aria-label="下移层级"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-ink/70 hover:bg-paper hover:text-clay transition-colors"
                    onClick={(e) => { e.stopPropagation(); updateFreeText(t.id, { visible: !t.visible }); }}
                    aria-label={t.visible ? "隐藏" : "显示"}
                  >
                    {t.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-ink/70 hover:bg-paper hover:text-clay transition-colors"
                    onClick={(e) => { e.stopPropagation(); duplicateFreeText(t.id); }}
                    aria-label="复制"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-ink/70 hover:bg-paper hover:text-red-500 transition-colors"
                    onClick={(e) => { e.stopPropagation(); removeFreeText(t.id); }}
                    aria-label="删除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 选中自由文字的编辑面板 */}
      {(() => {
        const sel = present.freeTexts.find((t) => t.id === selectedFreeTextId);
        if (!sel) return null;
        if (!sel.visible) {
          return (
            <div className="p-3 rounded-xl bg-canvas border border-line text-center">
              <p className="text-xs text-muted">该文字已隐藏，点击列表中的眼睛图标显示</p>
            </div>
          );
        }
        return (
          <div className="p-3 rounded-xl bg-canvas border border-line">
            <SectionTitle>
              <span className="flex items-center gap-1.5 text-clay">
                <Type size={14} />
                编辑自由文字
              </span>
            </SectionTitle>
            <Field label="文字内容">
              <TextInput
                value={sel.content}
                onChange={(e) => updateFreeText(sel.id, { content: e.target.value })}
                placeholder="输入文字…"
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="字体">
                <Select value={sel.font} onChange={(e) => updateFreeText(sel.id, { font: e.target.value })}>
                  {FONTS.map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="字重">
                <Select value={String(sel.weight)} onChange={(e) => updateFreeText(sel.id, { weight: Number(e.target.value) })}>
                  <option value="400">常规</option>
                  <option value="600">中粗</option>
                  <option value="700">加粗</option>
                </Select>
              </Field>
            </div>
            <Slider label="字号" value={sel.fontSize} min={10} max={96} step={1} suffix="px" onChange={(v) => updateFreeText(sel.id, { fontSize: v })} />
            <Slider label="旋转" value={Math.round(sel.rotation)} min={-180} max={180} step={1} suffix="°" onChange={(v) => updateFreeText(sel.id, { rotation: v })} />
            <Slider label="透明度" value={Math.round(sel.opacity * 100)} min={0} max={100} step={5} suffix="%" onChange={(v) => updateFreeText(sel.id, { opacity: v / 100 })} />
            <Slider label="宽度" value={Math.round(sel.width)} min={10} max={100} step={1} suffix="%" onChange={(v) => updateFreeText(sel.id, { width: v })} />
            <div className="grid grid-cols-2 gap-2">
              <Slider label="水平" value={Math.round(sel.x)} min={0} max={100} step={1} suffix="%" onChange={(v) => updateFreeText(sel.id, { x: v })} />
              <Slider label="垂直" value={Math.round(sel.y)} min={0} max={100} step={1} suffix="%" onChange={(v) => updateFreeText(sel.id, { y: v })} />
            </div>
            <Field label="颜色">
              <div className="flex flex-wrap gap-1.5">
                {TEXT_COLORS.map((c) => {
                  const active = sel.color === c;
                  return (
                    <button
                      key={c}
                      onClick={() => updateFreeText(sel.id, { color: c })}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${active ? "border-clay scale-110" : "border-line hover:scale-105"}`}
                      style={{ backgroundColor: c }}
                    />
                  );
                })}
              </div>
            </Field>
            <Field label="对齐">
              <div className="grid grid-cols-3 gap-1.5">
                {(["left", "center", "right"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => updateFreeText(sel.id, { align: a })}
                    className={`px-2 py-2 text-xs rounded-lg border transition-all ${sel.align === a ? "border-clay bg-clay/10 text-clay font-medium" : "border-line bg-paper text-ink/70 hover:border-clay/40"}`}
                  >
                    {a === "left" ? "左" : a === "center" ? "中" : "右"}
                  </button>
                ))}
              </div>
            </Field>
            <GhostButton onClick={() => updateFreeText(sel.id, { rotation: 0, opacity: 1 })} className="w-full text-xs">
              重置变换
            </GhostButton>
          </div>
        );
      })()}
    </div>
  );
}
