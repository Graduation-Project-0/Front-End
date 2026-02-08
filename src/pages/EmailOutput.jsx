import React, { useState, useEffect } from "react";
import { Download, ChevronDown, ChevronUp } from "lucide-react"; // ضفت أيقونات جديدة

const EmailOutput = ({ apiData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllUrls, setShowAllUrls] = useState(false); // حالة الـ Read More

  useEffect(() => {
    let finalData = apiData;
    if (!finalData) {
      const saved = sessionStorage.getItem("emailScanResult");
      if (saved) {
        try {
          finalData = JSON.parse(saved);
        } catch (err) {
          console.error("Error parsing email data:", err);
        }
      }
    }
    if (finalData) {
      setData(finalData.data || finalData);
    }
    setTimeout(() => setLoading(false), 500);
  }, [apiData]);

  const isSpam = data?.prediction === "Spam";
  const spamScore = data?.confidence ?? (data ? (isSpam ? 80 : 20) : 0);
  const numUrls = data?.num_urls ?? 0;
  const numFiles = data?.num_files ?? 0;
  const numImages = data?.num_images ?? 0;
  const urls = data?.urls || [];
  const files = data?.files || [];
  const images = data?.images || [];

  // تحديد الروابط اللي هتظهر (أول 5 لو مش ضاغط Read More)
  const displayedUrls = showAllUrls ? urls : urls.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-10">

      <div className="max-w-5xl mx-auto bg-[#0d0d0d] rounded-xl p-5 sm:p-8 shadow-[0_0_25px_rgba(0,255,0,0.1)]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <h2 className="text-green-500 font-semibold text-lg">
            Email Malware Analysis Report
          </h2>
          {data?.download_all_url ? (
            <a href={data.download_all_url} className="bg-green-700 hover:bg-green-900 px-5 py-2 rounded-lg font-semibold flex items-center transition-colors">
              <Download className="w-5 h-5 mr-2" /> Download Report
            </a>
          ) : (
            <button className="bg-gray-800 text-gray-500 px-5 py-2 rounded-lg font-semibold flex items-center cursor-not-allowed opacity-50">
              <Download className="w-5 h-5 mr-2" /> Download Report
            </button>
          )}
        </div>

        {/* ----------- 2 BOXES ----------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* URLs Box مع خاصية Read More */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800 flex flex-col">
            <h3 className="text-green-400 font-semibold mb-2">URLs ({numUrls})</h3>
            {urls.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No URLs detected.</p>
            ) : (
              <>
                <ul className="text-gray-300 text-sm space-y-1">
                  {displayedUrls.map((url, i) => (
                    <li key={i} className="flex justify-between items-center break-all p-1 hover:bg-white/5 rounded">
                      <a href={`/url?target=${encodeURIComponent(url)}`} className="text-green-400 underline hover:text-green-500">
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
                
                {/* زرار Read More بيظهر فقط لو الروابط أكتر من 5 */}
                {urls.length > 5 && (
                  <button 
                    onClick={() => setShowAllUrls(!showAllUrls)}
                    className="mt-3 text-green-500 text-xs font-bold flex items-center hover:text-green-400 transition-colors self-start"
                  >
                    {showAllUrls ? (
                      <><ChevronUp className="w-4 h-4 mr-1" /> Show Less</>
                    ) : (
                      <><ChevronDown className="w-4 h-4 mr-1" /> Read More ({urls.length - 5} more)</>
                    )}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Files Box */}
          <div className="bg-[#111] p-5 rounded-xl border border-gray-800">
            <h3 className="text-green-400 font-semibold mb-2">Files ({numFiles})</h3>
            {files.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No files detected.</p>
            ) : (
              <ul className="text-gray-300 text-sm space-y-2">
                {files.map((file, i) => (
                  <li key={i} className="flex justify-between items-center p-1 hover:bg-white/5 rounded">
                    <span
                      className="text-green-400 underline hover:text-green-500 cursor-pointer"
                      onClick={() => window.location.href = `/file?target=${encodeURIComponent(file.download_url)}`}
                    >
                      {file.filename}
                    </span>
                    <a href={file.download_url} download className="text-green-400 underline hover:text-green-500 ml-2">
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* باقي السكشنز (Images & Spam Result) تفضل زي ما هي */}
        {/* ... (نفس الكود اللي فات بدون تغيير) ... */}
        
        {/* ----------- Images Section ----------- */}
        <div className="bg-[#111] p-6 rounded-xl border border-gray-800 mt-8">
          <h3 className="text-green-400 font-semibold mb-3">Images ({numImages})</h3>
          {images.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-4">No embedded images found in this email.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div key={i} className="bg-[#0e0e0e] p-3 rounded-lg text-center">
                  <p className="text-gray-300 text-sm mb-2 truncate">{img.filename}</p>
                  <img src={`data:image/png;base64,${img.encoded_image}`} alt={img.filename} className="rounded-lg border border-gray-700 mx-auto max-h-48 object-contain" />
                  <a href={img.download_url} className="text-green-400 underline text-sm block mt-2 hover:text-green-300">Download Image</a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ----------- SPAM RESULT ----------- */}
        <div className="bg-[#111] rounded-xl p-10 mt-10 text-center shadow-inner">
          <h2 className={`text-3xl font-bold mb-4 ${!data ? "text-gray-600" : isSpam ? "text-red-500" : "text-green-500"}`}>
            {!data ? "Waiting for Scan..." : isSpam ? "This Email is Spam" : "This Email is Not Spam"}
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-10 text-sm">
            {!data ? "The result of the spam analysis..." : isSpam ? "Warning: This email..." : "This email appears legitimate..."}
          </p>
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-full border-[10px] flex items-center justify-center transition-all duration-500" style={{ borderColor: !data ? "#333" : isSpam ? "#ff0000" : "#00ff00" }}>
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