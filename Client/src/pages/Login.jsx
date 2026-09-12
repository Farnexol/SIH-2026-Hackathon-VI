import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, BarChart3, BookOpen, CheckCircle2, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('learner');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login(email, password, role);
    if (res.success) {
      // Trigger dramatic panel exit animation before navigating
      setIsExiting(true);
      setTimeout(() => {
        if (res.user && res.user.isProfileCompleted === false) {
          navigate(`/${role}/profile`);
        } else {
          navigate(`/${role}/dashboard`);
        }
      }, 700);
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleQuickLogin = async (selectedRole) => {
    setError('');
    const res = await login('demo@samarth.ai', 'demo123', selectedRole);
    if (res.success) {
      setIsExiting(true);
      setTimeout(() => {
        navigate(`/${selectedRole}/dashboard`);
      }, 600);
    } else {
      setError(res.error || 'Quick login failed');
    }
  };

  const handleBypass = async () => {
    handleQuickLogin(role);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden relative">
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
        {/* LEFT PANEL: Entrance from left, Exit to left */}
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={isExiting ? { x: '-100%', opacity: 0 } : { x: '0%', opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-1/2 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 p-8 sm:p-14 lg:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 relative z-10"
        >
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-white tracking-tight">Samarth</span>
                </div>
              </div>
            </div>

            {/* Headline and Value Prop */}
            <div className="mt-14 lg:mt-24 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 bg-blue-500/15 px-3.5 py-1.5 rounded-full border border-blue-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Empowering India&apos;s Official Statistical Workforce</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Intelligent Competency Building for National Statistics.
              </h2>

              

              {/* Core Concept Sequence Box */}
              <div className="mt-10 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 space-y-2.5 shadow-lg">
                <p className="font-bold text-blue-300 uppercase tracking-wider text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  The Autonomous Feedback Loop
                </p>
                <p className="text-sm leading-relaxed text-slate-300 font-medium">
                  Assessment &rarr; Gap Detection &rarr; Targeted Recommendation &rarr; Learning &rarr; AI MCQ Generation &rarr; Competency Improvement
                </p>
              </div>
            </div>
          </div>

          {/* Left footer feature list */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>OSSF Framework Aligned</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>iGOT Karmayogi Mapping</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>AI MCQ Generation</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Real-Time Competency Update</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT PANEL: Entrance from right, Exit to right */}
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={isExiting ? { x: '100%', opacity: 0 } : { x: '0%', opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-1/2 bg-slate-900/70 p-6 sm:p-14 lg:p-20 flex items-center justify-center relative z-10"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to Portal</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Official Learner Dashboard for Statistical Officers &amp; Analysts
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  Sign in as Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none"
                  >
                    <option value="learner">Learner (Officer/Employee)</option>
                    <option value="trainer">Trainer (Subject Matter Expert)</option>
                    <option value="admin">Admin (Organization Head)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  Email / Official Employee ID
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. demo@samarth.ai"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="demo123"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full py-3.5 text-base font-bold shadow-md shadow-blue-600/20"
                  loading={loading || isExiting}
                  icon={ArrowRight}
                >
                  {isExiting ? 'Signing In...' : 'Sign In to Portal'}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-5 border-t border-slate-100 text-center text-sm text-slate-500">
              <div className="flex flex-col gap-3">
                <div>
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                    Create Account
                  </Link>
                </div>
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Quick Demo Access (1-Click Switch)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('learner')}
                      className="text-xs font-semibold py-2 px-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition-all border border-blue-200 cursor-pointer shadow-xs text-center"
                    >
                      Learner
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('trainer')}
                      className="text-xs font-semibold py-2 px-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-200 cursor-pointer shadow-xs text-center"
                    >
                      Trainer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('admin')}
                      className="text-xs font-semibold py-2 px-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl transition-all border border-purple-200 cursor-pointer shadow-xs text-center"
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="py-4 px-6 text-center text-xs text-slate-400 bg-slate-950 border-t border-slate-900 relative z-20">
        <p>
          Samarth is a capacity building platform for India's Official Statistical System.
        </p>
      </footer>
    </div>
  );
}
