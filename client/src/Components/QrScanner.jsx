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
      setScanResult("Scanned: " + data);
      setShowScanner(false);
      sendToBackend({ qrData: data });
    }
  };

   const handleError = (err) => {
    console.error("Scanner Error:", err);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setScanResult("Uploaded: " + file.name);
    const formData = new FormData();
    formData.append("file", file);

    sendToBackend(formData, true);
  };
  const sendToBackend = async (payload, isFile = false) => {
    try {
      const response = await fetch("http://localhost:8000/api/analyze-image", {
        method: "POST",
        body: isFile ? payload : new URLSearchParams(payload),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const result = await response.json();
      setScanResult("API Response: " + JSON.stringify(result));
    } catch (error) {
      console.error("API Error:", error);
      setScanResult("Error: Failed to connect to server.");
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
