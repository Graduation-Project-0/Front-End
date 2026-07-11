import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl, ENDPOINTS } from "../config/endpoints";

function TacticalGridCanvas({ isScanning }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const touchRipplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          active: true,
        };
      }
    };
    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        const tx = e.touches[0].clientX;
        const ty = e.touches[0].clientY;
        mouseRef.current = { x: tx, y: ty, active: true };
        touchRipplesRef.current.push({
          x: tx,
          y: ty,
          radius: 5,
          maxRadius: Math.max(width, height) * 0.4,
          alpha: 0.9,
        });
      }
    };
    const handleMouseDown = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      touchRipplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: Math.max(width, height) * 0.4,
        alpha: 0.9,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("mousedown", handleMouseDown);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const gridSize = 50;
    let scanLineY = 0;

    // Optical Highway Nodes (Representing Origin Servers, Gateways, and Redirect Hops)
    const nodeCount = Math.min(Math.floor((width * height) / 18000), 48);
    const nodes = Array.from({ length: nodeCount }, (_, idx) => ({
      id: idx,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2.2 + 1.5,
      alpha: Math.random() * 0.5 + 0.3,
      sonarRadius: Math.random() * 45,
      sonarMax: 40 + Math.random() * 50,
      sonarSpeed: 0.35 + Math.random() * 0.4,
      isGateway: idx % 4 === 0,
      pulseIntensity: 0,
    }));

    // Pre-calculate Optical Routes between nearby hops
    const links = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 190) {
          links.push({
            source: nodes[i],
            target: nodes[j],
            dist,
            isRedirectChain: nodes[i].isGateway || nodes[j].isGateway,
          });
        }
      }
    }

    // High-Velocity Optical Link Packets (Redirect Stream Bursts)
    const packetCount = isScanning ? 55 : 22;
    const packets = Array.from({ length: packetCount }, () => {
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      const target = nodes[Math.floor(Math.random() * nodes.length)];
      return {
        x: source.x,
        y: source.y,
        source,
        target,
        progress: Math.random(),
        speed: 0.007 + Math.random() * 0.012,
        length: 14 + Math.random() * 18,
        color: Math.random() > 0.25 ? "#4ade80" : "#22c55e",
        trail: [],
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep Cyber Black / Tactical Emerald Background Vignette
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 3,
        60,
        width / 2,
        height / 2,
        Math.max(width, height),
      );
      bgGrad.addColorStop(0, "#031402");
      bgGrad.addColorStop(0.45, "#000000");
      bgGrad.addColorStop(1, "#000000");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Tactical Routing Grid
      ctx.lineWidth = 1;
      const gridAlpha = isScanning ? 0.2 : 0.1;
      ctx.strokeStyle = `rgba(30, 125, 4, ${gridAlpha})`;
      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Deep URL Inspection Laser Sweep Beam
      if (!prefersReducedMotion) {
        const scanSpeed = isScanning ? 4.8 : 1.3;
        scanLineY = (scanLineY + scanSpeed) % height;

        const sweepGrad = ctx.createLinearGradient(
          0,
          scanLineY - 140,
          0,
          scanLineY,
        );
        sweepGrad.addColorStop(0, "rgba(34, 197, 94, 0)");
        sweepGrad.addColorStop(
          0.8,
          isScanning ? "rgba(34, 197, 94, 0.18)" : "rgba(30, 125, 4, 0.07)",
        );
        sweepGrad.addColorStop(
          1,
          isScanning ? "rgba(74, 222, 128, 0.45)" : "rgba(34, 197, 94, 0.22)",
        );
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, scanLineY - 140, width, 140);

        ctx.strokeStyle = isScanning
          ? "rgba(74, 222, 128, 0.85)"
          : "rgba(34, 197, 94, 0.4)";
        ctx.lineWidth = isScanning ? 2 : 1.2;
        ctx.beginPath();
        ctx.moveTo(0, scanLineY);
        ctx.lineTo(width, scanLineY);
        ctx.stroke();
      }

      const speedMultiplier = isScanning ? 2.8 : 1.0;
      const mouse = mouseRef.current;

      // Update & Render Touch/Click Shockwaves (DNS Intercept Waves)
      for (let i = touchRipplesRef.current.length - 1; i >= 0; i--) {
        const ripple = touchRipplesRef.current[i];
        ripple.radius += 7.5 * speedMultiplier;
        ripple.alpha = (1 - ripple.radius / ripple.maxRadius) * 0.85;

        if (ripple.radius >= ripple.maxRadius || ripple.alpha <= 0) {
          touchRipplesRef.current.splice(i, 1);
          continue;
        }

        // Concentric Optical Ring
        ctx.strokeStyle = `rgba(74, 222, 128, ${ripple.alpha})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(34, 197, 94, ${ripple.alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius * 0.85, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!prefersReducedMotion) {
          node.x += node.vx * speedMultiplier;
          node.y += node.vy * speedMultiplier;
          node.sonarRadius += node.sonarSpeed * speedMultiplier;

          if (node.sonarRadius > node.sonarMax) {
            node.sonarRadius = 0;
          }

          if (node.x < 0) node.x = width;
          if (node.x > width) node.x = 0;
          if (node.y < 0) node.y = height;
          if (node.y > height) node.y = 0;
        }

        // Check if touched/probed by mouse/touch or hit by shockwave ripple
        const distToMouse = mouse.active
          ? Math.sqrt((node.x - mouse.x) ** 2 + (node.y - mouse.y) ** 2)
          : 9999;
        const isProbed = distToMouse < 200;

        let hitByRipple = false;
        for (const ripple of touchRipplesRef.current) {
          const distToRipple = Math.abs(
            Math.sqrt((node.x - ripple.x) ** 2 + (node.y - ripple.y) ** 2) -
              ripple.radius,
          );
          if (distToRipple < 25) hitByRipple = true;
        }

        if (isProbed || hitByRipple) {
          node.pulseIntensity = Math.min(1, node.pulseIntensity + 0.15);
        } else {
          node.pulseIntensity = Math.max(0, node.pulseIntensity - 0.03);
        }

        // Draw DNS Sonar Rings (Gateway & Probed Nodes)
        const sonarProgress = node.sonarRadius / node.sonarMax;
        const sonarAlpha =
          (1 - sonarProgress) *
          (node.pulseIntensity > 0 || isScanning ? 0.6 : 0.2);
        ctx.strokeStyle = `rgba(34, 197, 94, ${sonarAlpha})`;
        ctx.lineWidth = node.isGateway || node.pulseIntensity > 0 ? 1.8 : 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.sonarRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Render Optical Fiber Routes (No Text, Clean & Sleek Links)
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const dx = link.source.x - link.target.x;
        const dy = link.source.y - link.target.y;
        const currentDist = Math.sqrt(dx * dx + dy * dy);

        if (currentDist < 190) {
          const intensity = Math.max(
            link.source.pulseIntensity,
            link.target.pulseIntensity,
          );
          const linkAlpha =
            (1 - currentDist / 190) *
            (0.25 + intensity * 0.6 + (isScanning ? 0.25 : 0));

          ctx.strokeStyle =
            intensity > 0.3
              ? `rgba(134, 239, 172, ${Math.min(1, linkAlpha * 1.3)})`
              : `rgba(34, 197, 94, ${Math.min(1, linkAlpha)})`;
          ctx.lineWidth = link.isRedirectChain || intensity > 0.3 ? 1.5 : 0.8;

          ctx.beginPath();
          ctx.moveTo(link.source.x, link.source.y);
          ctx.lineTo(link.target.x, link.target.y);
          ctx.stroke();
        }
      }

      // Render Node Cores
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const coreAlpha =
          node.alpha + node.pulseIntensity * 0.5 + (isScanning ? 0.2 : 0);
        ctx.fillStyle =
          node.isGateway || node.pulseIntensity > 0.2
            ? `rgba(134, 239, 172, ${Math.min(1, coreAlpha * 1.4)})`
            : `rgba(74, 222, 128, ${Math.min(1, coreAlpha)})`;
        ctx.beginPath();
        ctx.arc(
          node.x,
          node.y,
          node.isGateway || node.pulseIntensity > 0
            ? node.radius * 2
            : node.radius,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      // Render High-Velocity Optical Link Packets with Touch Deflection
      if (!prefersReducedMotion) {
        for (let i = 0; i < packets.length; i++) {
          const pkt = packets[i];
          pkt.progress += pkt.speed * speedMultiplier;

          if (pkt.progress >= 1) {
            pkt.progress = 0;
            pkt.source = nodes[Math.floor(Math.random() * nodes.length)];
            pkt.target = nodes[Math.floor(Math.random() * nodes.length)];
          }

          const dx = pkt.target.x - pkt.source.x;
          const dy = pkt.target.y - pkt.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 10 && dist < 300) {
            let px = pkt.source.x + dx * pkt.progress;
            let py = pkt.source.y + dy * pkt.progress;

            // Interactive Link Deflection / Gravity towards Mouse or Touch
            if (mouse.active) {
              const mdx = mouse.x - px;
              const mdy = mouse.y - py;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mdist < 180 && mdist > 5) {
                const pull = (1 - mdist / 180) * 16;
                px += (mdx / mdist) * pull;
                py += (mdy / mdist) * pull;
              }
            }

            const angle = Math.atan2(dy, dx);

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(angle);

            ctx.shadowColor = isScanning ? "#22c55e" : "#1E7D04";
            ctx.shadowBlur = isScanning ? 14 : 8;
            ctx.fillStyle = pkt.color;
            ctx.beginPath();
            ctx.roundRect(-pkt.length / 2, -2, pkt.length, 4, 2);
            ctx.fill();

            ctx.restore();
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("mousedown", handleMouseDown);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isScanning]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}

function validateUrlAsset(rawUrl) {
  if (!rawUrl || !rawUrl.trim()) {
    return { valid: false, error: "Please enter a URL to inspect." };
  }
  let normalized = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  try {
    const parsed = new URL(normalized);
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return {
        valid: false,
        error:
          "Invalid domain syntax. Please enter a valid fully qualified domain name (e.g., example.com).",
      };
    }
    return { valid: true, normalizedUrl: normalized };
  } catch (err) {
    return {
      valid: false,
      error: "Malformed URL syntax. Please verify protocol and domain format.",
    };
  }
}

export default function UrlPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(() => {
    return (
      localStorage.getItem("vanguard_url_pre_scan_acknowledged") !== "true"
    );
  });

  const navigate = useNavigate();
  const location = useLocation();
  const scanAbortControllerRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get("target");
    if (target) {
      try {
        const parsedUrl = new URL(target);
        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname !== "/" ? parsedUrl.pathname : ""}`;
        setUrl(baseUrl);
      } catch {
        setError(
          "Warning: The target URL parameter passed in query string is malformed.",
        );
        setUrl(target);
      }
    }
  }, [location.search]);

  const handleAcknowledgeInstructions = () => {
    localStorage.setItem("vanguard_url_pre_scan_acknowledged", "true");
    setShowInstructions(false);
  };

  const handleClearUrl = (e) => {
    if (e) e.stopPropagation();
    if (scanAbortControllerRef.current) {
      scanAbortControllerRef.current.abort();
    }
    setLoading(false);
    setUrl("");
    setError("");
  };

  const handleCancelScan = () => {
    if (scanAbortControllerRef.current) {
      scanAbortControllerRef.current.abort();
    }
    setLoading(false);
    setError("URL inspection aborted by user.");
  };

  const handleScan = async () => {
    const validation = validateUrlAsset(url);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const normalizedUrl = validation.normalizedUrl;
    if (normalizedUrl !== url) {
      setUrl(normalizedUrl);
    }

    setLoading(true);
    setError("");

    const controller = new AbortController();
    scanAbortControllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(
          "Active security clearance required. Please log in to access Vanguard URL Telemetry.",
        );
        setLoading(false);
        clearTimeout(timeoutId);
        return;
      }

      const standardRes = await fetch(apiUrl(ENDPOINTS.STANDARD_SCAN_URL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: normalizedUrl }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (standardRes.status === 200) {
        const standardData = await standardRes.json();
        sessionStorage.setItem(
          "scanResultStandard",
          JSON.stringify(standardData),
        );
        sessionStorage.removeItem("scanResultAdvanced");
        sessionStorage.setItem("pendingAdvancedUrl", normalizedUrl);
        navigate("/urlstandard");
      } else if (standardRes.status === 401 || standardRes.status === 403) {
        setError(
          "Security session expired or access denied (401/403). Please re-authenticate.",
        );
      } else if (standardRes.status === 429) {
        setError(
          "URL scan rate limit reached (429). Please wait 60 seconds before retrying.",
        );
      } else {
        let backendError =
          "Scan initialization failed. Please verify link integrity and retry.";
        try {
          const errPayload = await standardRes.json();
          if (errPayload && (errPayload.message || errPayload.error)) {
            backendError = `Telemetry error (${standardRes.status}): ${errPayload.message || errPayload.error}`;
          }
        } catch (_) {
          // Fallback if non-JSON
        }
        setError(backendError);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        setError("URL inspection timed out after 30 seconds or was cancelled.");
      } else {
        setError("Network connection exception while verifying target URL.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleWindowKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (url && !loading) {
        if (e.key === "Escape") {
          e.preventDefault();
          handleClearUrl();
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleScan();
        }
      }
    };
    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [url, loading]);

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-[100vw] flex-col items-center justify-center overflow-x-hidden bg-black pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 text-white">
      <TacticalGridCanvas isScanning={loading} />

      <div className="relative z-10 flex w-full justify-center px-2 sm:px-4 md:px-6">
        <div className="w-full min-w-0 max-w-2xl shrink-0 py-2 text-center md:w-[min(44rem,100%)]">
          <h1 className="font-['Gargoyles',system-ui,sans-serif] text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-[0_0_15px_rgba(30,125,4,0.3)]">
            Vanguard inspects every URL in real time
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl mx-auto mb-5">
            Detect malicious patterns, phishing attempts, and hidden zero-day
            risks instantly.
          </p>

          {/* Pre-Scan Safety Onboarding Checklist */}
          {showInstructions ? (
            <div className="mb-5 rounded-2xl border border-green-700/80 bg-[#0c0f0c] p-4 sm:p-5 text-left shadow-[0_0_25px_rgba(0,255,0,0.15)] animate-[fadeIn_0.3s_ease-out]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-green-900/60 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E7D04] font-bold text-white shadow-[0_0_10px_rgba(30,125,4,0.5)]">
                    ✓
                  </span>
                  <div>
                    <h2 className="font-['Gargoyles',system-ui,sans-serif] text-sm sm:text-base font-bold text-white tracking-tight">
                      Pre-Scan Safety Protocol
                    </h2>
                    <p className="text-[11px] text-green-400">
                      Mandatory safety procedure before analyzing external links
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAcknowledgeInstructions}
                  className="shrink-0 rounded-full bg-[#1E7D04] px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#0A3301] hover:shadow-[0_0_15px_rgba(30,125,4,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                  Acknowledge &amp; Collapse
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl border border-green-900/40 bg-black/50 p-3">
                  <div className="flex items-center gap-2 font-semibold text-white mb-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-[10px] text-black font-bold">
                      1
                    </span>
                    <span>Copy &amp; Inspect</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Copy any suspicious link from emails, messages, or web
                    posts.{" "}
                    <strong className="text-white">
                      Do NOT click or open the link locally
                    </strong>
                    —paste it safely here first.
                  </p>
                </div>

                <div className="rounded-xl border border-green-900/40 bg-black/50 p-3">
                  <div className="flex items-center gap-2 font-semibold text-white mb-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-[10px] text-black font-bold">
                      2
                    </span>
                    <span>Target Ingestion</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Paste the target URL (`https://...`) into the scanner box
                    below. Vanguard normalizes and validates schema formatting
                    automatically.
                  </p>
                </div>

                <div className="rounded-xl border border-green-900/40 bg-black/50 p-3">
                  <div className="flex items-center gap-2 font-semibold text-white mb-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-[10px] text-black font-bold">
                      3
                    </span>
                    <span>Multi-Engine Scan</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Click <strong className="text-white">Scan URL</strong> or
                    press <strong className="text-white">Enter</strong> for
                    real-time inspection (phishing, malware, redirect loops).
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-5 flex justify-center">
              <button
                type="button"
                onClick={() => setShowInstructions(true)}
                aria-expanded={showInstructions}
                className="inline-flex items-center gap-2 rounded-full border border-green-800/60 bg-[#0c0f0c] px-4 py-1.5 text-xs font-medium text-green-400 transition-all hover:border-green-600 hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40"
              >
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Pre-Scan Safety Protocol (3 Steps)</span>
                <span className="text-gray-400 text-xs ml-1">
                  &bull; Click to view
                </span>
              </button>
            </div>
          )}

          {/* URL Scanner Container */}
          <div className="relative mb-6 rounded-2xl border border-[#1E7D04] bg-[#0c0f0c] p-5 text-left shadow-[0_0_20px_rgba(30,125,4,0.2)] transition-all">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1 bg-black/70 rounded-xl border border-green-900/60 px-4 py-3 focus-within:border-[#22c55e] focus-within:ring-1 focus-within:ring-[#22c55e] transition-all">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-950/80 border border-green-800/60 text-xs font-bold text-green-400 font-mono">
                  URL
                </span>
                <input
                  type="text"
                  placeholder="https://suspicious-domain.example.com/login"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleScan();
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      handleClearUrl();
                    }
                  }}
                  aria-label="URL to scan"
                  disabled={loading}
                  className="min-w-0 flex-1 bg-transparent text-sm sm:text-base text-gray-200 placeholder-gray-500 font-mono focus:outline-none disabled:opacity-50"
                />
                {url && !loading && (
                  <button
                    type="button"
                    onClick={handleClearUrl}
                    aria-label="Clear URL field"
                    className="shrink-0 rounded-md p-1 text-gray-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-400"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="shrink-0 flex items-center justify-end gap-2">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-950/50 border border-green-800 px-4 py-3 rounded-full">
                      <svg
                        className="motion-safe:animate-spin h-4 w-4 text-green-400 shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Inspecting...</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelScan}
                      aria-label="Cancel active URL scan"
                      className="cursor-pointer rounded-full border border-red-900/60 bg-red-950/30 px-5 py-3 text-xs font-semibold text-red-400 hover:border-red-600 hover:bg-red-950/60 hover:text-red-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleScan}
                    disabled={!url.trim()}
                    className="cursor-pointer w-full sm:w-auto py-3 px-8 rounded-full font-semibold text-white bg-gradient-to-r from-[#1E7D04] to-[#0A3301] hover:opacity-90 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(30,125,4,0.3)]"
                  >
                    Scan URL
                  </button>
                )}
              </div>
            </div>

            {!loading && (
              <div className="mt-3 border-t border-green-950/80 pt-2.5 flex items-center justify-between text-[11px] text-gray-500">
                <span>
                  Status:{" "}
                  <strong className="text-green-400">
                    Ready for Real-Time Threat Telemetry
                  </strong>
                </span>
                <span className="hidden sm:inline">
                  Press{" "}
                  <kbd className="bg-black border border-green-900/60 px-1.5 py-0.5 rounded text-gray-300 font-mono">
                    Enter
                  </kbd>{" "}
                  to scan or{" "}
                  <kbd className="bg-black border border-green-900/60 px-1.5 py-0.5 rounded text-gray-300 font-mono">
                    Esc
                  </kbd>{" "}
                  to clear
                </span>
              </div>
            )}
          </div>

          {/* Diagnostic Error Notice */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-5 rounded-xl border border-red-800/80 bg-red-950/40 p-4 text-left shadow-[0_0_20px_rgba(248,113,113,0.15)] flex items-start justify-between gap-3 animate-[fadeIn_0.2s_ease-out]"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-900/80 text-xs font-bold text-red-300">
                  !
                </span>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    URL Telemetry / Inspection Exception
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-gray-200 leading-relaxed break-words">
                    {error}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error notice"
                className="shrink-0 rounded bg-red-950/80 border border-red-800/60 px-2.5 py-1 text-xs font-semibold text-red-400 hover:border-red-500 hover:text-white transition-all"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Contextual Help */}
      <div className="fixed bottom-5 right-5 z-20">
        <button
          type="button"
          onClick={() => setShowInstructions(!showInstructions)}
          aria-expanded={showInstructions}
          aria-label="Toggle Pre-Scan Safety Guide"
          className="flex items-center gap-2 rounded-full border border-[#1E7D04] bg-[#0c0f0c] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(30,125,4,0.3)] transition-all hover:bg-[#025714] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1E7D04] text-[10px] font-bold text-white">
            ?
          </span>
          <span>Pre-Scan Guide</span>
        </button>
      </div>
    </div>
  );
}
