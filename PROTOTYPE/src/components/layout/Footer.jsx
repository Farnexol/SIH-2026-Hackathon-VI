import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-slate-200/80 text-xs text-slate-500 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">StatIQ</span>
          <span className="text-slate-300">•</span>
          <span>AI-Powered Competency &amp; Learning Platform</span>
          <span className="text-slate-300">•</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-mono font-medium">
            SIH 2026 Prototype
          </span>
        </div>
        <p className="text-[11px] text-slate-400 text-center sm:text-right">
          Designed for India&apos;s Official Statistical System. Aligned with iGOT Karmayogi capacity building standards.
        </p>
      </div>
    </footer>
  );
}
