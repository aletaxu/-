import { Clock, BookOpen, Target, Flame, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/Cards/StatCard';
import { AchievementCard } from '../components/Cards/AchievementCard';
import { achievements } from '../data/achievements';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export const ProgressPage = () => {
  const { user } = useAuth();

  const weeklyData = [25, 30, 20, 35, 28, 40, 32];

  const lineChartData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '学习时长（分钟）',
        data: weeklyData,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#7c3aed',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['英语', '日语', '韩语'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ['#3b82f6', '#ef4444', '#22c55e'],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
          },
        },
      },
    },
    cutout: '70%',
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">学习进度</h1>
        <p className="text-gray-500">追踪你的学习成果，见证成长历程</p>
      </section>

      <section className="grid grid-cols-4 gap-6">
        <StatCard
          title="学习时长"
          value={user ? `${Math.floor(user.totalLearningTime / 60)}小时${user.totalLearningTime % 60}分钟` : '0小时'}
          icon={Clock}
          gradient="bg-gradient-to-br from-primary-500 to-primary-600"
        />
        <StatCard
          title="完成课程"
          value={user?.completedCourses || 0}
          icon={BookOpen}
          gradient="bg-gradient-to-br from-accent-400 to-accent-500"
        />
        <StatCard
          title="掌握单词"
          value={user?.masteredWords || 0}
          icon={Target}
          gradient="bg-gradient-to-br from-success-400 to-success-500"
        />
        <StatCard
          title="连续学习"
          value={`${user?.streakDays || 0}天`}
          icon={Flame}
          gradient="bg-gradient-to-br from-warning-400 to-warning-500"
        />
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section className="card-gradient p-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-800">本周学习趋势</h2>
          </div>
          <div className="h-64">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </section>

        <section className="card-gradient p-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-accent-600" />
            <h2 className="text-xl font-bold text-gray-800">语言学习分布</h2>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48">
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </div>
        </section>
      </div>

      <section className="card-gradient p-8">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-6 h-6 text-warning-600" />
          <h2 className="text-xl font-bold text-gray-800">成就徽章</h2>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 mb-4">已解锁 ({unlockedAchievements.length})</h3>
          <div className="grid grid-cols-2 gap-4">
            {unlockedAchievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} showAnimation={index === 0} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-4">待解锁 ({lockedAchievements.length})</h3>
          <div className="grid grid-cols-2 gap-4">
            {lockedAchievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      </section>

      <section className="card-gradient p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">学习报告</h2>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-primary-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">本周总结</h3>
            <p className="text-3xl font-bold text-primary-600 mb-2">14小时</p>
            <p className="text-sm text-gray-500">比上周增加 15%</p>
          </div>
          <div className="p-6 bg-accent-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">学习效率</h3>
            <p className="text-3xl font-bold text-accent-600 mb-2">85%</p>
            <p className="text-sm text-gray-500">完成度高于平均水平</p>
          </div>
          <div className="p-6 bg-success-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">预计达成</h3>
            <p className="text-3xl font-bold text-success-600 mb-2">30天</p>
            <p className="text-sm text-gray-500">完成当前学习目标</p>
          </div>
        </div>
      </section>
    </div>
  );
};
