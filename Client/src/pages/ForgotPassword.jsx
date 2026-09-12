import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import * as api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.forgotPassword({ email });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
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
        className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/90 relative z-10"
      >
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Enter your official statistical system email to receive a secure recovery code.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-blue-50/80 text-center space-y-4 border border-blue-200">
            <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />
            <h4 className="text-base font-bold text-blue-950">Recovery Link Dispatched</h4>
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              A secure authentication reset link has been dispatched to <strong>{email}</strong>. (Simulated)
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button variant="primary" size="md" className="w-full font-bold">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="officer@mospi.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full font-bold shadow-md shadow-blue-600/20" icon={ArrowRight}>
              Send Reset Instructions
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
