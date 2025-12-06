import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

const EmailOutput = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Spam Score (You can replace it with API value later)
  const spamScore = 72; 
  const isSpam = spamScore >= 50;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dummy data for demonstration
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-white text-xl">Loading report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111] p-8 text-red-500">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white px-6 py-10">

      {/* Logo */}
      <img
        src="/FullLogoBlack.png"
        alt="logo"
        className="h-14 sm:h-14 lg:h-20 w-50 ml-60 mb-20"
      />

      {/* Wrapper */}
      <div className="max-w-5xl mx-auto bg-[#0d0d0d] rounded-xl p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)] w-full">

        {/* Header + Download */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-green-500 font-semibold text-lg">Malware Analysis Report</h2>

          <button className="bg-green-700 hover:bg-green-900 px-5 py-2 rounded-lg font-semibold flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        {/* Tabs */}

        {/* 2 BOXES ONLY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* URLs Box */}
          <div className="bg-[#111] p-5 rounded-xl shadow-[0_0_20px_rgba(0,255,0,0.15)] border border-gray-800">
            <h3 className="text-green-400 font-semibold mb-2">URLs</h3>
            <p className="text-gray-400 text-sm">No URLs detected.</p>
          </div>

          {/* Files Box */}
          <div className="bg-[#111] p-5 rounded-xl shadow-[0_0_20px_rgba(0,255,0,0.15)] border border-gray-800">
            <h3 className="text-green-400 font-semibold mb-2">Files</h3>
            <p className="text-gray-400 text-sm">No files detected.</p>
          </div>

        </div>

        {/* SPAM RESULT SECTION */}
        <div className="bg-[#111] rounded-xl p-10 shadow-inner text-center mt-10">

          {/* TITLE */}
          <h2
            className={`text-2xl font-bold mb-4 ${
              isSpam ? "text-red-500" : "text-green-500"
            }`}
          >
            {isSpam ? "This Email is Spam" : "This Email is Not Spam"}
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed">
            {isSpam
              ? "Warning: This email appears to be spam. It may contain harmful or phishing content."
              : "This email appears legitimate and safe. No harmful or suspicious content detected."}
          </p>

          {/* CIRCLE */}
          <div className="flex justify-center">
            <div
              className="w-40 h-40 rounded-full border-[10px] flex items-center justify-center text-center"
              style={{
                borderColor: isSpam ? "#ff0000" : "#00ff00",
              }}
            >
              <div>
                <p className="text-3xl font-bold">{spamScore}%</p>
                <p className="text-gray-400 text-sm">Spam Score</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EmailOutput;
