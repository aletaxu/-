import { useState, useEffect } from 'react';
import { BookOpen, Clock, Flame, TrendingUp, Target, Zap, ChevronRight, Brain, Star, Coins, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CourseCard } from '../components/Cards/CourseCard';
import { StatCard } from '../components/Cards/StatCard';
import { courses, getWordsByLanguage } from '../data/courses';
import { achievements } from '../data/achievements';
import { storage } from '../utils/storage';
import { getGoalByType } from '../data/learningGoals';
import { useRewards, getLevelProgress } from '../hooks/useRewards';
import type { AssessmentResult, LearningPlan } from '../types';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rewards } = useRewards();
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [learningPlan, setLearningPlan] = useState<LearningPlan | null>(null);

  useEffect(() => {
    setAssessment(storage.getAssessment());
    setLearningPlan(storage.getLearningPlan());
  }, []);

  const levelProgress = getLevelProgress(rewards);

  const recentCourses = courses.slice(0, 6);
  const unlockedAchievements = achievements.filter(a => a.unlocked).slice(0, 4);
  const dailyWords = getWordsByLanguage(user?.preferredLanguage || 'english').slice(0, 3);
  const planGoal = learningPlan ? getGoalByType(learningPlan.goal) : null;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold text-white mb-4">
            开启你的语言学习之旅
          </h1>
          <p className="text-white/80 text-lg mb-6 max-w-2xl">
            沉浸式学习体验，支持英语、日语、韩语等多种语言，让学习变得更有趣、更高效。
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/courses')} className="btn-secondary">
              浏览课程
            </button>
            <button className="btn-outline text-white border-white hover:bg-white hover:text-primary-600">
              了解更多
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-6">
        <StatCard
          title="学习时长"
          value={user ? `${Math.floor(user.totalLearningTime / 60)}小时${user.totalLearningTime % 60}分钟` : '0小时'}
          icon={Clock}
          gradient="bg-gradient-to-br from-primary-500 to-primary-600"
          trend={{ value: 15, positive: true }}
        />
        <StatCard
          title="完成课程"
          value={user?.completedCourses || 0}
          icon={BookOpen}
          gradient="bg-gradient-to-br from-accent-400 to-accent-500"
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="掌握单词"
          value={user?.masteredWords || 0}
          icon={Target}
          gradient="bg-gradient-to-br from-success-400 to-success-500"
        />
        <StatCard
          title="连续学习"
          value={`${user?.streakDays || 0}天`}
          icon={Flame}
          gradient="bg-gradient-to-br from-warning-400 to-warning-500"
        />
      </section>

      {/* 奖励中心：等级 + 积分 + 金币 + 经验进度 */}
      <section className="card-gradient p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-gray-800">我的奖励</h3>
          <span className="text-xs text-gray-400 ml-auto">每次学习都有奖励</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* 等级 */}
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-lg">Lv{rewards.level}</span>
            </div>
            <div className="text-sm font-medium text-gray-700">当前等级</div>
            <div className="text-xs text-gray-400 mt-1">
              经验 {levelProgress.current}/{levelProgress.needed}
            </div>
            <div className="w-full h-1.5 bg-purple-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${levelProgress.percent}%` }}
              ></div>
            </div>
          </div>
          {/* 积分 */}
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
            <Star className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{rewards.points}</div>
            <div className="text-sm text-gray-600">学习积分</div>
          </div>
          {/* 金币 */}
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <Coins className="w-10 h-10 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{rewards.coins}</div>
            <div className="text-sm text-gray-600">金币</div>
          </div>
          {/* 学习次数 */}
          <div className="text-center p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-xl">
            <Zap className="w-10 h-10 text-success-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-success-600">{rewards.totalLearnCount}</div>
            <div className="text-sm text-gray-600">累计学习次数</div>
          </div>
        </div>
      </section>

      {/* 个性化学习路径推荐入口 */}
      <section className="grid grid-cols-2 gap-6">
        {/* 能力测评入口 */}
        <div className={`card-gradient p-6 ${assessment ? 'bg-gradient-to-r from-primary-50 to-accent-50' : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              assessment ? 'bg-primary-100' : 'bg-white/20'
            }`}>
              <Brain className={`w-7 h-7 ${assessment ? 'text-primary-600' : 'text-white'}`} />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg mb-1 ${assessment ? 'text-gray-800' : 'text-white'}`}>
                {assessment ? '已完成能力测评' : '语言能力测评'}
              </h3>
              <p className={`text-sm ${assessment ? 'text-gray-500' : 'text-white/80'}`}>
                {assessment
                  ? `词汇${assessment.vocabularyLevel}/10 · 听力${assessment.listeningLevel}/10 · 口语${assessment.speakingLevel}/10`
                  : '测试词汇量、听力、口语，精准评估能力等级'}
              </p>
            </div>
            <button
              onClick={() => navigate('/assessment')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                assessment
                  ? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                  : 'bg-white text-primary-600 hover:bg-white/90'
              }`}
            >
              {assessment ? '重新测试' : '开始测评'}
            </button>
          </div>
        </div>

        {/* 学习计划入口 */}
        <div className={`card-gradient p-6 ${learningPlan ? 'bg-gradient-to-r from-accent-50 to-warning-50' : 'bg-gradient-to-r from-accent-500 to-warning-400 text-white'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              learningPlan ? 'bg-accent-100' : 'bg-white/20'
            }`}>
              <Target className={`w-7 h-7 ${learningPlan ? 'text-accent-600' : 'text-white'}`} />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg mb-1 ${learningPlan ? 'text-gray-800' : 'text-white'}`}>
                {learningPlan ? `${planGoal?.icon} ${planGoal?.name} 计划` : '个性化学习计划'}
              </h3>
              <p className={`text-sm ${learningPlan ? 'text-gray-500' : 'text-white/80'}`}>
                {learningPlan
                  ? `共${learningPlan.totalWeeks}周 · 每天${learningPlan.dailyTargetMinutes}分钟 · ${learningPlan.interests.length}个兴趣话题`
                  : '根据测评结果和目标，生成专属学习路径'}
              </p>
            </div>
            <button
              onClick={() => navigate(learningPlan ? '/learning-plan' : '/plan-setup')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                learningPlan
                  ? 'bg-accent-100 text-accent-600 hover:bg-accent-200'
                  : 'bg-white text-accent-600 hover:bg-white/90'
              }`}
            >
              {learningPlan ? '查看计划' : '创建计划'}
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">继续学习</h2>
            <p className="text-gray-500 mt-1">接着上次的进度，继续你的学习之旅</p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700"
          >
            查看全部 <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {recentCourses.slice(0, 3).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-8">
        <section className="col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">每日单词</h2>
              <p className="text-gray-500 mt-1">每天学习新单词，日积月累</p>
            </div>
            <button className="flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700">
              更多单词 <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {dailyWords.map((word, index) => (
              <div
                key={word.id}
                className="card-gradient p-6 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center text-xl font-bold text-primary-600">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{word.word}</h3>
                    <p className="text-gray-500 text-sm">{word.pronunciation}</p>
                    <p className="text-gray-600">{word.meaning}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-2">例句</p>
                  <p className="text-sm text-gray-600 italic">{word.example}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">我的成就</h2>
              <p className="text-gray-500 mt-1">已解锁 {unlockedAchievements.length} 个成就</p>
            </div>
            <button
              onClick={() => navigate('/progress')}
              className="flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700"
            >
              查看全部 <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {unlockedAchievements.map(achievement => (
              <div
                key={achievement.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-2xl">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-accent-50 to-warning-50 border border-accent-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">今日目标</h4>
                <p className="text-sm text-gray-500">学习30分钟，掌握10个单词</p>
              </div>
              <button onClick={() => navigate('/courses')} className="btn-primary text-sm py-2 px-4">
                开始学习
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
