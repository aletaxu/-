import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { readingArticles } from '../data/reading';
import { languageNames, levelNames } from '../types';
import type { Language, Level } from '../types';

const languageOptions: { value: 'all' | Language; label: string }[] = [
  { value: 'all', label: '全部语言' },
  { value: 'english', label: '英语' },
  { value: 'japanese', label: '日语' },
  { value: 'korean', label: '韩语' },
  { value: 'french', label: '法语' },
  { value: 'spanish', label: '西班牙语' },
  { value: 'german', label: '德语' },
];

export const ReadingHubPage = () => {
  const navigate = useNavigate();
  const [langFilter, setLangFilter] = useState<'all' | Language>('all');

  const filteredArticles = useMemo(() => {
    if (langFilter === 'all') return readingArticles;
    return readingArticles.filter(a => a.language === langFilter);
  }, [langFilter]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">阅读中心</h1>
        <p className="text-gray-500">
          选择一篇感兴趣的文章开始阅读：点击任意单词查看翻译、词性和发音；文末集中讲解固定搭配；最后通过影子跟读检验学习效果。
        </p>
      </div>

      {/* 语言筛选 */}
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

      {/* 文章列表 */}
      {filteredArticles.length === 0 ? (
        <div className="card-gradient p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">该语言暂无阅读文章，试试其他语言筛选吧</p>
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                  article.language === 'english' ? 'bg-blue-500' :
                  article.language === 'japanese' ? 'bg-red-500' :
                  article.language === 'korean' ? 'bg-purple-500' :
                  article.language === 'french' ? 'bg-pink-500' :
                  article.language === 'spanish' ? 'bg-yellow-500' :
                  article.language === 'german' ? 'bg-gray-700' : 'bg-green-500'
                }`}>
                  {languageNames[article.language]}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
                  {levelNames[article.level as Level]}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-700 transition-colors">
                {article.title}
              </h3>

              <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                {article.paragraphs[0]}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  约 {article.estimatedMinutes} 分钟
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {article.collocations.length} 个固定搭配
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
