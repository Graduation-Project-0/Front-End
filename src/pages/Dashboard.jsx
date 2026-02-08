import React from "react";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";
import {
  Home,
  FileText,
  Mail,
  HelpCircle,
  LogOut,
  ChevronDown,
  Download,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await logout();
  } catch (e) {
    console.log(e);
  } finally {
    localStorage.removeItem("token");
    navigate("/login");
  }
};

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">

      {/* =========================== SIDEBAR =========================== */}
      <aside className="w-64 bg-[#0d140d] border-r border-[#1a1f1a] p-6 flex flex-col max-md:hidden">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <img src="/logo-green.svg" className="w-10" alt="" />
          <h2 className="text-2xl font-bold text-green-500 tracking-wide">
            VANGUARD
          </h2>
        </div>

        {/* Nav */}
        <ul className="space-y-6">
          <NavItem icon={<Home size={20} />} label="Dashboard" active />
          <NavItem icon={<FileText size={20} />} label="File" />
          <NavItem icon={<Link size={20} />} label="URL" />
          <NavItem icon={<Mail size={20} />} label="Email" />
          <NavItem icon={<HelpCircle size={20} />} label="Help" />
        </ul>

        {/* Logout */}
        <div className="mt-auto">
          <NavItem
            icon={<LogOut size={20} />}
            label="Logout"
            red
            onClick={handleLogout}
          />
        </div>

        {/* Upgrade Button */}
 <Link 
  to="/plans" 
  className="relative z-10 block mt-4 bg-green-600 text-black py-3 rounded-xl font-semibold hover:bg-green-500 transition text-center"
>
  Upgrade to Go
</Link>
      </aside>

      {/* =========================== MAIN CONTENT =========================== */}
      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <header className="flex justify-end items-center gap-4 mb-6">
          <button className="flex items-center gap-2 bg-[#131313] border border-[#222] px-4 py-2 rounded-xl">
            <Download size={18} /> Download Reports
          </button>

          <button className="flex items-center gap-2 bg-[#131313] border border-[#222] px-4 py-2 rounded-xl">
            Last 20 Day <ChevronDown size={16} />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-semibold">Eslam Abbas</p>
              <p className="text-xs text-gray-400">Malware Analyst</p>
            </div>
            <img
              src="/user.png"
              className="w-12 h-12 rounded-full object-cover"
              alt=""
            />
          </div>
        </header>

        {/* Top Cards */}
        <section className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-6">

          <StatCard title="File Analysis" total={46} threat={10} clean={40} />
          <StatCard title="URL Protection" total={50} threat={10} clean={40} />
          <StatCard title="Email Checked" total={33} threat={10} clean={40} />

          {/* Security Ring Card */}
          <div className="bg-[#0f0f10] p-6 rounded-2xl border border-[#1f1f21] shadow-[0_0_20px_rgba(0,255,0,0.05)]">
            <h3 className="text-center text-gray-400 mb-4">
              Overall Security Detect
            </h3>

            <div className="flex justify-center mb-4">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    stroke="#333"
                    strokeWidth="14"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    stroke="#17c34a"
                    strokeWidth="14"
                    strokeDasharray="377"
                    strokeDashoffset="75"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-green-500">High</p>
                  <p className="text-sm text-gray-400">80% Threat Level</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between px-4 text-sm">
              <span className="text-red-500">• Threat</span>
              <span className="text-green-500">• Clean</span>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="grid lg:grid-cols-2 gap-6">

          {/* Recent Activities */}
          <div className="bg-[#0f0f10] p-6 rounded-2xl border border-[#1f1f21] shadow-[0_0_20px_rgba(0,255,0,0.05)]">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-300 text-lg">Recent Activities</h3>

              <button className="flex items-center gap-2 bg-[#1a1a1c] px-3 py-1 rounded-xl border border-[#222] text-gray-300 text-sm">
                Last 20 Day <ChevronDown size={14} />
              </button>
            </div>

            <div className="mt-4 h-64 bg-[#111] rounded-xl border border-[#222] relative">
              <img
                src="/chart-green.png"
                alt="chart"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
            </div>
          </div>

          {/* Recent Scan */}
          <div className="bg-[#0f0f10] p-6 rounded-2xl border border-[#1f1f21] shadow-[0_0_20px_rgba(0,255,0,0.05)]">
            <h3 className="text-gray-300 text-lg mb-4">Recent Scan</h3>

            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 border-b border-[#222]">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Result</th>
                </tr>
              </thead>

              <tbody>
                <TableRow item="support@phishy.com" type="Email" result="Threat" />
                <TableRow item="invoice_2025.pdf" type="File" result="Clean" />
                <TableRow item="http://suspicious.link" type="URL" result="Threat" />
              </tbody>
            </table>

            <button className="mt-5 w-full bg-green-600 text-black py-2 rounded-xl font-semibold hover:bg-green-500 transition">
              View All Scans
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ===================== Components ===================== */

function NavItem({ icon, label, active, red, onClick }) {
  return (
    <li
      onClick={onClick}
      className={`
        flex items-center gap-3 cursor-pointer text-lg
        ${active ? "text-green-500" : red ? "text-red-500" : "text-gray-300"}
        hover:text-white transition
      `}
    >
      {icon}
      {label}
    </li>
  );
}

function StatCard({ title, total, threat, clean }) {
  return (
    <div className="bg-[#0f0f10] p-6 rounded-2xl border border-[#1f1f21] shadow-[0_0_20px_rgba(0,255,0,0.05)]">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-4xl font-semibold mt-2">{total}</p>

      <div className="mt-4 text-sm">
        <p className="text-red-500">• Threat: {threat}</p>
        <p className="text-green-500">• Clean: {clean}</p>
      </div>
    </div>
  );
}

function TableRow({ item, type, result }) {
  return (
    <tr className="border-b border-[#222]">
      <td className="py-2 text-gray-300">{item}</td>
      <td className="py-2 text-gray-400">{type}</td>
      <td
        className={`py-2 font-semibold ${
          result === "Threat" ? "text-red-500" : "text-green-500"
        }`}
      >
        • {result}
      </td>
    </tr>
  );
}
