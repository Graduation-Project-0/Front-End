import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hovered, setHovered] = useState(false); // Tooltip state
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <nav
className="flex justify-between items-center
px-6 sm:px-8 md:px-10 lg:px-16 py-3
mx-4 sm:mx-8 md:mx-12 lg:mx-16
relative z-50
border-b border-green-500/60
after:content-['']
after:absolute
after:left-0 after:right-0 after:bottom-0
after:h-[12px]
after:shadow-[0_6px_10px_rgba(34,197,94,0.55)]
after:pointer-events-none"
    >
      {/* Logo */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <img src="/FullLogoBlack.png" alt="logo" className="h-14 sm:h-14 lg:h-20 w-50" />
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex space-x-5 lg:space-x-8 text-gray-300 font-medium text-sm lg:text-base">
        <Link to="/#hero"><li className="hover:text-[#1E7D04] cursor-pointer transition">Home</li></Link>
        <Link to="/#about"><li className="hover:text-[#1E7D04] cursor-pointer transition">About</li></Link>
        <Link to="/#services"><li className="hover:text-[#1E7D04] cursor-pointer transition">Services</li></Link>
        <Link to="/#contact"><li className="hover:text-[#1E7D04] cursor-pointer transition">Contact</li></Link>
      </ul>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center space-x-4 relative">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="border border-[#1E7D04] text-[#1E7D04] text-sm lg:text-md font-semibold px-4 lg:px-5 py-1.5 rounded-full transition-all duration-300 hover:bg-[#025714] hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-[#1E7D04] to-[#0A3301] text-white text-sm lg:text-md font-semibold px-4 lg:px-5 py-1.5 rounded-full transition-all duration-300 hover:opacity-70"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div className="relative flex items-center">
            {/* Profile Image */}
            <img
              src="/profile.png"
              onClick={() => navigate("/dashboard")}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="w-15 h-15 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              alt="profile"
            />
            {/* Tooltip */}
            {hovered && (
              <div className="absolute top-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                My Profile
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-300 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="absolute top-[100%] left-0 w-full bg-black/90 backdrop-blur-md border-t border-gray-700 
          flex flex-col items-center space-y-5 py-6 text-gray-300 font-medium text-base animate-fadeIn"
        >
          <Link to="/#hero" onClick={() => setIsOpen(false)} className="hover:text-[#1E7D04] transition">Home</Link>
          <Link to="/#about" onClick={() => setIsOpen(false)} className="hover:text-[#1E7D04] transition">About</Link>
          <Link to="/#services" onClick={() => setIsOpen(false)} className="hover:text-[#1E7D04] transition">Services</Link>
          <Link to="/#contact" onClick={() => setIsOpen(false)} className="hover:text-[#1E7D04] transition">Contact</Link>

          {/* Mobile Buttons */}
          <div className="flex flex-col space-y-3 mt-4 relative">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="border border-[#1E7D04] text-[#1E7D04] text-sm font-semibold px-5 py-1.5 rounded-full transition-all duration-300 hover:bg-[#025714] hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-[#1E7D04] to-[#0A3301] text-white font-semibold px-5 py-1.5 rounded-full transition-all duration-300 hover:opacity-70"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative flex items-center mx-auto">
                {/* Profile Image Mobile */}
                <img
                  src="/user.png"
                  onClick={() => { navigate("/dashboard"); setIsOpen(false); }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  alt="profile"
                />
                {hovered && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                    My Profile
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
