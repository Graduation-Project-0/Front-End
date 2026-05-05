import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Assuming you use your auth hook
import { apiUrl, ENDPOINTS } from "../config/endpoints";

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
      const response = await fetch(apiUrl(ENDPOINTS.VERIFY_OTP), {
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
        const pendingName = (() => {
          try {
            return localStorage.getItem("pendingName") || "";
          } catch {
            return "";
          }
        })();
        login({ token: data.token, email: email, name: data?.user?.name || pendingName || "User" }); 
        try {
          localStorage.removeItem("pendingName");
        } catch {
          // ignore
        }
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
    <section className="relative flex min-h-screen w-full max-w-[100vw] items-center justify-center overflow-x-hidden overflow-y-auto bg-gradient-to-b from-black via-[#0b160b] to-[#032004] py-10 text-white">
      <div className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-green-500/10 opacity-40 blur-[200px]" />

      <div className="relative z-10 flex w-full justify-center px-4 sm:px-6 md:px-8">
        <div className="w-full min-w-0 max-w-md shrink-0 rounded-2xl border border-[#1E7D04]/40 bg-[#111111]/70 p-8 text-center shadow-[0_0_25px_rgba(0,255,0,0.1)] backdrop-blur-md md:w-[min(28rem,100%)] md:p-10">
          <h2 className="mb-2 text-2xl font-semibold text-white md:text-3xl">
            Verify your code
          </h2>

          <p className="mb-8 text-sm text-gray-400">
            Enter the passcode sent to your email:
            <br />
            <span className="break-words font-medium text-[#1E7D04]">{email}</span>
          </p>

          <div
            className="mb-8 flex justify-center gap-2 md:gap-3"
            onPaste={handlePaste}
          >
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-11 w-11 rounded-md border border-gray-700 bg-transparent text-center text-lg font-semibold text-gray-200 transition focus:border-[#1E7D04] focus:outline-none md:h-12 md:w-12 md:text-xl"
                inputMode="numeric"
              />
            ))}
          </div>

          {error && (
            <p className="mb-4 text-left text-sm text-red-500">{error}</p>
          )}

          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className={`block w-full cursor-pointer rounded-full bg-gradient-to-r from-[#1E7D04] to-[#0A3301] py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(30,125,4,0.3)] transition-all duration-300
            ${loading ? "cursor-not-allowed opacity-50" : "hover:opacity-80"}`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <p className="mt-8 text-sm text-gray-400">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              className="font-medium text-[#1E7D04] transition-colors hover:underline"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VerifyCode;