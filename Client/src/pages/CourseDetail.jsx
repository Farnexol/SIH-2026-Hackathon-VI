import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  BarChart,
  CheckCircle2,
  Circle,
  PlayCircle,
  Sparkles,
  ArrowLeft,
  Shield,
  HelpCircle,
  FileCheck,
  Award
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PageTransition, FadeIn } from '../components/common/animations';
import * as api from '../services/api';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState(3);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await api.getCourseById(id || 'course-101');
        setCourse(res);
      } catch (err) {
        console.error('Error fetching course detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [id]);

  if (loading || !course) {
    return <LoadingSpinner message="Retrieving iGOT Karmayogi course syllabus..." />;
  }

  return (
    <PageTransition className="space-y-8 pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Catalog</span>
        </Link>
      </div>

      {/* Main Course Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md">
              <Shield className="w-4 h-4" />
              {course.source}
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">{course.igotCourseId}</span>
          </div>
          <Badge variant="primary" size="md">{course.difficulty}</Badge>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {course.title}
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-4xl">
            {course.description}
          </p>
        </div>

        {/* AI Recommendation Reason */}
        {course.recommendationReason && (
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/90 border border-blue-200/90 flex items-start gap-3 text-sm text-blue-950 shadow-2xs">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-900">AI Competency Alignment: </strong>
              {course.recommendationReason}
            </div>
          </div>
        )}

        {/* Metadata stats */}
        <div className="flex flex-wrap items-center gap-8 pt-2 text-sm text-slate-500 border-t border-slate-100 font-medium">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Duration: <strong className="text-slate-800">{course.duration}</strong></span>
          </span>
          <span className="flex items-center gap-2">
            <BarChart className="w-4 h-4 text-slate-400" />
            <span>Modules: <strong className="text-slate-800">{course.modules?.length || 5} Lessons</strong></span>
          </span>
          <span>Instructor: <strong className="text-slate-800">{course.instructor}</strong></span>
        </div>

        {/* Progress Bar & Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex-1 max-w-md">
            <ProgressBar
              value={course.progress}
              label="Curriculum Progress"
              showLabel
              size="md"
              color={course.progress === 100 ? 'emerald' : 'blue'}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              icon={PlayCircle}
              className="shadow-md shadow-blue-600/20 text-sm font-bold"
              onClick={() => alert(`Launching Module ${activeModuleId}: ${course.modules?.find(m => m.id === activeModuleId)?.title}`)}
            >
              {course.progress > 0 ? 'Continue Next Module' : 'Enroll & Start Learning'}
            </Button>
            <Link to="/quiz/quiz-201">
              <Button variant="outline" size="lg" icon={HelpCircle} className="text-sm font-bold">
                Launch Checkpoint Quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Syllabus Modules & Learning Objectives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Syllabus Modules */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Course Syllabus &amp; Modules</h3>
            <span className="text-xs text-slate-500 font-medium">{course.modules?.length || 5} Modules Total</span>
          </div>

          <div className="space-y-3">
            {course.modules?.map((mod) => (
              <div
                key={mod.id}
                onClick={() => setActiveModuleId(mod.id)}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  activeModuleId === mod.id
                    ? 'bg-blue-50/80 border-blue-400 shadow-sm ring-1 ring-blue-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {mod.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : mod.inProgress ? (
                    <PlayCircle className="w-5 h-5 text-blue-600 shrink-0 animate-pulse" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${activeModuleId === mod.id ? 'text-blue-950' : 'text-slate-800'}`}>
                      {mod.title}
                    </p>
                    <span className="text-xs text-slate-400">{mod.duration}</span>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                    mod.completed
                      ? 'bg-emerald-50 text-emerald-700'
                      : mod.inProgress
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {mod.completed ? 'Completed' : mod.inProgress ? 'In Progress' : 'Not Started'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Learning Objectives & Targeted Competencies */}
        <div className="lg:col-span-4 space-y-6">
          {/* Targeted Competencies */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Competencies Covered
            </h4>
            <div className="flex flex-wrap gap-2">
              {course.competencies.map((c, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Learning Objectives
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              {course.learningObjectives?.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Checkpoint Diagnostic Assessment */}
          <div className="p-6 rounded-2xl bg-linear-to-br from-slate-900 to-slate-950 text-white shadow-md space-y-4 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-blue-400" />
              <h4 className="text-sm font-bold text-white">Adaptive Checkpoint Assessment</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Validate your grasp of this course by taking the 10-question AI checkpoint quiz to update your official profile.
            </p>
            <div className="pt-2">
              <Link to="/quiz/quiz-201" className="block">
                <Button variant="primary" size="md" className="w-full font-bold shadow-md shadow-blue-600/20" icon={FileCheck}>
                  Take Assessment (15m)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
