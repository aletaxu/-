import type { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'a1',
    name: '初学者',
    description: '完成你的第一节课',
    icon: '🌱',
    condition: { type: 'courses', target: 1 },
    unlocked: true,
    unlockedAt: '2024-01-15',
  },
  {
    id: 'a2',
    name: '坚持不懈',
    description: '连续学习7天',
    icon: '🔥',
    condition: { type: 'streak', target: 7 },
    unlocked: true,
    unlockedAt: '2024-01-22',
  },
  {
    id: 'a3',
    name: '词汇大师',
    description: '掌握100个单词',
    icon: '📚',
    condition: { type: 'words', target: 100 },
    unlocked: true,
    unlockedAt: '2024-02-10',
  },
  {
    id: 'a4',
    name: '学习狂人',
    description: '累计学习时间达到100小时',
    icon: '⏰',
    condition: { type: 'time', target: 6000 },
    unlocked: false,
  },
  {
    id: 'a5',
    name: '连胜达人',
    description: '连续学习30天',
    icon: '🌟',
    condition: { type: 'streak', target: 30 },
    unlocked: false,
  },
  {
    id: 'a6',
    name: '多语言者',
    description: '完成两种不同语言的课程',
    icon: '🌍',
    condition: { type: 'courses', target: 2 },
    unlocked: false,
  },
  {
    id: 'a7',
    name: '完美主义者',
    description: '完成一门课程的所有模块',
    icon: '🏆',
    condition: { type: 'courses', target: 1 },
    unlocked: false,
  },
  {
    id: 'a8',
    name: '词汇王者',
    description: '掌握500个单词',
    icon: '👑',
    condition: { type: 'words', target: 500 },
    unlocked: false,
  },
];

export const checkAchievements = (userStats: {
  streakDays: number;
  completedCourses: number;
  masteredWords: number;
  totalLearningTime: number;
}): Achievement[] => {
  const unlockedAchievements: Achievement[] = [];
  
  achievements.forEach(achievement => {
    if (!achievement.unlocked) {
      let unlocked = false;
      
      switch (achievement.condition.type) {
        case 'streak':
          unlocked = userStats.streakDays >= achievement.condition.target;
          break;
        case 'courses':
          unlocked = userStats.completedCourses >= achievement.condition.target;
          break;
        case 'words':
          unlocked = userStats.masteredWords >= achievement.condition.target;
          break;
        case 'time':
          unlocked = userStats.totalLearningTime >= achievement.condition.target;
          break;
      }
      
      if (unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString().split('T')[0];
        unlockedAchievements.push(achievement);
      }
    }
  });
  
  return unlockedAchievements;
};
