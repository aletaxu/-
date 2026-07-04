import html2canvas from "html2canvas";

// 等待节点内所有 <img> 加载完成，避免 html2canvas 截到空白图
async function waitForImages(node: HTMLElement): Promise<void> {
  const imgs = Array.from(node.querySelectorAll("img"));
  if (imgs.length === 0) return;
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
          // 兜底超时，避免卡死
          setTimeout(resolve, 3000);
        }),
    ),
  );
}

// 将卡片 DOM 节点导出为 PNG 图片并下载
// 用 toBlob + createObjectURL，避免 dataURL 过长被浏览器拦截
export async function exportCardAsImage(node: HTMLElement, filename: string): Promise<void> {
  // 1. 先等所有图片加载完成
  await waitForImages(node);

  // 2. 再多等一帧，确保布局/字体就绪
  await new Promise((r) => requestAnimationFrame(() => r(null)));

  // 3. html2canvas 截图
  const canvas = await html2canvas(node, {
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    scale: 2, // 2 倍清晰度
    logging: false,
  });

  // 4. 优先用 toBlob + createObjectURL，更稳健
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png", 0.95),
  );
  if (!blob) {
    throw new Error("toBlob 返回空值");
  }

  // 5. 触发下载
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // 释放对象 URL，避免内存泄漏
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// 生成文件名
export function makeFileName(themeLabel: string): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  return `卡言-${themeLabel}-${stamp}.png`;
}
