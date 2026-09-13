import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { learnerApi } from '../../api/learner.api';
import { adminApi } from '../../api/admin.api';
import {
  Target,
  Search,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const LearnerCompetencies: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'assigned' | 'directory'>('assigned');
  const [assignedComps, setAssignedComps] = useState<any[]>([]);
  const [gapsMap, setGapsMap] = useState<Record<string, any>>({});
  const [directoryComps, setDirectoryComps] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [myCompsRes, gapsRes, dirRes] = await Promise.all([
          learnerApi.getCompetencies().catch(() => []),
          learnerApi.getSkillGaps().catch(() => null),
          adminApi.getCompetencies().catch(() => []),
        ]);

        const myCompsList = Array.isArray(myCompsRes) ? myCompsRes : [];
        setAssignedComps(myCompsList);

        // Map gaps by competency_id and competency_name
        const gMap: Record<string, any> = {};
        const gapsList = gapsRes?.gaps || (Array.isArray(gapsRes) ? gapsRes : []);
        gapsList.forEach((g: any) => {
          if (g.competency_id) gMap[g.competency_id] = g;
          if (g.competency_name) gMap[g.competency_name.toLowerCase()] = g;
        });
        setGapsMap(gMap);

        const dirList = Array.isArray(dirRes) ? dirRes : [];
        setDirectoryComps(dirList);
      } catch (err) {
        console.error('Error fetching learner competencies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const displayedComps = activeTab === 'assigned' ? assignedComps : directoryComps;

  const domains = [
    'ALL',
    ...Array.from(
      new Set(
        displayedComps
          .map((c) => c.domain || 'Statistical Methodology')
          .filter(Boolean)
      )
    ),
  ];

  const filteredCompetencies = displayedComps.filter((c) => {
    const compName = c.competency_name || c.name || '';
    const compDesc = c.description || '';
    const compDomain = c.domain || 'Statistical Methodology';

    const matchesDomain = selectedDomain === 'ALL' || compDomain.toLowerCase() === selectedDomain.toLowerCase();
    const matchesSearch =
      compName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compDesc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Competency Profile & Requirements
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Role-specific competency benchmarks for {user?.full_name || 'Officer'} ({user?.designation || 'Statistical Officer'})
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/learner/assessments"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors shadow-xs"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Launch Mock Tests</span>
          </Link>
        </div>
      </div>

      {/* Primary Tabs: My Assigned vs Full Framework Directory */}
      <div className="flex items-center gap-1 border-b border-zinc-200">
        <button
          onClick={() => {
            setActiveTab('assigned');
            setSelectedDomain('ALL');
          }}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'assigned'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>My Assigned Competencies</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-100 text-zinc-700 font-mono">
            {assignedComps.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('directory');
            setSelectedDomain('ALL');
          }}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'directory'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>MoSPI Framework Directory</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-100 text-zinc-600 font-mono">
            {directoryComps.length}
          </span>
        </button>
      </div>

      {/* Search & Domain Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={
              activeTab === 'assigned'
                ? 'Search your role competencies...'
                : 'Search all MoSPI competencies...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all capitalize ${
                selectedDomain.toLowerCase() === dom.toLowerCase()
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {dom.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-400">
          Loading official competencies profile...
        </div>
      ) : filteredCompetencies.length === 0 ? (
        <div className="p-12 rounded-xl border border-zinc-200 bg-white text-center space-y-2">
          <Target className="w-6 h-6 mx-auto text-zinc-400" />
          <p className="text-xs font-medium text-zinc-700">No competencies found</p>
          <p className="text-[11px] text-zinc-400">
            Try adjusting your search query or domain filter.
          </p>
        </div>
      ) : activeTab === 'assigned' ? (
        /* Assigned Competencies Grid (Specific to This Learner) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompetencies.map((comp) => {
            const compId = comp.competency_id || comp.id;
            const compName = comp.competency_name || comp.name;
            const gap = gapsMap[compId] || gapsMap[compName.toLowerCase()] || null;

            const currentScore = Math.round(comp.score ?? gap?.current_score ?? 50);
            const currentLevel = comp.level ?? gap?.current_level ?? 2;
            const requiredLevel = gap?.required_level ?? 4;
            const requiredScore = Math.round(gap?.required_score ?? 80);
            const gapStatus = gap?.gap_status || (currentScore >= requiredScore ? 'MET' : 'MODERATE_GAP');

            const isMet = gapStatus === 'MET' || currentScore >= requiredScore;
            const isCritical = gapStatus === 'CRITICAL_GAP' || gapStatus === 'HIGH_GAP';

            return (
              <div
                key={compId}
                className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 uppercase tracking-wide">
                      {(comp.domain || 'statistical').replace(/_/g, ' ')}
                    </span>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isMet
                          ? 'bg-zinc-100 text-zinc-800 border-zinc-200'
                          : isCritical
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {isMet ? 'Met Benchmark' : isCritical ? 'Critical Gap' : 'Moderate Gap'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 tracking-tight group-hover:text-zinc-950">
                      {compName}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Assessed Level: <strong className="text-zinc-800">L{currentLevel} of 5</strong> • Benchmark: <strong className="text-zinc-800">L{requiredLevel}</strong>
                    </p>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-medium text-zinc-500">
                      <span>Proficiency Score</span>
                      <span className="text-zinc-900 font-semibold">{currentScore}% / {requiredScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden relative">
                      <div
                        className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, currentScore)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions: Take Mock Test & Learning Path */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/learner/assessments`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors shadow-xs"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Take Mock Test</span>
                  </Link>

                  <Link
                    to={`/learner/courses`}
                    className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
                  >
                    <span>Courses</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Full MoSPI Framework Directory View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompetencies.map((comp) => (
            <div
              key={comp.id}
              className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 uppercase">
                    {(comp.domain || 'General').replace(/_/g, ' ')}
                  </span>
                  <Target className="w-4 h-4 text-zinc-400" />
                </div>

                <h3 className="text-sm font-semibold text-zinc-900">{comp.name}</h3>

                <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                  {comp.description || 'Standard official statistical framework competency definition.'}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="inline-flex items-center gap-1 text-zinc-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-800" /> Ministry Benchmark
                </span>
                <Link
                  to="/learner/assessments"
                  className="text-zinc-900 font-medium hover:underline inline-flex items-center gap-1"
                >
                  Mock Test <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
