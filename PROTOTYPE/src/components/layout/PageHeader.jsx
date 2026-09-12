import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  children
}) {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center pt-2 md:pt-0">
            {actions}
          </div>
        )}
      </div>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
