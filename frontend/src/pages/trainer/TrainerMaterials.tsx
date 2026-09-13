import React, { useState, useEffect } from 'react';
import { materialApi } from '../../api/material.api';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  RefreshCw,
  Trash2,
  AlertCircle,
  Eye,
  Layers,
  Sparkles,
  X,
  FileCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TrainerMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Notifications
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Inspect Chunks Modal
  const [inspectingMaterial, setInspectingMaterial] = useState<any | null>(null);
  const [chunksLoading, setChunksLoading] = useState(false);
  const [chunksData, setChunksData] = useState<any[]>([]);

  const loadMaterials = async () => {
    try {
      const data = await materialApi.getMaterials();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !selectedFile) {
      setFeedback({ type: 'error', message: 'Please provide a document title or select a file.' });
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      const docTitle = title.trim() || selectedFile?.name || 'MoSPI Statistical Manual';
      const fileExt = selectedFile?.name?.split('.').pop()?.toLowerCase() || 'pdf';
      const matType = fileExt === 'docx' ? 'docx' : fileExt === 'txt' ? 'txt' : 'pdf';

      const res = await materialApi.uploadMaterial({
        title: docTitle,
        description: description.trim() || 'MoSPI official statistical methodology documentation',
        material_type: matType,
        file: selectedFile,
      });

      setFeedback({
        type: 'success',
        message: res.message || `Successfully uploaded and indexed "${docTitle}". Generated ${res.chunk_count || 'multiple'} knowledge chunks.`,
      });

      // Clear inputs
      setTitle('');
      setDescription('');
      setSelectedFile(null);

      // Refresh list immediately
      await loadMaterials();
    } catch (err: any) {
      console.error('Error uploading material:', err);
      const errMsg = err?.response?.data?.detail || err?.message || 'Failed to upload and index document.';
      setFeedback({
        type: 'error',
        message: `Upload failed: ${errMsg}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (materialId: string, docTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${docTitle}" and its vector chunks?`)) return;

    try {
      await materialApi.deleteMaterial(materialId);
      setFeedback({
        type: 'success',
        message: `Deleted "${docTitle}" from knowledge repository.`,
      });
      await loadMaterials();
    } catch (err: any) {
      console.error('Error deleting material:', err);
      setFeedback({
        type: 'error',
        message: 'Failed to delete material: ' + (err?.response?.data?.detail || err.message),
      });
    }
  };

  const handleInspectChunks = async (mat: any) => {
    setInspectingMaterial(mat);
    setChunksLoading(true);
    try {
      const data = await materialApi.getMaterialById(mat.id);
      setChunksData(data?.chunks || []);
    } catch (err) {
      console.error('Error loading chunks:', err);
      setChunksData([]);
    } finally {
      setChunksLoading(false);
    }
  };

  const handleQuickSample = (sampleTitle: string, sampleDesc: string) => {
    setTitle(sampleTitle);
    setDescription(sampleDesc);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Training Materials & Knowledge Repository
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Statistical methodology manuals, guidelines, and survey SOPs indexed in pgvector for RAG MCQ generation
          </p>
        </div>

        <button
          onClick={loadMaterials}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Repository</span>
        </button>
      </div>

      {/* Real-Time Feedback Banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-4 rounded-xl border text-xs flex items-start justify-between gap-3 ${
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
            <button
              onClick={() => setFeedback(null)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Card */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Upload & Index Document</h2>
            <p className="text-xs text-zinc-500">Supports PDF, DOCX, TXT manuals</p>
          </div>

          {/* Quick Pre-fill Samples */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-zinc-500">Quick Statistical Templates:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickSample(
                    'MoSPI Price Statistics & CPI Revision Manual.pdf',
                    'Comprehensive documentation on Laspeyres Index, CPI item weight allocation, and base-year price revisions.'
                  )
                }
                className="text-[10px] px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium transition-colors"
              >
                + CPI Manual
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickSample(
                    'NSS 80th Round Multi-Stage Sampling Design SOP.pdf',
                    'Operational guide on Primary Sampling Units (PSUs), survey multipliers, and stratified cluster sampling.'
                  )
                }
                className="text-[10px] px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium transition-colors"
              >
                + NSS SOP
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickSample(
                    'National Accounts & GVA Formulation Guide (SNA 2008).docx',
                    'Guidelines on Gross Value Added (GVA), sequence of economic accounts, FISIM allocation, and capital formation.'
                  )
                }
                className="text-[10px] px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium transition-colors"
              >
                + National Accounts
              </button>
            </div>
          </div>

          <form onSubmit={handleUpload} className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-zinc-700 block mb-1">
                Document Title <span className="text-zinc-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MoSPI Price Statistics Compilation Manual.pdf"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 block mb-1">
                Methodology Summary / Scope
              </label>
              <textarea
                rows={3}
                placeholder="Detailed description of formulas, survey procedures, and validation rules..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 resize-none transition-all"
              ></textarea>
            </div>

            {/* File Dropzone */}
            <div className="p-4 rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 text-center space-y-2 hover:border-zinc-300 transition-colors">
              <UploadCloud className="w-6 h-6 text-zinc-400 mx-auto" />
              <div className="text-xs text-zinc-600">
                <label className="font-semibold text-zinc-900 cursor-pointer hover:underline">
                  Select Document File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        if (!title) setTitle(file.name);
                      }
                    }}
                  />
                </label>
                {selectedFile ? (
                  <div className="mt-2 p-2 rounded bg-white border border-zinc-200 text-zinc-900 font-medium text-xs flex items-center justify-between max-w-xs mx-auto">
                    <span className="truncate">{selectedFile.name}</span>
                    <span className="text-[10px] text-zinc-400">
                      {Math.round(selectedFile.size / 1024)} KB
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    or leave empty to auto-index manual from title & description
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || (!title.trim() && !selectedFile)}
              className="w-full py-2.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Ingesting & Chunking Document...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload & Index Knowledge Base</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Materials List */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Indexed Knowledge Base</h2>
              <p className="text-xs text-zinc-500">Live vector embeddings in Supabase ({materials.length} manuals)</p>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-zinc-400">
              Loading knowledge repository...
            </div>
          ) : materials.length === 0 ? (
            <div className="p-10 rounded-xl border border-zinc-200 text-center space-y-2">
              <FileText className="w-6 h-6 mx-auto text-zinc-400" />
              <p className="text-xs font-medium text-zinc-700">No training materials uploaded yet</p>
              <p className="text-[11px] text-zinc-400">
                Upload your first methodology manual to enable RAG-grounded MCQ generation.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-4 rounded-lg border border-zinc-200 bg-white space-y-3 hover:border-zinc-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-xs font-semibold text-zinc-900">{mat.title}</h3>
                        <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {mat.description || 'MoSPI official statistical methodology document.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleInspectChunks(mat)}
                        className="p-1.5 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        title="View Indexed Chunks"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(mat.id, mat.title)}
                        className="p-1.5 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between text-[11px] text-zinc-500 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono uppercase font-semibold text-zinc-700">
                        {mat.material_type || 'PDF'}
                      </span>
                      <span>
                        {mat.chunk_count ? `${mat.chunk_count} Chunks` : 'Indexed'}
                      </span>
                      {mat.file_size_bytes && (
                        <span>{Math.round(mat.file_size_bytes / 1024)} KB</span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-zinc-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready for AI Generation
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inspect Chunks Modal */}
      <AnimatePresence>
        {inspectingMaterial && (
          <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-zinc-900">
                    Knowledge Chunks: {inspectingMaterial.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    pgvector segmented passages used as grounding context for RAG
                  </p>
                </div>
                <button
                  onClick={() => setInspectingMaterial(null)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {chunksLoading ? (
                  <div className="p-8 text-center text-xs text-zinc-400">Loading chunks...</div>
                ) : chunksData.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-400">No chunks found for this document.</div>
                ) : (
                  chunksData.map((chunk, idx) => (
                    <div key={chunk.id || idx} className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span className="font-semibold text-zinc-800">
                          {chunk.section_title || `Chunk #${idx + 1}`}
                        </span>
                        <span>{chunk.token_count || '120'} tokens • Page {chunk.page_number || 1}</span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed font-sans whitespace-pre-line">
                        {chunk.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-zinc-100 flex justify-end">
                <button
                  onClick={() => setInspectingMaterial(null)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
