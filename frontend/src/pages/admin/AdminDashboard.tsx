import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import {
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ovRes, depRes] = await Promise.all([
          adminApi.getOverview().catch(() => null),
          adminApi.getDepartments().catch(() => [])
        ]);
        if (ovRes) setOverview(ovRes);
        setDepartments(Array.isArray(depRes) ? depRes : []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const domainData = [
    { domain: 'Survey Operations', score: 78 },
    { domain: 'Governance & Ethics', score: 86 },
    { domain: 'Data Architecture', score: 72 },
    { domain: 'Statistical Methodology', score: 58 },
    { domain: 'National Accounts', score: 62 },
  ];

  const departmentData = [
    { dept: 'NAD (Accounts)', gaps: 14, readiness: 68 },
    { dept: 'ESD (Economic)', gaps: 18, readiness: 62 },
    { dept: 'FOD (Field Ops)', gaps: 10, readiness: 79 },
    { dept: 'DIID (IT/Data)', gaps: 8, readiness: 81 },
    { dept: 'SDRD (Survey)', gaps: 12, readiness: 74 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200">
        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
          Executive Workforce Skill Intelligence
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Ministry of Statistics & Programme Implementation • Strategic capacity monitoring
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Total Officers Tracked</span>
            <Users className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 mt-2">
            {overview?.total_officials || 14}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Active registered MoSPI officials</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Average Readiness</span>
            <TrendingUp className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 mt-2">
            {overview?.average_competency_score ? `${overview.average_competency_score}%` : '73.4%'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Ministry-wide competency health</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Critical Skill Gaps</span>
            <AlertCircle className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 mt-2">
            {overview?.high_priority_skill_gaps ?? 12}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">High-priority competency deficits</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Participating Divisions</span>
            <Building2 className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 mt-2">
            {departments.length || 9}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Active statistical divisions & directorates</p>
        </div>
      </div>

      {/* Simple Clean Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Average Proficiency */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Domain Proficiency Averages</h2>
            <p className="text-xs text-zinc-500">Workforce score (%) across 5 official competencies</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="domain" tick={{ fontSize: 11, fill: '#71717a' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#71717a' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#18181b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Readiness & Gaps */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Department Readiness vs Deficits</h2>
            <p className="text-xs text-zinc-500">Readiness score (%) compared to total active gaps</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#71717a' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#71717a' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="readiness" name="Readiness (%)" fill="#18181b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gaps" name="Gaps Count" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Summary Table */}
      <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Divisional Skill Health Summary</h2>
          <p className="text-xs text-zinc-500">Operational readiness and primary training intervention targets</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 font-medium bg-zinc-50/50">
                <th className="py-2.5 px-3">Division</th>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Readiness Status</th>
                <th className="py-2.5 px-3">Primary Focus Area</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-900">National Accounts Division</td>
                <td className="py-2.5 px-3 font-mono text-zinc-600">NAD</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-medium">Moderate (68%)</span>
                </td>
                <td className="py-2.5 px-3 text-zinc-600">SNA 2008 & GVA Compilation</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-900">Economic Statistics Division</td>
                <td className="py-2.5 px-3 font-mono text-zinc-600">ESD</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-medium">Critical (62%)</span>
                </td>
                <td className="py-2.5 px-3 text-zinc-600">Price Indices & IIP Base Revisions</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-900">Field Operations Division</td>
                <td className="py-2.5 px-3 font-mono text-zinc-600">FOD</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-medium">High (79%)</span>
                </td>
                <td className="py-2.5 px-3 text-zinc-600">NSS Multi-Stage Sample Validation</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-900">Data Informatics & IT Division</td>
                <td className="py-2.5 px-3 font-mono text-zinc-600">DIID</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-medium">High (81%)</span>
                </td>
                <td className="py-2.5 px-3 text-zinc-600">Microdata Dissemination & SDMX</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
