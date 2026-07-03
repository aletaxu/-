import { useRef } from "react";
import { useCardStore } from "@/store/cardStore";
import { Slider, SectionTitle, PrimaryButton, GhostButton, IconButton } from "@/components/ui/Controls";
import { Upload, Trash2, Copy, Eye, EyeOff, ChevronUp, ChevronDown, ImagePlus, MousePointerClick } from "lucide-react";

export function PhotoTab() {
  const {
    present,
    selectedPhotoId,
    addPhoto,
    removePhoto,
    duplicatePhoto,
    movePhotoUp,
    movePhotoDown,
    updatePhoto,
    selectPhoto,
  } = useCardStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        addPhoto({
          id: `ph_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          url: reader.result as string,
          x: 10 + Math.random() * 30,
          y: 10 + Math.random() * 30,
          width: 25,
          rotation: 0,
          opacity: 1,
          zIndex: present.photos.length,
          visible: true,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const selected = present.photos.find((p) => p.id === selectedPhotoId);

  return (
    <div className="p-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleUpload(e.target.files);
          e.target.value = "";
        }}
      />

      <SectionTitle>
        <span className="flex items-center gap-1.5">
          <ImagePlus size={14} className="text-clay" />
          照片管理
        </span>
        <span className="text-[11px] text-muted font-normal">{present.photos.length} 张</span>
      </SectionTitle>

      <PrimaryButton onClick={() => fileRef.current?.click()} className="w-full mb-4">
        <Upload size={14} />
        添加照片
      </PrimaryButton>

      {/* 照片列表 */}
      {present.photos.length === 0 ? (
        <div className="py-8 text-center">
          <ImagePlus size={32} className="mx-auto text-line mb-2" />
          <p className="text-xs text-muted">还没有照片，点击上方按钮添加</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {present.photos.map((p, idx) => {
            const isSel = selectedPhotoId === p.id;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                  isSel ? "border-clay bg-clay/5" : "border-line bg-paper hover:border-clay/30"
                }`}
                onClick={() => selectPhoto(p.id)}
              >
                <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-line">
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink truncate">{p.name}</p>
                  <p className="text-[10px] text-muted">层级 {idx + 1}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <IconButton
                    className="w-7 h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      movePhotoUp(p.id);
                    }}
                    disabled={idx === present.photos.length - 1}
                    aria-label="上移层级"
                  >
                    <ChevronUp size={14} />
                  </IconButton>
                  <IconButton
                    className="w-7 h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      movePhotoDown(p.id);
                    }}
                    disabled={idx === 0}
                    aria-label="下移层级"
                  >
                    <ChevronDown size={14} />
                  </IconButton>
                  <IconButton
                    className="w-7 h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      updatePhoto(p.id, { visible: !p.visible });
                    }}
                    aria-label={p.visible ? "隐藏" : "显示"}
                  >
                    {p.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </IconButton>
                  <IconButton
                    className="w-7 h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicatePhoto(p.id);
                    }}
                    aria-label="复制"
                  >
                    <Copy size={14} />
                  </IconButton>
                  <IconButton
                    className="w-7 h-7 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(p.id);
                    }}
                    aria-label="删除"
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 选中照片的编辑面板 */}
      {selected && selected.visible ? (
        <div className="p-3 rounded-xl bg-canvas border border-line">
          <SectionTitle>
            <span className="flex items-center gap-1.5 text-clay">
              <MousePointerClick size={14} />
              编辑：{selected.name}
            </span>
          </SectionTitle>
          <p className="text-[11px] text-muted mb-3">也可在画布上直接拖拽与缩放</p>

          <Slider
            label="大小"
            value={Math.round(selected.width)}
            min={5}
            max={80}
            step={1}
            suffix="%"
            onChange={(v) => updatePhoto(selected.id, { width: v })}
          />
          <Slider
            label="旋转"
            value={Math.round(selected.rotation)}
            min={-180}
            max={180}
            step={1}
            suffix="°"
            onChange={(v) => updatePhoto(selected.id, { rotation: v })}
          />
          <Slider
            label="透明度"
            value={Math.round(selected.opacity * 100)}
            min={0}
            max={100}
            step={5}
            suffix="%"
            onChange={(v) => updatePhoto(selected.id, { opacity: v / 100 })}
          />

          <div className="grid grid-cols-2 gap-2 mt-2">
            <Slider
              label="水平位置"
              value={Math.round(selected.x)}
              min={0}
              max={100}
              step={1}
              suffix="%"
              onChange={(v) => updatePhoto(selected.id, { x: v })}
            />
            <Slider
              label="垂直位置"
              value={Math.round(selected.y)}
              min={0}
              max={100}
              step={1}
              suffix="%"
              onChange={(v) => updatePhoto(selected.id, { y: v })}
            />
          </div>

          <GhostButton
            onClick={() => updatePhoto(selected.id, { rotation: 0, opacity: 1 })}
            className="w-full mt-2 text-xs"
          >
            重置变换
          </GhostButton>
        </div>
      ) : selected && !selected.visible ? (
        <div className="p-3 rounded-xl bg-canvas border border-line text-center">
          <p className="text-xs text-muted">该照片已隐藏，点击列表中的眼睛图标显示</p>
        </div>
      ) : (
        present.photos.length > 0 && (
          <div className="p-3 rounded-xl bg-canvas border border-line text-center">
            <MousePointerClick size={20} className="mx-auto text-line mb-1" />
            <p className="text-xs text-muted">点击上方列表选择一张照片进行编辑</p>
          </div>
        )
      )}
    </div>
  );
}
