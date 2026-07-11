import React from "react";
import { Link } from "react-router-dom";
import NavBrandLink from "./NavBrandLink";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaShieldAlt,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative w-full max-w-[100vw] overflow-x-hidden bg-[#000000] text-white border-t border-[#1E7D04]/40 shadow-[0_-4px_24px_rgba(30,125,4,0.15)]"
    >
      {/* Subtle Tactical Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-10">
        <div className="h-[450px] w-[450px] sm:h-[600px] sm:w-[600px] motion-safe:animate-spin-slow">
          <img
            src="/virus.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand & Tactical Status Column */}
          <div className="flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left">
            <div className="flex items-center justify-center lg:justify-start">
              <NavBrandLink />
            </div>

            {/* Live Security Status Badge */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#1E7D04]/50 bg-black/80 px-3.5 py-1.5 text-xs font-mono text-[#4ade80] shadow-[0_0_12px_rgba(30,125,4,0.25)]">
              <span className="h-2 w-2 rounded-full bg-[#4ade80] motion-safe:animate-pulse" />
              <span className="font-semibold tracking-wide">
                STATUS SECURE:
              </span>
              <span className="text-gray-300">TELEMETRY ACTIVE</span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400 sm:text-base">
              Your digital shield for instant threat detection, telemetry
              inspection, and zero-day defense across modern networks.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4 lg:gap-6">
            {/* Scanners */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-300">
                Scanners
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/file"
                    className="group flex items-center text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-[#4ade80] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-transparent motion-safe:transition-all motion-safe:duration-200 group-hover:w-1.5 group-hover:bg-[#4ade80]" />
                    <span>File Analyzer</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/url"
                    className="group flex items-center text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-[#4ade80] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-transparent motion-safe:transition-all motion-safe:duration-200 group-hover:w-1.5 group-hover:bg-[#4ade80]" />
                    <span>URL Scanner</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/email"
                    className="group flex items-center text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-[#4ade80] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-transparent motion-safe:transition-all motion-safe:duration-200 group-hover:w-1.5 group-hover:bg-[#4ade80]" />
                    <span>Email Check</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/plans"
                    className="group flex items-center text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-[#4ade80] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-transparent motion-safe:transition-all motion-safe:duration-200 group-hover:w-1.5 group-hover:bg-[#4ade80]" />
                    <span>Plans &amp; Pricing</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cockpit */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-300">
                Cockpit
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/#home"
                    className="group flex items-center text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-transparent motion-safe:transition-all motion-safe:duration-200 group-hover:w-1.5 group-hover:bg-[#1E7D04]" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#about"
                    className="group flex items-center text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-transparent motion-safe:transition-all motion-safe:duration-200 group-hover:w-1.5 group-hover:bg-[#1E7D04]" />
                    <span>About Vanguard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#services"
                    className="group flex items-center text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-transparent motion-safe:transition-all motion-safe:duration-200 group-hover:w-1.5 group-hover:bg-[#1E7D04]" />
                    <span>Capabilities</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="group flex items-center text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-transparent motion-safe:transition-all motion-safe:duration-200 group-hover:w-1.5 group-hover:bg-[#1E7D04]" />
                    <span>Contact Support</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-300">
                Legal
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/privacy"
                    className="group flex items-center text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-transparent motion-safe:transition-all motion-safe:duration-200 group-hover:w-1.5 group-hover:bg-[#1E7D04]" />
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="group flex items-center text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-transparent motion-safe:transition-all motion-safe:duration-200 group-hover:w-1.5 group-hover:bg-[#1E7D04]" />
                    <span>Terms of Service</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="group flex items-center text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-transparent motion-safe:transition-all motion-safe:duration-200 group-hover:w-1.5 group-hover:bg-[#1E7D04]" />
                    <span>Security Notice</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Direct Support & Socials */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-300">
                Direct Support
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="tel:01022894416"
                    className="flex items-center gap-2.5 text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-[#4ade80] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <FaPhoneAlt className="shrink-0 text-xs text-[#1E7D04]" />
                    <span>01022894416</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@Vanguard.com"
                    className="flex items-center gap-2.5 text-gray-400 motion-safe:transition-colors motion-safe:duration-200 hover:text-[#4ade80] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                  >
                    <FaEnvelope className="shrink-0 text-xs text-[#1E7D04]" />
                    <span className="truncate">info@Vanguard.com</span>
                  </a>
                </li>
                <li className="pt-2">
                  <div className="flex items-center gap-3">
                    {[
                      { Icon: FaFacebookF, label: "Facebook" },
                      { Icon: FaInstagram, label: "Instagram" },
                      { Icon: FaLinkedinIn, label: "LinkedIn" },
                    ].map(({ Icon, label }, idx) => (
                      <a
                        key={idx}
                        href="#"
                        aria-label={label}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 motion-safe:transition-all motion-safe:duration-250 ease-[var(--ease-out-quart)] hover:border-[#1E7D04] hover:bg-[#1E7D04]/20 hover:text-[#4ade80] hover:shadow-[0_0_12px_rgba(30,125,4,0.35)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04]"
                      >
                        <Icon className="text-sm" />
                      </a>
                    ))}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cockpit Status Bar (Footer Bottom) */}
      <div className="relative z-10 border-t border-[#1E7D04]/20 bg-[#0c0c0c]/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 font-mono text-xs text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>
              © {currentYear} Vanguard Cyber Cockpit. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-gray-500 sm:gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1E7D04]" />
              <span className="text-gray-400">OLED Mode</span>
            </span>
            <span>•</span>
            <span className="text-gray-400">v3.9.1</span>
            <span>•</span>
            <span className="text-gray-400">Encrypted TLS 1.3</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
