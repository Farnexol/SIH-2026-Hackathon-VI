import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({
  message = 'Loading data...',
  size = 'md',
  className = ''
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size] || sizeClasses.md}`} />
      {message && <p className="mt-3 text-xs font-medium text-slate-500">{message}</p>}
    </div>
  );
}
