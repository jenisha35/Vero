import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QrGenerator({ data, filename }) {
  const qrRef = useRef();

  const handleDownload = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      
      // Add white background padding
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      
      const a = document.createElement('a');
      a.download = filename || 'trustguard-qr.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!data) return null;

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
      <div ref={qrRef} className="p-4 bg-white border border-slate-200 rounded-lg shadow-inner">
        <QRCodeSVG 
          value={data} 
          size={250}
          level="H" 
          includeMargin={true}
        />
      </div>
      <p className="text-sm text-slate-500 max-w-xs break-all text-center">Data: {data}</p>
      <button 
        onClick={handleDownload}
        className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition cursor-pointer font-medium"
      >
        Download Demo QR
      </button>
    </div>
  );
}
