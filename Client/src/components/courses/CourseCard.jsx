import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BarChart, Sparkles, ArrowRight, BookCheck, Shield } from 'lucide-react';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

export default function CourseCard({ course }) {
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Advanced':
        return <Badge variant="purple" size="sm">Advanced</Badge>;
      case 'Intermediate':
        return <Badge variant="primary" size="sm">Intermediate</Badge>;
      default:
        return <Badge variant="default" size="sm">Beginner</Badge>;
    }
  };

  return (
    <div className="premium-card bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        {/* Top metadata */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
            <Shield className="w-3.5 h-3.5" />
            {course.source || 'iGOT Karmayogi'}
          </span>
          {getDifficultyBadge(course.difficulty)}
        </div>

        {/* Title and description */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {course.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Competency badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {course.competencies.map((comp, i) => (
            <span
              key={i}
              className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md"
            >
              {comp}
            </span>
          ))}
        </div>

        {/* Duration */}
        <div className="flex items-center gap-5 text-xs text-slate-500 pt-1 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{course.duration}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BarChart className="w-4 h-4 text-slate-400" />
            <span>{course.modules?.length || 5} Modules</span>
          </span>
        </div>

        {/* AI Recommendation Reason */}
        {course.recommendationReason && (
          <div className="p-3.5 rounded-xl bg-blue-50/90 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-950 leading-relaxed shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-900">AI Rationale: </strong>
              {course.recommendationReason}
            </div>
          </div>
        )}

        {/* Progress if enrolled */}
        {course.enrolled && course.progress > 0 && (
          <div className="pt-2">
            <ProgressBar
              value={course.progress}
              label="Module Progress"
              showLabel
              size="sm"
              color={course.progress === 100 ? 'emerald' : 'blue'}
            />
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="pt-3 border-t border-slate-100">
        <Link
          to={`/courses/${course.id}`}
          className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            course.progress === 100
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              : course.enrolled && course.progress > 0
              ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20'
          }`}
        >
          {course.progress === 100 ? (
            <>
              <BookCheck className="w-4 h-4" />
              <span>Review Syllabus</span>
            </>
          ) : course.enrolled && course.progress > 0 ? (
            <>
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
