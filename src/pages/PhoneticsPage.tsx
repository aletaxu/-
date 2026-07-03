import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Volume2, Mic, MicOff, ArrowRight, ArrowLeft, CheckCircle2,
  AlertTriangle, Lightbulb, BookOpen, RefreshCw, Award, Headphones, Languages
} from 'lucide-react';
import {
  getPhoneticsData, getAvailablePhoneticsLanguages, getPhonemeDisplay,
  type LanguagePhoneticsData, type AccentOption, type Phoneme
} from '../data/phoneticsIndex';
import { languageNames, languageFlags, type Language } from '../types';
import { useRewards } from '../hooks/useRewards';
import { RewardToast } from '../components/RewardToast';

type Mode = 'overview' | 'practice';

export const PhoneticsPage = () => {
  const { addReward, lastReward } = useRewards();
  const availableLangs = useMemo(() => getAvailablePhoneticsLanguages(), []);
  const [language, setLanguage] = useState<Language>(availableLangs[0] || 'english');
  const data: LanguagePhoneticsData | undefined = getPhoneticsData(language);

  const [mode, setMode] = useState<Mode>('overview');
  const [accent, setAccent] = useState<string>(data?.defaultAccent || 'standard');
  const [selectedGroup, setSelectedGroup] = useState<string>(data?.groups[0]?.id || '');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // 切换语种时重置口音/分组/进度
  useEffect(() => {
    if (!data) return;
    setAccent(data.defaultAccent);
    setSelectedGroup(data.groups[0]?.id || '');
    setMode('overview');
    setCurrentIdx(0);
    setAnswers({});
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">暂无该语种的音标数据</div>
    );
  }

  const groupPhonemes = data.getPhonemesByGroup(selectedGroup);
  const currentPhoneme = groupPhonemes[currentIdx];
  const currentAccent: AccentOption = data.accents.find(a => a.value === accent) || data.accents[0];

  const handleStartPractice = (groupId: string) => {
    setSelectedGroup(groupId);
    setCurrentIdx(0);
    setAnswers({});
    setMode('practice');
  };

  const handleAnswer = (phonemeId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [phonemeId]: score }));
  };

  const handleNext = () => {
    if (currentIdx < groupPhonemes.length - 1) setCurrentIdx(prev => prev + 1);
  };
  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  };

  const allDone = groupPhonemes.length > 0 &&
    groupPhonemes.every(p => answers[p.id] !== undefined);
  useEffect(() => {
    if (allDone && mode === 'practice') {
      const avg = Math.round(
        groupPhonemes.reduce((sum, p) => sum + (answers[p.id] || 0), 0) / groupPhonemes.length
      );
      addReward('speaking', avg, 'phonetics', selectedGroup);
    }
  }, [allDone, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (mode === 'practice' && currentPhoneme) {
    return (
      <PhonemePractice
        phoneme={currentPhoneme}
        data={data}
        accent={accent}
        onAccentChange={setAccent}
        index={currentIdx}
        total={groupPhonemes.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrev={handlePrev}
        onBack={() => setMode('overview')}
        allDone={allDone}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* 标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Headphones className="w-8 h-8 text-primary-500" />
          {data.title}
        </h1>
        <p className="text-gray-500">{data.subtitle}</p>
      </div>

      {/* 语种选择 */}
      <div className="card-gradient p-4">
        <div className="flex items-center gap-2 mb-3">
          <Languages className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">选择语种</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableLangs.map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                language === lang
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              <span className="mr-1">{languageFlags[lang]}</span>
              {languageNames[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* 口音切换（仅多口音语种显示） */}
      {data.accents.length > 1 && (
        <div className="card-gradient p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">发音口音：</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {data.accents.map(a => (
                <button
                  key={a.value}
                  onClick={() => setAccent(a.value)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    accent === a.value ? 'bg-white text-blue-600 shadow' : 'text-gray-500'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {accent === 'british' ? '英音：r 后不卷舌，纯元音' : accent === 'american' ? '美音：r 后卷舌，flap T' : '标准发音'}
          </span>
        </div>
      )}

      {/* 口音差异提示（仅有多口音差异的语种显示） */}
      {data.accentDifferences && data.accentDifferences.length > 0 && (
        <div className="card-gradient p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            口音核心差异
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.accentDifferences.map(diff => (
              <div key={diff.phonemeId} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                <span className="font-mono text-lg font-bold text-gray-800">
                  {diff.variants[accent] || Object.values(diff.variants)[0]}
                </span>
                <span className="text-xs text-gray-500 flex-1">{diff.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 按组分类练习 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-500" />
          按组练习
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.groups.map(group => {
            const count = data.getPhonemesByGroup(group.id).length;
            return (
              <div
                key={group.id}
                onClick={() => handleStartPractice(group.id)}
                className="card-gradient p-5 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all group"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors">
                  {group.name}
                </h3>
                <p className="text-xs text-gray-400 mb-3 font-mono">{group.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{count} 个{data.type === 'syllabary' ? '假名' : data.type === 'alphabet' ? '字母' : '音标'}</span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 全部音标速查 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-accent-500" />
          全部 {data.phonemes.length} {data.type === 'syllabary' ? '假名' : data.type === 'alphabet' ? '字母' : '音标'}速查（点击听发音）
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {data.phonemes.map(p => (
            <PhonemeChip key={p.id} phoneme={p} accent={accent} accentOption={currentAccent} />
          ))}
        </div>
      </div>

      {lastReward && <RewardToast reward={lastReward} />}
    </div>
  );
};

// ============ 单个音标芯片（速查用） ============
const PhonemeChip = ({
  phoneme, accent, accentOption
}: { phoneme: Phoneme; accent: string; accentOption: AccentOption }) => {
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = accentOption.ttsLang;
    u.rate = 0.8;
    speechSynthesis.speak(u);
  };

  const display = getPhonemeDisplay(phoneme, accent);

  return (
    <button
      onClick={() => speak(phoneme.examples[0]?.word || phoneme.symbol)}
      className="p-3 bg-white rounded-lg border border-gray-100 hover:border-primary-300 hover:shadow transition-all text-center group"
      title={phoneme.description}
    >
      <div className="font-mono text-lg font-bold text-gray-800 group-hover:text-primary-600">
        {display}
      </div>
      <div className="text-xs text-gray-400 mt-1 line-clamp-1">
        {phoneme.examples[0]?.word}
      </div>
    </button>
  );
};

// ============ 单音标练习组件 ============
interface PracticeProps {
  phoneme: Phoneme;
  data: LanguagePhoneticsData;
  accent: string;
  onAccentChange: (a: string) => void;
  index: number;
  total: number;
  onAnswer: (id: string, score: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onBack: () => void;
  allDone: boolean;
}

const PhonemePractice = ({
  phoneme, data, accent, onAccentChange, index, total,
  onAnswer, onNext, onPrev, onBack, allDone
}: PracticeProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [transcript, setTranscript] = useState('');
  const [targetWord, setTargetWord] = useState(phoneme.examples[0].word);
  const recognitionRef = useRef<any>(null);

  const accentOption: AccentOption = data.accents.find(a => a.value === accent) || data.accents[0];

  // 切换音标时重置
  useEffect(() => {
    setScore(null);
    setTranscript('');
    setTargetWord(phoneme.examples[Math.floor(Math.random() * phoneme.examples.length)].word);
  }, [phoneme.id]);

  // 初始化语音识别
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = accentOption.recognitionLang;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript.trim().toLowerCase();
        setTranscript(text);
        const similarity = calcSimilarity(text, targetWord.toLowerCase());
        const rounded = Math.round(similarity * 100);
        setScore(rounded);
        onAnswer(phoneme.id, rounded);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
    return () => {
      try { recognitionRef.current?.stop(); } catch { /* ignore */ }
    };
  }, [phoneme.id, accent, targetWord]); // eslint-disable-line react-hooks/exhaustive-deps

  const calcSimilarity = (s1: string, s2: string): number => {
    if (!s1 || !s2) return 0;
    const longer = s1.length >= s2.length ? s1 : s2;
    const shorter = s1.length >= s2.length ? s2 : s1;
    return (longer.length - editDistance(longer, shorter)) / longer.length;
  };

  const editDistance = (s1: string, s2: string): number => {
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let last = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else if (j > 0) {
          let nv = costs[j - 1];
          if (s1[i - 1] !== s2[j - 1]) nv = Math.min(Math.min(nv, last), costs[j]) + 1;
          costs[j - 1] = last;
          last = nv;
        }
      }
      if (i > 0) costs[s2.length] = last;
    }
    return costs[s2.length];
  };

  const handleRecord = () => {
    if (!recognitionRef.current) {
      alert('您的浏览器不支持语音识别，请使用 Chrome/Edge');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }
    setScore(null);
    setTranscript('');
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = accentOption.ttsLang;
    u.rate = 0.75;
    speechSynthesis.speak(u);
  };

  const displaySymbol = getPhonemeDisplay(phoneme, accent);

  const scoreColor = score === null ? '' :
    score >= 80 ? 'text-green-600' :
    score >= 60 ? 'text-yellow-600' : 'text-red-600';

  const scoreBg = score === null ? 'bg-gray-100' :
    score >= 80 ? 'bg-green-100' :
    score >= 60 ? 'bg-yellow-100' : 'bg-red-100';

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回{data.title}总览</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{index + 1} / {total}</span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
          {data.accents.length > 1 && (
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {data.accents.map(a => (
                <button
                  key={a.value}
                  onClick={() => onAccentChange(a.value)}
                  className={`px-2 py-1 rounded text-xs ${accent === a.value ? 'bg-white text-blue-600 shadow' : 'text-gray-500'}`}
                >
                  {a.flag} {a.value === 'british' ? '英' : a.value === 'american' ? '美' : '标'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 主卡片 */}
      <div className="card-gradient p-8">
        {/* 音标符号 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="text-6xl font-mono font-bold text-gray-800">{displaySymbol}</span>
            <button
              onClick={() => speak(phoneme.examples[0].word)}
              className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors"
              title="听标准发音"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-500">{phoneme.description}</p>
        </div>

        {/* 发音要领 + 口型 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-sm font-bold text-blue-700 mb-1 flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> 发音要领
            </h4>
            <p className="text-sm text-gray-700">{phoneme.description}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h4 className="text-sm font-bold text-purple-700 mb-1 flex items-center gap-1">
              <Volume2 className="w-4 h-4" /> 口型
            </h4>
            <p className="text-sm text-gray-700">{phoneme.mouthShape}</p>
          </div>
        </div>

        {/* 录音评测区 */}
        <div className="p-5 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border-2 border-primary-200 mb-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <span className="text-sm text-gray-500">请朗读：</span>
              <span className="text-2xl font-bold text-gray-800 ml-2">{targetWord}</span>
              <button
                onClick={() => speak(targetWord)}
                className="ml-2 text-primary-500 hover:text-primary-700"
                title="听这个词"
              >
                <Volume2 className="w-5 h-5 inline" />
              </button>
            </div>
            <button
              onClick={() => setTargetWord(phoneme.examples[Math.floor(Math.random() * phoneme.examples.length)].word)}
              className="text-xs text-gray-400 hover:text-primary-500 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> 换个词
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleRecord}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary-500 hover:bg-primary-600'
              } text-white shadow-lg`}
            >
              {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>
            <div className="flex-1">
              {isRecording ? (
                <p className="text-sm text-red-500 font-medium">正在录音… 请朗读「{targetWord}」</p>
              ) : transcript ? (
                <div>
                  <p className="text-xs text-gray-500">你说的：</p>
                  <p className="text-sm text-gray-800">"{transcript}"</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">点击麦克风开始录音评测</p>
              )}
            </div>
            {score !== null && (
              <div className={`px-4 py-3 rounded-xl ${scoreBg}`}>
                <div className={`text-3xl font-bold ${scoreColor}`}>{score}</div>
                <div className="text-xs text-gray-500">分</div>
              </div>
            )}
          </div>
        </div>

        {/* 评分反馈 + 矫正建议 */}
        {score !== null && (
          <div className="space-y-3 mb-6">
            <div className={`p-4 rounded-lg flex items-start gap-3 ${
              score >= 80 ? 'bg-green-50' : score >= 60 ? 'bg-yellow-50' : 'bg-red-50'
            }`}>
              {score >= 80 ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-bold ${scoreColor}`}>
                  {score >= 80 ? '发音准确！' : score >= 60 ? '基本正确，可优化' : '需要矫正'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {score >= 80
                    ? '识别结果与目标词高度匹配，继续保持。'
                    : score >= 60
                      ? `识别为「${transcript}」，与目标「${targetWord}」有差异。`
                      : `识别为「${transcript}」，与目标「${targetWord}」差异较大，请按下方建议矫正。`}
                </p>
              </div>
            </div>

            {score < 80 && phoneme.commonMistakes.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="text-sm font-bold text-amber-700 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> 常见错误
                </h4>
                <ul className="space-y-1">
                  {phoneme.commonMistakes.map((m, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {score < 100 && phoneme.correctionTips.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" /> 矫正建议
                </h4>
                <ul className="space-y-1">
                  {phoneme.correctionTips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-500 mt-1 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => speak(targetWord)}
                  className="mt-3 text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium"
                >
                  <Volume2 className="w-4 h-4" /> 再听一遍标准发音，对照练习
                </button>
              </div>
            )}
          </div>
        )}

        {/* 例词区 */}
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-2">含此音标的例词（点击听发音）</h4>
          <div className="flex flex-wrap gap-2">
            {phoneme.examples.map(ex => (
              <button
                key={ex.word}
                onClick={() => speak(ex.word)}
                className="px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow transition-all text-left group"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gray-300 group-hover:text-primary-500" />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{ex.word}</div>
                    <div className="font-mono text-xs text-gray-400">{ex.ipa}</div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{ex.meaning}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 底部导航 */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={onPrev}
            disabled={index === 0}
            className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" /> 上一个
          </button>
          {allDone && (
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <Award className="w-5 h-5" /> 本组全部完成！
            </div>
          )}
          <button
            onClick={onNext}
            disabled={index === total - 1}
            className="flex items-center gap-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-30"
          >
            下一个 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
