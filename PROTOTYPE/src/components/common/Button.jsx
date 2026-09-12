import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  icon: Icon,
  className = '',
  ...props
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2 text-sm font-medium gap-2',
    lg: 'px-5 py-2.5 text-base font-semibold gap-2.5'
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm border border-transparent focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-sm border border-transparent focus:ring-2 focus:ring-slate-700 focus:ring-offset-2',
    outline: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 border border-transparent',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm border border-transparent focus:ring-2 focus:ring-rose-500 focus:ring-offset-2',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm border border-transparent focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
    accent: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm border border-transparent focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg transition-colors duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
