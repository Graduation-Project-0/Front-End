import React, { useState, useEffect, useRef } from "react";

const steps = [
  {
    title: "Instant Analysis",
    desc: "Scan, analyze, and detect threats instantly with AI-powered precision.",
    side: "left",
  },
  {
    title: "Submit Your Content",
    desc: "Upload or paste anything — our intelligent engine auto-detects type and analyzes securely.",
    side: "right",
  },
  {
    title: "Choose Your Service",
    desc: "Select between File, Email, or Link scanning — all processed with real-time defense.",
    side: "left",
  },
];

export default function HowItWorks() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState([]);

  const refs = useRef([]);

  useEffect(() => {
    const handleMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setTimeout(() => {
              setVisible((prev) => {
                const updated = [...prev];
                updated[i] = true;
                return updated;
              });
            }, i * 400); 
            observer.unobserve(el);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((obs) => obs && obs.disconnect());
  }, []);

  return (
    <section
      id="work"
      className="relative text-gray-200 py-28 px-6 overflow-hidden font-inter"
    >
      {/*cursor glow */}
      <div
        className="pointer-events-none fixed -z-0 h-96 w-96 rounded-full bg-green-500 opacity-10 blur-3xl"
        style={{
          left: mouse.x - 200,
          top: mouse.y - 200,
          transition: "transform 0.2s ease-out",
        }}
      ></div>

      {/* text*/}
      <header className="relative z-10 text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(74,222,128,0.3)]">
          How It Works
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-base md:text-lg">
          Security is a process, not a product. Learn everything you need to
          know about taking the right steps to reach your destination.
        </p>
      </header>

      {/*  main line */}
      <div className="relative max-w-6xl mx-auto flex justify-center">
        <div className="absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#1E7D04] via-green-500/80 to-[#1E7D04] shadow-[0_0_25px_rgba(30,125,4,0.7)]"></div>

        <div className="flex flex-col space-y-40 w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => (refs.current[index] = el)}
              className={`relative flex ${
                step.side === "left"
                  ? "justify-start md:pr-[55%]"
                  : "justify-end md:pl-[55%]"
              }`}
            >
              {/* card*/}
              <div
                className={`relative bg-[#0a0a0a]/90 border border-[#1E7D04]/40 rounded-2xl p-8 w-full md:w-[380px] shadow-[0_0_25px_rgba(0,255,0,0.08)] hover:shadow-[0_0_40px_rgba(0,255,0,0.3)] transition-all duration-700 ease-out transform
                  ${
                    visible[index]
                      ? "opacity-100 translate-x-0"
                      : step.side === "left"
                      ? "opacity-0 -translate-x-16"
                      : "opacity-0 translate-x-16"
                  }`}
              >
                <h3 className="text-2xl font-semibold text-green-400 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* lines*/}
              <div
                className={`absolute top-1/2 w-[25%] h-[2px] bg-gradient-to-l from-green-400/70 to-transparent shadow-[0_0_15px_rgba(74,222,128,0.6)] hidden md:block ${
                  step.side === "left" ? "left-[25%]" : "right-[25%] rotate-180"
                }`}
              ></div>

              {/* circles */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 w-5 h-5 rounded-full bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.7)] border border-white/10 hidden md:block"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
