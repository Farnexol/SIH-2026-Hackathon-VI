import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { AnimatedNumber } from './animations';

export default function StatCard({
  title,
  value,
  subtext,
  delta,
  deltaType = 'positive',
  icon: Icon,
  iconBg = 'bg-blue-50 text-blue-600',
  className = ''
}) {
  // Check if value has a number or percentage
  const match = String(value).match(/^(\d+)(.*)$/);
  const numericValue = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';

  return (
    <div className={`premium-card bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          {Icon && (
            <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          {numericValue !== null ? (
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              <AnimatedNumber value={numericValue} suffix={suffix} />
            </span>
          ) : (
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {value}
            </span>
          )}
          {subtext && (
            <span className="text-xs text-slate-500 font-medium">{subtext}</span>
          )}
        </div>
      </div>

      {delta && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
          {deltaType === 'positive' && (
            <span className="inline-flex items-center text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              {delta}
            </span>
          )}
          {deltaType === 'negative' && (
            <span className="inline-flex items-center text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
              <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-rose-600" />
              {delta}
            </span>
          )}
          {deltaType === 'neutral' && (
            <span className="inline-flex items-center text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
              <Minus className="w-3.5 h-3.5 mr-1" />
              {delta}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
