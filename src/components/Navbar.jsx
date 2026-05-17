import React, { useEffect, useRef, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NavBrandLink from "./NavBrandLink";
import LogoutConfirmDialog from "./LogoutConfirmDialog";
import { useProfileAvatar } from "../hooks/useProfileAvatar";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const { displaySrc } = useProfileAvatar();
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
      <LogoutConfirmDialog
        open={confirmLogoutOpen}
        loading={logoutLoading}
        onRequestClose={() => {
          if (logoutLoading) return;
          setConfirmLogoutOpen(false);
        }}
        onConfirm={async () => {
          await performLogout();
          setConfirmLogoutOpen(false);
        }}
      />

      <nav
        className="fixed top-0 left-1/2 z-[100] flex w-[min(100%,calc(100vw-1rem))] max-w-[min(100%,80rem)] -translate-x-1/2 items-center justify-between overflow-visible rounded-2xl border-b border-[#1E7D04]/60 bg-black/80 px-4 py-2 backdrop-blur-md after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:shadow-[0_3px_6px_rgba(30,125,4,0.4)] after:content-[''] sm:px-6 md:px-10 lg:px-14"
      >
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
      <div className="relative hidden items-center space-x-4 overflow-visible md:flex">
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
            className="relative flex items-center gap-2"
          >
            <div className="relative cursor-pointer">
              {displaySrc ? (
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  className="block cursor-pointer rounded-full ring-2 ring-green-500/40 ring-offset-2 ring-offset-black/80 focus:outline-none focus-visible:ring-[#1E7D04]"
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Account menu"
                >
                  <img
                    src={displaySrc}
                    className="h-10 w-10 rounded-full object-cover"
                    alt=""
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-green-500/35 bg-white/5 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04]"
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Open account menu"
                >
                  <User size={20} className="text-gray-200" />
                </button>
              )}

            </div>

            <div
              className={`absolute right-0 top-full z-[200] mt-2 w-72 min-w-[18rem] origin-top-right overflow-hidden rounded-xl border border-[#1E7D04]/25 bg-[#0c0c0c] py-2 shadow-lg shadow-black/50 backdrop-blur-xl transition-all duration-150 sm:w-80 sm:min-w-[20rem] ${
                profileMenuOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
              role="menu"
              aria-label="Account menu"
            >
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Account
              </p>
              <div className="flex flex-col gap-0.5 px-1.5">
                <MenuLink to="/dashboard" label="Dashboard" onPick={() => setProfileMenuOpen(false)} />
                <MenuLink to="/plans" label="Plans" onPick={() => setProfileMenuOpen(false)} />
                <MenuLink to="/privacy" label="Privacy" onPick={() => setProfileMenuOpen(false)} />
                <MenuLink to="/terms" label="Terms" onPick={() => setProfileMenuOpen(false)} />
              </div>

              <div className="mx-2 my-2 border-t border-white/10" />

              <div className="px-1.5 pb-0.5">
                <button
                  type="button"
                  onClick={() => setConfirmLogoutOpen(true)}
                  disabled={logoutLoading}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Log out
                </button>
              </div>
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
          className="animate-fadeIn absolute inset-x-0 top-full z-[110] max-h-[min(calc(100dvh-4rem),26rem)] overflow-y-auto overscroll-contain border-t border-gray-700 bg-black/95 px-3 py-3 backdrop-blur-md sm:px-4"
        >
          <div className="mx-auto flex w-full max-w-sm flex-col items-stretch space-y-1.5 text-center text-sm font-medium text-gray-300">
          <Link
            to="/#home"
            onClick={() => setIsOpen(false)}
            className="rounded-md py-1.5 transition hover:bg-white/5 hover:text-[#1E7D04]"
          >
            Home
          </Link>
          <Link
            to="/#about"
            onClick={() => setIsOpen(false)}
            className="rounded-md py-1.5 transition hover:bg-white/5 hover:text-[#1E7D04]"
          >
            About
          </Link>
          <Link
            to="/#services"
            onClick={() => setIsOpen(false)}
            className="rounded-md py-1.5 transition hover:bg-white/5 hover:text-[#1E7D04]"
          >
            Services
          </Link>
          <Link
            to="/#contact"
            onClick={() => setIsOpen(false)}
            className="rounded-md py-1.5 transition hover:bg-white/5 hover:text-[#1E7D04]"
          >
            Contact
          </Link>

          {/* Mobile Buttons */}
          <div className="relative mt-1 flex flex-col space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-[#1E7D04] px-4 py-1.5 text-xs font-semibold text-[#1E7D04] transition-all duration-300 hover:bg-[#025714] hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-gradient-to-r from-[#1E7D04] to-[#0A3301] px-4 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:opacity-70"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative mx-auto flex w-full max-w-sm flex-col items-center gap-3 pt-1">
                <div className="relative cursor-pointer">
                  {displaySrc ? (
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/dashboard");
                        setIsOpen(false);
                      }}
                      className="block cursor-pointer rounded-full ring-2 ring-green-500/40"
                      aria-label="Go to dashboard"
                    >
                      <img
                        src={displaySrc}
                        className="h-12 w-12 rounded-full object-cover"
                        alt=""
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/dashboard");
                        setIsOpen(false);
                      }}
                      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-green-500/35 bg-white/5 transition hover:bg-white/10"
                      aria-label="Go to dashboard"
                    >
                      <User size={22} className="text-gray-200" />
                    </button>
                  )}
                </div>

                <div className="grid w-full max-w-xs gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-center text-sm font-medium text-gray-200 transition hover:bg-white/10"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/plans"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-center text-sm font-medium text-gray-200 transition hover:bg-white/10"
                  >
                    Plans
                  </Link>
                  <Link
                    to="/privacy"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-center text-sm font-medium text-gray-200 transition hover:bg-white/10"
                  >
                    Privacy
                  </Link>
                  <Link
                    to="/terms"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-center text-sm font-medium text-gray-200 transition hover:bg-white/10"
                  >
                    Terms
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmLogoutOpen(true)}
                    disabled={logoutLoading}
                    className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
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
      className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10"
      role="menuitem"
    >
      {label}
    </Link>
  );
}
