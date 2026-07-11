import React, { useRef, useEffect, useCallback } from "react";

const PARTICLE_COUNT = 30;
const CONNECTION_DISTANCE = 100;
const PARTICLE_COLOR_R = 30;
const PARTICLE_COLOR_G = 125;
const PARTICLE_COLOR_B = 4;

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const initParticles = useCallback((width, height) => {
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.8,
        opacity: Math.random() * 0.4 + 0.15,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const parent = canvas.parentElement;
    let width = (canvas.width = parent.offsetWidth);
    let height = (canvas.height = parent.offsetHeight);

    initParticles(width, height);

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", onMouse, { passive: true });
    canvas.addEventListener("mouseleave", onMouseLeave, { passive: true });

    let frameSkip = 0;

    const draw = () => {
      // Throttle to ~30fps instead of 60fps
      frameSkip++;
      if (frameSkip % 2 !== 0) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const len = particles.length;

      for (let i = 0; i < len; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse repulsion (simplified)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        if (Math.abs(dx) < 100 && Math.abs(dy) < 100) {
          const dist = dx * dx + dy * dy;
          if (dist < 10000) {
            p.x += dx * 0.015;
            p.y += dy * 0.015;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 6.283);
        ctx.fillStyle = `rgba(${PARTICLE_COLOR_R},${PARTICLE_COLOR_G},${PARTICLE_COLOR_B},${p.opacity})`;
        ctx.fill();

        // Connections — only check nearby particles (skip far ones early)
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          if (cdx > CONNECTION_DISTANCE || cdx < -CONNECTION_DISTANCE) continue;
          const cdy = p.y - p2.y;
          if (cdy > CONNECTION_DISTANCE || cdy < -CONNECTION_DISTANCE) continue;
          const cDistSq = cdx * cdx + cdy * cdy;
          if (cDistSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
            const lineOpacity = (1 - Math.sqrt(cDistSq) / CONNECTION_DISTANCE) * 0.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${PARTICLE_COLOR_R},${PARTICLE_COLOR_G},${PARTICLE_COLOR_B},${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = parent.offsetWidth;
        height = canvas.height = parent.offsetHeight;
      }, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
