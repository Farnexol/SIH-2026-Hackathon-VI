import React, { useState, useEffect } from 'react';
import { Users, Target, Activity, TrendingUp, BarChart2, Briefcase } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { PageTransition, FadeIn } from '../components/common/animations';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOfficials: 0,
    activeLearners: 0,
    avgCompetencyScore: 0,
  });

  useEffect(() => {
    // Mock fetch stats
    setStats({
      totalOfficials: 1250,
      activeLearners: 843,
      avgCompetencyScore: 68
    });
  }, []);

  return (
    <PageTransition className="space-y-8">
      <PageHeader
        title="Workforce Intelligence Console"
        subtitle="Monitor organization-wide competency distribution, skill gaps, and training effectiveness."
        badge={
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
            Admin Analytics
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Officials</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{stats.totalOfficials}</h3>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl">
            <Users className="w-6 h-6 text-slate-600" />
          </div>
        </div>
        
        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Learners</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{stats.activeLearners}</h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg. Competency Score</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{stats.avgCompetencyScore}/100</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Top Department Skill Gaps
            </h3>
            <div className="space-y-4">
               {/* Mock bars for department skill gaps */}
               {[
                 { name: 'Data Analysis Div', gap: 32 },
                 { name: 'National Accounts Div', gap: 28 },
                 { name: 'Survey Design Div', gap: 15 }
               ].map(dept => (
                 <div key={dept.name} className="space-y-1.5">
                   <div className="flex justify-between text-sm">
                     <span className="font-medium text-slate-700">{dept.name}</span>
                     <span className="text-rose-600 font-bold">{dept.gap}% Gap</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-rose-500 rounded-full" 
                       style={{ width: `${dept.gap}%` }}
                     />
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-slate-500" />
              Competency Heatmap
            </h3>
            <div className="text-sm text-slate-500 text-center py-8">
              Heatmap visualization will be rendered here.
            </div>
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  );
}
