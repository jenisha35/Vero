import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCompany, registerCompany } from '../services/api';
import { ShieldCheck, Mail, Lock, Building2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = isRegister ? await registerCompany(formData) : await loginCompany(formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('companyName', res.data.name);
      toast.success(isRegister ? 'Registration successful!' : 'Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Authentication failed! Check your credentials.";
      // If errorMsg is still an object, stringify it or fallback
      const finalMsg = typeof errorMsg === 'string' ? errorMsg : "Server connection failed or invalid credentials.";
      toast.error(finalMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsRegister(!isRegister);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1121] text-slate-200">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      <div className="absolute w-96 h-96 bg-blue-600/20 blur-3xl rounded-full top-1/4 -left-12"></div>
      <div className="absolute w-96 h-96 bg-emerald-600/10 blur-3xl rounded-full bottom-1/4 -right-12"></div>

      <div className="bg-[#0f172a] p-10 rounded-2xl w-full max-w-md shadow-2xl shadow-black/50 border border-slate-800 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {isRegister ? 'Join TrustGuard' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 mt-2 text-sm text-center">
            {isRegister ? 'Register your brand to start protecting your products.' : 'Enter your credentials to access the portal.'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {isRegister && (
            <div className="relative">
              <Building2 className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Company Name" 
                required
                className="w-full pl-10 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-slate-500 text-white"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                value={formData.name}
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            <input 
              type="email" 
              placeholder="Work Email" 
              required
              className="w-full pl-10 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-slate-500 text-white"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              value={formData.email}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full pl-10 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-slate-500 text-white"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              value={formData.password}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium p-3.5 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/25 disabled:opacity-70"
          >
            {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            {isRegister ? 'Already registered?' : 'Brand not registered?'}
            <button 
              type="button"
              onClick={handleToggle} 
              className="ml-2 text-blue-400 font-medium hover:text-blue-300 transition">
              {isRegister ? 'Sign in to portal' : 'Apply for access'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
