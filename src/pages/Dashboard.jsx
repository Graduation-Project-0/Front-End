import React, { useEffect, useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import api from "../api/axios";
import { ENDPOINTS } from "../config/endpoints";
import { useAuth } from "../hooks/useAuth";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import NavBrandLink from "../components/NavBrandLink";
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
  } catch {
    /* ignore */
  }
  try {
    const pn = localStorage.getItem("pendingName");
    if (pn && trim(pn)) return trim(pn);
  } catch {
    /* ignore */
  }
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
  } catch {
    /* ignore */
  }
  return "User";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const displayUserName = resolveDashboardUserName(user);
  const { displaySrc, avatarDisabled, fileInputRef, onFileChange, openPicker } = useProfileAvatar();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartYear, setChartYear] = useState(() => new Date().getFullYear());
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const performLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    await logout();
    navigate("/login", { replace: true });
  };

  const getCleanRatePercent = (total, clean) => {
    const t = Number(total) || 0;
    const c = Number(clean) || 0;
    if (t <= 0) return null;
    return Math.max(0, Math.min(100, (c / t) * 100));
  };

  const getSecurityLevel = (percent) => {
    if (percent >= 90) return "SECURE";
    if (percent >= 70) return "GOOD";
    if (percent >= 50) return "WARNING";
    return "RISK";
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const emptyStats = () => ({
      file: { total: 0, threat: 0, clean: 0 },
      url: { total: 0, threat: 0, clean: 0 },
      email: { total: 0, threat: 0, clean: 0 },
      overall: 0,
      level: getSecurityLevel(0),
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        setHistoryError(null);
        const response = await api.get(ENDPOINTS.HISTORY, { signal });
        if (signal.aborted) return;

        const responseData = response.data;
        const apiData = responseData?.data;

        if (!apiData) {
          throw new Error("No data received from server");
        }

        const file = {
          total: apiData.file_analysis?.total || 0,
          threat: apiData.file_analysis?.malicious || 0,
          clean: apiData.file_analysis?.safe || 0,
        };
        const url = {
          total: apiData.url_analysis?.total || 0,
          threat: apiData.url_analysis?.malicious || 0,
          clean: apiData.url_analysis?.safe || 0,
        };
        const email = {
          total: apiData.email_analysis?.total || 0,
          threat: apiData.email_analysis?.malicious || 0,
          clean: apiData.email_analysis?.safe || 0,
        };

        const rates = [
          getCleanRatePercent(file.total, file.clean),
          getCleanRatePercent(url.total, url.clean),
          getCleanRatePercent(email.total, email.clean),
        ].filter((v) => typeof v === "number");

        const overall = rates.length
          ? Math.round(rates.reduce((sum, v) => sum + v, 0) / rates.length)
          : 0;

        setStats({
          file,
          url,
          email,
          overall,
          level: getSecurityLevel(overall),
        });

        const scansList = apiData.recent_scans || [];
        setRecentScans(scansList);

        const year = new Date().getFullYear();
        setChartYear(year);
        const chartSeries = responseData?.chart ?? responseData?.data?.chart;
        setChartData(buildMonthlyScansForYear(year, chartSeries, scansList));
      } catch (err) {
        if (signal.aborted || err.code === "ERR_CANCELED") return;
        const msg =
          err.code === "ECONNABORTED"
            ? "Request timed out. Is the API running (e.g. Laravel on port 8000 with Vite proxy)?"
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

  const scansMax = chartData.reduce((m, d) => Math.max(m, Number(d.scans) || 0), 0);
  const scansChartYMax = scansMax === 0 ? 6 : Math.max(6, Math.ceil(scansMax * 1.12));

  return (
    <>
      {confirmLogoutOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm logout"
          onClick={() => {
            if (logoutLoading) return;
            setConfirmLogoutOpen(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[#1E7D04]/20 bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(30,125,4,0.15),0_20px_60px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <h3 className="text-lg font-black text-white">Logout</h3>
              <p className="mt-2 text-sm text-gray-400">Are you sure you want to logout?</p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  disabled={logoutLoading}
                  onClick={() => setConfirmLogoutOpen(false)}
                  className="flex-1 rounded-xl border border-gray-700 bg-transparent py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await performLogout();
                    setConfirmLogoutOpen(false);
                  }}
                  disabled={logoutLoading}
                  className="flex-1 rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {logoutLoading ? "Logging out..." : "Yes, Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-page flex h-[100dvh] w-full max-w-[100vw] flex-col overflow-x-hidden bg-black font-sans text-white max-md:overflow-y-auto md:h-screen md:max-h-screen md:flex-row md:overflow-hidden">
        <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-gray-900 bg-[#0d0d0d] p-6 md:flex">
          <div className="mb-10">
            <NavBrandLink />
          </div>

          <nav className="flex-1">
            <ul className="space-y-4">
              <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavItem to="/file" icon={<FileText size={20} />} label="File" />
              <NavItem to="/url" icon={<LinkIcon size={20} />} label="URL" />
              <NavItem to="/email" icon={<Mail size={20} />} label="Email" />
              <NavItem to="/plans" icon={<HelpCircle size={20} />} label="Help" />
            </ul>
          </nav>

          <div className="mt-auto space-y-4">
            <Link
              to="/plans"
              className="block w-full rounded-xl bg-[#009e28] py-3 text-center text-sm font-bold transition hover:bg-[#0ba650]"
            >
              Upgrade Plan
            </Link>
            <NavItem
              icon={<LogOut size={20} />}
              label={logoutLoading ? "Logging out..." : "Logout"}
              red
              onClick={() => setConfirmLogoutOpen(true)}
            />
          </div>
        </aside>

        <div className="flex w-full min-w-0 flex-col max-md:flex-none md:min-h-0 md:flex-1">
          <div className="sticky top-0 z-40 border-b border-gray-900 bg-[#0a0a0a]/95 px-3 py-3 backdrop-blur-md md:hidden">
            <div className="mb-3 flex items-center justify-between gap-2">
              <NavBrandLink className="scale-90 origin-left" />
            </div>
            <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Dashboard sections">
              <MobileNavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Home" />
              <MobileNavLink to="/file" icon={<FileText size={18} />} label="File" />
              <MobileNavLink to="/url" icon={<LinkIcon size={18} />} label="URL" />
              <MobileNavLink to="/email" icon={<Mail size={18} />} label="Email" />
              <MobileNavLink to="/plans" icon={<HelpCircle size={18} />} label="Help" />
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

          <main className="box-border flex w-full min-w-0 flex-none flex-col gap-4 p-4 pb-8 md:min-h-0 md:flex-1 md:gap-6 md:overflow-hidden md:p-8">
          {historyError && (
            <div
              role="alert"
              className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
            >
              <span>{historyError}</span>
              <button
                type="button"
                onClick={() => setHistoryRefreshKey((k) => k + 1)}
                className="shrink-0 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-50 hover:bg-amber-500/25"
              >
                Retry
              </button>
            </div>
          )}
          <header className="flex shrink-0 flex-wrap items-center justify-end gap-3 max-md:w-full max-md:justify-between md:gap-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              aria-label="Choose profile photo"
              onChange={onFileChange}
            />
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#1a1a1a] px-3 py-2 text-xs text-gray-300 hover:bg-[#222] sm:px-5 sm:text-sm"
            >
              <Download size={16} /> <span className="max-sm:hidden">Reports</span><span className="sm:hidden">PDF</span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-800 pl-3 md:gap-4 md:pl-6">
              <div className="min-w-0 text-right">
                <p className="max-w-[140px] truncate text-sm font-bold sm:max-w-none">{displayUserName}</p>
                <p className="text-[10px] uppercase text-gray-500">Free Account</p>
              </div>
              <div className="relative shrink-0">
                {displaySrc ? (
                  <img
                    src={displaySrc}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-green-500/50 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-500/30 bg-white/5">
                    <User size={16} className="text-gray-200" />
                  </div>
                )}
                {!avatarDisabled && (
                  <button
                    type="button"
                    onClick={openPicker}
                    className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-[#1E7D04] text-white hover:bg-[#158003]"
                    aria-label="Change profile photo"
                  >
                    <Camera size={10} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
          </header>

          <section className="grid shrink-0 grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="File Analysis" {...stats?.file} />
            <StatCard title="URL Protection" {...stats?.url} />
            <StatCard title="Email Checked" {...stats?.email} />

            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-900 bg-[#0d0d0d] p-4">
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Overall Security
              </h3>
              <div className="relative h-24 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Clean", value: stats?.overall ?? 0 },
                        { name: "Threat", value: 100 - (stats?.overall ?? 0) },
                      ]}
                      dataKey="value"
                      innerRadius="70%"
                      outerRadius="100%"
                      paddingAngle={2}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      <Cell fill="#009e27" />
                      <Cell fill="#1a1a1a" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black text-green-500">{stats?.overall ?? 0}%</span>
                  <span className="text-[10px] font-bold uppercase text-gray-500">{stats?.level}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 max-md:flex-none lg:min-h-0 lg:flex-1 lg:auto-rows-fr lg:grid-cols-3 lg:grid-rows-1 lg:items-stretch">
            <div className="flex min-h-[280px] flex-col rounded-2xl border border-gray-900 bg-[#0d0d0d] p-4 sm:p-6 lg:col-span-2 lg:h-full lg:min-h-0">
              <h3 className="mb-1 shrink-0 font-bold tracking-wide text-gray-200">Scans by month</h3>
              <p className="mb-3 shrink-0 text-xs text-gray-500">Total scans per month in {chartYear}</p>
              <div className="min-h-[220px] w-full min-w-0 flex-1 sm:min-h-[260px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                  <AreaChart data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 4 }}>
                    <defs>
                      <linearGradient id="dashboardScansFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#b8f5c4" stopOpacity={0.65} />
                        <stop offset="35%" stopColor="#7CFF8A" stopOpacity={0.35} />
                        <stop offset="70%" stopColor="#1E7D04" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#0d0d0d" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#4b5563"
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      tick={{ fontSize: 9 }}
                      height={32}
                    />
                    <YAxis
                      stroke="#4b5563"
                      tickLine={false}
                      axisLine={false}
                      width={36}
                      allowDecimals={false}
                      domain={[0, scansChartYMax]}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0d0d0d", border: "1px solid #333" }}
                      formatter={(value) => [`${value}`, "Scans"]}
                      labelFormatter={(label) => `${label} ${chartYear}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="scans"
                      stroke="#7CFF8A"
                      strokeWidth={3.5}
                      fill="url(#dashboardScansFill)"
                      dot={{
                        fill: "#0d0d0d",
                        r: 4,
                        stroke: "#7CFF8A",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 8, fill: "#7CFF8A", stroke: "#e8ffe8", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex min-h-0 flex-col rounded-2xl border border-gray-900 bg-[#0d0d0d] p-4 sm:p-6 lg:min-h-0">
              <h3 className="mb-4 shrink-0 font-bold tracking-wide text-gray-200">Recent Scan</h3>
              <div className="custom-scrollbar max-md:max-h-none max-md:flex-none max-md:overflow-visible min-h-0 flex-1 overflow-y-auto pr-2 lg:min-h-[12rem]">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-[#0d0d0d] text-[10px] uppercase tracking-wide text-gray-600">
                    <tr>
                      <th className="pb-2">Item</th>
                      <th className="pb-2 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {recentScans.length > 0 ? (
                      recentScans.map((scan, i) => (
                        <tr key={i} className="border-b border-gray-900/50">
                          <td className="max-w-[min(55vw,200px)] truncate py-3 text-gray-400 sm:max-w-[120px]">
                            {scan.item}
                          </td>
                          <td
                            className={`py-3 text-right font-bold ${
                              scan.result === "malicious" ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {scan.result}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="py-10 text-center text-gray-600">
                          No scans
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="mt-4 w-full shrink-0 rounded-lg border border-green-500/20 bg-[#1db954]/10 py-2 font-bold text-green-500"
              >
                View All
              </button>
            </div>
          </section>
          </main>
        </div>
      </div>
    </>
  );
}

const CHART_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
        scan?.created_at ??
        scan?.scanned_at ??
        scan?.date ??
        scan?.timestamp ??
        scan?.time ??
        scan?.scan_date;
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
      <li
        onClick={onClick}
        className={`flex cursor-pointer items-center gap-4 rounded-lg px-3 py-2 transition ${
          red ? "text-red-500" : "text-gray-500 hover:bg-gray-800"
        }`}
      >
        {icon} <span className="text-sm font-medium">{label}</span>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex cursor-pointer items-center gap-4 rounded-lg px-3 py-2 transition ${
            isActive ? "bg-green-500/10 text-green-500" : "text-gray-500 hover:bg-gray-800"
          }`
        }
      >
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
