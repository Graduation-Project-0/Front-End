import React, { useRef, useEffect, useState } from "react";

export default function Hero() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

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
      id="hero"
      className="
        min-h-screen 
        flex 
        flex-col-reverse 
        md:flex-row 
        justify-center 
        items-center 
        text-white 
        px-4 sm:px-8 md:px-20
        pt-10 md:pt-0
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
          <button className="cursor-pointer bg-gradient-to-r from-[#1E7D04] to-[#0A3301] text-white text-lg font-semibold px-10 py-3 rounded-full transition-all duration-300 hover:opacity-70 w-full sm:w-auto">
            Get Started
          </button>

          <a href="#work">
            <button className="cursor-pointer border border-[#1E7D04] text-[#1E7D04] text-lg font-semibold px-10 py-3 rounded-full transition-all duration-300 hover:bg-[#025714] hover:text-white w-full sm:w-auto">
              How It Works
            </button>
          </a>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div
        className={`flex-1 flex justify-center md:justify-end mt-10 md:mt-0 transform transition-all duration-1000 ease-out delay-200 
          ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}
        `}
      >
 <img src="/virus.png" alt="Cyber virus" className=" w-[260px] sm:w-[360px] md:w-[520px] lg:w-[700px] object-contain animate-pulse " />
      </div>
    </section>
  );
}
