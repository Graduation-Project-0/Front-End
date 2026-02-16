import React from 'react';

const About = () => {
  return (
    <div id="about" className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30 p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Glows for atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Header */}
      <header className="relative z-10 mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(74,222,128,0.3)] py-2">
          Guardians of The Digital Frontier
        </h1>
      </header>

      {/* Content Grid */}
      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: Top Left & Bottom Left */}
        <div className="flex flex-col gap-12 order-2 lg:order-1">
          {/* Top Left Card */}
          <div className="bg-green-950/10 border border-green-900 p-6 rounded-2xl backdrop-blur-sm hover:border-green-500/60 transition-all duration-700">
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
     Vanguard is an AI-powered cybersecurity platform that helps individuals and organizations identify and prevent digital threats before they cause harm.
            </p>
          </div>

          {/* Bottom Left Card */}
          <div className="bg-green-950/10 border border-green-900 p-6 rounded-2xl backdrop-blur-sm hover:border-green-500/60 transition-all duration-700">
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
           Our platform uses AI and machine learning to detect threats and deliver clear insights through standard and advanced analysis.
            </p>
          </div>
        </div>

        {/* CENTER COLUMN: The Logo */}
 <div className="flex justify-center items-center order-1 lg:order-2 py-8 lg:py-0">
          <div className="relative group">

            <div className="absolute inset-0 bg-green-500/10 rounded-full blur-[100px] animate-pulse" />
            
            <img 
              src="/Big Logo.svg" 
              alt="Vanguard Shield Logo" 
              className="relative w-72 md:w-[450px] drop-shadow-[0_0_35px_rgba(34,150,94,0.5)] transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Top Right & Bottom Right */}
        <div className="flex flex-col gap-12 order-3">
          {/* Top Right Card */}
          <div className="bg-green-950/10 border border-green-900 p-6 rounded-2xl backdrop-blur-sm hover:border-green-500/60 transition-all duration-700">
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            With cyberattacks becoming more frequent and sophisticated, Vanguard enables users to identify malicious URLs and files through fast, intelligent analysis.
            </p>
          </div>

          {/* Bottom Right Card */}
          <div className="bg-green-950/10 border border-green-900 p-6 rounded-2xl backdrop-blur-sm hover:border-green-500/60 transition-all duration-700">
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            Our vision is to simplify cybersecurity and make it accessible to all, establishing Vanguard as a proactive first line of defense in the digital world.
            </p>
          </div>
        </div>

      </main>

      {/* Decorative Bottom Line */}
      <footer className="mt-16 w-32 h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
    </div>
  );
};

export default About;