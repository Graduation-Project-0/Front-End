import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiUrl, ENDPOINTS } from "../config/endpoints";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setStatusCode(null);
    setLoading(true);

    try {
      try {
        localStorage.setItem("pendingName", name);
        localStorage.setItem("pendingEmail", email);
      } catch {
        /* ignore */
      }
      const response = await fetch(apiUrl(ENDPOINTS.REGISTER), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      setStatusCode(response.status);

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        if (data.token) {
          login({
            token: data.token,
            email: data?.user?.email || email,
            name: data?.user?.name || name,
          });
        }
        navigate("/verify-email-notice");
      } else {
        setError(data.message || "Registration failed. Please check your data.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full max-w-[100vw] items-center justify-center overflow-x-hidden bg-black pb-10 pt-20 text-white">
      <div className="flex w-full justify-center px-4 sm:px-6 md:px-8">
        <div className="w-full min-w-0 max-w-md shrink-0 rounded-2xl border border-[#1E7D04]/40 bg-[#111111]/70 p-8 text-center shadow-[0_0_25px_rgba(0,255,0,0.1)] backdrop-blur-md md:w-[min(28rem,100%)] md:p-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-white">Create Account</h2>
        <p className="text-gray-400 text-sm mb-8">Fill your info below to create a new account.</p>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="text-left">
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 transition-all"
            />
          </div>

          <div className="text-left">
            <input
              type="email"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 transition-all"
            />
          </div>

          <div className="text-left">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 transition-all"
            />
          </div>

          <div className="text-left">
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-2 rounded text-red-500 text-xs">{error}</div>
          )}

          {statusCode && (
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">
              Server Response: <span className="text-[#1E7D04]">{statusCode}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-[#1E7D04] to-[#0A3301] py-3 rounded-full font-semibold text-white transition-all duration-300 shadow-[0_0_20px_rgba(30,125,4,0.3)] ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-grow h-px bg-gray-800"></div>
          <span className="px-3 text-gray-500 text-xs uppercase tracking-tighter">Or Register With</span>
          <div className="flex-grow h-px bg-gray-800"></div>
        </div>

        <div className="flex justify-center space-x-4">
          {[FaGoogle, FaFacebookF, FaTwitter].map((Icon, index) => (
            <button
              key={index}
              type="button"
              className="bg-[#0e0e0e] border border-gray-800 hover:border-[#1E7D04] hover:text-[#1E7D04] p-3 rounded-xl transition-all duration-300"
            >
              <Icon size={18} />
            </button>
          ))}
        </div>

        <p className="mt-10 text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="ml-1 font-bold text-[#1E7D04] hover:underline">
            Login
          </Link>
        </p>
        </div>
      </div>
    </section>
  );
}
