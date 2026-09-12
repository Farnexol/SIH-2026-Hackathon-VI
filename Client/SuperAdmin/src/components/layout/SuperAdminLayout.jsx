import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function SuperAdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex flex-col min-h-screen w-full">
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
