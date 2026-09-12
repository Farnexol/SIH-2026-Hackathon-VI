import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function StatCard({ title, value, subtext, delta, deltaType, icon: Icon, iconBg }) {
  return (
    <div className="premium-card bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={twMerge(clsx("p-3 rounded-xl", iconBg || "bg-blue-50 text-blue-600"))}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {(subtext || delta) && (
        <div className="mt-4 flex items-center justify-between text-xs font-medium">
          {subtext && <span className="text-slate-500">{subtext}</span>}
          {delta && (
            <span className={clsx(
              deltaType === 'positive' && "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md",
              deltaType === 'negative' && "text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md",
              deltaType === 'neutral' && "text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md"
            )}>
              {delta}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
