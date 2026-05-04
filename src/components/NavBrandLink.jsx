import { Link } from "react-router-dom";

/**
 * Navbar-style wordmark: `/Logo.png` + “ANGUARD” (full word reads “VANGUARD” with the V in the mark).
 */
export default function NavBrandLink({ onNavigate, className = "" }) {
  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <Link
      to="/#home"
      className={`nav-logo ${className}`.trim()}
      aria-label="Vanguard – Go to homepage"
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
