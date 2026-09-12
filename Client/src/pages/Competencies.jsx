import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Search, Filter, Layers, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import CompetencyCard from '../components/competency/CompetencyCard';
import CompetencyModal from '../components/competency/CompetencyModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PageTransition, FadeIn } from '../components/common/animations';
import * as api from '../services/api';

export default function Competencies() {
  const navigate = useNavigate();
  const [competencies, setCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [activeModalComp, setActiveModalComp] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getCompetencies();
        setCompetencies(res);
      } catch (err) {
        console.error('Error fetching competencies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading Official Statistical System Framework competencies..." />;
  }

  const categories = ['All', ...new Set(competencies.map((c) => c.category))];
  const levels = ['All', 'Strong', 'Moderate', 'Needs Improvement'];

  const filtered = competencies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
    return matchesSearch && matchesCat && matchesLevel;
  });

  const handleAction = (comp) => {
    if (comp.name.includes('Python')) {
      navigate('/learning-path');
    } else {
      navigate(`/courses?competency=${encodeURIComponent(comp.name)}`);
    }
  };

  return (
    <PageTransition className="space-y-8 pb-12">
      <PageHeader
        title="Competency Management Matrix"
        badge={
          <span className="text-xs bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-full border border-slate-200">
            {competencies.length} Official Competencies
          </span>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search competencies by keyword or description..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Level Quick Filter */}
          <div className="flex items-center gap-2 overflow-x-auto text-sm">
            <span className="text-slate-400 font-medium text-xs shrink-0">Status:</span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer text-xs font-semibold ${
                  selectedLevel === lvl
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full transition-colors shrink-0 cursor-pointer font-medium ${
                selectedCategory === cat
                  ? 'bg-blue-100 text-blue-800 font-bold border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((comp) => (
          <CompetencyCard
            key={comp.id}
            competency={comp}
            onOpenDetail={(c) => setActiveModalComp(c)}
            onAction={handleAction}
          />
        ))}
      </div>

      {/* Drill-down Modal */}
      {activeModalComp && (
        <CompetencyModal
          competency={activeModalComp}
          isOpen={!!activeModalComp}
          onClose={() => setActiveModalComp(null)}
        />
      )}
    </PageTransition>
  );
}
