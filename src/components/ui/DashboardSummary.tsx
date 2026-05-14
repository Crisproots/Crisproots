import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  color: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  description
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center text-sm font-medium ${
            change.type === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.type === 'increase' ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(change.value)}%
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

interface DashboardSummaryProps {
  stats: Array<{
    title: string;
    value: string | number;
    change?: {
      value: number;
      type: 'increase' | 'decrease';
    };
    icon: LucideIcon;
    color: string;
    description?: string;
  }>;
  title?: string;
  subtitle?: string;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  stats,
  title = "Dashboard Overview",
  subtitle = "Real-time insights from your farm operations"
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSummary;
