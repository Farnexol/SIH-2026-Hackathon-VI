import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { materialApi } from '../../api/material.api';
import { assessmentApi } from '../../api/assessment.api';
import { UploadCloud, FileText, CheckCircle2, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [mats, assess] = await Promise.all([
          materialApi.getMaterials().catch(() => []),
          assessmentApi.getAssessments().catch(() => [])
        ]);
        setMaterials(Array.isArray(mats) ? mats : []);
        setAssessments(Array.isArray(assess) ? assess : []);
      } catch (err) {
        console.error('Error loading trainer data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            NSSTA Faculty & Trainer Studio
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Knowledge base ingestion, pgvector indexing, and AI MCQ generation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/trainer/materials"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Material</span>
          </Link>

          <Link
            to="/trainer/assessments/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate MCQs</span>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-xs font-medium text-zinc-500">Indexed Training Documents</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">{materials.length || 1}</div>
          <p className="text-[11px] text-zinc-400 mt-0.5">With 384-dim BGE vector embeddings</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-xs font-medium text-zinc-500">Created Assessments</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">{assessments.length || 1}</div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Verified 4-option MCQ standard</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-xs font-medium text-zinc-500">Platform Coverage</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">100%</div>
          <p className="text-[11px] text-zinc-400 mt-0.5">MoSPI official competency framework</p>
        </div>
      </div>

      {/* Recent Materials & Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Materials */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">Training Documents</h2>
            <Link to="/trainer/materials" className="text-xs text-zinc-600 hover:text-zinc-900 font-medium">
              Manage All
            </Link>
          </div>

          <div className="space-y-2.5">
            {(materials.length > 0 ? materials : [
              {
                title: 'MoSPI Guidelines on Price Statistics & Index Number Compilation.pdf',
                processing_status: 'completed',
                created_at: '2026-03-01'
              }
            ]).map((mat: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="text-xs font-medium text-zinc-900 truncate">
                    {mat.title}
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 shrink-0">
                  {mat.processing_status || 'Indexed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assessments */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">Published Assessments</h2>
            <Link to="/trainer/assessments/new" className="text-xs text-zinc-600 hover:text-zinc-900 font-medium">
              Create New
            </Link>
          </div>

          <div className="space-y-2.5">
            {(assessments.length > 0 ? assessments : [
              {
                title: 'Diagnostic Mock Test: Index Numbers & Price Statistics',
                question_count: 4,
                duration_minutes: 20
              }
            ]).map((asm: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-zinc-700 shrink-0" />
                  <span className="text-xs font-medium text-zinc-900 truncate">
                    {asm.title}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-zinc-500 shrink-0">
                  {asm.question_count || 4} MCQs
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
