import React from 'react';
import VerifyWidget from '../components/VerifyWidget';
import { ShieldCheck } from 'lucide-react';

export default function Verify() {
  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-200 flex flex-col items-center py-12 px-4 selection:bg-emerald-500/30">
      {/* Background decorations */}
      <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

      <div className="text-center z-10 mb-8 mt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 shadow-lg shadow-blue-500/20 mb-4">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">TrustGuard Verify</h1>
        <p className="text-slate-400 mt-2">Consumer Anti-Counterfeit Portal</p>
      </div>

      <VerifyWidget />
      
      {/* Disclaimer */}
      <p className="mt-12 text-center text-xs text-slate-500 max-w-sm z-10 relative">
        TrustGuard uses advanced cryptography and simulated fingerprint matching to determine product authenticity. Ensure adequate lighting when scanning.
      </p>
    </div>
  );
}
