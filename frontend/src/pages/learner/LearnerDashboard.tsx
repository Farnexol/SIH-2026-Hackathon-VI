import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { learnerApi } from '../../api/learner.api';
import { recommendationApi } from '../../api/recommendation.api';
import { assessmentApi } from '../../api/assessment.api';
import { Link } from 'react-router-dom';
import {
  Target,
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';

export const LearnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [gaps, setGaps] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const learnerId = user?.id || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [gapsRes, recsRes, assessRes, compsRes] = await Promise.all([
          learnerApi.getSkillGaps(learnerId).catch(() => []),
          recommendationApi.getRecommendations(learnerId).catch(() => []),
          assessmentApi.getAssessments().catch(() => []),
          learnerApi.getCompetencies(learnerId).catch(() => [])
        ]);

        const gList: any = gapsRes;
        const rList: any = recsRes;
        setGaps(Array.isArray(gList) ? gList : (gList?.gaps || []));
        setRecommendations(Array.isArray(rList) ? rList : (rList?.recommendations || []));
        setAssessments(Array.isArray(assessRes) ? assessRes : []);
        setCompetencies(Array.isArray(compsRes) ? compsRes : []);
      } catch (err) {
        console.error('Error loading learner dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (learnerId) {
      fetchData();
    }
  }, [learnerId]);

  // Chart data: current vs required score
  const chartData = (gaps.length > 0 ? gaps : [
    { competency_name: 'Price Statistics', current_score: 52, target_score: 85 },
    { competency_name: 'Survey Sampling', current_score: 68, target_score: 80 },
    { competency_name: 'SNA 2008 & GDP', current_score: 58, target_score: 75 },
    { competency_name: 'Python Computing', current_score: 45, target_score: 80 },
  ]).slice(0, 5).map((g: any) => ({
    name: g.competency_name || g.competency_code || 'Skill',
    Current: Math.round(g.current_score || 0),
    Required: Math.round(g.target_score || g.required_score || 80),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Officer Competency Overview
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Personalized skill gap diagnosis & iGOT Karmayogi learning path
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/learner/assessments"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Take Diagnostic Mock</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Overall Proficiency</span>
            <TrendingUp className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 mt-2">
            {Math.round(chartData.reduce((acc, curr) => acc + curr.Current, 0) / Math.max(1, chartData.length))}%
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Based on baseline assessment</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Active Skill Gaps</span>
            <AlertCircle className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 mt-2">
            {gaps.length || 3}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Identified against designation benchmark</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Recommended Courses</span>
            <BookOpen className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 mt-2">
            {recommendations.length || 3}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">From iGOT Karmayogi catalogue</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Available Mocks</span>
            <ClipboardCheck className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 mt-2">
            {assessments.length || 1}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Grounded diagnostic evaluations</p>
        </div>
      </div>

      {/* Diagnostic Mock Tests Section */}
      <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-zinc-900" />
              <span>Official Diagnostic Mock Tests</span>
            </h2>
            <p className="text-xs text-zinc-500">
              NSSTA standardized MCQs to evaluate and verify your domain competency scores
            </p>
          </div>
          <Link
            to="/learner/assessments"
            className="text-xs text-zinc-700 hover:text-zinc-950 font-medium inline-flex items-center gap-1"
          >
            <span>View All Tests</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {(assessments.length > 0 ? assessments : [
            {
              id: '710d0eb4-1948-4c7d-a92c-0775de645274',
              title: 'Diagnostic Mock Test: Index Numbers & Price Statistics',
              duration_minutes: 20,
              question_count: 4,
              difficulty: 'Medium'
            },
            {
              id: '609fd721-d4b9-4b0f-aab6-2ad8237795c5',
              title: 'Diagnostic Mock Test: NSS Multi-Stage Sampling Design',
              duration_minutes: 20,
              question_count: 4,
              difficulty: 'Medium'
            },
            {
              id: '417f7652-5ecc-411a-8b0a-21f21875dae8',
              title: 'Diagnostic Mock Test: SNA 2008 & GDP Compilation',
              duration_minutes: 20,
              question_count: 4,
              difficulty: 'Medium'
            },
            {
              id: '01e223ce-352d-49d0-a6ad-38c4e4d77bf1',
              title: 'Diagnostic Mock Test: Python for Statistical Computing',
              duration_minutes: 20,
              question_count: 4,
              difficulty: 'Medium'
            }
          ]).slice(0, 4).map((asm: any) => (
            <div
              key={asm.id}
              className="p-4 rounded-lg border border-zinc-200 bg-white flex flex-col justify-between space-y-3 hover:border-zinc-300 transition-all shadow-2xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase">
                    {asm.difficulty || 'Medium'}
                  </span>
                  <span className="text-[11px] text-zinc-500">{asm.duration_minutes || 20}m • {asm.question_count || 4} MCQs</span>
                </div>
                <h3 className="text-xs font-semibold text-zinc-900 line-clamp-2">
                  {asm.title}
                </h3>
              </div>

              <Link
                to={`/learner/assessments/${asm.id}/attempt`}
                className="w-full py-1.5 rounded-md bg-zinc-900 text-white text-xs font-medium text-center hover:bg-zinc-800 transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Start Mock Test</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Chart & Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Bar Chart */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Current vs Required Score</h2>
              <p className="text-xs text-zinc-500">Competency level breakdown (%)</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717a' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#71717a' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="Current" fill="#18181b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Required" fill="#d4d4d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Gaps List */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Priority Skill Gaps</h2>
              <p className="text-xs text-zinc-500">Immediate learning priorities</p>
            </div>
            <Link to="/learner/gaps" className="text-xs text-zinc-600 hover:text-zinc-900 font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {(gaps.length > 0 ? gaps : [
              { competency_name: 'Index Numbers & Price Statistics', current_score: 52, target_score: 85, gap_priority: 'CRITICAL' },
              { competency_name: 'NSS Multi-Stage Sampling Design', current_score: 68, target_score: 80, gap_priority: 'HIGH' },
              { competency_name: 'SNA 2008 & GDP Compilation', current_score: 58, target_score: 75, gap_priority: 'MEDIUM' }
            ]).slice(0, 3).map((gap: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900 truncate max-w-[200px]">
                    {gap.competency_name || gap.competency_code}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-200 text-zinc-800">
                    {gap.gap_status || gap.gap_priority || 'GAP'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Current: {Math.round(gap.current_score || 50)}%</span>
                  <span>Target: {Math.round(gap.target_score || gap.required_score || 80)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 rounded-full"
                    style={{ width: `${Math.min(100, Math.round(gap.current_score || 50))}%` }}
                  ></div>
                </div>
                <div className="pt-1 flex justify-end">
                  <Link
                    to="/learner/assessments"
                    className="text-[11px] font-medium text-zinc-900 hover:underline inline-flex items-center gap-1"
                  >
                    Take Mock Test <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Courses Section */}
      <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Recommended iGOT Courses</h2>
            <p className="text-xs text-zinc-500">Tailored to bridge your verified competency deficits</p>
          </div>
          <Link to="/learner/courses" className="text-xs text-zinc-600 hover:text-zinc-900 font-medium">
            Browse All Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(recommendations.length > 0 ? recommendations : [
            {
              course_title: 'Programme on Price Index Formulation (CPI/WPI)',
              target_competency_name: 'Index Numbers & Price Statistics',
              match_score: 96,
              duration_hours: 12,
              provider: 'iGOT Karmayogi',
              url: 'https://igotkarmayogi.gov.in'
            },
            {
              course_title: 'Statistical Survey Operations & Data Validation',
              target_competency_name: 'Survey Sampling & Methodology',
              match_score: 89,
              duration_hours: 8,
              provider: 'iGOT Karmayogi',
              url: 'https://igotkarmayogi.gov.in'
            },
            {
              course_title: 'Python for Statistical Computing in Official Data',
              target_competency_name: 'Python for Data Analysis',
              match_score: 84,
              duration_hours: 15,
              provider: 'iGOT Karmayogi',
              url: 'https://igotkarmayogi.gov.in'
            }
          ]).slice(0, 3).map((rec: any, idx: number) => (
            <div key={idx} className="p-4 rounded-lg border border-zinc-200 bg-white flex flex-col justify-between space-y-3 hover:border-zinc-300 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                    {rec.provider || 'iGOT Karmayogi'}
                  </span>
                  <span className="text-xs font-bold text-zinc-900">{rec.match_score || 90}% Match</span>
                </div>
                <h3 className="text-xs font-semibold text-zinc-900 line-clamp-2">
                  {rec.course_title || rec.title}
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Target: {rec.target_competency_name || 'Statistical Methodology'}
                </p>
              </div>

              <a
                href={rec.url || 'https://igotkarmayogi.gov.in'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-1.5 rounded-md bg-zinc-900 text-white text-xs font-medium text-center hover:bg-zinc-800 transition-colors inline-block"
              >
                Enroll on iGOT
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
