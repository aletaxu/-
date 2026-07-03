import { Rnd } from "react-rnd";
import { useCardStore } from "@/store/cardStore";
import { getFontStack } from "@/lib/constants";
import type { FreeText } from "@/lib/types";

interface EditableTextProps {
  freeText: FreeText;
  canvasWidth: number;
  canvasHeight: number;
}

// 画布内可编辑的自由文字（拖拽 + 缩放 + 旋转由外部控制）
export function EditableText({ freeText, canvasWidth, canvasHeight }: EditableTextProps) {
  const { selectedFreeTextId, selectFreeText, updateFreeText } = useCardStore();
  const isSelected = selectedFreeTextId === freeText.id;

  if (!freeText.visible) return null;

  const x = (freeText.x / 100) * canvasWidth;
  const y = (freeText.y / 100) * canvasHeight;
  const w = (freeText.width / 100) * canvasWidth;
  // 高度按内容自适应，这里给一个基于字号的估算值用于 Rnd 容器
  const h = Math.max(freeText.fontSize * 1.8, 40);

  return (
    <Rnd
      size={{ width: w, height: h }}
      position={{ x, y }}
      bounds="parent"
      enableResizing={{
        top: false,
        topRight: false,
        right: true,
        bottomRight: false,
        bottom: false,
        bottomLeft: false,
        left: true,
        topLeft: false,
      }}
      style={{
        zIndex: 10 + freeText.zIndex,
        opacity: freeText.opacity,
      }}
      className={`group/ftext ${isSelected ? "ring-2 ring-clay ring-offset-2 ring-offset-transparent rounded" : ""}`}
      onPointerDown={() => selectFreeText(freeText.id)}
      onDragStop={(_, d) => {
        updateFreeText(freeText.id, {
          x: (d.x / canvasWidth) * 100,
          y: (d.y / canvasHeight) * 100,
        });
      }}
      onResizeStop={(_e, _dir, ref, _delta, pos) => {
        const newW = parseFloat(ref.style.width);
        updateFreeText(freeText.id, {
          width: (newW / canvasWidth) * 100,
          x: (pos.x / canvasWidth) * 100,
          y: (pos.y / canvasHeight) * 100,
        });
      }}
    >
      <div
        className="w-full h-full flex items-center pointer-events-none select-none"
        style={{
          transform: `rotate(${freeText.rotation}deg)`,
          justifyContent:
            freeText.align === "left"
              ? "flex-start"
              : freeText.align === "right"
              ? "flex-end"
              : "center",
        }}
      >
        <span
          style={{
            fontFamily: getFontStack(freeText.font),
            fontSize: freeText.fontSize,
            color: freeText.color,
            fontWeight: freeText.weight,
            lineHeight: 1.3,
            textAlign: freeText.align,
            wordBreak: "break-word",
            display: "inline-block",
            maxWidth: "100%",
          }}
        >
          {freeText.content}
        </span>
      </div>
    </Rnd>
  );
}
