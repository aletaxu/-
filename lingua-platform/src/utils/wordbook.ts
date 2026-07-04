// 生词本工具 —— 模仿「每日英语听力」生词本：查词时一键加入，文中持续高亮提示
// 数据持久化在 localStorage，按语种分组管理
//
// 数据结构：Map<语言, 生词数组>，每个生词记录原文/释义/音标/加入时间/来源文章

const WORDBOOK_KEY = 'langlearn_wordbook';

export interface SavedWord {
  word: string;            // 原形小写，作为唯一键
  display?: string;        // 原文大小写形式（首次遇到时保存）
  language: string;        // 语种
  translation?: string;    // 中文释义（查词时保存）
  phonetic?: string;       // 音标
  example?: string;        // 例句（可选）
  articleTitle?: string;   // 来源文章标题
  addedAt: number;         // 加入时间戳
}

type WordbookMap = Record<string, SavedWord[]>;

const loadAll = (): WordbookMap => {
  try {
    const raw = localStorage.getItem(WORDBOOK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveAll = (data: WordbookMap) => {
  try {
    localStorage.setItem(WORDBOOK_KEY, JSON.stringify(data));
  } catch {
    // localStorage 已满或不可用，静默失败
  }
};

export const wordbook = {
  /** 取某语种全部生词（按加入时间倒序） */
  getByLanguage(language: string): SavedWord[] {
    const all = loadAll();
    return (all[language] || []).slice().sort((a, b) => b.addedAt - a.addedAt);
  },

  /** 取全部语种生词总数 */
  count(language?: string): number {
    const all = loadAll();
    if (language) return (all[language] || []).length;
    return Object.values(all).reduce((sum, arr) => sum + arr.length, 0);
  },

  /** 判断某词是否已在生词本 */
  has(language: string, word: string): boolean {
    const all = loadAll();
    const list = all[language] || [];
    const key = word.toLowerCase();
    return list.some(w => w.word === key);
  },

  /** 加入生词本（已存在则更新释义等字段） */
  add(entry: Omit<SavedWord, 'addedAt'>): void {
    const all = loadAll();
    const list = all[entry.language] || [];
    const key = entry.word.toLowerCase();
    const idx = list.findIndex(w => w.word === key);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...entry, addedAt: list[idx].addedAt };
    } else {
      list.push({ ...entry, word: key, addedAt: Date.now() });
    }
    all[entry.language] = list;
    saveAll(all);
  },

  /** 从生词本移除 */
  remove(language: string, word: string): void {
    const all = loadAll();
    const list = all[language] || [];
    const key = word.toLowerCase();
    all[language] = list.filter(w => w.word !== key);
    saveAll(all);
  },

  /** 清空某语种生词本 */
  clear(language: string): void {
    const all = loadAll();
    delete all[language];
    saveAll(all);
  },
};
