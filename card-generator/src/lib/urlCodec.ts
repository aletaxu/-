import type { CardState } from "./types";

// 将 Base64 字符串转换为 URL 安全格式（base64url）：
// + -> -，/ -> _，去掉末尾的 = 填充
function toBase64Url(b64: string): string {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// 反向还原 base64url 为标准 Base64，补回 = 填充
function fromBase64Url(s: string): string {
  const std = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = std.length % 4 === 0 ? "" : "=".repeat(4 - (std.length % 4));
  return std + pad;
}

// 压缩图片 dataURL 到指定最大边长和质量，返回压缩后的 dataURL
// 用于分享链接编码前压缩用户上传的照片/背景，避免 URL 过长
async function compressImageDataUrl(
  dataUrl: string,
  maxEdge: number,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const { width, height } = img;
      const scale = Math.min(1, maxEdge / Math.max(width, height));
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl); // 失败时降级返回原图
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(dataUrl); // 失败时降级
      }
    };
    img.onerror = () => resolve(dataUrl); // 加载失败返回原图（可能是渐变 URL）
    img.src = dataUrl;
  });
}

// 估算字符串字节长度（UTF-8）
function byteLength(s: string): number {
  // encodeURIComponent 编码每个字符，%XX 占 3 字节，未编码字符占 1 字节
  // 简单估算：每个中文字符约 3 字节，ASCII 1 字节
  // 用 Blob 的 size 更准确，但 Blob 是异步的，这里用近似
  return new Blob([s]).size;
}

// 编码前对卡片状态做净化：压缩过大的 dataURL，剥离上传音乐
async function sanitizeForShare(state: CardState): Promise<CardState> {
  const sanitized: CardState = { ...state };

  // 1. 剥离上传音乐（dataURL 体积过大）
  if (sanitized.music?.url && sanitized.music.url.startsWith("data:")) {
    sanitized.music = null;
  }

  // 2. 压缩照片 dataURL（最大 800px，质量 0.8）
  if (sanitized.photos && sanitized.photos.length > 0) {
    sanitized.photos = await Promise.all(
      sanitized.photos.map(async (p) => {
        if (p.url && p.url.startsWith("data:")) {
          try {
            const compressed = await compressImageDataUrl(p.url, 800, 0.8);
            return { ...p, url: compressed };
          } catch {
            return p;
          }
        }
        return p;
      }),
    );
  }

  // 3. 压缩自定义背景图 dataURL（最大 1200px，质量 0.8）
  if (
    sanitized.background?.url &&
    sanitized.background.url.startsWith("data:") &&
    sanitized.background.source === "custom"
  ) {
    try {
      const compressed = await compressImageDataUrl(sanitized.background.url, 1200, 0.8);
      sanitized.background = { ...sanitized.background, url: compressed };
    } catch {
      // 保留原图
    }
  }

  // 4. 删除 createdAt/updatedAt 等无关字段以减小体积
  const { createdAt: _c, updatedAt: _u, id: _i, ...rest } = sanitized;
  return rest as CardState;
}

// 将卡片状态编码为 URL 安全的 Base64 字符串
export async function encodeCardToUrl(state: CardState): Promise<string> {
  try {
    const sanitized = await sanitizeForShare(state);
    const json = JSON.stringify(sanitized);
    // 处理 Unicode 字符
    const unicodeSafe = encodeURIComponent(json);
    // btoa 仅支持 Latin1，先 encodeURIComponent 转义
    return toBase64Url(btoa(unicodeSafe));
  } catch (e) {
    console.error("encodeCardToUrl failed", e);
    return "";
  }
}

// 从 Base64 字符串解码卡片状态
export function decodeCardFromUrl(data: string): CardState | null {
  try {
    const unicodeSafe = atob(fromBase64Url(data));
    const json = decodeURIComponent(unicodeSafe);
    return JSON.parse(json) as CardState;
  } catch (e) {
    console.error("decodeCardFromUrl failed", e);
    return null;
  }
}

// 生成完整分享链接（HashRouter 路由，静态部署无需 SPA 回退）
// 返回 { url, tooLong }：tooLong=true 时表示 URL 超长，可能无法分享
export async function buildShareUrl(
  state: CardState,
): Promise<{ url: string; tooLong: boolean; bytes: number }> {
  const encoded = await encodeCardToUrl(state);
  const base = window.location.origin + window.location.pathname;
  const url = `${base}#/view/${encoded}`;
  const bytes = byteLength(url);
  // 浏览器 URL 安全长度阈值约 2MB（Chrome ~2MB，Safari ~80KB，微信内置浏览器更小）
  // 这里用 30KB 作为警告阈值（兼顾微信等严苛环境）
  return { url, tooLong: bytes > 30000, bytes };
}

// 复制文本到剪贴板，兼容非 HTTPS 环境（如 IP 访问 / 沙箱）
// 返回是否成功
export async function copyToClipboard(text: string): Promise<boolean> {
  // 优先用现代 Clipboard API（要求 secure context: HTTPS 或 localhost）
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 失败则降级
    }
  }
  // 降级方案：textarea + execCommand
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
