import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Assuming you use your auth hook

const VerifyCode = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const { login } = useAuth(); // To update the global auth state

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  // --- NEW: Handle Copy-Paste ---
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6); // Take first 6 chars
    if (!/^\d+$/.test(pasteData)) return; // Only allow numbers

    const newCode = [...code];
    pasteData.split("").forEach((char, index) => {
      if (index < 6) newCode[index] = char;
    });
    setCode(newCode);

    // Focus the last input or the next empty one
    const lastIndex = Math.min(pasteData.length, 5);
    inputsRef.current[lastIndex].focus();
  };

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) inputsRef.current[index + 1].focus();
      if (error) setError("");
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1].focus();
    } 
    // --- NEW: Handle Enter Key to Submit ---
    else if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, code: enteredCode }),
      });

      let data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message || "Verification failed. Try again.");
        return;
      }

      // --- CRITICAL: Use your login function to set context & localStorage ---
      if (data?.token) {
        login({ token: data.token, email: email }); 
        navigate("/", { replace: true });
      } 

    } catch (err) {
      console.error(err);
      setError("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-green-500/10 blur-[200px] opacity-40"></div>

      <div className="relative z-10 bg-[#111111]/90 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-[0_0_30px_rgba(30,125,4,0.3)] w-[90%] max-w-md text-center border border-green-800/50">
        <h2 className="text-3xl font-extrabold mb-2 text-white">Verify your code</h2>

        <p className="text-gray-400 text-sm mb-8">
          Enter the passcode sent to your email:
          <br />
          <span className="text-green-400 font-medium">{email}</span>
        </p>

        {/* Input Group */}
        <div className="flex justify-center gap-2 md:gap-3 mb-6" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-10 md:w-12 md:h-12 text-center text-xl font-semibold rounded-xl bg-black/40 border border-green-800/30 text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200"
              inputMode="numeric"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-6">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full bg-gradient-to-r from-[#1E7D04] to-[#0A3301] py-3 rounded-full font-semibold text-white transition-all duration-300 shadow-[0_0_20px_rgba(30,125,4,0.3)]
            ${loading ? "opacity-60 cursor-not-allowed flex items-center justify-center" : "hover:from-[#249605] hover:to-[#0B4001]"}`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="mt-4 text-sm text-gray-400">
          Didn't receive the code?
          <button className="text-green-500 hover:text-green-400 font-medium ml-1 transition-colors duration-200">
            Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;