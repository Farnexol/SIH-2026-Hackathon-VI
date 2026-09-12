import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import MaterialUploadStepper from '../components/materials/MaterialUploadStepper';

export default function UploadMaterial() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/materials"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Analyzed Materials</span>
        </Link>
      </div>

      <PageHeader
        title="AI Assessment Synthesis Wizard"
        subtitle="5-Step workflow to upload statistical materials, configure parameters, and generate domain-calibrated MCQs."
        badge={
          <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
            Official Document Pipeline
          </span>
        }
      />

      <MaterialUploadStepper />
    </div>
  );
}
