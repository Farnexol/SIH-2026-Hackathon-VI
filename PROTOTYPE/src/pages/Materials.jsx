import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, UploadCloud, Search, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import MaterialCard from '../components/materials/MaterialCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PageTransition, FadeIn } from '../components/common/animations';
import * as api from '../services/api';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadMaterials() {
      try {
        const res = await api.getMaterials();
        setMaterials(res);
      } catch (err) {
        console.error('Error fetching materials:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMaterials();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Retrieving analyzed official documentation..." />;
  }

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.summary.toLowerCase().includes(search.toLowerCase()) ||
    m.detectedCompetency.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition className="space-y-10 sm:space-y-12">
      <PageHeader
        title="AI Learning Material Analyzer"
        subtitle="Upload official learning materials, survey manuals, and technical notes. AI extracts structural concepts and synthesizes calibrated MCQ assessments."
        badge={
          <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Automated MCQ Generator
          </span>
        }
        actions={
          <Link to="/materials/upload">
            <Button variant="primary" size="md" icon={UploadCloud}>
              Upload New Material
            </Button>
          </Link>
        }
      />

      {/* Upload Hero Banner & Processing Pipeline Preview */}
      <FadeIn delay={0.1}>
        <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-br from-slate-900 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 text-xs text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
              <Sparkles className="w-4 h-4" />
              <span>MoSPI Document Processing Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight leading-snug">
              Transform Statistical Manuals into Calibrated Diagnostic Quizzes
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              StatIQ digests raw sampling guidelines, national accounting notes, and NSS instruction schedules. It analyzes semantic depth, maps concepts to Official Statistical System competencies, and generates high-fidelity multiple-choice diagnostics.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-500">Supported Formats:</span>
              <span className="bg-slate-800/80 text-slate-200 font-mono font-bold px-2.5 py-1 rounded-md border border-slate-700">PDF</span>
              <span className="bg-slate-800/80 text-slate-200 font-mono font-bold px-2.5 py-1 rounded-md border border-slate-700">DOCX</span>
              <span className="bg-slate-800/80 text-slate-200 font-mono font-bold px-2.5 py-1 rounded-md border border-slate-700">PPTX</span>
              <span className="bg-slate-800/80 text-slate-200 font-mono font-bold px-2.5 py-1 rounded-md border border-slate-700">TXT</span>
            </div>
          </div>

          <div className="shrink-0 relative z-10">
            <Link to="/materials/upload">
              <Button variant="primary" size="lg" icon={UploadCloud} className="shadow-lg shadow-blue-600/30 text-base py-3.5 px-6 font-bold">
                Launch 5-Step Generator
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Search and Material Records */}
      <FadeIn delay={0.2} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search uploaded manuals, circulars, or topics..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs font-medium"
            />
          </div>
          <span className="text-sm font-semibold text-slate-500">
            Showing <strong className="text-slate-900 font-mono">{filtered.length}</strong> Analyzed Documents
          </span>
        </div>

        {/* Materials List */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Documents Uploaded Yet</h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Upload official statistical manuals, survey instructions, or technical guidelines to generate domain-calibrated assessments.
            </p>
            <div className="pt-2">
              <Link to="/materials/upload">
                <Button variant="primary" size="sm" icon={UploadCloud}>Upload First Document</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((mat) => (
              <MaterialCard key={mat.id} material={mat} />
            ))}
          </div>
        )}
      </FadeIn>
    </PageTransition>
  );
}
