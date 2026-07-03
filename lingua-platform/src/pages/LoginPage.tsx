import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('请填写所有字段');
      return;
    }

    const success = login(formData);
    if (success) {
      navigate('/');
    } else {
      setError('邮箱或密码错误');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-800">LanguageLearn</h1>
          <p className="text-gray-500 mt-2">多语种学习平台</p>
        </div>

        <div className="card-gradient p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">欢迎回来</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入邮箱"
                  className="input-field pl-12 pr-4"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="请输入密码"
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
              <span>登录</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            还没有账号？{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary-600 font-medium hover:underline"
            >
              立即注册
            </button>
          </p>

          <div className="mt-8">
            <p className="text-center text-sm text-gray-500 mb-4">或使用以下方式登录</p>
            <div className="flex gap-4">
              <button className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <span>Google</span>
              </button>
              <button className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          登录即表示同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
};
