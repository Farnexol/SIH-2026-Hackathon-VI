import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <header className="h-16 bg-white border-b border-zinc-200 sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs tracking-wider">
          MS
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-zinc-900">
              MoSPI Skill Intelligence
            </span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              {user?.role || 'Learner'}
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-normal">
            National Statistical Capacity Platform
          </p>
        </div>
      </div>

      {/* User Info & Sign Out */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 font-medium text-xs">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4 text-zinc-500" />}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-zinc-900">
              {user?.full_name || 'Officer'}
            </div>
            <div className="text-[11px] text-zinc-500 truncate max-w-[180px]">
              {user?.designation || user?.email || user?.role}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-red-600 hover:bg-red-50 border border-zinc-200 hover:border-red-200 active:scale-95 transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
