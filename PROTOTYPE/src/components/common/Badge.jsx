import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon
}) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    strong: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    moderate: 'bg-amber-50 text-amber-700 border border-amber-200',
    gap: 'bg-rose-50 text-rose-700 border border-rose-200',
    high: 'bg-rose-50 text-rose-700 border border-rose-200',
    medium: 'bg-amber-50 text-amber-700 border border-amber-200',
    low: 'bg-blue-50 text-blue-700 border border-blue-200',
    primary: 'bg-blue-50 text-blue-700 border border-blue-200',
    igot: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}
