import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CardState,
  GenConfig,
  Photo,
  FreeText,
  TextContent,
  Background,
  Music,
  ThemeType,
  CanvasRatio,
  EffectsConfig,
} from "../lib/types";

// 动效默认配置：全部开启，让接收方第一次打开有惊喜感
export const DEFAULT_EFFECTS: EffectsConfig = {
  particles: true,
  cardOpen: true,
  photoFloat: true,
  typewriter: true,
};

// 默认卡片状态
export function createDefaultCard(): CardState {
  return {
    id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    theme: "birthday",
    sender: "你的朋友",
    recipient: "小满",
    salutation: "亲爱的",
    background: {
      source: "library",
      url: "",
      gradient: "linear-gradient(135deg, #FBC2EB 0%, #A6C1EE 100%)",
      overlay: "#000000",
      overlayOpacity: 0,
    } as Background,
    music: null,
    photos: [],
    freeTexts: [],
    text: {
      title: "生日快乐",
      body: "愿你新的一岁，眼里有星光，心中有暖阳，所遇皆是温柔，所行皆化坦途。",
      signature: "—— 永远爱你的朋友",
      font: "serif",
      fontSize: 18,
      color: "#1A1A1A",
      align: "center",
    },
    canvasRatio: "3:4",
    effects: { ...DEFAULT_EFFECTS },
    createdAt: new Date().toISOString(),
  };
}

// 兼容旧数据：确保 freeTexts 与 effects 字段存在
export function normalizeCard(state: CardState): CardState {
  const patched: CardState = !state.freeTexts ? { ...state, freeTexts: [] } : state;
  if (!patched.effects) {
    return { ...patched, effects: { ...DEFAULT_EFFECTS } };
  }
  // 补齐可能缺失的子字段（向后兼容）
  return {
    ...patched,
    effects: { ...DEFAULT_EFFECTS, ...patched.effects },
  };
}

// 为 Background 提供兼容渐变的类型（assets.ts 中 BackgroundAsset 有 gradient 字段，
// 但 CardState.Background 没有，这里扩展存储时把 gradient 也存进 url 字段以特殊标记）
// 实际处理：若 url 以 "gradient:" 开头则视为渐变
export function backgroundToStyle(bg: Background): React.CSSProperties {
  if (bg.url.startsWith("gradient:")) {
    return { background: bg.url.slice("gradient:".length) };
  }
  if (bg.url) {
    return {
      backgroundImage: `url(${bg.url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { background: "#FAF7F2" };
}

interface CardStore {
  present: CardState;
  past: CardState[];
  future: CardState[];
  selectedPhotoId: string | null;
  selectedFreeTextId: string | null;
  genConfig: GenConfig;
  // 用户上传的音乐库（独立于卡片，持久化在本地）
  userMusics: Music[];
  // 多卡片草稿列表（最多保留 20 个）
  savedDrafts: CardState[];

  // 提交变更到历史
  commit: (updater: (draft: CardState) => CardState) => void;
  // 直接覆盖 present（不进入历史，用于加载/重置）
  setPresent: (state: CardState) => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  setTheme: (theme: ThemeType) => void;
  setSender: (v: string) => void;
  setRecipient: (v: string) => void;
  setSalutation: (v: string) => void;
  setBackground: (bg: Partial<Background>) => void;
  setMusic: (music: Music | null) => void;
  setText: (patch: Partial<TextContent>) => void;
  setCanvasRatio: (r: CanvasRatio) => void;
  // 动效开关（部分更新，进入历史）
  setEffects: (patch: Partial<EffectsConfig>) => void;

  addPhoto: (photo: Photo) => void;
  updatePhoto: (id: string, patch: Partial<Photo>) => void;
  removePhoto: (id: string) => void;
  duplicatePhoto: (id: string) => void;
  movePhotoUp: (id: string) => void;
  movePhotoDown: (id: string) => void;
  selectPhoto: (id: string | null) => void;

  addFreeText: (ft: FreeText) => void;
  updateFreeText: (id: string, patch: Partial<FreeText>) => void;
  removeFreeText: (id: string) => void;
  duplicateFreeText: (id: string) => void;
  moveFreeTextUp: (id: string) => void;
  moveFreeTextDown: (id: string) => void;
  selectFreeText: (id: string | null) => void;

  setGenConfig: (patch: Partial<GenConfig>) => void;
  applyGenerated: (text: Partial<TextContent>) => void;
  applyTemplate: (patch: {
    background?: Background;
    text?: Partial<TextContent>;
    canvasRatio?: CanvasRatio;
    freeTexts?: FreeText[];
  }) => void;

  // 用户音乐库管理（不进历史，独立持久化）
  addUserMusic: (m: Music) => void;
  removeUserMusic: (id: string) => void;

  reset: () => void;
  loadCard: (state: CardState) => void;

  // 多卡片草稿管理
  // 把当前 present 存为草稿（开头插入，最多 20 个）
  saveCurrentAsDraft: () => void;
  // 加载指定草稿到 present（清空历史）
  loadDraft: (id: string) => void;
  // 删除指定草稿
  deleteDraft: (id: string) => void;
  // 复制草稿（生成新 id）并加入 savedDrafts
  duplicateDraft: (id: string) => void;
}

const MAX_HISTORY = 50;
// 草稿最多保留数量
const MAX_DRAFTS = 20;

export const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({
      present: createDefaultCard(),
      past: [],
      future: [],
      selectedPhotoId: null,
      selectedFreeTextId: null,
      genConfig: {
        tone: "warm",
        wordCount: 80,
        font: "serif",
        fontSize: 18,
      },
      userMusics: [],
      savedDrafts: [],

      commit: (updater) => {
        const { present, past } = get();
        const next = updater(structuredClone(present));
        set({
          present: next,
          past: [...past, present].slice(-MAX_HISTORY),
          future: [],
        });
      },

      setPresent: (state) => set({ present: normalizeCard(state), past: [], future: [], selectedPhotoId: null, selectedFreeTextId: null }),

      undo: () => {
        const { past, present, future } = get();
        if (past.length === 0) return;
        const prev = past[past.length - 1];
        set({
          present: prev,
          past: past.slice(0, -1),
          future: [present, ...future].slice(0, MAX_HISTORY),
          selectedPhotoId: null,
          selectedFreeTextId: null,
        });
      },
      redo: () => {
        const { past, present, future } = get();
        if (future.length === 0) return;
        const next = future[0];
        set({
          present: next,
          future: future.slice(1),
          past: [...past, present].slice(-MAX_HISTORY),
          selectedPhotoId: null,
          selectedFreeTextId: null,
        });
      },
      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,

      setTheme: (theme) => get().commit((d) => ({ ...d, theme })),
      setSender: (v) => get().commit((d) => ({ ...d, sender: v })),
      setRecipient: (v) => get().commit((d) => ({ ...d, recipient: v })),
      setSalutation: (v) => get().commit((d) => ({ ...d, salutation: v })),
      setBackground: (bg) =>
        get().commit((d) => ({ ...d, background: { ...d.background, ...bg } })),
      setMusic: (music) => get().commit((d) => ({ ...d, music })),
      setText: (patch) => get().commit((d) => ({ ...d, text: { ...d.text, ...patch } })),
      setCanvasRatio: (r) => get().commit((d) => ({ ...d, canvasRatio: r })),
      setEffects: (patch) =>
        get().commit((d) => ({
          ...d,
          effects: { ...DEFAULT_EFFECTS, ...d.effects, ...patch },
        })),

      addPhoto: (photo) =>
        get().commit((d) => ({
          ...d,
          photos: [...d.photos, { ...photo, zIndex: d.photos.length }],
        })),
      updatePhoto: (id, patch) =>
        get().commit((d) => ({
          ...d,
          photos: d.photos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removePhoto: (id) =>
        get().commit((d) => ({
          ...d,
          photos: d.photos.filter((p) => p.id !== id),
        })),
      duplicatePhoto: (id) =>
        get().commit((d) => {
          const src = d.photos.find((p) => p.id === id);
          if (!src) return d;
          const copy: Photo = {
            ...src,
            id: `ph_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            x: Math.min(src.x + 5, 90),
            y: Math.min(src.y + 5, 90),
            zIndex: d.photos.length,
          };
          return { ...d, photos: [...d.photos, copy] };
        }),
      movePhotoUp: (id) =>
        get().commit((d) => {
          // 上移 = zIndex 增大（更靠前）
          const idx = d.photos.findIndex((p) => p.id === id);
          if (idx < 0 || idx === d.photos.length - 1) return d;
          const arr = [...d.photos];
          [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
          // 重新分配 zIndex
          arr.forEach((p, i) => (p.zIndex = i));
          return { ...d, photos: arr };
        }),
      movePhotoDown: (id) =>
        get().commit((d) => {
          const idx = d.photos.findIndex((p) => p.id === id);
          if (idx <= 0) return d;
          const arr = [...d.photos];
          [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]];
          arr.forEach((p, i) => (p.zIndex = i));
          return { ...d, photos: arr };
        }),
      selectPhoto: (id) => set({ selectedPhotoId: id }),

      addFreeText: (ft) =>
        get().commit((d) => ({
          ...d,
          freeTexts: [...d.freeTexts, { ...ft, zIndex: d.freeTexts.length + d.photos.length }],
        })),
      updateFreeText: (id, patch) =>
        get().commit((d) => ({
          ...d,
          freeTexts: d.freeTexts.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      removeFreeText: (id) =>
        get().commit((d) => ({
          ...d,
          freeTexts: d.freeTexts.filter((t) => t.id !== id),
        })),
      duplicateFreeText: (id) =>
        get().commit((d) => {
          const src = d.freeTexts.find((t) => t.id === id);
          if (!src) return d;
          const copy: FreeText = {
            ...src,
            id: `ft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            x: Math.min(src.x + 5, 90),
            y: Math.min(src.y + 5, 90),
            zIndex: d.freeTexts.length + d.photos.length,
          };
          return { ...d, freeTexts: [...d.freeTexts, copy] };
        }),
      moveFreeTextUp: (id) =>
        get().commit((d) => {
          const idx = d.freeTexts.findIndex((t) => t.id === id);
          if (idx < 0 || idx === d.freeTexts.length - 1) return d;
          const arr = [...d.freeTexts];
          [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
          arr.forEach((t, i) => (t.zIndex = d.photos.length + i));
          return { ...d, freeTexts: arr };
        }),
      moveFreeTextDown: (id) =>
        get().commit((d) => {
          const idx = d.freeTexts.findIndex((t) => t.id === id);
          if (idx <= 0) return d;
          const arr = [...d.freeTexts];
          [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]];
          arr.forEach((t, i) => (t.zIndex = d.photos.length + i));
          return { ...d, freeTexts: arr };
        }),
      selectFreeText: (id) => set({ selectedFreeTextId: id }),

      setGenConfig: (patch) => set((s) => ({ genConfig: { ...s.genConfig, ...patch } })),
      applyGenerated: (text) => get().commit((d) => ({ ...d, text: { ...d.text, ...text } })),
      applyTemplate: (patch) =>
        get().commit((d) => ({
          ...d,
          background: patch.background ? { ...d.background, ...patch.background } : d.background,
          text: patch.text ? { ...d.text, ...patch.text } : d.text,
          canvasRatio: patch.canvasRatio ?? d.canvasRatio,
          freeTexts: patch.freeTexts ?? d.freeTexts,
        })),

      // 用户音乐库：不进历史，直接更新本地库
      addUserMusic: (m) =>
        set((s) => ({ userMusics: [...s.userMusics, m] })),
      removeUserMusic: (id) =>
        set((s) => {
          const userMusics = s.userMusics.filter((m) => m.id !== id);
          // 若当前卡片正使用该音乐，同步移除
          if (s.present.music?.id === id) {
            return {
              userMusics,
              present: { ...s.present, music: null },
            };
          }
          return { userMusics };
        }),

      reset: () => set({ present: createDefaultCard(), past: [], future: [], selectedPhotoId: null, selectedFreeTextId: null }),
      loadCard: (state) =>
        set({ present: normalizeCard(state), past: [], future: [], selectedPhotoId: null, selectedFreeTextId: null }),

      // 多卡片草稿管理
      saveCurrentAsDraft: () => {
        const { present, savedDrafts } = get();
        // 重新生成 id 与 updatedAt 时间戳，避免与 present 重复
        const draft: CardState = {
          ...structuredClone(present),
          id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          updatedAt: new Date().toISOString(),
        };
        // 开头插入，最多保留 20 个（超出截断末尾）
        set({ savedDrafts: [draft, ...savedDrafts].slice(0, MAX_DRAFTS) });
      },
      loadDraft: (id) => {
        const { savedDrafts } = get();
        const draft = savedDrafts.find((d) => d.id === id);
        if (!draft) return;
        // 复用 loadCard 逻辑：加载到 present 并清空历史
        get().loadCard(draft);
      },
      deleteDraft: (id) => {
        set((s) => ({ savedDrafts: s.savedDrafts.filter((d) => d.id !== id) }));
      },
      duplicateDraft: (id) => {
        const { savedDrafts } = get();
        const src = savedDrafts.find((d) => d.id === id);
        if (!src) return;
        // 复制草稿，生成新 id 与 updatedAt
        const copy: CardState = {
          ...structuredClone(src),
          id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          updatedAt: new Date().toISOString(),
        };
        // 复制件插入到原草稿之后，最多保留 20 个
        set({ savedDrafts: [copy, ...savedDrafts].slice(0, MAX_DRAFTS) });
      },
    }),
    {
      name: "cardgen:draft",
      // 持久化 present、genConfig、用户音乐库与草稿列表，不持久化历史与选中态
      partialize: (s) => ({
        present: s.present,
        genConfig: s.genConfig,
        userMusics: s.userMusics,
        savedDrafts: s.savedDrafts,
      }) as CardStore,
    }
  )
);
