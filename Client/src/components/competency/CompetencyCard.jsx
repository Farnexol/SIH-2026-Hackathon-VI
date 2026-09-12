import React from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

export default function CompetencyCard({ competency, onOpenDetail, onAction }) {
  const isDeficit = competency.currentScore < competency.requiredScore;
  const gapValue = isDeficit ? competency.requiredScore - competency.currentScore : 0;

  const getLevelBadge = (level) => {
    switch (level) {
      case 'Strong':
        return <Badge variant="strong" size="sm">Strong</Badge>;
      case 'Moderate':
        return <Badge variant="moderate" size="sm">Moderate</Badge>;
      case 'Needs Improvement':
      default:
        return <Badge variant="gap" size="sm">Needs Improvement</Badge>;
    }
  };

  const getProgressColor = (level) => {
    if (level === 'Strong') return 'emerald';
    if (level === 'Moderate') return 'amber';
    return 'rose';
  };

  return (
    <div className="premium-card bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        {/* Header: Category & Status */}
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {competency.category}
          </span>
          {getLevelBadge(competency.level)}
        </div>

        {/* Competency Name */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {competency.name}
          </h3>
        </div>

        {/* Visually Dominant Score */}
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              Proficiency Level
            </span>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {competency.currentScore}%
              </span>
              <span className="text-xs text-slate-400">/ Target: {competency.requiredScore}%</span>
            </div>
          </div>

          <ProgressBar
            value={competency.currentScore}
            max={100}
            size="md"
            color={getProgressColor(competency.level)}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            {/* Trend */}
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-slate-400">Trend:</span>
              {competency.trendDirection === 'up' ? (
                <span className="inline-flex items-center text-emerald-600 font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {competency.trend}
                </span>
              ) : (
                <span className="inline-flex items-center text-rose-600 font-bold">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {competency.trend}
                </span>
              )}
            </div>

            {/* Gap */}
            {isDeficit ? (
              <span className="font-bold text-rose-600 inline-flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Gap: -{gapValue}%
              </span>
            ) : (
              <span className="font-bold text-emerald-600 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Target Satisfied
              </span>
            )}
          </div>
        </div>

        {/* Action Recommendation */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          <strong>Recommended: </strong>{competency.recommendedAction}
        </p>
      </div>

      {/* Footer Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onOpenDetail(competency)}
          className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer text-center"
        >
          View Diagnostics
        </button>

        <button
          type="button"
          onClick={() => onAction(competency)}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isDeficit
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <span>{isDeficit ? 'Improve Skill' : 'Explore Advanced'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
