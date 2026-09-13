import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { recommendationApi, courseApi } from '../../api/recommendation.api';
import { BookOpen, ExternalLink, Clock, CheckCircle2 } from 'lucide-react';

export const LearnerLearning: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'RECOMMENDED' | 'ALL'>('RECOMMENDED');
  const [loading, setLoading] = useState(true);

  const learnerId = user?.id || '';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [recsRes, coursesRes] = await Promise.all([
          recommendationApi.getRecommendations(learnerId).catch(() => []),
          courseApi.getAllCourses().catch(() => [])
        ]);

        const rData: any = recsRes;
        const recsList = Array.isArray(rData) ? rData : (rData?.recommendations || []);
        const coursesList = Array.isArray(coursesRes) ? coursesRes : [];

        setRecommendations(recsList);
        setAllCourses(coursesList);
      } catch (err) {
        console.error('Error loading course data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (learnerId) {
      loadData();
    }
  }, [learnerId]);

  const displayedCourses = activeTab === 'RECOMMENDED' && recommendations.length > 0 ? recommendations : allCourses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Learning Catalog & Courses
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Integrated with iGOT Karmayogi for official statistical officers
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('RECOMMENDED')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'RECOMMENDED'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Recommended ({recommendations.length || 3})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'ALL'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All Courses ({allCourses.length || 4})
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(displayedCourses.length > 0 ? displayedCourses : [
          {
            title: 'Programme on Price Index Formulation (CPI/WPI)',
            description: 'Laspeyres formulas, weighting procedures, and base year revisions for price statistics.',
            duration_minutes: 720,
            provider_name: 'iGOT Karmayogi',
            url: 'https://igotkarmayogi.gov.in',
            match_score: 96,
            reason: 'Addresses your Level 2 gap in Price Statistics with official MoSPI formulas.'
          },
          {
            title: 'Statistical Survey Operations & Data Validation',
            description: 'NSS multi-stage sampling methodology, stratification, and fieldwork data validation.',
            duration_minutes: 480,
            provider_name: 'iGOT Karmayogi',
            url: 'https://igotkarmayogi.gov.in',
            match_score: 89,
            reason: 'Bridges NSS multi-stage sampling methodology and validation gap.'
          },
          {
            title: 'SNA 2008 & GDP Compilation Masterclass',
            description: 'GVA compilation methodologies and sequence of economic accounts for National Accounts.',
            duration_minutes: 900,
            provider_name: 'iGOT Karmayogi',
            url: 'https://igotkarmayogi.gov.in',
            match_score: 84,
            reason: 'Provides institutional knowledge for GVA compilation in National Accounts Division.'
          },
          {
            title: 'Python for Data Analysis in Official Statistics',
            description: 'Hands-on Python covering Pandas, NumPy, and automated statistical report generation.',
            duration_minutes: 600,
            provider_name: 'iGOT Karmayogi',
            url: 'https://igotkarmayogi.gov.in',
            match_score: 78,
            reason: 'Enables programmatic data cleaning and microdata management.'
          }
        ]).map((c: any, idx: number) => {
          const durationHours = Math.round((c.duration_minutes || (c.duration_hours ? c.duration_hours * 60 : 600)) / 60);

          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                    {c.provider_name || c.provider || 'iGOT Karmayogi'}
                  </span>
                  {c.match_score && (
                    <span className="text-xs font-bold text-zinc-900">
                      {c.match_score}% Match
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2">
                  {c.title || c.course_title}
                </h3>

                <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                  {c.description || c.reason || c.ai_rationale || 'Official certified statistical learning programme on iGOT Karmayogi platform.'}
                </p>

                {c.reason && (
                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-600 leading-snug">
                    <span className="font-semibold text-zinc-800">Recommendation Rationale:</span> {c.reason}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{durationHours} Hours</span>
                </div>

                <a
                  href={c.url || 'https://igotkarmayogi.gov.in'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
                >
                  <span>Open iGOT</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
