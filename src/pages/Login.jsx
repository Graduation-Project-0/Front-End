import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiUrl, authRedirectUrl, ENDPOINTS } from "../config/endpoints";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSocialLogin = (provider) => {
    window.location.href = authRedirectUrl(provider);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl(ENDPOINTS.LOGIN), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        if (data.token) {
          const pendingName = (() => {
            try {
              return localStorage.getItem("pendingName") || "";
            } catch {
              return "";
            }
          })();
          const userData = {
            id: data.user_id || "guest",
            email,
            name: data?.user?.name || data?.name || pendingName || "User",
            token: data.token,
          };
          login(userData);
          try {
            localStorage.removeItem("pendingName");
          } catch {
            /* ignore */
          }
        }
        navigate("/verify", { state: { email } });
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex justify-center items-center from-black via-[#0b160b] to-[#032004] text-white px-4 py-10 overflow-y-auto">
      <div className="bg-[#111111]/70 backdrop-blur-md border border-[#1E7D04]/40 rounded-2xl shadow-[0_0_25px_rgba(0,255,0,0.1)] p-8 md:p-10 w-full max-w-md text-center animate-fadeUp">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Welcome Back, <span className="text-[#1E7D04]">Vanguard</span>
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          We are excited to have you back. Log in now and access your account.
        </p>

        <form onSubmit={handleLogin}>
          <div className="text-left mb-10">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 focus:placeholder-transparent"
            />
          </div>

          <div className="text-left mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 focus:placeholder-transparent"
            />
            <div className="text-right mt-2">
              <Link to="/reset" className="text-xs text-[#1E7D04] hover:underline">
                Forget Password?
              </Link>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`cursor-pointer block w-full bg-gradient-to-r from-[#1E7D04] to-[#0A3301] py-3 rounded-full font-semibold text-white transition-all duration-300 shadow-[0_0_20px_rgba(30,125,4,0.3)]
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}
            `}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="px-3 text-gray-400 text-sm">Or Login With</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="cursor-pointer bg-[#0e0e0e] border border-gray-700 hover:border-[#1E7D04] hover:text-[#1E7D04] p-3 rounded-lg transition-all duration-300"
          >
            <FaGoogle size={18} />
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("facebook")}
            className="cursor-pointer bg-[#0e0e0e] border border-gray-700 hover:border-[#1E7D04] hover:text-[#1E7D04] p-3 rounded-lg transition-all duration-300"
          >
            <FaFacebookF size={18} />
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("twitter")}
            className="cursor-pointer bg-[#0e0e0e] border border-gray-700 hover:border-[#1E7D04] hover:text-[#1E7D04] p-3 rounded-lg transition-all duration-300"
          >
            <FaTwitter size={18} />
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-8">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#1E7D04] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}
