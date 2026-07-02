import type {
  AssessmentResult,
  LearningGoal,
  InterestType,
  LearningPlan,
  WeeklyPlan,
  PlanTask,
  SkillLevel,
  ModuleType,
} from '../types';
import { getInterestByType } from './learningGoals';

// 根据能力差距调整预计周数
const adjustWeeksByLevel = (
  baseWeeks: number,
  currentLevel: number,
  targetLevel: number
): number => {
  const gap = Math.max(0, targetLevel - currentLevel);
  // 每级差距增加约15%的时间
  const adjusted = Math.round(baseWeeks * (1 + gap * 0.15));
  return Math.max(2, adjusted);
};

// 根据兴趣选择优先话题
const selectInterestTopics = (interests: InterestType[], maxCount: number = 4): InterestType[] => {
  return interests.slice(0, maxCount);
};

// 生成单周任务
const generateWeekTasks = (
  week: number,
  totalWeeks: number,
  goal: LearningGoal,
  currentLevel: { vocabulary: SkillLevel; listening: SkillLevel; speaking: SkillLevel },
  targetLevel: { vocabulary: SkillLevel; listening: SkillLevel; speaking: SkillLevel },
  interestTopics: InterestType[]
): PlanTask[] => {
  const tasks: PlanTask[] = [];
  const progress = week / totalWeeks;

  // 计算当前周应达到的难度等级
  const calcWeekLevel = (current: SkillLevel, target: SkillLevel): SkillLevel => {
    const level = Math.round(current + (target - current) * progress);
    return Math.max(1, Math.min(10, level)) as SkillLevel;
  };

  const weekVocabLevel = calcWeekLevel(currentLevel.vocabulary, targetLevel.vocabulary);
  const weekListenLevel = calcWeekLevel(currentLevel.listening, targetLevel.listening);
  const weekSpeakLevel = calcWeekLevel(currentLevel.speaking, targetLevel.speaking);

  // 兴趣话题轮换
  const weekInterest = interestTopics.length > 0
    ? interestTopics[(week - 1) % interestTopics.length]
    : undefined;
  const interestInfo = weekInterest ? getInterestByType(weekInterest) : undefined;

  // 词汇任务（每天）
  tasks.push({
    id: `task-v-${week}`,
    title: `词汇记忆 - ${interestInfo ? interestInfo.name + '主题' : '核心词汇'}`,
    type: 'vocabulary' as ModuleType,
    description: `学习${interestInfo ? interestInfo.name + '相关' : ''}词汇，难度等级 ${weekVocabLevel}/10`,
    estimatedMinutes: 20,
    difficulty: weekVocabLevel,
    interestTag: weekInterest,
    week,
  });

  // 听力任务
  tasks.push({
    id: `task-l-${week}`,
    title: `听力训练 - ${interestInfo ? interestInfo.name + '话题' : '综合听力'}`,
    type: 'listening' as ModuleType,
    description: `${interestInfo ? '围绕' + interestInfo.name + '话题的' : ''}听力练习，难度等级 ${weekListenLevel}/10`,
    estimatedMinutes: 15,
    difficulty: weekListenLevel,
    interestTag: weekInterest,
    week,
  });

  // 口语任务
  tasks.push({
    id: `task-s-${week}`,
    title: `口语跟读 - ${interestInfo ? interestInfo.name + '场景' : '日常口语'}`,
    type: 'speaking' as ModuleType,
    description: `${interestInfo ? interestInfo.name + '场景' : '日常'}口语表达练习，难度等级 ${weekSpeakLevel}/10`,
    estimatedMinutes: 15,
    difficulty: weekSpeakLevel,
    interestTag: weekInterest,
    week,
  });

  // 语法任务（隔周）
  if (week % 2 === 1) {
    tasks.push({
      id: `task-g-${week}`,
      title: `语法练习 - 第${week}周语法点`,
      type: 'grammar' as ModuleType,
      description: `巩固${goal.name}相关语法知识，提升语言准确性`,
      estimatedMinutes: 20,
      difficulty: weekVocabLevel,
      week,
    });
  }

  return tasks;
};

// 生成周标题和目标
const getWeekGoal = (week: number, totalWeeks: number, goal: LearningGoal): { title: string; goal: string } => {
  const phase = week / totalWeeks;
  if (phase <= 0.25) {
    return {
      title: `第${week}周 · 基础夯实阶段`,
      goal: `建立${goal.name}核心基础，掌握基础词汇和句型`,
    };
  } else if (phase <= 0.5) {
    return {
      title: `第${week}周 · 能力提升阶段`,
      goal: `扩展词汇量，提升听说能力，强化语法应用`,
    };
  } else if (phase <= 0.75) {
    return {
      title: `第${week}周 · 强化训练阶段`,
      goal: `高强度训练，攻克难点，提升综合应用能力`,
    };
  } else {
    return {
      title: `第${week}周 · 冲刺突破阶段`,
      goal: `模拟实战，查漏补缺，冲刺${goal.name}目标`,
    };
  }
};

// 主函数：生成个性化学习计划
export const generateLearningPlan = (
  assessment: AssessmentResult,
  goal: LearningGoal,
  selectedInterests: InterestType[]
): LearningPlan => {
  const currentLevel = {
    vocabulary: assessment.vocabularyLevel,
    listening: assessment.listeningLevel,
    speaking: assessment.speakingLevel,
  };

  const targetLevel = {
    vocabulary: Math.max(1, Math.min(10, Math.ceil(goal.targetVocab / 1000))) as SkillLevel,
    listening: goal.targetListeningLevel,
    speaking: goal.targetSpeakingLevel,
  };

  // 根据当前水平与目标的差距调整周数
  const maxGap = Math.max(
    targetLevel.vocabulary - currentLevel.vocabulary,
    targetLevel.listening - currentLevel.listening,
    targetLevel.speaking - currentLevel.speaking
  );
  const adjustedWeeks = adjustWeeksByLevel(goal.estimatedWeeks, 0, maxGap);

  // 根据兴趣数量微调每日时间（兴趣越多内容越丰富）
  const dailyTargetMinutes = 30 + Math.min(selectedInterests.length, 4) * 5;

  // 选择优先兴趣话题
  const interestTopics = selectInterestTopics(selectedInterests, 4);

  // 生成每周计划
  const weeklyPlans: WeeklyPlan[] = [];
  for (let week = 1; week <= adjustedWeeks; week++) {
    const { title, goal: weekGoal } = getWeekGoal(week, adjustedWeeks, goal);
    const tasks = generateWeekTasks(
      week,
      adjustedWeeks,
      goal,
      currentLevel,
      targetLevel,
      interestTopics
    );

    weeklyPlans.push({
      week,
      title,
      goal: weekGoal,
      tasks,
      targetMinutes: dailyTargetMinutes * 7,
    });
  }

  return {
    id: `plan-${Date.now()}`,
    userId: '',
    goal: goal.type,
    interests: selectedInterests,
    basedOnAssessment: assessment,
    currentLevel,
    targetLevel,
    weeklyPlans,
    totalWeeks: adjustedWeeks,
    dailyTargetMinutes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
