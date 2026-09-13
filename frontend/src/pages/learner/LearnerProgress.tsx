import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { learnerApi } from '../../api/learner.api';
import { assessmentApi } from '../../api/assessment.api';
import { TrendingUp, Award, CheckCircle2, Calendar, BookOpen } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Line
} from 'recharts';

export const LearnerProgress: React.FC = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [progressList, setProgressList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [attemptsRes, progressRes] = await Promise.all([
          assessmentApi.getLearnerAttempts().catch(() => []),
          learnerApi.getProgressHistory().catch(() => []),
        ]);
        setAttempts(Array.isArray(attemptsRes) ? attemptsRes : []);
        setProgressList(Array.isArray(progressRes) ? progressRes : []);
      } catch (err) {
        console.error('Error loading progress data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const progressData = [
    { month: 'Oct 2025', score: 48, benchmark: 75 },
    { month: 'Nov 2025', score: 55, benchmark: 75 },
    { month: 'Dec 2025', score: 62, benchmark: 75 },
    { month: 'Jan 2026', score: 65, benchmark: 80 },
    { month: 'Feb 2026', score: 71, benchmark: 80 },
    { month: 'Mar 2026', score: 79, benchmark: 80 },
  ];

  const milestones = [
    {
      date: '10 March 2026',
      title: 'Completed Diagnostic Mock Test: Price Statistics',
      result: 'Scored 85% • Competency Level promoted to Level 3',
      type: 'ASSESSMENT',
    },
    {
      date: '28 February 2026',
      title: 'Enrolled in NSSTA Advanced Price Index Formulation',
      result: 'Completed 18 hours of residential training coursework',
      type: 'COURSE',
    },
    {
      date: '15 January 2026',
      title: 'Initial Skill Gap Engine Diagnosis',
      result: 'Identified 3 high-priority gaps in National Accounts & CPI',
      type: 'DIAGNOSIS',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Competency Growth & Learning Velocity
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Continuous score tracking for <strong className="text-zinc-900">{user?.full_name || 'Officer'}</strong>
          </p>
        </div>

        <span className="text-xs font-semibold text-zinc-900 bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 self-start">
          +31% Growth over 6 Months
        </span>
      </div>

      {/* Progress Chart */}
      <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Proficiency Score Trajectory</h2>
            <p className="text-xs text-zinc-500">Monthly aggregate competency score vs. role benchmark</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis dataKey="month" stroke="#a1a1aa" tick={{ fontSize: 11, fill: '#71717a' }} />
              <YAxis domain={[0, 100]} stroke="#a1a1aa" tick={{ fontSize: 11, fill: '#71717a' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '8px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="score" stroke="#18181b" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGradient)" name="Your Score" />
              <Line type="monotone" dataKey="benchmark" stroke="#a1a1aa" strokeWidth={2} strokeDasharray="5 5" name="Cadre Benchmark" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Progress (if any) */}
      {progressList.length > 0 && (
        <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-zinc-900">Active Course Enrollments</h2>
          <div className="space-y-2.5">
            {progressList.map((p: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <BookOpen className="w-4 h-4 text-zinc-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-zinc-900 truncate block">
                      {p.course_title}
                    </span>
                    <span className="text-[11px] text-zinc-500">{p.enrollment_status}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-zinc-900 shrink-0">
                  {p.progress_percent || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones & Badges Timeline */}
      <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-zinc-900">Continuous Improvement Milestones</h2>

        <div className="space-y-3 pt-1">
          {milestones.map((m, idx) => (
            <div key={idx} className="flex gap-4 items-start p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
              <div className="p-2 rounded-lg bg-zinc-900 text-white flex-shrink-0 mt-0.5">
                <Award className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-medium text-zinc-500">{m.date}</div>
                <h3 className="text-xs font-semibold text-zinc-900">{m.title}</h3>
                <p className="text-xs text-zinc-600">{m.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
