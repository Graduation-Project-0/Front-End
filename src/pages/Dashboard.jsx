import React, { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useNavigate, Link, NavLink } from "react-router-dom";
import api from "../api/axios";
import { ENDPOINTS } from "../config/endpoints";
import { useAuth } from "../hooks/useAuth";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import NavBrandLink from "../components/NavBrandLink";
import DashboardScansChart from "../components/DashboardScansChart";
import LogoutConfirmDialog from "../components/LogoutConfirmDialog";
import {
  LayoutDashboard,
  FileText,
  Link as LinkIcon,
  Mail,
  HelpCircle,
  LogOut,
  Download,
  Camera,
  User,
} from "lucide-react";
import { useProfileAvatar } from "../hooks/useProfileAvatar";

function resolveDashboardUserName(user) {
  const trim = (s) => (typeof s === "string" ? s.trim() : "");
  if (user?.name && trim(user.name)) return trim(user.name);
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.name && trim(u.name)) return trim(u.name);
    }
  } catch { /* ignore */ }
  try {
    const pn = localStorage.getItem("pendingName");
    if (pn && trim(pn)) return trim(pn);
  } catch { /* ignore */ }
  if (user?.email) {
    const e = trim(user.email);
    return e.includes("@") ? e.split("@")[0] || e : e;
  }
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    if (stored?.email) {
      const e = trim(stored.email);
      return e.includes("@") ? e.split("@")[0] || e : e;
    }
  } catch { /* ignore */ }
  return "User";
}

const SECURITY_LEVEL_TONE = {
  WARNING: { textClass: "text-red-400", cleanSliceFill: "#f87171" },
  RISK:    { textClass: "text-orange-400", cleanSliceFill: "#fb923c" },
  GOOD:    { textClass: "text-yellow-400", cleanSliceFill: "#facc15" },
  SECURE:  { textClass: "text-green-400", cleanSliceFill: "#4ade80" },
};
function getSecurityLevelTone(level) {
  return SECURITY_LEVEL_TONE[level] ?? SECURITY_LEVEL_TONE.WARNING;
}

const RECENT_SCANS_PAGE_SIZE = 8;

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const displayUserName = resolveDashboardUserName(user);
  const {
    displaySrc,
    hasCustomAvatar,
    avatarDisabled,
    fileInputRef,
    onFileChange,
    enableAvatar,
    disableAvatar,
  } = useProfileAvatar();

  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartYear, setChartYear] = useState(() => new Date().getFullYear());
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [imageExporting, setImageExporting] = useState(false);
  const [exportChartTooltips, setExportChartTooltips] = useState(false);
  const [showAllRecentScans, setShowAllRecentScans] = useState(false);
  const dashboardSnapshotRef = useRef(null);
  const snapshotBusyRef = useRef(false);

  const performLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    await logout();
    navigate("/login", { replace: true });
  };

  const handleDashboardImage = useCallback(async () => {
    const el = dashboardSnapshotRef.current;
    if (!el || snapshotBusyRef.current) return;
    snapshotBusyRef.current = true;
    setImageExporting(true);
    setExportChartTooltips(true);
    await new Promise((resolve) => { requestAnimationFrame(() => requestAnimationFrame(resolve)); });
    await new Promise((resolve) => setTimeout(resolve, 150));
    try {
      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
        filter: (node) =>
          !(node instanceof HTMLElement && node.hasAttribute("data-html-to-image-ignore")),
      });
      const stamp = new Date().toISOString().slice(0, 10);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `vanguard-dashboard-${stamp}.png`;
      a.rel = "noopener";
      a.click();
    } catch (err) {
      console.error("Dashboard image export failed:", err);
    } finally {
      setExportChartTooltips(false);
      snapshotBusyRef.current = false;
      setImageExporting(false);
    }
  }, []);

  const getCleanRatePercent = (total, clean) => {
    const t = Number(total) || 0;
    if (t <= 0) return null;
    const c = Number(clean) || 0;
    return Math.max(0, Math.min(100, (c / t) * 100));
  };

  const getSecurityLevel = (percent) => {
    if (percent >= 90) return "SECURE";
    if (percent >= 70) return "GOOD";
    if (percent >= 50) return "RISK";
    return "WARNING";
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const emptyStats = () => ({
      file:  { total: 0, threat: 0, clean: 0 },
      url:   { total: 0, threat: 0, clean: 0 },
      email: { total: 0, threat: 0, clean: 0 },
      overall: 0,
      level: getSecurityLevel(0),
    });

    const normalizeRecentScans = (rows) => {
      if (!Array.isArray(rows)) return [];

      const normResult = (scan) => {
        const raw =
          scan?.result ?? scan?.scan_result ?? scan?.scanStatus ?? scan?.scan_status ??
          scan?.verdict ?? scan?.status ?? scan?.classification ?? scan?.prediction ??
          scan?.is_malicious ?? scan?.malicious ?? scan?.is_safe;
        if (typeof raw === "string") {
          const s = raw.trim().toLowerCase();
          if (["malicious","threat","spam","unsafe","danger"].includes(s)) return "malicious";
          if (["clean","safe","legit","ham","ok"].includes(s)) return "clean";
          return s;
        }
        if (typeof raw === "boolean") return raw ? "clean" : "malicious";
        if (scan?.is_malicious === true || scan?.malicious === true) return "malicious";
        if (scan?.is_safe === true || scan?.safe === true) return "clean";
        return "unknown";
      };

      const normItem = (scan) =>
        scan?.item ?? scan?.target ?? scan?.scan_target ?? scan?.scanTarget ??
        scan?.url ?? scan?.domain ?? scan?.ip ?? scan?.filename ?? scan?.file_name ??
        scan?.email ?? scan?.subject ?? scan?.hash ?? scan?.value ?? scan?.name ?? "—";

      const normType = (scan) =>
        scan?.type ?? scan?.service ?? scan?.scan_type ??
        scan?.scanType ?? scan?.category ?? scan?.kind ?? null;

      const normDate = (scan) =>
        scan?.created_at ?? scan?.scanned_at ?? scan?.date ??
        scan?.timestamp ?? scan?.time ?? scan?.scan_date ?? null;

      return rows
        .map((scan) => ({
          item: String(normItem(scan)),
          result: normResult(scan),
          type: normType(scan) ? String(normType(scan)) : null,
          created_at: normDate(scan),
          _raw: scan,
        }))
        .slice(0, 30);
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setHistoryError(null);
        const response = await api.get(ENDPOINTS.HISTORY, { signal });
        if (signal.aborted) return;

        const responseData = response.data;
        const apiData = responseData?.data;
        if (!apiData) throw new Error("No data received from server");

        const file  = { total: apiData.file_analysis?.total  || 0, threat: apiData.file_analysis?.malicious  || 0, clean: apiData.file_analysis?.safe  || 0 };
        const url   = { total: apiData.url_analysis?.total   || 0, threat: apiData.url_analysis?.malicious   || 0, clean: apiData.url_analysis?.safe   || 0 };
        const email = { total: apiData.email_analysis?.total || 0, threat: apiData.email_analysis?.malicious || 0, clean: apiData.email_analysis?.safe || 0 };

        const rates = [
          getCleanRatePercent(file.total,  file.clean),
          getCleanRatePercent(url.total,   url.clean),
          getCleanRatePercent(email.total, email.clean),
        ].filter((v) => typeof v === "number");

        const overall = rates.length
          ? Math.round(rates.reduce((sum, v) => sum + v, 0) / rates.length)
          : 0;

        setStats({ file, url, email, overall, level: getSecurityLevel(overall) });

        const scansList = apiData.recent_scans || [];
        setRecentScans(normalizeRecentScans(scansList));

        const year = new Date().getFullYear();
        setChartYear(year);
        const chartSeries = responseData?.chart ?? responseData?.data?.chart;
        setChartData(buildMonthlyScansForYear(year, chartSeries, scansList));
      } catch (err) {
        if (signal.aborted || err.code === "ERR_CANCELED") return;
        const msg =
          err.code === "ECONNABORTED"
            ? "Request timed out. Is the API running?"
            : err.response?.data?.message || err.message || "Could not load dashboard data.";
        console.error("FETCH FAILED:", msg, err);
        setHistoryError(msg);
        setStats(emptyStats());
        setRecentScans([]);
        const year = new Date().getFullYear();
        setChartYear(year);
        setChartData(buildMonthlyScansForYear(year, null, []));
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [token, historyRefreshKey]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-black font-bold text-green-500">
        Loading Security Data...
      </div>
    );
  }

  const overallCleanCount  = (stats?.file?.clean  ?? 0) + (stats?.url?.clean  ?? 0) + (stats?.email?.clean  ?? 0);
  const overallThreatCount = (stats?.file?.threat ?? 0) + (stats?.url?.threat ?? 0) + (stats?.email?.threat ?? 0);
  const overallTotalCount  = overallCleanCount + overallThreatCount;
  const overallCleanPercent = overallTotalCount
    ? Math.round((overallCleanCount / overallTotalCount) * 100)
    : 0;
  const overallLevel = getSecurityLevel(overallCleanPercent);
  const overallSecurityTone = getSecurityLevelTone(overallLevel);
  const combinedFileUrlEmailTotal =
    (stats?.file?.total ?? 0) + (stats?.url?.total ?? 0) + (stats?.email?.total ?? 0);

  const visibleRecentScans = showAllRecentScans
    ? recentScans
    : recentScans.slice(0, RECENT_SCANS_PAGE_SIZE);
  const hasMoreRecentScans = recentScans.length > RECENT_SCANS_PAGE_SIZE;

  return (
    <>
      <LogoutConfirmDialog
        open={confirmLogoutOpen}
        loading={logoutLoading}
        onRequestClose={() => { if (logoutLoading) return; setConfirmLogoutOpen(false); }}
        onConfirm={async () => { await performLogout(); setConfirmLogoutOpen(false); }}
      />

      {/*
        ROOT LAYOUT
        ─ Mobile:  block flow, min-h fills the viewport, grows freely with content.
                   No fixed height → no black gap clipped below the last card.
        ─ Desktop: h-screen flex-row, sidebar + scrollable right column.
      */}
      <div className="dashboard-page flex w-full max-w-[100vw] flex-col overflow-x-hidden bg-black font-sans text-white
                      max-md:min-h-[100dvh]
                      md:h-screen md:max-h-screen md:flex-row md:overflow-hidden">

        {/* ── Desktop sidebar ─────────────────────────────────────────── */}
        <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-gray-900 bg-[#0d0d0d] p-6 md:flex">
          <div className="mb-10"><NavBrandLink /></div>
          <nav className="flex-1">
            <ul className="space-y-4">
              <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavItem to="/file"      icon={<FileText size={20} />}         label="File" />
              <NavItem to="/url"       icon={<LinkIcon size={20} />}          label="URL" />
              <NavItem to="/email"     icon={<Mail size={20} />}              label="Email" />
              <NavItem to="/terms"     icon={<HelpCircle size={20} />}        label="Help" />
            </ul>
          </nav>
          <div className="mt-auto space-y-4">
            <Link to="/plans" className="block w-full rounded-xl bg-[#009e28] py-3 text-center text-sm font-bold transition hover:bg-[#0ba650]">
              Upgrade Plan
            </Link>
            <NavItem icon={<LogOut size={20} />} label={logoutLoading ? "Logging out..." : "Logout"} red onClick={() => setConfirmLogoutOpen(true)} />
          </div>
        </aside>

        {/*
          CONTENT COLUMN
          ─ Mobile:  no height constraint, grows with content.
          ─ Desktop: flex-1 + min-h-0 enables inner overflow-hidden on <main>.
        */}
        <div className="flex w-full min-w-0 flex-col max-md:flex-none md:min-h-0 md:flex-1">

          {/* ── Mobile sticky nav ──────────────────────────────────────── */}
          <div className="sticky top-0 z-40 border-b border-gray-900 bg-[#0a0a0a]/95 px-3 py-3 backdrop-blur-md md:hidden">
            <div className="mb-3 flex items-center justify-between gap-2">
              <NavBrandLink className="origin-left scale-90" />
            </div>
            <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Dashboard sections">
              <MobileNavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Home" />
              <MobileNavLink to="/file"      icon={<FileText size={18} />}         label="File" />
              <MobileNavLink to="/url"       icon={<LinkIcon size={18} />}          label="URL" />
              <MobileNavLink to="/email"     icon={<Mail size={18} />}              label="Email" />
              <MobileNavLink to="/plans"     icon={<HelpCircle size={18} />}        label="Help" />
              <button
                type="button"
                onClick={() => setConfirmLogoutOpen(true)}
                className="flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-red-400"
                aria-label="Log out"
              >
                <LogOut size={18} />
                <span className="text-[9px] font-medium">Logout</span>
              </button>
            </nav>
          </div>

          {/*
            MAIN
            ─ Mobile:  auto height (flex-none), NO overflow-hidden, safe bottom padding
                       via env(safe-area-inset-bottom) so nothing gets clipped.
            ─ Desktop: flex-1 + overflow-hidden, standard scrollable layout.
          */}
          <main
            ref={dashboardSnapshotRef}
            className="box-border flex w-full min-w-0 flex-col gap-4 p-4
                       max-md:flex-none
                       md:min-h-0 md:flex-1 md:gap-6 md:overflow-hidden md:p-8"
            /* Safe-area padding keeps content off the home-bar on iOS */
            style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))" }}
          >
            {historyError && (
              <div role="alert" className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                <span>{historyError}</span>
                <button type="button" onClick={() => setHistoryRefreshKey((k) => k + 1)} className="shrink-0 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-50 hover:bg-amber-500/25">
                  Retry
                </button>
              </div>
            )}

            {/* ── Header ───────────────────────────────────────────────── */}
            <header className="flex shrink-0 flex-wrap items-center justify-end gap-3 max-md:w-full max-md:justify-between md:gap-6">
              <button
                type="button"
                data-html-to-image-ignore
                onClick={handleDashboardImage}
                disabled={imageExporting}
                className=" cursor-pointer flex items-center gap-2 rounded-xl border border-[#1E7D04]/50 bg-[#009e28] px-3 py-2 text-xs font-semibold text-white shadow-[0_0_16px_rgba(30,125,4,0.25)] transition hover:bg-[#0ba650] hover:shadow-[0_0_20px_rgba(30,125,4,0.35)] disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-sm"
              >
                <Download size={16} />
                <span className="max-sm:hidden">{imageExporting ? "Exporting…" : "Reports"}</span>
                <span className="sm:hidden">{imageExporting ? "…" : "PNG"}</span>
              </button>

              <div className="flex items-center gap-3 border-l border-gray-800 pl-3 md:gap-4 md:pl-6">
                <div className="min-w-0 text-right">
                  <p className="max-w-[140px] truncate text-sm font-bold sm:max-w-none">{displayUserName}</p>
                  <p className="text-[10px] uppercase text-gray-500">Free Account</p>
                  <label className="mt-1 flex cursor-pointer items-center justify-end gap-1.5 text-[10px] text-gray-400">
                    <input
                      type="checkbox"
                      checked={!avatarDisabled}
                      onChange={(e) => (e.target.checked ? enableAvatar() : disableAvatar())}
                      className="h-3 w-3 rounded border-gray-600 accent-[#1E7D04]"
                    />
                    Profile photo
                  </label>
                </div>

                {!avatarDisabled ? (
                  <label className="relative block h-10 w-10 shrink-0 cursor-pointer rounded-full focus-within:outline-none focus-within:ring-2 focus-within:ring-[#1E7D04]">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      aria-label={hasCustomAvatar ? "Change profile photo" : "Add profile photo"}
                    />
                    {displaySrc ? (
                      <img src={displaySrc} alt="" className="pointer-events-none h-10 w-10 rounded-full border border-green-500/50 object-cover" />
                    ) : (
                      <span className="pointer-events-none flex h-10 w-10 items-center justify-center rounded-full border border-green-500/30 bg-white/5">
                        <User size={16} className="text-gray-200" />
                      </span>
                    )}
                    <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 z-20 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-[#1E7D04] text-white shadow-sm" aria-hidden>
                      <Camera size={10} strokeWidth={2.5} />
                    </span>
                  </label>
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-500/30 bg-white/5" title="Profile photo off">
                    <User size={16} className="text-gray-500" />
                  </span>
                )}
              </div>
            </header>

            {/* ── Stat cards ───────────────────────────────────────────── */}
            <section className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              <StatCard title="File Analysis"  {...stats?.file} />
              <StatCard title="URL Protection" {...stats?.url} />
              <StatCard title="Email Checked"  {...stats?.email} />

              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-900 bg-[#0d0d0d] p-4">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-500">Overall Security</h3>
                <div className="relative h-24 w-24 min-h-[6rem] min-w-[6rem]">
                  <ResponsiveContainer width="100%" height="100%" minHeight={96} minWidth={96}>
                    <PieChart>
                      <Pie
                        data={[{ name: "Clean", value: overallCleanCount }, { name: "Threat", value: overallThreatCount }]}
                        dataKey="value"
                        innerRadius="70%"
                        outerRadius="100%"
                        paddingAngle={2}
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                      >
                        <Cell fill={overallSecurityTone.cleanSliceFill} />
                        <Cell fill="#1a1a1a" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-sm font-black ${overallSecurityTone.textClass}`}>{overallCleanPercent}%</span>
                    <span className={`text-[10px] font-bold uppercase ${overallSecurityTone.textClass} opacity-90`}>{overallLevel}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Chart + Recent scans ─────────────────────────────────── */}
            {/*
              On mobile this section is just a normal block — no min-h-0 / flex-1
              that could fight the natural document height and cause clipping.
            */}
            <section className="grid grid-cols-1 gap-4
                                lg:auto-rows-fr lg:grid-cols-3 lg:grid-rows-1 lg:items-stretch
                                md:min-h-0 md:flex-1">
              <DashboardScansChart
                chartData={chartData}
                chartYear={chartYear}
                combinedFileUrlEmailTotal={combinedFileUrlEmailTotal}
                exportChartTooltips={exportChartTooltips}
              />

              <div className="flex flex-col rounded-2xl border border-gray-900 bg-[#0d0d0d] p-4 sm:p-6 lg:min-h-0">
                <h3 className="mb-4 shrink-0 font-bold tracking-wide text-gray-200">Recent Scan</h3>
                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-2
                                max-md:max-h-none max-md:flex-none max-md:overflow-visible
                                lg:min-h-[12rem]">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-[#0d0d0d] text-[10px] uppercase tracking-wide text-gray-600">
                      <tr>
                        <th className="pb-2">Type</th>
                        <th className="pb-2 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {visibleRecentScans.length > 0 ? (
                        visibleRecentScans.map((scan, i) => (
                          <tr key={`${scan.item}-${scan.created_at ?? i}`} className="border-b border-gray-900/50">
                            <td className="max-w-[min(55vw,200px)] truncate py-2.5 text-gray-400 sm:max-w-[140px]">
                              {scan.type || scan.item || "—"}
                            </td>
                            <td className={`py-2.5 text-right font-bold capitalize ${scan.result === "malicious" ? "text-red-500" : "text-green-500"}`}>
                              {scan.result || "—"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="py-10 text-center text-gray-600">No scans</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>


                {hasMoreRecentScans && (
                  <button
                    type="button"
                    onClick={() => setShowAllRecentScans((v) => !v)}
                    className="mt-3 w-full shrink-0 rounded-lg border border-green-500/20 bg-[#1db954]/10 py-2 text-sm font-bold text-green-500 transition hover:bg-[#1db954]/20"
                  >
                    {showAllRecentScans ? "Show less" : `View all (${recentScans.length})`}
                  </button>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

const CHART_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MONTH_ABBR_MAP = CHART_MONTHS.reduce((acc, abbrev, idx) => {
  acc[abbrev.toLowerCase()] = idx;
  return acc;
}, {});

function monthIndexFromApiLabel(label) {
  if (label == null || label === "") return -1;
  if (typeof label === "number" && !Number.isNaN(label)) {
    if (label >= 1 && label <= 12) return label - 1;
    if (label >= 0 && label <= 11) return label;
  }
  const s = String(label).trim().toLowerCase();
  if (s.length >= 3) {
    const key3 = s.slice(0, 3);
    if (MONTH_ABBR_MAP[key3] != null) return MONTH_ABBR_MAP[key3];
  }
  if (MONTH_ABBR_MAP[s] != null) return MONTH_ABBR_MAP[s];
  return -1;
}

function buildMonthlyScansForYear(year, chart, recentScans) {
  const counts = new Array(12).fill(0);
  let fromTimestamps = false;

  if (Array.isArray(recentScans) && recentScans.length > 0) {
    for (const scan of recentScans) {
      const raw =
        scan?.created_at ?? scan?.scanned_at ?? scan?.date ??
        scan?.timestamp  ?? scan?.time       ?? scan?.scan_date;
      if (!raw) continue;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) continue;
      if (d.getFullYear() !== year) continue;
      counts[d.getMonth()] += 1;
      fromTimestamps = true;
    }
  }

  if (!fromTimestamps && Array.isArray(chart) && chart.length > 0) {
    chart.forEach((row, i) => {
      const delta = Number(row?.value ?? row?.count ?? row?.scans ?? row?.total ?? 0) || 0;
      let idx = monthIndexFromApiLabel(row?.month ?? row?.name ?? row?.label ?? row?.month_name);
      if (idx < 0 && i < 12) idx = i;
      if (idx >= 0 && idx < 12) counts[idx] += delta;
    });
  }

  return CHART_MONTHS.map((name, i) => ({ name, scans: counts[i] }));
}

// ── Sub-components ─────────────────────────────────────────────────────────

function MobileNavLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-[9px] font-medium transition ${
          isActive ? "bg-green-500/15 text-green-400" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function NavItem({ to, icon, label, red, onClick }) {
  if (typeof onClick === "function") {
    return (
      <li onClick={onClick} className={`flex cursor-pointer items-center gap-4 rounded-lg px-3 py-2 transition ${red ? "text-red-500" : "text-gray-500 hover:bg-gray-800"}`}>
        {icon} <span className="text-sm font-medium">{label}</span>
      </li>
    );
  }
  return (
    <li>
      <NavLink to={to} className={({ isActive }) => `flex cursor-pointer items-center gap-4 rounded-lg px-3 py-2 transition ${isActive ? "bg-green-500/10 text-green-500" : "text-gray-500 hover:bg-gray-800"}`}>
        {icon} <span className="text-sm font-medium">{label}</span>
      </NavLink>
    </li>
  );
}

function StatCard({ title, total, threat, clean }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-900 bg-[#0d0d0d] p-4 sm:p-5">
      <h3 className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{title}</h3>
      <p className="my-2 text-3xl font-black">{total || 0}</p>
      <div className="flex justify-between border-t border-gray-900 pt-3 text-[9px] font-bold">
        <span className="text-red-600">THREAT: {threat || 0}</span>
        <span className="text-green-600">CLEAN: {clean || 0}</span>
      </div>
    </div>
  );
}