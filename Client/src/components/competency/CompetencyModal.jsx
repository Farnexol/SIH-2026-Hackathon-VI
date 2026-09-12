import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, AlertCircle, BookOpen, FileCheck, ArrowRight, Shield } from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import Button from '../common/Button';

export default function CompetencyModal({ competency, isOpen, onClose }) {
  const navigate = useNavigate();

  if (!competency) return null;

  const isDeficit = competency.currentScore < competency.requiredScore;
  const gapValue = isDeficit ? competency.requiredScore - competency.currentScore : 0;

  const handleStartPath = () => {
    onClose();
    if (competency.name.includes('Python')) {
      navigate('/learning-path');
    } else {
      navigate(`/courses?competency=${encodeURIComponent(competency.name)}`);
    }
  };

  const handleLaunchAssessment = () => {
    onClose();
    navigate('/quiz/quiz-201');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={competency.name}
      subtitle={`Competency ID: ${competency.id} • ${competency.category}`}
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleStartPath} icon={ArrowRight}>
            Launch Learning Roadmap
          </Button>
        </>
      }
    >
      <div className="space-y-5 text-xs text-slate-600">
        {/* Score & Benchmark Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Current Proficiency</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{competency.currentScore}%</p>
            <span className="text-[10px] text-slate-400">Assessed {competency.lastAssessed}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Cadre Benchmark</span>
            <p className="text-xl font-bold text-slate-700 mt-0.5">{competency.requiredScore}%</p>
            <span className="text-[10px] text-slate-400">OSSF Grade II Mandate</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Status / Gap</span>
            <p className={`text-xl font-bold mt-0.5 ${isDeficit ? 'text-rose-600' : 'text-emerald-600'}`}>
              {isDeficit ? `-${gapValue}%` : 'Satisfied'}
            </p>
            <span className="text-[10px] text-slate-400">{competency.level}</span>
          </div>
        </div>

        {/* Progress Representation */}
        <div>
          <ProgressBar
            value={competency.currentScore}
            max={100}
            showLabel
            label="Proficiency vs. 100% Mastery"
            size="md"
            color={competency.level === 'Strong' ? 'emerald' : competency.level === 'Moderate' ? 'amber' : 'rose'}
          />
        </div>

        {/* Competency Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Syllabus &amp; Operational Scope
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
            {competency.description}
          </p>
        </div>

        {/* Assessment History */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Assessment &amp; Diagnostic History
          </h4>
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
            <div className="p-2.5 flex items-center justify-between bg-slate-50 font-medium text-slate-700">
              <span className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Quarterly Adaptive Assessment Checkpoint</span>
              </span>
              <span className="font-bold text-slate-900">{competency.currentScore}% Score</span>
            </div>
            <div className="p-2.5 flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Initial Cadre Baseline Diagnostic</span>
              </span>
              <span className="font-semibold text-slate-700">54% Score</span>
            </div>
          </div>
        </div>

        {/* Recommended Learning Action */}
        <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200/80">
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-950">Targeted Capacity Building Recommendation</p>
              <p className="mt-1 text-xs text-blue-800 leading-relaxed">
                {competency.recommendedAction}. Mapped to official training materials within the iGOT Karmayogi ecosystem.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleLaunchAssessment}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
                >
                  Take Diagnostic Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
