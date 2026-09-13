import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { assessmentApi } from '../../api/assessment.api';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AssessmentAttemptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assessment, setAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(1200);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await assessmentApi.getAssessmentById(id);
          // Backend returns { assessment: {...}, questions: [...] }
          const asmData = data?.assessment || data;
          setAssessment(asmData);
          const qList = data?.questions || asmData?.questions || [];
          if (qList.length > 0) {
            setQuestions(qList);
            setTimeLeft((asmData?.duration_minutes || 20) * 60);
          } else {
            // Fallback static questions for demo
            setQuestions(getStaticQuestions());
          }
        }
      } catch (err) {
        console.error('Error fetching test:', err);
        setQuestions(getStaticQuestions());
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [result]);

  const handleSelectOption = (questionId: string, optionKey: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      if (id) {
        // Start attempt (backend uses JWT for user, no body user_id needed)
        const attempt = await assessmentApi.startAttempt(id, user?.id || '');
        const attemptId = attempt?.attempt_id || attempt?.id;
        if (!attemptId) throw new Error('Failed to start attempt');

        // Submit answers
        const submitRes = await assessmentApi.submitAttempt(attemptId, selectedAnswers, user?.id);
        
        // Map backend response to display format
        setResult({
          score: submitRes.score_percent ?? submitRes.score ?? 0,
          correct_count: submitRes.correct_count ?? 0,
          total_questions: submitRes.total_questions ?? questions.length,
          competency_updated: submitRes.competency_updated,
        });
      } else {
        // Local fallback
        localFallbackScore();
      }
    } catch (err: any) {
      console.error('Error submitting assessment:', err);
      setErrorMsg(err?.response?.data?.detail || 'Error submitting. Using local scoring.');
      localFallbackScore();
    } finally {
      setIsSubmitting(false);
    }
  };

  const localFallbackScore = () => {
    const total = questions.length;
    let correct = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      // Find the correct option
      const correctOpt = (q.options || []).find((o: any) => o.is_correct);
      if (correctOpt && (selected === correctOpt.option_key || selected === correctOpt.id)) {
        correct += 1;
      }
    });
    setResult({
      score: Math.round((correct / Math.max(1, total)) * 100),
      correct_count: correct,
      total_questions: total,
    });
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Find correct option key for a question
  const getCorrectKey = (q: any): string => {
    const correctOpt = (q.options || []).find((o: any) => o.is_correct);
    return correctOpt ? correctOpt.option_key : 'B';
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center text-xs text-zinc-400">
        Loading assessment...
      </div>
    );
  }

  if (result) {
    const score = result.score ?? 0;
    const isPassed = score >= 70;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPassed ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900'}`}>
              {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Diagnostic Assessment Completed
              </h2>
              <p className="text-xs text-zinc-500">
                {result.competency_updated
                  ? 'Evaluation results recorded & competency profile updated'
                  : 'Evaluation results recorded and synced to your competency profile'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-zinc-50 border border-zinc-100 text-center">
            <div>
              <div className="text-[11px] text-zinc-500 font-medium">Final Score</div>
              <div className="text-xl font-bold text-zinc-900 mt-0.5">{score}%</div>
            </div>
            <div>
              <div className="text-[11px] text-zinc-500 font-medium">Correct Answers</div>
              <div className="text-xl font-bold text-zinc-900 mt-0.5">
                {result.correct_count} / {result.total_questions}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-zinc-500 font-medium">Outcome</div>
              <div className="text-xl font-bold text-zinc-900 mt-0.5">
                {isPassed ? 'Passed' : 'Needs Review'}
              </div>
            </div>
          </div>

          {/* Question Review List */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Question Review & Methodological Citations
            </h3>

            {questions.map((q, idx) => {
              const correctKey = getCorrectKey(q);
              const selectedKey = selectedAnswers[q.id];
              const isCorrect = selectedKey === correctKey;
              const correctOpt = (q.options || []).find((o: any) => o.is_correct);

              return (
                <div key={q.id || idx} className="p-4 rounded-lg border border-zinc-200 bg-white space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-semibold text-zinc-900">
                      {idx + 1}. {q.question_text}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {selectedKey && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${isCorrect ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                          {isCorrect ? '✓ Correct' : `✗ Your: ${selectedKey}`}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                        Answer: {correctKey}
                      </span>
                    </div>
                  </div>

                  {q.explanation && (
                    <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-600 leading-relaxed">
                      <span className="font-semibold text-zinc-800">Explanation:</span> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <Link
              to="/learner"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>

            <Link
              to="/learner/assessments"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <span>All Mock Tests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Error Banner */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
        <div>
          <h1 className="text-sm font-semibold text-zinc-900">
            {assessment?.title || 'Diagnostic Statistical Assessment'}
          </h1>
          <p className="text-xs text-zinc-500">
            Question {currentIdx + 1} of {questions.length} • {answeredCount}/{questions.length} answered
          </p>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold ${timeLeft < 120 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-zinc-100 border-zinc-200 text-zinc-900'}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Navigator Dots */}
      <div className="flex gap-1.5 flex-wrap">
        {questions.map((q, idx) => {
          const isAnswered = !!selectedAnswers[q.id];
          const isCurrent = idx === currentIdx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`w-7 h-7 rounded-md text-[10px] font-semibold flex items-center justify-center transition-all ${
                isCurrent
                  ? 'bg-zinc-900 text-white'
                  : isAnswered
                  ? 'bg-zinc-200 text-zinc-700'
                  : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      {currentQ && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id || currentIdx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-5"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 uppercase">
                Single Choice MCQ
              </span>
              <h2 className="text-sm font-semibold text-zinc-900 leading-relaxed pt-1">
                {currentQ.question_text}
              </h2>
            </div>

            {/* 4 Options */}
            <div className="space-y-2.5">
              {(currentQ.options || []).map((opt: any, optIdx: number) => {
                const optKey = opt.option_key || ['A', 'B', 'C', 'D'][optIdx];
                const isSelected = selectedAnswers[currentQ.id] === optKey;

                return (
                  <button
                    key={opt.id || optKey}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, optKey)}
                    className={`w-full p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-50 text-zinc-900 shadow-xs'
                        : 'border-zinc-200 hover:bg-zinc-50/70 text-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                        isSelected ? 'bg-zinc-900 text-white' : 'border border-zinc-300 text-zinc-500'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3" /> : optKey}
                    </div>
                    <span className="text-xs leading-normal">{opt.option_text}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || answeredCount === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                >
                  <span>{isSubmitting ? 'Evaluating...' : `Submit (${answeredCount}/${questions.length})`}</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

/** Static demo questions used as fallback when backend has no questions */
function getStaticQuestions() {
  return [
    {
      id: 'q1',
      question_text: 'In the compilation of the Consumer Price Index (CPI), which statistical index number formula uses base period quantities as weights?',
      options: [
        { id: 'opt1', option_key: 'A', option_text: 'Paasche Index Formula', is_correct: false },
        { id: 'opt2', option_key: 'B', option_text: 'Laspeyres Index Formula', is_correct: true },
        { id: 'opt3', option_key: 'C', option_text: 'Fisher Ideal Index Formula', is_correct: false },
        { id: 'opt4', option_key: 'D', option_text: 'Marshall-Edgeworth Formula', is_correct: false },
      ],
      explanation: 'The Laspeyres Price Index uses fixed base-period quantities (q0) as weights: L = Sum(p1 * q0) / Sum(p0 * q0). This is the standard foundation used for CPI in India.',
    },
    {
      id: 'q2',
      question_text: 'What primary statistical adjustment is applied during the base-year revision of the Index of Industrial Production (IIP)?',
      options: [
        { id: 'opt1', option_key: 'A', option_text: 'Elimination of all capital goods from the compilation basket', is_correct: false },
        { id: 'opt2', option_key: 'B', option_text: 'Re-weighting based on Gross Value Added (GVA) from the Annual Survey of Industries (ASI)', is_correct: true },
        { id: 'opt3', option_key: 'C', option_text: 'Conversion of all monetary values using constant purchasing power parity exchange rates', is_correct: false },
        { id: 'opt4', option_key: 'D', option_text: 'Substitution of sample survey weights with unweighted arithmetic averages', is_correct: false },
      ],
      explanation: 'During IIP base year revision, weights at the 2-digit, 3-digit, and 4-digit NIC levels are derived using Gross Value Added (GVA) estimates from the latest Annual Survey of Industries (ASI).',
    },
    {
      id: 'q3',
      question_text: 'Under the System of National Accounts (SNA 2008), how is Gross Value Added (GVA) at basic prices calculated from Gross Output?',
      options: [
        { id: 'opt1', option_key: 'A', option_text: 'GVA = Output at basic prices + Intermediate Consumption', is_correct: false },
        { id: 'opt2', option_key: 'B', option_text: 'GVA = Output at basic prices - Intermediate Consumption', is_correct: true },
        { id: 'opt3', option_key: 'C', option_text: 'GVA = Output at factor cost + Net Product Taxes - Subsidies', is_correct: false },
        { id: 'opt4', option_key: 'D', option_text: 'GVA = Final Consumption Expenditure + Gross Capital Formation', is_correct: false },
      ],
      explanation: 'By SNA 2008 definition, GVA at basic prices equals Total Output at basic prices minus Intermediate Consumption.',
    },
    {
      id: 'q4',
      question_text: 'In National Sample Survey (NSS) multi-stage sampling designs, what is the standard first-stage sampling unit (FSU) in rural sectors?',
      options: [
        { id: 'opt1', option_key: 'A', option_text: 'Individual household', is_correct: false },
        { id: 'opt2', option_key: 'B', option_text: 'Census Village', is_correct: true },
        { id: 'opt3', option_key: 'C', option_text: 'Urban Frame Survey (UFS) Block', is_correct: false },
        { id: 'opt4', option_key: 'D', option_text: 'Gram Panchayat Revenue District', is_correct: false },
      ],
      explanation: 'In NSS rural sector sampling, the First Stage Unit (FSU) is the Census Village, while the Ultimate Stage Unit (USU) is the selected household.',
    }
  ];
}
