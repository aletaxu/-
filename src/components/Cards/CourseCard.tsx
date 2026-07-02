import { Clock, Users, Star, ArrowRight } from 'lucide-react';
import type { Course } from '../../types';
import { languageNames, levelNames } from '../../types';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="card-gradient card-hover cursor-pointer overflow-hidden group"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.language === 'english' ? 'bg-blue-500' :
            course.language === 'japanese' ? 'bg-red-500' : 'bg-green-500'
          } text-white`}>
            {languageNames[course.language]}
          </span>
          <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
            {levelNames[course.level]}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration}小时
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.students.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              {course.rating}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">学习进度</span>
            <span className="font-medium text-primary-600">{course.progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        <button className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span>继续学习</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
