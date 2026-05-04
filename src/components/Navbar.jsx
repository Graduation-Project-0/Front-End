import React, { useEffect, useRef, useState } from "react";
import { Menu, X, Camera, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NavBrandLink from "./NavBrandLink";
import { useProfileAvatar } from "../hooks/useProfileAvatar";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const {
    displaySrc,
    hasCustomAvatar,
    avatarDisabled,
    fileInputRef,
    onFileChange,
    openPicker,
    disableAvatar,
    enableAvatar,
    clearAvatar,
  } = useProfileAvatar();
  const { isAuthenticated, logout } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const profileRef = useRef(null);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const performLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    await logout();
    navigate("/login", { replace: true });
    setIsOpen(false);
    setProfileMenuOpen(false);
    setLogoutLoading(false);
  };

  const goDashboard = () => {
    setProfileMenuOpen(false);
    setConfirmLogoutOpen(false);
    navigate("/dashboard");
  };

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!profileRef.current) return;
      if (profileRef.current.contains(e.target)) return;
      setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <>
      {confirmLogoutOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm logout"
          onClick={() => {
            if (logoutLoading) return;
            setConfirmLogoutOpen(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[#1E7D04]/20 bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(30,125,4,0.15),0_20px_60px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <h3 className="text-white font-black text-lg">Logout</h3>
              <p className="mt-2 text-gray-400 text-sm">
                Are you sure you want to logout?
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  disabled={logoutLoading}
                  onClick={() => setConfirmLogoutOpen(false)}
                  className="flex-1 rounded-xl border border-gray-700 bg-transparent py-2.5 text-sm font-semibold text-gray-200 hover:bg-white/5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await performLogout();
                    setConfirmLogoutOpen(false);
                  }}
                  disabled={logoutLoading}
                  className="flex-1 rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/15 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {logoutLoading ? "Logging out..." : "Yes, Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav
        className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] 
             w-[95%] sm:w-[90%] md:w-[85%] lg:w-[95%] 
             bg-black/80 backdrop-blur-md flex justify-between items-center
             px-6 sm:px-8 md:px-10 lg:px-16 py-2
             mt-0 
             rounded-2xl
             border-b border-[#1E7D04]/60
             after:content-['']
             after:absolute
             after:left-0 after:right-0 after:bottom-0
             after:h-[4px]
             after:shadow-[0_3px_6px_rgba(30,125,4,0.4)]
             after:pointer-events-none"
      >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-label="Choose profile photo"
        onChange={onFileChange}
      />

      {/* Logo */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        <NavBrandLink onNavigate={handleNavClick} />
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex space-x-5 lg:space-x-8 text-gray-300 font-medium text-sm lg:text-base">
        <Link to="/#home">
          <li className="hover:text-[#1E7D04] cursor-pointer transition">
            Home
          </li>
        </Link>
        <Link to="/#about">
          <li className="hover:text-[#1E7D04] cursor-pointer transition">
            About
          </li>
        </Link>
        <Link to="/#services">
          <li className="hover:text-[#1E7D04] cursor-pointer transition">
            Services
          </li>
        </Link>
        <Link to="/#contact">
          <li className="hover:text-[#1E7D04] cursor-pointer transition">
            Contact
          </li>
        </Link>
      </ul>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center space-x-4 relative">
        {!isAuthenticated ? (
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
          <div
            ref={profileRef}
            className="relative flex items-center gap-3"
          >
            <div className="relative cursor-pointer">
              {displaySrc ? (
                <img
                  src={displaySrc}
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  className="w-11 h-11 rounded-full border-2 border-green-500/50 object-cover"
                  alt="Profile"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  className="w-11 h-11 rounded-full border-2 border-green-500/30 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
                  aria-label="Open profile menu"
                >
                  <User size={18} className="text-gray-200" />
                </button>
              )}

              {!avatarDisabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileMenuOpen(false);
                    openPicker();
                  }}
                  className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-black bg-[#1E7D04] text-white shadow hover:bg-[#158003]"
                  aria-label={hasCustomAvatar ? "Change profile photo" : "Add profile photo"}
                >
                  <Camera size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Click dropdown */}
            <div
              className={`absolute right-0 top-full mt-3 w-56 origin-top-right rounded-2xl border border-[#1E7D04]/20
                bg-black/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-150
                ${profileMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"}`}
              role="menu"
              aria-label="Profile menu"
            >
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-white/5">
                My Account
              </div>

              <MenuLink to="/dashboard" label="My Dashboard" onPick={() => setProfileMenuOpen(false)} />
              <MenuLink to="/plans" label="Plans" onPick={() => setProfileMenuOpen(false)} />
              <MenuLink to="/privacy" label="Privacy" onPick={() => setProfileMenuOpen(false)} />
              <MenuLink to="/terms" label="Terms" onPick={() => setProfileMenuOpen(false)} />

              <div className="border-t border-white/5" />

              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen(false);
                  openPicker();
                }}
                disabled={avatarDisabled}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-white/5 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {hasCustomAvatar ? "Change photo" : "Add photo"}
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAvatar();
                  disableAvatar();
                  setProfileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-white/5 transition"
              >
                Don't use a photo
              </button>
              {avatarDisabled && (
                <button
                  type="button"
                  onClick={() => {
                    enableAvatar();
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-white/5 transition"
                >
                  Enable photo upload
                </button>
              )}

              <div className="border-t border-white/5" />
              <button
                type="button"
                onClick={() => setConfirmLogoutOpen(true)}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={logoutLoading}
              >
                Logout
              </button>
            </div>
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
          <Link
            to="/#home"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#1E7D04] transition"
          >
            Home
          </Link>
          <Link
            to="/#about"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#1E7D04] transition"
          >
            About
          </Link>
          <Link
            to="/#services"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#1E7D04] transition"
          >
            Services
          </Link>
          <Link
            to="/#contact"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#1E7D04] transition"
          >
            Contact
          </Link>

          {/* Mobile Buttons */}
          <div className="flex flex-col space-y-3 mt-4 relative">
            {!isAuthenticated ? (
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
              <div className="relative flex flex-col items-center mx-auto gap-3">
                <div
                  className="relative"
                >
                  <img
                    src={displaySrc}
                    onClick={() => {
                      navigate("/dashboard");
                      setIsOpen(false);
                    }}
                    className="w-20 h-20 rounded-full object-cover cursor-pointer border-2 border-green-500/50 hover:opacity-90 transition-opacity"
                    alt="Profile"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPicker();
                    }}
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-[#1E7D04] text-white"
                    aria-label="Change profile photo"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <div className="w-full grid gap-2 mt-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center border border-white/10 bg-white/5 text-gray-200 text-sm font-semibold px-5 py-2 rounded-xl hover:bg-white/10 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/plans"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center border border-white/10 bg-white/5 text-gray-200 text-sm font-semibold px-5 py-2 rounded-xl hover:bg-white/10 transition"
                  >
                    Plans
                  </Link>
                  <Link
                    to="/privacy"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center border border-white/10 bg-white/5 text-gray-200 text-sm font-semibold px-5 py-2 rounded-xl hover:bg-white/10 transition"
                  >
                    Privacy
                  </Link>
                  <Link
                    to="/terms"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center border border-white/10 bg-white/5 text-gray-200 text-sm font-semibold px-5 py-2 rounded-xl hover:bg-white/10 transition"
                  >
                    Terms
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmLogoutOpen(true)}
                    disabled={logoutLoading}
                    className="w-full border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-semibold px-5 py-2 rounded-xl hover:bg-red-500/15 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
    </>
  );
}

function MenuLink({ to, label, onPick }) {
  return (
    <Link
      to={to}
      onClick={onPick}
      className="block px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-white/5 transition"
      role="menuitem"
    >
      {label}
    </Link>
  );
}
