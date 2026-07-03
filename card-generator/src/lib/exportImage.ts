import html2canvas from "html2canvas";

// 将卡片 DOM 节点导出为 PNG 图片并下载
export async function exportCardAsImage(node: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(node, {
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    scale: 2, // 2 倍清晰度
    logging: false,
  });
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 生成文件名
export function makeFileName(themeLabel: string): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  return `卡言-${themeLabel}-${stamp}.png`;
}
