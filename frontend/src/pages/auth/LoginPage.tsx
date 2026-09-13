import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('learner1@mospi.gov.in');
  const [password, setPassword] = useState('Password@123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const loggedUser = await login(email, password);
      const roleStr = (loggedUser.role || '').toLowerCase();
      if (roleStr.includes('trainer')) navigate('/trainer');
      else if (roleStr.includes('admin')) navigate('/admin');
      else navigate('/learner');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || 'Invalid credentials or failed to connect to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('Password@123');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-center items-center p-4 font-sans selection:bg-zinc-900 selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 mx-auto rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm tracking-wider">
            MS
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            MoSPI Skill Intelligence Platform
          </h1>
          <p className="text-xs text-zinc-500">
            Ministry of Statistics & Programme Implementation
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-700 block mb-1">Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@mospi.gov.in"
                  className="w-full bg-white border border-zinc-200 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white border border-zinc-200 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Select Seeded Accounts */}
          <div className="pt-4 border-t border-zinc-100">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-2.5 text-center">
              Quick Select Seeded Account (Password: Password@123)
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('learner1@mospi.gov.in')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  email === 'learner1@mospi.gov.in'
                    ? 'border-zinc-900 bg-zinc-50 font-medium text-zinc-900'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                }`}
              >
                <div className="font-semibold text-zinc-900">Learner (JSO)</div>
                <div className="text-[10px] text-zinc-500">learner1@mospi.gov.in</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('trainer1@nssta.gov.in')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  email === 'trainer1@nssta.gov.in'
                    ? 'border-zinc-900 bg-zinc-50 font-medium text-zinc-900'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                }`}
              >
                <div className="font-semibold text-zinc-900">Trainer (NSSTA)</div>
                <div className="text-[10px] text-zinc-500">trainer1@nssta.gov.in</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin1@mospi.gov.in')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  email === 'admin1@mospi.gov.in'
                    ? 'border-zinc-900 bg-zinc-50 font-medium text-zinc-900'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                }`}
              >
                <div className="font-semibold text-zinc-900">Admin (NAD)</div>
                <div className="text-[10px] text-zinc-500">admin1@mospi.gov.in</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('superadmin1@mospi.gov.in')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  email === 'superadmin1@mospi.gov.in'
                    ? 'border-zinc-900 bg-zinc-50 font-medium text-zinc-900'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                }`}
              >
                <div className="font-semibold text-zinc-900">Super Admin</div>
                <div className="text-[10px] text-zinc-500">superadmin1@mospi.gov.in</div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-zinc-400">
          Official Statistics Skill Engine • India 2026
        </div>
      </motion.div>
    </div>
  );
};
