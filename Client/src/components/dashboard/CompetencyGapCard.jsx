import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Target } from 'lucide-react';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

export default function CompetencyGapCard({ gaps = [] }) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge variant="high" size="sm">High Priority</Badge>;
      case 'Medium':
        return <Badge variant="medium" size="sm">Medium Priority</Badge>;
      case 'Low':
      default:
        return <Badge variant="low" size="sm">Low Priority</Badge>;
    }
  };

  const getProgressColor = (priority) => {
    if (priority === 'High') return 'rose';
    if (priority === 'Medium') return 'amber';
    return 'blue';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Priority Competency Gaps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Deficits detected by the AI Competency Engine against Cadre benchmarks
            </p>
          </div>
        </div>

        <Link
          to="/competencies"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 hover:underline"
        >
          View Full Competency Matrix
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gaps.map((gap) => (
          <div
            key={gap.id}
            className="premium-card rounded-2xl p-6 bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Card top */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {gap.title}
                </h3>
                {getPriorityBadge(gap.priority)}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {gap.context}
              </p>

              {/* Progress & Gap Metrics */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2.5 shadow-2xs">
                <div className="flex items-baseline justify-between text-xs font-mono">
                  <div className="text-slate-600">
                    Current: <span className="text-sm font-extrabold text-slate-900">{gap.current}%</span>
                  </div>
                  <div className="text-slate-500 text-xs">
                    Required: <span className="font-bold text-slate-800">{gap.required}%</span>
                  </div>
                </div>

                <ProgressBar
                  value={gap.current}
                  max={gap.required}
                  size="md"
                  color={getProgressColor(gap.priority)}
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-rose-600 font-extrabold text-sm">
                    Gap: -{gap.gap}%
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium">
                    Cadre Requirement
                  </span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-5 mt-4 border-t border-slate-200/60">
              <Link
                to={gap.route}
                className={`w-full text-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  gap.priority === 'High'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                }`}
              >
                <span>{gap.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
