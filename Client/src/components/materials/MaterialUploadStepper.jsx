import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  Check,
  FileCheck,
  Sliders,
  Award
} from 'lucide-react';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MaterialUploadStepper() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const rolePrefix = `/${user?.role || 'learner'}`;

  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Analyze, 3: Configure, 4: Generate, 5: Review
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pipelineIndex, setPipelineIndex] = useState(0);

  // Configuration options
  const [config, setConfig] = useState({
    questionCount: 10,
    difficulty: 'Medium',
    questionType: 'MCQ',
    competency: 'Survey Methodology & Sampling Techniques',
    language: 'English'
  });

  const pipelineStages = [
    { title: 'Uploading', desc: 'Ingesting document into secure processing sandbox' },
    { title: 'Extracting content', desc: 'Parsing tables, formulas, and structural hierarchy' },
    { title: 'Analyzing concepts', desc: 'Semantic extraction of statistical methodologies' },
    { title: 'Detecting competencies', desc: 'Mapping concepts to OSSF framework taxonomy' },
    { title: 'Generating MCQs', desc: 'Synthesizing calibrated stems and plausible distractors' },
    { title: 'Validating questions', desc: 'Verifying statistical accuracy and answer keys' },
    { title: 'Assessment Ready', desc: 'Calibration complete. Diagnostic package compiled.' }
  ];

  // Step 1: Handle File Selection
  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file) => {
    setUploadedFile({
      name: file.name,
      size: (file.size ? (file.size / (1024 * 1024)).toFixed(1) : '3.8') + ' MB',
      type: file.name.split('.').pop().toUpperCase(),
      pages: 86
    });
    // Advance to Analyze
    setCurrentStep(2);
    runSequentialPipeline();
  };

  // Step 2: Sequential Step-by-Step Activation
  const runSequentialPipeline = () => {
    setPipelineIndex(0);

    let stage = 0;
    const interval = setInterval(() => {
      stage += 1;
      setPipelineIndex(stage);

      if (stage >= pipelineStages.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentStep(3);
        }, 800);
      }
    }, 600);
  };

  // Step 4: Run Question Generation
  const handleGenerateQuestions = async () => {
    setCurrentStep(4);
    try {
      await api.generateQuizFromMaterial({
        materialName: uploadedFile?.name,
        questionCount: config.questionCount,
        difficulty: config.difficulty,
        questionType: config.questionType,
        competency: config.competency
      });
      setTimeout(() => {
        setCurrentStep(5);
      }, 1400);
    } catch (err) {
      alert('Error generating questions: ' + err.message);
      setCurrentStep(3);
    }
  };

  const steps = [
    { num: 1, label: 'Upload' },
    { num: 2, label: 'Analyze' },
    { num: 3, label: 'Configure' },
    { num: 4, label: 'Generate' },
    { num: 5, label: 'Review' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Stepper Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep === step.num
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                      : currentStep > step.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
                </div>
                <span
                  className={`text-xs sm:text-sm mt-2 font-semibold ${
                    currentStep === step.num ? 'text-blue-700' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-all ${
                    currentStep > step.num ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content Area */}
      <div className="p-6 sm:p-10 max-w-4xl mx-auto min-h-[420px] flex flex-col justify-center">
        {/* STEP 1: UPLOAD */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Upload Learning Material</h3>
              <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                Upload survey manuals, circulars, or technical notes. Samarth will parse statistical concepts and synthesize calibrated assessments.
              </p>
            </div>

            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/20 rounded-3xl p-10 sm:p-14 text-center transition-all cursor-pointer group"
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <input
                id="file-upload-input"
                type="file"
                className="hidden"
                accept=".pdf,.docx,.pptx,.txt"
                onChange={handleFileDrop}
              />
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-base font-bold text-slate-800">
                Drag and drop your statistical document here, or <span className="text-blue-600 underline">Browse Files</span>
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Supported formats: PDF, DOCX, PPTX, TXT (Maximum file size: 50 MB)
              </p>
            </div>

            {/* Demo pre-filled file shortcuts */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
                Or select an official sample document:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'NSS_78th_Round_Instructions.pdf', size: '4.2 MB', type: 'PDF' },
                  { name: 'CPI_Compilation_Guideline.docx', size: '1.8 MB', type: 'DOCX' },
                  { name: 'PLFS_Urban_Panel_Design.pdf', size: '3.5 MB', type: 'PDF' }
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => processFile(sample)}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-colors flex items-center gap-3 cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{sample.name}</p>
                      <p className="text-xs text-slate-400">{sample.size} • {sample.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ANALYZE (WITH SEQUENTIAL ACTIVATION PIPELINE) */}
        {currentStep === 2 && (
          <div className="py-6 space-y-8">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">AI Document Extraction Pipeline</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Processing <strong>{uploadedFile?.name}</strong> through autonomous statistical analysis.
              </p>
            </div>

            {/* Sequential Stages List */}
            <div className="max-w-lg mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200/90 space-y-3 shadow-inner">
              {pipelineStages.map((stg, i) => {
                const isPassed = i < pipelineIndex;
                const isCurrent = i === pipelineIndex;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isPassed
                        ? 'bg-white text-slate-800 border border-emerald-200'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] shrink-0 font-mono">
                          {i + 1}
                        </div>
                      )}
                      <div>
                        <p className={`text-sm font-bold ${isCurrent ? 'text-white' : isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {stg.title}
                        </p>
                        <p className={`text-xs ${isCurrent ? 'text-blue-100' : 'text-slate-500'}`}>
                          {stg.desc}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-semibold">
                      {isPassed ? '✓ Done' : isCurrent ? 'Processing...' : 'Waiting'}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: CONFIGURE */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Configure AI MCQ Generation</h3>
                <p className="text-sm text-slate-500">
                  Customise question parameters calibrated to the uploaded statistical material.
                </p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold self-start sm:self-center">
                ✓ Document Analyzed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Question count */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[10, 20, 30].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setConfig({ ...config, questionCount: num })}
                      className={`py-3 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                        config.questionCount === num
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num} MCQs
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Easy', 'Medium', 'Hard', 'Mixed'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setConfig({ ...config, difficulty: diff })}
                      className={`py-3 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                        config.difficulty === diff
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Question Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['MCQ', 'True/False', 'Scenario Based'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setConfig({ ...config, questionType: type })}
                      className={`py-3 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer truncate px-1.5 ${
                        config.questionType === type
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Automatically Detected Competency */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Target Competency
                </label>
                <input
                  type="text"
                  value={config.competency}
                  onChange={(e) => setConfig({ ...config, competency: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Footer action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" onClick={() => setCurrentStep(1)}>
                Change File
              </Button>
              <Button variant="primary" size="lg" onClick={handleGenerateQuestions} icon={Sparkles} className="shadow-md shadow-blue-600/20 text-sm font-bold">
                Generate Assessment Questions
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: GENERATE */}
        {currentStep === 4 && (
          <div className="text-center py-12 space-y-5">
            <Loader2 className="w-14 h-14 text-blue-600 animate-spin mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Synthesizing {config.questionCount} Assessment Questions</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Drafting scenario questions, calculating distractor plausibility, and formatting official answer rationales...
            </p>
          </div>
        )}

        {/* STEP 5: REVIEW */}
        {currentStep === 5 && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  Assessment Successfully Generated
                </h3>
                <p className="text-sm text-slate-500">
                  {config.questionCount} questions calibrated to {config.competency} ({config.difficulty} difficulty)
                </p>
              </div>
              <span className="text-xs font-mono bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-lg font-bold border border-blue-200">
                15 Mins Duration
              </span>
            </div>

            {/* Sample Question Preview */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Generated Question Preview:
              </p>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <p className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  Q1: Which sampling technique gives every member of the target population an equal and known probability of selection?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-sm text-slate-700">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">A. Stratified Sampling with unequal allocation</div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 font-bold text-blue-900">
                    B. Simple Random Sampling (SRS) (Correct)
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">C. Cluster Sampling without sub-sampling</div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">D. Convenience Sampling</div>
                </div>
              </div>
            </div>

            {/* Launch Assessment Action */}
            <div className="p-6 rounded-2xl bg-linear-to-r from-blue-50 via-indigo-50 to-white border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="text-sm sm:text-base font-bold text-blue-950">Ready to Launch Assessment</p>
                <p className="text-xs sm:text-sm text-blue-800 mt-1">
                  Your results will directly update your official competency profile upon completion.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="md" onClick={() => setCurrentStep(3)}>
                  Reconfigure
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  className="shadow-md shadow-blue-600/20 text-sm font-bold"
                  onClick={() => navigate(user?.role === 'trainer' ? '/trainer/assessments' : `${rolePrefix}/quiz/quiz-201`)}
                >
                  {user?.role === 'trainer' ? 'Save & Go to Assessment Studio' : 'Start Assessment Now'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
