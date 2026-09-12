import React from 'react';
import { AnimatedProgress } from './animations';

export default function ProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  size = 'md',
  color = 'blue',
  className = '',
  label = ''
}) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizeClasses = {
    xs: 'h-2',
    sm: 'h-2.5',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-600'
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-slate-700 mb-2">
          <span>{label}</span>
          <span className="tabular-nums font-bold text-slate-900">{percentage}%</span>
        </div>
      )}
      <AnimatedProgress
        value={value}
        max={max}
        colorClass={colorClasses[color] || colorClasses.blue}
        className={sizeClasses[size] || sizeClasses.md}
      />
    </div>
  );
}
