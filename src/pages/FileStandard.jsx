import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download } from "lucide-react";

import SafeIcon from "/icons/armor.svg";
import MalwareIcon from "/icons/ion_bug.svg";

export default function FileStandard() {
  const location = useLocation();
  const { result } = location.state || {}; // 👈 البيانات جاية من صفحة الفايل
  console.log(result)
  const [score, setScore] = useState(0);
  const [fileName, setFileName] = useState("example.exe");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSafe = score >= 50;

  useEffect(() => {
    if (!result) {
      setError("No scan data received.");
      setLoading(false);
      return;
    }

    // 👈 هنا بناخد الداتا اللي جت من صفحة الفايل
    setScore(result.score ?? 0);
    setFileName(result.file_name ?? "example.exe");

    setLoading(false);
  }, [result]);

  return (
    <div className="min-h-screen bg-[#111] text-white px-6 py-10">
      <img src="/FullLogoBlack.png" alt="logo" className="h-14 sm:h-14 lg:h-20 w-50 ml-60 mb-20" />

      <div className="max-w-5xl mx-auto bg-[#0d0d0d] rounded-xl p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-green-500 font-semibold text-lg">
              Malware Analysis Report
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              📄 File Name: {fileName}
            </p>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button className="bg-green-700 hover:bg-green-900 px-5 py-2 rounded-lg font-semibold flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        <div className="flex gap-10 border-b border-gray-700 pb-3 mb-8">
          <span className="text-white font-semibold border-b-2 border-green-500">Standard</span>
          <Link to="/fileadvanced" className="text-gray-500 hover:text-gray-300 cursor-pointer">
            Advanced
          </Link>
        </div>

        <div className="bg-[#111] rounded-xl p-10 shadow-inner text-center">
          <div className="flex justify-center mb-6">
            <img
              src={isSafe ? SafeIcon : MalwareIcon}
              alt={isSafe ? "Safe File" : "Malicious File"}
              className="w-24 h-24"
            />
          </div>

          <h2 className={`text-2xl font-bold mb-4 ${isSafe ? "text-green-500" : "text-red-500"}`}>
            {isSafe ? "This File Is Safe" : "This File Is Malicious"}
          </h2>

          <p className="text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed">
            {isSafe
              ? "Our Analysis Confirms This File is genuine and Free From any Malicious Threats."
              : "This File is extremely dangerous. Do NOT open or run it. It may harm your device or steal data."}
          </p>

          <div className="flex justify-center">
            <div
              className="w-40 h-40 rounded-full border-[10px] flex items-center justify-center text-center"
              style={{ borderColor: isSafe ? "#00ff00" : "#ff0000" }}
            >
              <div>
                {loading ? (
                  <p className="text-gray-400">Loading...</p>
                ) : (
                  <>
                    <p className="text-3xl font-bold">{score}%</p>
                    <p className="text-gray-400 text-sm">Malicious</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
