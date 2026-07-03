import { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle2, XCircle, ArrowRight, Headphones } from 'lucide-react';
import type { Course, CourseModule } from '../../types';
import { listeningExercises } from '../../data/courses';
import { useProgress } from '../../hooks/useProgress';
import { useRewards } from '../../hooks/useRewards';
import { RewardToast } from '../RewardToast';

interface ListeningModuleProps {
  course: Course;
  module: CourseModule;
}

export const ListeningModule = ({ course, module }: ListeningModuleProps) => {
  const { saveProgress } = useProgress();
  const { addReward, lastReward } = useRewards();
  const exercises = listeningExercises;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: { selected: number; correct: boolean } }>({});

  const currentExercise = exercises[currentIndex];
  const currentQuestion = currentExercise.questions[currentQuestionIndex];

  useEffect(() => {
    const totalQuestions = exercises.reduce((sum, ex) => sum + ex.questions.length, 0);
    if (Object.keys(answers).length === totalQuestions) {
      const finalScore = Math.round((score / totalQuestions) * 100);
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
      addReward('listening', finalScore, course.id, module.id);
    }
  }, [answers, exercises, score, saveProgress, course.id, module.id, addReward]);

  useEffect(() => {
    return () => {
      setIsPlaying(false);
    };
  }, []);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    setTimeout(() => setIsPlaying(false), 5000);
  };

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    const isCorrect = index === currentQuestion.correctAnswer;
    const questionId = `${currentExercise.id}-${currentQuestion.id}`;
    setAnswers(prev => ({
      ...prev,
      [questionId]: { selected: index, correct: isCorrect }
    }));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentExercise.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const getTotalQuestions = () => {
    return exercises.reduce((sum, ex) => sum + ex.questions.length, 0);
  };

  const getCompletedQuestions = () => {
    return Object.keys(answers).length;
  };

  if (showResult) {
    const percentage = Math.round((score / getTotalQuestions()) * 100);
    return (
      <div className="text-center py-16">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
          percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
        }`}>
          <span className="text-white text-4xl font-bold">{percentage}%</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">听力训练完成!</h2>
        <p className="text-gray-500 mb-8">
          你答对了 {score} / {getTotalQuestions()} 道题目
        </p>
        <div className="grid grid-cols-6 gap-4 max-w-2xl mx-auto">
          {exercises.flatMap(ex => ex.questions.map(q => {
            const questionId = `${ex.id}-${q.id}`;
            return (
              <div
                key={questionId}
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  answers[questionId]?.correct ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {answers[questionId]?.correct ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
            );
          }))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{module.title}</h2>
          <p className="text-gray-500">提升听力理解能力</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {getCompletedQuestions() + 1} / {getTotalQuestions()}
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${((getCompletedQuestions() + 1) / getTotalQuestions()) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="card-gradient p-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Headphones className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">听力理解</h3>
            <p className="text-gray-600">先听音频，然后回答问题</p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800">{currentExercise.title}</h4>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {showTranscript ? '隐藏文本' : '显示文本'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePlay}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isPlaying ? '播放中...' : '播放音频'}
            </button>
          </div>

          {showTranscript && (
            <div className="mt-6 p-4 bg-white rounded-xl">
              <p className="text-gray-700 leading-relaxed">{currentExercise.transcript}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            问题 {currentQuestionIndex + 1} / {currentExercise.questions.length}
          </p>
          <h4 className="text-lg font-semibold text-gray-800">{currentQuestion.question}</h4>
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
          <button
            onClick={handleNext}
            className="mt-6 w-full btn-primary flex items-center justify-center gap-2"
          >
            <span>{currentQuestionIndex < currentExercise.questions.length - 1 
              ? '下一题' 
              : currentIndex < exercises.length - 1 
                ? '下一个练习' 
                : '查看结果'
            }</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        {exercises.flatMap(ex => ex.questions.map(q => {
          const questionId = `${ex.id}-${q.id}`;
          const isCurrent = ex.id === currentExercise.id && q.id === currentQuestion.id;
          return (
            <button
              key={questionId}
              onClick={() => {
                const exIndex = exercises.findIndex(e => e.id === ex.id);
                const qIndex = ex.questions.findIndex(question => question.id === q.id);
                setCurrentIndex(exIndex);
                setCurrentQuestionIndex(qIndex);
                setSelectedAnswer(answers[questionId]?.selected ?? null);
                setShowFeedback(answers[questionId] !== undefined);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                isCurrent
                  ? 'bg-primary-500 scale-125'
                  : answers[questionId]
                  ? answers[questionId].correct ? 'bg-green-500' : 'bg-red-500'
                  : 'bg-gray-300'
              }`}
            ></button>
          );
        }))}
      </div>

      {/* 学习奖励弹窗 */}
      <RewardToast reward={lastReward} />
    </div>
  );
};
