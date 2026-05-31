import React, { useState, useEffect } from 'react';
import { getCompanyProducts, addCompanyProduct, createProductBatch } from '../services/api';
import toast from 'react-hot-toast';
import { Package, Hash, Building, FileText, CheckCircle2, QrCode, UploadCloud, Settings2 } from 'lucide-react';
import QrGenerator from '../components/QrGenerator';
import * as XLSX from 'xlsx';

export default function AddProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Forms
  const [productForm, setProductForm] = useState({ name: '', description: '', manufacturerDetails: '' });
  const [batchForm, setBatchForm] = useState({ productId: '', batchNumber: '', quantity: '' });
  
  // Toggles
  const [codeGenerationMode, setCodeGenerationMode] = useState('auto'); // 'auto' or 'manual'
  const [qrGenerationMode, setQrGenerationMode] = useState('system'); // 'system' or 'company'
  const [uploadedCodes, setUploadedCodes] = useState([]);
  
  // Results
  const [batchResult, setBatchResult] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getCompanyProducts();
      setProducts(res.data);
      if (res.data.length > 0) {
        setBatchForm(prev => ({...prev, productId: res.data[0].id}));
      }
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCompanyProduct(productForm);
      toast.success('Product definition created!');
      setProductForm({ name: '', description: '', manufacturerDetails: '' });
      await fetchProducts();
    } catch (error) {
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        let codes = [];
        data.forEach(row => {
          if (row && row.length > 0 && row[0]) {
            let codeStr = String(row[0]).trim().replace(/\s+/g, '');
            if (codeStr && codeStr.toLowerCase() !== 'code') {
              codes.push(codeStr);
            }
          }
        });
        
        const uniqueCodes = [...new Set(codes)];
        if (uniqueCodes.length !== codes.length) {
           toast.error("Duplicate codes found and removed automatically.");
        }
        setUploadedCodes(uniqueCodes);
        setBatchForm(prev => ({...prev, quantity: uniqueCodes.length}));
        toast.success(`Successfully extracted ${uniqueCodes.length} custom codes!`);
      } catch (err) {
        toast.error('Invalid Excel/CSV file structure.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (codeGenerationMode === 'manual') {
      if (uploadedCodes.length === 0) {
         toast.error('Please upload an Excel file with codes.');
         return;
      }
      if (uploadedCodes.length !== Number(batchForm.quantity)) {
         toast.error(`Quantity mismatch. Uploaded ${uploadedCodes.length} but quantity is ${batchForm.quantity}`);
         return;
      }
    }

    setLoading(true);
    try {
      const payload = {
         ...batchForm,
         customCodes: codeGenerationMode === 'manual' ? uploadedCodes : null
      };
      const res = await createProductBatch(payload);
      toast.success('Batch generated successfully!');
      setBatchResult(res.data);
      setStep(2); 
    } catch (error) {
      toast.error('Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Register Product Batch</h1>
          <p className="text-slate-400 text-sm mt-1">Define products and generate secure verification codes.</p>
        </div>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden h-fit">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Package className="text-blue-500 w-5 h-5" /> 1. Define New Product
            </h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                <input 
                  type="text" required
                  value={productForm.name}
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition"
                  placeholder="e.g. Ultra Widget 3000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Manufacturer</label>
                <input 
                  type="text" required
                  value={productForm.manufacturerDetails}
                  onChange={e => setProductForm({...productForm, manufacturerDetails: e.target.value})}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea 
                  required
                  value={productForm.description}
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white h-24 transition"
                ></textarea>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 font-medium p-2.5 rounded-xl transition cursor-pointer">
                Save Definition
              </button>
            </form>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-emerald-500 to-transparent"></div>
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Hash className="text-emerald-500 w-5 h-5" /> 2. Generate Batch
            </h2>
            <form onSubmit={handleCreateBatch} className="space-y-4">
              
              {/* Product and Batch Identifiers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Select Product</label>
                  <select 
                    required
                    value={batchForm.productId}
                    onChange={e => setBatchForm({...batchForm, productId: e.target.value})}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white transition"
                  >
                    <option value="">-- Choose Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Batch Identifier</label>
                  <input 
                    type="text" required
                    value={batchForm.batchNumber}
                    onChange={e => setBatchForm({...batchForm, batchNumber: e.target.value})}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white transition"
                    placeholder="e.g. BATCH-2026-A"
                  />
                </div>
              </div>

              {/* QR Generation Selector */}
              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">QR Generation Method</label>
                <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800">
                  <button type="button" onClick={() => setQrGenerationMode('system')} className={`flex-1 py-2 text-sm rounded-lg transition ${qrGenerationMode === 'system' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>
                    System Generated
                  </button>
                  <button type="button" onClick={() => setQrGenerationMode('company')} className={`flex-1 py-2 text-sm rounded-lg transition ${qrGenerationMode === 'company' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>
                    Company Upload
                  </button>
                </div>
              </div>

              {/* Code Generation Selector */}
              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Code Allocation Strategy</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div 
                    onClick={() => setCodeGenerationMode('auto')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${codeGenerationMode === 'auto' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}
                  >
                    <Settings2 className={`w-6 h-6 mb-2 ${codeGenerationMode === 'auto' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <h3 className="text-sm font-bold text-white">System Generated</h3>
                    <p className="text-xs text-slate-400 mt-1">TrustGuard will securely mint unique cryptographic codes.</p>
                  </div>
                  <div 
                    onClick={() => setCodeGenerationMode('manual')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${codeGenerationMode === 'manual' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}
                  >
                    <FileText className={`w-6 h-6 mb-2 ${codeGenerationMode === 'manual' ? 'text-blue-400' : 'text-slate-500'}`} />
                    <h3 className="text-sm font-bold text-white">Upload Codes</h3>
                    <p className="text-xs text-slate-400 mt-1">Import your own predefined serials via Excel/CSV.</p>
                  </div>
                </div>
                
                {codeGenerationMode === 'manual' && (
                  <div className="p-4 border border-dashed border-blue-500/50 bg-blue-500/5 rounded-xl mb-4 relative cursor-pointer hover:bg-blue-500/10 transition">
                    <input type="file" accept=".xlsx, .csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="flex items-center gap-3 justify-center text-blue-400">
                      <UploadCloud className="w-5 h-5" />
                      <span className="text-sm font-medium">{uploadedCodes.length > 0 ? `${uploadedCodes.length} codes ready` : 'Click to upload Excel/CSV'}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Total Quantity (Units)</label>
                <input 
                  type="number" required min="1" max="10000"
                  readOnly={codeGenerationMode === 'manual'}
                  value={batchForm.quantity}
                  onChange={e => setBatchForm({...batchForm, quantity: e.target.value})}
                  className={`w-full p-2.5 border border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white transition ${codeGenerationMode === 'manual' ? 'bg-slate-800 text-slate-500' : 'bg-slate-900'}`}
                />
              </div>

              <button disabled={loading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium p-3 rounded-xl transition shadow-lg shadow-emerald-500/20 mt-6 cursor-pointer disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? 'Processing...' : (codeGenerationMode === 'manual' ? 'Import Custom Batch' : 'Issue Authentic Codes')}
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 2 && batchResult && (
        <div className="bg-[#1e293b] p-8 md:p-12 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-emerald-500/10">
            <CheckCircle2 className="text-emerald-500 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Batch Secured!</h2>
          <p className="text-slate-400 text-center max-w-lg mb-8">
            Batch Number <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-400/10 rounded-md">{batchResult.batch?.batchNumber}</span> has been successfully mapped. 
            Print the QR code on the packaging, and assign the following serial codes to individual products.
          </p>
          
          <div className="bg-white p-4 rounded-2xl shadow-xl shadow-black/20 mb-8 border-4 border-slate-100 flex flex-col items-center">
             <QrGenerator data={batchResult.batch?.qrCodeData || ""} filename={`trustguard_qr_${batchResult.batch?.batchNumber}.png`} />
             <p className="text-center text-xs text-slate-500 font-medium mt-2 max-w-[200px] break-all">{batchResult.batch?.batchNumber}</p>
          </div>

          <div className="w-full max-w-2xl mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-lg font-semibold text-white">Attached Serial Codes</h3>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                {batchResult.codes?.length} Units Total
              </span>
            </div>
            <div className="bg-[#0b1121] border border-slate-800 rounded-xl h-64 overflow-y-auto p-3 custom-scrollbar">
              <ul className="space-y-2">
                {batchResult.codes?.map((code, idx) => (
                  <li key={idx} className="font-mono text-sm text-blue-400 bg-slate-900 border border-slate-800 p-3 rounded-lg flex justify-between items-center hover:bg-slate-800 transition">
                    <span className="text-slate-500 text-xs">Unit {String(idx + 1).padStart(3, '0')}</span>
                    <span className="tracking-wider">{code.serialCode}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button onClick={() => { setStep(1); setUploadedCodes([]); }} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition font-medium cursor-pointer">
            Register Another Batch
          </button>
        </div>
      )}
    </div>
  );
}
