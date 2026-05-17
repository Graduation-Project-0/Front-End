import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl, ENDPOINTS } from "../config/endpoints";

export default function UrlPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const target = params.get("target");
  if (target) {
    try {
      const parsedUrl = new URL(target);
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
      setUrl(baseUrl);
    } catch {
      console.error("Invalid URL in target:", target);
      setUrl(target); 
    }
  }
}, [location.search]);


const handleScan = async () => {
  if (!url) return;
  setLoading(true);
  setError("");

  try {
    const token = localStorage.getItem("token");

    const standardRes = await fetch(apiUrl(ENDPOINTS.STANDARD_SCAN_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    });

    if (standardRes.status === 200) {
      const standardData = await standardRes.json();
      sessionStorage.setItem("scanResultStandard", JSON.stringify(standardData));
      sessionStorage.removeItem("scanResultAdvanced"); // clear any stale result
      sessionStorage.setItem("pendingAdvancedUrl", url); // store for UrlAdvanced
      navigate("/urlstandard");
    } else {
      setError("Scan failed. Please try again.");
    }
  } catch (err) {
    console.error(err);
    setError("Failed to scan the URL");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[url('/service.png')] bg-cover bg-center" />

      <div className="relative z-10 flex min-h-screen w-full justify-center px-4 py-20 sm:px-6 md:px-8">
        <div className="flex min-h-0 w-full min-w-0 max-w-2xl shrink-0 flex-col items-center justify-center md:w-[min(42rem,100%)]">

        <h1 className="mb-4 px-2 text-center text-2xl font-semibold italic text-transparent md:text-3xl bg-gradient-to-r from-green-400 to-white bg-clip-text">
          Behind every link lies a story,
        </h1>

        <p className="mt-3 w-full min-w-0 px-1 text-center text-gray-400">
          Vanguard analyzes URLs in real time to detect malicious patterns, phishing attempts, and hidden risks
        </p>

        <div className="relative mt-12 flex w-full min-w-0 flex-col gap-2 overflow-hidden rounded-xl border border-green-700 bg-black/50 shadow-[0_0_20px_rgba(0,255,0,0.1)] sm:h-14 sm:flex-row sm:items-stretch sm:gap-0">
          <input
            type="text"
            placeholder="Scan any URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none sm:py-0"
          />

          <button
            onClick={handleScan}
            disabled={loading}
            className="cursor-pointer shrink-0 bg-green-700 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-green-900 disabled:opacity-50 sm:h-auto sm:px-6 sm:py-0"
          >
            {loading ? "Scanning..." : "Scan"}
          </button>
        </div>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>

      <div className="fixed bottom-6 right-4 z-10 flex flex-col items-end">
  {showInstructions && (
    <div className="bg-[#0c0f0c] border border-green-700 rounded-2xl p-6 w-[min(22rem,90vw)] shadow-[0_0_25px_rgba(0,255,0,0.3)] mb-4 animate-[fadeIn_0.3s_ease-out]">
            <ol className="space-y-4 text-left text-sm md:text-base">
              {[
                "Copy any suspicious URL from emails, messages, or social media",
                "Paste the link into our URL scan field on the homepage",
                "Click the 'Scan URL' button to start the analysis",
                "Wait 2-5 seconds for threat detection results",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 font-bold text-black text-sm">
                    {i + 1}
                  </span>
                  <p>{text}</p>
                </li>
              ))}
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
    </div>
  );
}
