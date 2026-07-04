import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Editor from "@/pages/Editor";
import ViewCard from "@/pages/ViewCard";
import { useCardStore } from "@/store/cardStore";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function App() {
  // 全局键盘快捷键监听
  useEffect(() => {
    const isEditableTarget = (): boolean => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      // 焦点在 input/textarea/select 或 contentEditable 时禁用快捷键
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // 焦点在可编辑元素内时不触发任何快捷键
      if (isEditableTarget()) {
        // 但 Ctrl+S 仍需阻止默认行为，避免浏览器保存
        if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
          e.preventDefault();
        }
        return;
      }

      const store = useCardStore.getState();
      const mod = e.ctrlKey || e.metaKey;

      // 撤销：Ctrl+Z / Cmd+Z
      if (mod && !e.shiftKey && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        store.undo();
        return;
      }
      // 重做：Ctrl+Shift+Z / Ctrl+Y
      if (mod && e.shiftKey && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        store.redo();
        return;
      }
      if (mod && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        store.redo();
        return;
      }
      // 保存草稿：Ctrl+S / Cmd+S（全局阻止默认）
      if (mod && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        store.saveCurrentAsDraft();
        return;
      }
      // 删除当前选中的照片或自由文字：Delete / Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        const { selectedPhotoId, selectedFreeTextId } = store;
        if (selectedPhotoId) {
          e.preventDefault();
          store.removePhoto(selectedPhotoId);
        } else if (selectedFreeTextId) {
          e.preventDefault();
          store.removeFreeText(selectedFreeTextId);
        }
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Editor />} />
          <Route path="/view/:data" element={<ViewCard />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
