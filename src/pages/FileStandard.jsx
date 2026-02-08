import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import SafeIcon from "/icons/armor.svg";
import MalwareIcon from "/icons/ion_bug.svg";

export default function FileStandard() {
  const navigate = useNavigate();
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedData = sessionStorage.getItem("standardScanData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const data = parsed.data || parsed;
        setScanData(data);
      } catch (err) {
        console.error("Failed to parse standard scan data:", err);
        setError("Failed to load scan data.");
      }
    } else {
      setError("No recent scan data found.");
    }
    setTimeout(() => setLoading(false), 500);
  }, []);

  // --- Logic Setup ---
  const hasData = scanData && Object.keys(scanData).length > 0;
  const fileName = sessionStorage.getItem("fileName") || scanData?.filename || "Unknown_File.exe";
  
  const rawProbability = scanData?.malicious_probability ?? 0;
  const score = hasData ? Math.round(rawProbability) : 0;
  const isSafe = score < 50;

  const goToAdvanced = () => navigate("/fileadvanced");

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-10">

      <div className="max-w-5xl mx-auto bg-[#0d0d0d] rounded-xl p-5 sm:p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)] w-full">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
{/* داخل الـ Header تحت الـ File Name */}
<div className="text-center md:text-left">
  <h2 className="text-green-500 font-semibold text-lg">Malware Analysis Report</h2>
  <p className="text-gray-400 text-sm mt-1">📄 File Name: {fileName}</p>
  
  {/* إضافة هذا السطر لاستخدام المتغير */}
  {error && <p className="text-red-500 text-xs mt-1 italic">{error}</p>}
</div>
          <button 
            disabled={!hasData}
            className={`px-5 py-2 rounded-lg font-semibold flex items-center justify-center transition-colors ${
              hasData 
                ? "bg-green-700 hover:bg-green-900 cursor-pointer" 
                : "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
            }`}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 border-b border-gray-700 pb-3 mb-8 text-sm sm:text-base">
          <span className="text-white font-semibold border-b-2 border-green-500 cursor-default">
            Standard
          </span>
          <span 
            onClick={goToAdvanced} 
            className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
          >
            Advanced
          </span>
        </div>

        {/* Status Card Content */}
        <div className="bg-[#111] rounded-xl p-8 sm:p-10 shadow-inner text-center">
          
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            <img 
              src={isSafe ? SafeIcon : MalwareIcon} 
              alt="Status Icon" 
              className={`w-20 sm:w-24 h-20 sm:h-24 transition-all duration-500 ${
                !hasData ? "opacity-20 grayscale" : "hover:scale-110"
              }`}
            />
          </div>

          {/* Verdict Title */}
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 transition-colors duration-500 ${
            !hasData ? "text-gray-600" : isSafe ? "text-green-500" : "text-red-500"
          }`}>
            {!hasData ? "Waiting for Scan Result..." : isSafe ? "This File Is Safe" : "This File Is Malicious"}
          </h2>

          {/* Verdict Description */}
          <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed text-sm sm:text-base transition-opacity">
            {!hasData 
              ? "Please upload a file and start the scanning process to view the detailed analysis report."
              : isSafe
                ? "Our analysis confirms this file is genuine and free from any malicious threats. You can safely proceed."
                : "This file is extremely dangerous. Do NOT open or run it. It may harm your device or steal data."}
          </p>

          {/* Score Circle */}
          <div className="flex justify-center">
            <div 
              className="w-36 sm:w-40 h-36 sm:h-40 rounded-full border-[8px] sm:border-[10px] flex items-center justify-center text-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-700" 
              style={{ borderColor: !hasData ? "#222" : isSafe ? "#00ff00" : "#ff0000" }}
            >
              <div>
                <p className={`text-2xl sm:text-3xl font-bold transition-colors ${!hasData ? "text-gray-700" : "text-white"}`}>
                  {score}%
                </p>
                <p className="text-gray-500 text-sm italic">Malicious</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}