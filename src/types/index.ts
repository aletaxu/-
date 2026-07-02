export type Language =
  | 'english'
  | 'german'
  | 'french'
  | 'finnish'
  | 'norwegian'
  | 'japanese'
  | 'korean'
  | 'spanish'
  | 'portuguese'
  | 'italian'
  | 'russian'
  | 'thai';
export type Level = 'beginner' | 'intermediate' | 'advanced' | 'master';
export type ModuleType = 'vocabulary' | 'grammar' | 'speaking' | 'listening' | 'reading';

// 能力维度：词汇量等级、听力等级、口语等级（1-10级）
export type SkillLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// 学习目标类型
export type GoalType =
  | 'cet4'        // 大学英语四级
  | 'cet6'        // 大学英语六级
  | 'ielts'       // 雅思
  | 'toefl'       // 托福
  | 'business'    // 商务英语
  | 'travel'      // 旅游交流
  | 'daily'       // 日常交流
  | 'jlpt-n5'     // 日语N5
  | 'jlpt-n4'     // 日语N4
  | 'jlpt-n3'     // 日语N3
  | 'jlpt-n2'     // 日语N2
  | 'jlpt-n1'     // 日语N1
  | 'topik1'      // 韩语TOPIK初级
  | 'topik2'      // 韩语TOPIK中高级
  | 'custom';     // 自定义目标

// 兴趣话题类型
export type InterestType =
  | 'tech'        // 科技
  | 'food'        // 美食
  | 'dating'      // 交友恋爱
  | 'finance'     // 理财炒股
  | 'gaming'      // 游戏
  | 'movies'      // 电影
  | 'music'       // 音乐
  | 'sports'      // 运动
  | 'travel'      // 旅行
  | 'art'         // 艺术
  | 'literature'  // 文学
  | 'science';    // 科学

export interface User {
  id: string;
  email: string;
  password: string;
  nickname: string;
  avatar: string;
  preferredLanguage: Language;
  streakDays: number;
  totalLearningTime: number;
  completedCourses: number;
  masteredWords: number;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  language: Language;
  level: Level;
  description: string;
  duration: number;
  modules: CourseModule[];
  progress: number;
  image: string;
  rating: number;
  students: number;
}

export interface CourseModule {
  id: string;
  title: string;
  type: ModuleType;
  duration: number;
  completed: boolean;
}

export interface Word {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
  difficulty: number;
}

export interface GrammarQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface SpeakingExercise {
  id: string;
  text: string;
  audioUrl?: string;
}

export interface ListeningExercise {
  id: string;
  title: string;
  audioUrl?: string;
  transcript: string;
  questions: ListeningQuestion[];
}

export interface ListeningQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// ============ 阅读模块相关类型 ============

// 固定搭配：在文末集中讲解
export interface Collocation {
  id: string;
  phrase: string;          // 固定搭配短语，如 "take for granted"
  meaning: string;         // 中文词义
  usage: string;           // 用法说明
  example: string;         // 例句
  exampleTranslation: string; // 例句翻译
}

// 阅读理解题
export interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

// 阅读文章
export interface ReadingArticle {
  id: string;
  title: string;
  language: Language;
  level: Level;
  // 文章正文：每个段落是字符串数组，前端会按单词拆分渲染为可点击 token
  paragraphs: string[];
  // 固定搭配列表（文末集中展示）
  collocations: Collocation[];
  // 阅读理解题
  questions: ReadingQuestion[];
  // 影子跟读参考文本（默认用第一段）
  shadowingText?: string;
  estimatedMinutes: number;
}

export interface LearningProgress {
  userId: string;
  courseId: string;
  moduleId: string;
  completed: boolean;
  score: number;
  completedAt?: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: {
    type: 'streak' | 'courses' | 'words' | 'time';
    target: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  totalLearningTime: number;
  completedCourses: number;
  masteredWords: number;
  streakDays: number;
  weeklyData: number[];
  monthlyData: number[];
}

// ============ 奖励系统相关类型 ============

// 学习模块类型，用于奖励计算
export type RewardModuleType = 'vocabulary' | 'grammar' | 'speaking' | 'listening' | 'reading' | 'assessment';

// 单次奖励记录
export interface RewardRecord {
  id: string;
  module: RewardModuleType;     // 学习模块
  courseId?: string;            // 关联课程
  moduleId?: string;            // 关联模块
  points: number;               // 获得积分
  coins: number;                // 获得金币
  exp: number;                  // 获得经验
  score?: number;               // 本次学习得分（0-100）
  createdAt: string;            // 获得时间
}

// 用户奖励总览
export interface UserRewards {
  points: number;               // 总积分（学习分，体现学习量）
  coins: number;                // 金币（可未来兑换功能）
  exp: number;                  // 经验值（决定等级）
  level: number;                // 当前等级
  streakDays: number;           // 连续学习天数
  lastLearnDate: string;        // 最近学习日期（YYYY-MM-DD）
  totalLearnCount: number;      // 累计学习次数
  records: RewardRecord[];      // 奖励历史记录（最近 50 条）
}

// 各模块奖励配置
export const REWARD_CONFIG: Record<RewardModuleType, { points: number; coins: number; exp: number; label: string }> = {
  vocabulary: { points: 10, coins: 5, exp: 15, label: '单词学习' },
  grammar:    { points: 12, coins: 6, exp: 18, label: '语法练习' },
  speaking:   { points: 15, coins: 8, exp: 22, label: '口语训练' },
  listening:  { points: 12, coins: 6, exp: 18, label: '听力训练' },
  reading:    { points: 18, coins: 10, exp: 28, label: '阅读理解' },
  assessment: { points: 50, coins: 30, exp: 80, label: '能力测评' },
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const languageNames: Record<Language, string> = {
  english: 'English',
  german: 'Deutsch',
  french: 'Français',
  finnish: 'Suomi',
  norwegian: 'Norsk',
  japanese: '日本語',
  korean: '한국어',
  spanish: 'Español',
  portuguese: 'Português',
  italian: 'Italiano',
  russian: 'Русский',
  thai: 'ภาษาไทย',
};

// 语言的旗帜emoji
export const languageFlags: Record<Language, string> = {
  english: '🇺🇸',
  german: '🇩🇪',
  french: '🇫🇷',
  finnish: '🇫🇮',
  norwegian: '🇳🇴',
  japanese: '🇯🇵',
  korean: '🇰🇷',
  spanish: '🇪🇸',
  portuguese: '🇵🇹',
  italian: '🇮🇹',
  russian: '🇷🇺',
  thai: '🇹🇭',
};

// 语言对应的TTS语音代码（用于Web Speech API）
export const languageCodes: Record<Language, string> = {
  english: 'en-US',
  german: 'de-DE',
  french: 'fr-FR',
  finnish: 'fi-FI',
  norwegian: 'nb-NO',
  japanese: 'ja-JP',
  korean: 'ko-KR',
  spanish: 'es-ES',
  portuguese: 'pt-PT',
  italian: 'it-IT',
  russian: 'ru-RU',
  thai: 'th-TH',
};

export const levelNames: Record<Level, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
  master: '精通',
};

export const moduleTypeNames: Record<ModuleType, string> = {
  vocabulary: '单词记忆',
  grammar: '语法练习',
  speaking: '口语跟读',
  listening: '听力训练',
  reading: '阅读理解',
};

// ============ 能力测试相关类型 ============

// 词汇测试题：根据难度分级
export interface VocabTestQuestion {
  id: string;
  word: string;
  options: string[];   // 中文释义选项
  correctAnswer: number;
  difficulty: SkillLevel; // 难度等级 1-10
}

// 听力测试题
export interface ListeningTestQuestion {
  id: string;
  audioText: string;      // 用于TTS播放的文本
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: SkillLevel;
}

// 口语测试题
export interface SpeakingTestQuestion {
  id: string;
  text: string;           // 跟读文本
  difficulty: SkillLevel;
}

// 能力测试结果
export interface AssessmentResult {
  vocabularyLevel: SkillLevel;   // 词汇量等级 1-10
  listeningLevel: SkillLevel;    // 听力等级 1-10
  speakingLevel: SkillLevel;     // 口语等级 1-10
  estimatedVocabSize: number;    // 估算词汇量
  completedAt: string;
}

// ============ 学习目标相关类型 ============

export interface LearningGoal {
  type: GoalType;
  name: string;
  description: string;
  icon: string;
  targetVocab: number;        // 目标词汇量
  targetListeningLevel: SkillLevel;
  targetSpeakingLevel: SkillLevel;
  estimatedWeeks: number;     // 预计所需周数（从零开始）
  language: Language;
}

// ============ 兴趣偏好相关类型 ============

export interface Interest {
  type: InterestType;
  name: string;
  icon: string;
  description: string;
  relatedVocab: number;   // 相关词汇数量
}

// ============ 个性化学习计划相关类型 ============

export interface PlanTask {
  id: string;
  title: string;
  type: ModuleType;
  description: string;
  estimatedMinutes: number;
  difficulty: SkillLevel;
  interestTag?: InterestType; // 关联兴趣话题
  week: number;               // 第几周
}

export interface WeeklyPlan {
  week: number;
  title: string;
  goal: string;
  tasks: PlanTask[];
  targetMinutes: number;
}

export interface LearningPlan {
  id: string;
  userId: string;
  goal: GoalType;
  interests: InterestType[];
  basedOnAssessment: AssessmentResult;
  currentLevel: {
    vocabulary: SkillLevel;
    listening: SkillLevel;
    speaking: SkillLevel;
  };
  targetLevel: {
    vocabulary: SkillLevel;
    listening: SkillLevel;
    speaking: SkillLevel;
  };
  weeklyPlans: WeeklyPlan[];
  totalWeeks: number;
  dailyTargetMinutes: number;
  createdAt: string;
  updatedAt: string;
}

// ============ 名称映射 ============

export const goalNames: Record<GoalType, string> = {
  'cet4': '大学英语四级',
  'cet6': '大学英语六级',
  'ielts': '雅思 IELTS',
  'toefl': '托福 TOEFL',
  'business': '商务英语',
  'travel': '旅游交流',
  'daily': '日常交流',
  'jlpt-n5': '日语N5',
  'jlpt-n4': '日语N4',
  'jlpt-n3': '日语N3',
  'jlpt-n2': '日语N2',
  'jlpt-n1': '日语N1',
  'topik1': '韩语TOPIK初级',
  'topik2': '韩语TOPIK中高级',
  'custom': '自定义目标',
};

export const interestNames: Record<InterestType, string> = {
  tech: '科技',
  food: '美食',
  dating: '交友恋爱',
  finance: '理财炒股',
  gaming: '游戏',
  movies: '电影',
  music: '音乐',
  sports: '运动',
  travel: '旅行',
  art: '艺术',
  literature: '文学',
  science: '科学',
};

// 能力等级名称
export const getSkillLevelName = (level: number): string => {
  if (level <= 2) return '入门';
  if (level <= 4) return '基础';
  if (level <= 6) return '中级';
  if (level <= 8) return '中高级';
  return '高级';
};

// 能力等级颜色
export const getSkillLevelColor = (level: number): string => {
  if (level <= 2) return 'text-gray-500 bg-gray-100';
  if (level <= 4) return 'text-blue-600 bg-blue-100';
  if (level <= 6) return 'text-green-600 bg-green-100';
  if (level <= 8) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};
