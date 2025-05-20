import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";

const QrScanner = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null); // Store parsed JSON or null
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  const handleScan = (data) => {
    if (data) {
      setErrorMsg("");
      setShowScanner(false);
      sendToBackend({ qrData: data });
    }
  };

  const handleError = (err) => {
    console.error("Scanner Error:", err);
    setErrorMsg("Scanner error occurred.");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setErrorMsg("");
    const formData = new FormData();
    formData.append("image", file);

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
      setScanResult(result);
    } catch (error) {
      console.error("API Error:", error);
      setErrorMsg("Error: Failed to connect to server.");
      setScanResult(null);
    }
  };

  // Helper to render attributes nicely
  const renderAttributes = (attributes) => {
    if (!attributes) return null;
    return (
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Attribute</th>
            <th className="border-b p-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(attributes).map(([key, val]) => (
            <tr key={key} className="odd:bg-gray-50">
              <td className="border-b p-2 font-medium">{key.replace(/_/g, " ")}</td>
              <td className="border-b p-2">{val.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">QR Code Scanner</h2>

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
                  constraints={{ facingMode: "environment" }}
                  onResult={(result, error) => {
                    if (result?.text) {
                      handleScan(result.text);
                    } else if (error) {
                      handleError(error);
                    }
                  }}
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
              className="mb-4 w-full"
            />
            <p className="text-sm text-gray-600 mb-6">Upload a QR code image</p>
          </>
        )}

        {errorMsg && (
          <div className="text-red-600 font-semibold mb-4">{errorMsg}</div>
        )}

        {scanResult && (
          <div className="mt-4 text-left">
            <h3 className="text-lg font-semibold mb-2 text-green-700">API Response:</h3>

            {/* Extracted Text */}
            <div className="mb-4">
              <h4 className="font-medium mb-1">Extracted Text:</h4>
              <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded border text-sm text-gray-700 max-h-48 overflow-y-auto">
                {scanResult.extracted_text || "No text extracted."}
              </pre>
            </div>

            {/* Attributes */}
            <div className="mb-4">
              <h4 className="font-medium mb-1">Attributes:</h4>
              {renderAttributes(scanResult.attributes)}
            </div>

            {/* Prediction */}
            <div className="mb-2">
              <h4 className="font-medium mb-1">Prediction:</h4>
              <p
                className={`inline-block px-3 py-1 rounded text-white font-semibold ${
                  scanResult.prediction.toLowerCase().includes("not recyclable")
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              >
                {scanResult.prediction}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrScanner;
