import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, PlayCircle, BarChart2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { PageTransition, FadeIn } from '../components/common/animations';
import { useNavigate } from 'react-router-dom';

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    materialsProcessed: 0,
    assessmentsPublished: 0,
    pendingReviews: 0
  });

  useEffect(() => {
    // Mock fetch stats
    setStats({
      materialsProcessed: 24,
      assessmentsPublished: 15,
      pendingReviews: 3
    });
  }, []);

  return (
    <PageTransition className="space-y-8">
      <PageHeader
        title="Trainer Studio Overview"
        subtitle="Manage materials, review AI-generated assessments, and monitor cadre performance."
        badge={
          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-200">
            Training & Assessment
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Materials Processed</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{stats.materialsProcessed}</h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Assessments Published</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{stats.assessmentsPublished}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Pending AI Reviews</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{stats.pendingReviews}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>

      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-indigo-500" />
              Quick Actions
            </h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-100" onClick={() => navigate("/trainer/materials")}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500 rounded-lg text-white">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-indigo-900">Upload New Material</p>
                    <p className="text-xs text-indigo-700">Ingest PDF/DOCX for AI analysis</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-slate-500" />
              Recent Drafts
            </h3>
            <div className="text-sm text-slate-500 text-center py-8">
              No drafts pending review.
            </div>
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  );
}
