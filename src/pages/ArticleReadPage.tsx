import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getCourseById } from '../data/courses';
import { getReadingArticleById } from '../data/reading';
import { ReadingModule } from '../components/LearningModules/ReadingModule';
import type { Course, CourseModule, ReadingArticle } from '../types';

// 阅读中心进入文章学习时，需要一个虚拟 course + module 作为上下文（用于奖励/进度保存）
const dummyCourse: Course = {
  id: 'reading-hub',
  title: '阅读中心',
  language: 'english',
  level: 'beginner',
  description: '阅读中心独立文章学习',
  duration: 0,
  progress: 0,
  image: '',
  rating: 0,
  students: 0,
  modules: [],
};

const dummyModule: CourseModule = {
  id: 'reading-hub-article',
  title: '阅读理解',
  type: 'reading',
  duration: 0,
  completed: false,
};

export const ArticleReadPage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  // 外部语料动态生成的文章通过路由 state 传入
  const dynamicArticle = (location.state as { article?: ReadingArticle } | null)?.article || undefined;

  const article = dynamicArticle
    || (articleId ? getReadingArticleById(articleId) : undefined);

  if (!article) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">文章不存在</p>
        <button onClick={() => navigate('/reading')} className="mt-4 btn-primary">
          返回阅读中心
        </button>
      </div>
    );
  }

  // 根据文章语言匹配一个真实课程作为上下文（用于发音语言代码、奖励归属）
  const matchedCourse = getCourseById(`${article.language.slice(0, 2)}-beginner-1`)
    || dummyCourse;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/reading')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回阅读中心</span>
      </button>

      <div className="card-gradient p-8">
        <ReadingModule
          course={{ ...matchedCourse, language: article.language, level: article.level }}
          module={{ ...dummyModule, title: article.title, duration: article.estimatedMinutes }}
          articleId={article.id}
          article={dynamicArticle}
        />
      </div>
    </div>
  );
};
