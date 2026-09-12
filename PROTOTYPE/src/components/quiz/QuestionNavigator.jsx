import React from 'react';
import { Bookmark, CheckCircle2, Circle } from 'lucide-react';
import Button from '../common/Button';

export default function QuestionNavigator({
  totalQuestions,
  currentIndex,
  onSelectIndex,
  answers = {},
  markedQuestions = {},
  onSubmit
}) {
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedQuestions).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-3 border-b border-slate-100">
          Question Navigator
        </h3>

        {/* Legend status */}
        <div className="grid grid-cols-3 gap-2 py-2 border-b border-slate-100 text-center text-xs">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-900">
            <span className="font-extrabold text-sm block">{answeredCount}</span>
            <span className="font-medium text-[11px]">Answered</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-900">
            <span className="font-extrabold text-sm block">{markedCount}</span>
            <span className="font-medium text-[11px]">Marked</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <span className="font-extrabold text-sm block">{unansweredCount}</span>
            <span className="font-medium text-[11px]">Pending</span>
          </div>
        </div>

        {/* 1-10 Grid */}
        <div className="grid grid-cols-5 gap-2.5 my-4">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const questionNum = i + 1;
            const isCurrent = currentIndex === i;
            const isAnswered = answers[questionNum] !== undefined;
            const isMarked = !!markedQuestions[questionNum];

            let bgClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
            if (isAnswered) {
              bgClass = 'bg-blue-600 text-white font-bold shadow-xs';
            }
            if (isMarked) {
              bgClass = 'bg-amber-400 text-slate-950 font-bold shadow-xs';
            }

            return (
              <button
                key={questionNum}
                type="button"
                onClick={() => onSelectIndex(i)}
                className={`h-11 rounded-xl text-sm font-bold transition-all relative flex items-center justify-center cursor-pointer ${bgClass} ${
                  isCurrent ? 'ring-3 ring-blue-600 ring-offset-2 scale-105 z-10' : ''
                }`}
              >
                {questionNum}
                {isMarked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-600 rounded-full ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 text-center leading-relaxed">
          Click any number to jump directly to that question.
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <Button
          variant="primary"
          size="lg"
          className="w-full text-sm font-bold shadow-md shadow-blue-600/20"
          onClick={onSubmit}
          icon={CheckCircle2}
        >
          Submit All Answers
        </Button>
      </div>
    </div>
  );
}
