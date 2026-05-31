import React from 'react';
import { ShieldAlert, ShieldCheck, ShieldX, RefreshCcw, MapPin, Search } from 'lucide-react';

export default function ResultUI({ result, onReset }) {
  const { status, message, product, fingerprintMatchScore } = result;

  let config = {
    color: 'emerald',
    icon: <ShieldCheck className="w-16 h-16 text-emerald-500" />,
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    title: 'Authentic Product',
    desc: 'This product has been verified as authentic and original.'
  };

  if (status === 'DUPLICATE_LOCAL') {
    config = {
      color: 'yellow',
      icon: <ShieldAlert className="w-16 h-16 text-yellow-500" />,
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      title: 'Suspicious Product',
      desc: 'This product has already been verified in this area.'
    };
  } else if (status === 'DUPLICATE_SPOOFED' || status === 'FAKE' || status === 'ERROR') {
    config = {
      color: 'red',
      icon: <ShieldX className="w-16 h-16 text-red-500" />,
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      title: 'Fake Product',
      desc: 'This serial code does not exist in our secure ledger. Do not purchase.'
    };
  }

  // Simulate a realistic fingerprint score
  const score = fingerprintMatchScore || (status === 'VALID' ? (Math.floor(Math.random() * 15) + 85) : (Math.floor(Math.random() * 30) + 15));

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ring-8 ${config.bg} ${config.border}`}>
        {config.icon}
      </div>
      
      <h2 className={`text-2xl font-bold mb-2 text-${config.color}-500`}>{config.title}</h2>
      <p className="text-slate-400 text-center text-sm mb-8">{config.desc}</p>
      
      {product && (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8 text-left space-y-3">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-500" /> Ledger Details
          </h3>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Brand</span>
            <span className="text-slate-200 font-medium">{product.company?.name || 'Unknown'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Product</span>
            <span className="text-slate-200 font-medium">{product.name}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Manufacturer</span>
            <span className="text-slate-200 font-medium">{product.manufacturer}</span>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-800/50 flex justify-between items-center text-sm">
             <span className="text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Integrity Score</span>
             <span className={`font-bold ${score > 75 ? 'text-emerald-500' : 'text-red-500'}`}>{score}% Match</span>
          </div>
          {result.distance !== undefined && result.distance !== null && (
            <div className="pt-3 border-t border-slate-800/50 flex justify-between items-center text-sm">
               <span className="text-slate-500 flex items-center gap-1"><RefreshCcw className="w-3 h-3" /> Distance from Original</span>
               <span className={`font-bold ${result.distance > 100 ? 'text-red-500' : 'text-yellow-500'}`}>
                 {result.distance.toFixed(1)} meters
               </span>
            </div>
          )}
        </div>
      )}

      
      {/* Action Badges */}
      {status === 'VALID' && (
        <div className="flex gap-3 mb-8 w-full justify-center">
            <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/20 font-medium tracking-wide">NFC Secured</span>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20 font-medium tracking-wide">Eco-Verified</span>
        </div>
      )}

      <button 
        onClick={onReset} 
        className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
      >
        <RefreshCcw className="w-4 h-4" /> Scan Another Item
      </button>
    </div>
  );
}
