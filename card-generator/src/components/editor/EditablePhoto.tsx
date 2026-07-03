import { Rnd } from "react-rnd";
import { useCardStore } from "@/store/cardStore";
import type { Photo } from "@/lib/types";

interface EditablePhotoProps {
  photo: Photo;
  canvasWidth: number;
  canvasHeight: number;
}

// 画布内可编辑的单张照片（拖拽 + 缩放 + 旋转 + 透明度由外部控制）
export function EditablePhoto({ photo, canvasWidth, canvasHeight }: EditablePhotoProps) {
  const { selectedPhotoId, selectPhoto, updatePhoto } = useCardStore();
  const isSelected = selectedPhotoId === photo.id;

  // 百分比 → 像素
  const x = (photo.x / 100) * canvasWidth;
  const y = (photo.y / 100) * canvasHeight;
  const w = (photo.width / 100) * canvasWidth;
  // 高度按图片原始比例，但为简化用固定比例（4:3）
  const h = w * 0.75;

  if (!photo.visible) return null;

  return (
    <Rnd
      size={{ width: w, height: h }}
      position={{ x, y }}
      bounds="parent"
      lockAspectRatio
      enableResizing={{
        top: false,
        topRight: false,
        right: true,
        bottomRight: true,
        bottom: true,
        bottomLeft: true,
        left: true,
        topLeft: false,
      }}
      style={{
        zIndex: 10 + photo.zIndex,
        opacity: photo.opacity,
      }}
      className={`group/photo ${isSelected ? "ring-2 ring-clay ring-offset-2 ring-offset-transparent" : ""}`}
      onPointerDown={() => selectPhoto(photo.id)}
      onDragStop={(_, d) => {
        updatePhoto(photo.id, {
          x: (d.x / canvasWidth) * 100,
          y: (d.y / canvasHeight) * 100,
        });
      }}
      onResizeStop={(_e, _dir, ref, _delta, pos) => {
        const newW = parseFloat(ref.style.width);
        updatePhoto(photo.id, {
          width: (newW / canvasWidth) * 100,
          x: (pos.x / canvasWidth) * 100,
          y: (pos.y / canvasHeight) * 100,
        });
      }}
    >
      <div
        className="w-full h-full overflow-hidden rounded-md shadow-card pointer-events-none select-none"
        style={{ transform: `rotate(${photo.rotation}deg)` }}
      >
        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" draggable={false} />
      </div>
    </Rnd>
  );
}
