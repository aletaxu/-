// 英语词缀分析工具：帮助用户理解单词构成，辅助记忆
// 识别常见前缀、后缀、词根，给出含义和词性提示

interface AffixInfo {
  prefix?: string;
  prefixMeaning?: string;
  root?: string;
  suffix?: string;
  suffixMeaning?: string;
  suffixPos?: string; // 后缀暗示的词性
  hint: string; // 记忆提示
}

// 常见前缀及其含义
const PREFIXES: Record<string, string> = {
  'un': '否定、相反',
  're': '再次、重新',
  'pre': '在…之前',
  'dis': '否定、分离',
  'mis': '错误、坏',
  'in': '否定、进入',
  'im': '否定（用于b/m/p前）',
  'il': '否定（用于l前）',
  'ir': '否定（用于r前）',
  'non': '非、不',
  'over': '过度、超过',
  'under': '不足、在下',
  'sub': '在下面、次',
  'super': '超级、超过',
  'trans': '跨越、转变',
  'inter': '在…之间',
  'fore': '在前面、预先',
  'anti': '反对、抗',
  'auto': '自动、自己',
  'bio': '生命、生物',
  'geo': '地球、土地',
  'tele': '远距离',
  'photo': '光、照片',
  'micro': '微小',
  'macro': '宏大',
  'multi': '多',
  'semi': '半',
  'uni': '单一',
  'bi': '二、双',
  'tri': '三',
  'mono': '单一',
  'poly': '多',
  'en': '使…进入',
  'em': '使…进入（用于b/m/p前）',
  'ex': '向外、前任',
  'com': '共同、一起',
  'con': '共同、一起',
  'col': '共同（用于l前）',
  'cor': '共同（用于r前）',
  'de': '向下、去除',
  'be': '使…、加以',
  'ab': '偏离、离开',
  'ad': '朝向、加强',
  'pro': '向前、支持',
  'per': '贯穿、彻底',
  'circum': '环绕',
  'counter': '反对、相反',
  'extra': '超出',
  'hypo': '低于、不足',
  'hyper': '超过、过度',
};

// 常见后缀及其含义和词性提示
const SUFFIXES: Record<string, { meaning: string; pos: string }> = {
  'able': { meaning: '能够…的', pos: '形容词' },
  'ible': { meaning: '能够…的', pos: '形容词' },
  'tion': { meaning: '…的动作或状态', pos: '名词' },
  'sion': { meaning: '…的动作或状态', pos: '名词' },
  'ment': { meaning: '…的行为或结果', pos: '名词' },
  'ness': { meaning: '…的状态或性质', pos: '名词' },
  'ity': { meaning: '…的性质或状态', pos: '名词' },
  'er': { meaning: '做…的人或物', pos: '名词' },
  'or': { meaning: '做…的人', pos: '名词' },
  'ist': { meaning: '…主义者、做…的人', pos: '名词' },
  'ism': { meaning: '…主义', pos: '名词' },
  'ize': { meaning: '使…化', pos: '动词' },
  'ise': { meaning: '使…化', pos: '动词' },
  'ify': { meaning: '使…化', pos: '动词' },
  'ate': { meaning: '使…、做…', pos: '动词' },
  'ful': { meaning: '充满…的', pos: '形容词' },
  'less': { meaning: '无…的', pos: '形容词' },
  'ous': { meaning: '具有…的', pos: '形容词' },
  'ive': { meaning: '有…倾向的', pos: '形容词' },
  'al': { meaning: '与…有关的', pos: '形容词/名词' },
  'ial': { meaning: '与…有关的', pos: '形容词' },
  'ic': { meaning: '与…有关的', pos: '形容词' },
  'ical': { meaning: '与…有关的', pos: '形容词' },
  'ly': { meaning: '以…方式', pos: '副词' },
  'y': { meaning: '有…特性的', pos: '形容词/名词' },
  'ed': { meaning: '已…的（过去式/过去分词）', pos: '形容词/动词' },
  'ing': { meaning: '正在…的', pos: '形容词/名词/动词' },
  'ance': { meaning: '…的状态或性质', pos: '名词' },
  'ence': { meaning: '…的状态或性质', pos: '名词' },
  'ant': { meaning: '做…的（人/物）', pos: '名词/形容词' },
  'ent': { meaning: '做…的（人/物）', pos: '名词/形容词' },
  'ary': { meaning: '与…有关的', pos: '形容词/名词' },
  'ery': { meaning: '…的场所或状态', pos: '名词' },
  'ory': { meaning: '与…有关的', pos: '形容词/名词' },
  'ish': { meaning: '有点…的', pos: '形容词' },
  'ward': { meaning: '朝…方向', pos: '副词/形容词' },
  'wise': { meaning: '在…方面', pos: '副词' },
  'age': { meaning: '…的动作或结果', pos: '名词' },
  'dom': { meaning: '…的状态或领域', pos: '名词' },
  'hood': { meaning: '…的时期或状态', pos: '名词' },
  'ship': { meaning: '…的关系或状态', pos: '名词' },
  'th': { meaning: '…的状态或性质', pos: '名词' },
  'ure': { meaning: '…的动作或结果', pos: '名词' },
};

/**
 * 分析英语单词的词缀构成
 */
export const analyzeWordMorph = (word: string): AffixInfo | null => {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length < 4) return null; // 太短的词不做分析

  let prefix: string | undefined;
  let prefixMeaning: string | undefined;
  let suffix: string | undefined;
  let suffixInfo: { meaning: string; pos: string } | undefined;
  let root = w;

  // 检测前缀（从长到短匹配）
  const sortedPrefixes = Object.keys(PREFIXES).sort((a, b) => b.length - a.length);
  for (const p of sortedPrefixes) {
    if (w.startsWith(p) && w.length - p.length >= 3) {
      prefix = p;
      prefixMeaning = PREFIXES[p];
      root = w.slice(p.length);
      break;
    }
  }

  // 检测后缀（从长到短匹配）
  const sortedSuffixes = Object.keys(SUFFIXES).sort((a, b) => b.length - a.length);
  for (const s of sortedSuffixes) {
    if (root.endsWith(s) && root.length - s.length >= 3) {
      suffix = s;
      suffixInfo = SUFFIXES[s];
      root = root.slice(0, root.length - s.length);
      break;
    }
  }

  // 如果既没前缀也没后缀，返回 null
  if (!prefix && !suffix) return null;

  // 构建记忆提示
  const parts: string[] = [];
  if (prefix) parts.push(`"${prefix}-"（${prefixMeaning}）`);
  if (root && root.length >= 2) parts.push(`词根"${root}"`);
  if (suffix && suffixInfo) parts.push(`"-${suffix}"（${suffixInfo.meaning}）`);

  let hint = '该词由 ' + parts.join(' + ') + ' 构成';
  if (suffix && suffixInfo) {
    hint += `，后缀提示词性为${suffixInfo.pos}`;
  }

  return {
    prefix,
    prefixMeaning,
    root: root.length >= 2 ? root : undefined,
    suffix,
    suffixMeaning: suffixInfo?.meaning,
    suffixPos: suffixInfo?.pos,
    hint,
  };
};
