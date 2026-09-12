import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Clock, Award, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PageTransition, FadeIn } from '../components/common/animations';
import * as api from '../services/api';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuizzes() {
      try {
        const res = await api.getQuizzes();
        setQuizzes(res);
      } catch (err) {
        console.error('Error fetching assessments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Retrieving competency assessment catalog..." />;
  }

  return (
    <PageTransition className="space-y-10 sm:space-y-12">
      <PageHeader
        title="Assessment & Diagnostic Center"
        subtitle="Adaptive evaluations calibrated to validate statistical mastery and update your official competency profile in real time."
        badge={
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Real-time Competency Update
          </span>
        }
        actions={
          <Link to="/materials/upload">
            <Button variant="outline" size="sm" icon={Sparkles}>
              Generate from Material
            </Button>
          </Link>
        }
      />

      {/* Featured Checkpoint Banner */}
      <FadeIn delay={0.1}>
        <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-r from-blue-900 via-indigo-950 to-slate-950 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 border border-blue-900/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3.5 max-w-2xl relative z-10">
            <span className="text-xs font-bold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-500/30 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Recommended Adaptive Test
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
              Statistical Analysis & Python Methods Checkpoint
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              10 domain-specific questions assessing probability sampling, survey weighting, Pandas operations, and hypothesis significance levels. Directly closes your priority Data Analysis gap.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 font-mono pt-2">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md text-slate-200 font-bold">10 MCQs</span>
              <span>•</span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md text-slate-200 font-bold">15 Minutes</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800">
                Target: Data Analysis (+16% potential)
              </span>
            </div>
          </div>

          <div className="shrink-0 relative z-10">
            <Link to="/quiz/quiz-201">
              <Button variant="primary" size="lg" icon={ArrowRight} className="font-bold shadow-lg shadow-blue-600/30 text-base py-3.5 px-6">
                Begin Assessment
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Quizzes List */}
      <FadeIn delay={0.2} className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Available Cadre Assessments
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Select a verified diagnostic to evaluate your proficiency against official benchmarks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                    {quiz.competency}
                  </span>
                  <Badge variant="default" size="sm">{quiz.difficulty}</Badge>
                </div>

                <h4 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {quiz.title}
                </h4>

                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {quiz.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{quiz.estimatedMinutes} Mins</span>
                  </span>
                  <span className="font-bold text-slate-700">{quiz.questionsCount} Questions</span>
                </div>
              </div>

              <div className="pt-6 mt-4">
                <Link to={`/quiz/${quiz.id}`} className="block">
                  <Button variant="outline" size="md" className="w-full font-bold group-hover:bg-blue-50 group-hover:border-blue-300 group-hover:text-blue-700" icon={ArrowRight}>
                    Launch Diagnostic Test
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </PageTransition>
  );
}
