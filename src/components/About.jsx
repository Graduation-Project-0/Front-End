import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="relative flex min-h-screen w-full max-w-[100vw] flex-col items-center justify-center overflow-x-hidden bg-black p-6 font-sans text-white selection:bg-green-500/30 md:p-12 lg:py-24"
    >
      {/* Ambient Background Glows */}
      <div aria-hidden="true" className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#1E7D04]/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Subtle Background Watermark Shield */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
        <img
          src="/Big Logo.svg"
          alt=""
          className="w-[500px] max-w-none blur-[1px]"
        />
      </div>

      {/* Section Header */}
      <header className="relative z-10 mb-14 md:mb-20 text-center max-w-3xl mx-auto">
        <h2 className="landing-section-title text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white tracking-tight drop-shadow-[0_0_15px_rgba(30,125,4,0.4)] py-2">
          Guardians of The Digital Frontier
        </h2>
        <p className="mt-4 text-[#9ca3af] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          An AI-powered cybersecurity platform engineered to identify and
          neutralize sophisticated digital threats before they compromise your
          infrastructure.
        </p>
      </header>

      {/* Tactical 2-Column Grid */}
      <main className="relative z-10 mx-auto grid w-full min-w-0 max-w-5xl grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:gap-10">
        {/* Card 01: Proactive Threat Intelligence */}
        <div className="group relative flex flex-col justify-between rounded-2xl bg-black/40 border border-[#1E7D04]/25 p-8 sm:p-10 backdrop-blur-md transition-all duration-200 hover:border-[#1E7D04]/60 hover:bg-black/60 hover:shadow-[0_10px_30px_rgba(30,125,4,0.15)]">
          {/* Subtle Top Accent Line */}
          <div aria-hidden="true" className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#1E7D04]/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#22c55e] font-semibold tabular-nums">
                01 · TACTICAL CAPABILITIES
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E7D04]/20 border border-[#1E7D04]/40 px-2.5 py-0.5 text-xs font-medium text-[#4ade80]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                Active Analysis
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 leading-snug tracking-tight">
              Proactive Threat Intelligence
            </h3>

            <p className="text-[#9ca3af] leading-relaxed text-base">
              Vanguard combines machine learning algorithms with real-time
              diagnostic telemetry to identify zero-day anomalies, malicious
              file structures, and phishing domains instantly. We transform
              complex security data into clear, high-precision verdicts.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono tabular-nums tracking-wide text-[#9ca3af]/80">
            <span>Scan Engine v3.9</span>
            <span className="text-[#22c55e] transition-colors duration-200 group-hover:text-white">
              Sub-second detection →
            </span>
          </div>
        </div>

        {/* Card 02: Our Mission & Vision */}
        <div className="group relative flex flex-col justify-between rounded-2xl bg-black/40 border border-[#1E7D04]/25 p-8 sm:p-10 backdrop-blur-md transition-all duration-200 hover:border-[#1E7D04]/60 hover:bg-black/60 hover:shadow-[0_10px_30px_rgba(30,125,4,0.15)]">
          {/* Subtle Top Accent Line */}
          <div aria-hidden="true" className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#1E7D04]/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#22c55e] font-semibold tabular-nums">
                02 · DEFENSE MANDATE
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E7D04]/20 border border-[#1E7D04]/40 px-2.5 py-0.5 text-xs font-medium text-[#4ade80]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                Zero Complexity
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 leading-snug tracking-tight">
              Our Mission &amp; Vision
            </h3>

            <p className="text-[#9ca3af] leading-relaxed text-base">
              As cyberattacks grow in velocity and sophistication,
              enterprise-grade protection must not be locked behind impenetrable
              technical jargon. Our vision is to democratize elite
              cybersecurity—establishing Vanguard as an intuitive, authoritative
              first line of defense accessible to everyone.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono tabular-nums tracking-wide text-[#9ca3af]/80">
            <span>Deployment Architecture</span>
            <span className="text-[#22c55e] transition-colors duration-200 group-hover:text-white">
              Proactive protection →
            </span>
          </div>
        </div>
      </main>

      {/* Decorative Bottom Line */}
      <hr aria-hidden="true" className="mt-20 w-32 h-1 border-0 bg-gradient-to-r from-transparent via-[#1E7D04]/60 to-transparent" />
    </section>
  );
};

export default About;
