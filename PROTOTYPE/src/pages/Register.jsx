import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Briefcase, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';
import * as api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '1',
    email: '',
    department: 'Data Analysis Division',
    password: ''
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadNextId() {
      try {
        const nextId = await api.getNextId();
        setFormData((prev) => ({ ...prev, employeeId: String(nextId) }));
      } catch (err) {
        console.warn('Could not fetch next ID:', err);
      }
    }
    loadNextId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.registerUser(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1600);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/90 relative z-10"
      >
        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/25">
            S
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Create StatIQ Account</h2>
            <p className="text-xs sm:text-sm text-slate-500">Official Statistical Cadre Registration</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700 font-semibold">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-8 rounded-2xl bg-emerald-50 text-center space-y-3 border border-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-emerald-950">Cadre Account Initialized</h4>
            <p className="text-xs sm:text-sm text-emerald-700">
              Your profile has been created in the Official Statistical System. Redirecting to login portal...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Full Official Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ID
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formData.employeeId}
                    className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-600 font-mono font-bold cursor-not-allowed select-none focus:outline-hidden"
                    title="ID is the unique primary key and cannot be altered"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  System primary key (Length + 1)
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Division / Wing
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option>Data Analysis Division</option>
                  <option>Survey Design (SDRD)</option>
                  <option>National Accounts (NAD)</option>
                  <option>Price Statistics</option>
                  <option>Economic Statistics</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <span className="text-[11px] text-slate-400">All domains accepted</span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. demo@statiq.ai"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Min. 4 characters</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={4}
                  placeholder="•••••••• (at least 4 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-3">
              <Button type="submit" variant="primary" size="lg" className="w-full font-bold shadow-md shadow-blue-600/20" icon={ArrowRight} loading={loading}>
                Register Cadre Profile
              </Button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-5 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-500">
          Already registered in the system?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
