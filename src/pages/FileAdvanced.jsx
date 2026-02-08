import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

export default function Advanced() {
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openVendors, setOpenVendors] = useState(true);
  const [openHash, setOpenHash] = useState(true);
  useEffect(() => {
    const storedData = sessionStorage.getItem("advancedScanData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setScanData(parsed.data || parsed);
      } catch (err) {
        console.error("Failed to parse advanced scan data:", err);
      }
    }
    // Artificial delay for smoother transition
    setTimeout(() => setLoading(false), 500);
  }, []);

  // --- Fallback Data Logic ---
  const result = scanData?.result || {};
  const computed = scanData?.computed_hashes || {};
  
  const md5 = computed.md5 || "-";
  const sha1 = computed.sha1 || "-";
  const sha256 = computed.sha256 || "-";
  const queriedHash = scanData?.queried_hash || "-";
  const status = result.query_status || "No Data Found";

  const getValue = (v) => (v && v !== "" ? v : "-");
  const fileName = result.file_name || sessionStorage.getItem("fileName") || "Unknown_File.exe";

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="animate-pulse">Analyzing Advanced Data...</h2>
        </div>
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-10">
      
      {/* Logo Container */}
      <div className="flex justify-center mb-10">

      </div>

      <div className="max-w-6xl mx-auto bg-[#0d0d0d] rounded-xl p-5 sm:p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-green-500 font-semibold text-xl">
              Malware Analysis Report
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              📄 File Name: {fileName}
            </p>
          </div>

<button 
  // 1. التأكد أن result موجود وليس Object فارغ
  disabled={!result || Object.keys(result).length === 0}
  className={`px-5 py-2 rounded-lg font-semibold flex items-center justify-center transition-colors ${
    (result && Object.keys(result).length > 0) 
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
          <Link
            to="/filestandard"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            Standard
          </Link>
          <span className="text-white font-semibold border-b-2 border-green-500">
            Advanced
          </span>
        </div>

        {/* GRID CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Malware Family */}
          <Card>
            <FieldTitle text="Malware Family" />
            <CenteredIcon src="/icons/malware.svg" />
            <FieldValue text={getValue(result.signature)} />
          </Card>

          {/* Classification */}
          <Card>
            <FieldTitle text="Classification" />
            <CenteredIcon src="/icons/shapes.svg" />
            <FieldValue text={getValue(result.classification)} />
          </Card>

          {/* Vendor Detections */}
          <FullCard>
            <div
              className="flex justify-between items-center mb-3 cursor-pointer select-none"
              onClick={() => setOpenVendors(!openVendors)}
            >
              <h3 className="text-green-500 text-lg font-semibold">
                Vendor Detections
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-2 border-red-500 text-red-500 font-bold">
                  {Object.keys(result.vendors || {}).length}
                </div>
                <span className="text-gray-400 text-xl">
                  {openVendors ? "▾" : "▸"}
                </span>
              </div>
            </div>

            {openVendors && (
              <div className="overflow-x-auto max-h-[400px] custom-scrollbar">
                <table className="w-full text-sm text-gray-300 min-w-[500px]">
                  <thead className="text-gray-400 sticky top-0 bg-[#111]">
                    <tr>
                      <th className="text-left py-2">Vendor</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Result</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-800">
                    {Object.keys(result.vendors || {}).length > 0 ? (
                      Object.entries(result.vendors).map(([vendor, data]) => (
                        <tr key={vendor} className="hover:bg-white/5 transition-colors">
                          <td className="py-2 font-medium">{vendor}</td>
                          <td className="py-2">{data.malware_family ?? "-"}</td>
                          <td className="py-2 text-red-400">{data.detection ?? "-"}</td>
                          <td className="py-2">{data.status ?? "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-10 text-center text-gray-500 italic">
                          No vendor detection information available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </FullCard>

          {/* Hashes */}
          <FullCard>
            <div
              className="flex justify-between items-center mb-4 cursor-pointer select-none"
              onClick={() => setOpenHash(!openHash)}
            >
              <h3 className="text-green-500 text-lg font-semibold">
                Hash Values
              </h3>
              <span className="text-gray-400 text-xl">
                {openHash ? "▾" : "▸"}
              </span>
            </div>

            {openHash && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <HashItem title="SHA-256" value={sha256} />
                <HashItem title="SHA-1" value={sha1} />
                <HashItem title="MD5" value={md5} />
                <HashItem title="Queried Hash" value={queriedHash} />
                <HashItem title="Status" value={status} />
              </div>
            )}
          </FullCard>

          {/* Info Boxes */}
          <InfoBox title="File Overview">
            <p><span className="text-gray-500">Name:</span> {getValue(result.file_name)}</p>
            <p><span className="text-gray-500">Type:</span> {getValue(result.file_type)}</p>
            <p><span className="text-gray-500">Size:</span> {result.file_size ? `${result.file_size} bytes` : "-"}</p>
            <p><span className="text-gray-500">Mime:</span> {getValue(result.file_type_mime)}</p>
          </InfoBox>

          <InfoBox title="History & Origin">
            <p><span className="text-gray-500">First Seen:</span> {getValue(result.first_seen)}</p>
            <p><span className="text-gray-500">Last Seen:</span> {getValue(result.last_seen)}</p>
            <p><span className="text-gray-500">Origin:</span> {getValue(result.origin_country)}</p>
          </InfoBox>

          <InfoBox title="Advanced Signatures" full>
            <p><span className="text-gray-500">Imphash:</span> {getValue(result.imphash)}</p>
            <p><span className="text-gray-500">SSDeep:</span> {getValue(result.ssdeep)}</p>
            <p><span className="text-gray-500">TLSH:</span> {getValue(result.tlsh)}</p>
          </InfoBox>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Sub-Components ---------------- */

function Card({ children }) {
  return (
    <div className="bg-[#111] p-5 rounded-xl border border-gray-800 text-center hover:border-green-500/30 transition-all">
      {children}
    </div>
  );
}

function FullCard({ children }) {
  return (
    <div className="bg-[#111] p-5 rounded-xl border border-gray-800 md:col-span-2 shadow-sm">
      {children}
    </div>
  );
}

function FieldTitle({ text }) {
  return <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">{text}</h3>;
}

function CenteredIcon({ src }) {
  return <img src={src} alt="" className="w-14 h-14 mx-auto mb-2 opacity-80" />;
}

function FieldValue({ text }) {
  return <p className="text-xl font-semibold break-all text-white">{text}</p>;
}

function HashItem({ title, value }) {
  return (
    <div className="bg-[#0e0e0e] p-4 rounded-lg border border-gray-900 group hover:border-green-900 transition-colors">
      <p className="text-gray-500 text-xs font-bold uppercase mb-1">{title}</p>
      <p className="break-all text-sm font-mono text-gray-300 group-hover:text-white transition-colors">{value}</p>
    </div>
  );
}

function InfoBox({ title, children, full }) {
  return (
    <div
      className={`bg-[#111] p-5 rounded-xl border border-gray-800 hover:border-green-500/20 transition-all ${
        full ? "md:col-span-2" : ""
      }`}
    >
      <h3 className="text-green-500 text-lg font-semibold mb-4 border-b border-gray-800 pb-2">{title}</h3>
      <div className="text-gray-300 space-y-2 text-sm">{children}</div>
    </div>
  );
}