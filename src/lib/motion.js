export const viewport = {
  once: true,
  amount: 0.2,
};

const ease = [0.22, 1, 0.36, 1];

export function fadeUp(
  delay = 0,
  { y = 32, duration = 0.7, scale = 1, rotateX = 0 } = {},
) {
  return {
    hidden: {
      opacity: 0,
      y,
      scale,
      rotateX,
      transformPerspective: 800,
      transformOrigin: "center bottom",
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration,
        delay,
        ease,
      },
    },
  };
}

export function staggerContainer({
  staggerChildren = 0.12,
  delayChildren = 0,
} = {}) {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}
