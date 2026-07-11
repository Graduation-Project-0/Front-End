import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * Initializes scroll synchronization if needed without hijacking or locking native wheel events.
 */
export function initSmoothScroll() {
  // Ensure ScrollTrigger updates cleanly on native scroll without wheel lock
  ScrollTrigger.refresh();
  return () => {};
}

/**
 * Smoothly scrolls to a specific section by element ID or DOM element,
 * precisely accounting for the fixed floating navbar header offset.
 *
 * @param {string|HTMLElement} target - Section ID (e.g., "about" or "#about") or element
 * @param {object} options - Options including custom `offset` (default: 88px) and `duration`
 */
export function scrollToSection(target, options = {}) {
  const { offset = 88, duration = 1.0, onComplete } = options;

  let el = null;
  if (typeof target === "string") {
    const cleanId = target.replace(/^#/, "");
    el = document.getElementById(cleanId);
  } else if (target instanceof HTMLElement) {
    el = target;
  }

  if (!el) return;

  // Calculate exact scroll target accounting for floating navbar offset
  const rect = el.getBoundingClientRect();
  const targetY = Math.max(0, window.scrollY + rect.top - offset);

  // Temporarily set scroll-behavior to auto during GSAP animation to prevent browser & GSAP conflict
  const originalBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";

  gsap.to(window, {
    scrollTo: { y: targetY, autoKill: true },
    duration: duration,
    ease: "power3.inOut",
    onComplete: () => {
      document.documentElement.style.scrollBehavior = originalBehavior || "";
      onComplete?.();
    },
    onInterrupt: () => {
      document.documentElement.style.scrollBehavior = originalBehavior || "";
    },
  });
}

