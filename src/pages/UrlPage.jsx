import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

      const standardReq = fetch("http://127.0.0.1:8000/api/v1/standard/scan-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      const advancedReq = fetch("http://127.0.0.1:8000/api/v1/advanced/scan-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      const [standardRes, advancedRes] = await Promise.all([standardReq, advancedReq]);
      const standardData = await standardRes.json();
      const advancedData = await advancedRes.json();

      sessionStorage.setItem("scanResultStandard", JSON.stringify(standardData));
      sessionStorage.setItem("scanResultAdvanced", JSON.stringify(advancedData));

      navigate("/urlstandard");
    } catch (err) {
      console.error(err);
      setError("Failed to scan the URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      <div className="absolute inset-0 bg-[url('/service.png')] bg-cover bg-center"></div>

      <div className="relative z-10 flex flex-col items-center justify-center mt-28 px-4">

        <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent italic mb-4">
          Behind every link lies a story,
        </h1>

        <p className="text-gray-400 mt-3 max-w-2xl text-center">
          Vanguard analyzes URLs in real time to detect malicious patterns, phishing attempts, and hidden risks
        </p>

        <div className="relative flex items-center w-full h-15 max-w-2xl border border-green-700 rounded-xl bg-black/50 shadow-[0_0_20px_rgba(0,255,0,0.1)] mt-12 overflow-hidden">
          <input
            type="text"
            placeholder="Scan any URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3 text-gray-300 focus:outline-none placeholder-gray-500"
          />

          <button
            onClick={handleScan}
            disabled={loading}
            className="cursor-pointer bg-green-700 hover:bg-green-900 text-white font-semibold px-6 py-2 h-full transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Scan"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      <div className="absolute bottom-10 right-10 z-10 flex flex-col items-end">
        {showInstructions && (
          <div className="bg-[#0c0f0c] border border-green-700 rounded-2xl p-6 w-80 md:w-96 shadow-[0_0_25px_rgba(0,255,0,0.3)] mb-4 animate-[fadeIn_0.3s_ease-out]">
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
