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
      { threshold: 0.2 }
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
        min-h-screen
        w-full
        max-w-[100vw]
        flex-col-reverse
        items-center
        justify-center
        overflow-x-hidden
        px-4
        pt-10
        text-white
        sm:px-8
        md:flex-row
        md:px-20
        md:pt-0
      "
    >
      {/* LEFT TEXT */}
      <div
        className={`flex-1 
          text-center md:text-left 
          space-y-6 
          transform transition-all duration-1000 ease-out 
          ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}
        `}
      >
        <h1
          className="
            text-3xl sm:text-5xl md:text-6xl lg:text-7xl 
            font-bold 
            bg-gradient-to-r from-white to-[#025714] 
            bg-clip-text text-transparent 
            drop-shadow-[0_0_10px_rgba(30,125,4,0.3)]
          "
        >
          We protect your digital world before it’s attacked
        </h1>

        <p className="
          text-sm sm:text-base md:text-lg 
          text-gray-400 
          max-w-sm sm:max-w-md md:max-w-lg 
          mx-auto md:mx-0
        ">
          We build intelligent defense systems that predict threats, respond instantly, and keep you one step ahead in the digital battlefield.
        </p>

        {/* BUTTONS */}
        <div className="
          flex flex-col sm:flex-row 
          sm:space-x-4 space-y-3 sm:space-y-0 
          justify-center md:justify-start 
          pb-8
        ">
          <button
            type="button"
            onClick={handleGetStarted}
            className="cursor-pointer landing-section-title bg-gradient-to-r from-[#1E7D04] to-[#0A3301] text-white text-xl sm:text-2xl font-semibold px-10 py-3.5 rounded-full transition-all duration-300 hover:opacity-70 w-full sm:w-auto"
          >
            Get Started
          </button>

         
            <Link to="/#work" className="cursor-pointer landing-section-title border border-[#1E7D04] text-[#1E7D04] text-xl sm:text-2xl font-semibold px-10 py-3 rounded-full transition-all duration-300 hover:bg-[#025714] hover:text-white w-full sm:w-auto">
              How It Works
            </Link>
  
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div
        className={`mt-10 flex flex-1 justify-center md:mt-0 md:justify-end transform transition-all duration-1000 ease-out delay-200
          ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}
        `}
      >
        <img
          src="/virus.png"
          alt="Cyber virus"
          className="h-auto max-w-full object-contain animate-pulse [width:min(92vw,260px)] sm:[width:min(90vw,360px)] md:w-[520px] lg:w-[700px]"
        />
      </div>
    </section>
  );
}
