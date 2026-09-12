import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { Layers, BarChart2, Info } from 'lucide-react';

export default function CompetencyOverview({ competencies = [] }) {
  const [viewMode, setViewMode] = useState('radar');

  const radarData = competencies.map((c) => ({
    subject: c.name,
    current: c.currentScore,
    required: c.requiredScore,
    fullMark: 100
  }));

  const getLevelBadge = (level) => {
    switch (level) {
      case 'Strong':
        return <Badge variant="strong" size="sm">Strong (&gt;75%)</Badge>;
      case 'Moderate':
        return <Badge variant="moderate" size="sm">Moderate (50-75%)</Badge>;
      case 'Needs Improvement':
      default:
        return <Badge variant="gap" size="sm">Needs Improvement (&lt;50%)</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            Competency Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Official Statistical System Framework (OSSF-2026) Baseline Evaluation
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600 mr-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block shadow-2xs" />
              <span>Current Score</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
              <span>Required Benchmark</span>
            </span>
          </div>

          <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('radar')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'radar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Radar View</span>
            </button>
            <button
              onClick={() => setViewMode('bars')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'bars'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Progress Bars</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visualization */}
      {viewMode === 'radar' ? (
        <div className="h-96 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Radar
                name="Current Competency"
                dataKey="current"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <Radar
                name="Required Threshold"
                dataKey="required"
                stroke="#64748b"
                fill="#cbd5e1"
                fillOpacity={0.15}
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          {competencies.map((comp) => {
            const isDeficit = comp.currentScore < comp.requiredScore;
            return (
              <div key={comp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900">{comp.name}</span>
                    {getLevelBadge(comp.level)}
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-base font-extrabold text-slate-900">{comp.currentScore}%</span>
                    <span className="text-slate-400 text-xs">/ Target: {comp.requiredScore}%</span>
                  </div>
                </div>

                <ProgressBar
                  value={comp.currentScore}
                  max={100}
                  size="md"
                  color={comp.level === 'Strong' ? 'emerald' : comp.level === 'Moderate' ? 'amber' : 'rose'}
                />

                <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                  <span>{comp.description}</span>
                  {isDeficit ? (
                    <span className="text-rose-600 font-bold">Deficit: -{comp.requiredScore - comp.currentScore}%</span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">Cadre Benchmark Satisfied</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      {(() => {
        const strongCount = competencies?.filter((c) => c.level === 'Strong').length || 0;
        const moderateCount = competencies?.filter((c) => c.level === 'Moderate').length || 0;
        const needImpCount = competencies?.filter((c) => c.level === 'Needs Improvement').length || 0;
        return (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
            <div className="flex flex-wrap items-center gap-5">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <strong className="text-slate-700">{strongCount} Strong</strong>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <strong className="text-slate-700">{moderateCount} Moderate</strong>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <strong className="text-slate-700">{needImpCount} Need Improvement</strong>
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Official Statistical Cadre Grade II specifications</span>
          </div>
        );
      })()}
    </div>
  );
}
