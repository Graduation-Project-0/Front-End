import { Link, useLocation } from "react-router-dom";

/** Wraps the app logo: goes to the start of the landing page (`/#home` = hero). */
export default function HomeLogoLink({ to = "/#home", className = "", children }) {
  const location = useLocation();

  return (
    <Link
      to={to}
      className={className}
      aria-label="Vanguard home — go to top of landing page"
      onClick={() => {
        if (location.pathname === "/") {
          requestAnimationFrame(() => {
            document
              .getElementById("home")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
      }}
    >
      {children}
    </Link>
  );
}
