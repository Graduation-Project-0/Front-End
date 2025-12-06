import React, { useRef, useEffect, useState } from "react";

export default function About() {
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
      id="about"
      className="min-h-screen flex flex-col md:flex-row justify-center items-center text-white px-6 md:px-20"
    >
      <div className="max-w-7xl w-full bg-[#0D0D0D]/80 border border-[#1E7D04]/40 rounded-2xl p-15 flex flex-col md:flex-row items-center md:space-x-6 shadow-[0_0_20px_rgba(30,125,4,0.15)] overflow-hidden">
        
        {/* text*/}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(74,222,128,0.3)]">
            Protect Your world
          </h2>

          <p className="text-gray-400 leading-relaxed text-[20px]">
            Vanguard is an intelligent cybersecurity platform that uses advanced AI 
            to detect and prevent digital threats across files, code, and media. 
            It provides a unified, real-time protection system that continuously 
            learns and adapts to new risks, making strong security simple, smart, 
            and accessible for everyone.
          </p>
        </div>

        <div
          className={`flex-1 flex flex-col items-center md:items-end mt-10 md:mt-0 transform transition-all duration-1000 ease-out delay-200 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          }`}
        >
          {/* original */}
          <img
            src="/character.png"
            alt="Cyber protector"
            className="w-[380px] md:w-[420px] object-contain drop-shadow-[0_0_25px_rgba(30,125,4,0.5)]"
          />

          {/*reflection*/}
          <div className="relative w-[380px] md:w-[420px] h-[180px] overflow-hidden mt-[-100px]">
            <img
              src="/character.png"
              alt="Reflection sword"
              className=" scale-y-[-1] opacity-60 brightness-125 blur-[1.2px]"
              style={{
                transformOrigin: "",
                clipPath: "inset(76%  0 0)", 
              }}
            />
            <div className="absolute inset-0  from-transparent via-black/40 to-black/90"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
