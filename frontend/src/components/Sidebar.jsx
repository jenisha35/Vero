import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, QrCode, AlertTriangle, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('companyName');
    navigate('/login');
  };

  const navItem = "flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 text-slate-400 hover:text-white hover:bg-slate-800";
  const activeItem = "flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 text-white bg-blue-600 shadow-md shadow-blue-500/20";

  return (
    <div className="w-64 h-screen bg-[#0b1121] border-r border-slate-800 flex flex-col justify-between fixed top-0 left-0 z-50">
      <div>
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">T</div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">TrustGuard</h1>
        </div>
        <nav className="px-4 space-y-2">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? activeItem : navItem}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/add-product" className={({isActive}) => isActive ? activeItem : navItem}>
            <PackagePlus size={20} /> Register Batch
          </NavLink>
          <NavLink to="/codes" className={({isActive}) => isActive ? activeItem : navItem}>
            <QrCode size={20} /> Codes
          </NavLink>
          <NavLink to="/alerts" className={({isActive}) => isActive ? activeItem : navItem}>
            <AlertTriangle size={20} /> Alerts
          </NavLink>
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-200 font-medium cursor-pointer">
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
