import React, { useState, useEffect } from 'react';
import { assessmentApi } from '../../api/assessment.api';
import { materialApi } from '../../api/material.api';
import { adminApi } from '../../api/admin.api';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  RefreshCw,
  Send,
  Check,
  Edit3,
  Trash2,
  Plus,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Save,
  X,
  FileText,
  PlayCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AiAssessmentStudio: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('Price Indices, CPI & WPI Weighting Methodologies');
  const [numQuestions, setNumQuestions] = useState(4);
  const [difficulty, setDifficulty] = useState('medium');
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [selectedCompetencyId, setSelectedCompetencyId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Draft Assessment & Questions State
  const [draftAssessment, setDraftAssessment] = useState<any>(null);
  const [draftQuestions, setDraftQuestions] = useState<any[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Edit form buffer
  const [editForm, setEditForm] = useState<{
    question_text: string;
    explanation: string;
    options: Array<{ id?: string; option_key: string; option_text: string; is_correct: boolean }>;
  }>({
    question_text: '',
    explanation: '',
    options: [],
  });

  // Modal for Adding Manual Question
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    explanation: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    correctOpt: 'B',
  });

  // Notifications
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [mats, comps, assessmentsRes] = await Promise.all([
          materialApi.getMaterials().catch(() => []),
          adminApi.getCompetencies().catch(() => []),
          assessmentApi.getAssessments().catch(() => []),
        ]);
        if (Array.isArray(mats) && mats.length > 0) {
          setMaterials(mats);
          setSelectedMaterialId(mats[0].id);
        }
        if (Array.isArray(comps) && comps.length > 0) {
          setCompetencies(comps);
          setSelectedCompetencyId(comps[0].id);
        }

        // Check if there are draft assessments to resume reviewing
        const drafts = (Array.isArray(assessmentsRes) ? assessmentsRes : []).filter(
          (a: any) => a.status === 'draft'
        );
        if (drafts.length > 0) {
          const latestDraft = drafts[0];
          setDraftAssessment(latestDraft);
          const full = await assessmentApi.getAssessmentById(latestDraft.id).catch(() => null);
          if (full?.questions && full.questions.length > 0) {
            setDraftQuestions(full.questions);
          }
        }
      } catch (err) {
        console.error('Error initializing studio:', err);
      }
    };
    init();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setFeedback(null);
    setEditingQuestionId(null);

    try {
      const res = await assessmentApi.generateAssessment({
        title: topic,
        material_id: selectedMaterialId || undefined,
        competency_id: selectedCompetencyId || undefined,
        question_count: numQuestions,
        difficulty: difficulty,
      });

      setDraftAssessment(res);

      const asmId = res.assessment_id || res.id;
      if (asmId) {
        const fullAsm = await assessmentApi.getAssessmentById(asmId);
        const qList = fullAsm?.questions || [];
        setDraftQuestions(qList);
        setFeedback({
          type: 'success',
          message: `Generated ${qList.length} grounded MCQs using pgvector retrieval. Review and verify each question below.`,
        });
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setFeedback({
        type: 'error',
        message: 'Generation failed: ' + (err?.response?.data?.detail || err.message),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // 1. Toggle Single Verification Status
  const handleToggleVerify = async (questionId: string, currentStatus: boolean) => {
    const asmId = draftAssessment?.assessment_id || draftAssessment?.id;
    const newStatus = !currentStatus;

    // Optimistic UI update
    setDraftQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, is_trainer_approved: newStatus } : q))
    );

    if (asmId) {
      try {
        await assessmentApi.verifyQuestion(asmId, questionId, newStatus);
        setFeedback({
          type: 'success',
          message: newStatus ? 'Question verified and approved.' : 'Question marked pending review.',
        });
      } catch (err: any) {
        console.error('Error verifying question:', err);
        // Revert on error
        setDraftQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? { ...q, is_trainer_approved: currentStatus } : q))
        );
      }
    }
  };

  // 2. Start Editing a Question
  const handleStartEdit = (q: any) => {
    setEditingQuestionId(q.id);
    setEditForm({
      question_text: q.question_text || '',
      explanation: q.explanation || '',
      options: (q.options || []).map((o: any) => ({
        id: o.id,
        option_key: o.option_key,
        option_text: o.option_text,
        is_correct: !!o.is_correct,
      })),
    });
  };

  // 3. Save Question Edits
  const handleSaveEdit = async (questionId: string) => {
    const asmId = draftAssessment?.assessment_id || draftAssessment?.id;
    if (!asmId) return;

    try {
      await assessmentApi.updateQuestion(asmId, questionId, {
        question_text: editForm.question_text,
        explanation: editForm.explanation,
        options: editForm.options,
        is_trainer_approved: true,
      });

      // Update in state
      setDraftQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                question_text: editForm.question_text,
                explanation: editForm.explanation,
                options: editForm.options,
                is_trainer_approved: true,
              }
            : q
        )
      );

      setEditingQuestionId(null);
      setFeedback({ type: 'success', message: 'Question updated and marked verified.' });
    } catch (err: any) {
      console.error('Error saving question edit:', err);
      setFeedback({
        type: 'error',
        message: 'Failed to update question: ' + (err?.response?.data?.detail || err.message),
      });
    }
  };

  // 4. Change Correct Option in Edit Mode
  const handleSetCorrectOption = (optionKey: string) => {
    setEditForm((prev) => ({
      ...prev,
      options: prev.options.map((opt) => ({
        ...opt,
        is_correct: opt.option_key === optionKey,
      })),
    }));
  };

  // 5. Delete / Discard Question
  const handleDeleteQuestion = async (questionId: string) => {
    const asmId = draftAssessment?.assessment_id || draftAssessment?.id;
    if (!window.confirm('Discard this question from the assessment?')) return;

    setDraftQuestions((prev) => prev.filter((q) => q.id !== questionId));

    if (asmId) {
      try {
        await assessmentApi.deleteQuestion(asmId, questionId);
        setFeedback({ type: 'success', message: 'Question removed from assessment.' });
      } catch (err: any) {
        console.error('Error deleting question:', err);
      }
    }
  };

  // 6. Add Custom Question
  const handleAddCustomQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const asmId = draftAssessment?.assessment_id || draftAssessment?.id;
    if (!asmId) {
      alert('Please generate or select a draft assessment first.');
      return;
    }

    const payload = {
      question_text: newQuestion.question_text,
      explanation: newQuestion.explanation,
      options: [
        { option_key: 'A', option_text: newQuestion.optA, is_correct: newQuestion.correctOpt === 'A' },
        { option_key: 'B', option_text: newQuestion.optB, is_correct: newQuestion.correctOpt === 'B' },
        { option_key: 'C', option_text: newQuestion.optC, is_correct: newQuestion.correctOpt === 'C' },
        { option_key: 'D', option_text: newQuestion.optD, is_correct: newQuestion.correctOpt === 'D' },
      ],
      difficulty: difficulty,
    };

    try {
      await assessmentApi.addQuestion(asmId, payload);
      const fullAsm = await assessmentApi.getAssessmentById(asmId);
      setDraftQuestions(fullAsm?.questions || []);
      setShowAddModal(false);
      setNewQuestion({
        question_text: '',
        explanation: '',
        optA: '',
        optB: '',
        optC: '',
        optD: '',
        correctOpt: 'B',
      });
      setFeedback({ type: 'success', message: 'Custom question added and verified.' });
    } catch (err: any) {
      console.error('Error adding question:', err);
      setFeedback({
        type: 'error',
        message: 'Failed to add question: ' + (err?.response?.data?.detail || err.message),
      });
    }
  };

  // 7. Publish Verified Assessment
  const handlePublish = async () => {
    const asmId = draftAssessment?.assessment_id || draftAssessment?.id;
    if (!asmId) {
      setFeedback({ type: 'error', message: 'No draft assessment available to publish.' });
      return;
    }

    setIsPublishing(true);
    setFeedback(null);

    try {
      await assessmentApi.publishAssessment(asmId);
      setFeedback({
        type: 'success',
        message: '✓ Assessment published successfully! It is now live in the official learner catalog.',
      });
      // Mark all in local state as approved
      setDraftQuestions((prev) => prev.map((q) => ({ ...q, is_trainer_approved: true })));
    } catch (err: any) {
      console.error('Publishing error:', err);
      setFeedback({
        type: 'error',
        message: 'Failed to publish assessment: ' + (err?.response?.data?.detail || err.message),
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const approvedCount = draftQuestions.filter((q) => q.is_trainer_approved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            AI Assessment Studio & MCQ Verification Lab
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            RAG pgvector synthesis with human-in-the-loop verification (edit text, set correct key, approve or discard)
          </p>
        </div>

        {draftAssessment && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom MCQ</span>
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing || draftQuestions.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPublishing ? 'Publishing...' : 'Publish Verified Test'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Notification Banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
              feedback.type === 'success'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span className="font-medium">{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-zinc-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Generation Parameters */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4 self-start">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">RAG Generation Settings</h2>
            <p className="text-xs text-zinc-500">Parameters for pgvector retrieval & Gemini synthesis</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-zinc-700 block mb-1">
                Assessment Title
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 block mb-1">
                Source Knowledge Base Manual
              </label>
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 block mb-1">
                Target Competency
              </label>
              <select
                value={selectedCompetencyId}
                onChange={(e) => setSelectedCompetencyId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
              >
                {competencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.domain})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">Questions</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                >
                  <option value={3}>3 Questions</option>
                  <option value={4}>4 Questions</option>
                  <option value={5}>5 Questions</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="easy">Level 1 (Basic)</option>
                  <option value="medium">Level 3 (Applied)</option>
                  <option value="hard">Level 5 (Advanced)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing from pgvector Chunks...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Grounded MCQs</span>
                </>
              )}
            </button>
          </form>

          {/* Verification Progress Tracker */}
          {draftQuestions.length > 0 && (
            <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-900">Verification Progress:</span>
                <span className="font-mono text-zinc-800">
                  {approvedCount} / {draftQuestions.length} Approved
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round((approvedCount / Math.max(1, draftQuestions.length)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Publishing automatically verifies all items and pushes the test to the learner examination hub.
              </p>
            </div>
          )}
        </div>

        {/* Right Canvas: Human-in-the-loop Verification & Editing Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                Draft Questions Canvas ({draftQuestions.length})
              </h2>
              <p className="text-xs text-zinc-500">
                Click any option to change the answer key, edit questions inline, or verify questions
              </p>
            </div>
          </div>

          {draftQuestions.length === 0 ? (
            <div className="p-12 rounded-xl border border-dashed border-zinc-200 bg-white text-center space-y-3">
              <FileText className="w-8 h-8 text-zinc-300 mx-auto" />
              <div>
                <p className="text-xs font-semibold text-zinc-800">No Draft Assessment Active</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Configure settings on the left and click "Generate Grounded MCQs" or click "Add Custom MCQ".
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {draftQuestions.map((q, idx) => {
                const isEditing = editingQuestionId === q.id;
                const isApproved = !!q.is_trainer_approved;

                return (
                  <div
                    key={q.id || idx}
                    className={`p-5 rounded-xl bg-white border transition-all ${
                      isApproved ? 'border-zinc-300 shadow-2xs' : 'border-zinc-200 shadow-xs'
                    }`}
                  >
                    {isEditing ? (
                      /* Inline Editing Mode */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                          <span className="text-xs font-semibold text-zinc-900">
                            Editing Question #{idx + 1}
                          </span>
                          <button
                            onClick={() => setEditingQuestionId(null)}
                            className="text-xs text-zinc-400 hover:text-zinc-700"
                          >
                            Cancel
                          </button>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                            Question Text:
                          </label>
                          <textarea
                            rows={2}
                            value={editForm.question_text}
                            onChange={(e) =>
                              setEditForm({ ...editForm, question_text: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 resize-none"
                          />
                        </div>

                        {/* Options with Radio Selection for Correct Key */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-semibold text-zinc-700 block">
                            MCQ Options (Select radio button for the correct key):
                          </label>
                          {editForm.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct_opt_${q.id}`}
                                checked={opt.is_correct}
                                onChange={() => handleSetCorrectOption(opt.option_key)}
                                className="w-3.5 h-3.5 text-zinc-900 accent-zinc-900 cursor-pointer"
                              />
                              <span className="w-5 font-bold text-xs text-zinc-700">
                                {opt.option_key}:
                              </span>
                              <input
                                type="text"
                                value={opt.option_text}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditForm((prev) => ({
                                    ...prev,
                                    options: prev.options.map((o, i) =>
                                      i === optIdx ? { ...o, option_text: val } : o
                                    ),
                                  }));
                                }}
                                className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900"
                              />
                              {opt.is_correct && (
                                <span className="text-[10px] font-semibold text-zinc-900 px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200">
                                  Correct
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                            Explanation & Manual Citation:
                          </label>
                          <textarea
                            rows={2}
                            value={editForm.explanation}
                            onChange={(e) =>
                              setEditForm({ ...editForm, explanation: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 resize-none"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                          <button
                            type="button"
                            onClick={() => setEditingQuestionId(null)}
                            className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(q.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 inline-flex items-center gap-1.5 shadow-xs"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save & Verify</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display & Review Mode */
                      <div className="space-y-3.5">
                        {/* Question Header & Verification Badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-zinc-900 leading-snug">
                              {idx + 1}. {q.question_text}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Verification Button / Badge */}
                            <button
                              onClick={() => handleToggleVerify(q.id, isApproved)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors border ${
                                isApproved
                                  ? 'bg-zinc-900 text-white border-zinc-900'
                                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                              }`}
                              title="Click to toggle verification status"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isApproved ? 'Verified' : 'Verify'}</span>
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleStartEdit(q)}
                              className="p-1 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                              title="Edit Question & Options"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Discard Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Options List */}
                        <div className="space-y-1.5 pl-1">
                          {(q.options || []).map((opt: any, optIdx: number) => {
                            const isCorrect = !!opt.is_correct;
                            return (
                              <div
                                key={opt.id || optIdx}
                                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                                  isCorrect
                                    ? 'border-zinc-900 bg-zinc-50 font-medium text-zinc-950 shadow-2xs'
                                    : 'border-zinc-150 text-zinc-700 bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                      isCorrect
                                        ? 'bg-zinc-900 text-white'
                                        : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                                    }`}
                                  >
                                    {opt.option_key || ['A', 'B', 'C', 'D'][optIdx]}
                                  </span>
                                  <span>{opt.option_text}</span>
                                </div>

                                {isCorrect && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-900 px-2 py-0.5 rounded bg-zinc-200/70">
                                    <Check className="w-3 h-3" /> Correct Key
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Grounded Explanation */}
                        {q.explanation && (
                          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-600 leading-relaxed">
                            <strong className="text-zinc-800">Methodology Citation:</strong>{' '}
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Adding Manual Question */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-lg w-full p-5 space-y-4 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">Add Custom Question</h3>
                  <p className="text-xs text-zinc-500">
                    Write an authoritative statistical question directly
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddCustomQuestion} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">
                    Question Text
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Under SNA 2008, how is Gross Output defined?"
                    value={newQuestion.question_text}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, question_text: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-700 block">
                    Options & Correct Answer:
                  </label>
                  {[
                    { key: 'A', val: newQuestion.optA, setVal: (v: string) => setNewQuestion({ ...newQuestion, optA: v }) },
                    { key: 'B', val: newQuestion.optB, setVal: (v: string) => setNewQuestion({ ...newQuestion, optB: v }) },
                    { key: 'C', val: newQuestion.optC, setVal: (v: string) => setNewQuestion({ ...newQuestion, optC: v }) },
                    { key: 'D', val: newQuestion.optD, setVal: (v: string) => setNewQuestion({ ...newQuestion, optD: v }) },
                  ].map((opt) => (
                    <div key={opt.key} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="new_correct_opt"
                        checked={newQuestion.correctOpt === opt.key}
                        onChange={() => setNewQuestion({ ...newQuestion, correctOpt: opt.key })}
                        className="w-3.5 h-3.5 accent-zinc-900 cursor-pointer"
                      />
                      <span className="w-4 text-xs font-bold text-zinc-700">{opt.key}:</span>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${opt.key} text`}
                        value={opt.val}
                        onChange={(e) => opt.setVal(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">
                    Explanation
                  </label>
                  <input
                    type="text"
                    placeholder="Methodology rationale..."
                    value={newQuestion.explanation}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, explanation: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 shadow-xs"
                  >
                    Add Question
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
