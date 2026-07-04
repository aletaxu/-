import html2canvas from "html2canvas";

// 将卡片 DOM 节点导出为 PNG 图片并下载
// 用 toBlob + createObjectURL，避免 dataURL 过长被浏览器拦截
export async function exportCardAsImage(node: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(node, {
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    scale: 2, // 2 倍清晰度
    logging: false,
  });

  // 优先用 toBlob + createObjectURL，更稳健
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png", 0.95)
  );
  if (!blob) {
    throw new Error("toBlob 返回空值");
  }

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
