import React, { useRef, useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), 400); 
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
    <footer
      ref={ref}
      id="contact"
      className={`bg-custom-gradient relative overflow-hidden text-white py-12 px-6 md:px-20 border-t border-[#1E7D04]/30 
      transform transition-all duration-[1200ms] ease-out
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {/* virus background*/}
      <div className=" absolute inset-0 overflow-hidden">
        <div className="absolute w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] opacity-[0.3] animate-virusMove">
          <img
            src="/virus.png"
            alt="virus"
            className="w-full h-full object-contain animate-spin-slow"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-20 text-center md:text-left">
        {/* Logo & Description */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start">
 <div className="flex items-center space-x-2 sm:space-x-3">
        <img src="/FullLogoBlack.png" alt="logo" className="h-14 sm:h-14 lg:h-20 w-50" />

      </div>   
          <p className="text-gray-400 text-md leading-relaxed max-w-xs mx-auto md:mx-0">
            Your digital shield for instant threat detection and secure data
            analysis.
          </p>
        </div>

        {/* Columns */}
        <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-10 md:w-2/3 text-sm">
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-[#1E7D04]">Services</h3>
            <ul className="space-y-2 text-gray-400">
              {["File Analyzer", "Secure Link", "Email Check"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors duration-200 hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-[#1E7D04]">Regions</h3>
            <ul className="space-y-2 text-gray-400">
              {["Egypt", "Dubai & UAE", "Europe", "Africa"].map((region) => (
                <li key={region}>
                  <a href="#" className="transition-colors duration-200 hover:text-white">
                    {region}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-[#1E7D04]">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex justify-center md:justify-start items-center space-x-2">
                <FaPhoneAlt className="text-[#1E7D04]" />
                <a href="tel:01022894416" className="transition-colors duration-200 hover:text-white">
                  01022894416
                </a>
              </li>
              <li className="flex justify-center md:justify-start items-center space-x-2">
                <FaEnvelope className="text-[#1E7D04]" />
                <a href="mailto:info@Vanguard.com" className="transition-colors duration-200 hover:text-white">
                  info@Vanguard.com
                </a>
              </li>
              <li className="flex justify-center md:justify-start space-x-4 pt-2">
                {[FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-gray-400 hover:text-[#1E7D04] transition-colors duration-200"
                  >
                    <Icon />
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className=" relative z-10 border-t border-[#1E7D04]/20 mt-10 pt-6 text-center text-gray-500 text-sm">
        © 2026 Vanguard. All rights reserved.
      </div>

    </footer>
  );
}
