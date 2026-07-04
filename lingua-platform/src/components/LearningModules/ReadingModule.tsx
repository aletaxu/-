import { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  Volume2,
  Loader2,
  X,
  BookA,
  Mic,
  MicOff,
  Play,
  Pause,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Quote,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Gauge,
  Languages,
} from 'lucide-react';
import type { Course, CourseModule, Language, ReadingArticle } from '../../types';
import { languageCodes } from '../../types';
import { getReadingArticle, getReadingArticleById } from '../../data/reading';
import { getWordDetail, type WordDetail } from '../../services/languageDataApi';
import { translateToChinese } from '../../services/translationApi';
import { wordbook } from '../../utils/wordbook';
import { useProgress } from '../../hooks/useProgress';
import { useRewards } from '../../hooks/useRewards';
import { RewardToast } from '../RewardToast';

interface VocabularyModuleProps {
  course: Course;
  module: CourseModule;
  articleId?: string;
  // 外部语料（Wikipedia/Gutenberg）动态生成的文章，优先级高于 articleId
  article?: ReadingArticle;
}

type Stage = 'reading' | 'collocations' | 'shadowing' | 'result';

// 将一段文本拆分为 token：单词 / 标点 / 空格
type Token =
  | { kind: 'word'; text: string; clean: string }
  | { kind: 'punct'; text: string }
  | { kind: 'space'; text: string };

const tokenize = (text: string): Token[] => {
  const tokens: Token[] = [];
  // 用正则匹配：单词（含撇号）或单个标点或空格
  const regex = /([A-Za-zÀ-ÿ]+(?:'[A-Za-z]+)?)|([.,;:!?"'()\-—]+)|(\s+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      tokens.push({ kind: 'word', text: match[1], clean: match[1].toLowerCase() });
    } else if (match[2]) {
      tokens.push({ kind: 'punct', text: match[2] });
    } else if (match[3]) {
      tokens.push({ kind: 'space', text: match[3] });
    }
  }
  return tokens;
};

/** 将段落按句末标点切分为句子（保留标点） */
const splitIntoSentences = (text: string): string[] => {
  if (!text) return [];
  const matches = text.match(/[^.!?。！？]+[.!?。！？]+/g);
  if (!matches) return [text];
  // 合并末尾残留（无句末标点的尾段）
  const consumed = matches.join('');
  const tail = text.slice(consumed.length).trim();
  return tail ? [...matches, tail] : matches;
};

export const ReadingModule = ({ course, module: courseModule, articleId, article: articleProp }: VocabularyModuleProps) => {
  const { saveProgress } = useProgress();
  const { addReward, lastReward } = useRewards();
  const article = useMemo(
    () => articleProp
      ? articleProp
      : articleId
        ? (getReadingArticleById(articleId) || getReadingArticle(course.language, course.level))
        : getReadingArticle(course.language, course.level),
    [articleProp, articleId, course.language, course.level]
  );

  const [stage, setStage] = useState<Stage>('reading');

  // 单词点击查询
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [detailMap, setDetailMap] = useState<Map<string, WordDetail | null>>(new Map());
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 阅读增强：双语对照 / 变速播放 / 句子高亮 / 句子翻译 / 生词本
  // textMode: 'original' 仅原文 | 'bilingual' 双语对照
  const [textMode, setTextMode] = useState<'original' | 'bilingual'>('original');
  // playRate: TTS 语速，模仿「每日英语听力」8 档变速
  const [playRate, setPlayRate] = useState<0.6 | 0.8 | 1.0 | 1.2 | 1.4>(1.0);
  // 当前正在播放/高亮的句子索引（全局，跨段落连续编号）
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number | null>(null);
  // 句子级翻译缓存：key = 句子文本，value = 中文翻译
  const [sentenceTranslations, setSentenceTranslations] = useState<Map<string, string>>(new Map());
  // 正在加载翻译的句子集合
  const [loadingSentences, setLoadingSentences] = useState<Set<string>>(new Set());
  // 生词本快照：记录当前语种已收藏的词（小写），用于文中持续高亮
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());

  // 影子跟读
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [shadowScore, setShadowScore] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const activeDetail = activeWord ? detailMap.get(activeWord.toLowerCase()) : undefined;

  // 挂载时加载生词本快照（当前语种），用于文中持续高亮已收藏词
  useEffect(() => {
    setSavedWords(new Set(wordbook.getByLanguage(course.language).map(w => w.word)));
  }, [course.language]);

  // 把文章所有段落预切成句子，扁平化成全局句子数组（带段落索引）
  // 用于：句子级播放、句子高亮、双语对照
  const sentences = useMemo(() => {
    const result: { text: string; paraIdx: number; sentIdx: number }[] = [];
    article.paragraphs.forEach((para, pIdx) => {
      splitIntoSentences(para).forEach((s, sIdx) => {
        result.push({ text: s, paraIdx: pIdx, sentIdx: sIdx });
      });
    });
    return result;
  }, [article]);

  // 每个段落的句子列表（按段落分组，渲染用）
  const sentencesByPara = useMemo(() => {
    const map = new Map<number, string[]>();
    sentences.forEach(s => {
      const arr = map.get(s.paraIdx) || [];
      arr.push(s.text);
      map.set(s.paraIdx, arr);
    });
    return map;
  }, [sentences]);

  // 全局句子索引 → 在 sentences 数组中的下标
  const sentenceFlatList = useMemo(() => sentences.map(s => s.text), [sentences]);

  // 请求某句的中文翻译（带缓存，避免重复请求）
  const requestSentenceTranslation = (sentence: string) => {
    if (!sentence.trim()) return;
    if (sentenceTranslations.has(sentence)) return;
    if (loadingSentences.has(sentence)) return;
    setLoadingSentences(prev => new Set(prev).add(sentence));
    translateToChinese(sentence, course.language as Language)
      .then(translated => {
        if (!translated) return;
        setSentenceTranslations(prev => {
          const next = new Map(prev);
          next.set(sentence, translated);
          return next;
        });
      })
      .finally(() => {
        setLoadingSentences(prev => {
          const next = new Set(prev);
          next.delete(sentence);
          return next;
        });
      });
  };

  // 切到双语模式时，自动为当前可见句子预取翻译
  useEffect(() => {
    if (textMode !== 'bilingual') return;
    // 预取前 8 句，避免一次性打爆 API
    sentenceFlatList.slice(0, 8).forEach(requestSentenceTranslation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textMode]);

  // 播放单句（TTS，带当前语速），并设置高亮
  const playSentence = (flatIdx: number) => {
    const text = sentenceFlatList[flatIdx];
    if (!text) return;
    speechSynthesis.cancel();
    setActiveSentenceIdx(flatIdx);
    const u = ttsSpeak(text, playRate);
    if (u) {
      u.onend = () => setActiveSentenceIdx(prev => (prev === flatIdx ? null : prev));
    }
  };

  // 顺序连播：从某句开始依次往下播放
  const playFromSentence = (startIdx: number) => {
    if (startIdx >= sentenceFlatList.length) return;
    speechSynthesis.cancel();
    setActiveSentenceIdx(startIdx);
    const speak = (idx: number) => {
      const text = sentenceFlatList[idx];
      if (!text) {
        setActiveSentenceIdx(null);
        return;
      }
      const u = ttsSpeak(text, playRate);
      if (u) {
        u.onend = () => {
          if (idx + 1 < sentenceFlatList.length) {
            setActiveSentenceIdx(idx + 1);
            speak(idx + 1);
          } else {
            setActiveSentenceIdx(null);
          }
        };
      }
    };
    speak(startIdx);
  };

  // 切换语速
  const cyclePlayRate = () => {
    const rates: Array<typeof playRate> = [0.6, 0.8, 1.0, 1.2, 1.4];
    const cur = rates.indexOf(playRate);
    setPlayRate(rates[(cur + 1) % rates.length]);
  };

  // 加入/移出生词本
  const toggleSavedWord = (word: string) => {
    const key = word.toLowerCase();
    const lang = course.language;
    if (wordbook.has(lang, word)) {
      wordbook.remove(lang, word);
      setSavedWords(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    } else {
      wordbook.add({
        word: key,
        display: word,
        language: lang,
        translation: activeDetail?.chineseTranslation,
        phonetic: activeDetail?.phonetic,
        articleTitle: article.title,
      });
      setSavedWords(prev => new Set(prev).add(key));
    }
  };

  // 点击单词后异步加载详情
  useEffect(() => {
    if (!activeWord) return;
    const key = activeWord.toLowerCase();
    if (detailMap.has(key)) return;

    let cancelled = false;
    setLoadingDetail(true);
    getWordDetail(activeWord, course.language as Language)
      .then(detail => {
        if (cancelled) return;
        setDetailMap(prev => {
          const next = new Map(prev);
          next.set(key, detail);
          return next;
        });
        // 单词加入生词本时，用最新拉到的中文释义回填（若已收藏）
        if (detail?.chineseTranslation && wordbook.has(course.language, activeWord)) {
          wordbook.add({
            word: key,
            display: activeWord,
            language: course.language,
            translation: detail.chineseTranslation,
            phonetic: detail.phonetic,
            articleTitle: article.title,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });
    return () => { cancelled = true; };
  }, [activeWord, course.language, detailMap, article.title]);

  // ============ 单词详情面板 ============
  const speakWord = (word: string, audioUrl?: string) => {
    if (audioUrl) {
      try {
        new Audio(audioUrl).play().catch(() => ttsSpeak(word));
        return;
      } catch {
        // fallthrough
      }
    }
    ttsSpeak(word);
  };

  const ttsSpeak = (text: string, rate: number = 0.9) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = languageCodes[course.language as Language] || 'en-US';
    u.rate = rate;
    speechSynthesis.speak(u);
    return u;
  };

  // ============ 影子跟读 ============
  const shadowingText = article.shadowingText || article.paragraphs[0];

  // 初始化语音识别
  useEffect(() => {
    if (stage !== 'shadowing') return;
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = languageCodes[course.language as Language] || 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const score = calculateSimilarity(transcript.toLowerCase(), shadowingText.toLowerCase());
      const rounded = Math.round(score * 100);
      setShadowScore(rounded);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    return () => {
      try { recognition.stop(); } catch { /* ignore */ }
    };
  }, [stage, course.language, shadowingText]);

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

  const handlePlayShadowing = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const u = ttsSpeak(shadowingText, 0.85);
    if (!u) return;
    speechUtteranceRef.current = u;
    setIsPlaying(true);
    u.onend = () => setIsPlaying(false);
  };

  const handleRecord = () => {
    if (!recognitionRef.current) {
      alert('您的浏览器不支持语音识别，请使用 Chrome/Edge 浏览器');
      return;
    }
    if (isRecording) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      setIsRecording(false);
      return;
    }
    setShadowScore(null);
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  // ============ 完成学习 ============
  const finishAssessment = () => {
    // 影子跟读分数作为评分依据；未做跟读则按完成度给基础分
    const finalScore = shadowScore !== null ? shadowScore : 70;

    saveProgress({
      userId: '1',
      courseId: course.id,
      moduleId: courseModule.id,
      completed: true,
      score: finalScore,
      completedAt: new Date().toISOString(),
    });
    // 发放学习奖励
    addReward('reading', finalScore, course.id, courseModule.id);
    setStage('result');
  };

  // ============ 结果页 ============
  if (stage === 'result') {
    const percentage = shadowScore !== null ? shadowScore : 70;
    return (
      <div className="text-center py-16">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
          percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
        }`}>
          <span className="text-white text-4xl font-bold">{percentage}%</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">阅读模块完成!</h2>
        <p className="text-gray-500 mb-8">
          {shadowScore !== null
            ? `影子跟读匹配度：${shadowScore}%`
            : '已完成阅读和固定搭配学习'}
        </p>
      </div>
    );
  }

  // ============ 阶段切换头部 ============
  const stages: { key: Stage; label: string; icon: any }[] = [
    { key: 'reading', label: '阅读', icon: BookOpen },
    { key: 'collocations', label: '固定搭配', icon: BookA },
    { key: 'shadowing', label: '影子跟读', icon: Mic },
  ];
  const currentStageIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="space-y-6">
      {/* 阶段进度条 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{courseModule.title}</h2>
          <p className="text-gray-500">{article.title} · 约 {article.estimatedMinutes} 分钟</p>
        </div>
        <div className="flex items-center gap-2">
          {stages.map((s, i) => {
            const Icon = s.icon;
            const isCurrent = s.key === stage;
            const isDone = i < currentStageIndex;
            return (
              <div
                key={s.key}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isCurrent
                    ? 'bg-primary-500 text-white'
                    : isDone
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{s.label}</span>
                {isDone && <CheckCircle2 className="w-3 h-3" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ 阶段1：阅读正文 ============ */}
      {stage === 'reading' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 p-4 bg-primary-50 rounded-xl">
            <Sparkles className="w-5 h-5 text-primary-600 flex-shrink-0" />
            <p className="text-primary-700 text-sm">
              点击单词查释义，点击句子听朗读。已收藏生词会高亮提示。
            </p>
          </div>

          {/* 阅读工具栏：双语切换 / 变速 / 从头连播 / 停止 */}
          <div className="flex items-center gap-2 flex-wrap p-3 bg-white border border-gray-200 rounded-xl">
            <button
              onClick={() => setTextMode(m => (m === 'original' ? 'bilingual' : 'original'))}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                textMode === 'bilingual'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="切换双语/原文"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{textMode === 'bilingual' ? '双语对照' : '仅原文'}</span>
            </button>
            <button
              onClick={cyclePlayRate}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="切换语速"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{playRate.toFixed(1)}×</span>
            </button>
            <button
              onClick={() => playFromSentence(0)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="从头连播"
            >
              <Play className="w-3.5 h-3.5" />
              <span>连播</span>
            </button>
            {activeSentenceIdx !== null && (
              <button
                onClick={() => { speechSynthesis.cancel(); setActiveSentenceIdx(null); }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                title="停止播放"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>停止</span>
              </button>
            )}
            <div className="ml-auto text-xs text-gray-400">
              生词本：<span className="text-amber-600 font-medium">{savedWords.size}</span> 词
            </div>
          </div>

          <div className="card-gradient p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{article.title}</h3>
            <div className="space-y-5 leading-loose text-gray-800 text-lg">
              {article.paragraphs.map((para, pIdx) => {
                const paraSentences = sentencesByPara.get(pIdx) || [para];
                // 计算本段首句在全局扁平列表中的起始下标
                let flatStart = 0;
                for (let i = 0; i < pIdx; i++) {
                  flatStart += (sentencesByPara.get(i)?.length || 0);
                }
                return (
                  <p key={pIdx}>
                    {paraSentences.map((sent, sIdx) => {
                      const flatIdx = flatStart + sIdx;
                      const isActiveSent = activeSentenceIdx === flatIdx;
                      const translation = sentenceTranslations.get(sent);
                      const isLoadingTrans = loadingSentences.has(sent);
                      // 句子内部仍按 token 渲染，保留单词点击查词能力
                      const tokens = tokenize(sent);
                      return (
                        <span
                          key={sIdx}
                          className={`rounded transition-colors ${isActiveSent ? 'bg-amber-100' : 'hover:bg-amber-50'}`}
                        >
                          {/* 句子朗读按钮（句首小喇叭，hover 显示） */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isActiveSent) {
                                speechSynthesis.cancel();
                                setActiveSentenceIdx(null);
                              } else {
                                playSentence(flatIdx);
                              }
                            }}
                            className="inline-flex items-center mr-0.5 text-amber-400 hover:text-amber-600 align-middle opacity-60 hover:opacity-100"
                            title="听本句"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          {tokens.map((tok, tIdx) => {
                            if (tok.kind !== 'word') return <span key={tIdx}>{tok.text}</span>;
                            const isActive = activeWord?.toLowerCase() === tok.clean;
                            const isSaved = savedWords.has(tok.clean);
                            return (
                              <span
                                key={tIdx}
                                onClick={() => setActiveWord(tok.text)}
                                className={`cursor-pointer transition-colors rounded px-0.5 ${
                                  isActive
                                    ? 'bg-primary-200 text-primary-800'
                                    : isSaved
                                    ? 'bg-amber-200 text-amber-800 underline decoration-amber-400'
                                    : 'hover:bg-primary-50 hover:text-primary-600'
                                }`}
                              >
                                {tok.text}
                              </span>
                            );
                          })}
                          {/* 双语对照：句末显示中文翻译 */}
                          {textMode === 'bilingual' && (
                            <span className="block text-base text-gray-500 mt-1 mb-2 leading-snug">
                              {isLoadingTrans ? '翻译中…' : (translation || ' ')}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStage('collocations')}
              className="btn-primary flex items-center gap-2"
            >
              <span>下一步：固定搭配</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============ 阶段2：固定搭配 ============ */}
      {stage === 'collocations' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 p-4 bg-accent-50 rounded-xl">
            <BookA className="w-5 h-5 text-accent-600 flex-shrink-0" />
            <p className="text-accent-700 text-sm">
              文中出现的固定搭配集中讲解，掌握词义和用法，让你的表达更地道。
            </p>
          </div>

          <div className="space-y-4">
            {article.collocations.map((col, idx) => (
              <div key={col.id} className="card-gradient p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-primary-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h4 className="text-xl font-bold text-gray-800">{col.phrase}</h4>
                      <button
                        onClick={() => ttsSpeak(col.phrase, 0.85)}
                        className="text-accent-500 hover:text-accent-700"
                        title="听发音"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-sm">
                        {col.meaning}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      <span className="font-medium text-gray-700">用法：</span>
                      {col.usage}
                    </p>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                        <Quote className="w-3 h-3" />
                        <span>例句</span>
                      </div>
                      <p className="text-gray-700 italic mb-1">{col.example}</p>
                      <p className="text-gray-500 text-sm">{col.exampleTranslation}</p>
                      <button
                        onClick={() => ttsSpeak(col.example, 0.85)}
                        className="mt-1 text-xs text-accent-500 hover:text-accent-700 flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>播放例句</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStage('reading')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回阅读</span>
            </button>
            <button
              onClick={() => setStage('shadowing')}
              className="btn-primary flex items-center gap-2"
            >
              <span>下一步：影子跟读</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============ 阶段3：影子跟读 ============ */}
      {stage === 'shadowing' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 p-4 bg-success-50 rounded-xl">
            <Mic className="w-5 h-5 text-success-600 flex-shrink-0" />
            <p className="text-success-700 text-sm">
              影子跟读训练（Shadowing）：先听原文音频，再边听边模仿跟读，系统会比对识别准确度。
            </p>
          </div>

          <div className="card-gradient p-8">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-3">跟读文本</p>
              <p className="text-gray-800 text-lg leading-relaxed italic">
                {shadowingText}
              </p>
            </div>

            {/* 播放原音 */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={handlePlayShadowing}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isPlaying
                    ? 'bg-warning-100 text-warning-700'
                    : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? '暂停' : '播放原音'}</span>
              </button>
            </div>

            {/* 跟读录音 */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-center text-sm text-gray-500 mb-4">
                听完原音后，点击下方按钮开始跟读
              </p>
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleRecord}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-success-500 text-white hover:bg-success-600'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>
              <p className="text-center text-sm text-gray-500">
                {isRecording ? '正在录音…请跟读' : '点击麦克风开始跟读'}
              </p>
            </div>

            {/* 跟读评分 */}
            {shadowScore !== null && (
              <div className="mt-6 p-6 bg-success-50 rounded-xl text-center">
                <p className="text-sm text-success-700 mb-2">跟读匹配度</p>
                <div className={`text-5xl font-bold mb-2 ${
                  shadowScore >= 80 ? 'text-green-600' : shadowScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {shadowScore}%
                </div>
                <p className="text-gray-500 text-sm">
                  {shadowScore >= 80
                    ? '太棒了！发音非常准确'
                    : shadowScore >= 60
                    ? '不错！继续练习可以更准确'
                    : '再加把劲，多听几遍原音试试'}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStage('collocations')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回搭配</span>
            </button>
            <button
              onClick={finishAssessment}
              className="btn-primary flex items-center gap-2"
            >
              <span>完成学习</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============ 单词详情浮层 ============ */}
      {activeWord && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveWord(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-3xl font-bold text-gray-800">{activeWord}</h3>
                {activeDetail?.phonetic && (
                  <span className="text-gray-500 text-sm">{activeDetail.phonetic}</span>
                )}
                <button
                  onClick={() => speakWord(activeWord, activeDetail?.audioUrl)}
                  className="text-primary-500 hover:text-primary-700"
                  title="听发音"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleSavedWord(activeWord)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                    savedWords.has(activeWord.toLowerCase())
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                  }`}
                  title={savedWords.has(activeWord.toLowerCase()) ? '移出生词本' : '加入生词本'}
                >
                  {savedWords.has(activeWord.toLowerCase())
                    ? <BookmarkCheck className="w-3.5 h-3.5" />
                    : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{savedWords.has(activeWord.toLowerCase()) ? '已收藏' : '加生词本'}</span>
                </button>
              </div>
              <button
                onClick={() => setActiveWord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetail && (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>正在加载权威词典数据…</span>
              </div>
            )}

            {!loadingDetail && activeDetail && (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {/* 中文释义（首要展示，便于初学者快速理解） */}
                {activeDetail.chineseTranslation && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-1 text-amber-600 text-xs mb-1 font-medium">
                      <Sparkles className="w-3 h-3" />
                      <span>中文释义</span>
                    </div>
                    <p className="text-gray-800 text-base font-medium leading-relaxed">
                      {activeDetail.chineseTranslation}
                    </p>
                  </div>
                )}

                {/* 词性 + 释义 */}
                {activeDetail.meanings.length > 0 ? (
                  activeDetail.meanings.slice(0, 3).map((m, i) => (
                    <div key={i}>
                      <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-xs font-medium mb-2">
                        {m.partOfSpeech || 'word'}
                      </span>
                      <div className="space-y-2">
                        {m.definitions.slice(0, 2).map((d, j) => (
                          <div key={j} className="text-gray-700 text-sm">
                            <p>{d.definition}</p>
                            {d.example && (
                              <p className="text-gray-500 italic text-xs mt-1">e.g. {d.example}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">词典暂无该词数据，可尝试点击发音按钮听读。</p>
                )}

                {/* 真实例句 */}
                {activeDetail.examples.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Quote className="w-3 h-3" />
                      <span>真实例句 · Tatoeba</span>
                    </div>
                    <p className="text-gray-700 italic text-sm mb-1">
                      {activeDetail.examples[0].text}
                    </p>
                    {activeDetail.examples[0].translation && (
                      <p className="text-gray-500 text-xs">
                        {activeDetail.examples[0].translation}
                      </p>
                    )}
                    <button
                      onClick={() => ttsSpeak(activeDetail.examples[0].text, 0.85)}
                      className="mt-1 text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>播放例句</span>
                    </button>
                  </div>
                )}

                {/* 同义词 */}
                {activeDetail.synonyms.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <BookA className="w-3 h-3" />
                      <span>同义词 · Datamuse</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {activeDetail.synonyms.slice(0, 6).map(syn => (
                        <span key={syn} className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-xs">
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 数据来源 */}
                <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  数据来源：{activeDetail.sources.map(s => s).join(' · ')}
                </div>
              </div>
            )}

            {!loadingDetail && !activeDetail && (
              <p className="text-gray-400 text-sm py-4">
                词典暂无该词数据，可点击发音按钮听读。
              </p>
            )}
          </div>
        </div>
      )}

      {/* 学习奖励弹窗 */}
      <RewardToast reward={lastReward} />
    </div>
  );
};
