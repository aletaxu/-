import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { REWARD_CONFIG } from '../types';
import type { UserRewards, RewardRecord, RewardModuleType } from '../types';

// 初始奖励数据
const createInitialRewards = (): UserRewards => ({
  points: 0,
  coins: 0,
  exp: 0,
  level: 1,
  streakDays: 0,
  lastLearnDate: '',
  totalLearnCount: 0,
  records: [],
});

// 根据经验值计算等级
// 等级公式：升到下一级需要的经验 = level * 100
// 累计经验阈值：1->2 需要 100, 2->3 需要 300, 3->4 需要 600...
export const calculateLevel = (exp: number): number => {
  let level = 1;
  let needed = 100;
  let remaining = exp;
  while (remaining >= needed) {
    remaining -= needed;
    level++;
    needed = level * 100;
  }
  return level;
};

// 获取当前等级进度（0-100%）
export const getLevelProgress = (rewards: UserRewards): { current: number; needed: number; percent: number } => {
  let level = 1;
  let needed = 100;
  let remaining = rewards.exp;
  while (remaining >= needed) {
    remaining -= needed;
    level++;
    needed = level * 100;
  }
  return {
    current: remaining,
    needed,
    percent: Math.round((remaining / needed) * 100),
  };
};

// 计算连续学习天数
const calculateStreak = (lastLearnDate: string): number => {
  const today = new Date().toISOString().split('T')[0];
  if (!lastLearnDate) return 1;
  if (lastLearnDate === today) {
    // 今天已经学过，保持原连续天数（由调用方传入）
    return -1; // 特殊标记，表示今天已学习
  }
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (lastLearnDate === yesterday) {
    return -2; // 特殊标记，表示昨天学过，连续+1
  }
  // 超过一天没学，重置为1
  return 1;
};

export const useRewards = () => {
  const [rewards, setRewards] = useState<UserRewards>(createInitialRewards);
  const [lastReward, setLastReward] = useState<RewardRecord | null>(null);

  // 加载存储的奖励数据
  useEffect(() => {
    const stored = storage.getRewards();
    if (stored) {
      setRewards(stored);
    }
  }, []);

  // 持久化
  const persist = (data: UserRewards) => {
    storage.setRewards(data);
    setRewards(data);
  };

  /**
   * 发放奖励 —— 任何学习模块完成时调用
   * @param module 学习模块类型
   * @param score 本次得分（0-100），影响奖励倍率
   * @param courseId 课程ID（可选）
   * @param moduleId 模块ID（可选，用于去重：同一模块同一天只奖励一次）
   * @returns 本次获得的奖励记录
   */
  const addReward = useCallback((
    module: RewardModuleType,
    score: number = 80,
    courseId?: string,
    moduleId?: string,
  ): RewardRecord | null => {
    const config = REWARD_CONFIG[module];
    if (!config) return null;

    const today = new Date().toISOString().split('T')[0];

    // 去重：同一模块同一天只奖励一次
    if (moduleId) {
      const alreadyRewarded = rewards.records.some(
        r => r.moduleId === moduleId && r.createdAt.startsWith(today)
      );
      if (alreadyRewarded) return null;
    }

    // 得分影响奖励倍率：60分以下1倍，60-80分1.2倍，80以上1.5倍
    let multiplier = 1;
    if (score >= 80) multiplier = 1.5;
    else if (score >= 60) multiplier = 1.2;

    const points = Math.round(config.points * multiplier);
    const coins = Math.round(config.coins * multiplier);
    const exp = Math.round(config.exp * multiplier);

    // 计算连续学习天数
    let newStreak = rewards.streakDays;
    const streakFlag = calculateStreak(rewards.lastLearnDate);
    if (streakFlag === -1) {
      // 今天已学过，保持不变
    } else if (streakFlag === -2) {
      newStreak = rewards.streakDays + 1;
    } else {
      newStreak = streakFlag;
    }

    const record: RewardRecord = {
      id: `reward-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      module,
      courseId,
      moduleId,
      points,
      coins,
      exp,
      score,
      createdAt: new Date().toISOString(),
    };

    const newRewards: UserRewards = {
      points: rewards.points + points,
      coins: rewards.coins + coins,
      exp: rewards.exp + exp,
      level: calculateLevel(rewards.exp + exp),
      streakDays: newStreak,
      lastLearnDate: today,
      totalLearnCount: rewards.totalLearnCount + 1,
      records: [record, ...rewards.records].slice(0, 50), // 保留最近50条
    };

    persist(newRewards);
    setLastReward(record);
    return record;
  }, [rewards]);

  // 清空奖励（重置）
  const resetRewards = useCallback(() => {
    persist(createInitialRewards());
    setLastReward(null);
  }, []);

  return {
    rewards,
    lastReward,
    addReward,
    resetRewards,
  };
};
