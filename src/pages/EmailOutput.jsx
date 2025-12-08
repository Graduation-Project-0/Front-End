import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";

const EmailOutput = ({ apiData }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let finalData = apiData;

    // لو مافيش apiData Props → خذ الداتا من sessionStorage
    if (!finalData) {
      const saved = sessionStorage.getItem("emailScanResult");
      if (saved) finalData = JSON.parse(saved);
    }

    if (finalData) setData(finalData.data);
  }, [apiData]);

  const isSpam = data?.prediction === "Spam";
  const spamScore = data?.confidence ?? (isSpam ? 80 : 20);

  return (
    <div className="min-h-screen bg-[#111] text-white px-4 sm:px-6 py-10">

      {/* Logo */}
      <img
        src="/FullLogoBlack.png"
        alt="logo"
        className="h-16 sm:h-20 w-40 sm:w-52 mb-10 mx-auto"
      />

      <div className="max-w-5xl mx-auto bg-[#0d0d0d] rounded-xl p-5 sm:p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)]">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <h2 className="text-green-500 font-semibold text-lg">
            Email Malware Analysis Report
          </h2>

          {/* Download All */}
          {data?.download_all_url && (
            <a
              href={data.download_all_url}
              className="bg-green-700 hover:bg-green-900 px-5 py-2 rounded-lg font-semibold flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download All
            </a>
          )}
        </div>

        {/* ----------- 2 BOXES (URLs + Files) ----------- */}
        {data ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
{/* URLs Box */}
<div className="bg-[#111] p-5 rounded-xl border border-gray-800">
  <h3 className="text-green-400 font-semibold mb-2">URLs ({data.num_urls})</h3>

  {data.urls.length === 0 ? (
    <p className="text-gray-400 text-sm">No URLs detected.</p>
  ) : (
    <ul className="text-gray-300 text-sm space-y-1">
      {data.urls.map((url, i) => (
        <li key={i} className="flex justify-between items-center break-all">
          {/* الرابط يؤدي لصفحة URL Page */}
          <a
            href={`/url?target=${encodeURIComponent(url)}`}
            className="text-green-400 underline hover:text-green-500"
          >
            {url}
          </a>
        </li>
      ))}
    </ul>
  )}
</div>

{/* Files Box */}
<div className="bg-[#111] p-5 rounded-xl border border-gray-800">
  <h3 className="text-green-400 font-semibold mb-2">Files ({data.num_files})</h3>

  {data.files.length === 0 ? (
    <p className="text-gray-400 text-sm">No files detected.</p>
  ) : (
    <ul className="text-gray-300 text-sm space-y-2">
      {data.files.map((file, i) => (
        <li key={i} className="flex justify-between items-center">
          <span
            className="text-green-400 underline hover:text-green-500 cursor-pointer"
            onClick={() => {
              // نروح لصفحة الفايل ونمرر رابط التحميل كـ query param
              window.location.href = `/file?target=${encodeURIComponent(file.download_url)}`;
            }}
          >
            {file.filename}
          </span>
          <a
            href={file.download_url}
            download
            className="text-green-400 underline hover:text-green-500"
          >
            Download
          </a>
        </li>
      ))}
    </ul>
  )}
</div>



          </div>
        ) : (
          <p className="text-gray-400 text-center mt-10">No scan data available. Please upload an email and scan to see results.</p>
        )}

        {/* ----------- Images Section ----------- */}
        {data?.images?.length > 0 && (
          <div className="bg-[#111] p-6 rounded-xl border border-gray-800 mt-8">
            <h3 className="text-green-400 font-semibold mb-3">
              Images ({data.num_images})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.images.map((img, i) => (
                <div key={i} className="bg-[#0e0e0e] p-3 rounded-lg text-center">
                  <p className="text-gray-300 text-sm mb-2">{img.filename}</p>
                  <img
                    src={`data:image/png;base64,${img.encoded_image}`}
                    alt={img.filename}
                    className="rounded-lg border border-gray-700"
                  />
                  <a
                    href={img.download_url}
                    className="text-green-400 underline text-sm block mt-2"
                  >
                    Download Image
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------- SPAM RESULT ----------- */}
        {data && (
          <div className="bg-[#111] rounded-xl p-10 mt-10 text-center">
            <h2
              className={`text-3xl font-bold mb-4 ${
                isSpam ? "text-red-500" : "text-green-500"
              }`}
            >
              {isSpam ? "This Email is Spam" : "This Email is Not Spam"}
            </h2>

            <p className="text-gray-300 max-w-xl mx-auto mb-10 text-sm">
              {isSpam
                ? "Warning: This email appears to be spam. It may contain harmful or phishing content."
                : "This email appears legitimate and safe. No harmful content detected."}
            </p>

            {/* Score Circle */}
            <div className="flex justify-center">
              <div
                className="w-40 h-40 rounded-full border-[10px] flex items-center justify-center"
                style={{ borderColor: isSpam ? "#ff0000" : "#00ff00" }}
              >
                <div>
                  <p className="text-3xl font-bold">{spamScore}%</p>
                  <p className="text-gray-400 text-sm">Spam Score</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmailOutput;
