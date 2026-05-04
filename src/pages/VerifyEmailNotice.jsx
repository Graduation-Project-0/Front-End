import React from "react";
import { Mail } from "lucide-react"; 

export default function VerifyEmailNotice() {
  return (
    <div className="h-screen bg-black flex items-center justify-center text-white p-4">
      <div className="bg-[#111111] border border-[#1E7D04]/40 p-8 rounded-2xl text-center max-w-sm">
        <Mail className="w-16 h-16 text-[#1E7D04] mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2">Check your inbox!</h2>
        <p className="text-gray-400 mb-6">
          We've sent a verification link to your email. Please click the link to activate your account.
        </p>
        <div className="text-sm text-gray-500">
          Didn't receive it? <button className="text-[#1E7D04] hover:underline">Resend Email</button>
        </div>
      </div>
    </div>
  );
}