import React, { useState, useEffect } from "react";
import {QrReader} from "react-qr-reader";

const QrScanner = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      setShowScanner(false); 
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
  
      setScanResult("QR code file uploaded: " + file.name);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">QR Code Scanner</h2>

        {isMobile ? (
         
          <>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Scan QR
            </button>

            {showScanner && (
              <div className="mt-4">
                <QrReader
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: "100%" }}
                />
                <p className="mt-2 text-sm text-gray-600">Point your camera at a QR code</p>
              </div>
            )}
          </>
        ) : (
        
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />
            <p className="text-sm text-gray-600">Upload a QR code image</p>
          </>
        )}

        {scanResult && (
          <div className="mt-4">
            <p className="font-medium text-green-600">Scanned Result:</p>
            <p className="text-gray-800 break-words">{scanResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrScanner;
