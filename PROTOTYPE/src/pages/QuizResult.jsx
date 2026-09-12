import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Home,
  Check,
  RotateCcw
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import CompetencyDeltaChart from '../components/quiz/CompetencyDeltaChart';
import Button from '../components/common/Button';
import { PageTransition, FadeIn, AnimatedNumber } from '../components/common/animations';
import { mockQuizResultData, mockQuizQuestions } from '../data/mockData';

export default function QuizResult() {
  const { id } = useParams();
  const [result, setResult] = useState(mockQuizResultData);
  const [expandedQuestions, setExpandedQuestions] = useState(false);

  useEffect(() => {
    // Check if result exists from recent submission in sessionStorage
    const saved = sessionStorage.getItem('statiq_last_quiz_result');
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing stored quiz result:', e);
      }
    }
  }, [id]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.scorePercentage / 100) * circumference;

  return (
    <PageTransition className="space-y-10">
      <PageHeader
        title="Assessment Completed"
        subtitle={`Evaluation report and competency calibration for: ${result.quizTitle}`}
        badge={
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            Validated Diagnostic
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link to="/assessments">
              <Button variant="outline" size="sm" icon={RotateCcw}>
                Retake Assessment
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="primary" size="sm" icon={Home}>
                Return to Dashboard
              </Button>
            </Link>
          </div>
        }
      />

      {/* Rewarding Score Hero Card */}
      <FadeIn delay={0.1}>
        <div className="bg-linear-to-br from-white via-blue-50/40 to-indigo-50/50 rounded-3xl border border-blue-100/80 shadow-md p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-blue-400/10 via-indigo-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Performance Evaluation
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Outstanding Diagnostic Performance!
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                You successfully demonstrated core competencies in statistical data handling. Your verified mastery score has automatically synchronized with your Official Statistical System Profile.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 justify-center md:justify-start">
                <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  Passing Benchmark: 70%
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                  Status: Passed
                </span>
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  {/* Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="9"
                    fill="transparent"
                    className="text-slate-200"
                  />
                  {/* Animated Progress Indicator */}
                  <motion.circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="9"
                    fill="transparent"
                    className="text-blue-600"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                    <AnimatedNumber value={result.scorePercentage} suffix="%" duration={1.4} />
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Score
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700 mt-2 font-mono">
                {result.score} of {result.totalQuestions} Questions Correct
              </span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* 4 Score Metric Cards */}
      <FadeIn delay={0.2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Score */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Score
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
                  {result.score} / {result.totalQuestions}
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {result.scorePercentage}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Correct Answers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Correct Answers
              </span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-mono">
                <AnimatedNumber value={result.correctCount} duration={1} />
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Incorrect Answers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Incorrect / Skipped
              </span>
              <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1 font-mono">
                <AnimatedNumber value={result.incorrectCount} duration={1} />
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Time Taken */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Time Taken
              </span>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 font-mono">
                {result.timeSpent}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Competency Improvement Delta Section */}
      <FadeIn delay={0.3}>
        <CompetencyDeltaChart
          deltaData={result.competencyDelta}
          aiAnalysis={result.aiAnalysis}
          nextRecommendation={result.nextRecommendation}
        />
      </FadeIn>

      {/* Question-by-Question Review */}
      <FadeIn delay={0.4}>
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Question-by-Question Review</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Official answer keys, methodology citations, and statistical explanations
              </p>
            </div>
            <button
              onClick={() => setExpandedQuestions(!expandedQuestions)}
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
            >
              <span>{expandedQuestions ? 'Collapse Explanations' : 'Expand All Explanations'}</span>
              {expandedQuestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Questions list */}
          <div className="space-y-4">
            {mockQuizQuestions.map((q, idx) => {
              const isCorrect = idx < result.correctCount;
              return (
                <div
                  key={q.id}
                  className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                        {q.question}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? 'Correct' : 'Needs Review'}
                    </span>
                  </div>

                  {(expandedQuestions || !isCorrect) && (
                    <div className="pt-3 pl-10 text-xs sm:text-sm space-y-2.5 border-t border-slate-200/70 mt-3">
                      <div className="text-slate-700 font-medium">
                        <strong className="text-slate-900">Correct Option: </strong>
                        <span className="font-bold text-emerald-700">
                          {q.correctAnswer} — {q.options.find(o => o.id === q.correctAnswer)?.text}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                        <strong className="text-slate-800">Methodological Explanation: </strong>
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  );
}
