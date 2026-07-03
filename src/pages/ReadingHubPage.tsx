import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Sparkles, Newspaper } from 'lucide-react';
import { readingArticles } from '../data/reading';
import { languageNames, levelNames } from '../types';
import type { Language, Level, ReadingCategory } from '../types';

const languageOptions: { value: 'all' | Language; label: string }[] = [
  { value: 'all', label: '全部语言' },
  { value: 'english', label: '英语' },
  { value: 'japanese', label: '日语' },
  { value: 'korean', label: '韩语' },
  { value: 'french', label: '法语' },
  { value: 'spanish', label: '西班牙语' },
  { value: 'german', label: '德语' },
];

// 分类配置：value + 中文标签 + 图标颜色（用于卡片角标）
const categoryOptions: { value: 'all' | ReadingCategory; label: string; color: string }[] = [
  { value: 'all', label: '全部主题', color: 'bg-gray-500' },
  { value: 'daily', label: '日常生活', color: 'bg-green-500' },
  { value: 'tech', label: '科技', color: 'bg-blue-500' },
  { value: 'business', label: '职场商务', color: 'bg-indigo-500' },
  { value: 'entertainment', label: '娱乐', color: 'bg-pink-500' },
  { value: 'movie', label: '电影', color: 'bg-red-500' },
  { value: 'drama', label: '电视剧', color: 'bg-purple-500' },
  { value: 'novel', label: '小说文学', color: 'bg-amber-600' },
  { value: 'social', label: '社交交友', color: 'bg-teal-500' },
  { value: 'psychology', label: '心理', color: 'bg-rose-500' },
  { value: 'culture', label: '文化', color: 'bg-orange-500' },
];

// category → 中文标签映射（卡片显示用）
const categoryLabels: Record<ReadingCategory, string> = {
  daily: '日常生活',
  tech: '科技',
  business: '职场商务',
  entertainment: '娱乐',
  movie: '电影',
  drama: '电视剧',
  novel: '小说文学',
  social: '社交交友',
  psychology: '心理',
  culture: '文化',
};

// category → 颜色映射（卡片角标）
const categoryColors: Record<ReadingCategory, string> = {
  daily: 'bg-green-500',
  tech: 'bg-blue-500',
  business: 'bg-indigo-500',
  entertainment: 'bg-pink-500',
  movie: 'bg-red-500',
  drama: 'bg-purple-500',
  novel: 'bg-amber-600',
  social: 'bg-teal-500',
  psychology: 'bg-rose-500',
  culture: 'bg-orange-500',
};

export const ReadingHubPage = () => {
  const navigate = useNavigate();
  const [langFilter, setLangFilter] = useState<'all' | Language>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ReadingCategory>('all');

  const filteredArticles = useMemo(() => {
    return readingArticles.filter(a => {
      const langOk = langFilter === 'all' || a.language === langFilter;
      const catOk = categoryFilter === 'all' || a.category === categoryFilter;
      return langOk && catOk;
    });
  }, [langFilter, categoryFilter]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Newspaper className="w-7 h-7 text-primary-500" />
          阅读中心
        </h1>
        <p className="text-gray-500">
          按兴趣选主题，按语言筛素材：点击任意单词查看翻译、词性和发音；文末集中讲解固定搭配；最后通过影子跟读检验学习效果。
        </p>
      </div>

      {/* 主题分类筛选 */}
      <div>
        <p className="text-sm text-gray-400 mb-2">按兴趣选主题</p>
        <div className="flex flex-wrap items-center gap-2">
          {categoryOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setCategoryFilter(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoryFilter === opt.value
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 语言筛选 */}
      <div>
        <p className="text-sm text-gray-400 mb-2">按语言筛选</p>
        <div className="flex flex-wrap items-center gap-2">
          {languageOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setLangFilter(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                langFilter === opt.value
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 结果计数 */}
      <div className="text-sm text-gray-500">
        共找到 <span className="font-bold text-primary-600">{filteredArticles.length}</span> 篇文章
      </div>

      {/* 文章列表 */}
      {filteredArticles.length === 0 ? (
        <div className="card-gradient p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">该筛选条件下暂无文章，试试其他组合吧</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => navigate(`/reading/${article.id}`)}
              className="card-gradient p-6 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${categoryColors[article.category]}`}>
                  {categoryLabels[article.category]}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{languageNames[article.language]}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
                    {levelNames[article.level as Level]}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                {article.title}
              </h3>

              <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                {article.paragraphs[0]}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  约 {article.estimatedMinutes} 分钟
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {article.collocations.length} 个搭配
                </span>
              </div>

              <div className="flex items-center text-primary-600 text-sm font-medium">
                <span>开始阅读</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
