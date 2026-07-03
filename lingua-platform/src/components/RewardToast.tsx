import { useEffect, useState } from 'react';
import { Coins, Star, Zap, X, Trophy } from 'lucide-react';
import type { RewardRecord } from '../types';
import { REWARD_CONFIG } from '../types';

interface RewardToastProps {
  reward: RewardRecord | null;
  onClose?: () => void;
  autoCloseMs?: number;
}

/**
 * 奖励弹窗组件
 * 当学习模块完成获得奖励时弹出，展示获得的积分/金币/经验
 * 自动消失（默认 4 秒），也可手动关闭
 */
export const RewardToast = ({ reward, onClose, autoCloseMs = 4000 }: RewardToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reward) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [reward, autoCloseMs, onClose]);

  if (!reward || !visible) return null;

  const config = REWARD_CONFIG[reward.module];
  const label = config?.label || '学习完成';

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-yellow-300 overflow-hidden min-w-[320px]">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Trophy className="w-5 h-5" />
            <span className="font-bold text-lg">学习奖励</span>
          </div>
          <button
            onClick={() => { setVisible(false); onClose?.(); }}
            className="text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6">
          <p className="text-center text-gray-600 text-sm mb-4">
            恭喜完成「{label}」
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-yellow-50 rounded-xl">
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-yellow-600">+{reward.points}</div>
              <div className="text-xs text-gray-500">积分</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <Coins className="w-6 h-6 text-orange-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-orange-600">+{reward.coins}</div>
              <div className="text-xs text-gray-500">金币</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <Zap className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-purple-600">+{reward.exp}</div>
              <div className="text-xs text-gray-500">经验</div>
            </div>
          </div>
          {reward.score !== undefined && (
            <p className="text-center text-xs text-gray-400 mt-3">
              本次得分 {reward.score} 分
              {reward.score >= 80 ? ' · 表现出色，奖励 1.5 倍' : reward.score >= 60 ? ' · 奖励 1.2 倍' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
