import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, Play, CheckCircle2, ChevronRight } from 'lucide-react';
import { getCourseById } from '../data/courses';
import { moduleTypeNames, languageNames, levelNames } from '../types';

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = getCourseById(id || '');

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

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回课程列表</span>
      </button>

      <section className="relative rounded-3xl overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              course.language === 'english' ? 'bg-blue-500' :
              course.language === 'japanese' ? 'bg-red-500' : 'bg-green-500'
            } text-white`}>
              {languageNames[course.language]}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur">
              {levelNames[course.level]}
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-4">{course.title}</h1>
          <p className="text-white/80 text-lg max-w-2xl">{course.description}</p>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-6">
        <div className="card-gradient p-6 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{course.duration}</p>
          <p className="text-gray-500">小时</p>
        </div>
        <div className="card-gradient p-6 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-accent-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{course.students.toLocaleString()}</p>
          <p className="text-gray-500">学员</p>
        </div>
        <div className="card-gradient p-6 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-warning-100 to-warning-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-7 h-7 text-warning-600 fill-current" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{course.rating}</p>
          <p className="text-gray-500">评分</p>
        </div>
        <div className="card-gradient p-6 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-success-100 to-success-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-success-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{course.progress}%</p>
          <p className="text-gray-500">进度</p>
        </div>
      </div>

      <section className="card-gradient p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">课程大纲</h2>
        
        <div className="space-y-4">
          {course.modules.map((module, index) => {
            return (
              <div
                key={module.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                  module.completed
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-white border-2 border-gray-100 hover:border-primary-200'
                }`}
                onClick={() => navigate(`/learn/${course.id}/${module.id}`)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  module.completed
                    ? 'bg-green-500'
                    : 'bg-gradient-to-br from-primary-500 to-accent-500'
                }`}>
                  {module.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-bold">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-800">{module.title}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-600">
                      {moduleTypeNames[module.type as keyof typeof moduleTypeNames]}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{module.duration}小时</p>
                </div>

                <div className="flex items-center gap-2">
                  {module.completed ? (
                    <span className="text-green-600 font-medium">已完成</span>
                  ) : (
                    <span className="text-gray-400">点击开始</span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            const nextModule = course.modules.find(m => !m.completed);
            if (nextModule) {
              navigate(`/learn/${course.id}/${nextModule.id}`);
            } else {
              navigate(`/learn/${course.id}/${course.modules[0].id}`);
            }
          }}
          className="mt-8 w-full btn-primary flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          <span>开始学习</span>
        </button>
      </section>

      <section className="card-gradient p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">学习目标</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-primary-50">
            <p className="font-semibold text-gray-800">掌握基础词汇</p>
            <p className="text-gray-500 text-sm mt-1">学习常用单词和短语</p>
          </div>
          <div className="p-4 rounded-xl bg-accent-50">
            <p className="font-semibold text-gray-800">提高语法水平</p>
            <p className="text-gray-500 text-sm mt-1">掌握核心语法规则</p>
          </div>
          <div className="p-4 rounded-xl bg-success-50">
            <p className="font-semibold text-gray-800">增强听说能力</p>
            <p className="text-gray-500 text-sm mt-1">提升口语和听力技能</p>
          </div>
        </div>
      </section>
    </div>
  );
};
