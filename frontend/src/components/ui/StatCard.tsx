import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'brand' | 'emerald' | 'amber' | 'rose' | 'indigo';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'brand',
}) => {
  const colorMap = {
    brand: 'from-brand-500/20 to-brand-700/10 text-brand-400 border-brand-500/30',
    emerald: 'from-emerald-500/20 to-emerald-700/10 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-700/10 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-rose-700/10 text-rose-400 border-rose-500/30',
    indigo: 'from-accent-indigo/20 to-accent-indigo/5 text-accent-indigo border-accent-indigo/30',
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorMap[color]} border shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};
