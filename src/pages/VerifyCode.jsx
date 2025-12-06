import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyCode = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Get real email
  const email = location.state?.email;

  // If no email was passed → redirect back
  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

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

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        if (data?.message) {
          setError(data.message);
          localStorage.setItem("isLoggedIn", "true");
navigate("/");
        } else {
          setError("Verification failed. Try again.");
        }
        return;
      }

     
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

   
      navigate("/", { replace: true });

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

        <div className="flex justify-center gap-2 md:gap-3 mb-6">
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
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </button>

        <div className="mt-4 text-sm text-gray-400">
          Didn't receive the code?
          <button
            className="text-green-500 hover:text-green-400 font-medium ml-1 transition-colors duration-200"
            disabled={loading}
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
