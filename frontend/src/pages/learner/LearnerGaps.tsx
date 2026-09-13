import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { learnerApi } from '../../api/learner.api';
import { AlertCircle, RefreshCw, ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LearnerGaps: React.FC = () => {
  const { user } = useAuth();
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const learnerId = user?.id || '';

  const fetchGaps = async () => {
    try {
      const data: any = await learnerApi.getSkillGaps(learnerId);
      const list = Array.isArray(data) ? data : (data?.gaps || []);
      setGaps(list);
    } catch (err) {
      console.error('Error fetching gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (learnerId) {
      fetchGaps();
    }
  }, [learnerId]);

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    try {
      await learnerApi.calculateGaps(learnerId);
      await fetchGaps();
    } catch (err) {
      console.error('Recalculate error:', err);
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Competency Gap Diagnosis
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Evaluated against benchmarks for {user?.designation || 'Statistical Officer'}
          </p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>{isRecalculating ? 'Re-evaluating...' : 'Recalculate Gaps'}</span>
        </button>
      </div>

      {/* Gaps List */}
      <div className="space-y-4">
        {(gaps.length > 0 ? gaps : [
          {
            competency_name: 'Index Numbers & Price Statistics',
            domain: 'Statistical Methodology',
            current_score: 52,
            target_score: 85,
            required_level: 4,
            current_level: 2,
            gap_priority: 'CRITICAL',
            recommended_action: 'Enroll in Price Statistics formulation on iGOT Karmayogi'
          },
          {
            competency_name: 'NSS Multi-Stage Sampling Design',
            domain: 'Survey Design & Operations',
            current_score: 68,
            target_score: 80,
            required_level: 4,
            current_level: 3,
            gap_priority: 'HIGH',
            recommended_action: 'Complete Multi-stage probability sampling module'
          },
          {
            competency_name: 'SNA 2008 & GDP Compilation',
            domain: 'National Accounts',
            current_score: 58,
            target_score: 75,
            required_level: 3,
            current_level: 2,
            gap_priority: 'MEDIUM',
            recommended_action: 'Review GVA and Sequence of Economic Accounts materials'
          }
        ]).map((gap: any, idx: number) => {
          const current = Math.round(gap.current_score || 0);
          const target = Math.round(gap.target_score || gap.required_score || 80);
          const scoreDeficit = Math.max(0, target - current);

          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4 hover:border-zinc-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900">
                      {gap.competency_name || gap.competency_code}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {gap.domain || 'Statistical Methodology'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Deficit: <span className="font-semibold text-zinc-900">{scoreDeficit} points</span> • Level Gap: {gap.current_level || 2} → {gap.required_level || 4}
                  </p>
                </div>

                <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-900 text-white">
                  {gap.gap_priority || gap.gap_status || 'PRIORITY GAP'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Current: {current}%</span>
                  <span>Benchmark Target: {target}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 rounded-full"
                    style={{ width: `${Math.min(100, current)}%` }}
                  ></div>
                </div>
              </div>

              {/* Recommendation Action */}
              <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-xs text-zinc-600">
                  <span className="font-medium text-zinc-900">Suggested Action:</span>{' '}
                  {gap.recommended_action || 'Complete targeted iGOT Karmayogi course & diagnostic mock assessment.'}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/learner/assessments"
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors shadow-xs"
                  >
                    <PlayCircle className="w-3 h-3" />
                    <span>Take Mock Test</span>
                  </Link>

                  <Link
                    to="/learner/courses"
                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 hover:text-zinc-950"
                  >
                    <span>Courses</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
