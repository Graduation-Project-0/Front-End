import { Link } from "react-router-dom";

/** Wraps the app logo so it navigates to the marketing hero (`/#home` = `HeroSection`). */
export default function HomeLogoLink({ to = "/#home", className = "", children }) {
  return (
    <Link to={to} className={className} aria-label="Vanguard home — go to hero">
      {children}
    </Link>
  );
}
