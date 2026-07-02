import { useState } from 'react';
import { Mail, Bell, Shield, Globe, Palette, Edit, Save, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { languageNames } from '../types';

export const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nickname: user?.nickname || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    if (user) {
      updateUser({ ...user, nickname: editData.nickname, email: editData.email });
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">请先登录</p>
      </div>
    );
  }

  const menuItems = [
    { icon: Bell, label: '通知设置', description: '管理学习提醒和消息通知' },
    { icon: Shield, label: '账号安全', description: '修改密码和安全设置' },
    { icon: Globe, label: '语言偏好', description: '设置学习语言和界面语言' },
    { icon: Palette, label: '主题设置', description: '调整界面颜色和样式' },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">用户中心</h1>
        <p className="text-gray-500">管理你的个人信息和设置</p>
      </section>

      <section className="card-gradient p-8">
        <div className="flex items-center gap-8">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary-200"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
              <Edit className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">昵称</label>
                  <input
                    type="text"
                    value={editData.nickname}
                    onChange={e => setEditData(prev => ({ ...prev, nickname: e.target.value }))}
                    className="input-field px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={e => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field px-4"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    <Save className="w-4 h-4 inline mr-2" />
                    保存
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{user.nickname}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <Mail className="w-5 h-5" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 rounded-full bg-primary-100 text-primary-600 text-sm font-medium">
                    {languageNames[user.preferredLanguage]}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-accent-100 text-accent-600 text-sm font-medium">
                    连续 {user.streakDays} 天
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="card-gradient p-8">
        <h3 className="font-semibold text-gray-800 mb-6">账户设置</h3>
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center">
                <item.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </section>

      <section className="card-gradient p-8">
        <h3 className="font-semibold text-gray-800 mb-6">学习统计</h3>
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: '注册日期', value: user.createdAt },
            { label: '学习时长', value: `${Math.floor(user.totalLearningTime / 60)}小时${user.totalLearningTime % 60}分钟` },
            { label: '完成课程', value: user.completedCourses },
            { label: '掌握单词', value: user.masteredWords },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-gradient p-8">
        <button
          onClick={logout}
          className="w-full py-4 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
        >
          退出登录
        </button>
      </section>
    </div>
  );
};
