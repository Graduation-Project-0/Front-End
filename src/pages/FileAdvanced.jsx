import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download } from "lucide-react";

export default function Advanced() {
  const { state } = useLocation();
  const scanData = state?.scanData;

  console.log("SCAN DATA:", scanData);

  const [openVendors, setOpenVendors] = useState(true);
  const [openHash, setOpenHash] = useState(true);

  if (!scanData) {
    return (
      <div className="text-white p-10 text-center">
        <h2>No scan data received</h2>
      </div>
    );
  }

  const result = scanData.result || {};

  const getValue = (value) => {
    return value || "-";
  };

  const computed = scanData.computed_hashes || {};
  const md5 = computed.md5 || "-";
  const sha1 = computed.sha1 || "-";
  const sha256 = computed.sha256 || "-";

  const queriedHash =
    scanData.queried_hash_type === null || scanData.queried_hash === null
      ? "-"
      : scanData.queried_hash;

  const status =
    scanData?.result?.query_status === "hash_not_found"
      ? "-"
      : scanData?.result?.query_status || "-";


  return (
    <div className="min-h-screen bg-[#111] text-white px-6 py-10">
      {/* Logo */}
      <img
        src="/FullLogoBlack.png"
        alt="logo"
        className="h-14 sm:h-14 lg:h-20 w-50 ml-60 mb-20"
      />

      {/* MAIN WRAPPER */}
      <div className="max-w-5xl mx-auto bg-[#0d0d0d] rounded-xl p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)] w-full">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-green-500 font-semibold text-lg">
              Malware Analysis Report
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              📄 File Name: {scanData.file_name || result.file_name || "-"}
            </p>
          </div>

          <button className="bg-green-700 hover:bg-green-900 px-5 py-2 rounded-lg font-semibold flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-10 border-b border-gray-700 pb-3 mb-8">
          <Link
            to="/filestandard"
            className="text-gray-500 hover:text-gray-300 cursor-pointer"
          >
            Standard
          </Link>
          <span className="text-white font-semibold border-b-2 border-green-500">
            Advanced
          </span>
        </div>

        {/* Title */}
        <h1 className="text-green-500 font-semibold text-2xl mb-6">
          Malware Analysis Report
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Malware Family */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 text-center">
            <h3 className="text-gray-400 text-sm mb-2">Malware Family</h3>
            <img src="/icons/malware.svg" alt="" className="w-15 h-15" />
            <p className="text-xl font-semibold">{getValue(result.signature)}</p>
          </div>

          {/* Classification */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 text-center">
            <h3 className="text-gray-400 text-sm mb-2">Classification</h3>
            <img src="/icons/shapes.svg" alt="" className="w-15 h-15" />
            <p className="text-xl font-semibold">{getValue(result.classification)}</p>
          </div>

 {/* Vendor Detections */}
<div className="bg-[#111] p-5 rounded-xl border border-gray-800 col-span-1 lg:col-span-2">
  <div
    className="flex justify-between items-center mb-3 cursor-pointer"
    onClick={() => setOpenVendors(!openVendors)}
  >
    <h3 className="text-green-500 text-lg font-semibold">
      Vendor Detections
    </h3>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-red-500 text-red-500 font-bold">
        {Object.keys(result.vendors || {}).length}
      </div>
      <span className="text-gray-400 text-xl">{openVendors ? "▾" : "▸"}</span>
    </div>
  </div>

 {openVendors && (
  <table className="w-full text-sm text-gray-300">
    <thead className="text-gray-400">
      <tr>
        <th className="text-left py-2">Vendor</th>
        <th className="text-left py-2">Category</th>
        <th className="text-left py-2">Result</th>
        <th className="text-left py-2">Status</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(result.vendors || {}).map(([vendor, data]) => (
        <tr key={vendor} className="border-t border-gray-700">
          <td className="py-2">{vendor}</td>
          <td className="py-2">{data.malware_family ?? "-"}</td>
          <td className="py-2 text-red-400">{data.detection ?? "-"}</td>
          <td className="py-2">{data.status ?? "-"}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

</div>


          {/* Hashes */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 col-span-1 lg:col-span-2">
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => setOpenHash(!openHash)}
            >
              <h3 className="text-green-500 text-lg font-semibold">Hash Values</h3>
              <span className="text-gray-400 text-xl">{openHash ? "▾" : "▸"}</span>
            </div>

            {openHash && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HashItem title="SHA-256" value={sha256} />
                <HashItem title="SHA-1" value={sha1} />
                <HashItem title="MD5" value={md5} />
                <HashItem title="Queried Hash" value={queriedHash} />
                <HashItem title="Status" value={status} />
              </div>
            )}
          </div>

          {/* File Overview */}
          <InfoBox title="File Overview">
            <p>File Name: {scanData.file_name || result.file_name || "-"}</p>
            <p>File Type: {getValue(result.file_type)}</p>
            <p>File Size: {getValue(result.file_size)} bytes</p>
            <p>Mime Type: {getValue(result.file_type_mime)}</p>
          </InfoBox>

          {/* History */}
          <InfoBox title="History & Origin">
            <p>First Seen: {getValue(result.first_seen)}</p>
            <p>Last Seen: {getValue(result.last_seen)}</p>
            <p>Origin Country: {getValue(result.origin_country)}</p>
          </InfoBox>

          {/* Advanced Signatures */}
          <InfoBox title="Advanced Signatures" full>
            <p>Imphash: {getValue(result.imphash)}</p>
            <p>SSDeep: {getValue(result.ssdeep)}</p>
            <p>TLSH: {getValue(result.tlsh)}</p>
          </InfoBox>
        </div>
      </div>
    </div>
  );
}

function HashItem({ title, value }) {
  return (
    <div className="bg-[#0e0e0e] p-4 rounded-lg border border-gray-900">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="break-all">{value}</p>
    </div>
  );
}

function InfoBox({ title, children, full }) {
  return (
    <div
      className={`bg-[#111] p-5 rounded-xl border border-gray-800 ${
        full ? "col-span-2" : ""
      }`}
    >
      <h3 className="text-green-500 text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
