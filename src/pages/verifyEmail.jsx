import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import api from "../api/axios";
import { ENDPOINTS } from "../config/endpoints";

export default function EmailVerified() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // قراءة البارامترات من الـ URL
  const isFailed = searchParams.get("failed") === "true";
  const messageFromUrl = searchParams.get("message");

  useEffect(() => {
    // 1. إذا كان الرابط يحتوي على فشل من البداية
    if (isFailed) {
      setLoading(false);
      setErrorMsg(messageFromUrl || "Verification failed. Please try again.");
      return;
    }

    // 2. إذا لم يكن هناك فشل، نقوم بعملية التحقق العادية
    const verifyEmailOnServer = async () => {
      try {
        await api.get(ENDPOINTS.ME);
        setLoading(false);
        setTimeout(() => navigate("/dashboard"), 2000);
      } catch (err) {
        setLoading(false);
        setErrorMsg(
          err?.response
            ? "Could not verify user. Please login again."
            : "Network error occurred."
        );
      }
    };

    verifyEmailOnServer();
  }, [isFailed, messageFromUrl, navigate]);

  return (
    <div className="h-screen bg-black flex items-center justify-center text-white p-6">
      <div className="text-center max-w-md">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#1E7D04] animate-spin" />
            <p className="animate-pulse text-[#1E7D04] font-medium">Verifying your email...</p>
          </div>
        ) : errorMsg ? (
          // عرض رسالة الخطأ في حالة failed=true
          <div className="animate-in fade-in duration-500">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-500 mb-2">Verification Failed</h2>
            <p className="text-gray-400 mt-2">Please try again</p>
            <p className="text-gray-400 bg-red-500/10 border border-red-500/20 py-2 px-4 rounded-lg italic">
              "{errorMsg}"
            </p>
            <button 
              onClick={() => navigate("/login")}
              className="mt-6 text-sm text-gray-500 hover:text-white underline underline-offset-4"
            >
              Back to Login
            </button>
          </div>
        ) : (
          // عرض رسالة النجاح
          <div className="animate-in zoom-in duration-500">
            <CheckCircle className="w-20 h-20 text-[#1E7D04] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white">Email Verified!</h2>
            <p className="text-gray-400 mt-2">Everything looks good. Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}