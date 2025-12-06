import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // محتاجين للتوجيه للصفحة الجديدة

export default function FilePage() {
  const [file, setFile] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const processFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setApiError("");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleScan = async () => {
    if (!file) return;

    setIsScanning(true);
    setApiError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/api/v1/advanced/scan-file", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setApiError(data.message || "An error occurred during scan.");
      } else {
        // لو العملية نجحت، نروح لصفحة FileAdvanced ونبعت البيانات
        navigate("/fileadvanced", {
          state: {
            scanData: data?.data || null,
            fileName: data?.data?.file_name || file.name,
          },
        });
      }
    } catch (err) {
      console.error(err);
      setApiError("Connection error. Please try again later.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black items-center relative overflow-hidden text-white px-4 pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/service.png')] bg-cover bg-center "></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl w-full">
        <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent italic mb-4">
          Vanguard scans every file in real time to detect hidden threats
        </h1>

        <p className="text-gray-400 mb-10 leading-relaxed">
          Vanguard scans every file in real time to detect malware, hidden risks,
          and malicious content before it reaches your system.
        </p>

        {/* Upload Box */}
        <div
          className="border border-green-800/50 rounded-2xl p-10 mb-8 bg-black/40 hover:bg-black/50 transition-all cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="flex flex-col items-center justify-center space-y-3"
          >
            {isScanning ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            ) : (
              <img
                src="/icons/browse.svg"
                alt="upload"
                className="w-12 h-12 cursor-pointer opacity-90 hover:scale-110 transition-transform duration-300"
              />
            )}

            <p className="text-gray-400">
              {file ? (
                isScanning ? (
                  <span className="text-green-400">Scanning {file.name}... Please wait.</span>
                ) : (
                  <span className="text-green-400">File ready: {file.name}</span>
                )
              ) : (
                "Drag & drop or browse to upload"
              )}
            </p>
          </label>
        </div>

        {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}
      </div>

      {/* Scan Button */}
      <button
        onClick={handleScan}
        disabled={isScanning || !file}
        className={`block z-10 mt-8 w-full py-3 rounded-xl font-semibold text-white text-center 
          ${isScanning ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-green-600 to-green-800 hover:opacity-90 shadow-[0_0_20px_rgba(0,255,0,0.3)] cursor-pointer"}
          transition-all duration-300 max-w-md mx-auto
        `}
      >
        {isScanning ? "Scanning..." : "Scan"}
      </button>

{/* Instructions Popup */}
<div className="absolute bottom-10 right-10 z-10 flex flex-col items-end">
  {showInstructions && (
    <div className="bg-[#0c0f0c] border border-green-700 rounded-2xl p-6 w-80 md:w-96 shadow-[0_0_25px_rgba(0,255,0,0.3)] animate-[fadeIn_0.3s_ease-out] mb-4">
      <ol className="space-y-4 text-left text-sm md:text-base">
        <li className="flex items-start gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">1</span>
          <p>Locate the .exe file you downloaded (must be Windows executable)</p>
        </li>

        <li className="flex items-start gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">2</span>
          <p>Do NOT run or open the file yet, scan it first for safety</p>
        </li>

        <li className="flex items-start gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">3</span>
          <p>Visit our File Scan service page</p>
        </li>

        <li className="flex items-start gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">4</span>
          <p>Click 'Choose File' or drag and drop your .exe file</p>
        </li>

        <li className="flex items-start gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">5</span>
          <p>Ensure file size is under 100MB (larger files not supported)</p>
        </li>

        <li className="flex items-start gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">6</span>
          <p>Click 'Scan File' to upload and start analysis</p>
        </li>

        <li className="flex items-start gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">7</span>
          <p>Wait 10–30 seconds for multi-engine scanning to complete</p>
        </li>
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
