import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';

export default function CourseFilters({
  search,
  setSearch,
  selectedCompetency,
  setSelectedCompetency,
  selectedDifficulty,
  setSelectedDifficulty,
  recommendedOnly,
  setRecommendedOnly,
  competencyOptions = []
}) {
  const difficultyOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by title, topic, or iGOT module..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* AI recommended toggle */}
        <button
          onClick={() => setRecommendedOnly(!recommendedOnly)}
          className={`px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
            recommendedOnly
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${recommendedOnly ? 'text-white' : 'text-blue-600'}`} />
          <span>AI Recommendations Only</span>
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 text-xs">
        {/* Competency filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-slate-400 font-medium text-[11px] shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Competency:
          </span>
          {['All', ...competencyOptions].map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedCompetency(comp)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors shrink-0 cursor-pointer ${
                selectedCompetency === comp
                  ? 'bg-slate-900 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-1.5 ml-auto overflow-x-auto py-1">
          <span className="text-slate-400 font-medium text-[11px] shrink-0">Difficulty:</span>
          {difficultyOptions.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors shrink-0 cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-blue-100 text-blue-800 font-semibold border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
