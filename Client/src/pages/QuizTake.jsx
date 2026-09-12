import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, HelpCircle, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ProgressBar from '../components/common/ProgressBar';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuestionNavigator from '../components/quiz/QuestionNavigator';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PageTransition } from '../components/common/animations';
import * as api from '../services/api';

export default function QuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState({});

  // Timer: 15 minutes = 900 seconds
  const [timeLeft, setTimeLeft] = useState(900);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await api.getQuizById(id);
        setQuizData(res);
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  if (loading || !quizData) {
    return <LoadingSpinner message="Calibrating diagnostic questions & telemetry..." />;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quizData.questions[currentIndex];
  const totalQuestions = quizData.questions.length;

  const handleSelectOption = (optId) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optId
    }));
  };

  const handleToggleMark = () => {
    setMarkedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const confirmed = window.confirm(
      `You have answered ${Object.keys(answers).length} of ${totalQuestions} questions. Are you ready to submit your assessment?`
    );
    if (!confirmed) return;

    try {
      const submissionResult = await api.submitQuiz(id, {
        answers,
        timeSpentSeconds: 900 - timeLeft
      });
      sessionStorage.setItem('Samarth_last_quiz_result', JSON.stringify(submissionResult));
      navigate(`/quiz/${id}/result`);
    } catch (err) {
      alert('Error submitting assessment: ' + err.message);
    }
  };

  return (
    <PageTransition className="space-y-8 pb-12">
      {/* Assessment Top Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">{quizData.title}</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Official Statistical System Capacity Building Assessment • 10 Questions
            </p>
          </div>

          {/* Timer & Controls */}
          <div className="flex items-center gap-3.5 self-start sm:self-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 text-white font-mono text-sm font-extrabold shadow-sm">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <button
              type="button"
              onClick={() => setTimerActive(!timerActive)}
              className="text-xs text-slate-500 hover:text-slate-900 underline font-semibold cursor-pointer"
            >
              {timerActive ? 'Pause Timer' : 'Resume Timer'}
            </button>
          </div>
        </div>

        {/* Overall progress bar */}
        <div>
          <ProgressBar
            value={currentIndex + 1}
            max={totalQuestions}
            size="sm"
            color="blue"
          />
        </div>
      </div>

      {/* Main Quiz Layout: Left Question, Right Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Question */}
        <div className="lg:col-span-8">
          <QuizQuestion
            question={currentQuestion}
            totalQuestions={totalQuestions}
            currentNumber={currentIndex + 1}
            selectedOption={answers[currentQuestion.id]}
            isMarked={!!markedQuestions[currentQuestion.id]}
            onSelectOption={handleSelectOption}
            onToggleMark={handleToggleMark}
            onPrev={handlePrev}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isLastQuestion={currentIndex === totalQuestions - 1}
          />
        </div>

        {/* Right: Question Navigator */}
        <div className="lg:col-span-4">
          <QuestionNavigator
            totalQuestions={totalQuestions}
            currentIndex={currentIndex}
            onSelectIndex={(index) => setCurrentIndex(index)}
            answers={answers}
            markedQuestions={markedQuestions}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </PageTransition>
  );
}
