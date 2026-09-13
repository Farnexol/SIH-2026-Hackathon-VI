import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Target,
  AlertCircle,
  BookOpen,
  ClipboardCheck,
  UploadCloud,
  FileText,
  BarChart3,
  Building2,
  Users,
  TrendingUp,
  User,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const role = (user?.role || 'LEARNER').toUpperCase();

  const learnerNav = [
    { to: '/learner', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/learner/competencies', label: 'Competencies', icon: Target },
    { to: '/learner/gaps', label: 'Skill Gaps', icon: AlertCircle },
    { to: '/learner/courses', label: 'Courses (iGOT)', icon: BookOpen },
    { to: '/learner/assessments', label: 'Mock Tests & Quizzes', icon: ClipboardCheck },
    { to: '/learner/progress', label: 'Progress', icon: TrendingUp },
    { to: '/learner/profile', label: 'My Profile', icon: User },
  ];

  const trainerNav = [
    { to: '/trainer', label: 'Overview', icon: LayoutDashboard },
    { to: '/trainer/materials', label: 'Training Materials', icon: UploadCloud },
    { to: '/trainer/assessments/new', label: 'MCQ Studio', icon: FileText },
    { to: '/trainer/assessments', label: 'Published Tests', icon: ClipboardCheck },
  ];

  const adminNav = [
    { to: '/admin', label: 'Workforce Analytics', icon: BarChart3 },
    { to: '/admin/competencies', label: 'Competency Framework', icon: Target },
    { to: '/admin/skill-gaps', label: 'Department Gaps', icon: AlertCircle },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/users', label: 'User Directory', icon: Users },
  ];

  let currentNav = learnerNav;
  if (role === 'TRAINER') currentNav = trainerNav;
  else if (role === 'ADMIN' || role === 'SUPER_ADMIN') currentNav = adminNav;

  return (
    <aside className="w-60 bg-white border-r border-zinc-200 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      <div className="p-4 border-b border-zinc-100">
        <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          Navigation
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to !== '/learner' && item.to !== '/trainer' && item.to !== '/admin' && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-100">
        <div className="px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200/60 text-[11px] text-zinc-500">
          <div className="font-semibold text-zinc-700">MoSPI Framework</div>
          <div>Connected to Supabase DB</div>
        </div>
      </div>
    </aside>
  );
};
