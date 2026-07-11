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
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { displaySrc } = useProfileAvatar();
  const { isAuthenticated, logout } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);
  const mobileButtonRef = useRef(null);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const performLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      await logout();
      navigate("/login", { replace: true });
      setIsOpen(false);
      setProfileMenuOpen(false);
    } catch (err) {
      console.error("Logout error occurred:", err);
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!profileRef.current) return;
      if (profileRef.current.contains(e.target)) return;
      setProfileMenuOpen(false);
    };
    const onDocKeyDown = (e) => {
      if (e.key === "Escape") {
        if (profileMenuOpen) {
          setProfileMenuOpen(false);
          profileButtonRef.current?.focus();
        }
        if (isOpen) {
          setIsOpen(false);
          mobileButtonRef.current?.focus();
        }
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [profileMenuOpen, isOpen]);

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
        className={`animate-cockpit-nav fixed left-1/2 z-100 flex -translate-x-1/2 items-center justify-between overflow-visible rounded-2xl border bg-black/80 backdrop-blur-md motion-safe:transition-all motion-safe:duration-300 ease-[var(--ease-out-quint)] after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:rounded-b-2xl after:content-[''] ${
          isScrolled
            ? "top-2 w-[min(100%,calc(100vw-1.5rem))] max-w-[min(100%,76rem)] border-[#1E7D04]/80 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.95),0_0_20px_rgba(30,125,4,0.3)] after:shadow-[0_3px_14px_rgba(34,197,94,0.7)] sm:top-3 sm:px-6 md:px-10"
            : "top-3 w-[min(100%,calc(100vw-1.5rem))] max-w-[min(100%,80rem)] border-[#1E7D04]/60 px-4 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.8)] after:shadow-[0_3px_6px_rgba(30,125,4,0.4)] sm:top-4 sm:px-6 md:px-10 lg:px-14"
        }`}
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center space-x-2 sm:space-x-3">
          <NavBrandLink onNavigate={handleNavClick} />
        </div>

        {/* Desktop Links */}
        <ul className="hidden space-x-2 text-sm font-medium text-gray-300 md:flex lg:space-x-5 lg:text-base">
          <li>
            <Link
              to="/#home"
              className="group relative rounded-lg px-3 py-1.5 motion-safe:transition-all motion-safe:duration-250 ease-[var(--ease-out-quart)] hover:bg-[#1E7D04]/15 hover:text-[#22c55e] hover:shadow-[0_0_12px_rgba(30,125,4,0.25)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04]"
            >
              <span>Home</span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[#22c55e] opacity-0 shadow-[0_0_8px_#22c55e] motion-safe:transition-all motion-safe:duration-300 ease-[var(--ease-out-quart)] group-hover:w-3/5 group-hover:opacity-100" />
            </Link>
          </li>
          <li>
            <Link
              to="/#about"
              className="group relative rounded-lg px-3 py-1.5 motion-safe:transition-all motion-safe:duration-250 ease-[var(--ease-out-quart)] hover:bg-[#1E7D04]/15 hover:text-[#22c55e] hover:shadow-[0_0_12px_rgba(30,125,4,0.25)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04]"
            >
              <span>About</span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[#22c55e] opacity-0 shadow-[0_0_8px_#22c55e] motion-safe:transition-all motion-safe:duration-300 ease-[var(--ease-out-quart)] group-hover:w-3/5 group-hover:opacity-100" />
            </Link>
          </li>
          <li>
            <Link
              to="/#services"
              className="group relative rounded-lg px-3 py-1.5 motion-safe:transition-all motion-safe:duration-250 ease-[var(--ease-out-quart)] hover:bg-[#1E7D04]/15 hover:text-[#22c55e] hover:shadow-[0_0_12px_rgba(30,125,4,0.25)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04]"
            >
              <span>Services</span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[#22c55e] opacity-0 shadow-[0_0_8px_#22c55e] motion-safe:transition-all motion-safe:duration-300 ease-[var(--ease-out-quart)] group-hover:w-3/5 group-hover:opacity-100" />
            </Link>
          </li>
          <li>
            <Link
              to="/#contact"
              className="group relative rounded-lg px-3 py-1.5 motion-safe:transition-all motion-safe:duration-250 ease-[var(--ease-out-quart)] hover:bg-[#1E7D04]/15 hover:text-[#22c55e] hover:shadow-[0_0_12px_rgba(30,125,4,0.25)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04]"
            >
              <span>Contact</span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[#22c55e] opacity-0 shadow-[0_0_8px_#22c55e] motion-safe:transition-all motion-safe:duration-300 ease-[var(--ease-out-quart)] group-hover:w-3/5 group-hover:opacity-100" />
            </Link>
          </li>
        </ul>

        {/* Desktop Buttons & Authenticated Actions */}
        <div className="relative hidden items-center space-x-4 overflow-visible md:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="group relative overflow-hidden rounded-full border border-[#1E7D04] px-4 py-1.5 text-sm font-semibold text-[#1E7D04] motion-safe:transition-all motion-safe:duration-300 hover:border-[#22c55e] hover:bg-[#025714] hover:text-white hover:shadow-[0_0_16px_rgba(34,197,94,0.4)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04] focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:px-5 lg:text-base"
              >
                <span className="relative z-10">Sign In</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent motion-safe:transition-transform motion-safe:duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                to="/signup"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#1E7D04] via-[#22c55e] to-[#0A3301] bg-[length:200%_100%] bg-left px-4 py-1.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(30,125,4,0.4)] motion-safe:transition-all motion-safe:duration-300 hover:-translate-y-0.5 hover:bg-right hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04] focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:px-5 lg:text-base"
              >
                <span className="relative z-10">Sign Up</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent motion-safe:transition-transform motion-safe:duration-700 group-hover:translate-x-full" />
              </Link>
            </>
          ) : (
            <div ref={profileRef} className="relative flex items-center gap-3">
              <Link
                to="/dashboard"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#1E7D04] via-[#22c55e] to-[#0A3301] bg-[length:200%_100%] bg-left px-4 py-1.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(30,125,4,0.4)] motion-safe:transition-all motion-safe:duration-300 hover:-translate-y-0.5 hover:bg-right hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04] focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:px-5 lg:text-base"
              >
                <span className="relative z-10">Dashboard</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent motion-safe:transition-transform motion-safe:duration-700 group-hover:translate-x-full" />
              </Link>

              <div className="relative cursor-pointer">
                {displaySrc ? (
                  <button
                    ref={profileButtonRef}
                    type="button"
                    onClick={() => setProfileMenuOpen((v) => !v)}
                    className="block cursor-pointer rounded-full ring-2 ring-green-500/40 ring-offset-2 ring-offset-black/80 motion-safe:transition-all motion-safe:duration-200 hover:ring-[#22c55e] hover:shadow-[0_0_16px_rgba(34,197,94,0.4)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04]"
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="menu"
                    aria-controls="account-menu-dropdown"
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
                    ref={profileButtonRef}
                    type="button"
                    onClick={() => setProfileMenuOpen((v) => !v)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-green-500/35 bg-white/5 motion-safe:transition-all motion-safe:duration-200 hover:border-[#22c55e] hover:bg-white/10 hover:shadow-[0_0_16px_rgba(34,197,94,0.4)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04] focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="menu"
                    aria-controls="account-menu-dropdown"
                    aria-label="Open account menu"
                  >
                    <User size={20} className="text-gray-200" />
                  </button>
                )}
              </div>

              <div
                id="account-menu-dropdown"
                className={`absolute right-0 top-full z-[200] mt-2 w-72 min-w-[18rem] origin-top-right overflow-hidden rounded-2xl border border-[#1E7D04]/50 bg-[#0c0c0c] py-2 backdrop-blur-xl motion-safe:transition-all motion-safe:duration-250 ease-[var(--ease-out-quint)] sm:w-80 sm:min-w-[20rem] ${
                  profileMenuOpen
                    ? "pointer-events-auto translate-y-0 scale-100 opacity-100 shadow-[0_12px_40px_rgba(0,0,0,0.95),0_0_20px_rgba(30,125,4,0.35)]"
                    : "pointer-events-none -translate-y-2 scale-95 opacity-0 shadow-none"
                }`}
                role="menu"
                aria-label="Account menu options"
              >
                <p className="truncate px-3.5 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Account
                </p>
                <div className="flex flex-col gap-0.5 px-1.5">
                  <MenuLink
                    to="/dashboard"
                    label="Dashboard"
                    onPick={() => setProfileMenuOpen(false)}
                    staggerIndex={0}
                  />
                  <MenuLink
                    to="/plans"
                    label="Plans"
                    onPick={() => setProfileMenuOpen(false)}
                    staggerIndex={1}
                  />
                  <MenuLink
                    to="/privacy"
                    label="Privacy"
                    onPick={() => setProfileMenuOpen(false)}
                    staggerIndex={2}
                  />
                  <MenuLink
                    to="/terms"
                    label="Terms"
                    onPick={() => setProfileMenuOpen(false)}
                    staggerIndex={3}
                  />
                </div>

                <div className="mx-2 my-2 border-t border-white/10" />

                <div className="px-1.5 pb-0.5">
                  <button
                    type="button"
                    onClick={() => setConfirmLogoutOpen(true)}
                    disabled={logoutLoading}
                    style={{ "--i": 4 }}
                    className="animate-cockpit-item w-full truncate rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10 active:scale-98 focus:outline-none focus-visible:bg-red-500/15 focus-visible:ring-1 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
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
          ref={mobileButtonRef}
          className="rounded-lg p-1.5 text-gray-300 motion-safe:transition-all motion-safe:duration-200 hover:text-white active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04] md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            id="mobile-navigation-drawer"
            className="animate-cockpit-drawer absolute inset-x-0 top-[calc(100%+0.5rem)] z-[110] max-h-[min(calc(100dvh-5rem),28rem)] overflow-y-auto overscroll-contain rounded-2xl border border-[#1E7D04]/50 bg-[#0c0c0c]/95 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.95),0_0_24px_rgba(30,125,4,0.25)] backdrop-blur-xl sm:p-6"
          >
            <div className="mx-auto flex w-full max-w-sm flex-col items-stretch space-y-1 text-center text-sm font-medium text-gray-300">
              <Link
                to="/#home"
                onClick={() => setIsOpen(false)}
                style={{ "--i": 0 }}
                className="animate-cockpit-item group relative truncate rounded-md py-2.5 transition-all duration-200 hover:bg-[#1E7D04]/15 hover:text-[#22c55e] active:scale-98 focus:outline-none focus-visible:bg-white/10 focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
              >
                Home
              </Link>
              <Link
                to="/#about"
                onClick={() => setIsOpen(false)}
                style={{ "--i": 1 }}
                className="animate-cockpit-item group relative truncate rounded-md py-2.5 transition-all duration-200 hover:bg-[#1E7D04]/15 hover:text-[#22c55e] active:scale-98 focus:outline-none focus-visible:bg-white/10 focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
              >
                About
              </Link>
              <Link
                to="/#services"
                onClick={() => setIsOpen(false)}
                style={{ "--i": 2 }}
                className="animate-cockpit-item group relative truncate rounded-md py-2.5 transition-all duration-200 hover:bg-[#1E7D04]/15 hover:text-[#22c55e] active:scale-98 focus:outline-none focus-visible:bg-white/10 focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
              >
                Services
              </Link>
              <Link
                to="/#contact"
                onClick={() => setIsOpen(false)}
                style={{ "--i": 3 }}
                className="animate-cockpit-item group relative truncate rounded-md py-2.5 transition-all duration-200 hover:bg-[#1E7D04]/15 hover:text-[#22c55e] active:scale-98 focus:outline-none focus-visible:bg-white/10 focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
              >
                Contact
              </Link>

              {/* Mobile Actions */}
              <div
                style={{ "--i": 4 }}
                className="animate-cockpit-item relative mt-2 flex flex-col space-y-2.5 border-t border-white/10 pt-3"
              >
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="group relative overflow-hidden truncate rounded-full border border-[#1E7D04] px-4 py-2.5 text-center text-xs font-semibold text-[#1E7D04] motion-safe:transition-all motion-safe:duration-300 hover:border-[#22c55e] hover:bg-[#025714] hover:text-white hover:shadow-[0_0_16px_rgba(34,197,94,0.4)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04]"
                    >
                      <span className="relative z-10">Sign In</span>
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent motion-safe:transition-transform motion-safe:duration-700 group-hover:translate-x-full" />
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="group relative overflow-hidden truncate rounded-full bg-gradient-to-r from-[#1E7D04] via-[#22c55e] to-[#0A3301] bg-[length:200%_100%] bg-left px-4 py-2.5 text-center text-xs font-semibold text-white shadow-[0_2px_8px_rgba(30,125,4,0.3)] motion-safe:transition-all motion-safe:duration-300 hover:bg-right hover:shadow-[0_0_16px_rgba(34,197,94,0.6)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04]"
                    >
                      <span className="relative z-10">Sign Up</span>
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent motion-safe:transition-transform motion-safe:duration-700 group-hover:translate-x-full" />
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col items-stretch gap-2.5">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="group relative overflow-hidden w-full truncate rounded-xl bg-gradient-to-r from-[#1E7D04] via-[#22c55e] to-[#0A3301] bg-[length:200%_100%] bg-left py-2.5 text-center text-sm font-semibold text-white shadow-[0_2px_10px_rgba(30,125,4,0.3)] motion-safe:transition-all motion-safe:duration-300 hover:bg-right hover:shadow-[0_0_16px_rgba(34,197,94,0.6)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span className="relative z-10">Go to Dashboard</span>
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent motion-safe:transition-transform motion-safe:duration-700 group-hover:translate-x-full" />
                    </Link>

                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        {displaySrc ? (
                          <img
                            src={displaySrc}
                            className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-green-500/40"
                            alt=""
                          />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-green-500/35 bg-white/10">
                            <User size={16} className="text-gray-200" />
                          </div>
                        )}
                        <span className="truncate text-xs font-semibold uppercase tracking-wider text-gray-300">
                          Account
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfirmLogoutOpen(true)}
                        disabled={logoutLoading}
                        className="shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Log out
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-1">
                      <Link
                        to="/plans"
                        onClick={() => setIsOpen(false)}
                        className="truncate rounded-lg border border-white/5 bg-white/5 py-2 text-center text-xs font-medium text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                      >
                        Plans
                      </Link>
                      <Link
                        to="/privacy"
                        onClick={() => setIsOpen(false)}
                        className="truncate rounded-lg border border-white/5 bg-white/5 py-2 text-center text-xs font-medium text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                      >
                        Privacy
                      </Link>
                      <Link
                        to="/terms"
                        onClick={() => setIsOpen(false)}
                        className="truncate rounded-lg border border-white/5 bg-white/5 py-2 text-center text-xs font-medium text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
                      >
                        Terms
                      </Link>
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

function MenuLink({ to, label, onPick, staggerIndex = 0 }) {
  return (
    <Link
      to={to}
      onClick={onPick}
      style={{ "--i": staggerIndex }}
      className="animate-cockpit-item block truncate rounded-lg px-3 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10 active:scale-98 focus:outline-none focus-visible:bg-white/15 focus-visible:ring-1 focus-visible:ring-[#1E7D04]"
      role="menuitem"
    >
      {label}
    </Link>
  );
}
