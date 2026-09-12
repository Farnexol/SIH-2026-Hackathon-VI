import React from 'react';
import { HelpCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { PageTransition, FadeIn } from '../components/common/animations';

export default function AssessmentStudio() {
  const drafts = [
    { id: 1, title: 'Survey Sampling Methodology', questions: 15, status: 'Draft', time: '2h ago' },
    { id: 2, title: 'National Accounts Overview', questions: 10, status: 'Ready for Review', time: '1d ago' }
  ];

  return (
    <PageTransition className="space-y-8">
      <PageHeader
        title="Assessment Studio"
        subtitle="Review, edit, and publish AI-generated mock tests before learners can take them."
        badge={
          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-200">
            Quality Assurance
          </span>
        }
      />

      <FadeIn delay={0.1}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Draft Assessments</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {drafts.map(draft => (
              <div key={draft.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <HelpCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{draft.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium">
                      <span>{draft.questions} Questions</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {draft.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {draft.status === 'Draft' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-600 bg-slate-100 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5" /> {draft.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {draft.status}
                    </span>
                  )}
                  <button 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                    onClick={() => alert(`Reviewing: ${draft.title}\n\nOpening AI Assessment Editor...`)}
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  );
}
