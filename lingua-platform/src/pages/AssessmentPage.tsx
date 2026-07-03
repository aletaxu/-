import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Headphones,
  Mic,
  MicOff,
  Volume2,
  ArrowRight,
  Award,
  Target,
  Ear,
  Brain,
  Loader2,
  Quote,
} from 'lucide-react';
import {
  generateVocabQuestions,
  generateListeningQuestions,
  generateSpeakingQuestions,
  createAssessmentResult,
} from '../data/assessment';
import { storage } from '../utils/storage';
import { useRewards } from '../hooks/useRewards';
import { RewardToast } from '../components/RewardToast';
import { enhanceVocabQuestions, type VocabEnhancement } from '../services/languageDataApi';
import {
  generateApiVocabQuestions,
  generateApiSpeakingQuestions,
} from '../services/assessmentApi';
import type { AssessmentResult, VocabTestQuestion, SpeakingTestQuestion } from '../types';

type TestStage = 'intro' | 'vocabulary' | 'listening' | 'speaking' | 'result';

export const AssessmentPage = () => {
  const navigate = useNavigate();
  const { addReward, lastReward } = useRewards();
  const [stage, setStage] = useState<TestStage>('intro');

  // 词汇测试状态
  const [vocabIndex, setVocabIndex] = useState(0);
  const [vocabAnswers, setVocabAnswers] = useState<{ [key: string]: boolean }>({});
  const [showVocabFeedback, setShowVocabFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // 听力测试状态
  const [listenIndex, setListenIndex] = useState(0);
  const [listenAnswers, setListenAnswers] = useState<{ [key: string]: boolean }>({});
  const [showListenFeedback, setShowListenFeedback] = useState(false);
  const [selectedListenOption, setSelectedListenOption] = useState<number | null>(null);

  // 口语测试状态
  const [speakIndex, setSpeakIndex] = useState(0);
  const [speakScores, setSpeakScores] = useState<number[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSpeakScore, setCurrentSpeakScore] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // 结果状态
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // 词汇题 API 增强（音标 + 真实例句 + 同义词），后台异步加载
  const [vocabEnhancements, setVocabEnhancements] = useState<Map<string, VocabEnhancement>>(new Map());
  const [enhancementLoading, setEnhancementLoading] = useState(false);

  // 词汇题：优先从 API 实时生成（每次题目都不同），失败回退到本地题库
  const [vocabQuestions, setVocabQuestions] = useState<VocabTestQuestion[]>([]);
  const [vocabLoading, setVocabLoading] = useState(false);
  const [vocabSource, setVocabSource] = useState<'api' | 'local' | null>(null); // 标记题目来源

  // 听力题用本地题库（API 没有合适的中文听力题数据）
  const listenQuestions = useMemo(() => generateListeningQuestions(), []);

  // 口语题：优先用 API 单词池生成（无需网络请求），失败回退本地
  const [speakQuestions, setSpeakQuestions] = useState<SpeakingTestQuestion[]>([]);

  const currentVocabQuestion = vocabQuestions[vocabIndex];
  const currentListenQuestion = listenQuestions[listenIndex];
  const currentSpeakQuestion = speakQuestions[speakIndex];

  // 点击"开始能力测评"时，异步从 API 拉取词汇题
  const handleStartAssessment = async () => {
    setVocabLoading(true);
    setStage('vocabulary');

    // 同时启动口语题生成（无网络请求，瞬间完成）
    const apiSpeak = generateApiSpeakingQuestions();
    if (apiSpeak.length > 0) {
      setSpeakQuestions(apiSpeak);
    } else {
      setSpeakQuestions(generateSpeakingQuestions());
    }

    // 异步从 API 生成词汇题
    try {
      const apiQuestions = await generateApiVocabQuestions();
      if (apiQuestions && apiQuestions.length >= 6) {
        setVocabQuestions(apiQuestions);
        setVocabSource('api');
      } else {
        // API 数据不足，回退到本地题库
        setVocabQuestions(generateVocabQuestions());
        setVocabSource('local');
      }
    } catch {
      setVocabQuestions(generateVocabQuestions());
      setVocabSource('local');
    } finally {
      setVocabLoading(false);
    }
  };

  // 词汇题加载完成后，预取增强数据（音标 + 真实例句 + 同义词）
  useEffect(() => {
    if (stage !== 'vocabulary') return;
    if (vocabQuestions.length === 0) return; // 还在加载
    if (vocabEnhancements.size > 0) return; // 已加载过

    setEnhancementLoading(true);
    const words = vocabQuestions.map(q => q.word);
    enhanceVocabQuestions(words, 'english')
      .then(map => setVocabEnhancements(map))
      .finally(() => setEnhancementLoading(false));
  }, [stage, vocabQuestions, vocabEnhancements.size]);

  const currentEnhancement = currentVocabQuestion
    ? vocabEnhancements.get(currentVocabQuestion.word.toLowerCase())
    : undefined;

  // 口语测试语音识别初始化
  useEffect(() => {
    if (stage === 'speaking' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const similarity = calculateSimilarity(transcript.toLowerCase(), currentSpeakQuestion.text.toLowerCase());
        const roundedScore = Math.round(similarity * 100);
        setCurrentSpeakScore(roundedScore);
        setSpeakScores(prev => [...prev, roundedScore]);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
    }
  }, [stage, speakIndex, currentSpeakQuestion]);

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

  // 词汇测试处理
  const handleVocabAnswer = (index: number) => {
    if (showVocabFeedback) return;
    setSelectedOption(index);
    setShowVocabFeedback(true);
    const isCorrect = index === currentVocabQuestion.correctAnswer;
    setVocabAnswers(prev => ({ ...prev, [currentVocabQuestion.id]: isCorrect }));
  };

  const handleVocabNext = () => {
    if (vocabIndex < vocabQuestions.length - 1) {
      setVocabIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowVocabFeedback(false);
    } else {
      setStage('listening');
    }
  };

  // 听力测试处理
  const handlePlayAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const handleListenAnswer = (index: number) => {
    if (showListenFeedback) return;
    setSelectedListenOption(index);
    setShowListenFeedback(true);
    const isCorrect = index === currentListenQuestion.correctAnswer;
    setListenAnswers(prev => ({ ...prev, [currentListenQuestion.id]: isCorrect }));
  };

  const handleListenNext = () => {
    if (listenIndex < listenQuestions.length - 1) {
      setListenIndex(prev => prev + 1);
      setSelectedListenOption(null);
      setShowListenFeedback(false);
    } else {
      setStage('speaking');
    }
  };

  // 口语测试处理
  const handleRecord = () => {
    if (!recognitionRef.current) {
      alert('您的浏览器不支持语音识别功能，将使用默认评分');
      const defaultScore = 60 + Math.floor(Math.random() * 30);
      setCurrentSpeakScore(defaultScore);
      setSpeakScores(prev => [...prev, defaultScore]);
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setCurrentSpeakScore(null);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSpeakNext = () => {
    if (speakIndex < speakQuestions.length - 1) {
      setSpeakIndex(prev => prev + 1);
      setCurrentSpeakScore(null);
    } else {
      finishAssessment();
    }
  };

  // 完成测试，生成结果
  const finishAssessment = () => {
    const vocabCorrect = Object.values(vocabAnswers).filter(Boolean).length;
    const listenCorrect = Object.values(listenAnswers).filter(Boolean).length;
    const speakAvgScore = speakScores.length > 0
      ? speakScores.reduce((sum, s) => sum + s, 0) / speakScores.length
      : 60;

    const assessmentResult = createAssessmentResult(
      vocabCorrect,
      vocabQuestions.length,
      listenCorrect,
      listenQuestions.length,
      speakAvgScore
    );

    storage.setAssessment(assessmentResult);
    setResult(assessmentResult);
    // 能力测评完成奖励（按平均分）
    const avgScore = Math.round(
      (vocabCorrect / vocabQuestions.length) * 100 * 0.4 +
      (listenCorrect / listenQuestions.length) * 100 * 0.3 +
      speakAvgScore * 0.3
    );
    addReward('assessment', avgScore);
    setStage('result');
  };

  // ============ 开始页 ============
  if (stage === 'intro') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="card-gradient p-12 max-w-3xl w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-gray-800 mb-4">语言能力测评</h1>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            通过词汇量、听力理解和口语表达三个维度的测试，精准评估你的语言能力等级，为个性化学习计划提供依据
          </p>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-primary-50 rounded-2xl">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">词汇量测试</h3>
              <p className="text-sm text-gray-500">20道分级词汇题</p>
            </div>
            <div className="p-6 bg-accent-50 rounded-2xl">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-7 h-7 text-accent-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">听力测试</h3>
              <p className="text-sm text-gray-500">10道分级听力题</p>
            </div>
            <div className="p-6 bg-success-50 rounded-2xl">
              <div className="w-14 h-14 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Mic className="w-7 h-7 text-success-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">口语测试</h3>
              <p className="text-sm text-gray-500">10句跟读评分</p>
            </div>
          </div>

          <div className="p-4 bg-warning-50 rounded-xl mb-8 text-left">
            <p className="text-sm text-warning-700">
              <strong>温馨提示：</strong>听力测试需要播放音频，请确保设备音量正常；口语测试需要使用麦克风，请允许浏览器访问麦克风权限。预计用时10-15分钟。
            </p>
          </div>

          <button
            onClick={handleStartAssessment}
            className="btn-primary text-lg px-12 py-4"
          >
            开始能力测评
            <ArrowRight className="w-5 h-5 inline ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // ============ 词汇测试 ============
  if (stage === 'vocabulary') {
    // 题目还在从 API 加载
    if (vocabLoading || vocabQuestions.length === 0) {
      return (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              <span>第一部分 · 词汇量测试</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">正在生成题目…</h2>
          </div>
          <div className="card-gradient p-12 text-center">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 mb-2">正在从权威词典 API 拉取单词数据</p>
            <p className="text-gray-400 text-sm">
              按 10 个难度等级随机抽取单词，每次生成的题目都不同
            </p>
          </div>
        </div>
      );
    }

    const progress = ((vocabIndex + 1) / vocabQuestions.length) * 100;
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            <span>第一部分 · 词汇量测试</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">选择单词的正确释义</h2>
          {vocabSource === 'api' && (
            <p className="text-xs text-primary-500 mt-2">
              题目由 Free Dictionary API 实时生成 · 每次都不同
            </p>
          )}
          {vocabSource === 'local' && (
            <p className="text-xs text-gray-400 mt-2">
              当前使用本地题库（API 未响应，已自动回退）
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {vocabIndex + 1} / {vocabQuestions.length}
          </span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-400">难度 {currentVocabQuestion.difficulty}/10</span>
        </div>

        <div className="card-gradient p-10">
          <div className="text-center mb-10">
            <p className="text-sm text-gray-500 mb-4">请选择以下单词的英文释义</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <h3 className="font-display text-5xl font-bold text-gray-800">{currentVocabQuestion.word}</h3>
              {currentEnhancement?.phonetic && (
                <span className="text-base text-gray-500">{currentEnhancement.phonetic}</span>
              )}
              {currentEnhancement?.audioUrl ? (
                <button
                  onClick={() => {
                    try {
                      new Audio(currentEnhancement.audioUrl).play();
                    } catch {
                      // ignore
                    }
                  }}
                  className="text-primary-500 hover:text-primary-700"
                  title="听真人发音"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      const u = new SpeechSynthesisUtterance(currentVocabQuestion.word);
                      u.lang = 'en-US';
                      speechSynthesis.speak(u);
                    }
                  }}
                  className="text-primary-500 hover:text-primary-700"
                  title="听发音"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>
            {enhancementLoading && vocabEnhancements.size === 0 && (
              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-3">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>正在加载权威词典数据…</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentVocabQuestion.options.map((option, index) => {
              let optionClass = 'bg-white border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50';
              if (showVocabFeedback) {
                if (index === currentVocabQuestion.correctAnswer) {
                  optionClass = 'bg-green-100 border-2 border-green-500';
                } else if (selectedOption === index) {
                  optionClass = 'bg-red-100 border-2 border-red-500';
                }
              }
              return (
                <button
                  key={index}
                  onClick={() => handleVocabAnswer(index)}
                  disabled={showVocabFeedback}
                  className={`p-5 rounded-xl text-lg font-medium transition-all ${optionClass} ${showVocabFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {showVocabFeedback && currentEnhancement?.example && (
            <div className="mt-6 p-4 bg-primary-50 rounded-xl">
              <div className="flex items-center gap-1 text-primary-600 text-xs mb-2">
                <Quote className="w-3 h-3" />
                <span>真实语境例句 · 来自 Tatoeba</span>
              </div>
              <p className="text-gray-700 italic mb-1">{currentEnhancement.example}</p>
              {currentEnhancement.exampleTranslation && (
                <p className="text-gray-500 text-sm">{currentEnhancement.exampleTranslation}</p>
              )}
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    const u = new SpeechSynthesisUtterance(currentEnhancement.example);
                    u.lang = 'en-US';
                    u.rate = 0.9;
                    speechSynthesis.speak(u);
                  }
                }}
                className="mt-2 text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1"
              >
                <Volume2 className="w-3 h-3" />
                <span>播放例句</span>
              </button>
            </div>
          )}

          {showVocabFeedback && currentEnhancement && currentEnhancement.synonyms.length > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">同义词 · Datamuse:</span>
              {currentEnhancement.synonyms.slice(0, 5).map(syn => (
                <span key={syn} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  {syn}
                </span>
              ))}
            </div>
          )}

          {showVocabFeedback && (
            <button
              onClick={handleVocabNext}
              className="mt-8 w-full btn-primary flex items-center justify-center gap-2"
            >
              <span>{vocabIndex < vocabQuestions.length - 1 ? '下一题' : '进入听力测试'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ============ 听力测试 ============
  if (stage === 'listening') {
    const progress = ((listenIndex + 1) / listenQuestions.length) * 100;
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full text-accent-600 text-sm font-medium mb-4">
            <Headphones className="w-4 h-4" />
            <span>第二部分 · 听力测试</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">听音频回答问题</h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {listenIndex + 1} / {listenQuestions.length}
          </span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-400">难度 {currentListenQuestion.difficulty}/10</span>
        </div>

        <div className="card-gradient p-10">
          <div className="text-center mb-8">
            <button
              onClick={() => handlePlayAudio(currentListenQuestion.audioText)}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg mx-auto"
            >
              <Volume2 className="w-10 h-10" />
            </button>
            <p className="text-sm text-gray-500 mt-4">点击播放音频（可重复播放）</p>
          </div>

          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-lg text-gray-700 font-medium">{currentListenQuestion.question}</p>
          </div>

          <div className="space-y-3">
            {currentListenQuestion.options.map((option, index) => {
              let optionClass = 'bg-white border-2 border-gray-200 hover:border-accent-300 hover:bg-accent-50';
              if (showListenFeedback) {
                if (index === currentListenQuestion.correctAnswer) {
                  optionClass = 'bg-green-100 border-2 border-green-500';
                } else if (selectedListenOption === index) {
                  optionClass = 'bg-red-100 border-2 border-red-500';
                }
              }
              return (
                <button
                  key={index}
                  onClick={() => handleListenAnswer(index)}
                  disabled={showListenFeedback}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${optionClass}`}
                >
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600 text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-gray-800">{option}</span>
                </button>
              );
            })}
          </div>

          {showListenFeedback && (
            <button
              onClick={handleListenNext}
              className="mt-8 w-full btn-primary flex items-center justify-center gap-2"
            >
              <span>{listenIndex < listenQuestions.length - 1 ? '下一题' : '进入口语测试'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ============ 口语测试 ============
  if (stage === 'speaking') {
    const progress = ((speakIndex + 1) / speakQuestions.length) * 100;
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-100 rounded-full text-success-600 text-sm font-medium mb-4">
            <Mic className="w-4 h-4" />
            <span>第三部分 · 口语测试</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">跟读以下句子</h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {speakIndex + 1} / {speakQuestions.length}
          </span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-success-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-400">难度 {currentSpeakQuestion.difficulty}/10</span>
        </div>

        <div className="card-gradient p-10">
          <div className="text-center mb-8">
            <button
              onClick={() => handlePlayAudio(currentSpeakQuestion.text)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors mb-6"
            >
              <Volume2 className="w-5 h-5" />
              <span>听示范发音</span>
            </button>
            <p className="font-display text-3xl font-semibold text-gray-800 leading-relaxed">
              {currentSpeakQuestion.text}
            </p>
          </div>

          <div className="text-center py-8">
            <button
              onClick={handleRecord}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-gradient-to-br from-success-500 to-accent-500 hover:scale-105'
              } text-white shadow-lg`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-12 h-12 mb-1" />
                  <span className="text-sm">录音中</span>
                </>
              ) : (
                <>
                  <Mic className="w-12 h-12 mb-1" />
                  <span className="text-sm">{currentSpeakScore !== null ? '重新录音' : '开始录音'}</span>
                </>
              )}
            </button>
          </div>

          {currentSpeakScore !== null && (
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                currentSpeakScore >= 80 ? 'bg-green-500' : currentSpeakScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                <span className="text-white text-3xl font-bold">{currentSpeakScore}</span>
              </div>
              <p className={`mt-3 font-semibold ${
                currentSpeakScore >= 80 ? 'text-green-600' : currentSpeakScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {currentSpeakScore >= 80 ? '发音很棒！' : currentSpeakScore >= 60 ? '还不错，继续加油！' : '可以再试一次'}
              </p>
            </div>
          )}

          {currentSpeakScore !== null && (
            <button
              onClick={handleSpeakNext}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <span>{speakIndex < speakQuestions.length - 1 ? '下一句' : '查看测评结果'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ============ 测试结果 ============
  if (stage === 'result' && result) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-gray-800 mb-2">测评完成！</h1>
          <p className="text-gray-500">以下是你的语言能力评估结果</p>
        </div>

        {/* 综合词汇量 */}
        <div className="card-gradient p-8 text-center bg-gradient-to-br from-primary-50 to-accent-50">
          <p className="text-gray-500 mb-2">估算词汇量</p>
          <p className="font-display text-6xl font-bold text-primary-600 mb-2">
            {result.estimatedVocabSize.toLocaleString()}
          </p>
          <p className="text-gray-500">个单词</p>
        </div>

        {/* 三维能力雷达 */}
        <div className="grid grid-cols-3 gap-6">
          <div className="card-gradient p-6 text-center">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-7 h-7 text-primary-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">词汇能力</p>
            <p className="font-display text-4xl font-bold text-gray-800 mb-2">
              {result.vocabularyLevel}<span className="text-lg text-gray-400">/10</span>
            </p>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < result.vocabularyLevel ? 'bg-primary-500' : 'bg-gray-200'}`}
                ></div>
              ))}
            </div>
          </div>

          <div className="card-gradient p-6 text-center">
            <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Ear className="w-7 h-7 text-accent-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">听力能力</p>
            <p className="font-display text-4xl font-bold text-gray-800 mb-2">
              {result.listeningLevel}<span className="text-lg text-gray-400">/10</span>
            </p>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < result.listeningLevel ? 'bg-accent-500' : 'bg-gray-200'}`}
                ></div>
              ))}
            </div>
          </div>

          <div className="card-gradient p-6 text-center">
            <div className="w-14 h-14 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Mic className="w-7 h-7 text-success-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">口语能力</p>
            <p className="font-display text-4xl font-bold text-gray-800 mb-2">
              {result.speakingLevel}<span className="text-lg text-gray-400">/10</span>
            </p>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < result.speakingLevel ? 'bg-success-500' : 'bg-gray-200'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* 建议 */}
        <div className="card-gradient p-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-800">测评建议</h3>
          </div>
          <div className="space-y-3 text-gray-600">
            <p>
              你目前的词汇量约为 <strong className="text-primary-600">{result.estimatedVocabSize.toLocaleString()}</strong> 个，
              词汇能力等级为 <strong className="text-primary-600">{result.vocabularyLevel}/10</strong>，
              听力能力 <strong className="text-accent-600">{result.listeningLevel}/10</strong>，
              口语能力 <strong className="text-success-600">{result.speakingLevel}/10</strong>。
            </p>
            <p>
              {result.vocabularyLevel <= 4 && '建议从基础词汇开始系统学习，逐步扩大词汇量。'}
              {result.vocabularyLevel > 4 && result.vocabularyLevel <= 7 && '词汇基础不错，可以挑战更高级别的词汇和表达。'}
              {result.vocabularyLevel > 7 && '词汇量很出色，建议关注学术和专业领域词汇。'}
            </p>
            <p>
              接下来，请设置你的学习目标和兴趣偏好，我们将为你生成个性化的学习计划，帮助你高效达成目标。
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/plan-setup')}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <span>设置学习目标</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
          >
            稍后再说
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 学习奖励弹窗 */}
      <RewardToast reward={lastReward} />
    </>
  );
};
