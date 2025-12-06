import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(null); // 👈 نضيف state جديد
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setStatusCode(null);


    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept":"application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });

    

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        navigate("/login");
      } else {
        setError(
          data.message 
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center from-black via-[#0b160b] to-[#032004] text-white px-4 mt-15">
      <div className="bg-[#111111]/70 backdrop-blur-md border border-[#1E7D04]/40 rounded-2xl shadow-[0_0_25px_rgba(0,255,0,0.1)] p-8 md:p-10 w-full max-w-md text-center animate-fadeUp">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Create Account
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Fill your info below to create a new account.
        </p>

        <form onSubmit={handleSignup}>
          {/* Name */}
          <div className="text-left mb-10">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 focus:placeholder-transparent"
           
            />
          </div>

          {/* Email */}
          <div className="text-left mb-10">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 focus:placeholder-transparent"
             
            />
          </div>

          {/* Password */}
          <div className="text-left mb-10">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 focus:placeholder-transparent"
             
            />
          </div>

          {/* Confirm Password */}
          <div className="text-left mb-6">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 focus:placeholder-transparent"
             
            />
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Status code */}
          {statusCode && (
            <p className="text-gray-400 text-xs mb-4">
              Status:{" "}
              <span className="text-[#1E7D04] font-semibold">
                {statusCode}
              </span>
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-[#1E7D04] to-[#0A3301] py-3 rounded-full font-semibold text-white transition-all duration-300 shadow-[0_0_20px_rgba(30,125,4,0.3)] ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
            }`}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="px-3 text-gray-400 text-sm">Or Login With</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>

        {/* Social buttons */}
        <div className="flex justify-center space-x-4">
          {[FaGoogle, FaFacebookF, FaTwitter].map((Icon, index) => (
            <button
              key={index}
              className="bg-[#0e0e0e] border border-gray-700 hover:border-[#1E7D04] hover:text-[#1E7D04] p-3 rounded-lg transition-all duration-300"
            >
              <Icon size={18} />
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-[#1E7D04] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
