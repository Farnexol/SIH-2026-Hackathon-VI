import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { KeyRound, ShieldAlert } from 'lucide-react';
import Button from '../components/common/Button';
import { PageTransition, FadeIn } from '../components/common/animations';

export default function Login() {
  const [bypassKey, setBypassKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      const success = login(bypassKey);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid SuperAdmin Bypass Key');
        setIsLoading(false);
      }
    }, 600); // Fake delay for premium feel
  };

  return (
    <div className="min-h-screen bg-[#0B1322] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-y-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0B1322] to-[#0B1322]"></div>
      </div>

      <PageTransition className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <FadeIn delay={0.1}>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-3xl shadow-lg border border-blue-500 shadow-blue-500/20">
              S
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
            Samarth SuperAdmin
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            System Level Administrative Access
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-8">
          <div className="bg-[#0F172A] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-800">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="bypassKey" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Bypass Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="bypassKey"
                    name="bypassKey"
                    type="password"
                    required
                    value={bypassKey}
                    onChange={(e) => setBypassKey(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-[#0B1322] text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono transition-colors"
                    placeholder="Enter bypass key..."
                  />
                </div>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex items-start">
                  <ShieldAlert className="w-5 h-5 text-rose-500 mt-0.5 mr-2 shrink-0" />
                  <p className="text-sm text-rose-400 font-medium">{error}</p>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3"
                  disabled={isLoading || !bypassKey}
                >
                  {isLoading ? 'Authenticating...' : 'Secure Login'}
                </Button>
              </div>
            </form>
          </div>
        </FadeIn>
      </PageTransition>
    </div>
  );
}
