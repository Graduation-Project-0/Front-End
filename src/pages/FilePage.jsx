import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl, ENDPOINTS } from "../config/endpoints";
import { setPendingAdvancedFile } from "../utils/pendingScanFile";

const DB_NAME = "VanguardFileStorage";
const STORE_NAME = "stagedFile";

const ALLOWED_EXTENSIONS = [".exe", ".dll"];

function validateFileAsset(file) {
  if (!file) return { valid: false, error: "No asset provided." };
  if (file.size > 100 * 1024 * 1024) {
    return {
      valid: false,
      error: `Asset (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the mandatory 100MB sandbox ceiling.`,
    };
  }
  if (file.size === 0) {
    return {
      valid: false,
      error: "Asset size is 0 bytes. Cannot inspect empty file.",
    };
  }
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext),
  );

  if (!hasValidExtension) {
    const ext = fileName.includes(".")
      ? `.${fileName.split(".").pop()}`
      : "unknown format";
    return {
      valid: false,
      error: `Invalid file format (${ext}). Vanguard Sandbox strictly accepts Windows Executable and Dynamic Link Library binaries (.exe, .dll).`,
    };
  }
  return { valid: true };
}

async function saveStagedFileToDB(file) {
  if (!file) return;
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put(file, "currentAsset");
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      };
      request.onerror = () => resolve();
    } catch (_) {
      resolve();
    }
  });
}

async function loadStagedFileFromDB() {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get("currentAsset");
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
}

async function clearStagedFileFromDB() {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = (e) => {
        const db = e.target.result;
        if (db.objectStoreNames.contains(STORE_NAME)) {
          const tx = db.transaction(STORE_NAME, "readwrite");
          tx.objectStore(STORE_NAME).delete("currentAsset");
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } else {
          resolve();
        }
      };
      request.onerror = () => resolve();
    } catch (_) {
      resolve();
    }
  });
}

function TacticalGridCanvas({ isScanning, isDragging }) {
  const canvasRef = useRef(null);

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

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Grid configuration
    const gridSize = 45;
    let scanLineY = 0;

    // Telemetry nodes
    const nodeCount = Math.min(Math.floor((width * height) / 25000), 50);
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.8 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseVal: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw pure black / dark cyber base gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 3,
        50,
        width / 2,
        height / 2,
        Math.max(width, height),
      );
      bgGrad.addColorStop(0, "#031201");
      bgGrad.addColorStop(0.5, "#000000");
      bgGrad.addColorStop(1, "#000000");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Tactical Cyber Grid
      ctx.lineWidth = 1;
      const gridAlpha = isScanning ? 0.22 : isDragging ? 0.28 : 0.12;
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

      // 3. Scanning Radar Beam / Horizon Sweep
      if (!prefersReducedMotion) {
        const scanSpeed = isScanning ? 4 : isDragging ? 3 : 1.2;
        scanLineY = (scanLineY + scanSpeed) % height;

        const sweepGrad = ctx.createLinearGradient(
          0,
          scanLineY - 120,
          0,
          scanLineY,
        );
        sweepGrad.addColorStop(0, "rgba(34, 197, 94, 0)");
        sweepGrad.addColorStop(
          0.8,
          isScanning ? "rgba(34, 197, 94, 0.15)" : "rgba(30, 125, 4, 0.08)",
        );
        sweepGrad.addColorStop(
          1,
          isScanning ? "rgba(74, 222, 128, 0.4)" : "rgba(34, 197, 94, 0.25)",
        );
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, scanLineY - 120, width, 120);

        // Leading scan line
        ctx.strokeStyle = isScanning
          ? "rgba(74, 222, 128, 0.7)"
          : "rgba(34, 197, 94, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, scanLineY);
        ctx.lineTo(width, scanLineY);
        ctx.stroke();
      }

      // 4. Floating Telemetry Nodes & Interconnections
      const speedMultiplier = isScanning ? 2.5 : isDragging ? 1.8 : 1.0;
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
        }

        const currentAlpha = node.alpha * (0.6 + 0.4 * Math.sin(node.pulseVal));

        // Draw connections between close nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = node.x - nodeB.x;
          const dy = node.y - nodeB.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 140;
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const linkAlpha =
              (1 - dist / maxDist) * 0.25 * (isScanning ? 1.5 : 1);
            ctx.strokeStyle = `rgba(34, 197, 94, ${linkAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }

        // Draw node dot
        ctx.fillStyle = `rgba(74, 222, 128, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isScanning, isDragging]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}

export default function FilePage() {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showInstructions, setShowInstructions] = useState(() => {
    return localStorage.getItem("vanguard_pre_scan_acknowledged") !== "true";
  });
  const [isDragging, setIsDragging] = useState(false);
  const [fileHash, setFileHash] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [isFetchingTarget, setIsFetchingTarget] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const scanAbortControllerRef = useRef(null);

  // Restore staged asset from IndexedDB across page reloads
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get("target")) {
      loadStagedFileFromDB().then((savedFile) => {
        if (savedFile && !file) {
          setFile(savedFile);
        }
      });
    }
  }, []);

  // Automatically persist staged asset to IndexedDB whenever updated
  useEffect(() => {
    if (file) {
      saveStagedFileToDB(file);
    }
  }, [file]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    if (!file) {
      setFileHash("");
      return;
    }
    let isMounted = true;
    setIsHashing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const buffer = event.target.result;
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        if (isMounted) {
          setFileHash(hashHex);
          setIsHashing(false);
        }
      } catch (e) {
        if (isMounted) {
          setFileHash("Hash calculation unavailable");
          setIsHashing(false);
        }
      }
    };
    reader.onerror = () => {
      if (isMounted) {
        setFileHash("Hash calculation error");
        setIsHashing(false);
      }
    };
    // Slice first 10MB for rapid browser digest calculation
    const sliceEnd = Math.min(file.size, 1024 * 1024 * 10);
    reader.readAsArrayBuffer(file.slice(0, sliceEnd));
    return () => {
      isMounted = false;
    };
  }, [file]);

  const handleAcknowledgeInstructions = () => {
    localStorage.setItem("vanguard_pre_scan_acknowledged", "true");
    setShowInstructions(false);
  };

  // Hardened remote target URL fetcher with timeouts, headers check & size validation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetUrl = params.get("target");
    if (targetUrl) {
      let isMounted = true;
      setIsFetchingTarget(true);
      setApiError("");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      fetch(targetUrl, { signal: controller.signal })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(
              `Failed to fetch remote asset (${res.status}: ${res.statusText})`,
            );
          }
          const contentLength = res.headers.get("content-length");
          if (
            contentLength &&
            parseInt(contentLength, 10) > 100 * 1024 * 1024
          ) {
            throw new Error(
              "Remote file exceeds the mandatory 100MB sandbox ceiling.",
            );
          }
          return res.blob();
        })
        .then((blob) => {
          if (!isMounted) return;
          if (blob.size > 100 * 1024 * 1024) {
            throw new Error(
              "Remote file exceeds the mandatory 100MB sandbox ceiling.",
            );
          }
          let rawFilename =
            targetUrl.split("/").pop()?.split("?")[0] || "remote_asset.exe";
          if (!rawFilename.trim()) rawFilename = "remote_asset.exe";
          const fetchedFile = new File([blob], rawFilename, {
            type: blob.type || "application/octet-stream",
          });
          const validation = validateFileAsset(fetchedFile);
          if (!validation.valid) {
            setApiError(`Remote asset validation failed: ${validation.error}`);
            setIsFetchingTarget(false);
            return;
          }
          setFile(fetchedFile);
          setIsFetchingTarget(false);
        })
        .catch((err) => {
          if (!isMounted) return;
          setIsFetchingTarget(false);
          if (err.name === "AbortError") {
            setApiError("Remote asset download timed out after 30 seconds.");
          } else {
            setApiError(
              err.message ||
                "Unable to download remote target file (network or CORS restriction).",
            );
          }
        })
        .finally(() => {
          clearTimeout(timeoutId);
        });

      return () => {
        isMounted = false;
        controller.abort();
        clearTimeout(timeoutId);
      };
    }
  }, [location.search]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 100 * 1024 * 1024) {
        setApiError("File exceeds 100MB limit.");
        return;
      }
      setFile(selectedFile);
      setApiError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validation = validateFileAsset(droppedFile);
      if (!validation.valid) {
        setApiError(validation.error);
        return;
      }
      setFile(droppedFile);
      setApiError("");
    }
  };

  const handleRemoveFile = (e) => {
    if (e) e.stopPropagation();
    if (scanAbortControllerRef.current) {
      scanAbortControllerRef.current.abort();
    }
    setIsScanning(false);
    setFile(null);
    setFileHash("");
    setApiError("");
    clearStagedFileFromDB();
    const input = document.getElementById("fileInput");
    if (input) input.value = "";
  };

  const handleCancelScan = () => {
    if (scanAbortControllerRef.current) {
      scanAbortControllerRef.current.abort();
    }
    setIsScanning(false);
    setApiError("Sandbox inspection aborted by user. Staged asset preserved.");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (file && !isScanning) {
        if (e.key === "Escape") {
          e.preventDefault();
          handleRemoveFile();
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleScan();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [file, isScanning]);

  const handleScan = async () => {
    if (!file) return;
    const validation = validateFileAsset(file);
    if (!validation.valid) {
      setApiError(validation.error);
      return;
    }
    setIsScanning(true);
    setApiError("");

    const controller = new AbortController();
    scanAbortControllerRef.current = controller;
    const uploadTimeout = setTimeout(() => controller.abort(), 90000); // 90s upload timeout

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setApiError(
          "Active security clearance required. Please log in to access the Vanguard Sandbox.",
        );
        setIsScanning(false);
        clearTimeout(uploadTimeout);
        return;
      }
      const formData = new FormData();
      formData.append("file", file);

      const standardRes = await fetch(apiUrl(ENDPOINTS.STANDARD_SCAN_FILE), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(uploadTimeout);

      if (standardRes.status === 200) {
        const standardData = await standardRes.json();
        sessionStorage.setItem(
          "standardScanData",
          JSON.stringify(standardData),
        );
        sessionStorage.removeItem("advancedScanData");
        sessionStorage.setItem("fileName", file.name);
        setPendingAdvancedFile(file);
        navigate("/filestandard");
      } else if (standardRes.status === 401 || standardRes.status === 403) {
        setApiError(
          "Security session expired or access denied (401/403). Please re-authenticate.",
        );
      } else if (standardRes.status === 413) {
        setApiError(
          "Asset payload rejected by backend gateway (413 Payload Too Large).",
        );
      } else if (standardRes.status === 429) {
        setApiError(
          "Sandbox ingestion rate limit reached (429). Please wait 60 seconds before retrying.",
        );
      } else {
        let backendError =
          "Scan initialization failed. Please verify asset integrity and retry.";
        try {
          const errPayload = await standardRes.json();
          if (errPayload && (errPayload.message || errPayload.error)) {
            backendError = `Sandbox error (${standardRes.status}): ${errPayload.message || errPayload.error}`;
          }
        } catch (_) {
          // Fallback if backend returned non-JSON
        }
        setApiError(backendError);
      }
    } catch (err) {
      clearTimeout(uploadTimeout);
      if (err.name === "AbortError") {
        setApiError(
          "Sandbox upload timed out after 90 seconds. Check network bandwidth or connection stability.",
        );
      } else {
        setApiError(
          "Network connection exception while uploading asset to Vanguard telemetry engines.",
        );
      }
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-[100vw] flex-col items-center justify-center overflow-x-hidden bg-black pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 text-white">
      <TacticalGridCanvas isScanning={isScanning} isDragging={isDragging} />

      <div className="relative z-10 flex w-full justify-center px-2 sm:px-4 md:px-6">
        <div className="w-full min-w-0 max-w-2xl shrink-0 py-2 text-center md:w-[min(44rem,100%)]">
          <h1 className="font-['Gargoyles',system-ui,sans-serif] text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-[0_0_15px_rgba(30,125,4,0.3)]">
            Vanguard scans every file in real time
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl mx-auto mb-5">
            Detect malware and hidden threats before they reach your system.
          </p>

          {/* Pre-Scan Safety Onboarding Header / Checklist */}
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
                      Mandatory safety procedure before scanning binary files
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
                    <span>Quarantine &amp; Locate</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Locate your downloaded Windows executable (
                    <code className="text-green-400 bg-green-950/60 px-1 py-0.5 rounded">
                      .exe
                    </code>
                    ).{" "}
                    <strong className="text-white">
                      Do NOT run or double-click the file yet
                    </strong>
                    —scan it first to verify zero-day safety.
                  </p>
                </div>

                <div className="rounded-xl border border-green-900/40 bg-black/50 p-3">
                  <div className="flex items-center gap-2 font-semibold text-white mb-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-[10px] text-black font-bold">
                      2
                    </span>
                    <span>Sandbox Ingestion</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Drag &amp; drop or select the executable (up to{" "}
                    <strong className="text-white">100MB</strong>). Vanguard
                    securely uploads the asset into an isolated analysis
                    container.
                  </p>
                </div>

                <div className="rounded-xl border border-green-900/40 bg-black/50 p-3">
                  <div className="flex items-center gap-2 font-semibold text-white mb-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-[10px] text-black font-bold">
                      3
                    </span>
                    <span>Multi-Engine Inspection</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Click <strong className="text-white">Scan</strong> to run
                    multi-engine detection (
                    <strong className="text-white">10–30s</strong>). Review
                    comprehensive threat telemetry before executing locally.
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

          {isFetchingTarget && (
            <div className="mb-6 rounded-2xl border border-green-800/60 bg-[#0c0f0c] p-5 text-left shadow-[0_0_20px_rgba(30,125,4,0.2)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-950/80 border border-green-700/60">
                  <svg
                    className="motion-safe:animate-spin h-5 w-5 text-green-400 shrink-0"
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
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white font-mono">
                    Fetching Remote Target Asset...
                  </h3>
                  <p className="text-xs text-gray-400 font-mono truncate max-w-xs sm:max-w-md">
                    {new URLSearchParams(location.search).get("target")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFetchingTarget(false);
                  setApiError("Remote fetch cancelled by user.");
                }}
                className="shrink-0 rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:border-red-600 hover:text-red-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Cancel
              </button>
            </div>
          )}

          {isDragging ? (
            <div
              role="button"
              tabIndex={0}
              aria-label="Drop asset to ingest into Vanguard Sandbox"
              className="group relative mb-6 rounded-2xl border-2 border-[#22c55e] bg-black/70 p-6 sm:p-8 transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.3)] flex flex-col items-center justify-center text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E7D04]/30 border border-[#22c55e] mb-3 motion-safe:animate-pulse">
                <span className="text-xl font-bold text-[#4ade80]">↓</span>
              </div>
              <p className="text-base font-bold text-white tracking-wide">
                Drop asset to ingest into Vanguard Sandbox
              </p>
              <p className="text-xs text-green-400 mt-1">
                Isolated real-time multi-engine analysis ready
              </p>
            </div>
          ) : !file ? (
            <div
              role="button"
              tabIndex={0}
              aria-label="Select or drag Windows Binary to scan"
              onClick={() => document.getElementById("fileInput")?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  document.getElementById("fileInput")?.click();
                }
              }}
              className="group mb-6 cursor-pointer rounded-2xl border border-[#1E7D04]/60 bg-black/40 p-5 sm:p-7 transition-all hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".exe,.dll"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileInput"
                className="flex flex-col items-center space-y-2 py-1 cursor-pointer pointer-events-none"
              >
                <img
                  src="/icons/browse.svg"
                  alt=""
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="space-y-1 text-center">
                  <p className="text-base font-medium text-white">
                    Select or drag Windows Binary (.exe, .dll)
                  </p>
                  <p className="text-xs text-gray-400">
                    Max size: 100MB &bull; Multi-engine sandbox inspection
                  </p>
                </div>
                <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#1E7D04] bg-[#0c0f0c] px-5 py-1.5 text-xs font-semibold text-[#4ade80] transition-all group-hover:border-[#22c55e] group-hover:bg-[#1E7D04]/30 group-hover:text-white shadow-[0_0_15px_rgba(30,125,4,0.25)]">
                  Browse Files
                </span>
              </label>
            </div>
          ) : (
            <div
              className="group relative mb-6 rounded-2xl border border-[#1E7D04] bg-[#0c0f0c] p-5 text-left shadow-[0_0_20px_rgba(30,125,4,0.2)] transition-all"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".exe,.dll"
                onChange={handleFileChange}
              />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                {/* Left & Center: Asset Icon + Metadata */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-green-700/60 bg-black/80 shadow-inner">
                    <span className="text-xs font-extrabold text-[#4ade80] tracking-wider">
                      {file.name.toLowerCase().endsWith(".dll") ? "DLL" : "EXE"}
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold">
                      Binary
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className="text-sm sm:text-base font-bold text-white truncate max-w-full font-mono"
                        title={file.name}
                      >
                        {file.name}
                      </h3>
                      <span className="shrink-0 rounded bg-green-950/80 border border-green-800/60 px-2 py-0.5 text-xs font-semibold text-green-400">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-[#1E7D04]/20 border border-[#1E7D04]/60 px-2 py-0.5 text-[11px] font-semibold text-[#4ade80]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]"></span>
                        Status: Ready
                      </span>
                    </div>

                    {/* SHA-256 Preview */}
                    <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
                      <span className="text-gray-500 font-semibold shrink-0">
                        SHA-256:
                      </span>
                      {isHashing ? (
                        <span className="inline-flex items-center gap-1.5 text-green-400">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-500 motion-safe:animate-ping"></span>
                          Calculating cryptographic digest...
                        </span>
                      ) : fileHash ? (
                        <span
                          className="truncate max-w-[240px] sm:max-w-[340px] md:max-w-[400px] text-gray-300 bg-black/60 px-2 py-0.5 rounded border border-green-900/30 font-mono"
                          title={fileHash}
                        >
                          {fileHash}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-green-900/40 shrink-0">
                  {isScanning ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-950/50 border border-green-800 px-3 py-1.5 rounded-full">
                        <svg
                          className="motion-safe:animate-spin h-3.5 w-3.5 text-green-400 shrink-0"
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
                        <span>Sandbox Active...</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCancelScan}
                        aria-label="Cancel active scan"
                        className="cursor-pointer rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:border-red-600 hover:bg-red-950/60 hover:text-red-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <label
                        htmlFor="fileInput"
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            document.getElementById("fileInput")?.click();
                          }
                        }}
                        className="cursor-pointer rounded-lg border border-[#1E7D04] bg-black/60 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:border-[#22c55e] hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
                      >
                        Swap Asset
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        aria-label="Remove staged file"
                        className="flex items-center gap-1 rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:border-red-600 hover:bg-red-950/60 hover:text-red-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        <span>✕</span>
                        <span>Remove</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Keyboard shortcut hint inside card */}
              {!isScanning && (
                <div className="mt-3 border-t border-green-950/80 pt-2.5 flex items-center justify-between text-[11px] text-gray-500">
                  <span>
                    Status:{" "}
                    <strong className="text-green-400">
                      Ready for Multi-Engine Inspection
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
          )}

          {apiError && (
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
                    Ingestion / Sandbox Exception
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-gray-200 leading-relaxed break-words">
                    {apiError}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setApiError("")}
                aria-label="Dismiss error notice"
                className="shrink-0 rounded bg-red-950/80 border border-red-800/60 px-2.5 py-1 text-xs font-semibold text-red-400 hover:border-red-500 hover:text-white transition-all"
              >
                Dismiss
              </button>
            </div>
          )}

          {isScanning ? (
            <div className="flex items-center justify-center gap-3 w-full max-w-xs sm:max-w-sm mx-auto">
              <button
                disabled
                className="cursor-not-allowed flex-1 py-3 px-6 rounded-full font-semibold text-white bg-green-900/40 border border-green-700/40 flex items-center justify-center gap-2 opacity-85 shadow-[0_0_15px_rgba(0,255,0,0.15)]"
              >
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
                <span>Inspecting Sandbox...</span>
              </button>
              <button
                type="button"
                onClick={handleCancelScan}
                className="cursor-pointer shrink-0 py-3 px-6 rounded-full font-semibold text-red-400 bg-red-950/60 border border-red-800/80 hover:bg-red-900/70 hover:text-white hover:border-red-500 transition-all duration-200 shadow-[0_0_15px_rgba(248,113,113,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleScan}
              disabled={!file}
              className="cursor-pointer w-full max-w-xs sm:max-w-sm mx-auto block py-3 px-10 rounded-full font-semibold text-white bg-gradient-to-r from-[#1E7D04] to-[#0A3301] hover:opacity-90 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(30,125,4,0.3)]"
            >
              Scan Binary
            </button>
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
