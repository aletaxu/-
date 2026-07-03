import { useState } from 'react';
import { Search, Filter, Globe, Trophy } from 'lucide-react';
import { CourseCard } from '../components/Cards/CourseCard';
import { courses } from '../data/courses';
import { languageNames, levelNames, languageFlags } from '../types';
import type { Language } from '../types';

export const CoursesPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => {
    const matchesLanguage = selectedLanguage === 'all' || course.language === selectedLanguage;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesSearch = searchQuery === '' || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLanguage && matchesLevel && matchesSearch;
  });

  const languages: { value: string; label: string; flag: string }[] = [
    { value: 'all', label: '全部', flag: '🌐' },
    ...Object.entries(languageNames).map(([key, name]) => ({
      value: key,
      label: name,
      flag: languageFlags[key as Language],
    })),
  ];

  const levels = [
    { value: 'all', label: '全部级别' },
    { value: 'beginner', label: levelNames.beginner },
    { value: 'intermediate', label: levelNames.intermediate },
    { value: 'advanced', label: levelNames.advanced },
    { value: 'master', label: levelNames.master },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">课程中心</h1>
        <p className="text-gray-500">探索丰富的课程，找到适合你的学习路径</p>
      </section>

      <section className="card-gradient p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索课程..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field pl-12 pr-4"
            />
          </div>

          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="input-field w-40 px-4"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="input-field w-36 px-4"
            >
              {levels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">没有找到匹配的课程</h3>
          <p className="text-gray-500">试试调整筛选条件或搜索关键词</p>
        </div>
      )}

      <section className="card-gradient p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">不知道从哪里开始？</h3>
            <p className="text-gray-500">我们可以根据你的水平和目标，为你推荐个性化的学习路径</p>
          </div>
          <button className="btn-primary">
            开始测试
          </button>
        </div>
      </section>
    </div>
  );
};
