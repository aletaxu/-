import { useState, useEffect, useMemo } from 'react';
import { Volume2, CheckCircle2, XCircle, Loader2, BookA, Quote, SplitSquareHorizontal, Tag, Lightbulb } from 'lucide-react';
import type { Course, CourseModule, Language } from '../../types';
import { languageCodes } from '../../types';
import { getWordsByLanguage } from '../../data/courses';
import { useProgress } from '../../hooks/useProgress';
import { useRewards } from '../../hooks/useRewards';
import { RewardToast } from '../RewardToast';
import { getWordDetail, type WordDetail } from '../../services/languageDataApi';
import { analyzeWordMorph } from '../../utils/wordMorph';

interface VocabularyModuleProps {
  course: Course;
  module: CourseModule;
}

export const VocabularyModule = ({ course, module }: VocabularyModuleProps) => {
  const { saveProgress } = useProgress();
  const { addReward, lastReward } = useRewards();
  const words = getWordsByLanguage(course.language);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredWords, setAnsweredWords] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});

  // API 增强数据：缓存每个单词的详细信息
  const [detailMap, setDetailMap] = useState<Map<string, WordDetail | null>>(new Map());
  const [loadingDetail, setLoadingDetail] = useState(false);

  const currentWord = words[currentIndex];
  const currentDetail = detailMap.get(currentWord.word.toLowerCase()) || null;

  // 翻到背面时按需拉取 API 详情（带缓存，二次打开不重复请求）
  useEffect(() => {
    if (!isFlipped) return;
    const key = currentWord.word.toLowerCase();
    if (detailMap.has(key)) return;

    let cancelled = false;
    setLoadingDetail(true);
    getWordDetail(currentWord.word, course.language as Language)
      .then(detail => {
        if (cancelled) return;
        setDetailMap(prev => {
          const next = new Map(prev);
          next.set(key, detail);
          return next;
        });
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });
    return () => { cancelled = true; };
  }, [isFlipped, currentWord.word, course.language, detailMap]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (answeredWords.size === words.length) {
        const finalScore = Math.round((score / words.length) * 100);
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
        addReward('vocabulary', finalScore, course.id, module.id);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [answeredWords, words.length, score, saveProgress, course.id, module.id, addReward]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    if (answeredWords.has(currentWord.id)) return;

    setAnsweredWords(prev => new Set([...prev, currentWord.id]));
    setAnswers(prev => ({ ...prev, [currentWord.id]: correct }));

    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      }
    }, 1000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = languageCodes[course.language as Language] || 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  // 播放 API 返回的真实音频（如果有），否则用 TTS
  const handlePlayExample = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageCodes[course.language as Language] || 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // 优先用 API 的真实音频 URL
  const handleSpeakWord = () => {
    if (currentDetail?.audioUrl) {
      try {
        const audio = new Audio(currentDetail.audioUrl);
        audio.play().catch(() => handleSpeak()); // 播放失败兜底 TTS
        return;
      } catch {
        // ignore
      }
    }
    handleSpeak();
  };

  if (showResult) {
    const percentage = Math.round((score / words.length) * 100);
    return (
      <div className="text-center py-16">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
          percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
        }`}>
          <span className="text-white text-4xl font-bold">{percentage}%</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">学习完成!</h2>
        <p className="text-gray-500 mb-8">
          你掌握了 {score} / {words.length} 个单词
        </p>
        <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
          {words.map(word => (
            <div
              key={word.id}
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                answers[word.id] ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {answers[word.id] ? (
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

  // 选取背面要展示的释义（API 释义 > 本地中文释义）
  const primaryDefinition = currentDetail?.meanings?.[0]?.definitions?.[0];
  const backMeaning = primaryDefinition
    ? primaryDefinition.definition
    : currentWord.meaning;
  // 选取例句：API 真实例句 > 词典自带例句 > 本地例句
  const backExample = currentDetail?.examples?.[0]?.text
    || primaryDefinition?.example
    || currentWord.example;
  const backExampleTranslation = currentDetail?.examples?.[0]?.translation;
  // 音标：API > 本地
  const backPhonetic = currentDetail?.phonetic || currentWord.pronunciation;

  // 词性列表（去重）：来自 API 的所有 meanings 的 partOfSpeech
  const partOfSpeechList = useMemo(() => {
    if (!currentDetail?.meanings) return [];
    const set = new Set<string>();
    currentDetail.meanings.forEach(m => {
      if (m.partOfSpeech) set.add(m.partOfSpeech);
    });
    return Array.from(set);
  }, [currentDetail]);

  // 多个释义（最多2个词性，每个取首条释义），用于展示更完整的用法
  const meaningEntries = useMemo(() => {
    if (!currentDetail?.meanings) return [];
    return currentDetail.meanings.slice(0, 2).map(m => ({
      pos: m.partOfSpeech || '',
      def: m.definitions?.[0]?.definition || '',
      example: m.definitions?.[0]?.example || '',
    })).filter(e => e.def);
  }, [currentDetail]);

  // 词缀分析（仅英语）
  const morphInfo = useMemo(() => {
    if (course.language !== 'english') return null;
    return analyzeWordMorph(currentWord.word);
  }, [currentWord.word, course.language]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{module.title}</h2>
          <p className="text-gray-500">学习新单词，提升词汇量</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {words.length}
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          className={`flip-card w-96 h-80 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className="flip-card-inner w-full h-full relative">
            <div className="flip-card-front absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex flex-col items-center justify-center text-white p-8">
              <button
                onClick={(e) => { e.stopPropagation(); handleSpeakWord(); }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 hover:bg-white/30 transition-colors"
              >
                <Volume2 className="w-8 h-8" />
              </button>
              <h3 className="text-4xl font-bold mb-2">{currentWord.word}</h3>
              <p className="text-white/80">{currentWord.pronunciation}</p>
              <p className="mt-4 text-sm text-white/60">点击卡片查看释义</p>
            </div>

            <div className="flip-card-back absolute inset-0 bg-white rounded-2xl flex flex-col p-5 border-2 border-primary-200 overflow-y-auto">
              {/* 顶部：单词 + 音标 + 发音 */}
              <div className="flex items-center gap-2 mb-2 shrink-0">
                <h4 className="text-2xl font-bold text-gray-800">{currentWord.word}</h4>
                {backPhonetic && (
                  <span className="text-xs text-gray-500">{backPhonetic}</span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleSpeakWord(); }}
                  className="text-primary-500 hover:text-primary-700"
                  title="听发音"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* 词性标签 */}
              {partOfSpeechList.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2 shrink-0">
                  {partOfSpeechList.map(pos => (
                    <span key={pos} className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-50 text-accent-700 rounded text-xs font-medium border border-accent-200">
                      <Tag className="w-2.5 h-2.5" />
                      {pos}
                    </span>
                  ))}
                </div>
              )}

              {/* 释义区：API 多释义 > 单条释义 */}
              {loadingDetail ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm my-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>正在从权威词典加载释义…</span>
                </div>
              ) : meaningEntries.length > 0 ? (
                <div className="space-y-2 mb-2 shrink-0">
                  {meaningEntries.map((entry, i) => (
                    <div key={i} className="p-2 bg-primary-50/50 rounded-lg">
                      {entry.pos && (
                        <span className="text-xs text-accent-600 font-medium mr-1">{entry.pos}.</span>
                      )}
                      <span className="text-sm text-gray-700">{entry.def}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-primary-600 font-medium mb-2 shrink-0">
                  {backMeaning}
                </p>
              )}

              {/* 词缀分析区：帮助理解构词、辅助记忆 */}
              {morphInfo && (
                <div className="w-full p-2 bg-amber-50 rounded-lg mb-2 shrink-0 border border-amber-200">
                  <div className="flex items-center gap-1 text-amber-700 text-xs mb-1 font-medium">
                    <SplitSquareHorizontal className="w-3 h-3" />
                    <span>词缀解析 · 助记</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-xs mb-1">
                    {morphInfo.prefix && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-mono">{morphInfo.prefix}-</span>
                    )}
                    {morphInfo.root && (
                      <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded font-mono">{morphInfo.root}</span>
                    )}
                    {morphInfo.suffix && (
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-mono">-{morphInfo.suffix}</span>
                    )}
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">{morphInfo.hint}</p>
                </div>
              )}

              {/* 例句区：来自 Tatoeba 的真实语境 */}
              {backExample && (
                <div className="w-full p-2 bg-gray-100 rounded-lg mb-2 shrink-0">
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    <Quote className="w-3 h-3" />
                    <span>例句{currentDetail?.examples?.[0] ? ' · 来自 Tatoeba' : ''}</span>
                  </div>
                  <p className="text-gray-700 italic text-sm mb-1">{backExample}</p>
                  {backExampleTranslation && (
                    <p className="text-gray-500 text-xs">{backExampleTranslation}</p>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePlayExample(backExample); }}
                    className="mt-1 text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>播放例句</span>
                  </button>
                </div>
              )}

              {/* 同义词区：来自 Datamuse */}
              {!loadingDetail && currentDetail && currentDetail.synonyms.length > 0 && (
                <div className="w-full mt-1 shrink-0">
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    <BookA className="w-3 h-3" />
                    <span>同义词 · 来自 Datamuse</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentDetail.synonyms.slice(0, 5).map(syn => (
                      <span key={syn} className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-xs">
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleAnswer(true)}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>记住了</span>
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
            <span>还需复习</span>
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        {words.map((word, index) => (
          <button
            key={word.id}
            onClick={() => {
              setCurrentIndex(index);
              setIsFlipped(false);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary-500 scale-125'
                : answeredWords.has(word.id)
                ? answers[word.id] ? 'bg-green-500' : 'bg-red-500'
                : 'bg-gray-300'
            }`}
          ></button>
        ))}
      </div>

      <div className="flex items-center gap-2 p-4 bg-warning-50 rounded-xl">
        <Lightbulb className="w-5 h-5 text-warning-600" />
        <p className="text-warning-700 text-sm">
          提示：单词释义、音标、例句由 Free Dictionary API、Tatoeba、Datamuse 三套权威免费 API 提供，首次加载后会被缓存。
        </p>
      </div>

      {/* 学习奖励弹窗 */}
      <RewardToast reward={lastReward} />
    </div>
  );
};
