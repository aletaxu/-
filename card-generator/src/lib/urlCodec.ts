import type { CardState } from "./types";

// 将卡片状态编码为 URL 安全的 Base64 字符串
export function encodeCardToUrl(state: CardState): string {
  try {
    // 上传音乐的 dataURL 体积过大（动辄数 MB），无法放进分享链接
    // 编码前剥离此类音乐，分享链接将不携带音乐
    let sanitized = state;
    if (state.music?.url && state.music.url.startsWith("data:")) {
      sanitized = { ...state, music: null };
    }
    const json = JSON.stringify(sanitized);
    // 处理 Unicode 字符
    const unicodeSafe = encodeURIComponent(json);
    // btoa 仅支持 Latin1，先 encodeURIComponent 转义
    return btoa(unicodeSafe);
  } catch (e) {
    console.error("encodeCardToUrl failed", e);
    return "";
  }
}

// 从 Base64 字符串解码卡片状态
export function decodeCardFromUrl(data: string): CardState | null {
  try {
    const unicodeSafe = atob(data);
    const json = decodeURIComponent(unicodeSafe);
    return JSON.parse(json) as CardState;
  } catch (e) {
    console.error("decodeCardFromUrl failed", e);
    return null;
  }
}

// 生成完整分享链接
export function buildShareUrl(state: CardState): string {
  const encoded = encodeCardToUrl(state);
  const base = window.location.origin + window.location.pathname;
  return `${base}#/view/${encoded}`;
}
