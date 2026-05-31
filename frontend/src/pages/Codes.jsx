import React, { useState } from 'react';
import { getCodesByBatch } from '../services/api';
import toast from 'react-hot-toast';
import { Search, Loader2, Copy, FileDown } from 'lucide-react';

export default function Codes() {
  const [batchId, setBatchId] = useState('');
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchCodes = async (e) => {
    e.preventDefault();
    if (!batchId) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await getCodesByBatch(batchId);
      setCodes(res.data);
      if(res.data.length === 0) toast.error("No codes found for this Batch ID");
    } catch(err) {
      toast.error("Failed to retrieve codes. Make sure the batch exists.");
      setCodes([]);
    } finally {
      setLoading(false);
    }
  };

  const copyCodes = () => {
    const text = codes.map(c => c.serialCode).join('\n');
    navigator.clipboard.writeText(text);
    toast.success("Codes copied to clipboard!");
  }

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + codes.map(c => c.serialCode).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `batch_${batchId}_codes.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Downloaded!");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Code Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1">Retrieve and export serial codes by internal Batch ID.</p>
        </div>
        
        <form onSubmit={fetchCodes} className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Batch ID or Number (e.g. BATCH-001)"
              value={batchId}
              onChange={e => setBatchId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#1e293b] border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch'}
          </button>
        </form>
      </div>

      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-md p-6 min-h-[400px]">
        {hasSearched && !loading && codes.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-slate-400">
              Found <span className="text-white font-bold">{codes.length}</span> unique codes for Batch ID <span className="text-white">{batchId}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={copyCodes} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-300 text-sm font-medium transition cursor-pointer">
                <Copy className="w-4 h-4" /> Copy All
              </button>
              <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 rounded-md text-sm font-medium transition cursor-pointer">
                <FileDown className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>
        )}

        {loading ? (
           <div className="flex justify-center items-center h-64 text-slate-500">
             <Loader2 className="w-8 h-8 animate-spin" />
           </div>
        ) : codes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {codes.map((c, i) => (
               <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center justify-between group hover:border-slate-600 transition">
                  <span className="font-mono text-emerald-400 text-sm">{c.serialCode}</span>
               </div>
            ))}
          </div>
        ) : hasSearched ? (
           <div className="flex justify-center items-center h-64 text-slate-500 text-sm">
             No codes to display. Please verify the Batch ID.
           </div>
        ) : (
           <div className="flex justify-center items-center h-64 text-slate-600 text-sm">
             Enter a Batch ID and click fetch to view codes.
           </div>
        )}
      </div>
    </div>
  );
}
