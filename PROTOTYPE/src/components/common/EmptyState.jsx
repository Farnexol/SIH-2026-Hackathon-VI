import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No items found',
  description = 'There are no records matching your current filter criteria.',
  icon: Icon = Inbox,
  actionText,
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-200 bg-white/50 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">{description}</p>
      {actionText && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
