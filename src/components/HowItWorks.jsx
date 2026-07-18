import React, { useState } from "react";
import {
  ChevronDown,
  ShieldCheck,
  Cpu,
  FileCode,
  CheckCircle2,
  Terminal,
  Activity,
  Sparkles,
  ArrowRight,
  Lock
} from "lucide-react";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);

  const steps = [
    {
      id: "01",
      title: "Static Telemetry Ingestion",
      badge: "Zero-Execution • 0ms",
      icon: FileCode,
      description:
        "Ingest binary executables, source code, URLs, emails, and media files without mounting payloads to system execution memory or running subroutines.",
      telemetry: {
        status: "STATIC_SANDBOX_LOCKED",
        latency: "1.2ms",
        metrics: [
          { label: "File Ingested", value: "payload_update.bin (2.4 MB)" },
          { label: "SHA-256 Hash", value: "8f4e9a0b3c21d8e7f6a5b4c3d2e1..." },
          { label: "Execution Privilege", value: "ISOLATED (No Execution)" },
          { label: "Header Entropy", value: "6.12 / 8.00 (Nominal Range)" }
        ],
        checks: [
          "Binary header signature verification complete",
          "Zero execution threads mounted to OS kernel",
          "Memory sandbox isolation boundary confirmed secure"
        ]
      }
    },
    {
      id: "02",
      title: "Deep Neural & AST Analysis",
      badge: "24 Neural Layers • Hybrid ML",
      icon: Cpu,
      description:
        "Correlate opcode sequences, Abstract Syntax Trees (AST), supply-chain dependency graphs, and steganographic media anomalies in real time.",
      telemetry: {
        status: "NEURAL_ENGINE_ACTIVE",
        latency: "18.4ms",
        metrics: [
          { label: "Core Model", value: "Vanguard Hybrid-ML v3.9" },
          { label: "Neural Layers", value: "24 / 24 Layers Evaluated" },
          { label: "Dependency Tree", value: "412 Python/Node packages scanned" },
          { label: "Anomaly Score", value: "0.01% Malware Probability" }
        ],
        checks: [
          "Opcode sequence pattern matched against 45M zero-day vectors",
          "AST semantic analysis detected no obfuscated eval/shell calls",
          "Steganographic frequency domain clear of hidden payloads"
        ]
      }
    },
    {
      id: "03",
      title: "Centralized Threat Verdict",
      badge: "Status Secure • Instant Verdict",
      icon: ShieldCheck,
      description:
        "Generate high-fidelity diagnostic reports with MITRE ATT&CK mapping, clear risk scoring, and actionable remediation pathways.",
      telemetry: {
        status: "STATUS_SECURE",
        latency: "4.1ms",
        metrics: [
          { label: "Final Verdict", value: "CLEAN & SECURE" },
          { label: "Risk Score", value: "0 / 100 (No Threat Detected)" },
          { label: "MITRE ATT&CK", value: "0 TTPs Detected" },
          { label: "Correlation ID", value: "REV-2026-0710-X9" }
        ],
        checks: [
          "Signature cryptographic certificate verified valid",
          "No lateral movement or C2 exfiltration behaviors observed",
          "Telemetry report generated & logged to immutable audit trail"
        ]
      }
    }
  ];

  const faqs = [
    {
      question: "How is Vanguard different from traditional antivirus software?",
      tag: "Static vs. Dynamic",
      answer:
        "Traditional antivirus solutions mainly rely on signature-based detection and focus on executable files only after or during execution.\n\nVanguard goes beyond that by using a static-first AI framework to detect unknown threats, analyze code, scan URLs and emails, inspect Python libraries, and even detect hidden malicious data inside media files — all without executing suspicious content."
    },
    {
      question: "Does Vanguard rely on running files to detect threats?",
      tag: "Zero-Execution",
      answer:
        "No. Vanguard follows a strict static-first analysis approach.\n\nFiles, code, emails, and media are analyzed without execution, preventing accidental activation of malicious payloads and keeping the user’s system safely isolated during inspection."
    },
    {
      question: "Can Vanguard detect zero-day and previously unseen attacks?",
      tag: "Hybrid AI Engine",
      answer:
        "Yes. Vanguard uses a hybrid AI framework combining deep learning and traditional machine learning.\n\nThis allows the system to recognize structural anomalies and opcode patterns rather than relying only on known signatures, making it highly effective against zero-day and emerging supply-chain threats."
    },
    {
      question: "What types of threats and vectors can Vanguard inspect?",
      tag: "Multi-Vector Defense",
      answer:
        "Vanguard protects against a wide spectrum of threat vectors, including:\n\n• Malware and binary executables (.exe, .dll, .bin)\n• Phishing, homograph domains, and malicious URLs\n• Email-based attacks and social engineering headers\n• Vulnerable and obfuscated source code\n• Compromised Python/Node libraries (supply-chain poisoning)\n• Hidden data and steganographic payloads in images, audio, and video\n\nAll results are correlated through a centralized analysis engine for comprehensive visibility."
    },
    {
      question: "Who is Vanguard specifically designed for?",
      tag: "Enterprise & Devs",
      answer:
        "Vanguard is built for high-security environments and users who need more than basic legacy AV:\n\n• Developers and IT engineers auditing code, packages, and dependencies\n• Security-conscious organizations handling sensitive intellectual property\n• Small and medium-sized businesses (SMBs) needing enterprise-grade threat intelligence without complex deployment overhead."
    }
  ];

  const currentStep = steps[activeStep];

  return (
    <section
      id="work"
      className="relative w-full overflow-hidden bg-black px-4 py-20 text-white sm:px-6 md:py-28 lg:px-8 font-sans"
    >
      {/* Ambient Tactical Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-green-500/10 blur-[140px] opacity-60" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 h-[300px] w-[400px] rounded-full bg-[#1E7D04]/10 blur-[120px] opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-24">
        {/* Header Block */}
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1E7D04]/60 bg-black/80 backdrop-blur-md shadow-[0_0_15px_rgba(30,125,4,0.3)]">
            <Activity className="h-4 w-4 text-green-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-green-300">
              Tactical Architecture & Workflow
            </span>
          </div>

          <h1 className="landing-section-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(30,125,4,0.4)]">
            How It Works
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-gray-400">
            Security is a rigorous technical process, not a static checkpoint. Explore Vanguard’s zero-execution analysis pipeline and discover how multi-layered AI protects every asset.
          </p>
        </div>

        {/* Part 1: The 3-Step Interactive Threat Inspection Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 3 Tactical Steps */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-green-500" />
              <span>Select Inspection Stage</span>
            </h3>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 relative group ${
                    isActive
                      ? "bg-zinc-950/90 border-[#1E7D04] shadow-[0_0_20px_rgba(30,125,4,0.25)]"
                      : "bg-black/40 border-green-900/40 hover:border-green-700/60 hover:bg-black/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl border transition-colors ${
                          isActive
                            ? "bg-green-500/20 border-green-500 text-green-400"
                            : "bg-white/5 border-green-900/50 text-gray-400 group-hover:text-green-300"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-green-500">
                          Stage {step.id}
                        </span>
                        <h4
                          className={`text-lg font-bold transition-colors ${
                            isActive ? "text-white" : "text-gray-200"
                          }`}
                        >
                          {step.title}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium whitespace-nowrap ${
                        isActive
                          ? "bg-[#1E7D04]/30 border-green-500/60 text-green-300"
                          : "bg-black/60 border-green-900/40 text-gray-400"
                      }`}
                    >
                      {step.badge}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-gray-400 pl-1">
                    {step.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Telemetry Cockpit Box */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#1E7D04]/50 bg-[#0c0c0c] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
              {/* Cockpit Window Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-green-900/30 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono text-gray-400 pl-2 border-l border-green-900/40">
                    VANGUARD_TELEMETRY // STAGE_{currentStep.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-mono font-semibold text-green-400">
                    {currentStep.telemetry.status}
                  </span>
                </div>
              </div>

              {/* Top Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {currentStep.telemetry.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-black/60 border border-green-900/40"
                  >
                    <div className="text-xs uppercase tracking-wider text-gray-400">
                      {metric.label}
                    </div>
                    <div className="text-sm font-semibold text-gray-200 font-mono mt-1 truncate">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulated Terminal Log */}
              <div className="p-5 rounded-xl bg-black/80 border border-green-900/50 font-mono text-xs sm:text-sm space-y-3">
                <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-green-900/30">
                  <span>&gt; DIAGNOSTIC_CHECKS // ACTIVE_LAYER</span>
                  <span className="text-green-500">LATENCY: {currentStep.telemetry.latency}</span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {currentStep.telemetry.checks.map((check, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-gray-300">
                      <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{check}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cockpit Action Bar */}
              <div className="mt-6 pt-6 border-t border-green-900/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Lock size={14} className="text-green-500" />
                  <span>Zero code execution guaranteed by static sandbox</span>
                </div>

                <button
                  onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                  className="rounded-full bg-gradient-to-r from-[#1E7D04] to-[#0A3301] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0_0_12px_rgba(30,125,4,0.4)]"
                >
                  <span>Advance Stage</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Elevated FAQ Inspection Console */}
        <div className="space-y-10 pt-8">
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#1E7D04]/50" />
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#1E7D04]/50 bg-black/80 shadow-[0_0_12px_rgba(30,125,4,0.2)]">
              <Sparkles className="h-4 w-4 text-green-400" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-green-300">
                Frequently Asked Technical Queries
              </span>
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#1E7D04]/50" />
          </div>

          <div className="mx-auto max-w-4xl space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "border-[#1E7D04] bg-zinc-950/90 shadow-[0_0_20px_rgba(30,125,4,0.15)]"
                      : "border-green-900/60 bg-zinc-950/60 hover:border-green-500/60 hover:bg-zinc-950/80"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-semibold uppercase px-2.5 py-1 rounded-full bg-black/60 border border-green-900/50 text-green-400 shrink-0">
                        {faq.tag}
                      </span>
                      <span
                        className={`font-semibold text-base sm:text-lg transition-colors ${
                          isOpen ? "text-green-300" : "text-gray-200"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>

                    <div
                      className={`p-1.5 rounded-full border transition-all duration-300 shrink-0 ${
                        isOpen
                          ? "bg-green-500/20 border-green-500 text-green-400 rotate-180"
                          : "bg-white/5 border-green-900/50 text-gray-400"
                      }`}
                    >
                      <ChevronDown size={20} />
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-6 pt-0 border-t border-green-900/20">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
