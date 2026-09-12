import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Target,
  Compass,
  BookOpen,
  FileText,
  HelpCircle,
  BarChart3,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout, openAiAdvisor } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Competencies', path: '/competencies', icon: Target },
    { name: 'My Learning Path', path: '/learning-path', icon: Compass, badge: 'Targeted' },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Learning Materials', path: '/materials', icon: FileText, badge: 'AI Gen' },
    { name: 'Assessments', path: '/quiz', icon: HelpCircle },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800/90 transition-transform duration-250 ease-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">Samarth</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Official Statistical System
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: LEARNER PORTAL NAVIGATION ITEMS */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          <div className="px-3 pb-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
              Learner Portal
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                    ? 'bg-blue-600/15 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/90'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left Active Animated Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 top-2 bottom-2 w-1.5 bg-blue-500 rounded-r-md shadow-sm shadow-blue-400"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div className="flex items-center gap-3.5 min-w-0 pl-1">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isActive
                            ? 'bg-blue-500/30 text-blue-200 border border-blue-400/40'
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* BOTTOM USER PROFILE & LOGOUT */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/60 space-y-3">
          {user && (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user.designation}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
