const AUTH_TOKEN_KEY = 'langlearn_auth_token';
const USER_KEY = 'langlearn_user';
const PROGRESS_KEY = 'langlearn_progress';
const DAILY_CHECKIN_KEY = 'langlearn_daily_checkin';
const ASSESSMENT_KEY = 'langlearn_assessment';
const LEARNING_PLAN_KEY = 'langlearn_learning_plan';
const REWARDS_KEY = 'langlearn_rewards';

export const storage = {
  setToken: (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  setUser: (user: any) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): any | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  setProgress: (progress: any) => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  },

  getProgress: (): any | null => {
    const progress = localStorage.getItem(PROGRESS_KEY);
    return progress ? JSON.parse(progress) : null;
  },

  setDailyCheckin: (date: string) => {
    localStorage.setItem(DAILY_CHECKIN_KEY, date);
  },

  getDailyCheckin: (): string | null => {
    return localStorage.getItem(DAILY_CHECKIN_KEY);
  },

  // 能力测试结果存储
  setAssessment: (assessment: any) => {
    localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(assessment));
  },

  getAssessment: (): any | null => {
    const data = localStorage.getItem(ASSESSMENT_KEY);
    return data ? JSON.parse(data) : null;
  },

  removeAssessment: () => {
    localStorage.removeItem(ASSESSMENT_KEY);
  },

  // 学习计划存储
  setLearningPlan: (plan: any) => {
    localStorage.setItem(LEARNING_PLAN_KEY, JSON.stringify(plan));
  },

  getLearningPlan: (): any | null => {
    const data = localStorage.getItem(LEARNING_PLAN_KEY);
    return data ? JSON.parse(data) : null;
  },

  removeLearningPlan: () => {
    localStorage.removeItem(LEARNING_PLAN_KEY);
  },

  // 奖励系统存储
  setRewards: (rewards: any) => {
    localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
  },

  getRewards: (): any | null => {
    const data = localStorage.getItem(REWARDS_KEY);
    return data ? JSON.parse(data) : null;
  },

  removeRewards: () => {
    localStorage.removeItem(REWARDS_KEY);
  },

  clear: () => {
    localStorage.clear();
  },
};

export const isTodayCheckedIn = (): boolean => {
  const lastCheckin = storage.getDailyCheckin();
  const today = new Date().toISOString().split('T')[0];
  return lastCheckin === today;
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}小时${mins}分钟`;
  }
  return `${mins}分钟`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
