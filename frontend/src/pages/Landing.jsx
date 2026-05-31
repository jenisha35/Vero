import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, QrCode, TrendingUp, AlertTriangle, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import VerifyWidget from '../components/VerifyWidget';
import heroLogo from '../assets/hero.png';


export default function Landing() {
  const scrollToVerify = () => {
    document.getElementById('verify-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b1121]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Vero</span>
              {/* <img 
  src={heroLogo}
  alt="Vero Logo"
  className="h-10 w-auto object-contain"
/> */}
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-slate-300 hover:text-white transition font-medium text-sm">About</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition font-medium text-sm">How it Works</a>
              <a href="#features" className="text-slate-300 hover:text-white transition font-medium text-sm">Features</a>
              <button onClick={scrollToVerify} className="text-emerald-400 hover:text-emerald-300 transition font-medium text-sm">Scan Product</button>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition">Sign In</Link>
              <Link to="/login" className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition shadow-lg shadow-blue-500/20 hidden md:block">
                Company Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8">
            <CheckCircle2 className="w-4 h-4" /> Military-Grade Anti-Counterfeit Platform
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tight leading-tight mb-8">
            Verify Before <br /> You Trust.
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Protect your consumers and secure your supply chain. Vero uses dual-layer cryptographic QR codes and simulated fingerprint verification to eradicate counterfeit products instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={scrollToVerify} className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer">
              <QrCode className="w-5 h-5" /> Verify a Product Now
            </button>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2">
              Brand Sign Up <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-[#0f172a] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">The Global Fake Market is Expanding.</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Counterfeit goods cost the global economy over $500 billion annually. Single-layer QR codes are easily photocopied by malicious actors, leaving your brand reputation vulnerable and your consumers at risk.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-slate-300"><strong className="text-white">Consumer Safety:</strong> Give buyers 100% confidence they are receiving an authentic product straight from your factory.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-slate-300"><strong className="text-white">Brand Protection:</strong> Instantly detect and shut down copycats masquerading as your legitimate enterprise.</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full point-events-none"></div>
               <h3 className="text-xl font-bold text-white mb-4 relative z-10">Our Dual-Layer Solution</h3>
               <p className="text-slate-400 text-sm mb-6 relative z-10">We bond a public QR code with a hidden cryptographic serial key. Duplicating the QR code becomes completely useless without the unique hidden key.</p>
               <div className="flex items-center gap-4 relative z-10">
                 <div className="bg-black border border-slate-700 p-4 rounded-xl flex-1 flex flex-col items-center justify-center gap-2">
                   <QrCode className="w-8 h-8 text-blue-400" />
                   <span className="text-xs font-semibold text-slate-300">Public QR</span>
                 </div>
                 <div className="text-slate-600 font-bold">+</div>
                 <div className="bg-black border border-slate-700 p-4 rounded-xl flex-1 flex flex-col items-center justify-center gap-2">
                   <Lock className="w-8 h-8 text-emerald-400" />
                   <span className="text-xs font-semibold text-slate-300">Hidden Serial</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How Verification Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A seamless lifecycle protecting your product from the warehouse to the consumer's hands.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
            <StepCard number="1" title="Register" desc="Brand registers product batches." />
            <StepCard number="2" title="Generate" desc="System issues unique QR + Serial pairs." />
            <StepCard number="3" title="Scan" desc="Consumer scans the public QR code." />
            <StepCard number="4" title="Verify" desc="Consumer inputs hidden Serial Code." />
            <StepCard number="5" title="Authenticate" desc="Instant authenticity verdict returned." />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#0f172a] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Enterprise Grade Security</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             <FeatureCard 
               icon={<Lock className="text-emerald-500 w-6 h-6" />}
               title="Dual-Layer Auth"
               desc="Two-factor physical security mapping QR signatures to unique alphanumeric secrets."
             />
             <FeatureCard 
               icon={<AlertTriangle className="text-red-500 w-6 h-6" />}
               title="Fraud Detection"
               desc="Instant identification of duplicate usages, signaling mass cloning operations."
             />
             <FeatureCard 
               icon={<TrendingUp className="text-blue-500 w-6 h-6" />}
               title="Live Analytics"
               desc="Company dashboard displays incoming scans, authentications, and threat metrics dynamically."
             />
             <FeatureCard 
               icon={<ShieldCheck className="text-purple-500 w-6 h-6" />}
               title="Location Spoofing"
               desc="Tracks geolocation anomalies. If a code jumps cities instantly, it intercepts the threat."
             />
          </div>
        </div>
      </section>

      {/* Consumer Verification App Embedded */}
      <section id="verify-section" className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gradient-to-b from-emerald-900/10 to-blue-900/10 blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-4">Consumer Verification Terminal</h2>
            <p className="text-slate-400 max-w-xl mx-auto">No account required. Simply scan the QR code located on your product packaging to confirm its authenticity instantly.</p>
          </div>
          
          <VerifyWidget />
          
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-lg font-bold text-white tracking-tight">Vero</span>
          </div>
          <p className="text-slate-500 text-sm text-center md:text-left">© 2026 Vero Systems. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl relative">
      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm ring-4 ring-[#0b1121]">
        {number}
      </div>
      <h3 className="text-white font-bold mb-2 mt-2">{title}</h3>
      <p className="text-slate-400 text-xs">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition cursor-default group">
      <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition shrink-0 border border-slate-800">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
