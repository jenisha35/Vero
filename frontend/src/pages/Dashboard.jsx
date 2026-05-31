import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import { Activity, ShieldCheck, AlertOctagon, RefreshCw, Package } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-400">Loading metrics...</div>;
  }

  const pieData = [
    { name: 'Authentic', value: stats?.validScans || 0, color: '#10b981' },
    { name: 'Fake', value: stats?.fakeScans || 0, color: '#ef4444' },
    { name: 'Suspicious', value: stats?.duplicateScans || 0, color: '#f59e0b' },
  ];

  const barData = [
    { name: 'Total Products', count: stats?.totalProducts || 0 },
    { name: 'Total Scans', count: stats?.totalScans || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <button onClick={fetchStats} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition cursor-pointer">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Scans" value={stats?.totalScans} icon={<Activity />} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard title="Authentic Scans" value={stats?.validScans} icon={<ShieldCheck />} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard title="Fake Detected" value={stats?.fakeScans} icon={<AlertOctagon />} color="text-red-500" bg="bg-red-500/10" />
        <StatCard title="Total Products" value={stats?.totalProducts} icon={<Package />} color="text-indigo-500" bg="bg-indigo-500/10" />
      </div>

      {/* Charts Array */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-800 shadow-md">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Verification Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-800 shadow-md">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Activity Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  cursor={{fill: '#334155', opacity: 0.2}}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }) {
  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value || 0}</h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
  );
}
