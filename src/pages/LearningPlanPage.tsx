import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Target,
  Clock,
  BookOpen,
  Headphones,
  Mic,
  MessageSquare,
  TrendingUp,
  Sparkles,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { getGoalByType, getInterestByType } from '../data/learningGoals';
import type { LearningPlan, ModuleType, InterestType } from '../types';

const moduleIcons: Record<ModuleType, typeof BookOpen> = {
  vocabulary: BookOpen,
  listening: Headphones,
  speaking: Mic,
  grammar: MessageSquare,
  reading: BookOpen,
};

const moduleColors: Record<ModuleType, string> = {
  vocabulary: 'bg-primary-100 text-primary-600',
  listening: 'bg-accent-100 text-accent-600',
  speaking: 'bg-success-100 text-success-600',
  grammar: 'bg-warning-100 text-warning-600',
  reading: 'bg-purple-100 text-purple-600',
};

export const LearningPlanPage = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    const saved = storage.getLearningPlan();
    if (saved) {
      setPlan(saved);
    }
  }, []);

  if (!plan) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Target className="w-10 h-10 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">还没有学习计划</h2>
        <p className="text-gray-500 mb-8">先完成能力测评，然后设置学习目标和兴趣偏好，我们将为你生成专属学习计划</p>
        <button
          onClick={() => navigate('/assessment')}
          className="btn-primary inline-flex items-center gap-2"
        >
          <span>开始能力测评</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const goal = getGoalByType(plan.goal);
  const currentWeekPlan = plan.weeklyPlans.find(w => w.week === selectedWeek) || plan.weeklyPlans[0];

  // 计算能力提升进度
  const vocabProgress = Math.round(
    ((plan.basedOnAssessment.vocabularyLevel - 1) / (plan.targetLevel.vocabulary - 1)) * 100
  );
  const listenProgress = Math.round(
    ((plan.basedOnAssessment.listeningLevel - 1) / (plan.targetLevel.listening - 1)) * 100
  );
  const speakProgress = Math.round(
    ((plan.basedOnAssessment.speakingLevel - 1) / (plan.targetLevel.speaking - 1)) * 100
  );

  return (
    <div className="space-y-8">
      {/* 头部 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
            <span className="text-white/80 font-medium">你的个性化学习计划</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-4">
            {goal?.icon} {goal?.name} 学习计划
          </h1>
          <div className="flex flex-wrap gap-6 text-white/90">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{plan.totalWeeks} 周计划</span>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>每天 {plan.dailyTargetMinutes} 分钟</span>
            </span>
            <span className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span>目标词汇 {goal?.targetVocab.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </section>

      {/* 能力提升路径 */}
      <section className="card-gradient p-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-800">能力提升路径</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { name: '词汇能力', current: plan.basedOnAssessment.vocabularyLevel, target: plan.targetLevel.vocabulary, progress: vocabProgress, color: 'from-primary-500 to-primary-600', icon: BookOpen },
            { name: '听力能力', current: plan.basedOnAssessment.listeningLevel, target: plan.targetLevel.listening, progress: listenProgress, color: 'from-accent-400 to-accent-500', icon: Headphones },
            { name: '口语能力', current: plan.basedOnAssessment.speakingLevel, target: plan.targetLevel.speaking, progress: speakProgress, color: 'from-success-400 to-success-500', icon: Mic },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <p className="font-semibold text-gray-800 mb-2">{item.name}</p>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl font-bold text-gray-800">{item.current}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="text-2xl font-bold text-primary-600">{item.target}</span>
                <span className="text-sm text-gray-400">/10</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                  style={{ width: `${Math.min(100, item.progress)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">当前进度 {Math.min(100, item.progress)}%</p>
            </div>
          ))}
        </div>
      </section>

      {/* 兴趣话题 */}
      {plan.interests.length > 0 && (
        <section className="card-gradient p-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-accent-600" />
            <h2 className="text-xl font-bold text-gray-800">学习话题偏好</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {plan.interests.map((type: InterestType) => {
              const interest = getInterestByType(type);
              if (!interest) return null;
              return (
                <span
                  key={type}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200 rounded-full"
                >
                  <span className="text-lg">{interest.icon}</span>
                  <span className="font-medium text-gray-700">{interest.name}</span>
                  <span className="text-xs text-gray-400">{interest.relatedVocab}词</span>
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* 周计划选择器 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">学习计划详情</h2>
            <p className="text-gray-500 mt-1">共 {plan.totalWeeks} 周计划，点击查看每周详情</p>
          </div>
          <button
            onClick={() => navigate('/plan-setup')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>重新生成</span>
          </button>
        </div>

        {/* 周选择器 */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {plan.weeklyPlans.map(weekPlan => (
            <button
              key={weekPlan.week}
              onClick={() => setSelectedWeek(weekPlan.week)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium transition-all ${
                selectedWeek === weekPlan.week
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              <span className="block text-xs opacity-80">第{weekPlan.week}周</span>
              <span className="block text-sm">
                {weekPlan.week <= plan.totalWeeks * 0.25 ? '基础' :
                 weekPlan.week <= plan.totalWeeks * 0.5 ? '提升' :
                 weekPlan.week <= plan.totalWeeks * 0.75 ? '强化' : '冲刺'}
              </span>
            </button>
          ))}
        </div>

        {/* 当前周详情 */}
        <div className="card-gradient p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentWeekPlan.title}</h3>
            <p className="text-gray-500">{currentWeekPlan.goal}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-primary-50 rounded-xl">
              <p className="text-sm text-gray-500">本周学习目标</p>
              <p className="font-display text-2xl font-bold text-primary-600">{currentWeekPlan.targetMinutes} 分钟</p>
            </div>
            <div className="p-4 bg-accent-50 rounded-xl">
              <p className="text-sm text-gray-500">每日学习任务</p>
              <p className="font-display text-2xl font-bold text-accent-600">{currentWeekPlan.tasks.length} 项</p>
            </div>
          </div>

          {/* 任务列表 */}
          <div className="space-y-3">
            {currentWeekPlan.tasks.map(task => {
              const Icon = moduleIcons[task.type];
              const colorClass = moduleColors[task.type];
              const interestInfo = task.interestTag ? getInterestByType(task.interestTag) : null;
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-primary-200 transition-colors"
                >
                  <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{task.title}</h4>
                      {interestInfo && (
                        <span className="text-sm">{interestInfo.icon}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.estimatedMinutes}分钟
                      </span>
                      <span>难度 {task.difficulty}/10</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/courses')}
                    className="flex-shrink-0 px-4 py-2 rounded-lg bg-primary-100 text-primary-600 text-sm font-medium hover:bg-primary-200 transition-colors"
                  >
                    开始
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 计划总结 */}
      <section className="grid grid-cols-4 gap-4">
        <div className="card-gradient p-6 text-center">
          <p className="text-3xl font-bold text-primary-600 mb-1">{plan.totalWeeks}</p>
          <p className="text-sm text-gray-500">总周数</p>
        </div>
        <div className="card-gradient p-6 text-center">
          <p className="text-3xl font-bold text-accent-600 mb-1">{plan.dailyTargetMinutes}</p>
          <p className="text-sm text-gray-500">每日分钟</p>
        </div>
        <div className="card-gradient p-6 text-center">
          <p className="text-3xl font-bold text-success-600 mb-1">{plan.interests.length}</p>
          <p className="text-sm text-gray-500">兴趣话题</p>
        </div>
        <div className="card-gradient p-6 text-center">
          <p className="text-3xl font-bold text-warning-600 mb-1">{plan.totalWeeks * 4}</p>
          <p className="text-sm text-gray-500">总任务数</p>
        </div>
      </section>
    </div>
  );
};
