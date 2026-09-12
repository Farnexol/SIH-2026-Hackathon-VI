import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  ExternalLink,
  ChevronDown,
  LayoutDashboard,
  Compass,
  BookOpen,
  HelpCircle,
  Target,
  BarChart3,
  FileText,
  FilePlus,
  Clock,
  FileCheck,
  FolderArchive,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// LEVEL 1 NAVIGATION ITEMS
const LEVEL_1_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'learning', name: 'Learning', path: '/learning-path', icon: Compass },
  { id: 'ai-tools', name: 'AI Tools', path: '/materials', icon: Sparkles },
  { id: 'competency', name: 'Competency', path: '/competencies', icon: Target },
  { id: 'analytics', name: 'Analytics', path: '/analytics', icon: BarChart3 }
  // { id: 'resources', name: 'Resources', path: '/materials', icon: FileText }
];

// LEVEL 2 CONTEXTUAL SECTIONS & PAGES
const SECTIONS_CONFIG = {
  learning: {
    id: 'learning',
    title: 'Learning',
    subtitle: 'Cadre capacity roadmap & courses',
    defaultPath: '/learning-path',
    parentName: 'Dashboard',
    parentPath: '/dashboard',
    items: [
      { id: 'my-learning-path', name: 'My Learning Path', path: '/learning-path', icon: Compass, desc: 'Sequential stage-by-stage journey' },
      { id: 'courses', name: 'Courses', path: '/courses', icon: BookOpen, desc: 'iGOT Karmayogi integrated modules' },
      { id: 'assessments', name: 'Assessments', path: '/quiz', icon: HelpCircle, desc: 'Validated diagnostic tests' }
    ]
  },
  'ai-tools': {
    id: 'ai-tools',
    title: 'AI Tools',
    subtitle: 'Intelligent MCQ generator & document analytics',
    defaultPath: '/materials',
    parentName: 'Dashboard',
    parentPath: '/dashboard',
    items: [
      // { id: 'generate-quiz', name: 'Generate Quiz', path: '/materials/upload', icon: FilePlus, desc: '5-step MCQ generator from manuals' },
      { id: 'material-analysis', name: 'Material Analysis', path: '/materials', icon: FileText, desc: 'Statistical manual repository' },
      // { id: 'ai-recommendations', name: 'AI Recommendations', path: '/courses', icon: Target, desc: 'Role-calibrated next steps', isAdvisorTrigger: true }
    ]
  },
  competency: {
    id: 'competency',
    title: 'Competency',
    subtitle: 'Official Statistical System Framework',
    defaultPath: '/competencies',
    parentName: 'Dashboard',
    parentPath: '/dashboard',
    items: [
      { id: 'skill-gap', name: 'Skill Gap', path: '/competencies', desc: 'Identified deficit priorities' },
      { id: 'competency-assessment', name: 'Competency Assessment', path: '/quiz', icon: HelpCircle, desc: 'Skill validation checkpoint' },
      { id: 'improvement-plan', name: 'Improvement Plan', path: '/learning-path', icon: Compass, desc: 'Personalized closing roadmap' }
    ]
  },
  analytics: {
    id: 'analytics',
    title: 'Analytics',
    subtitle: 'Longitudinal cadre telemetry & audit log',
    defaultPath: '/analytics',
    parentName: 'Dashboard',
    parentPath: '/dashboard',
    items: [
      { id: 'learning-analytics', name: 'Learning Analytics', path: '/analytics', icon: BarChart3, desc: '6-month skill growth curves' }
    ]
  },
  // resources: {
  //   id: 'resources',
  //   title: 'Resources',
  //   subtitle: 'MoSPI publications & iGOT repositories',
  //   defaultPath: '/materials',
  //   parentName: 'Dashboard',
  //   parentPath: '/dashboard',
  //   items: [
  //     { id: 'learning-materials', name: 'Learning Materials', path: '/materials', icon: FileText, desc: 'NSS manuals, PLFS & CPI guides' },
  //     { id: 'igot-resources', name: 'iGOT Resources', path: '/courses', icon: BookOpen, desc: 'National training portal modules' }
  //   ]
  // }
};

export default function Navbar({ onToggleSidebar, pageTitle }) {
  const { user, logout, openAiAdvisor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [level2MenuOpen, setLevel2MenuOpen] = useState(false);
  const [mobileLevel1Open, setMobileLevel1Open] = useState(false);

  const profileRef = useRef(null);
  const level2MenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (level2MenuRef.current && !level2MenuRef.current.contains(e.target)) {
        setLevel2MenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setLevel2MenuOpen(false);
    setProfileDropdownOpen(false);
    setMobileLevel1Open(false);
  }, [location.pathname]);

  // Determine if we are on Level 1 (Dashboard / Home) or inside a Level 2 Section
  const pathname = location.pathname;
  const isLevel1 = pathname === '/dashboard' || pathname === '/';

  // Identify current section
  const getCurrentSection = () => {
    if (isLevel1) return null;

    if (location.state?.sectionId && SECTIONS_CONFIG[location.state.sectionId]) {
      return SECTIONS_CONFIG[location.state.sectionId];
    }
    if (pathname.startsWith('/learning-path') || pathname.startsWith('/courses') || pathname.startsWith('/quiz')) {
      return SECTIONS_CONFIG.learning;
    }
    if (pathname.startsWith('/materials/upload')) {
      return SECTIONS_CONFIG['ai-tools'];
    }
    if (pathname.startsWith('/materials')) {
      return SECTIONS_CONFIG.resources;
    }
    if (pathname.startsWith('/competencies')) {
      return SECTIONS_CONFIG.competency;
    }
    if (pathname.startsWith('/analytics')) {
      return SECTIONS_CONFIG.analytics;
    }
    return null;
  };

  const currentSection = getCurrentSection();

  // Multi-Level Stack Back handler
  const handleBack = () => {
    // 1. If inside a course detail page -> return to Courses list
    if (pathname.startsWith('/courses/') && pathname !== '/courses') {
      navigate('/courses');
      return;
    }
    // 2. If inside a quiz take or result page -> return to Assessments list
    if (pathname.startsWith('/quiz/') && pathname !== '/quiz') {
      navigate('/quiz');
      return;
    }
    // 3. Otherwise, return to Level 1 Dashboard
    navigate('/dashboard');
  };

  // Label for the back button
  const getBackLabel = () => {
    if (pathname.startsWith('/courses/') && pathname !== '/courses') {
      return 'Courses';
    }
    if (pathname.startsWith('/quiz/') && pathname !== '/quiz') {
      return 'Assessments';
    }
    return 'Dashboard';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 h-18 sm:h-20 bg-[#0B1F3A] border-b border-slate-800/90 text-[#CBD5E1] transition-all shadow-md">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 h-full flex items-center justify-between relative">
        
        {/* ========================================================
            LEFT SECTION: LEVEL 1 (BRAND + LINKS) OR LEVEL 2 (BACK + SECTION TITLE)
            ======================================================== */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <AnimatePresence mode="wait">
            {isLevel1 ? (
              /* --- LEVEL 1 BRANDING --- */
              <motion.div
                key="level1-branding"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 shrink-0 cursor-pointer select-none"
                onClick={() => navigate('/dashboard')}
              >
                <div className="w-10 h-10 rounded-xl bg-[#155EEF] flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/30">
                  S
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">StatIQ</span>
                    <span className="text-[10px] bg-[#155EEF]/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded font-bold">
                      SIH &apos;26
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                    Official Statistical System
                  </p>
                </div>
              </motion.div>
            ) : (
              /* --- LEVEL 2 DRILL-DOWN HEADER (← Back + Section Title) --- */
              <motion.div
                key="level2-drilldown"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 sm:gap-4 min-w-0"
              >
                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer shadow-xs group"
                  title={`Back to ${getBackLabel()}`}
                  aria-label={`Back to ${getBackLabel()}`}
                >
                  <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="hidden sm:inline">{getBackLabel()}</span>
                </button>

                {/* Section Title & Subtitle */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF9933] shrink-0 shadow-xs shadow-amber-500/50" />
                    <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate">
                      {currentSection?.title || pageTitle || 'Section'}
                    </h2>
                  </div>
                  {currentSection?.subtitle && (
                    <p className="text-[11px] text-slate-400 truncate hidden md:block">
                      {currentSection.subtitle}
                    </p>
                  )}
                </div>

                {/* LEVEL 2 CONTEXTUAL MENU BUTTON (☰) */}
                {currentSection && (
                  <div className="relative" ref={level2MenuRef}>
                    <button
                      onClick={() => setLevel2MenuOpen(!level2MenuOpen)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        level2MenuOpen
                          ? 'bg-[#155EEF] text-white shadow-sm shadow-blue-500/40'
                          : 'bg-slate-800/90 hover:bg-slate-700 text-blue-300 border border-blue-500/30'
                      }`}
                      aria-label="Toggle section contextual menu"
                    >
                      <Menu className="w-4 h-4" />
                      <span className="hidden sm:inline">Menu</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${level2MenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* FLOATING CONTEXTUAL DROPDOWN PANEL */}
                    <AnimatePresence>
                      {level2MenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-[#0B1F3A] border border-slate-700/90 rounded-2xl shadow-2xl p-2.5 z-50 text-slate-200"
                        >
                          <div className="px-3 py-2 border-b border-slate-800 mb-1.5 flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF9933]">
                              {currentSection.title} Navigation
                            </span>
                            <span className="text-[10px] text-slate-400">Level 2</span>
                          </div>

                          <div className="space-y-1">
                            {currentSection.items.map((subItem) => {
                              const SubIcon = subItem.icon || Target;
                              const isActive = pathname === subItem.path;

                              const handleClick = (e) => {
                                if (subItem.isAdvisorTrigger) {
                                  e.preventDefault();
                                  openAiAdvisor();
                                  setLevel2MenuOpen(false);
                                  return;
                                }
                                setLevel2MenuOpen(false);
                                navigate(subItem.path, { state: { sectionId: currentSection.id } });
                              };

                              return (
                                <button
                                  key={subItem.id}
                                  onClick={handleClick}
                                  className={`w-full text-left flex items-start gap-3 p-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer group ${
                                    isActive
                                      ? 'bg-[#155EEF]/25 text-white font-bold border border-blue-500/40'
                                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                                  }`}
                                >
                                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                                    isActive ? 'bg-[#155EEF] text-white' : 'bg-slate-800 text-blue-300 group-hover:text-white'
                                  }`}>
                                    <SubIcon className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="font-bold leading-tight">{subItem.name}</p>
                                      {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5 truncate leading-tight">
                                      {subItem.desc}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========================================================
              LEVEL 1 MAIN DESKTOP NAVIGATION ITEMS (Shown on Dashboard or when not drilled down)
              ======================================================== */}
          {isLevel1 && (
            <nav className="hidden lg:flex items-center gap-1.5 ml-4">
              {LEVEL_1_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path, { state: { sectionId: item.id } })}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-[#155EEF] text-white shadow-xs shadow-blue-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    {/* Orange Active Indicator Accent */}
                    {isActive && (
                      <span className="w-1 h-3.5 bg-[#FF9933] rounded-full shrink-0 shadow-xs shadow-amber-500/50" />
                    )}
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* ========================================================
            RIGHT SECTION: AI ADVISOR, NOTIFICATIONS, PROFILE, MOBILE MENU
            ======================================================== */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* AI Advisor Button */}
          <button
            onClick={openAiAdvisor}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/25 to-indigo-600/25 hover:from-blue-600/40 hover:to-indigo-600/40 text-blue-200 border border-blue-500/40 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer hover:border-blue-400"
            title="Open StatIQ AI Learning Advisor"
          >
            <Sparkles className="w-4 h-4 text-[#FF9933] animate-pulse" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
              aria-label="User profile menu"
            >
              <div className="w-9 h-9 rounded-xl bg-[#155EEF] text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-xs shadow-blue-600/30">
                {user?.name ? user.name.trim().split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SO'}
              </div>
              <div className="hidden xl:block text-left leading-tight">
                <p className="text-xs font-bold text-white">{user?.name || 'Officer'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.designation || 'Statistical Officer'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-[#0B1F3A] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs sm:text-sm text-slate-300"
                >
                  <div className="px-3.5 py-3 border-b border-slate-800 bg-slate-900/60 rounded-xl mb-1">
                    <p className="font-bold text-white text-sm">{user?.name || 'Officer'}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
                    <span className="inline-block mt-1 font-mono text-[10px] text-blue-300 font-bold bg-blue-500/20 px-2 py-0.5 rounded">
                      ID #{user?.id || user?.employeeId || '1'}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-800/80 text-slate-200 hover:text-white rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold">My Profile & Cadre</span>
                    </Link>

                    <a
                      href="https://igotkarmayogi.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-800/80 text-slate-200 hover:text-white rounded-xl transition-colors"
                    >
                      <span className="flex items-center gap-2.5 font-semibold">
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                        <span>iGOT Karmayogi</span>
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">External</span>
                    </a>
                  </div>

                  <div className="border-t border-slate-800 pt-1 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Level 1 Navigation Toggle (Visible on Mobile / Tablet) */}
          {isLevel1 && (
            <button
              onClick={() => setMobileLevel1Open(!mobileLevel1Open)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl lg:hidden transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileLevel1Open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          MOBILE LEVEL 1 SLIDE-DOWN PANEL
          ======================================================== */}
      <AnimatePresence>
        {isLevel1 && mobileLevel1Open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#0B1F3A] border-b border-slate-800 px-4 py-4 space-y-1.5 shadow-xl"
          >
            <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Main Navigation
            </div>
            {LEVEL_1_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMobileLevel1Open(false);
                    navigate(item.path, { state: { sectionId: item.id } });
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-[#155EEF] text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
