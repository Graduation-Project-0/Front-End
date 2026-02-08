import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Services() {
  const services = [
    {
      icon: "/icons/upload.svg",
      title: "File Analyzer",
      desc: "Vanguard analyzes files in real time to detect malware, hidden risks, and malicious content before it reaches your system.",
      link: "/file",
    },
    {
      icon: "/icons/link.svg",
      title: "Secure Link",
      desc: "Vanguard analyzes URLs in real time to detect malicious patterns, phishing attempts, and hidden risks.",
      link: "/url",
    },
    {
      icon: "/icons/email.svg",
      title: "Email Check",
      desc: "Vanguard scans every email in real time to detect phishing attempts and hidden risks before they reach your inbox.",
      link: "/email",
    },
  ];

  return (
    <section
      id="services"
      className="min-h-screen py-20 text-white relative overflow-hidden to-black px-6 md:px-40"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(74,222,128,0.3)]">
          Advanced Security Services
        </h2>
        <p className="text-gray-400 mt-3">
          Professional threat protection with cutting-edge scanning technology
        </p>
      </div>

      {/* Responsive Grid */}
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3
          gap-10 
          max-w-7xl 
          mx-auto 
          px-2
        "
      >
        {services.map((service, index) => (
          <SingleCard key={index} service={service} index={index} />
        ))}
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
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cardContent = (
    <div
      ref={ref}
      className={`relative text-center bg-[#0a0a0a]/90 border border-[#1E7D04]/40 rounded-2xl 
        p-8 w-full shadow-[0_0_25px_rgba(0,255,0,0.08)] 
        hover:shadow-[0_0_40px_rgba(0,255,0,0.3)] 
        transition-all duration-700 ease-out transform cursor-pointer
        flex flex-col justify-between
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{
        transitionDelay: `${index * 150}ms`,
        minHeight: "360px",
        maxWidth: "620px",
        margin: "0 auto",
      }}
    >
      {/* Glow Aura */}
      <div className="absolute -inset-6 rounded-3xl bg-green-900 blur-[80px] opacity-25 animate-[pulseGlow_4s_ease-in-out_infinite]"></div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-semibold mb-5">{service.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {service.desc}
          </p>
        </div>

        <img
          src={service.icon}
          alt={service.title}
          className="w-24 h-24 mx-auto mt-auto object-contain opacity-90 hover:opacity-100 transition-all duration-300 animate-[floatIcon_2s_ease-in-out_infinite]"
        />
      </div>
    </div>
  );

  return service.link ? (
    <Link to={service.link} className="block">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}
