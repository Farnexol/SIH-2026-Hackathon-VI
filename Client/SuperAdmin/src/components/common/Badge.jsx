import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    strong: "bg-emerald-50 text-emerald-700 border-emerald-200",
    moderate: "bg-amber-50 text-amber-700 border-amber-200",
    gap: "bg-rose-50 text-rose-700 border-rose-200",
    igot: "bg-indigo-50 text-indigo-700 border-indigo-200",
    default: "bg-slate-100 text-slate-700 border-slate-200",
    primary: "bg-blue-50 text-blue-700 border-blue-200"
  };

  return (
    <span className={twMerge(clsx("text-xs font-bold px-2.5 py-0.5 rounded-full border", variants[variant], className))}>
      {children}
    </span>
  );
}
