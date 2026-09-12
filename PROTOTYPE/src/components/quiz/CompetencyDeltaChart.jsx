import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ArrowUpRight, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';
import Button from '../common/Button';

export default function CompetencyDeltaChart({ deltaData, aiAnalysis, nextRecommendation }) {
  if (!deltaData) return null;

  const chartData = [
    {
      stage: 'Before Assessment',
      score: deltaData.beforeScore,
      fill: '#94a3b8'
    },
    {
      stage: 'After Assessment',
      score: deltaData.afterScore,
      fill: '#2563eb'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Competency Improvement Delta</h3>
            <span className="text-xs sm:text-sm font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              {deltaData.delta} Gain
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time competency calibration based on your verified assessment performance
          </p>
        </div>

        <span className="text-xs sm:text-sm font-mono text-slate-600 bg-slate-100 px-4 py-1.5 rounded-xl font-bold self-start sm:self-center border border-slate-200">
          Target: {deltaData.competencyName}
        </span>
      </div>

      {/* Before vs After Visual Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Comparison Numbers */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-4">
            {/* Before */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-semibold">Before Assessment</span>
              <span className="text-xl font-bold text-slate-600 font-mono">{deltaData.beforeScore}%</span>
            </div>

            {/* After */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">After Assessment</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  Updated
                </span>
              </div>
              <span className="text-3xl font-black text-blue-600 font-mono">{deltaData.afterScore}%</span>
            </div>

            {/* Improvement delta banner */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-sm">
              <span className="text-emerald-950 font-bold">Net Proficiency Growth:</span>
              <span className="font-black text-emerald-700 font-mono text-lg">{deltaData.delta}</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile synchronized with Official Statistical System Framework (OSSF).</span>
          </div>
        </div>

        {/* Comparison Bar Chart */}
        <div className="md:col-span-7 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
              <XAxis
                dataKey="stage"
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={55}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Analysis Diagnostic */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            AI Performance Diagnostic
          </h4>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          {aiAnalysis}
        </p>
      </div>

      {/* Core Feedback Loop: Next Step Recommendation */}
      {nextRecommendation && (
        <div className="p-6 sm:p-7 rounded-2xl bg-linear-to-r from-blue-50/90 via-indigo-50/70 to-white border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
              Next Closed-Loop Recommendation
            </span>
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
              {nextRecommendation.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {nextRecommendation.reason}
            </p>
          </div>

          <div className="shrink-0">
            <Link to={nextRecommendation.route || '/courses'}>
              <Button variant="primary" size="lg" icon={ArrowRight} className="font-bold shadow-md shadow-blue-600/20 text-sm">
                Continue Learning
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
