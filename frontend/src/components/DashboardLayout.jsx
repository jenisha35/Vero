import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const companyName = localStorage.getItem('companyName') || 'Company';

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0b1121]/80 backdrop-blur sticky top-0 z-40 w-full">
          <p className="text-sm font-medium text-slate-400">Brand Verification Portal</p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300">{companyName}</span>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              {companyName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
