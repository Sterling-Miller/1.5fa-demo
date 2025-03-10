'use client'
import { useState } from "react";
import QrScanner from "modern-react-qr-reader"; 
// Sourse Inspo: https://codesandbox.io/p/sandbox/qrscanner-854b39?file=%2Fsrc%2FApp.js%3A3%2C1-4%2C1

const QRScanner = () => {
  const [code, setCode] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [precScan, setPrecScan] = useState("");
  const [selected, setSelected] = useState<'environment' | 'user'>("environment");

  const handleScan = (scanData: string | null) => { // maybe not string
    if (scanData) {
      // window.location.href = scanData;
      console.log(scanData); // Here is our scanned data!
    }
  };
  
  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-slate-500">
      <h1 className="text-4xl font-bold text-white mb-8 mt-20">Scan the QR Code</h1>
      
      <div className="w-full max-w-md space-y-4">
        <select 
          onChange={(e) => setSelected(e.target.value as 'environment' | 'user')}
          className="w-full p-2 border border-slate-700 rounded-lg bg-white shadow-sm"
          defaultValue={"environment"}
        >
          {/* <option value="" disabled selected className="text-gray-800">Select a camera</option> */}
          <option value={"environment"} className="text-gray-800">Rear Camera</option>
          <option value={"user"} className="text-gray-800">Front Camera</option>
        </select>
      </div>
      
      {!showDialog && !processing && (
        <QrScanner
          facingMode={selected}
          delay={500}
          onScan={handleScan}
          onError={handleError}
          style={{ width: '40vw', marginTop: '20px', backgroundColor: 'slate-300' }}
        />
      )}
    </div>
  );
};

export default QRScanner;