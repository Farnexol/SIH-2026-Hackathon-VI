import React, { useState, useEffect } from 'react';
import { assessmentApi } from '../../api/assessment.api';
import { learnerApi } from '../../api/learner.api';
import { useAuth } from '../../context/AuthContext';
import {
  ClipboardCheck,
  Clock,
  Award,
  PlayCircle,
  CheckCircle2,
  Filter,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const LearnerAssessments: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [learnerComps, setLearnerComps] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [testsData, compsData] = await Promise.all([
          assessmentApi.getAssessments().catch(() => []),
          learnerApi.getCompetencies().catch(() => []),
        ]);
        setAssessments(Array.isArray(testsData) ? testsData : []);
        setLearnerComps(Array.isArray(compsData) ? compsData : []);
      } catch (err) {
        console.error('Error loading assessments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const domains = ['ALL', 'Statistical Methodology', 'National Accounts', 'Survey Sampling', 'Computing'];

  const filteredTests = assessments.filter((asm) => {
    if (selectedDomain === 'ALL') return true;
    const titleLower = (asm.title || '').toLowerCase();
    const descLower = (asm.description || '').toLowerCase();
    const domainLower = selectedDomain.toLowerCase();
    if (domainLower.includes('methodology') && (titleLower.includes('price') || titleLower.includes('index'))) return true;
    if (domainLower.includes('accounts') && (titleLower.includes('sna') || titleLower.includes('gdp'))) return true;
    if (domainLower.includes('sampling') && (titleLower.includes('sampling') || titleLower.includes('nss'))) return true;
    if (domainLower.includes('computing') && (titleLower.includes('python') || titleLower.includes('comput'))) return true;
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Diagnostic Mock Tests & Quizzes
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Official NSSTA methodology diagnostic evaluations for competency verification
          </p>
        </div>

        {assessments.length > 0 && (
          <Link
            to={`/learner/assessments/${assessments[0].id}/attempt`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors shadow-xs"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Start Primary Diagnostic Mock</span>
          </Link>
        )}
      </div>

      {/* Quick Launch Banner */}
      <div className="p-5 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-900 text-white tracking-wide uppercase">
              Official NSSTA Benchmark
            </span>
            <span className="text-xs text-zinc-500">• 4 MCQs • 20 Mins • Single-Choice</span>
          </div>
          <h2 className="text-sm font-semibold text-zinc-900">
            Competency-Grounded Evaluation Engine
          </h2>
          <p className="text-xs text-zinc-600 max-w-2xl leading-relaxed">
            Every question has exactly one verified correct answer grounded in official MoSPI methodology manuals.
            Submitting test attempts automatically calculates your competency score and updates your skill gap profile.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-zinc-700">
            {assessments.length} Active Tests Available
          </span>
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedDomain === dom
                ? 'bg-zinc-900 text-white'
                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-400">
          Loading diagnostic tests...
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="p-12 rounded-xl border border-zinc-200 bg-white text-center space-y-2">
          <ClipboardCheck className="w-6 h-6 mx-auto text-zinc-400" />
          <p className="text-xs font-medium text-zinc-700">No mock tests found for this category</p>
          <button
            onClick={() => setSelectedDomain('ALL')}
            className="text-xs text-zinc-900 underline font-medium"
          >
            View all available tests
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTests.map((asm: any) => (
            <div
              key={asm.id}
              className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 uppercase tracking-wide">
                    {asm.difficulty || 'Medium'} • {asm.assessment_type ? asm.assessment_type.replace(/_/g, ' ') : 'Mock Test'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Published
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-950">
                    {asm.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {asm.description || 'Grounded statistical evaluation test.'}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" /> {asm.duration_minutes || 20} Mins
                  </span>
                  <span className="flex items-center gap-1">
                    <ClipboardCheck className="w-3.5 h-3.5 text-zinc-400" /> {asm.question_count || 4} MCQs
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-zinc-400" /> 70% Pass Mark
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">
                  One correct option per question
                </span>

                <Link
                  to={`/learner/assessments/${asm.id}/attempt`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors shadow-xs"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Start Mock Test</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
