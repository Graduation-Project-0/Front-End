import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

import SafeIcon from "/icons/armor.svg";
import MalwareIcon from "/icons/ion_bug.svg";

export default function UrlStandard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = sessionStorage.getItem("scanResultStandard");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setData(parsed.data || parsed);
      } catch (err) {
        console.error(err);
      }
    }
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const hasData = data !== null;
  const isMalicious = hasData && (data.is_malicious === true || data.probability_malicious > 0.4);
  const score = data ? Math.round(data.probability_malicious * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-10">
      <div className="max-w-4xl mx-auto bg-[#0d0d0d] rounded-xl p-5 sm:p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)]">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h2 className="text-green-500 font-semibold text-xl">
            Malware Analysis Report
          </h2>

          <button
            disabled={!data}
            className={`px-5 py-2 rounded-lg font-semibold flex items-center justify-center transition-colors ${
              data
                ? "bg-green-700 hover:bg-green-900 cursor-pointer text-white"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        <div className="flex gap-6 border-b border-gray-700 pb-3 mb-8 text-sm sm:text-base">
          <span className="text-white font-semibold border-b-2 border-green-500">
            Standard
          </span>
          <Link
            to="/urladvanced"
            className="text-gray-500 hover:text-gray-300 cursor-pointer"
          >
            Advanced
          </Link>
        </div>

        <div className="bg-[#111] rounded-xl p-6 sm:p-10 shadow-inner text-center">

          <div className="flex justify-center mb-6">
            <img
              src={isMalicious ? MalwareIcon : SafeIcon}
              alt="Status Icon"
              className={`w-20 h-20 sm:w-24 sm:h-24 transition-opacity duration-500 ${
                !hasData ? "opacity-20 grayscale" : "opacity-100"
              }`}
            />
          </div>

          <h2
            className={`text-xl sm:text-2xl font-bold mb-4 transition-colors duration-500 ${
              !hasData
                ? "text-gray-600"
                : isMalicious
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {!hasData
              ? "Waiting for Scan Result..."
              : isMalicious
              ? "This URL Is Malicious"
              : "This URL Is Safe"}
          </h2>

          <p className="text-gray-400 max-w-md mx-auto mb-10 leading-relaxed text-sm sm:text-base">
            {!hasData
              ? "Please enter a URL in the scan page and start the scan to see the analysis report."
              : isMalicious
              ? "WARNING: This URL is dangerous. Do NOT visit it."
              : "Our Analysis Confirms This URL is Genuine and Free From Threats."}
          </p>

          <div className="flex justify-center">
            <div
              className={`rounded-full border-[10px] flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 transition-all duration-700 ${
                !hasData 
                  ? "border-zinc-800" 
                  : isMalicious 
                  ? "border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.2)]" 
                  : "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
              }`}
            >
              <div className="text-center">
                <p className={`text-3xl font-bold transition-colors ${!hasData ? "text-gray-700" : "text-white"}`}>
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