import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all focus:outline-hidden";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 rounded-xl",
    secondary: "bg-slate-900 hover:bg-slate-800 text-white rounded-xl",
    outline: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-xl",
    ghost: "hover:bg-slate-100 text-slate-600 rounded-xl",
    danger: "bg-rose-600 hover:bg-rose-700 text-white rounded-xl",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {Icon && <Icon className={clsx("w-4 h-4", children && "mr-2")} />}
      {children}
    </button>
  );
}
