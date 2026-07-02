import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, ArrowRight, MessageSquare } from 'lucide-react';
import type { Course, CourseModule, Language } from '../../types';
import { languageCodes } from '../../types';
import { speakingExercises } from '../../data/courses';
import { useProgress } from '../../hooks/useProgress';
import { useRewards } from '../../hooks/useRewards';
import { RewardToast } from '../RewardToast';

interface SpeakingModuleProps {
  course: Course;
  module: CourseModule;
}

export const SpeakingModule = ({ course, module }: SpeakingModuleProps) => {
  const { saveProgress } = useProgress();
  const { addReward, lastReward } = useRewards();
  const exercises = speakingExercises;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentExercise = exercises[currentIndex];

  useEffect(() => {
    if (Object.keys(answers).length === exercises.length) {
      const finalScore = Math.round((score / exercises.length) * 100);
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
      addReward('speaking', finalScore, course.id, module.id);
    }
  }, [answers, exercises.length, score, saveProgress, course.id, module.id, addReward]);

  useEffect(() => {
    let timer: number;
    if (isRecording) {
      timer = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = languageCodes[course.language as Language] || 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const similarity = calculateSimilarity(transcript.toLowerCase(), currentExercise.text.toLowerCase());
        const roundedScore = Math.round(similarity * 100);
        setCurrentScore(roundedScore);
        setScore(prev => prev + (roundedScore >= 60 ? 1 : 0));
        setAnswers(prev => ({ ...prev, [currentExercise.id]: roundedScore }));
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
    }
  }, [currentExercise.text, course.language]);

  const calculateSimilarity = (s1: string, s2: string): number => {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    return (longer.length - editDistance(longer, shorter)) / longer.length;
  };

  const editDistance = (s1: string, s2: string): number => {
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  const handleRecord = () => {
    if (!recognitionRef.current) {
      alert('您的浏览器不支持语音识别功能');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setCurrentScore(null);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentExercise.text);
      utterance.lang = languageCodes[course.language as Language] || 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentScore(null);
    }
  };

  if (showResult) {
    const percentage = Math.round((score / exercises.length) * 100);
    return (
      <div className="text-center py-16">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
          percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
        }`}>
          <span className="text-white text-4xl font-bold">{percentage}%</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">口语练习完成!</h2>
        <p className="text-gray-500 mb-8">
          你完成了 {score} / {exercises.length} 个练习
        </p>
        <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
          {exercises.map(exercise => (
            <div
              key={exercise.id}
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                (answers[exercise.id] || 0) >= 60 ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <span className="text-sm font-bold text-gray-600">{answers[exercise.id] || 0}</span>
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
          <p className="text-gray-500">练习口语表达，提升发音准确性</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {exercises.length}
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="card-gradient p-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">跟读练习</h3>
            <p className="text-gray-600">听示范发音，然后跟读</p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="mb-8">
            <p className="text-2xl font-semibold text-gray-800 mb-2">{currentExercise.text}</p>
            <button
              onClick={handleSpeak}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
              <span>听示范发音</span>
            </button>
          </div>

          <button
            onClick={handleRecord}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 animate-pulse'
                : 'bg-gradient-to-br from-primary-500 to-accent-500 hover:scale-105'
            } text-white shadow-lg`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">{recordingTime}s</span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">开始录音</span>
              </>
            )}
          </button>

          {currentScore !== null && (
            <div className="mt-8">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto ${
                currentScore >= 80 ? 'bg-green-500' : currentScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                <span className="text-white text-4xl font-bold">{currentScore}%</span>
              </div>
              <p className={`mt-4 font-semibold ${
                currentScore >= 80 ? 'text-green-600' : currentScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {currentScore >= 80 ? '发音很棒!' : currentScore >= 60 ? '继续加油!' : '再试一次吧'}
              </p>
            </div>
          )}

          {(answers[currentExercise.id] !== undefined || currentScore !== null) && (
            <button
              onClick={handleNext}
              className="mt-8 btn-primary flex items-center gap-2 mx-auto"
            >
              <span>{currentIndex < exercises.length - 1 ? '下一题' : '查看结果'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        {exercises.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setCurrentScore(answers[exercises[index].id] ?? null);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary-500 scale-125'
                : answers[exercises[index].id]
                ? (answers[exercises[index].id] || 0) >= 60 ? 'bg-green-500' : 'bg-red-500'
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
