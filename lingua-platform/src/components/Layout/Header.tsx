import { Menu, Search, Bell, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, checkIn, hasCheckedInToday } = useAuth();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索课程、单词..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-80 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:outline-none transition-colors bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <button
            onClick={checkIn}
            disabled={hasCheckedInToday}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              hasCheckedInToday
                ? 'bg-green-100 text-green-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-accent-400 to-accent-500 text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{hasCheckedInToday ? '已打卡' : '今日打卡'}</span>
          </button>
        )}

        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="font-medium text-gray-800">{user.nickname}</p>
              <p className="text-xs text-gray-500">连续 {user.streakDays} 天</p>
            </div>
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
            />
          </div>
        )}
      </div>
    </header>
  );
};
