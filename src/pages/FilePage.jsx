import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function FilePage() {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // لو فيه target في query params، نجيب الملف
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetUrl = params.get("target");
    if (targetUrl) {
      // نجلب الملف من URL كـ blob
      fetch(targetUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const filename = targetUrl.split("/").pop();
          const fetchedFile = new File([blob], filename);
          setFile(fetchedFile);
        })
        .catch((err) => console.error("Failed to fetch target file:", err));
    }
  }, [location.search]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setApiError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
    setApiError("");
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setApiError("");

    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");

    try {
      const standardReq = fetch(
        "http://127.0.0.1:8000/api/v1/standard/scan-file",
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData }
      );

      const advancedReq = fetch(
        "http://127.0.0.1:8000/api/v1/advanced/scan-file",
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData }
      );

      const [standardRes, advancedRes] = await Promise.all([standardReq, advancedReq]);
      const standardData = await standardRes.json();
      const advancedData = await advancedRes.json();

      if (!standardRes.ok || !advancedRes.ok) {
        setApiError(standardData.message || advancedData.message || "Scan failed.");
        setIsScanning(false);
        return;
      }

      sessionStorage.setItem("standardScanData", JSON.stringify(standardData));
      sessionStorage.setItem("advancedScanData", JSON.stringify(advancedData));
      sessionStorage.setItem("fileName", file.name);

      navigate("/filestandard");
    } catch (err) {
      console.error(err);
      setApiError("Connection error. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black items-center text-white px-4 pt-20 relative">
      <div className="absolute inset-0 bg-[url('/service.png')] bg-cover bg-center"></div>

      <div className="relative z-10 text-center max-w-2xl w-full">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent italic mb-4">
          Vanguard scans every file in real time
        </h1>
        <p className="text-gray-400 mb-10">
          Detect malware and hidden threats before they reach your system.
        </p>

        <div
          className="border border-green-800/50 rounded-2xl p-10 mb-8 bg-black/40 hover:bg-black/50 transition-all cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="flex flex-col items-center space-y-3">
            {isScanning ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            ) : (
              <img
                src="/icons/browse.svg"
                alt="upload"
                className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
              />
            )}
            <p className="text-gray-400">
              {file ? `File ready: ${file.name}` : "Drag & drop or browse to upload"}
            </p>
          </label>
        </div>

        {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}

        <button
          onClick={handleScan}
          disabled={!file || isScanning}
          className={`w-full max-w-md mx-auto py-3 rounded-xl font-semibold text-white text-center 
            ${
              isScanning
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-green-800 hover:opacity-90 shadow-[0_0_20px_rgba(0,255,0,0.3)] cursor-pointer"
            } 
            transition-all duration-300`}
        >
          {isScanning ? "Scanning..." : "Scan File"}
        </button>
      </div>

      {/* Instructions button */}
      <div className="absolute bottom-10 right-10 z-10 flex flex-col items-end">
        {showInstructions && (
          <div className="bg-[#0c0f0c] border border-green-700 rounded-2xl p-6 w-80 md:w-96 shadow-[0_0_25px_rgba(0,255,0,0.3)] animate-[fadeIn_0.3s_ease-out] mb-4">
            <ol className="space-y-4 text-left text-sm md:text-base">
              {/* ... نفس تعليمات الملف ... */}
            </ol>
          </div>
        )}
        <img
          src="/logo.svg"
          alt="instructions"
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-15 h-15 border rounded-full bg-green-900 cursor-pointer hover:scale-110 transition-transform duration-300"
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
