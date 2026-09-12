import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Award,
  BookOpen,
  Flame,
  Sparkles,
  UploadCloud,
  FileCheck,
  Compass,
  ArrowRight,
  ShieldCheck,
  Clock,
  Target
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/common/StatCard';
import CompetencyOverview from '../components/dashboard/CompetencyOverview';
import CompetencyGapCard from '../components/dashboard/CompetencyGapCard';
import AIInsightCard from '../components/dashboard/AIInsightCard';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FadeIn } from '../components/common/animations';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, openAiAdvisor } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await api.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Synthesizing official competency matrix & telemetry..." />;
  }

  const { stats, aiInsight, priorityGaps, competencies, learningPathSummary } = data;

  return (
    <div className="space-y-10 sm:space-y-12 pb-12">
      {/* 0.0s: PAGE HEADER */}
      <FadeIn delay={0.0} direction="down">
        <PageHeader
          title={`Good morning, ${user?.name?.split(' ')[0] || 'Officer'}`}
          subtitle="Here is your official competency and capacity building overview."
          badge={
            <span className="text-xs bg-blue-50 text-blue-800 font-bold px-3 py-1 rounded-full border border-blue-200">
              {user?.designation || 'Statistical Officer'}
            </span>
          }
          actions={
            <div className="flex items-center gap-3">
              <Link
                to="/materials/upload"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-400"
              >
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Upload Document</span>
              </Link>
              <Link
                to="/quiz/quiz-201"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm shadow-blue-600/20 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Take Diagnostic</span>
              </Link>
            </div>
          }
        >
          {/* Subtle Banner Alert */}
          <div className="p-4 bg-linear-to-r from-blue-50/90 via-indigo-50/60 to-white rounded-2xl border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-slate-800">
                <strong>AI Insight:</strong> {aiInsight?.headline || 'Review your official competency profile and diagnostic recommendations.'}
              </p>
            </div>

            <button
              onClick={openAiAdvisor}
              className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 shrink-0 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Explore AI Guidance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </PageHeader>
      </FadeIn>

      {/* 0.1s: 4 KEY STATISTIC CARDS */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Overall Competency"
            value={`${stats.overallCompetency}%`}
            subtext="across 7 competencies"
            delta={stats.competencyDelta || 'Diagnostic pending'}
            deltaType="positive"
            icon={TrendingUp}
            iconBg="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Learning Progress"
            value={`${stats.learningProgress}%`}
            subtext={`${stats.completedCourses} / ${stats.totalCourses} courses`}
            delta={
              stats.completedCourses > 0
                ? `${stats.completedCourses} course(s) completed`
                : stats.totalCourses > 0
                ? `${stats.totalCourses} course(s) enrolled`
                : 'No enrollments yet'
            }
            deltaType="positive"
            icon={BookOpen}
            iconBg="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            title="Assessment Score"
            value={`${stats.assessmentScore}%`}
            subtext="average diagnostic score"
            delta={stats.scoreDelta || 'No diagnostic taken'}
            deltaType="positive"
            icon={Award}
            iconBg="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="Learning Streak"
            value={`${stats.learningStreak} Days`}
            subtext="active engagement"
            delta={stats.learningStreak > 0 ? `${stats.learningStreak} day streak active` : 'Start your streak today'}
            deltaType="positive"
            icon={Flame}
            iconBg="bg-amber-50 text-amber-600"
          />
        </div>
      </FadeIn>

      {/* 0.2s: AI LEARNING ADVISOR (VISUALLY DOMINANT) */}
      <FadeIn delay={0.2}>
        <AIInsightCard insight={aiInsight} />
      </FadeIn>

      {/* 0.3s: COMPETENCY OVERVIEW (RADAR / BARS) */}
      <FadeIn delay={0.3}>
        <CompetencyOverview competencies={competencies} />
      </FadeIn>

      {/* 0.4s: PRIORITY COMPETENCY GAPS */}
      <FadeIn delay={0.4}>
        <CompetencyGapCard gaps={priorityGaps} />
      </FadeIn>

      {/* 0.5s: PERSONALIZED LEARNING PATH SNAPSHOT & AI DOCUMENT ENGINE */}
      <FadeIn delay={0.5}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Learning Path Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Targeted Roadmap: {learningPathSummary.target}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">Autonomous curriculum sequence to close your 42% gap</p>
                </div>
              </div>
              <Link
                to="/learning-path"
                className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5"
              >
                <span>View Full Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div>
              <ProgressBar
                value={learningPathSummary.progress}
                label="Curriculum Milestones Completed"
                showLabel
                size="md"
                color="blue"
              />
            </div>

            {/* Current In-Progress Step */}
            {learningPathSummary.nextStep && (
              <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Current Milestone
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {learningPathSummary.nextStep.duration}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {learningPathSummary.nextStep.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-1">
                    {learningPathSummary.nextStep.description}
                  </p>
                </div>

                <Link
                  to="/courses/course-101"
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Resume Module</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Quick Launch Card */}
          <div className="lg:col-span-4 bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between border border-slate-800">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-300">Official Statistical System</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Autonomous Assessment from Learning Materials
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Upload survey circulars, technical manuals, or statistical notes. Samarth automatically generates MCQs mapped to OSSF standards.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-3">
              <Link
                to="/materials/upload"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Learning Material</span>
              </Link>
              <Link
                to="/materials"
                className="w-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center"
              >
                Browse Analyzed Documents
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
