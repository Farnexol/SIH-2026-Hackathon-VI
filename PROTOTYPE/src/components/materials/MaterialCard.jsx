import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, CheckCircle2, Clock, ArrowRight, HelpCircle, Layers } from 'lucide-react';
import Badge from '../common/Badge';

export default function MaterialCard({ material, onLaunchQuiz }) {
  const getFileBadge = (type) => {
    switch (type) {
      case 'PDF':
        return <span className="bg-rose-100 text-rose-700 font-bold text-xs px-2.5 py-0.5 rounded-md">PDF</span>;
      case 'DOCX':
        return <span className="bg-blue-100 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-md">DOCX</span>;
      default:
        return <span className="bg-amber-100 text-amber-700 font-bold text-xs px-2.5 py-0.5 rounded-md">PPTX</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {getFileBadge(material.type)}
                <span className="text-xs text-slate-500 font-mono font-medium">{material.size}</span>
                <span className="text-xs text-slate-400">• {material.pages} Pages</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mt-1 leading-snug line-clamp-2">
                {material.name}
              </h4>
            </div>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200 shrink-0 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {material.status}
          </span>
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {material.summary}
        </p>

        {/* Extracted Key Topics & Detected Competency */}
        <div className="space-y-2.5 pt-1">
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-700">Target Competency: </span>
            <span className="text-blue-700 font-bold">{material.detectedCompetency}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {material.keyTopics?.map((topic, i) => (
              <span
                key={i}
                className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with MCQ count & action */}
      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="font-black text-slate-900 font-mono text-base">{material.generatedQuestionsCount}</span>
          <span className="text-xs font-semibold text-slate-500">MCQs Ready</span>
        </div>

        <Link
          to="/quiz/quiz-201"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Launch Quiz</span>
        </Link>
      </div>
    </div>
  );
}
