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
      setError("No scan data received.");
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="text-white p-10 text-center"><h2>Loading scan data...</h2></div>;
  if (!scanData) return <div className="text-white p-10 text-center"><h2>{error || "No scan data available."}</h2></div>;

  // بيانات الملف
  const fileName = sessionStorage.getItem("fileName") || scanData.filename || "example.exe";
  
  // تحويل الاحتمالية لinteger
  const score = scanData.malicious_probability ? Math.round(scanData.malicious_probability) : 0;
  
  // تحديد اذا امن
  const isSafe = score < 50;

  const goToAdvanced = () => navigate("/fileadvanced");

  return (
    <div className="min-h-screen bg-[#111] text-white px-4 sm:px-6 py-10">

      {/* LOGO */}
      <img
        src="/FullLogoBlack.png"
        alt="logo"
        className="h-16 sm:h-20 w-40 sm:w-52 mb-10 mx-auto"
      />

      <div className="max-w-5xl mx-auto bg-[#0d0d0d] rounded-xl p-5 sm:p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)] w-full">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="text-center md:text-left">
            <h2 className="text-green-500 font-semibold text-lg">Malware Analysis Report</h2>
            <p className="text-gray-400 text-sm mt-1">📄 File Name: {fileName}</p>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button className="bg-green-700 hover:bg-green-900 px-5 py-2 rounded-lg font-semibold flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-700 pb-3 mb-8 text-sm sm:text-base">
          <span className="text-white font-semibold border-b-2 border-green-500">Standard</span>
          <span onClick={goToAdvanced} className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Advanced</span>
        </div>

        {/* Status Card */}
        <div className="bg-[#111] rounded-xl p-8 sm:p-10 shadow-inner text-center">
          <div className="flex justify-center mb-6">
            <img src={isSafe ? SafeIcon : MalwareIcon} alt={isSafe ? "Safe File" : "Malicious File"} className="w-20 sm:w-24 h-20 sm:h-24"/>
          </div>

          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isSafe ? "text-green-500" : "text-red-500"}`}>
            {isSafe ? "This File Is Safe" : "This File Is Malicious"}
          </h2>

          <p className="text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed text-sm sm:text-base">
            {isSafe
              ? "Our analysis confirms this file is genuine and free from any malicious threats."
              : "This file is extremely dangerous. Do NOT open or run it. It may harm your device or steal data."}
          </p>

          <div className="flex justify-center">
            <div className="w-36 sm:w-40 h-36 sm:h-40 rounded-full border-[8px] sm:border-[10px] flex items-center justify-center text-center" style={{ borderColor: isSafe ? "#00ff00" : "#ff0000" }}>
              <div>
                <p className="text-2xl sm:text-3xl font-bold">{score}%</p>
                <p className="text-gray-400 text-sm">Malicious</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
