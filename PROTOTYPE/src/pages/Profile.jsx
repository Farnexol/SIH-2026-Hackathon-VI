import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Shield,
  Briefcase,
  Mail,
  Calendar,
  Settings,
  CheckCircle2,
  Award,
  Building,
  Check,
  Save,
  GraduationCap,
  Lock,
  AlertCircle,
  Bell,
  X
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import { PageTransition, FadeIn } from '../components/common/animations';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [designation, setDesignation] = useState(user?.designation || 'Statistical Officer (Grade II)');
  const [department, setDepartment] = useState(user?.department || 'Data Analysis Division');
  const [organization, setOrganization] = useState(user?.organization || 'National Statistical Office (NSO), MoSPI');
  const [competencyFramework, setCompetencyFramework] = useState(
    user?.competencyFramework || 'Official Statistical System Framework (OSSF-2026)'
  );
  const [learningGoals, setLearningGoals] = useState(user?.learningGoals || '');
  const [difficulty, setDifficulty] = useState(user?.preferences?.learningDifficulty || 'Intermediate');
  const [language, setLanguage] = useState(user?.preferences?.language || 'English');
  const [emailNotifications, setEmailNotifications] = useState(user?.preferences?.emailNotifications ?? true);
  const [weeklyDigest, setWeeklyDigest] = useState(user?.preferences?.weeklyDigest ?? true);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Format creation / starting date
  const formatStartingDate = (dateVal) => {
    if (!dateVal) return '10 September 2026';
    try {
      const d = new Date(dateVal);
      return isNaN(d.getTime())
        ? dateVal
        : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateVal;
    }
  };

  const startingDateDisplay = user?.startingDate || formatStartingDate(user?.createdAt);

  // Sync immediately when user from AuthContext is available
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.designation) setDesignation(user.designation);
      if (user.department) setDepartment(user.department);
      if (user.organization) setOrganization(user.organization);
      if (user.competencyFramework) setCompetencyFramework(user.competencyFramework);
      if (user.learningGoals) setLearningGoals(user.learningGoals);
      if (user.preferences?.learningDifficulty) setDifficulty(user.preferences.learningDifficulty);
      if (user.preferences?.language) setLanguage(user.preferences.language);
      if (user.preferences?.emailNotifications !== undefined) setEmailNotifications(user.preferences.emailNotifications);
      if (user.preferences?.weeklyDigest !== undefined) setWeeklyDigest(user.preferences.weeklyDigest);
    }
  }, [user]);

  // Also fetch latest live profile from database on mount
  useEffect(() => {
    async function loadFreshProfile() {
      try {
        const freshUser = await api.getProfile();
        if (freshUser) {
          setName(freshUser.name || '');
          setDesignation(freshUser.designation || 'Statistical Officer (Grade II)');
          setDepartment(freshUser.department || 'Data Analysis Division');
          setOrganization(freshUser.organization || 'National Statistical Office (NSO), MoSPI');
          setCompetencyFramework(
            freshUser.competencyFramework || 'Official Statistical System Framework (OSSF-2026)'
          );
          setLearningGoals(freshUser.learningGoals || '');
          setDifficulty(freshUser.preferences?.learningDifficulty || 'Intermediate');
          setLanguage(freshUser.preferences?.language || 'English');
          setEmailNotifications(freshUser.preferences?.emailNotifications ?? true);
          setWeeklyDigest(freshUser.preferences?.weeklyDigest ?? true);
        }
      } catch (err) {
        console.warn('Could not refresh profile from server:', err);
      }
    }
    loadFreshProfile();
  }, []);

  // Compute initials for avatar
  const getInitials = (fullName) => {
    if (!fullName) return 'SO';
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isFirstTimeSetup = user?.isProfileCompleted === false;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaved(false);

    try {
      const res = await updateUserProfile({
        name,
        designation,
        department,
        organization,
        competencyFramework,
        learningGoals,
        isProfileCompleted: true,
        preferences: {
          ...user?.preferences,
          learningDifficulty: difficulty,
          language,
          emailNotifications,
          weeklyDigest
        }
      });

      if (res.success) {
        setSaved(true);
        if (isFirstTimeSetup) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 1200);
        } else {
          setTimeout(() => setSaved(false), 5000);
        }
      } else {
        setError(res.error || 'Failed to update profile in database');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="space-y-10 max-w-10xl relative">
      {/* Floating Success Toast (Always visible regardless of scroll position) */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-24 right-4 sm:right-8 z-50 max-w-md bg-white border border-emerald-300 rounded-2xl p-4 shadow-2xl flex items-start gap-3.5 ring-4 ring-emerald-500/15 pointer-events-auto"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-sm font-black text-slate-900 leading-tight">
                Profile Saved Successfully!
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-snug">
                {isFirstTimeSetup
                  ? 'Your profile is now verified. Redirecting to Learner Dashboard...'
                  : 'Your profile information and system preferences have been saved.'}
              </p>
            </div>
            <button
              onClick={() => setSaved(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        title="Officer Profile & System Credentials"
        subtitle="Manage official statistical credentials, capacity building parameters, and curriculum preferences."
        badge={
          <span className="text-xs bg-slate-100 text-slate-800 font-mono font-bold px-3 py-1 rounded-full border border-slate-200">
            ID: {user?.employeeId || user?.id}
          </span>
        }
      />

      {/* First-time mandatory setup banner */}
      {user?.isProfileCompleted === false && (
        <FadeIn>
          <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-3xl flex items-start gap-4 text-amber-950 shadow-md">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shrink-0 mt-0.5 shadow-md shadow-amber-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-base text-amber-950">Mandatory Cadre Profile Setup Required</h4>
              <p className="text-xs sm:text-sm text-amber-800 mt-1 font-medium leading-relaxed">
                Welcome to StatIQ! As a newly registered officer, you must review and save your profile information below before accessing the Learner Dashboard and other platform modules.
              </p>
            </div>
          </div>
        </FadeIn>
      )}

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-sm text-emerald-900 font-bold shadow-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Profile and official credentials successfully updated and saved in the database!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <FadeIn>
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-sm text-rose-800 font-semibold shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        </FadeIn>
      )}

      {/* Profile Overview Card */}
      <FadeIn delay={0.1}>
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/25 ring-4 ring-blue-50 shrink-0">
            {getInitials(name || user?.name)}
          </div>
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {name || user?.name || 'Statistical Officer'}
              </h2>
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-bold">
                {user?.role || 'Learner'}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full font-mono">
                Cadre ID #{user?.employeeId || user?.id}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-600">{designation}</p>
            <p className="text-xs sm:text-sm text-slate-400">
              {department} • {organization}
            </p>
          </div>
          <div className="sm:self-center flex items-center gap-3">
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl shadow-xs"
                >
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Updated!</span>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              type="button"
              variant="primary"
              size="md"
              icon={Save}
              onClick={handleSave}
              loading={loading}
              className="shadow-md shadow-blue-600/20 font-bold"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </FadeIn>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Personal Information */}
        <FadeIn delay={0.2}>
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Official contact identity in the National Statistical Service
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Full Official Name <span className="text-blue-600 font-normal">(Editable)</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Keyur Aghara"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Official Email Address
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Login Email (Unchangeable)</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={user?.email || ''}
                    className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-slate-700 font-mono cursor-not-allowed select-none text-sm"
                    title="Official email address you logged in with (Permanently tied to account credentials and unchangeable)"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Service Cadre
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Assigned Role (Locked)</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={user?.role || 'Learner'}
                    className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-slate-700 font-medium cursor-not-allowed select-none text-sm"
                    title="Service cadre role is managed by administrative authorities"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Starting Date
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Creation Date (Locked)</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={startingDateDisplay}
                    className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-slate-700 font-medium cursor-not-allowed select-none text-sm"
                    title="Starting date represents when this account was registered in the database"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Section 2: Professional Information */}
        <FadeIn delay={0.3}>
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Professional Information</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Government department, deployment division, and assigned framework
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Current Designation <span className="text-blue-600 font-normal">(Editable)</span>
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Statistical Officer (Grade II)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    ID (Primary Key)
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">System Primary Key (Locked)</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={String(user?.id ?? user?.employeeId ?? '1')}
                    className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-slate-700 font-mono font-bold cursor-not-allowed select-none text-sm"
                    title="ID is the unique system primary key (Length + 1) and cannot be altered"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Deployment Division <span className="text-blue-600 font-normal">(Editable)</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                >
                  <option>Data Analysis Division</option>
                  <option>Survey Design (SDRD)</option>
                  <option>National Accounts (NAD)</option>
                  <option>Price Statistics</option>
                  <option>Economic Statistics</option>
                  <option>Field Operations Division (FOD)</option>
                  <option>Coordination & Publication Division</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Ministry / Organization <span className="text-blue-600 font-normal">(Editable)</span>
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. National Statistical Office (NSO), MoSPI"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Governing Competency Framework <span className="text-blue-600 font-normal">(Editable)</span>
                </label>
                <input
                  type="text"
                  value={competencyFramework}
                  onChange={(e) => setCompetencyFramework(e.target.value)}
                  placeholder="e.g. Official Statistical System Framework (OSSF-2026)"
                  className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-4 py-3 text-blue-900 font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Section 3: Learning Preferences & Goals */}
        <FadeIn delay={0.4}>
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Learning Preferences & Capacity Goals</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Configure AI study pacing, content difficulty, and target competencies
                </p>
              </div>
            </div>

            <div className="space-y-6 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Personal Capacity Goals <span className="text-blue-600 font-normal">(Editable)</span>
                </label>
                <textarea
                  rows={3}
                  value={learningGoals}
                  onChange={(e) => setLearningGoals(e.target.value)}
                  placeholder="e.g. Master survey microdata processing using Python Pandas to support upcoming NSS rounds..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Default Content Difficulty <span className="text-blue-600 font-normal">(Editable)</span>
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white font-medium"
                  >
                    <option value="Beginner">Beginner (Foundational Review)</option>
                    <option value="Intermediate">Intermediate (Recommended for Grade II)</option>
                    <option value="Advanced">Advanced (Specialized Methodologies)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Curriculum Language & Glossaries <span className="text-blue-600 font-normal">(Editable)</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white font-medium"
                  >
                    <option value="English">English</option>
                    <option value="English (with Hindi glossaries)">English (with Hindi technical glossaries)</option>
                    <option value="Hindi">Hindi (राजभाषा)</option>
                  </select>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Email Notifications</p>
                    <p className="text-[11px] text-slate-500">Receive reminders for scheduled course modules</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Weekly Progress Digest</p>
                    <p className="text-[11px] text-slate-500">Summary of competency gains and quiz attempts</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap justify-end gap-4 items-center">
              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Profile data updated successfully in database!</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={Save}
                loading={loading}
                className="font-bold shadow-md shadow-blue-600/20"
              >
                Save Profile & Preferences
              </Button>
            </div>
          </div>
        </FadeIn>
      </form>
    </PageTransition>
  );
}
