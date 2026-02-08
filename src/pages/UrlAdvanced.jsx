import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download, ChevronDown, ChevronUp } from "lucide-react";

export default function UrlAdvanced() {
  const [loading, setLoading] = useState(true);
  const [scanResultAdvanced, setScanResultAdvanced] = useState(null);
  // الحالة الخاصة بإظهار كل المتغيرات أو لا
  const [showAllJS, setShowAllJS] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("scanResultAdvanced");
    if (storedData) {
      try {
        setScanResultAdvanced(JSON.parse(storedData));
      } catch (err) {
        console.error("Error parsing scan data:", err);
      }
    }
    setTimeout(() => setLoading(false), 500);
  }, []);

  const data = scanResultAdvanced?.data || {};

  // منطق تحديد المتغيرات المعروضة (أول 5 متغيرات فقط في البداية)
  const allJSVars = data.javascript_variables || [];
  const displayedJSVars = showAllJS ? allJSVars : allJSVars.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto bg-[#0d0d0d] rounded-xl p-5 sm:p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)] w-full">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h2 className="text-green-500 font-semibold text-lg">Malware Analysis Report</h2>
     
<button 
  disabled={!data || Object.keys(data).length === 0}
  className={`px-5 py-2 rounded-lg font-semibold flex items-center justify-center transition-colors ${
    (data && Object.keys(data).length > 0) 
      ? "bg-green-700 hover:bg-green-900 cursor-pointer" 
      : "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
  }`}
>
  <Download className="w-5 h-5 mr-2" />
  Download Report
</button>
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b border-gray-700 pb-3 mb-8 text-sm sm:text-base">
          <Link to="/urlstandard" className="text-gray-500 hover:text-gray-300 cursor-pointer">
            Standard
          </Link>
          <span className="text-white font-semibold border-b-2 border-green-500">
            Advanced
          </span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Summary */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">Summary</h3>
            {data.summary ? (
              <p className="text-gray-300 text-sm leading-relaxed">{data.summary}</p>
            ) : (
              <p className="text-gray-500 text-sm italic">No summary available.</p>
            )}
            <p className="text-gray-400 text-sm mt-4 font-mono break-all">
              {data.tls_certificate?.text || "No TLS certificate information found."}
            </p>
          </div>

          {/* Screenshot */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">Screenshot</h3>
            {data.screenshot_url ? (
              <img src={data.screenshot_url} alt="Screenshot" className="w-full rounded-lg border border-gray-700 object-contain" />
            ) : (
              <div className="h-40 bg-black/40 flex items-center justify-center rounded border border-dashed border-gray-800">
                <p className="text-gray-500 text-sm italic">No screenshot available.</p>
              </div>
            )}
          </div>

          {/* IP Addresses */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">IP Addresses</h3>
            {data.ip_addresses?.length ? (
              data.ip_addresses.map((ip, idx) => (
                <div key={idx} className="text-gray-300 text-sm flex items-center gap-3 mb-2">
                  <span className="font-mono">{ip.ip || ip.value}</span>
                  {ip.type && <span className="px-2 py-0.5 text-[10px] rounded bg-gray-800 text-gray-400">{ip.type}</span>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No IP addresses found.</p>
            )}
          </div>

          {/* Domains */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">Domains</h3>
            {data.domains?.length ? (
              data.domains.map((d, idx) => (
                <div key={idx} className="text-gray-300 text-sm flex items-center gap-3 mb-2">
                  <span className="font-mono">{d.domain || d.name}</span>
                  {d.type && <span className="px-2 py-0.5 text-[10px] rounded bg-gray-800 text-gray-400">{d.type}</span>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No domains found.</p>
            )}
          </div>

          {/* Scan History + Verdict */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 col-span-1 lg:col-span-2 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">Scan History</h3>
            <p className="text-gray-300 text-sm mb-3">{data.scan_history || "No scan history recorded."}</p>
            <div className="p-2 bg-black/50 rounded inline-block">
              <span className="text-green-400 font-semibold text-sm">Verdict:</span>{" "}
              <span className="text-gray-300 text-sm">{data.verdict?.text || "Not available"}</span>
            </div>
          </div>

          {/* Redirect URLs */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 col-span-1 lg:col-span-2 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">Redirect URLs</h3>
            {data.redirected_requests?.length ? (
              data.redirected_requests.map((url, i) => (
                <p key={i} className="text-gray-300 text-xs font-mono mb-1 break-all bg-black/30 p-1 rounded">
                   {i + 1}. {url}
                </p>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No redirect URLs found.</p>
            )}
          </div>

          {/* JavaScript Variables (WITH READ MORE) */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 col-span-1 lg:col-span-2 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">JavaScript Variables</h3>
            {allJSVars.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700 font-mono">
                      <th className="py-2">Variable Name</th>
                      <th className="py-2">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedJSVars.map((v, i) => (
                      <tr key={i} className="text-gray-300 border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                        <td className="py-2 font-mono text-green-500/80">{v.name}</td>
                        <td className="py-2">{v.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* زرار Read More الخاص بالجافا سكريبت فقط */}
                {allJSVars.length > 5 && (
                  <button 
                    onClick={() => setShowAllJS(!showAllJS)}
                    className="mt-4 text-green-500 text-xs font-bold flex items-center hover:text-green-400 transition-colors uppercase tracking-wider"
                  >
                    {showAllJS ? (
                      <><ChevronUp className="w-4 h-4 mr-1" /> Show Less</>
                    ) : (
                      <><ChevronDown className="w-4 h-4 mr-1" /> Read More ({allJSVars.length - 5} more variables)</>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No JavaScript variables found.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}