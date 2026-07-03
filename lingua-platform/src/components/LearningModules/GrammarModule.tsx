import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, BookOpen } from 'lucide-react';
import type { Course, CourseModule } from '../../types';
import { grammarQuestions } from '../../data/courses';
import { useProgress } from '../../hooks/useProgress';
import { useRewards } from '../../hooks/useRewards';
import { RewardToast } from '../RewardToast';

interface GrammarModuleProps {
  course: Course;
  module: CourseModule;
}

export const GrammarModule = ({ course, module }: GrammarModuleProps) => {
  const { saveProgress } = useProgress();
  const { addReward, lastReward } = useRewards();
  const questions = grammarQuestions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: { selected: number; correct: boolean } }>({});

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(answers).length === questions.length) {
        const finalScore = Math.round((score / questions.length) * 100);
        setShowResult(true);
        saveProgress({
          userId: '1',
          courseId: course.id,
          moduleId: module.id,
          completed: true,
          score: finalScore,
          completedAt: new Date().toISOString(),
        });
        // 发放学习奖励
        addReward('grammar', finalScore, course.id, module.id);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [answers, questions.length, score, saveProgress, course.id, module.id, addReward]);

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    const isCorrect = index === currentQuestion.correctAnswer;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { selected: index, correct: isCorrect }
    }));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-16">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
          percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
        }`}>
          <span className="text-white text-4xl font-bold">{percentage}%</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">语法练习完成!</h2>
        <p className="text-gray-500 mb-8">
          你答对了 {score} / {questions.length} 道题目
        </p>
        <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
          {questions.map(q => (
            <div
              key={q.id}
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                answers[q.id]?.correct ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {answers[q.id]?.correct ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{module.title}</h2>
          <p className="text-gray-500">巩固语法知识，提升语言准确性</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            题目 {currentIndex + 1} / {questions.length}
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="card-gradient p-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">选择题</h3>
            <p className="text-gray-600 text-lg">{currentQuestion.question}</p>
          </div>
        </div>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            let optionClass = 'bg-white border-2 border-gray-200 hover:border-primary-300';
            
            if (showFeedback) {
              if (index === currentQuestion.correctAnswer) {
                optionClass = 'bg-green-100 border-2 border-green-500';
              } else if (selectedAnswer === index && index !== currentQuestion.correctAnswer) {
                optionClass = 'bg-red-100 border-2 border-red-500';
              }
            } else if (selectedAnswer === index) {
              optionClass = 'bg-primary-100 border-2 border-primary-500';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${optionClass}`}
              >
                <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-gray-800">{option}</span>
                {showFeedback && index === currentQuestion.correctAnswer && (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                )}
                {showFeedback && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`mt-6 p-4 rounded-xl ${
            selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <p className={`font-semibold mb-2 ${
              selectedAnswer === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'
            }`}>
              {selectedAnswer === currentQuestion.correctAnswer ? '回答正确!' : '回答错误'}
            </p>
            <p className="text-gray-600">
              <strong>解析：</strong>{currentQuestion.explanation}
            </p>
          </div>
        )}

        {showFeedback && (
          <button
            onClick={handleNext}
            className="mt-6 w-full btn-primary flex items-center justify-center gap-2"
          >
            <span>{currentIndex < questions.length - 1 ? '下一题' : '查看结果'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setSelectedAnswer(answers[questions[index].id]?.selected ?? null);
              setShowFeedback(answers[questions[index].id] !== undefined);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary-500 scale-125'
                : answers[questions[index].id]
                ? answers[questions[index].id].correct ? 'bg-green-500' : 'bg-red-500'
                : 'bg-gray-300'
            }`}
          ></button>
        ))}
      </div>

      {/* 学习奖励弹窗 */}
      <RewardToast reward={lastReward} />
    </div>
  );
};
