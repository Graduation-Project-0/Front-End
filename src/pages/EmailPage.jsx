import React, { useState } from "react";
import {Link} from "react-router-dom"

export default function EmailPage() {
  const [file, setFile] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => e.preventDefault();

  const handleScan = () => {
    if (!file) return;
    console.log("Scanning file:", file.name);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black items-center  relative overflow-hidden text-white px-4 pt-20">
      <div className="absolute inset-0 bg-[url('/service.png')] bg-cover bg-center "></div>
      <div className="relative z-10  max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-semibold  bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent italic mb-4">
         No email goes unchecked,  
        </h1>
        <p className="text-gray-400 mb-10 leading-relaxed text-center">
       Vanguard scans every email in real time to detect phishing attempts, malicious attachments, and hidden risks before they reach your inbox
        </p>
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
            <img
              src="/icons/browse.svg"
              alt="upload"
              className="w-12 h-12 cursor-pointer opacity-90 hover:scale-110 transition-transform duration-300"
            />

            <p className="text-gray-400">
              {file ? (
                <span className="text-green-400">{file.name}</span>
              ) : (
                "Drag & drop or browse to upload"
              )}
            </p>
          </label>
        </div>
        <Link to="/emailoutput"
          onClick={handleScan}
          disabled={!file}
          className="block text-center mt-8 w-full cursor-pointer py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-green-800 hover:opacity-90 shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all duration-300"
        >
          Scan
        </Link>
      </div>
      <div className="absolute bottom-10 right-10 z-10 flex flex-col items-end">
        {showInstructions && (
          <div className="bg-[#0c0f0c] border border-green-700 rounded-2xl p-6 w-80 md:w-96 shadow-[0_0_25px_rgba(0,255,0,0.3)] mb-4 animate-[fadeIn_0.3s_ease-out]">
            <ol className="space-y-4 text-left text-sm md:text-base">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">
                  1
                </span>
                <p>Open your email client (Gmail, Outlook, Thunderbird, etc.)  </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">
                  2
                </span>
                <p>Find the suspicious email you want to scan  </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">
                  3
                </span>
                <p> Right-click on the email and select 'Save As' or 'Export'  </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">
                  4
                </span>
                <p>Choose one of these formats: .eml (most common), .msg (Outlook), or .mbox  </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">
                  5
                </span>
                <p>Save the file to your computer </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">
                  6
                </span>
                <p>Go to our Email Scan page and click 'Upload Email'  </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">
                  7
                </span>
                <p>Select your saved email file and click 'Scan Now'  </p>
              </li>
                   <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">
                  8
                </span>
                <p>Wait 5-10 seconds for comprehensive analysis </p>
              </li>
            </ol>
          </div>
        )}

        <img
          src="/logo.svg"
          alt="instructions"
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-15 h-15 border rounded-full bg-green-900  cursor-pointer hover:scale-110 transition-transform duration-300"
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
