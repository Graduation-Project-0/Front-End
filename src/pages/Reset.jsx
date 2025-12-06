import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Reset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept":"application/json",
        },
        body: JSON.stringify({ email }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setSuccess("Reset link has been sent to your email.");
        setTimeout(() => navigate("/confirm"), 1000);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden animate-fadeUp">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[200px] opacity-40"></div>

      <div className="relative z-10 bg-[#111111]/70 backdrop-blur-md p-10 rounded-3xl shadow-[0_0_30px_rgba(0,255,0,0.1)] w-[90%] max-w-md text-center border border-green-800/30">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-gray-400 text-sm mb-8">
          Enter your email to receive a reset link.
        </p>

        <form onSubmit={handleReset}>
          <div className="text-left mb-5">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 focus:placeholder-transparent"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-3">{success}</p>}

          <button
            type="submit"
            className={`block w-full bg-gradient-to-r from-[#1E7D04] to-[#0A3301] py-3 rounded-full font-semibold text-white transition-all duration-300 shadow-[0_0_20px_rgba(30,125,4,0.3)]
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}
          `}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-8">
          Back to{" "}
          <Link to="/login" className="text-[#1E7D04] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
