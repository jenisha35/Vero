import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ShieldCheck, LayoutDashboard, PlusCircle, LogOut, LogIn, ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('companyName');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-[#0b1121] border-b border-slate-800 sticky top-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition flex items-center justify-center p-2 rounded-lg hover:bg-slate-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Link to="/" className="text-white font-bold text-lg flex items-center gap-2">
          <ShieldCheck className="text-blue-500 w-6 h-6" /> <span className="hidden sm:inline">TrustGuard</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 text-sm font-medium">
        <Link to="/" className="text-slate-300 hover:text-white flex items-center gap-2">
          <Home className="w-4 h-4 hidden sm:block" /> Home
        </Link>
        <Link to="/verify" className="text-slate-300 hover:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 hidden sm:block" /> Verify
        </Link>
        
        {token ? (
          <>
            <Link to="/dashboard" className="text-slate-300 hover:text-white flex items-center gap-2 hidden md:flex">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link to="/add-product" className="text-slate-300 hover:text-white flex items-center gap-2 hidden md:flex">
              <PlusCircle className="w-4 h-4" /> Add Product
            </Link>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 flex items-center gap-2 sm:ml-2 bg-red-500/10 px-3 py-1.5 rounded-lg transition">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 sm:ml-2 bg-blue-500/10 px-3 py-1.5 rounded-lg transition">
            <LogIn className="w-4 h-4" /> <span className="hidden sm:inline">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
