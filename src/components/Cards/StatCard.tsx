import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  trend?: { value: number; positive: boolean };
}

export const StatCard = ({ title, value, icon: Icon, gradient, trend }: StatCardProps) => {
  return (
    <div className="card-gradient p-6 card-hover">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-sm font-medium ${
            trend.positive ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-gray-500 text-sm mt-1">{title}</p>
      </div>
    </div>
  );
};
