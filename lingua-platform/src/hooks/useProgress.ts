import { useState, useEffect } from 'react';
import type { LearningProgress } from '../types';

export const useProgress = () => {
  const [progress, setProgress] = useState<LearningProgress[]>([]);

  useEffect(() => {
    const storedProgress = localStorage.getItem('langlearn_progress');
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }
  }, []);

  const saveProgress = (newProgress: LearningProgress) => {
    const existingIndex = progress.findIndex(
      p => p.courseId === newProgress.courseId && p.moduleId === newProgress.moduleId
    );

    let updatedProgress: LearningProgress[];
    if (existingIndex >= 0) {
      updatedProgress = [...progress];
      updatedProgress[existingIndex] = newProgress;
    } else {
      updatedProgress = [...progress, newProgress];
    }

    setProgress(updatedProgress);
    localStorage.setItem('langlearn_progress', JSON.stringify(updatedProgress));
  };

  const getModuleProgress = (courseId: string, moduleId: string): LearningProgress | undefined => {
    return progress.find(
      p => p.courseId === courseId && p.moduleId === moduleId
    );
  };

  const getCourseProgress = (courseId: string): number => {
    const courseProgress = progress.filter(p => p.courseId === courseId);
    if (courseProgress.length === 0) return 0;
    
    const completedCount = courseProgress.filter(p => p.completed).length;
    return Math.round((completedCount / 4) * 100);
  };

  const getTotalStats = () => {
    const completedModules = progress.filter(p => p.completed);
    const totalScore = completedModules.reduce((sum, p) => sum + p.score, 0);
    
    return {
      completedModules: completedModules.length,
      averageScore: completedModules.length > 0 ? Math.round(totalScore / completedModules.length) : 0,
      totalScore,
    };
  };

  return {
    progress,
    saveProgress,
    getModuleProgress,
    getCourseProgress,
    getTotalStats,
  };
};
