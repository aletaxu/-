// 能力测评 API 题目生成服务
// 从 Free Dictionary API 拉取单词释义，按难度等级随机生成选择题
//
// 工作流程：
// 1. 从 vocabWordPool 中按难度随机抽取单词
// 2. 调用 lookupWord 获取每个单词的第一条释义
// 3. 用释义作为正确答案，从其他单词的释义中随机取3个作干扰项
// 4. 打乱选项顺序，生成 VocabTestQuestion
//
// 容错策略：
// - 单个单词查询失败 → 跳过该单词，从池中再抽一个补位
// - 整体失败 → 返回 null，调用方回退到本地题库

import { lookupWord } from './dictionaryApi';
import { vocabWordPool, speakingSentencePool, getAllDifficultyLevels } from '../data/assessmentWordPool';
import { shuffle } from '../data/assessment';
import type { VocabTestQuestion, SpeakingTestQuestion, SkillLevel } from '../types';

// 每个单词提取出的释义信息
interface WordWithDefinition {
  word: string;
  definition: string;       // 第一条英文释义
  partOfSpeech: string;     // 词性
  difficulty: number;
}

// 每个难度抽几个单词
const PER_DIFFICULTY = 2;

/**
 * 从指定难度的单词池中随机抽取 n 个单词
 */
const pickWordsFromDifficulty = (difficulty: number, count: number): string[] => {
  const pool = vocabWordPool[difficulty] || [];
  return shuffle(pool).slice(0, count);
};

/**
 * 调用 API 获取单个单词的释义
 * 只取第一条释义，过滤掉过长的释义
 */
const fetchWordDefinition = async (
  word: string,
  difficulty: number
): Promise<WordWithDefinition | null> => {
  try {
    const entry = await lookupWord(word, 'english');
    if (!entry || !entry.meanings || entry.meanings.length === 0) return null;

    // 找到第一条带释义的
    for (const meaning of entry.meanings) {
      if (meaning.definitions && meaning.definitions.length > 0) {
        const def = meaning.definitions[0].definition;
        if (def && def.length > 0 && def.length < 200) {
          return {
            word: entry.word || word,
            definition: def,
            partOfSpeech: meaning.partOfSpeech || '',
            difficulty,
          };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * 为单个单词生成选择题
 * 干扰项优先从同难度其他单词的释义中取，不够则从相邻难度取
 */
const buildQuestion = (
  target: WordWithDefinition,
  allDefinitions: WordWithDefinition[]
): VocabTestQuestion => {
  // 候选干扰项：排除目标单词本身
  const candidates = allDefinitions.filter(d => d.word !== target.word);

  // 优先选同难度的释义作为干扰项（让题目更有挑战性）
  const sameLevel = candidates.filter(d => d.difficulty === target.difficulty);
  // 不够则用相邻难度
  const adjacentLevel = candidates.filter(
    d => Math.abs(d.difficulty - target.difficulty) === 1
  );
  // 再不够则全部
  const distantLevel = candidates.filter(
    d => Math.abs(d.difficulty - target.difficulty) > 1
  );

  let distractors: WordWithDefinition[] = [];
  const need = 3;
  const fromSame = shuffle(sameLevel).slice(0, need);
  distractors.push(...fromSame);
  if (distractors.length < need) {
    distractors.push(...shuffle(adjacentLevel).slice(0, need - distractors.length));
  }
  if (distractors.length < need) {
    distractors.push(...shuffle(distantLevel).slice(0, need - distractors.length));
  }
  distractors = distractors.slice(0, need);

  // 构造选项（释义文本）
  const correctOption = target.definition;
  const distractorOptions = distractors.map(d => d.definition);

  // 打乱选项
  const allOptions = shuffle([correctOption, ...distractorOptions]);
  const correctIndex = allOptions.indexOf(correctOption);

  return {
    id: `api-v-${target.difficulty}-${target.word.toLowerCase()}`,
    word: target.word,
    options: allOptions,
    correctAnswer: correctIndex,
    difficulty: target.difficulty as SkillLevel,
  };
};

/**
 * 从 API 生成一套随机词汇测试题
 * 每个难度抽 2 个单词，共 20 题
 * @returns 题目数组；若 API 完全不可用返回 null
 */
export const generateApiVocabQuestions = async (): Promise<VocabTestQuestion[] | null> => {
  const difficulties = getAllDifficultyLevels();

  // 1) 每个难度抽 (PER_DIFFICULTY + 2) 个单词，留出冗余应对 API 失败
  const EXTRA = 2;
  const wordsPerDifficulty = PER_DIFFICULTY + EXTRA;

  // 2) 并发拉取所有单词的释义（控制并发为 5）
  const CONCURRENCY = 5;
  const allTasks: Array<{ word: string; difficulty: number }> = [];
  difficulties.forEach(d => {
    pickWordsFromDifficulty(d, wordsPerDifficulty).forEach(word => {
      allTasks.push({ word, difficulty: d });
    });
  });

  const results: WordWithDefinition[] = [];
  for (let i = 0; i < allTasks.length; i += CONCURRENCY) {
    const batch = allTasks.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(task => fetchWordDefinition(task.word, task.difficulty))
    );
    batchResults.forEach(r => {
      if (r) results.push(r);
    });
  }

  // 3) 如果 API 完全失败（一个释义都没拿到），返回 null 让调用方回退
  if (results.length === 0) return null;

  // 4) 每个难度只保留 PER_DIFFICULTY 个有效单词
  const selectedByDifficulty: WordWithDefinition[] = [];
  difficulties.forEach(d => {
    const sameLevel = results.filter(r => r.difficulty === d);
    selectedByDifficulty.push(...sameLevel.slice(0, PER_DIFFICULTY));
  });

  // 5) 至少要有 6 题才认为是有效生成
  if (selectedByDifficulty.length < 6) return null;

  // 6) 为每个单词生成题目（共享同一个释义池作为干扰项来源）
  const questions = selectedByDifficulty.map(target =>
    buildQuestion(target, results)
  );

  // 7) 最终打乱题目顺序
  return shuffle(questions);
};

/**
 * 从 API 单词池生成口语测试题（无需调用 API，因为只是跟读文本）
 * 每个难度抽 1 句，共 10 题
 */
export const generateApiSpeakingQuestions = (): SpeakingTestQuestion[] => {
  const difficulties = getAllDifficultyLevels();
  const questions: SpeakingTestQuestion[] = [];

  difficulties.forEach(d => {
    const pool = speakingSentencePool[d] || [];
    const picked = shuffle(pool)[0];
    if (picked) {
      questions.push({
        id: `api-s-${d}`,
        text: picked,
        difficulty: d as SkillLevel,
      });
    }
  });

  return shuffle(questions);
};

/**
 * 预热缓存：在用户进入测评页面前，后台预取所有单词的释义
 * 这样真正开始测试时大部分数据已在缓存中，体验更流畅
 */
export const preheatAssessmentCache = async (): Promise<void> => {
  // 不阻塞主流程，静默预取
  generateApiVocabQuestions().catch(() => {
    // 预热失败不影响功能
  });
};
