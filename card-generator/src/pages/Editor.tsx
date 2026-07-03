import { useRef } from "react";
import { TopBar } from "../components/editor/TopBar";
import { ControlPanel } from "../components/editor/ControlPanel";
import { CardCanvas } from "../components/editor/CardCanvas";
import { PreviewPanel } from "../components/editor/PreviewPanel";
import { useCardStore } from "../store/cardStore";
import { getThemeMeta } from "../lib/constants";

export default function Editor() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { present } = useCardStore();
  const themeMeta = getThemeMeta(present.theme);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-canvas">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧控制面板 */}
        <div className="w-80 shrink-0 hidden lg:block">
          <ControlPanel />
        </div>

        {/* 中央画布区 */}
        <main className="flex-1 flex flex-col items-center justify-center p-3 lg:p-6 overflow-auto scroll-thin paper-grain min-w-0">
          <div className="w-full max-w-full lg:max-w-lg">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{themeMeta.emoji}</span>
                <span className="text-sm font-medium text-ink">{themeMeta.label}</span>
              </div>
              <span className="text-[11px] text-muted hidden sm:inline">点击照片可编辑 · 空白处取消选中</span>
            </div>
            <CardCanvas ref={canvasRef} card={present} editable />
          </div>
        </main>

        {/* 右侧预览栏 */}
        <div className="w-72 shrink-0 hidden xl:block">
          <PreviewPanel canvasRef={canvasRef} />
        </div>
      </div>

      {/* 移动端提示（小屏可用控制面板抽屉） */}
      <MobileControlToggle />
    </div>
  );
}

// 小屏下的控制面板抽屉触发器
function MobileControlToggle() {
  return (
    <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[60]">
      <details className="relative">
        <summary className="list-none cursor-pointer px-4 py-2.5 rounded-full bg-clay text-white text-sm font-medium shadow-lift flex items-center gap-2">
          <span>编辑面板</span>
        </summary>
        {/* 抽屉：z-index 足够高，内部 ControlPanel 可滚动 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm h-[70vh] rounded-2xl overflow-hidden overflow-y-auto scroll-thin shadow-card border border-line bg-paper">
          <ControlPanel />
        </div>
      </details>
    </div>
  );
}
