import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Circle, Clock, Compass, Zap, Target } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export default function AIInsightCard({ insight }) {
  const { openAiAdvisor } = useAuth();

  if (!insight) return null;

  const getStepIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-600 shrink-0 animate-pulse" />;
      default:
        return <Circle className="w-4 h-4 text-slate-300 shrink-0" />;
    }
  };

  return (
    <div className="ai-glow-card rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 shadow-sm">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-blue-100/90 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                AI Learning Advisor
              </h2>
              <span className="text-[11px] bg-blue-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                OSSF Calibrated
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Autonomous curriculum mapping for official statistical cadre
            </p>
          </div>
        </div>

        <button
          onClick={openAiAdvisor}
          className="text-xs sm:text-sm text-blue-700 font-bold hover:text-blue-900 inline-flex items-center gap-1.5 self-start sm:self-center cursor-pointer hover:underline"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Launch AI Dialogue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Body */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left: AI Diagnosis & CTA */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 bg-white/95 rounded-2xl border border-blue-100/90 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Highest Priority Gap Detected
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {insight.headline}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {insight.advisorRationale}
            </p>

            {/* Gap Metric Snapshot */}
            <div className="pt-2 flex items-center gap-6 text-xs font-mono border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px] font-sans">Current Level</span>
                <span className="text-base font-bold text-slate-800">
                  {typeof insight.currentLevel !== 'undefined' ? `${insight.currentLevel}%` : '0%'}
                </span>
              </div>
              <div className="text-slate-400 font-sans">&rarr;</div>
              <div>
                <span className="text-slate-400 block text-[11px] font-sans">Required Benchmark</span>
                <span className="text-base font-bold text-emerald-600">
                  {insight.requiredBenchmark ? `${insight.requiredBenchmark}%` : '80%'}
                </span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[11px] font-sans">Deficit to Close</span>
                <span className="text-base font-bold text-rose-600">
                  {typeof insight.deficit !== 'undefined' ? `${insight.deficit}%` : '-80%'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link to={insight.actionRoute || '/learning-path'}>
              <Button size="lg" icon={Compass} className="shadow-md shadow-blue-600/20">
                {insight.actionButtonText || 'Start Recommended Path'}
              </Button>
            </Link>
            <Link
              to="/courses"
              className="text-sm font-semibold text-slate-700 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Explore iGOT Catalog</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Right: Sequential Steps */}
        <div className="lg:col-span-5 bg-white/95 rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1">
            AI Recommended Learning Sequence:
          </p>
          <div className="space-y-2.5">
            {insight.recommendedNextSteps.map((step) => (
              <div
                key={step.step}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getStepIcon(step.status)}
                  <span
                    className={`text-sm font-medium truncate ${
                      step.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-800 font-semibold'
                    }`}
                  >
                    {step.step}. {step.title}
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-md shrink-0 ml-2 ${
                    step.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : step.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
