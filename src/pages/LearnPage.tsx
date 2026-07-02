import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { getCourseById } from '../data/courses';
import { VocabularyModule } from '../components/LearningModules/VocabularyModule';
import { GrammarModule } from '../components/LearningModules/GrammarModule';
import { SpeakingModule } from '../components/LearningModules/SpeakingModule';
import { ListeningModule } from '../components/LearningModules/ListeningModule';
import { ReadingModule } from '../components/LearningModules/ReadingModule';

export const LearnPage = () => {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const navigate = useNavigate();
  
  const course = getCourseById(courseId || '');
  
  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">课程不存在</p>
        <button onClick={() => navigate('/courses')} className="mt-4 btn-primary">
          返回课程列表
        </button>
      </div>
    );
  }

  const currentModule = course.modules.find(m => m.id === moduleId);
  
  if (!currentModule) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">学习模块不存在</p>
        <button onClick={() => navigate(`/courses/${courseId}`)} className="mt-4 btn-primary">
          返回课程详情
        </button>
      </div>
    );
  }

  const currentIndex = course.modules.findIndex(m => m.id === moduleId);
  const prevModule = currentIndex > 0 ? course.modules[currentIndex - 1] : null;
  const nextModule = currentIndex < course.modules.length - 1 ? course.modules[currentIndex + 1] : null;

  const renderModule = () => {
    switch (currentModule.type) {
      case 'vocabulary':
        return <VocabularyModule course={course} module={currentModule} />;
      case 'grammar':
        return <GrammarModule course={course} module={currentModule} />;
      case 'speaking':
        return <SpeakingModule course={course} module={currentModule} />;
      case 'listening':
        return <ListeningModule course={course} module={currentModule} />;
      case 'reading':
        return <ReadingModule course={course} module={currentModule} />;
      default:
        return <VocabularyModule course={course} module={currentModule} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回课程详情</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/learn/${courseId}/${currentModule.id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新开始</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {course.modules.map((module) => (
          <div
            key={module.id}
            className={`flex-1 h-2 rounded-full transition-all ${
              module.id === moduleId
                ? 'bg-gradient-to-r from-primary-500 to-accent-500'
                : module.completed
                ? 'bg-green-500'
                : 'bg-gray-200'
            }`}
          ></div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {course.modules.map((module, index) => (
          <span
            key={module.id}
            className={`text-sm font-medium ${
              module.id === moduleId
                ? 'text-primary-600'
                : module.completed
                ? 'text-green-600'
                : 'text-gray-400'
            }`}
          >
            {index + 1}
          </span>
        ))}
      </div>

      <div className="card-gradient p-8">
        {renderModule()}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => prevModule && navigate(`/learn/${courseId}/${prevModule.id}`)}
          disabled={!prevModule}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            prevModule
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>上一个模块</span>
        </button>

        <button
          onClick={() => nextModule && navigate(`/learn/${courseId}/${nextModule.id}`)}
          disabled={!nextModule}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            nextModule
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>下一个模块</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
