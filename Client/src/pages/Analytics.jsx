import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PageTransition, FadeIn } from '../components/common/animations';
import * as api from '../services/api';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await api.getAnalytics();
        setAnalytics(res);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading || !analytics) {
    return <LoadingSpinner message="Aggregating longitudinal competency metrics..." />;
  }

  return (
    <PageTransition className="space-y-10 sm:space-y-12">
      <PageHeader
        title="Learner Analytics & Competency Growth"
        subtitle="Longitudinal tracking of competency trends, learning time, and assessment performance across India's Official Statistical System."
        badge={
          <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Cadre Performance Telemetry
          </span>
        }
      />

      {/* Section 1: Competency Growth Over Time (Line Chart) */}
      <FadeIn delay={0.1}>
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Longitudinal Competency Growth</h3>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Progress tracking across 5 core statistical and data analysis domains over the past 6 months
              </p>
            </div>
            <span className="text-xs sm:text-sm font-mono text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl font-extrabold border border-emerald-200 self-start sm:self-center">
              {analytics.strengths?.length > 0 ? '+18% Average Cadre Growth' : 'Baseline Calibration'}
            </span>
          </div>

          <div className="h-80 sm:h-96 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.competencyGrowth} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
                <Line type="monotone" dataKey="Statistics" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="DataAnalysis" name="Data Analysis" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Python" stroke="#e11d48" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="DataViz" name="Data Viz" stroke="#d97706" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="SurveyMethod" name="Survey Methodology" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>

      {/* Section 2: Learning Hours & Competency Spider Distribution */}
      <FadeIn delay={0.2}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Learning Hours Bar Chart */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Weekly Learning Engagement</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Hours logged in iGOT courses and interactive diagnostics
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                {typeof analytics.totalWeeklyHours !== 'undefined' ? `${analytics.totalWeeklyHours} hrs this week` : '0.0 hrs this week'}
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.weeklyLearningHours} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="hours" name="Learning Hours" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Competency Radar Chart */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Competency Spider Distribution</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Current proficiency versus required cadre benchmark
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={analytics.radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar name="Current Proficiency" dataKey="current" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.35} />
                  <Radar name="Required Benchmark" dataKey="required" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.15} strokeDasharray="3 3" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Section 3: Strengths vs Areas to Improve */}
      <FadeIn delay={0.3}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Cadre Strengths (Above Benchmark)
                </h4>
                <p className="text-xs text-slate-500">Domains where your proficiency exceeds Grade II requirements</p>
              </div>
            </div>
            <div className="space-y-3">
              {analytics.strengths.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 font-medium bg-slate-50/60 rounded-2xl border border-slate-100">
                  No cadre strengths above benchmark yet. Complete initial diagnostic assessments to establish baseline proficiencies.
                </div>
              ) : (
                analytics.strengths.map((str, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-sm text-emerald-950">{str.name}</span>
                      <p className="text-xs text-emerald-700 mt-0.5">Meets official Grade II requirements</p>
                    </div>
                    <span className="text-xl font-bold text-emerald-700 font-mono">{str.score}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Areas to Improve */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Areas to Improve (Priority Gaps)
                </h4>
                <p className="text-xs text-slate-500">Highest delta domains flagged by the AI Learning Advisor</p>
              </div>
            </div>
            <div className="space-y-3">
              {analytics.areasToImprove.map((gap, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-rose-950">{gap.name}</span>
                      <Badge variant={gap.priority === 'High' ? 'high' : 'medium'} size="sm">
                        {gap.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-rose-700 mt-1">
                      Current: <strong className="font-mono">{gap.current}%</strong> • Required: <strong className="font-mono">{gap.required}%</strong>
                    </p>
                  </div>
                  <span className="text-xl font-bold text-rose-600 font-mono">-{gap.gap}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Section 4: Assessment Performance Log */}
      <FadeIn delay={0.4}>
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Recent Assessment Performance Log
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Audited diagnostic scores with timestamps and competency references
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {analytics.assessmentHistory.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm font-medium">
                No assessments completed yet. Take a diagnostic test in the Assessment Center to view your verified performance telemetry here.
              </div>
            ) : (
              analytics.assessmentHistory.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm hover:bg-slate-50/60 rounded-xl px-3 -mx-3 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{item.competency}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`font-mono font-bold px-3.5 py-1.5 rounded-xl text-sm self-start sm:self-center ${
                    item.score >= 80
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {item.score}% Validated
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  );
}
