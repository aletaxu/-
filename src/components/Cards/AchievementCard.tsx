import type { Achievement } from '../../types';

interface AchievementCardProps {
  achievement: Achievement;
  showAnimation?: boolean;
}

export const AchievementCard = ({ achievement, showAnimation }: AchievementCardProps) => {
  return (
    <div
      className={`relative p-4 rounded-xl transition-all duration-300 ${
        achievement.unlocked
          ? 'bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200'
          : 'bg-gray-100 border-2 border-gray-200 opacity-60'
      } ${showAnimation && achievement.unlocked ? 'badge-unlock' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl ${
            achievement.unlocked
              ? 'bg-gradient-to-br from-primary-500 to-accent-500'
              : 'bg-gray-300'
          }`}
        >
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${
            achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
          }`}>
            {achievement.name}
          </h4>
          <p className={`text-sm ${
            achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {achievement.description}
          </p>
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-gray-400 mt-1">
              解锁于 {achievement.unlockedAt}
            </p>
          )}
        </div>
        {!achievement.unlocked && (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-sm">?</span>
          </div>
        )}
      </div>
    </div>
  );
};
