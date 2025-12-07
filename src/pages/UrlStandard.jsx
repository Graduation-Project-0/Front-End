import React from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

import SafeIcon from "/icons/armor.svg";
import MalwareIcon from "/icons/ion_bug.svg";

export default function UrlStandard() {
  const scanResultStandard = JSON.parse(sessionStorage.getItem("scanResultStandard"));
  const _scanResultAdvanced = JSON.parse(sessionStorage.getItem("scanResultAdvanced"));

  const stdData = scanResultStandard?.data;
  const maliciousProbability = stdData?.malicious_probability ?? 0;
  const score = Math.round(maliciousProbability * 100);
  const isSafe = stdData ? !stdData.is_malicious : true;

  return (
    <div className="min-h-screen bg-[#111] text-white px-4 sm:px-6 py-10">
      
    {/* LOGO */}
      <img
        src="/FullLogoBlack.png"
        alt="logo"
        className="h-16 sm:h-20 w-40 sm:w-52 mb-10 mx-auto"
      />

      <div className="max-w-4xl mx-auto bg-[#0d0d0d] rounded-xl p-5 sm:p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h2 className="text-green-500 font-semibold text-xl">Malware Analysis Report</h2>

          <button className="bg-green-700 hover:bg-green-900 px-5 py-2 rounded-lg font-semibold flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        {/* Tabs */}
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

        {/* MAIN RESULT BOX */}
        <div className="bg-[#111] rounded-xl p-6 sm:p-10 shadow-inner text-center">
          
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <img 
              src={isSafe ? SafeIcon : MalwareIcon} 
              alt={isSafe ? "Safe URL" : "Malicious URL"} 
              className="w-20 h-20 sm:w-24 sm:h-24"
            />
          </div>

          {/* Status Text */}
          <h2 
            className={`text-xl sm:text-2xl font-bold mb-4 ${
              isSafe ? "text-green-500" : "text-red-500"
            }`}
          >
            {isSafe ? "This URL Is Safe" : "This URL Is Malicious"}
          </h2>

          {/* Description */}
          <p className="text-gray-300 max-w-md mx-auto mb-10 leading-relaxed text-sm sm:text-base">
            {isSafe
              ? "Our Analysis Confirms This URL is Genuine and Free From Threats."
              : "WARNING: This URL is dangerous. Do NOT visit it."}
          </p>

          {/* Circle */}
          <div className="flex justify-center">
            <div
              className="rounded-full border-[8px] sm:border-[10px] flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40"
              style={{ borderColor: isSafe ? "#00ff00" : "#ff0000" }}
            >
              <div className="text-center">
                <p className="text-3xl font-bold">{score}%</p>
                <p className="text-gray-400 text-sm">Malicious</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
