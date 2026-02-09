import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
const PlanDropdown = ({ hasOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("3 Devices | 1 year");

  const options = [
    "3 Devices | 1 year",
    "5 Devices | 1 year",
    "Unlimited | 2 years"
  ];

  // Placeholder to maintain card height for Free plan
  if (!hasOptions) return <div className="h-12 mb-6 mt-4 invisible" />;
  return (
    <div className="relative mb-6 mt-4 w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#111] border-2 ${isOpen ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'border-gray-800'} 
        rounded-xl py-3 px-4 text-[10px] text-gray-300 flex justify-between items-center cursor-pointer transition-all duration-300`}
      >
        <span>{selected}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-full bg-[#0d0d0d] border-2 border-green-500/50 rounded-xl overflow-hidden z-50 shadow-2xl">
          {options.map((option, i) => (
            <div 
              key={i}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className="px-4 py-3 text-[10px] text-gray-400 hover:bg-green-900/30 hover:text-green-400 cursor-pointer transition-colors border-b border-gray-900 last:border-0 flex justify-between items-center"
            >
              {option}
              {option === selected && <Check size={10} className="text-green-500" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Plans = () => {
  // Plan data based on the provided image details
  const plans = [
    {
      name: "Free",
      icon: null,
      features: [
        "URL Scanning (Limited)",
        "File Scanning (Limited)",
        "Basic Dashboard"
      ],
      buttonText: "Get Started",
      hasOptions: false,
    },
    {
      name: "Basic",
      icon: null, // Icon removed as requested
      features: [
        "URL Scanning (Semi-Unlimited)",
        "File Scanning (Semi-Unlimited)",
        "Email Scanning (Limited)",
        "Browser Extension (Limited)",
        "Code Scanning (Desk)",
        "Basic Report"
      ],
      buttonText: "Buy Now",
      hasOptions: true,
    },
    {
      name: "Essential",
      icon: "/icons/plan3.svg",
      features: [
        "URL Scanning (Less Unlimited)",
        "File Scanning (Less Unlimited)",
        "Email Scanning (Limited)",
        "Browser Extension (Limited)",
        "Code & Library Scanning (Desk)",
        "File Real Time",
        "Basic Report"
      ],
      buttonText: "Buy Now",
      hasOptions: true,
    },
    {
      name: "Premium",
      icon: "/icons/plan2.svg",
      features: [
        "URL Scanning (Unlimited)",
        "File Scanning (Unlimited)",
        "Email Scanning (Unlimited)",
        "Browser Extension",
        "Code & Library Scanning (Desk)",
        "File Real Time",
        "Full Security Report",
        "Stagno Analysis (Desk)"
      ],
      buttonText: "Buy Now",
      hasOptions: true,
    },
    {
      name: "B2B Enterprise Plan",
      icon: "/icons/plan1.svg",
      features: [
        "Essential & Premium Plans",
        "Customized Plans",
        "Team Dashboard",
        "Priority Technical Support",
        "API Access & Integration",
        "Customizable Scanning Rules",
        "VSCode Extension",
        "Full Technical Report"
      ],
      buttonText: "Buy Now",
      hasOptions: true,
    },
  ];

  return (
    // Fixed height to prevent scrolling and stretch content
    <div className="h-full bg-black text-white p-6 flex flex-col">
      <div className="max-w-[98%] mx-auto w-full h-full flex flex-col justify-center">
        
        {/* Grid setup for 5 long cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[95%] items-stretch">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              // Added h-full and flex-grow to make cards as long as possible
              className="relative bg-[#0d0d0d] border-2 border-green-900/30 rounded-[1.5rem] p-6 flex flex-col transition-all duration-300 hover:border-green-900 hover:shadow-[0_0_30px_rgba(34,197,94,0.4),inset_0_0_15px_rgba(34,197,94,0.1)] group h-full"
            >
              {/* Icons only for Essential, Premium, and B2B */}
              {plan.icon && (
                <div className="absolute -top-7 -left-3 w-16 h-16 z-10 transition-transform group-hover:scale-110">
                  <img src={plan.icon} alt="icon" className="w-full h-full object-contain" />
                </div>
              )}

              <h2 className="text-xl font-bold text-center mt-4 mb-6 uppercase tracking-wider">{plan.name}</h2>

              {/* Extended feature list from the image */}
              <div className="flex-grow space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3">
                    <div className="mb-2 bg-green-900/40 p-1 rounded text-green-400 shadow-[0_0_5px_rgba(34,197,94,0.2)]">
                      <Check size={20} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

      <PlanDropdown hasOptions={plan.hasOptions} />

              {/* Green Action Button */}
              <button className="cursor-pointer w-full bg-[#018021] hover:bg-[#00a324] text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest">
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;