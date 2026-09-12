import React from 'react';
import { User, Shield, Briefcase, Mail } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { PageTransition, FadeIn } from '../components/common/animations';

export default function WorkforceManagement() {
  const officials = [
    { id: 101, name: 'Ravi Kumar', dept: 'Data Analysis Div', role: 'Learner', score: 85 },
    { id: 102, name: 'Priya Singh', dept: 'National Accounts', role: 'Trainer', score: 92 },
    { id: 103, name: 'Amit Patel', dept: 'Survey Design Div', role: 'Learner', score: 64 },
    { id: 104, name: 'Neha Gupta', dept: 'Field Operations', role: 'Learner', score: 71 },
  ];

  return (
    <PageTransition className="space-y-8">
      <PageHeader
        title="Workforce Management"
        subtitle="Manage official records, assign roles, and monitor individual compliance with capacity building."
        badge={
          <span className="text-xs bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-full border border-slate-300">
            Organization Directory
          </span>
        }
      />

      <FadeIn delay={0.1}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Official Name</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Platform Role</th>
                  <th className="px-6 py-4">Overall Competency</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {officials.map(official => (
                  <tr key={official.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                          {official.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-bold text-slate-800">{official.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        {official.dept}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
                        official.role === 'Trainer' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {official.role === 'Trainer' ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        {official.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                          <div className={`h-full rounded-full ${
                            official.score >= 80 ? 'bg-emerald-500' : official.score >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                          }`} style={{ width: `${official.score}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{official.score}/100</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 cursor-pointer"
                        onClick={() => alert(`Opening mail client to contact ${official.name}...`)}
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  );
}
