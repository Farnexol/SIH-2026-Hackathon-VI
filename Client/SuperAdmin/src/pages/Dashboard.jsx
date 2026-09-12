import React from 'react';
import { PageTransition, FadeIn } from '../components/common/animations';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/common/StatCard';
import { useMockStore } from '../store/useMockStore';
import { Building2, Shield, Users, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Mon', logins: 40 },
  { name: 'Tue', logins: 65 },
  { name: 'Wed', logins: 85 },
  { name: 'Thu', logins: 55 },
  { name: 'Fri', logins: 90 },
  { name: 'Sat', logins: 45 },
  { name: 'Sun', logins: 75 },
];

export default function Dashboard() {
  const { organizations, admins, users } = useMockStore();

  return (
    <PageTransition className="space-y-8 pb-12">
      <FadeIn delay={0.05}>
        <PageHeader 
          title="System Overview" 
          subtitle="Real-time telemetry and entity metrics across the Samarth platform."
          badge={
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
          }
        />
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Organizations"
            value={organizations.length}
            icon={Building2}
            iconBg="bg-blue-50 text-blue-600"
            delta="+1 this week"
            deltaType="positive"
          />
          <StatCard
            title="Active Admins"
            value={admins.length}
            icon={Shield}
            iconBg="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            title="Total Users"
            value={users.length}
            icon={Users}
            iconBg="bg-amber-50 text-amber-600"
            delta="+3 this week"
            deltaType="positive"
          />
          <StatCard
            title="System Load"
            value="24%"
            icon={Activity}
            iconBg="bg-emerald-50 text-emerald-600"
            delta="Stable"
            deltaType="neutral"
          />
        </div>
      </FadeIn>

      <FadeIn delay={0.25}>
        <div className="premium-card bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Platform Activity (7 Days)</h2>
            <p className="text-sm text-slate-500">Unique logins across all organizations.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="logins" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorLogins)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  );
}
