import React from 'react';
import { Sparkles, ArrowRight, Target, GraduationCap, ClipboardCheck, TrendingUp } from 'lucide-react';

interface CompetencyLoopBannerProps {
  currentStep?: 'PROFILE' | 'GAP' | 'RECOMMENDATION' | 'LEARNING' | 'ASSESSMENT' | 'UPDATE';
}

export const CompetencyLoopBanner: React.FC<CompetencyLoopBannerProps> = ({ currentStep = 'GAP' }) => {
  const steps = [
    { key: 'GAP', label: '1. Skill Gap Engine', icon: Target, desc: 'AI Diagnosis' },
    { key: 'RECOMMENDATION', label: '2. Recommendations', icon: GraduationCap, desc: 'iGOT & NSSTA' },
    { key: 'ASSESSMENT', label: '3. RAG Mock Test', icon: ClipboardCheck, desc: 'Auto-Evaluated' },
    { key: 'UPDATE', label: '4. Continuous Growth', icon: TrendingUp, desc: 'Scores Auto-Update' },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 border border-brand-500/20 bg-gradient-to-r from-brand-950/40 via-slate-900/60 to-accent-indigo/10 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Continuous Competency Improvement Engine
            </h3>
            <p className="text-xs text-slate-400">
              Closed-loop statistical workforce capability enhancement
            </p>
          </div>
        </div>
        <div className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          Loop Active
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = s.key === currentStep;

          return (
            <div
              key={s.key}
              className={`p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-brand-600/20 border-brand-400 text-white shadow-md shadow-brand-500/10'
                  : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span className={isActive ? 'text-white' : 'text-slate-300'}>{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-600 hidden lg:block" />
                )}
              </div>
              <p className="text-[11px] text-slate-400">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
