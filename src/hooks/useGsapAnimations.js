import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-triggered reveal for a single element.
 * @param {object} options - { y, x, scale, rotation, opacity, duration, ease, delay, start, scrub }
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 60,
      x = 0,
      scale = 1,
      rotation = 0,
      opacity = 0,
      duration = 1,
      ease = "power3.out",
      delay = 0,
      start = "top 85%",
      scrub = false,
    } = options;

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity, y, x, scale, rotation });

      gsap.to(el, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotation: 0,
        duration,
        ease,
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
          scrub,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

/**
 * Scroll-triggered stagger reveal for child elements.
 * @param {string} childSelector - CSS selector for children
 * @param {object} options
 */
export function useStaggerReveal(childSelector, options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll(childSelector);
    if (!children.length) return;

    const {
      y = 80,
      x = 0,
      scale = 0.9,
      rotationX = 0,
      opacity = 0,
      duration = 0.8,
      stagger = 0.15,
      ease = "back.out(1.7)",
      start = "top 85%",
    } = options;

    const ctx = gsap.context(() => {
      gsap.set(children, { opacity, y, x, scale, rotationX });

      gsap.to(children, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotationX: 0,
        duration,
        stagger,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

/**
 * Parallax effect: element moves at a different rate than scroll.
 * @param {number} speed - multiplier (0.5 = half speed, -0.5 = opposite direction)
 */
export function useParallax(speed = 0.5) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * 30,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

/**
 * Text split reveal: animates each word of a text element.
 */
export function useTextReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const text = el.textContent;
    const words = text.split(" ");
    el.innerHTML = words
      .map(
        (word) =>
          `<span class="gsap-word" style="display:inline-block;overflow:hidden"><span style="display:inline-block">${word}</span></span>`,
      )
      .join(" ");

    const innerSpans = el.querySelectorAll(".gsap-word > span");

    const {
      y = 60,
      duration = 0.7,
      stagger = 0.04,
      ease = "power4.out",
      delay = 0,
      start = "top 85%",
    } = options;

    const ctx = gsap.context(() => {
      gsap.set(innerSpans, { y, opacity: 0 });

      gsap.to(innerSpans, {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease,
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => {
      ctx.revert();
      el.textContent = text;
    };
  }, []);

  return ref;
}

/**
 * Continuous floating animation.
 */
export function useFloat(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { y = 15, duration = 2.5, ease = "sine.inOut" } = options;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: `-=${y}`,
        duration,
        ease,
        yoyo: true,
        repeat: -1,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
