import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  CheckCircle2,
  Clock,
  Circle,
  Lock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PageTransition, StaggerContainer, StaggerItem, FadeIn } from '../components/common/animations';
import * as api from '../services/api';

export default function LearningPath() {
  const navigate = useNavigate();
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    async function loadPath() {
      try {
        const res = await api.getLearningPath();
        setLearningPath(res);
        const inProgress = res.steps.find((s) => s.status === 'In Progress') || res.steps[0];
        setSelectedStep(inProgress);
      } catch (err) {
        console.error('Error fetching learning path:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPath();
  }, []);

  if (loading || !learningPath) {
    return <LoadingSpinner message="Generating autonomous curriculum timeline..." />;
  }

  const getStepIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />;
      case 'In Progress':
        return <Clock className="w-6 h-6 text-blue-600 shrink-0 animate-pulse" />;
      case 'Locked':
        return <Lock className="w-5 h-5 text-slate-400 shrink-0" />;
      default:
        return <Circle className="w-5 h-5 text-slate-300 shrink-0" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="strong" size="sm">Completed</Badge>;
      case 'In Progress':
        return <Badge variant="primary" size="sm">In Progress</Badge>;
      case 'Locked':
        return <Badge variant="default" size="sm">Locked</Badge>;
      default:
        return <Badge variant="default" size="sm">Not Started</Badge>;
    }
  };

  const curNum = parseInt(learningPath.currentLevel) || 0;
  const reqNum = parseInt(learningPath.requiredLevel) || 80;
  const gapNum = Math.max(0, reqNum - curNum);

  return (
    <PageTransition className="space-y-8 sm:space-y-10 pb-12">
      <PageHeader
        title="Personalized Learning Path"
        subtitle={`Intelligent sequential learning path calibrated to close your highest competency gap: ${learningPath.competencyTarget}.`}
        badge={
          gapNum > 0 ? (
            <span className="text-xs bg-rose-50 text-rose-700 font-bold px-3 py-1 rounded-full border border-rose-200">
              High Priority Gap: {gapNum}% Deficit
            </span>
          ) : (
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
              Cadre Benchmark Satisfied
            </span>
          )
        }
      />

      {/* Target Competency Profile Banner */}
      <FadeIn delay={0.05}>
        <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
                Active Focus Area
              </span>
              <span className="text-xs text-slate-400">• Cadre Grade II Mandate</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
              {learningPath.competencyTarget}
            </h2>
          </div>

          <div className="flex items-center gap-6 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 font-mono shadow-inner">
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-sans">Current</span>
              <span className="text-2xl font-bold text-rose-400">{curNum}%</span>
            </div>
            <div className="text-slate-500 font-sans text-sm">&rarr;</div>
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-sans">Target</span>
              <span className="text-2xl font-bold text-emerald-400">{reqNum}%</span>
            </div>
            <div className="border-l border-slate-700 pl-5 text-center">
              <span className="text-xs text-slate-400 block font-sans">Remaining Gap</span>
              <span className="text-2xl font-bold text-amber-300">{gapNum}%</span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Progress Bar */}
      <FadeIn delay={0.1}>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <ProgressBar
            value={learningPath.overallProgress}
            label="Overall Learning Path Progression"
            showLabel
            size="md"
            color="blue"
          />
        </div>
      </FadeIn>

      {/* Interactive Timeline & Step Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline Column with Staggered Nodes */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-100">
            Curriculum Progression Stages
          </h3>

          <div className="relative pl-8 space-y-6 before:absolute before:left-4 before:top-4 before:bottom-4 before:w-1 before:bg-linear-to-b before:from-emerald-500 before:via-blue-500 before:to-slate-200">
            {learningPath.steps.map((step, idx) => {
              const isSelected = selectedStep?.id === step.id;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.08, duration: 0.4 }}
                  onClick={() => setSelectedStep(step)}
                  className={`relative p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 shadow-md ring-2 ring-blue-400/50 scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  {/* Indicator Icon on timeline line */}
                  <div className="absolute -left-9.5 top-6 bg-white p-1 rounded-full shadow-xs">
                    {getStepIcon(step.status)}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-slate-400 font-bold block">
                        STAGE 0{step.id} • {step.duration}
                      </span>
                      <h4 className={`text-base font-bold ${isSelected ? 'text-blue-950' : 'text-slate-900'}`}>
                        {step.title}
                      </h4>
                    </div>
                    <div>
                      {getStatusBadge(step.status)}
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  {step.status === 'Completed' && (
                    <div className="mt-3 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Certified Mastery Score: {step.score}</span>
                    </div>
                  )}

                  {step.status === 'In Progress' && (
                    <div className="mt-4 pt-2 border-t border-blue-100">
                      <ProgressBar value={step.progress || 45} size="sm" color="blue" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Step Details Pane */}
        <div className="lg:col-span-5 space-y-6">
          {selectedStep ? (
            <FadeIn delay={0.2} className="sticky top-24">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      Stage 0{selectedStep.id} Overview
                    </span>
                    {getStatusBadge(selectedStep.status)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {selectedStep.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                    <span>{selectedStep.duration}</span>
                    <span>•</span>
                    <span>{selectedStep.modulesCount} Learning Modules</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Scope &amp; Competency Impact
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    {selectedStep.description}
                  </p>
                </div>

                {selectedStep.status === 'Completed' ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <span className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      Stage Completed &amp; Certified
                    </span>
                    <p className="text-xs text-emerald-800">
                      Passed with {selectedStep.score} score on {selectedStep.completedDate}.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/courses/course-101"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                      >
                        <span>Review Course Syllabus</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : selectedStep.status === 'In Progress' ? (
                  <div className="p-5 rounded-2xl bg-blue-50/90 border border-blue-200 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-blue-900">Current Progress</span>
                      <span className="font-mono font-bold text-blue-700 text-base">{selectedStep.progress}%</span>
                    </div>
                    <ProgressBar value={selectedStep.progress || 45} size="md" color="blue" />
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full shadow-md shadow-blue-600/20 text-sm font-bold"
                      icon={ArrowRight}
                      onClick={() => navigate('/courses/course-101')}
                    >
                      Resume Learning Module
                    </Button>
                  </div>
                ) : selectedStep.status === 'Locked' ? (
                  <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-center space-y-3">
                    <Lock className="w-9 h-9 text-slate-400 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-800">Prerequisites Locked</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                      Complete preceding stages to unlock this comprehensive capstone evaluation.
                    </p>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Next prerequisite after completing Stage 02.</span>
                    </div>
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full text-sm font-bold"
                      onClick={() => navigate('/courses/course-101')}
                    >
                      Preview Syllabus
                    </Button>
                  </div>
                )}
              </div>
            </FadeIn>
          ) : null}
        </div>
      </div>
    </PageTransition>
  );
}
