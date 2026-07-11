import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Hero() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate({ pathname: "/", hash: "services" });
    } else {
      navigate("/login");
    }
  };

  const handleHowItWorks = (e) => {
    const el =
      document.getElementById("work") ||
      document.getElementById("how-it-works");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="home"
      className="
        mx-auto
        flex
        min-h-[calc(100vh-3.5rem)]
        w-full
        max-w-[100vw]
        flex-col
        items-center
        justify-center
        overflow-x-hidden
        px-4
        pt-24
        pb-8
        text-white
        sm:px-8
        sm:pt-28
        sm:pb-10
        md:flex-row
        md:px-16
        md:pt-24
        md:pb-12
        gap-8
        lg:px-20
        lg:gap-12
      "
    >
      {/* LEFT TEXT CONTAINER */}
      <div
        className={`flex-1 
          text-center md:text-left 
          space-y-4 sm:space-y-5
          transform transition-all duration-1000 ease-out 
          ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}
        `}
      >
        {/* STATUS PROOF BADGE */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0c0c0c] border border-[#1E7D04]/60 shadow-[0_0_18px_rgba(30,125,4,0.3)] text-xs sm:text-sm font-medium text-gray-300 tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e] shadow-[0_0_8px_#22c55e]"></span>
          </span>
          <span className="text-white font-semibold tracking-wider font-mono">
            STATUS: VIGILANT
          </span>
          <span className="text-[#22c55e] border-l border-[#1E7D04]/40 pl-2 hidden sm:inline">
            Autonomous Threat Shield Active
          </span>
        </div>

        {/* HEADLINE — BOLD, HIGH CONTRAST */}
        <h1
          className="
            landing-section-title
            text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[4.25rem]
            font-extrabold tracking-tight leading-[1.08]
            bg-gradient-to-r from-white via-white to-[#4ade80] 
            bg-clip-text text-transparent 
            drop-shadow-[0_0_25px_rgba(34,197,94,0.35)]
          "
        >
          We protect your digital world before it’s attacked
        </h1>

        {/* VALUE PROPOSITION */}
        <p
          className="
            text-sm sm:text-base md:text-lg 
            text-gray-300 
            max-w-lg sm:max-w-xl 
            mx-auto md:mx-0
            leading-relaxed
            font-normal
          "
        >
          We build intelligent defense systems that predict threats, respond
          instantly, and keep you one step ahead in the digital battlefield.
        </p>

        {/* HIGH-LEGIBILITY PILL BUTTONS */}
        <div
          className="
            flex flex-col sm:flex-row 
            sm:space-x-4 space-y-3 sm:space-y-0 
            justify-center md:justify-start 
            pt-1
          "
        >
          <button
            type="button"
            onClick={handleGetStarted}
            className="cursor-pointer bg-gradient-to-r from-[#1E7D04] via-[#22c55e] to-[#1E7D04] bg-[length:200%_auto] text-white text-base sm:text-lg font-bold px-8 py-3.5 rounded-full shadow-[0_4px_22px_rgba(30,125,4,0.55)] hover:shadow-[0_0_32px_rgba(34,197,94,0.85)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2.5 group"
          >
            <span>Get Started</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          <Link
            to="/#work"
            onClick={handleHowItWorks}
            className="cursor-pointer border-2 border-[#1E7D04]/80 bg-black/50 backdrop-blur-md text-[#22c55e] text-base sm:text-lg font-semibold px-8 py-3.5 rounded-full shadow-[0_2px_12px_rgba(30,125,4,0.25)] hover:bg-[#1E7D04]/25 hover:border-[#22c55e] hover:text-white hover:shadow-[0_0_25px_rgba(30,125,4,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto flex items-center justify-center text-center"
          >
            How It Works
          </Link>
        </div>

        {/* TACTICAL TELEMETRY PROOF STRIP */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-5 sm:pt-6 border-t border-[#1E7D04]/30 max-w-lg mx-auto md:mx-0">
          <div className="text-center md:text-left">
            <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight">
              99.99<span className="text-[#22c55e]">%</span>
            </div>
            <div className="text-[11px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">
              Threat Intercept
            </div>
          </div>
          <div className="text-center md:text-left border-x border-[#1E7D04]/25 px-3 sm:px-6">
            <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight">
              &lt;1<span className="text-[#22c55e]">ms</span>
            </div>
            <div className="text-[11px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">
              Response Time
            </div>
          </div>
          <div className="text-center md:text-left pl-2 sm:pl-0">
            <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight">
              24/7
            </div>
            <div className="text-[11px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">
              Autonomous Guard
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE CONTAINER — COCKPIT SCANNER PEDESTAL */}
      <div
        className={`mt-2 flex flex-1 justify-center md:mt-0 md:justify-end transform transition-all duration-1000 ease-out delay-200
          ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}
        `}
      >
        <div className="relative group cursor-pointer flex items-center justify-center">
          {/* Tactical emerald pedestal glow */}
          <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#1E7D04]/25 via-[#22c55e]/15 to-transparent blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Illustration with precise float and interactive hover lift */}
          <img
            src="/virus.png"
            alt="Cyber virus illustration"
            className="relative h-auto max-h-[42vh] sm:max-h-[50vh] md:max-h-[65vh] max-w-full object-contain animate-[floatIcon_6s_ease-in-out_infinite] group-hover:scale-[1.04] group-hover:drop-shadow-[0_0_40px_rgba(34,197,94,0.65)] transition-all duration-700 [width:min(75vw,260px)] sm:[width:min(65vw,340px)] md:w-[400px] lg:w-[540px]"
          />
        </div>
      </div>
    </section>
  );
}
