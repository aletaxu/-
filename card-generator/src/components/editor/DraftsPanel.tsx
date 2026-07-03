import { useCardStore } from "../../store/cardStore";
import { getThemeMeta } from "../../lib/constants";
import { PrimaryButton, GhostButton, IconButton } from "../ui/Controls";
import { Save, FileText, Copy, Trash2, X, Clock } from "lucide-react";

// 相对时间格式化：把 ISO 时间转成"刚刚/X分钟前/X小时前/X天前/日期"
function formatRelativeTime(iso?: string): string {
  if (!iso) return "未知时间";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "未知时间";
  const diff = Date.now() - then;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "刚刚";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}分钟前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}小时前`;
  const day = Math.floor(hour / 24);
  if (day < 30) return `${day}天前`;
  // 超过 30 天回退为日期
  return new Date(then).toLocaleDateString("zh-CN");
}

interface DraftsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function DraftsPanel({ open, onClose }: DraftsPanelProps) {
  const savedDrafts = useCardStore((s) => s.savedDrafts);
  const saveCurrentAsDraft = useCardStore((s) => s.saveCurrentAsDraft);
  const loadDraft = useCardStore((s) => s.loadDraft);
  const deleteDraft = useCardStore((s) => s.deleteDraft);
  const duplicateDraft = useCardStore((s) => s.duplicateDraft);

  if (!open) return null;

  return (
    // 弹层遮罩：点击空白处关闭
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] flex flex-col bg-paper rounded-2xl shadow-card border border-line overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line shrink-0">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-clay" />
            <h2 className="text-sm font-semibold text-ink">我的草稿</h2>
            <span className="text-[11px] text-muted">({savedDrafts.length}/20)</span>
          </div>
          <IconButton onClick={onClose} aria-label="关闭" title="关闭">
            <X size={16} />
          </IconButton>
        </div>

        {/* 顶部操作：保存当前为草稿 */}
        <div className="px-5 py-3 border-b border-line shrink-0">
          <PrimaryButton
            className="w-full"
            onClick={() => {
              saveCurrentAsDraft();
            }}
          >
            <Save size={14} />
            保存当前为草稿
          </PrimaryButton>
        </div>

        {/* 草稿列表 */}
        <div className="flex-1 overflow-y-auto scroll-thin">
          {savedDrafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted">
              <FileText size={32} className="mb-2 opacity-40" />
              <p className="text-xs">还没有保存的草稿</p>
              <p className="text-[11px] mt-1">点击上方按钮保存当前卡片</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {savedDrafts.map((draft) => {
                const meta = getThemeMeta(draft.theme);
                return (
                  <li key={draft.id} className="px-5 py-3 hover:bg-canvas/50 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* 主题 emoji */}
                      <span className="text-xl shrink-0 mt-0.5">{meta.emoji}</span>

                      <div className="flex-1 min-w-0">
                        {/* 标题 */}
                        <p className="text-sm font-medium text-ink truncate">
                          {draft.text.title || "（未命名卡片）"}
                        </p>
                        {/* 更新时间 */}
                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-muted">
                          <Clock size={11} />
                          <span>{formatRelativeTime(draft.updatedAt ?? draft.createdAt)}</span>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex items-center gap-1 mt-2">
                          <GhostButton
                            className="!px-2.5 !py-1 !text-xs"
                            onClick={() => {
                              loadDraft(draft.id);
                              onClose();
                            }}
                          >
                            加载
                          </GhostButton>
                          <IconButton
                            className="!w-7 !h-7"
                            onClick={() => duplicateDraft(draft.id)}
                            aria-label="复制草稿"
                            title="复制草稿"
                          >
                            <Copy size={13} />
                          </IconButton>
                          <IconButton
                            className="!w-7 !h-7 hover:!text-clay-deep"
                            onClick={() => {
                              if (confirm(`确认删除草稿「${draft.text.title || "未命名"}」？`)) {
                                deleteDraft(draft.id);
                              }
                            }}
                            aria-label="删除草稿"
                            title="删除草稿"
                          >
                            <Trash2 size={13} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
