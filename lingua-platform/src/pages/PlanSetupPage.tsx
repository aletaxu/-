import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { learningGoals, interests } from '../data/learningGoals';
import { generateLearningPlan } from '../data/planGenerator';
import { storage } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import type { GoalType, InterestType, AssessmentResult, LearningGoal } from '../types';

export const PlanSetupPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<'goal' | 'interests'>('goal');
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>([]);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = storage.getAssessment();
    if (saved) {
      setAssessment(saved);
    }
  }, []);

  const toggleInterest = (type: InterestType) => {
    setSelectedInterests(prev =>
      prev.includes(type)
        ? prev.filter(i => i !== type)
        : prev.length < 5 ? [...prev, type] : prev
    );
  };

  const handleGeneratePlan = () => {
    if (!selectedGoal || !assessment) return;
    setIsGenerating(true);

    const goal: LearningGoal = learningGoals.find(g => g.type === selectedGoal)!;
    const plan = generateLearningPlan(assessment, goal, selectedInterests);
    plan.userId = user?.id || '';
    storage.setLearningPlan(plan);

    setTimeout(() => {
      navigate('/learning-plan');
    }, 1500);
  };

  // ============ 第一步：选择学习目标 ============
  if (step === 'goal') {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
            <Target className="w-4 h-4" />
            <span>第一步 · 选择学习目标</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">你的学习目标是什么？</h1>
          <p className="text-gray-500">选择一个目标，我们将根据你的能力水平制定专属学习计划</p>
        </div>

        {/* 测评结果摘要 */}
        {assessment && (
          <div className="card-gradient p-6 bg-gradient-to-r from-primary-50 to-accent-50">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-800">你的当前水平</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">词汇量</p>
                <p className="font-display text-2xl font-bold text-primary-600">{assessment.estimatedVocabSize.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">词汇等级</p>
                <p className="font-display text-2xl font-bold text-gray-800">{assessment.vocabularyLevel}/10</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">听力等级</p>
                <p className="font-display text-2xl font-bold text-gray-800">{assessment.listeningLevel}/10</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">口语等级</p>
                <p className="font-display text-2xl font-bold text-gray-800">{assessment.speakingLevel}/10</p>
              </div>
            </div>
          </div>
        )}

        {/* 目标选择 */}
        <div className="grid grid-cols-3 gap-4">
          {learningGoals.map(goal => (
            <button
              key={goal.type}
              onClick={() => setSelectedGoal(goal.type)}
              className={`card-gradient p-6 text-left transition-all ${
                selectedGoal === goal.type
                  ? 'border-2 border-primary-500 bg-primary-50 scale-[1.02]'
                  : 'border-2 border-transparent hover:border-primary-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center text-2xl">
                  {goal.icon}
                </div>
                {selectedGoal === goal.type && (
                  <CheckCircle2 className="w-6 h-6 text-primary-500" />
                )}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{goal.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{goal.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  约{goal.estimatedWeeks}周
                </span>
                <span>目标词汇 {goal.targetVocab.toLocaleString()}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => navigate('/assessment')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>重新测试</span>
          </button>
          <button
            onClick={() => setStep('interests')}
            disabled={!selectedGoal}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
              selectedGoal
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>下一步：选择兴趣</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ============ 第二步：选择兴趣偏好 ============
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full text-accent-600 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>第二步 · 选择兴趣偏好</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">你感兴趣的话题有哪些？</h1>
        <p className="text-gray-500">选择你感兴趣的话题（最多5个），学习内容将围绕这些话题展开</p>
      </div>

      {/* 已选数量 */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-600 text-sm font-medium">
          已选择 {selectedInterests.length} / 5 个兴趣
        </span>
      </div>

      {/* 兴趣选择 */}
      <div className="grid grid-cols-4 gap-4">
        {interests.map(interest => {
          const isSelected = selectedInterests.includes(interest.type);
          const isMax = selectedInterests.length >= 5 && !isSelected;
          return (
            <button
              key={interest.type}
              onClick={() => toggleInterest(interest.type)}
              disabled={isMax}
              className={`card-gradient p-6 text-center transition-all ${
                isSelected
                  ? 'border-2 border-accent-500 bg-accent-50 scale-[1.02]'
                  : isMax
                  ? 'border-2 border-transparent opacity-50 cursor-not-allowed'
                  : 'border-2 border-transparent hover:border-accent-200'
              }`}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent-100 to-primary-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
                {interest.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{interest.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{interest.description}</p>
              <p className="text-xs text-gray-400">{interest.relatedVocab} 相关词汇</p>
            </button>
          );
        })}
      </div>

      {/* 已选兴趣展示 */}
      {selectedInterests.length > 0 && (
        <div className="card-gradient p-6">
          <h3 className="font-semibold text-gray-800 mb-4">已选话题</h3>
          <div className="flex flex-wrap gap-3">
            {selectedInterests.map(type => {
              const interest = interests.find(i => i.type === type)!;
              return (
                <span
                  key={type}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-100 to-primary-100 rounded-full text-gray-700"
                >
                  <span>{interest.icon}</span>
                  <span className="font-medium">{interest.name}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setStep('goal')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>上一步</span>
        </button>
        <button
          onClick={handleGeneratePlan}
          disabled={isGenerating}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-70"
        >
          {isGenerating ? (
            <>
              <span>正在生成计划...</span>
            </>
          ) : (
            <>
              <span>生成学习计划</span>
              <Sparkles className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
