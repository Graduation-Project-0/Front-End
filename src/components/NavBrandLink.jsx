import { Link, useLocation } from "react-router-dom";

/**
 * Navbar-style wordmark: helmet icon + “ANGUARD” (full word reads “VANGUARD” with the V in the mark).
 * Links to `/#home` (top of landing). If you’re already on `/`, still scrolls back to the hero.
 */
export default function NavBrandLink({ onNavigate, className = "" }) {
  const location = useLocation();

  const handleNavClick = () => {
    onNavigate?.();
    if (location.pathname === "/") {
      requestAnimationFrame(() => {
        document
          .getElementById("home")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <Link
      to="/#home"
      className={`nav-logo ${className}`.trim()}
      aria-label="Vanguard – Go to top of landing page"
      onClick={handleNavClick}
    >
      <img
        src="/icons/helmet.svg"
        alt=""
        aria-hidden="true"
        className="nav-logo-icon"
        loading="eager"
      />
      <span className="nav-logo-text pt-4">ANGUARD</span>
    </Link>
  );
}
