import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, ENDPOINTS } from "../config/endpoints";

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
      const response = await fetch(apiUrl(ENDPOINTS.FORGOT_PASSWORD), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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
    <section className="relative flex min-h-screen w-full max-w-[100vw] items-center justify-center overflow-x-hidden overflow-y-auto bg-gradient-to-b from-black via-[#0b160b] to-[#032004] py-10 text-white">
      <div className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-green-500/10 opacity-40 blur-[200px]" />

      <div className="relative z-10 flex w-full justify-center px-4 sm:px-6 md:px-8">
        <div className="animate-fadeUp w-full min-w-0 max-w-md shrink-0 rounded-2xl border border-[#1E7D04]/40 bg-[#111111]/70 p-8 text-center shadow-[0_0_25px_rgba(0,255,0,0.1)] backdrop-blur-md md:w-[min(28rem,100%)] md:p-10">
          <h2 className="mb-2 text-2xl font-semibold md:text-3xl">
            Reset Password
          </h2>
          <p className="mb-8 text-sm text-gray-400">
            Enter your email to receive a reset link.
          </p>

          <form onSubmit={handleReset}>
            <div className="mb-8 text-left">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border-b border-gray-700 bg-transparent px-4 py-2 text-gray-200 outline-none placeholder-gray-500 focus:border-[#1E7D04] focus:placeholder-transparent"
              />
            </div>

            {error && (
              <p className="mb-3 text-left text-sm text-red-500">{error}</p>
            )}
            {success && (
              <p className="mb-3 text-left text-sm text-green-400">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`block w-full cursor-pointer rounded-full bg-gradient-to-r from-[#1E7D04] to-[#0A3301] py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(30,125,4,0.3)] transition-all duration-300
            ${loading ? "cursor-not-allowed opacity-50" : "hover:opacity-80"}
          `}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-400">
            Back to{" "}
            <Link to="/login" className="text-[#1E7D04] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
