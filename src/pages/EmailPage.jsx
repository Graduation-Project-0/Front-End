import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl, ENDPOINTS } from "../config/endpoints";

function EmailGridCanvas({ isScanning, isDragging }) {
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

    const gridSize = 48;
    let scanLineY = 0;

    // Email Telemetry Nodes (MIME blocks & SMTP Relays)
    const nodeCount = Math.min(Math.floor((width * height) / 22000), 45);
    const nodes = Array.from({ length: nodeCount }, (_, idx) => ({
      id: idx,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2.2 + 1.2,
      alpha: Math.random() * 0.5 + 0.25,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      pulseVal: Math.random() * Math.PI * 2,
      isAttachmentNode: idx % 4 === 0,
    }));

    // Pre-calculate interconnections between nearby relay hops
    const links = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 170) {
          links.push({
            source: nodes[i],
            target: nodes[j],
            dist,
            isSecureLink:
              nodes[i].isAttachmentNode || nodes[j].isAttachmentNode,
          });
        }
      }
    }

    // SMTP Data Stream Packets
    const packetCount = isScanning ? 50 : isDragging ? 35 : 18;
    const packets = Array.from({ length: packetCount }, () => {
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      const target = nodes[Math.floor(Math.random() * nodes.length)];
      return {
        x: source.x,
        y: source.y,
        source,
        target,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
        length: 12 + Math.random() * 16,
        color: Math.random() > 0.3 ? "#4ade80" : "#22c55e",
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

      // 1. Tactical Grid & Plus-Marks
      ctx.lineWidth = 1;
      const baseGridAlpha = isScanning ? 0.12 : isDragging ? 0.14 : 0.065;
      ctx.strokeStyle = `rgba(30, 125, 4, ${baseGridAlpha})`;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Plus intersections
      ctx.strokeStyle = isScanning
        ? "rgba(74, 222, 128, 0.35)"
        : "rgba(34, 197, 94, 0.22)";
      ctx.lineWidth = 1.2;
      for (let x = gridSize; x < width; x += gridSize * 2) {
        for (let y = gridSize; y < height; y += gridSize * 2) {
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.stroke();
        }
      }

      // 2. Touch/Click Ripples
      if (!prefersReducedMotion) {
        for (let i = touchRipplesRef.current.length - 1; i >= 0; i--) {
          const ripple = touchRipplesRef.current[i];
          ripple.radius += 4.5;
          ripple.alpha -= 0.015;

          if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
            touchRipplesRef.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 197, 94, ${ripple.alpha * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // 3. Radar Sweep / Scanline
      if (!prefersReducedMotion) {
        scanLineY += isScanning ? 6.5 : isDragging ? 3.5 : 1.8;
        if (scanLineY > height + 150) scanLineY = -150;

        const sweepGrad = ctx.createLinearGradient(
          0,
          scanLineY - 140,
          0,
          scanLineY,
        );
        sweepGrad.addColorStop(0, "rgba(30, 125, 4, 0)");
        sweepGrad.addColorStop(
          0.7,
          isScanning ? "rgba(34, 197, 94, 0.16)" : "rgba(30, 125, 4, 0.08)",
        );
        sweepGrad.addColorStop(
          1,
          isScanning ? "rgba(74, 222, 128, 0.45)" : "rgba(34, 197, 94, 0.26)",
        );
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, scanLineY - 140, width, 140);

        ctx.strokeStyle = isScanning
          ? "rgba(74, 222, 128, 0.75)"
          : "rgba(34, 197, 94, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, scanLineY);
        ctx.lineTo(width, scanLineY);
        ctx.stroke();
      }

      // 4. Relay Links & Nodes
      const speedMultiplier = isScanning ? 2.6 : isDragging ? 1.8 : 1.0;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!prefersReducedMotion) {
          node.x += node.vx * speedMultiplier;
          node.y += node.vy * speedMultiplier;
          node.pulseVal += node.pulseSpeed * speedMultiplier;

          if (node.x < 0) node.x = width;
          if (node.x > width) node.x = 0;
          if (node.y < 0) node.y = height;
          if (node.y > height) node.y = 0;

          // Mouse proximity repulsion
          if (mouseRef.current.active) {
            const dx = node.x - mouseRef.current.x;
            const dy = node.y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130 && dist > 0.1) {
              const force = (1 - dist / 130) * 1.8;
              node.x += (dx / dist) * force;
              node.y += (dy / dist) * force;
            }
          }
        }

        const currentAlpha = node.alpha * (0.6 + 0.4 * Math.sin(node.pulseVal));

        // Draw connections
        for (let j = 0; j < links.length; j++) {
          const link = links[j];
          if (link.source.id === node.id) {
            const dx = link.source.x - link.target.x;
            const dy = link.source.y - link.target.y;
            const currentDistSq = dx * dx + dy * dy;
            const maxDist = 170;
            if (currentDistSq < maxDist * maxDist) {
              const currentDist = Math.sqrt(currentDistSq);
              const linkAlpha =
                (1 - currentDist / maxDist) *
                0.26 *
                (isScanning ? 1.6 : isDragging ? 1.3 : 1);
              ctx.strokeStyle = link.isSecureLink
                ? `rgba(74, 222, 128, ${linkAlpha * 1.3})`
                : `rgba(34, 197, 94, ${linkAlpha})`;
              ctx.lineWidth = link.isSecureLink ? 1.1 : 0.8;
              ctx.beginPath();
              ctx.moveTo(link.source.x, link.source.y);
              ctx.lineTo(link.target.x, link.target.y);
              ctx.stroke();
            }
          }
        }

        // Draw node dot
        ctx.fillStyle = node.isAttachmentNode
          ? `rgba(74, 222, 128, ${Math.min(1, currentAlpha * 1.5)})`
          : `rgba(34, 197, 94, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        if (node.isAttachmentNode && isScanning) {
          ctx.strokeStyle = `rgba(74, 222, 128, ${currentAlpha * 0.7})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 5. SMTP Data Stream Packets
      if (!prefersReducedMotion) {
        for (let i = 0; i < packets.length; i++) {
          const pkt = packets[i];
          pkt.progress += pkt.speed * (isScanning ? 2.5 : isDragging ? 1.6 : 1);

          if (pkt.progress >= 1) {
            pkt.source = nodes[Math.floor(Math.random() * nodes.length)];
            pkt.target = nodes[Math.floor(Math.random() * nodes.length)];
            pkt.progress = 0;
            pkt.x = pkt.source.x;
            pkt.y = pkt.source.y;
            pkt.trail = [];
          } else {
            const currentX =
              pkt.source.x + (pkt.target.x - pkt.source.x) * pkt.progress;
            const currentY =
              pkt.source.y + (pkt.target.y - pkt.source.y) * pkt.progress;

            pkt.trail.push({ x: currentX, y: currentY });
            if (pkt.trail.length > pkt.length) {
              pkt.trail.shift();
            }

            pkt.x = currentX;
            pkt.y = currentY;

            if (pkt.trail.length > 1) {
              ctx.beginPath();
              ctx.moveTo(pkt.trail[0].x, pkt.trail[0].y);
              for (let t = 1; t < pkt.trail.length; t++) {
                ctx.lineTo(pkt.trail[t].x, pkt.trail[t].y);
              }
              ctx.strokeStyle = pkt.color;
              ctx.lineWidth = isScanning ? 2.2 : 1.5;
              ctx.stroke();
            }

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(pkt.x, pkt.y, isScanning ? 2.2 : 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isScanning, isDragging]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}

export default function EmailPage() {
  const [file, setFile] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowInstructions(false);
    };
    if (showInstructions) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showInstructions]);

  useEffect(() => {
    const preventWindowDrop = (e) => {
      e.preventDefault();
    };
    window.addEventListener("dragover", preventWindowDrop);
    window.addEventListener("drop", preventWindowDrop);
    return () => {
      window.removeEventListener("dragover", preventWindowDrop);
      window.removeEventListener("drop", preventWindowDrop);
    };
  }, []);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    const validExtensions = [".eml", ".msg", ".mbox"];
    const fileExt = selectedFile.name.includes(".")
      ? selectedFile.name
          .substring(selectedFile.name.lastIndexOf("."))
          .toLowerCase()
      : "";
    if (!validExtensions.includes(fileExt)) {
      setError(
        `Invalid file format (${fileExt || "unknown"}). Please upload a valid .eml, .msg, or .mbox email file.`,
      );
      return false;
    }
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError(
        `File exceeds the 25MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB). Please upload a smaller file.`,
      );
      return false;
    }
    setError("");
    return true;
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setFile(null);
      return;
    }
    if (files.length > 1) {
      setError(
        `Multiple files selected (${files.length}). Vanguard currently inspects one email file per scan. Selected: "${files[0].name}".`,
      );
    }
    const selected = files[0];
    if (selected && validateFile(selected)) {
      setFile(selected);
    } else if (!selected) {
      setFile(null);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) {
      setError(
        "Invalid drop content. Please save and drop a valid .eml, .msg, or .mbox email file.",
      );
      return;
    }
    if (files.length > 1) {
      setError(
        `Multiple files dropped (${files.length}). Vanguard currently inspects one email file per scan. Selected: "${files[0].name}".`,
      );
    }

    const dropped = files[0];
    if (dropped && validateFile(dropped)) {
      setFile(dropped);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (
      e.currentTarget &&
      e.relatedTarget &&
      e.currentTarget.contains(e.relatedTarget)
    ) {
      return;
    }
    setIsDragging(false);
  };

  const handleScan = async () => {
    try {
      setLoading(true);
      setError("");

      if (!file) {
        setError("Please select an email file first.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("email", file); // ← اسم الحقل الصحيح

      const res = await fetch(apiUrl(ENDPOINTS.STANDARD_SCAN_EMAIL), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const serverReply = await res.text();
        console.log("SERVER REPLY:", serverReply);
        throw new Error(`Scan failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("RESULT: ", data);

      // ---- تخزين الريسبونس في sessionStorage ----
      sessionStorage.setItem("emailScanResult", JSON.stringify(data));

      // ---- redirect على صفحة الاوت بوت ----
      navigate("/email-output");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-black pt-20 text-white">
      <EmailGridCanvas isScanning={loading} isDragging={isDragging} />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/service.png')] bg-cover bg-center opacity-20 mix-blend-screen" />
      <div className="relative z-10 flex w-full justify-center px-4 sm:px-6 md:px-8">
        <div className="w-full min-w-0 max-w-2xl shrink-0 pb-24 pt-8 md:w-[min(42rem,100%)] md:pt-12">
          <h1 className="mb-4 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            No email goes unchecked
          </h1>

          <p className="mb-8 text-center leading-relaxed text-gray-400">
            Vanguard scans every email in real time to detect phishing attempts,
            malicious attachments, and hidden risks before they reach your inbox
          </p>

          <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className="inline-flex items-center gap-2 rounded-full border border-green-800/60 bg-black/50 px-4 py-2 text-sm font-medium text-green-400 transition hover:border-green-600 hover:bg-green-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600/20 text-xs font-bold text-green-400">
                ?
              </span>
              <span>How to export .eml / .msg / .mbox files</span>
            </button>
          </div>

          {showInstructions && (
            <div
              role="region"
              aria-label="Email export instructions"
              className="mb-8 overflow-hidden rounded-2xl border border-green-700/80 bg-[#0c0f0c] p-6 text-left shadow-[0_0_25px_rgba(30,125,4,0.3)] transition-all animate-[fadeIn_0.25s_ease-out]"
            >
              <div className="flex items-center justify-between border-b border-green-900/50 pb-4">
                <h3 className="text-base font-semibold text-green-400 sm:text-lg">
                  Exporting Email Files for Inspection
                </h3>
                <button
                  type="button"
                  onClick={() => setShowInstructions(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-green-950/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                  aria-label="Close instructions"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-gray-300">
                <div className="rounded-xl border border-green-900/30 bg-black/40 p-4">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 text-xs font-bold text-green-400">
                    1. Locate
                  </span>
                  <p className="mt-2 text-gray-400">
                    Open your email client (Outlook, Gmail, Thunderbird) and
                    locate the suspicious message.
                  </p>
                </div>
                <div className="rounded-xl border border-green-900/30 bg-black/40 p-4">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 text-xs font-bold text-green-400">
                    2. Export
                  </span>
                  <p className="mt-2 text-gray-400">
                    Right-click or open message options &rarr; select{" "}
                    <strong className="text-white">Save As</strong>,{" "}
                    <strong className="text-white">
                      Download message (.eml)
                    </strong>
                    , or <strong className="text-white">Export</strong>.
                  </p>
                </div>
                <div className="rounded-xl border border-green-900/30 bg-black/40 p-4">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 text-xs font-bold text-green-400">
                    3. Scan
                  </span>
                  <p className="mt-2 text-gray-400">
                    Drop the saved{" "}
                    <strong className="text-green-300">.eml</strong>,{" "}
                    <strong className="text-green-300">.msg</strong>, or{" "}
                    <strong className="text-green-300">.mbox</strong> file into
                    the secure box below.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Box */}
          <div
            role="region"
            aria-label="Email file upload dropzone"
            aria-invalid={error ? "true" : "false"}
            className={`mb-8 relative rounded-2xl border p-6 transition-all sm:p-10 focus-within:ring-2 focus-within:ring-[#1E7D04] ${
              isDragging
                ? "border-green-400 bg-[#0A3301]/40 shadow-[0_0_30px_rgba(30,125,4,0.5)] scale-[1.01]"
                : error
                  ? "border-red-500/60 bg-red-950/15 hover:border-red-500/80"
                  : "border-green-800/50 bg-black/40 hover:border-green-700 hover:bg-black/50"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="fileInput"
              accept=".eml,.msg,.mbox"
              onChange={handleFileChange}
              disabled={loading}
              className="sr-only peer"
            />
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center space-y-3 cursor-pointer w-full h-full text-center"
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 ${
                  isDragging
                    ? "border-green-400 bg-green-500/20 scale-110 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    : file
                      ? "border-green-600/50 bg-green-950/40"
                      : "border-green-800/40 bg-black/60 hover:scale-105"
                }`}
              >
                <img
                  src="/icons/browse.svg"
                  alt="browse or drop email file"
                  className={`w-9 h-9 transition-transform duration-300 ${isDragging ? "scale-110 opacity-100" : "opacity-90"}`}
                />
              </div>

              {file ? (
                <div className="flex flex-col items-center max-w-full px-2">
                  <div className="flex items-center gap-2 max-w-full">
                    <span
                      className="truncate max-w-[14rem] sm:max-w-xs font-semibold text-green-300 text-base"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                  </div>
                  <span className="mt-1 text-xs font-medium text-gray-400">
                    {formatFileSize(file.size)} • Ready for tactical inspection
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                      setError("");
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-950/30 px-3 py-1 text-xs font-medium text-red-400 transition hover:border-red-500 hover:bg-red-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    aria-label={`Remove file ${file.name}`}
                  >
                    <span>✕ Remove file</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-medium text-gray-200">
                    {isDragging ? (
                      <span className="text-green-400 font-semibold animate-pulse">
                        Release to inspect email file...
                      </span>
                    ) : (
                      <>
                        Drag &amp; drop or{" "}
                        <span className="text-green-400 underline decoration-green-600/60 underline-offset-4">
                          browse
                        </span>{" "}
                        to upload
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports .eml, .msg, and .mbox files up to 25MB
                  </p>
                </div>
              )}
            </label>
          </div>

          <button
            onClick={handleScan}
            disabled={!file || loading}
            className="cursor-pointer w-full max-w-xs mx-auto block mt-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-[#1E7D04] to-[#0A3301] hover:brightness-110 shadow-[0_3px_15px_rgba(30,125,4,0.35)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Scanning..." : "Scan Email"}
          </button>

          {loading && (
            <div
              aria-live="polite"
              className="mt-3 text-center text-sm text-green-400/80 animate-pulse"
            >
              Analyzing email structure and attachments in real time...
            </div>
          )}

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-950/20 p-4 text-left text-sm text-red-400 sm:text-base shadow-lg"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 font-bold text-red-400">
                !
              </span>
              <div className="flex-1">
                <p className="font-semibold text-red-300">Scan Error</p>
                <p className="mt-0.5 text-red-400">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
