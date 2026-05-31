import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, AlertCircle } from 'lucide-react';

export default function Scanner({ onScanSuccess }) {
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const scannerRef = useRef(null);
  const isScanning = useRef(false);

  useEffect(() => {
    let html5QrCode;

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          setHasPermission(true);
          html5QrCode = new Html5Qrcode("reader");
          scannerRef.current = html5QrCode;
          
          isScanning.current = true;
          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
            },
            (decodedText) => {
              if (isScanning.current) {
                isScanning.current = false; // Prevent multiple fires
                console.log("Demo QR Data parsed: ", decodedText);
                onScanSuccess(decodedText);
              }
            },
            (err) => {
              // Ignore standard frame scan errors
            }
          );
        } else {
          setError("No cameras found on your device.");
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Camera permission denied. Please allow camera access.");
      }
    };

    startScanner();

    return () => {
      isScanning.current = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
        }).catch(err => console.error("Failed to stop scanner", err));
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="w-full max-w-md mx-auto relative bg-black rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
      {error ? (
        <div className="text-center p-6 flex flex-col items-center">
           <AlertCircle className="text-red-500 w-10 h-10 mb-3" />
           <p className="text-red-400 text-sm font-medium">{error}</p>
        </div>
      ) : !hasPermission ? (
        <div className="text-center p-6 flex flex-col items-center animate-pulse">
           <Camera className="text-slate-500 w-10 h-10 mb-3" />
           <p className="text-slate-400 text-sm font-medium">Requesting camera access...</p>
        </div>
      ) : null}
      
      {/* HTML5 QR Code injects the video element here */}
      <div id="reader" className={`w-full h-full ${error ? 'hidden' : 'block'}`}></div>
      
    </div>
  );
}
