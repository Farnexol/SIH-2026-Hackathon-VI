import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

export default function QuizQuestion({
  question,
  totalQuestions,
  currentNumber,
  selectedOption,
  isMarked,
  onSelectOption,
  onToggleMark,
  onPrev,
  onNext,
  onSubmit,
  isLastQuestion
}) {
  if (!question) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-7 sm:p-10 flex flex-col justify-between min-h-[520px]">
      <div>
        {/* Question Header & Mark for Review */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/90 px-3 py-1 rounded-lg font-mono">
              Question {currentNumber} of {totalQuestions}
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              • {question.competency} ({question.difficulty})
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleMark}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isMarked
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isMarked ? 'fill-amber-700 text-amber-700' : ''}`} />
            <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
          </button>
        </div>

        {/* Animated Question Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Question Text */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {question.question}
              </h2>
            </div>

            {/* Option Selection List */}
            <div className="space-y-3.5">
              {question.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onSelectOption(opt.id)}
                    className={`w-full p-4 sm:p-5 rounded-2xl text-left border transition-all flex items-center gap-4 cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/40'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className={`text-sm sm:text-base leading-relaxed ${isSelected ? 'font-bold text-blue-950' : 'text-slate-800'}`}>
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
        <Button
          variant="outline"
          size="md"
          onClick={onPrev}
          disabled={currentNumber === 1}
          icon={ChevronLeft}
          className="text-sm font-semibold"
        >
          Previous
        </Button>

        <div className="flex items-center gap-3">
          {isLastQuestion ? (
            <Button
              variant="success"
              size="lg"
              onClick={onSubmit}
              icon={CheckCircle2}
              className="font-bold shadow-md shadow-emerald-600/20 text-sm"
            >
              Submit Assessment
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={onNext}
              className="font-bold shadow-md shadow-blue-600/20 text-sm"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
