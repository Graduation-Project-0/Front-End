import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; 

const HowItWorks = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How is Vanguard different from traditional antivirus software?",
      answer: "Traditional antivirus solutions mainly rely on signature-based detection and focus on executable files only.\n\nVanguard goes beyond that by using AI-driven analysis to detect unknown threats, analyze code, scan URLs and emails, inspect Python libraries, and even detect hidden malicious data inside media files — all without executing suspicious content."
    },
    {
      question: "Does Vanguard rely on running files to detect threats?",
      answer: "No. Vanguard follows a static-first analysis approach.\n\nFiles, code, emails, and media are analyzed without execution, preventing accidental activation of malicious payloads and keeping the user’s system safe during inspection."
    },
    {
      question: "Can Vanguard detect zero-day and previously unseen attacks?",
      answer: "Yes. Vanguard uses a hybrid AI framework combining deep learning and traditional machine learning.\n\nThis allows the system to recognize malicious patterns and anomalies rather than relying only on known signatures, making it effective against zero-day and emerging threats."
    },
    {
      question: "What types of threats can Vanguard detect?",
      answer: "Vanguard protects against a wide range of threats, including:\n\n• Malware and malicious executables\n• Phishing and malicious URLs\n• Email-based attacks and social engineering\n• Vulnerable and malicious code\n• Compromised Python libraries (supply-chain attacks)\n• Hidden data and steganographic payloads in images, audio, and video\n\nAll results are correlated through a centralized analysis system for deeper insight."
    },
    {
      question: "Who is Vanguard designed for?",
      answer: "Vanguard is built for users who need more than basic protection:\n\n• Developers and IT professionals dealing with code and dependencies\n• Security-conscious individuals handling sensitive data\n• Small and medium-sized businesses (SMBs) that need enterprise-level protection without enterprise complexity."
    }
  ];

  return (
    <section
      id="work"
      className="flex w-full max-w-[100vw] items-center justify-center overflow-x-hidden bg-black px-4 pb-12 pt-8 text-white sm:px-6 md:p-20"
    >
      <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-2">
        
        {/* Left Side: Header & Image */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="landing-section-title py-2 text-center text-4xl font-bold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(74,222,128,0.3)] md:text-left md:text-5xl">
              How It Works
            </h1>
            <p className="mx-auto max-w-md text-lg leading-relaxed text-gray-400 md:mx-0">
              Security is a process, not a product. Learn everything you need to 
              know about taking the right steps to reach your destination.
            </p>
          </div>

          <div className="relative group ">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  bg-green-500/10 blur-[120px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
            <img 
              src="/laptop.png" 
              alt="Vanguard Dashboard on Laptop" 
            className="relative z-10 mx-auto h-auto w-full max-w-full transform transition-transform duration-700 ease-out drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] scale-100 sm:scale-105 md:scale-110 lg:w-[60%] lg:scale-100 xl:scale-105"
            />
          </div>
        </div>

        {/* Right Side: Accordion */}
        <div className="space-y-6 "> 
         
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-green-900/70 rounded-2xl overflow-hidden bg-zinc-950/80 backdrop-blur-md transition-all duration-300 hover:border-green-500/60"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left transition-colors"
              >
                <span className={`font-semibold text-lg pr-4 transition-colors ${openIndex === index ? 'text-green-400' : 'text-gray-200'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`text-green-500 shrink-0 transition-transform duration-500 ease-in-out ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                  size={24}
                />
              </button>
              
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 border-t border-green-900/20">
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;