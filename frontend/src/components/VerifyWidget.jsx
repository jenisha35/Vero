import React, { useState } from 'react';
import Scanner from './Scanner';
import ResultUI from './ResultUI';
import { verifyProductCode } from '../services/api';
import { ShieldCheck, ScanLine, KeyRound, Loader2, ArrowLeft, UploadCloud, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import jsQR from 'jsqr';

export default function VerifyWidget() {
  const [step, setStep] = useState(1); // 1: Scan QR, 2: Enter Serial, 3: Result
  const [batchId, setBatchId] = useState(null);
  const [serialCode, setSerialCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [geoLoc, setGeoLoc] = useState({ lat: null, lon: null });
  const [scanMethod, setScanMethod] = useState('camera'); // 'camera' or 'upload'

  // Get user location on mount
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGeoLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.log("Geolocation denied or unavailable")
      );
    }
  }, []);

  const handleScanSuccess = async (decodedText) => {
    try {
      console.log("Raw demo scanned text:", decodedText);
      if (!decodedText.startsWith("TRUSTGUARD|")) {
        throw new Error("Invalid Format");
      }
      
      const parts = decodedText.split("|");
      const batchId = parts[1];
      
      if(!batchId) throw new Error("Missing batch id");
      
      setBatchId(batchId);
      toast.success("Authentic TrustGuard QR verified!");
      setStep(2);
    } catch (e) {
      console.error("QR Validation Error:", e);
      toast.error("Unrecognized or unofficial TrustGuard QR.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code && code.data) {
          handleScanSuccess(code.data);
        } else {
          toast.error("No valid QR code found in the uploaded image.");
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!serialCode) return;
    
    setLoading(true);
    try {
      const payload = { 
         serialCode, 
         locationApprox: geoLoc.lat ? `${geoLoc.lat.toFixed(4)}, ${geoLoc.lon.toFixed(4)}` : "Unknown Location",
         latitude: geoLoc.lat,
         longitude: geoLoc.lon
      };
      const res = await verifyProductCode(batchId, payload);
      setResult(res.data);
      setStep(3);
    } catch (error) {
      toast.error('Verification request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setStep(1);
    setBatchId(null);
    setSerialCode('');
    setResult(null);
  };

  return (
      <div className="bg-[#0f172a] p-8 rounded-3xl w-full max-w-md shadow-2xl shadow-black/50 border border-slate-800 relative z-10 overflow-hidden mx-auto">
        
        {step === 1 && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-white mb-2">Scan Product QR</h2>
            <p className="text-sm text-slate-400 text-center mb-6">Locate the TrustGuard QR code on your product packaging.</p>
            
            <div className="flex w-full bg-slate-800/50 p-1 rounded-xl mb-6 border border-slate-700/50">
              <button 
                onClick={() => setScanMethod('camera')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex justify-center items-center gap-2 transition ${scanMethod === 'camera' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <Camera className="w-4 h-4" /> Camera
              </button>
              <button 
                onClick={() => setScanMethod('upload')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex justify-center items-center gap-2 transition ${scanMethod === 'upload' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <UploadCloud className="w-4 h-4" /> Upload
              </button>
            </div>

            {scanMethod === 'camera' ? (
              <div className="w-full relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-black aspect-square shadow-inner">
                 <Scanner onScanSuccess={handleScanSuccess} />
                 <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40"></div>
                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-scan"></div>
              </div>
            ) : (
              <div className="w-full aspect-square border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center p-6 bg-slate-800/20 hover:bg-slate-800/40 transition cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                <p className="text-white font-medium text-center">Click or drag image to upload</p>
                <p className="text-xs text-slate-500 mt-2 text-center">Supports PNG, JPG, JPEG</p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col animate-fadeIn">
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-slate-400 hover:text-white transition text-sm mb-6 w-fit cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to scanner
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ScanLine className="text-blue-500 w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Batch Identified</h2>
              <p className="text-xs text-slate-500 font-mono">ID: {batchId}</p>
            </div>
            
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-2 text-center">
                  Enter the unique Serial Code printed below the QR
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="e.g. TG-XXXX-XXXX" 
                    required
                    maxLength={50}
                    value={serialCode}
                    onChange={(e) => setSerialCode(e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white font-mono tracking-widest text-center"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:from-blue-500 hover:to-blue-400 focus:ring-4 focus:ring-blue-500/20 transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : 'Verify Authenticity'}
              </button>
            </form>
          </div>
        )}

        {step === 3 && result && (
           <ResultUI result={result} onReset={resetScanner} />
        )}
      </div>
  );
}
