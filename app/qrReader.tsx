'use client'
import { useState } from "react";
import QrReader from "modern-react-qr-reader";

const App = () => {
  const [code, setCode] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [precScan, setPrecScan] = useState("");
  const [selected, setSelected] = useState("environment");

  const handleScan = (scanData) => {
    if (scanData && scanData) {
      // window.location.href = scanData;
      console.log(scanData); // Here is our scanned data!
    }
  };
  
  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600">
      <h1 className="text-4xl font-bold text-white mb-8 mt-20">Escaneá el código QR</h1>
      <p className="text-xl text-gray-300 mb-8">Apúntate con la cámara del código, se detectará automáticamente</p>
      
      <div className="w-full max-w-md space-y-4">
        <select 
          onChange={(e) => setSelected(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded-lg bg-white shadow-sm"
        >
          <option value={"environment"} className="text-gray-800">Cámara trasera</option>
          <option value={"user"} className="text-gray-800">Cámara delantera</option>
        </select>
      </div>
      
      {!showDialog && !processing && (
        <QrReader
          facingMode={selected}
          delay={500}
          onScan={handleScan}
          onError={handleError}
          className="qr-reader w-[80vw] mt-20"
        />
      )}
    </div>
  );
};

export default App;