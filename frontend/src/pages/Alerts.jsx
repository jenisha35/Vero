import React, { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';
import { AlertCircle, Clock, MapPin, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await getAlerts();
      setAlerts(res.data);
    } catch (err) {
      toast.error('Failed to load fraud alerts');
    } finally {
      setLoading(false);
    }
  };

  const getAlertStyle = (type) => {
    switch (type) {
      case 'FAKE':
      case 'DUPLICATE_USAGE': 
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case 'HIGH_RISK_LOCATION': 
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: 
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" /> Fraud Intelligence
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time alerts of suspicious scans and detected counterfeit items.</p>
        </div>
      </div>

      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
               <AlertCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No Threats Detected</h3>
            <p className="text-sm text-slate-400">Your products are currently safe from counterfeit attempts.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Time Detected</th>
                  <th className="p-4 font-medium">Risk Level</th>
                  <th className="p-4 font-medium">Product Context</th>
                  <th className="p-4 font-medium">Serial Code</th>
                  <th className="p-4 font-medium">Location Proxy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {alerts.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4 text-slate-500" />
                         {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1.5 rounded-md text-xs font-bold border ${a.riskLevel === 'HIGH' ? 'bg-red-500/10 text-red-500 border-red-500/20' : a.riskLevel === 'MEDIUM' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                        {a.riskLevel} RISK
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">{a.type?.replace('_', ' ')}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-200">
                      {a.productName}
                    </td>
                    <td className="p-4 text-sm">
                      <span className="font-mono bg-slate-900 border border-slate-700 px-2 py-1 rounded text-emerald-400 text-xs">
                        {a.serialCode}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                       <div className="flex items-center gap-1.5">
                         <MapPin className={`w-4 h-4 ${a.type === 'HIGH_RISK_LOCATION' ? 'text-red-400' : 'text-slate-500'}`} />
                         <span className={a.type === 'HIGH_RISK_LOCATION' ? 'text-red-400 font-medium' : ''}>{a.location}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
