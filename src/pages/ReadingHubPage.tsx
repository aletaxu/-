import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Sparkles, Newspaper, Globe, BookMarked, Loader2, Search, Radio, Calendar } from 'lucide-react';
import { readingArticles } from '../data/reading';
import { languageNames, levelNames } from '../types';
import type { Language, Level, ReadingCategory } from '../types';
import {
  fetchRandomWikipediaArticle,
  fetchWikipediaArticleByTopic,
  searchWikipediaArticles,
  fetchGutenbergBooks,
  fetchDailyWikipediaArticles,
  fetchDailyGutenbergBooks,
  wikipediaToReadingArticle,
  gutenbergToReadingArticle,
  supportsWikipedia,
  supportsGutenberg,
  type WikipediaArticle,
  type WikipediaSearchResult,
  type GutenbergBook,
} from '../services/externalCorpusApi';
import {
  fetchNewsByLanguage,
  fetchDailyNews,
  searchNewsByKeyword,
  newsToReadingArticle,
  getNewsSourcesByLanguage,
  supportsNews,
  type NewsItem,
} from '../services/newsApi';

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

  // ============ 在线语料状态 ============
  // 在线语料默认聚焦英/德/法三种（用户要求），但 UI 仍允许切换到其他支持的语种
  const [corpusLang, setCorpusLang] = useState<Language>('english');
  const [corpusTopic, setCorpusTopic] = useState('');
  const [loadingWiki, setLoadingWiki] = useState(false);
  const [loadingGutenberg, setLoadingGutenberg] = useState(false);
  const [wikiError, setWikiError] = useState('');
  const [wikiSearchResults, setWikiSearchResults] = useState<WikipediaSearchResult[]>([]);
  const [loadingWikiResult, setLoadingWikiResult] = useState<string | null>(null);
  const [gutenbergBooks, setGutenbergBooks] = useState<GutenbergBook[]>([]);
  const [loadingBookText, setLoadingBookText] = useState<number | null>(null);

  // ============ 新闻时事状态 ============
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState('');
  const [newsKeyword, setNewsKeyword] = useState('');

  // ============ 每日推荐状态（每天固定 5-8 篇，自动加载） ============
  const [dailyNews, setDailyNews] = useState<NewsItem[]>([]);
  const [dailyWiki, setDailyWiki] = useState<WikipediaArticle[]>([]);
  const [dailyBooks, setDailyBooks] = useState<GutenbergBook[]>([]);
  const [loadingDailyNews, setLoadingDailyNews] = useState(false);
  const [loadingDailyWiki, setLoadingDailyWiki] = useState(false);
  const [loadingDailyBooks, setLoadingDailyBooks] = useState(false);

  // 切换语种时自动加载该语种的「今日推荐」（每天 5-8 篇）
  useEffect(() => {
    let cancelled = false;
    const loadDaily = async () => {
      // 新闻每日推荐
      if (supportsNews(corpusLang)) {
        setLoadingDailyNews(true);
        const items = await fetchDailyNews(corpusLang, 6);
        if (!cancelled) {
          setDailyNews(items);
          setLoadingDailyNews(false);
        }
      } else {
        setDailyNews([]);
      }
      // Wikipedia 每日推荐
      if (supportsWikipedia(corpusLang)) {
        setLoadingDailyWiki(true);
        const wikis = await fetchDailyWikipediaArticles(corpusLang, 6);
        if (!cancelled) {
          setDailyWiki(wikis);
          setLoadingDailyWiki(false);
        }
      } else {
        setDailyWiki([]);
      }
      // Gutenberg 每日推荐
      if (supportsGutenberg(corpusLang)) {
        setLoadingDailyBooks(true);
        const books = await fetchDailyGutenbergBooks(corpusLang, 6);
        if (!cancelled) {
          setDailyBooks(books);
          setLoadingDailyBooks(false);
        }
      } else {
        setDailyBooks([]);
      }
    };
    loadDaily();
    return () => { cancelled = true; };
  }, [corpusLang]);

  // 在线语料可选语言（英/德/法为主，兼顾其他 Gutenberg 支持的语种）
  const corpusLangOptions: { value: Language; label: string; wiki: boolean; gutenberg: boolean }[] = [
    { value: 'english', label: '英语', wiki: true, gutenberg: true },
    { value: 'german', label: '德语', wiki: true, gutenberg: true },
    { value: 'french', label: '法语', wiki: true, gutenberg: true },
    { value: 'spanish', label: '西班牙语', wiki: true, gutenberg: true },
    { value: 'italian', label: '意大利语', wiki: true, gutenberg: true },
    { value: 'portuguese', label: '葡萄牙语', wiki: true, gutenberg: true },
    { value: 'japanese', label: '日语', wiki: true, gutenberg: false },
    { value: 'korean', label: '韩语', wiki: true, gutenberg: false },
  ];

  // 拉取随机 Wikipedia 条目并直接进入阅读
  const handleRandomWiki = async () => {
    setLoadingWiki(true);
    setWikiError('');
    try {
      const wiki = await fetchRandomWikipediaArticle(corpusLang);
      if (!wiki) {
        setWikiError('拉取失败，请稍后重试或换种语言');
        return;
      }
      openExternalArticle(wikiToReading(wiki));
    } catch {
      setWikiError('网络异常，请稍后重试');
    } finally {
      setLoadingWiki(false);
    }
  };

  // 按主题搜索 Wikipedia：模糊搜索返回多条结果，在当前页展示列表
  const handleTopicWiki = async () => {
    if (!corpusTopic.trim()) return;
    setLoadingWiki(true);
    setWikiError('');
    setWikiSearchResults([]);
    try {
      const results = await searchWikipediaArticles(corpusLang, corpusTopic.trim(), 8);
      setWikiSearchResults(results);
      if (results.length === 0) {
        setWikiError(`未找到"${corpusTopic}"相关条目，试试其他关键词`);
      }
    } catch {
      setWikiError('网络异常，请稍后重试');
    } finally {
      setLoadingWiki(false);
    }
  };

  // 点击某条 Wikipedia 搜索结果 → 拉取完整摘要 → 进入精读
  const handleOpenWikiResult = async (title: string) => {
    setLoadingWikiResult(title);
    setWikiError('');
    try {
      const wiki = await fetchWikipediaArticleByTopic(corpusLang, title);
      if (!wiki) {
        setWikiError(`「${title}」暂无法加载完整内容，请试另一条`);
        return;
      }
      openExternalArticle(wikiToReading(wiki));
    } catch {
      setWikiError('网络异常，请稍后重试');
    } finally {
      setLoadingWikiResult(null);
    }
  };

  // 拉取 Gutenberg 书单
  const handleLoadGutenberg = async () => {
    setLoadingGutenberg(true);
    try {
      const books = await fetchGutenbergBooks(corpusLang, corpusTopic.trim() || undefined, 6);
      setGutenbergBooks(books);
    } finally {
      setLoadingGutenberg(false);
    }
  };

  // 点击某本 Gutenberg 书 → 拉取正文片段 → 进入阅读
  const handleOpenBook = async (book: GutenbergBook) => {
    setLoadingBookText(book.id);
    try {
      const article = await gutenbergToReadingArticle(book, corpusLang, 'novel');
      if (!article) {
        setWikiError('该书正文暂不可用，请试另一本');
        return;
      }
      openExternalArticle(article);
    } finally {
      setLoadingBookText(null);
    }
  };

  // ============ 新闻相关函数 ============
  // 拉取当前语种所有新闻源的最新头条
  const handleLoadNews = async () => {
    setLoadingNews(true);
    setNewsError('');
    try {
      const items = await fetchNewsByLanguage(corpusLang, 4);
      if (items.length === 0) {
        setNewsError('新闻拉取失败，请稍后重试或换种语言');
      }
      setNewsItems(items);
    } catch {
      setNewsError('网络异常，请稍后重试');
    } finally {
      setLoadingNews(false);
    }
  };

  // 按关键词在新闻中筛选
  const handleSearchNews = async () => {
    if (!newsKeyword.trim()) {
      handleLoadNews();
      return;
    }
    setLoadingNews(true);
    setNewsError('');
    try {
      const items = await searchNewsByKeyword(corpusLang, newsKeyword.trim());
      setNewsItems(items);
      if (items.length === 0) {
        setNewsError(`未找到包含"${newsKeyword}"的新闻，试试其他关键词`);
      }
    } catch {
      setNewsError('新闻搜索异常，请稍后重试或先点「加载头条」拉取最新新闻');
    } finally {
      setLoadingNews(false);
    }
  };

  // 点击某条新闻 → 转为阅读文章 → 进入阅读
  const handleOpenNews = (news: NewsItem) => {
    const article = newsToReadingArticle(news);
    openExternalArticle(article);
  };

  // 把外部文章塞进路由 state 跳转到阅读页
  const openExternalArticle = (article: WikipediaArticle | ReturnType<typeof wikipediaToReadingArticle> | any) => {
    navigate('/reading/external', { state: { article } });
  };

  // Wikipedia 文章 → ReadingArticle（带主题分类推断）
  const wikiToReading = (wiki: WikipediaArticle) => {
    const lower = wiki.title.toLowerCase() + ' ' + wiki.extract.toLowerCase();
    let cat: ReadingCategory = 'culture';
    if (/tech|ai|computer|software|internet|algorithm|data/.test(lower)) cat = 'tech';
    else if (/film|cinema|movie|actor|director/.test(lower)) cat = 'movie';
    else if (/music|song|band|singer|k-pop|jazz/.test(lower)) cat = 'entertainment';
    else if (/novel|literature|author|poem|poetry|writer/.test(lower)) cat = 'novel';
    else if (/mind|psycholog|emotion|stress|happiness/.test(lower)) cat = 'psychology';
    else if (/friend|social|relationship/.test(lower)) cat = 'social';
    return wikipediaToReadingArticle(wiki, cat);
  };

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

      {/* ============ 在线语料（外部免费源实时拉取） ============ */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Globe className="w-6 h-6 text-accent-500" />
            在线语料
          </h2>
          <p className="text-gray-500 text-sm">
            实时从公开免费语料源拉取：BBC / 经济学人 / 明镜 / 世界报等权威新闻 + Wikipedia 百科 + Project Gutenberg 7万+公版经典文学。主要支持英语、德语、法语。
          </p>
        </div>

        {/* 语种选择 */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {corpusLangOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                setCorpusLang(opt.value);
                setGutenbergBooks([]);
                setNewsItems([]);
                setWikiError('');
                setNewsError('');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                corpusLang === opt.value
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* ============ 今日推荐：每个模块每天 5-8 篇，自动加载 ============ */}
        <div className="mb-8 p-5 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-primary-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-800">今日推荐</h3>
            <span className="text-xs text-gray-500">
              · {languageNames[corpusLang]} · 每个模块每天精选 5-8 篇，次日自动更新
            </span>
          </div>

          {/* 今日新闻 */}
          {supportsNews(corpusLang) && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-red-500" />
                <h4 className="font-semibold text-gray-700 text-sm">今日新闻 · {dailyNews.length} 篇</h4>
                {loadingDailyNews && <Loader2 className="w-3 h-3 animate-spin text-red-400" />}
              </div>
              {dailyNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {dailyNews.map(news => (
                    <div
                      key={news.id}
                      onClick={() => handleOpenNews(news)}
                      className="flex gap-2 p-2 bg-white rounded-lg border border-gray-100 hover:border-red-300 hover:shadow cursor-pointer transition-all group"
                    >
                      {news.thumbnail ? (
                        <img src={news.thumbnail} alt="" className="w-12 h-12 object-cover rounded shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-12 h-12 bg-red-50 rounded flex items-center justify-center shrink-0">
                          <Newspaper className="w-4 h-4 text-red-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="px-1 py-0.5 bg-red-50 text-red-600 rounded text-xs shrink-0">{news.sourceName}</span>
                          {news.pubDate && (
                            <span className="text-xs text-gray-400">{new Date(news.pubDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors">{news.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : loadingDailyNews ? (
                <p className="text-xs text-gray-400">正在拉取今日新闻…</p>
              ) : (
                <p className="text-xs text-gray-400">今日新闻暂不可用，可在下方手动加载</p>
              )}
            </div>
          )}

          {/* 今日 Wikipedia */}
          {supportsWikipedia(corpusLang) && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <h4 className="font-semibold text-gray-700 text-sm">今日百科 · {dailyWiki.length} 篇</h4>
                {loadingDailyWiki && <Loader2 className="w-3 h-3 animate-spin text-blue-400" />}
              </div>
              {dailyWiki.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {dailyWiki.map((wiki, idx) => (
                    <div
                      key={`daily-wiki-${idx}`}
                      onClick={() => openExternalArticle(wikiToReading(wiki))}
                      className="flex gap-2 p-2 bg-white rounded-lg border border-gray-100 hover:border-blue-300 hover:shadow cursor-pointer transition-all group"
                    >
                      {wiki.thumbnailUrl ? (
                        <img src={wiki.thumbnailUrl} alt="" className="w-12 h-12 object-cover rounded shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-12 h-12 bg-blue-50 rounded flex items-center justify-center shrink-0">
                          <Globe className="w-4 h-4 text-blue-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 mb-0.5 group-hover:text-blue-600 transition-colors line-clamp-1">{wiki.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{wiki.extract}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : loadingDailyWiki ? (
                <p className="text-xs text-gray-400">正在拉取今日百科…</p>
              ) : (
                <p className="text-xs text-gray-400">今日百科暂不可用，可在下方手动搜索</p>
              )}
            </div>
          )}

          {/* 今日 Gutenberg */}
          {supportsGutenberg(corpusLang) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookMarked className="w-4 h-4 text-amber-600" />
                <h4 className="font-semibold text-gray-700 text-sm">今日经典文学 · {dailyBooks.length} 本</h4>
                {loadingDailyBooks && <Loader2 className="w-3 h-3 animate-spin text-amber-500" />}
              </div>
              {dailyBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {dailyBooks.map(book => (
                    <div
                      key={book.id}
                      onClick={() => handleOpenBook(book)}
                      className="flex gap-2 p-2 bg-white rounded-lg border border-gray-100 hover:border-amber-300 hover:shadow cursor-pointer transition-all group"
                    >
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt="" className="w-10 h-14 object-cover rounded shrink-0" />
                      ) : (
                        <div className="w-10 h-14 bg-amber-100 rounded flex items-center justify-center shrink-0">
                          <BookMarked className="w-4 h-4 text-amber-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-0.5 group-hover:text-amber-700 transition-colors">{book.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{book.authors.join(', ')}</p>
                        <p className="text-xs text-gray-400">下载 {book.downloadCount.toLocaleString()} 次</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : loadingDailyBooks ? (
                <p className="text-xs text-gray-400">正在拉取今日书单…</p>
              ) : (
                <p className="text-xs text-gray-400">今日书单暂不可用，可在下方手动加载</p>
              )}
            </div>
          )}
        </div>

        {/* 手动探索更多 */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            手动探索更多
          </h3>
          <p className="text-xs text-gray-400">今日推荐之外，可按主题关键词即时搜索新闻 / Wikipedia，或加载完整 Gutenberg 书单</p>
        </div>

        {/* 主题搜索框 */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={corpusTopic}
              onChange={e => setCorpusTopic(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (supportsWikipedia(corpusLang)) handleTopicWiki();
                  else if (supportsGutenberg(corpusLang)) handleLoadGutenberg();
                }
              }}
              placeholder="输入主题关键词（如 Einstein / Mozart / coffee）可留空随机"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
            />
          </div>
        </div>

        {/* ============ 新闻时事区块 ============ */}
        {supportsNews(corpusLang) && (
          <div className="card-gradient p-6 mb-6 border-l-4 border-red-400">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold text-gray-800">新闻时事</h3>
                <span className="text-xs text-gray-400">
                  · {languageNames[corpusLang]} ·{' '}
                  {getNewsSourcesByLanguage(corpusLang).map(s => s.name).join(' / ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={newsKeyword}
                    onChange={e => setNewsKeyword(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSearchNews(); }}
                    placeholder="关键词筛选（如 AI / climate / election）"
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none text-xs w-56"
                  />
                </div>
                <button
                  onClick={handleSearchNews}
                  disabled={loadingNews}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  筛选
                </button>
                <button
                  onClick={handleLoadNews}
                  disabled={loadingNews}
                  className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {loadingNews ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radio className="w-3.5 h-3.5" />}
                  {newsItems.length > 0 ? '刷新头条' : '加载头条'}
                </button>
              </div>
            </div>

            {newsError && <p className="text-sm text-red-500 mb-3">{newsError}</p>}

            {newsItems.length > 0 ? (
              <div className="space-y-2">
                {newsItems.map(news => (
                  <div
                    key={news.id}
                    onClick={() => handleOpenNews(news)}
                    className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-red-300 hover:shadow-md cursor-pointer transition-all group"
                  >
                    {news.thumbnail ? (
                      <img
                        src={news.thumbnail}
                        alt={news.title}
                        className="w-16 h-16 object-cover rounded shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-red-50 rounded flex items-center justify-center shrink-0">
                        <Newspaper className="w-5 h-5 text-red-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-xs font-medium shrink-0">
                          {news.sourceName}
                        </span>
                        <span className={`px-1.5 py-0.5 text-white rounded text-xs shrink-0 ${categoryColors[news.category]}`}>
                          {categoryLabels[news.category]}
                        </span>
                        {news.pubDate && (
                          <span className="text-xs text-gray-400 shrink-0">
                            {new Date(news.pubDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
                        {news.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{news.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all shrink-0 self-center" />
                  </div>
                ))}
                <p className="text-xs text-gray-400 pt-1">
                  点击任意新闻进入精读：点词查义、影子跟读。新闻内容版权归原媒体所有，仅供个人学习使用。
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                点击「加载头条」拉取 {languageNames[corpusLang]} 最新新闻，支持按关键词筛选时事热点。每条新闻可进入精读模式，自动清洗 HTML 并按句分段。
              </p>
            )}
          </div>
        )}

        {/* Wikipedia 区块 */}
        {supportsWikipedia(corpusLang) && (
          <div className="card-gradient p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-800">Wikipedia 百科</h3>
                <span className="text-xs text-gray-400">· {languageNames[corpusLang]} · 实时拉取</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRandomWiki}
                  disabled={loadingWiki}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingWiki ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  随机一篇
                </button>
                <button
                  onClick={handleTopicWiki}
                  disabled={loadingWiki || !corpusTopic.trim()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  按主题搜索
                </button>
              </div>
            </div>
            {wikiError && (
              <p className="text-sm text-red-500 mb-3">{wikiError}</p>
            )}

            {/* Wikipedia 搜索结果列表 */}
            {wikiSearchResults.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">
                  搜索「{corpusTopic}」找到 <span className="font-bold text-blue-600">{wikiSearchResults.length}</span> 条相关条目，点击进入精读：
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {wikiSearchResults.map(result => (
                    <button
                      key={result.title}
                      onClick={() => handleOpenWikiResult(result.title)}
                      disabled={loadingWikiResult === result.title}
                      className="flex gap-2 p-2.5 bg-white rounded-lg border border-gray-100 hover:border-blue-300 hover:shadow text-left transition-all group disabled:opacity-50"
                    >
                      {loadingWikiResult === result.title ? (
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0 mt-0.5" />
                      ) : (
                        <Globe className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">{result.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{result.snippet}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400">
              拉取后可直接进入阅读：点击任意单词查义，文末有影子跟读。Wikipedia 内容采用 CC BY-SA 协议。
            </p>
          </div>
        )}

        {/* Gutenberg 区块 */}
        {supportsGutenberg(corpusLang) && (
          <div className="card-gradient p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-gray-800">Project Gutenberg 经典文学</h3>
                <span className="text-xs text-gray-400">· {languageNames[corpusLang]} · 公版全书</span>
              </div>
              <button
                onClick={handleLoadGutenberg}
                disabled={loadingGutenberg}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loadingGutenberg ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                加载书单
              </button>
            </div>

            {gutenbergBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gutenbergBooks.map(book => (
                  <div
                    key={book.id}
                    onClick={() => handleOpenBook(book)}
                    className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-amber-300 hover:shadow-md cursor-pointer transition-all"
                  >
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded shrink-0" />
                    ) : (
                      <div className="w-12 h-16 bg-amber-100 rounded flex items-center justify-center shrink-0">
                        <BookMarked className="w-5 h-5 text-amber-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{book.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-1">{book.authors.join(', ')}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>下载 {book.downloadCount.toLocaleString()} 次</span>
                        {loadingBookText === book.id && <Loader2 className="w-3 h-3 animate-spin text-amber-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                点击「加载书单」拉取该语种热门公版书，再点任意书目进入精读（截取前2-3段，适合中高级学习者）。
              </p>
            )}
          </div>
        )}

        {/* 既不支持 Wiki 也不支持 Gutenberg 的语种提示 */}
        {!supportsWikipedia(corpusLang) && !supportsGutenberg(corpusLang) && (
          <div className="card-gradient p-6 text-center">
            <p className="text-gray-500 text-sm">
              该语种暂未接入外部免费语料源，请使用上方内置文章或切换到英/德/法等语种。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
