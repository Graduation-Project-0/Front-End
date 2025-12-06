import React from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

export default function UrlAdvanced() {
  const scanResultAdvanced = JSON.parse(sessionStorage.getItem("scanResultAdvanced"));
  const _scanResultStandard = JSON.parse(sessionStorage.getItem("scanResultStandard"));

  if (!scanResultAdvanced?.data) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center text-white">
        <p>No scan data found. Please scan a URL first.</p>
      </div>
    );
  }

  const data = scanResultAdvanced.data;

  return (
    <div className="min-h-screen bg-[#111] text-white px-6 py-10">
      <img src="/FullLogoBlack.png" alt="logo" className="h-14 sm:h-14 lg:h-20 w-50 ml-45 mb-10" />

      <div className="max-w-6xl mx-auto bg-[#0d0d0d] rounded-xl p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)] w-full">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-green-500 font-semibold text-lg">Malware Analysis Report</h2>
          <button className="bg-green-700 hover:bg-green-900 px-5 py-2 rounded-lg font-semibold flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-10 border-b border-gray-700 pb-3 mb-8">
          <Link to="/urlstandard" className="text-gray-500 hover:text-gray-300 cursor-pointer">Standard</Link>
          <span className="text-white font-semibold border-b-2 border-green-500">Advanced</span>
        </div>

   {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Summary */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">Summary</h3>

            {data.summary ? (
              <p className="text-gray-300 text-sm leading-relaxed">{data.summary}</p>
            ) : (
              <p className="text-gray-500 text-sm">No summary available.</p>
            )}

            <p className="text-gray-400 text-sm mt-4">
              {data.tls_certificate?.text
                ? data.tls_certificate.text
                : "No TLS certificate information found."}
            </p>
          </div>

          {/* Screenshot */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">Screenshot</h3>

            {data.screenshot_url ? (
              <img
                src={data.screenshot_url}
                alt="screenshot"
                className="w-full rounded-lg border border-gray-700"
              />
            ) : (
              <p className="text-gray-500 text-sm">No screenshot available.</p>
            )}
          </div>

          {/* IP Addresses */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">IP Addresses</h3>

            {data.ip_addresses?.length ? (
              data.ip_addresses.map((ip, idx) => (
                <div key={idx} className="text-gray-300 text-sm flex items-center gap-3 mb-2">
                  <span>{ip.ip || ip.value}</span>
                  {ip.type && (
                    <span className="px-2 py-0.5 text-xs rounded bg-gray-800 text-gray-400">
                      {ip.type}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No IP addresses found.</p>
            )}
          </div>

          {/* Domains */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">Domains</h3>

            {data.domains?.length ? (
              data.domains.map((d, idx) => (
                <div key={idx} className="text-gray-300 text-sm flex items-center gap-3 mb-2">
                  <span>{d.domain || d.name}</span>
                  {d.type && (
                    <span className="px-2 py-0.5 text-xs rounded bg-gray-800 text-gray-400">
                      {d.type}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No domains found.</p>
            )}
          </div>

          {/* Scan History + Verdict */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 col-span-1 lg:col-span-2 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">Scan History</h3>

            <p className="text-gray-300 text-sm mb-3">
              {data.scan_history || "No scan history recorded."}
            </p>

            <p className="text-gray-300 text-sm">
              <span className="text-green-400 font-semibold">Verdict:</span>{" "}
              {data.verdict?.text || "No verdict available."}
            </p>
          </div>

          {/* Redirect URLs */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 col-span-1 lg:col-span-2 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">Redirect URLs</h3>

            {data.redirected_requests?.length ? (
              data.redirected_requests.map((url, i) => (
                <p key={i} className="text-gray-300 text-sm mb-1">{url}</p>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No redirect URLs found.</p>
            )}
          </div>

          {/* JavaScript Variables */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 col-span-1 lg:col-span-2 shadow-[0_0_20px_rgba(0,255,0,0.10)]">
            <h3 className="text-green-400 font-semibold mb-3">JavaScript Variables</h3>

            {data.javascript_variables?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-700">
                      <th className="py-2">Variable Name</th>
                      <th className="py-2">Type</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.javascript_variables.map((v, i) => (
                      <tr key={i} className="text-gray-300 text-sm border-b border-gray-800">
                        <td className="py-2">{v.name}</td>
                        <td className="py-2">{v.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No JavaScript variables found.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
