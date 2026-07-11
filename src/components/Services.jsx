import { ArrowRight, ShieldCheck, Terminal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Services() {
  const services = [
    {
      icon: "/icons/upload.svg",
      title: "File Analyzer",
      desc: "Vanguard analyzes files in real time to detect malware, hidden risks, and malicious content before it reaches your system.",
      link: "/file",
      badge: "File Scan",
      engine: "DEEPSCAN v4.2",
      metric: "< 12ms",
      target: "Binaries, PDFs & Archives",
    },
    {
      icon: "/icons/link.svg",
      title: "Secure Link",
      desc: "Vanguard analyzes URLs in real time to detect malicious patterns, phishing attempts, and hidden risks.",
      link: "/url",
      badge: "URL Scan",
      engine: "PHISHGUARD",
      metric: "REAL-TIME DNS",
      target: "Phishing & C2 Domains",
    },
    {
      icon: "/icons/email.svg",
      title: "Email Check",
      desc: "Vanguard scans every email in real time to detect phishing attempts and hidden risks before they reach your inbox.",
      link: "/email",
      badge: "Email Scan",
      engine: "MAILSHIELD",
      metric: "ZERO-DAY AI",
      target: "Spoofing & Malicious Payloads",
    },
  ];

  return (
    <section
      id="services"
      className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-black px-4 pt-28 pb-24 text-white sm:px-6 md:px-20 lg:px-40"
    >
      {/* Section Header with Tactical Command Eyebrow */}
      <div className="mx-auto mb-20 max-w-4xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1E7D04]/40 bg-[#1E7D04]/10 px-4 py-1.5 text-xs font-mono font-bold tracking-[0.2em] text-[#22c55e] uppercase">
          <Terminal className="h-3.5 w-3.5 shrink-0 animate-pulse text-[#22c55e]" />
          <span>Threat Interception Modules // Active</span>
        </div>
        <h2 className="landing-section-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-normal text-white">
          Advanced Security Services
        </h2>
        <p className="mt-5 text-base sm:text-lg lg:text-xl font-medium text-gray-300 max-w-2xl mx-auto leading-relaxed tracking-[0.01em]">
          Professional threat protection powered by real-time heuristic scanning
          and military-grade deep inspection.
        </p>
      </div>

      {/* High-Impact 3-Column Grid */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {services.map((service, index) => (
          <SingleCard key={index} service={service} index={index} />
        ))}
      </div>

      {/* Commanding System Telemetry Bar (Full-Width Diagnostic Console) */}
      <div className="mx-auto mt-16 max-w-7xl rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 sm:p-8 transition-all duration-200 hover:border-[#1E7D04] hover:bg-[#0e0e0e] hover:shadow-[0_4px_32px_rgba(30,125,4,0.2)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75 motion-reduce:animate-none"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#22c55e]"></span>
            </span>
            <div>
              <div className="text-sm font-bold tracking-wide text-white uppercase font-mono">
                System Telemetry:{" "}
                <span className="text-[#22c55e]">
                  All Nodes Armed & Vigilant
                </span>
              </div>
              <div className="text-xs font-medium text-gray-400 mt-0.5">
                Real-time scanning cluster synchronized across global inspection
                checkpoints
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10 lg:pt-0 lg:border-t-0 font-mono text-xs">
            <div>
              <div className="text-gray-500 uppercase font-semibold">
                Inspection Nodes
              </div>
              <div className="text-sm font-bold tabular-nums text-white mt-1">
                3 / 3 ONLINE
              </div>
            </div>
            <div>
              <div className="text-gray-500 uppercase font-semibold">
                Engine Latency
              </div>
              <div className="text-sm font-bold tabular-nums text-[#22c55e] mt-1">
                &lt; 15ms AVG
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-gray-500 uppercase font-semibold">
                Signature DB
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-200 mt-1">
                <ShieldCheck className="h-4 w-4 text-[#22c55e] shrink-0" />
                <span>v2026.07 // LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SingleCard({ service, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.15 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cardContent = (
    <div
      ref={ref}
      className={`relative flex flex-col justify-between h-full w-full rounded-2xl bg-[#0c0c0c] border border-white/15 p-6 sm:p-8 transition-all duration-200 ease-out group-hover:border-[#1E7D04] group-hover:bg-[#111111] group-hover:shadow-[0_8px_36px_rgba(30,125,4,0.25)] group-active:scale-[0.99] group-active:border-[#22c55e] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Top Row: Decisive Icon Frame & Primed Status Badge */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/15 group-hover:border-[#1E7D04] group-hover:bg-[#1E7D04]/20 transition-all duration-200">
            <img
              src={service.icon}
              alt={service.title}
              width={28}
              height={28}
              className="h-7 w-7 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 motion-reduce:transform-none"
            />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3.5 py-1.5 text-xs font-bold tabular-nums tracking-widest text-gray-300 border border-white/15 uppercase group-hover:text-white group-hover:border-[#1E7D04] group-hover:bg-[#1E7D04]/10 transition-all duration-200">
            <span className="h-2 w-2 rounded-full bg-gray-500 group-hover:bg-[#22c55e] transition-colors duration-200" />
            <span>{service.badge}</span>
          </span>
        </div>

        {/* Middle Block: Crisp Telemetry Title & Description */}
        <div className="text-left">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug mb-3 group-hover:text-[#22c55e] transition-colors duration-200">
            {service.title}
          </h3>
          <p className="text-sm font-medium leading-relaxed text-gray-400 tracking-[0.01em] group-hover:text-gray-300 transition-colors duration-200">
            {service.desc}
          </p>

          {/* High-Density Tactical Readout Box (Bolder Information Architecture) */}
          <div className="mt-6 rounded-xl bg-black/60 border border-white/[0.08] p-3.5 text-left font-mono text-xs transition-colors duration-200 group-hover:border-[#1E7D04]/50">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/[0.06]">
              <div>
                <span className="text-gray-500 block text-xs tracking-wider font-semibold uppercase">
                  Engine
                </span>
                <span className="text-gray-200 font-bold tracking-wide mt-0.5 block">
                  {service.engine}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs tracking-wider font-semibold uppercase">
                  Latency
                </span>
                <span className="text-[#22c55e] font-bold tabular-nums mt-0.5 block">
                  {service.metric}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <span className="text-gray-500 text-xs tracking-wider font-semibold uppercase mr-1.5">
                Target:
              </span>
              <span className="text-gray-300 font-medium">
                {service.target}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Cockpit Action Bar with High-Impact Arrow */}
      <div className="mt-8 pt-4 border-t border-white/10 group-hover:border-[#1E7D04]/40 flex items-center justify-between text-xs sm:text-sm font-bold tracking-wide text-gray-300 group-hover:text-[#22c55e] transition-colors duration-200">
        <span className="flex items-center gap-1.5">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#1E7D04] font-mono font-bold">
            [
          </span>
          <span>Launch Scanner</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#1E7D04] font-mono font-bold">
            ]
          </span>
        </span>
        <span className="transform group-hover:translate-x-1.5 transition-transform duration-200 motion-reduce:transform-none">
          <ArrowRight className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-[#22c55e] transition-colors duration-200" />
        </span>
      </div>
    </div>
  );

  return service.link ? (
    <Link
      to={service.link}
      aria-label={`Launch ${service.title} Scanner`}
      className="group block w-full h-full min-h-[44px] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04] focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-200"
    >
      {cardContent}
    </Link>
  ) : (
    <div className="group block w-full h-full min-h-[44px]">{cardContent}</div>
  );
}
