import type { CardState, GenConfig, ThemeType, ToneType } from "./types";
import { THEMES, TONES } from "./constants";

// 根据当前卡片状态 + 生成配置，构造一份给 AI 工具使用的 Prompt
// 用户复制后可直接粘贴到 ChatGPT / 通义 / 文心 / 智谱清言 / Kimi 等 AI 工具

interface PromptInput {
  card: CardState;
  genConfig: GenConfig;
  // 可选：用户填写的个性化细节（如"相识 10 年的老友""帮过我的恩师"）
  details?: string;
}

// 主题对应的场景描述
const THEME_SCENE: Record<ThemeType, string> = {
  birthday: "生日庆祝贺卡",
  invitation: "活动邀请函",
  opening: "开业恭喜贺卡",
  wedding: "婚礼喜帖",
  festival: "节日祝福贺卡",
  thanks: "感谢致意卡片",
};

// 语气对应的风格指引
const TONE_GUIDE: Record<ToneType, string> = {
  warm: "温馨真挚，如暖阳在心，柔软而不矫情",
  humor: "幽默俏皮，会心一笑，避免低俗",
  formal: "端庄得体，礼数周全，适合长辈或商务场合",
  poetic: "诗意绵长，意象丰富，字字含情",
  playful: "活泼跳跃，元气满满，年轻化表达",
};

// 画幅对应的视觉提示
function ratioHint(ratio: string): string {
  return ratio === "4:3" ? "横版（适合邀请函、活动海报）" : "竖版（适合贺卡、喜帖）";
}

export function buildPrompt({ card, genConfig, details }: PromptInput): string {
  const theme = THEMES.find((t) => t.type === card.theme);
  const tone = TONES.find((t) => t.type === genConfig.tone);

  const lines: string[] = [];

  // 角色与任务
  lines.push("# 角色");
  lines.push("你是一位资深的贺卡文案专家，擅长为不同场景撰写打动人心、得体且有创意的祝福语。");
  lines.push("");

  // 任务描述
  lines.push("# 任务");
  lines.push(`请为一张「${THEME_SCENE[card.theme]}」撰写文案，画幅为${ratioHint(card.canvasRatio)}。`);
  lines.push("");

  // 关键信息
  lines.push("# 关键信息");
  lines.push(`- 主题：${theme?.label ?? card.theme}`);
  lines.push(`- 语气风格：${tone?.label ?? genConfig.tone}（${TONE_GUIDE[genConfig.tone]}）`);
  lines.push(`- 称谓：${card.salutation || "（未指定，请自行斟酌）"}`);
  lines.push(`- 收信人：${card.recipient || "（未指定，请用通用称呼）"}`);
  lines.push(`- 发信人：${card.sender || "（未指定）"}`);
  lines.push(`- 正文字数：约 ${genConfig.wordCount} 字（上下浮动不超过 20%）`);
  if (details && details.trim()) {
    lines.push(`- 个性化细节：${details.trim()}`);
  }
  lines.push("");

  // 写作要求
  lines.push("# 写作要求");
  lines.push("1. 文案需包含三部分：**标题**（简短有力，10 字以内）、**正文**、**落款**");
  lines.push("2. 避免套话和陈词滥调，要有具体画面感和情感温度");
  lines.push("3. 根据语气风格调整用词：");
  lines.push(`   - ${TONE_GUIDE[genConfig.tone]}`);
  lines.push("4. 正文长度严格遵守字数要求，不要过度铺陈");
  lines.push("5. 落款需包含发信人，格式如「—— 永远爱你的 小满」");
  lines.push("6. 不要使用 emoji，不要使用 Markdown 标记，纯文本即可");
  lines.push("7. 不要解释，直接输出文案");
  lines.push("");

  // 输出格式
  lines.push("# 输出格式");
  lines.push("请严格按以下格式输出（三行，用空行分隔）：");
  lines.push("```");
  lines.push("[标题]");
  lines.push("");
  lines.push("[正文]");
  lines.push("");
  lines.push("[落款]");
  lines.push("```");
  lines.push("");

  // 备选要求
  lines.push("# 附加要求");
  lines.push("请提供 3 组不同风格的候选文案，每组之间用「---」分隔，方便我挑选。");

  return lines.join("\n");
}

// 常用 AI 工具快捷链接
export interface AiTool {
  name: string;
  url: string;
  desc: string;
}

export const AI_TOOLS: AiTool[] = [
  { name: "智谱清言", url: "https://chatglm.cn/", desc: "智谱 AI 出品，中文优秀" },
  { name: "通义千问", url: "https://tongyi.aliyun.com/", desc: "阿里出品，中文顶尖" },
  { name: "文心一言", url: "https://yiyan.baidu.com/", desc: "百度出品" },
  { name: "Kimi", url: "https://kimi.moonshot.cn/", desc: "月之暗面，长文本" },
  { name: "DeepSeek", url: "https://chat.deepseek.com/", desc: "深度求索" },
  { name: "ChatGPT", url: "https://chat.openai.com/", desc: "OpenAI 出品" },
];
