import { Home, BookOpen, TrendingUp, Users, User, LogOut, GraduationCap, Brain, Target, Newspaper } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
}

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/courses', icon: BookOpen, label: '课程中心' },
  { path: '/assessment', icon: Brain, label: '能力测评' },
  { path: '/reading', icon: Newspaper, label: '阅读中心' },
  { path: '/learning-plan', icon: Target, label: '学习计划' },
  { path: '/progress', icon: TrendingUp, label: '学习进度' },
  { path: '/community', icon: Users, label: '社区交流' },
  { path: '/profile', icon: User, label: '用户中心' },
];

export const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-display text-xl font-bold text-gray-800">LanguageLearn</h1>
              <p className="text-xs text-gray-500">多语种学习平台</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        {user && (
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{user.nickname}</p>
                <p className="text-xs text-gray-500">{user.streakDays}天连续学习</p>
              </div>
            )}
          </div>
        )}
        {!collapsed && (
          <button
            onClick={logout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>退出登录</span>
          </button>
        )}
      </div>
    </aside>
  );
};
