import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  subtext?: string;
  iconColor?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'up',
  icon: Icon,
  subtext,
  iconColor = 'text-brand-600 bg-brand-50',
  className,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-4 transition-all duration-150 hover:border-slate-300 hover:shadow-card-hover relative overflow-hidden',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={cn('p-2 rounded-lg shrink-0', iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
        {change && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-semibold',
              trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-500'
            )}
          >
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 mr-0.5 inline" />}
            {change}
          </span>
        )}
      </div>

      {subtext && <p className="mt-1 text-[11px] text-slate-400 font-medium">{subtext}</p>}
    </Card>
  );
};
