import React from "react";
import { logout } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
// استيراد مكونات الشارت
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  LayoutDashboard, // استبدال Home بـ Dashboard icon لتطابق الصورة
  FileText,
  Link as LinkIcon,
  Mail,
  HelpCircle,
  LogOut,
  ChevronDown,
  Download,
} from "lucide-react";


const data = [
  { name: '18 July', value: 300 },
  { name: '19 July', value: 550 },
  { name: '19 July', value: 400 },
  { name: '19 July', value: 650 },
  { name: '19 July', value: 450 },
  { name: '19 July', value: 850 },
  { name: '18 July', value: 400 },
  { name: '19 July', value: 500 },
  { name: '19 July', value: 420 },
  { name: '19 July', value: 100 },
  { name: '19 July', value: 580 },
  { name: '19 July', value: 480 },
  { name: '19 July', value: 400 },
];

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
    <div className="h-screen flex bg-black text-white font-sans overflow-hidden">

      {/* =========================== SIDEBAR =========================== */}
      <aside className="w-64 bg-[#0d0d0d] border-r border-gray-900 p-6 flex flex-col max-md:hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <img src="/FullLogoBlack.png" className="w-full h-full" alt="Vanguard Logo" />
        </div>

        {/* Nav */}
        <nav className="flex-1">
          <ul className="space-y-6">
            <NavItem icon={<LayoutDashboard size={22} />} label="Dashboard" active />
            <NavItem icon={<FileText size={22} />} label="File" />
            <NavItem icon={<LinkIcon size={22} />} label="URL" />
            <NavItem icon={<Mail size={22} />} label="Email" />
            <NavItem icon={<HelpCircle size={22} />} label="Help" />
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto space-y-4">
          <NavItem
            icon={<LogOut size={22} />}
            label="Logout"
            red
            onClick={handleLogout}
          />
          <Link 
            to="/plans" 
            className="block w-full bg-[#009e28]  py-3 rounded-xl font-bold hover:bg-[#0ba650] transition text-center text-sm shadow-[0_0_15px_rgba(29,185,84,0.3)]"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-lg"></span> Upgrade to Go
            </span>
          </Link>
        </div>
      </aside>

      {/* =========================== MAIN CONTENT =========================== */}
      <main className="h-screen flex-1 p-8 overflow-auto">

        {/* Header */}
        <header className="flex justify-end items-center gap-6 mb-10">
          <button className="flex items-center gap-2 bg-[#1a1a1a] text-gray-300 px-5 py-2.5 rounded-xl text-sm border border-gray-800">
            <Download size={18} /> Download Reports
          </button>

          <button className="flex items-center gap-2 bg-[#1a1a1a] text-gray-300 px-5 py-2.5 rounded-xl text-sm border border-gray-800">
            Last 20 Day <ChevronDown size={16} />
          </button>

          <div className="flex items-center gap-4 border-l border-gray-800 pl-6">
            <div className="text-right">
              <p className="font-bold text-sm">Eslam Abbas</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Malware Analyst</p>
            </div>
            <div className="relative">
                <img src="/profile.png" className="w-11 h-11 rounded-full border-2 border-green-500/50 p-0.5" alt="Profile" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Top Stats Section */}
<section className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 mb-6">
  <StatCard title="File Analysis" total={46} threat={6} clean={40} />
  <StatCard title="URL Protection" total={50} threat={10} clean={40} />
  <StatCard title="Email Checked" total={33} threat={3} clean={30} />

  {/* Security Ring Card - تصغير الحاوية والدائرة */}
  <div className="bg-[#0d0d0d] p-4 rounded-xl border border-gray-900 flex flex-col items-center">
    <h3 className="text-gray-400 text-xs mb-4">Overall Security Detect</h3>
    <div className="relative w-28 h-28"> {/* تم تصغير العرض والارتفاع من 36 لـ 28 */}
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="56" cy="56" r="48" stroke="#1a1a1a" strokeWidth="10" fill="none" />
        <circle 
          cx="56" 
          cy="56" 
          r="48" 
          stroke="#009e27" 
          strokeWidth="10" 
          strokeDasharray="301.5" 
          strokeDashoffset="60" 
          fill="none" 
          strokeLinecap="round"  
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xl font-black text-green-500 italic">High</p>
        <p className="text-[8px] text-gray-500">80% Threat Level</p>
      </div>
    </div>
    <div className="flex gap-6 mt-4 text-[9px] font-bold">
      <span className="text-red-500 uppercase tracking-tighter">• Threat</span>
      <span className="text-green-500 uppercase tracking-tighter">• Clean</span>
    </div>
  </div>
</section>
        {/* Charts & Table Section */}
        <section className="grid lg:grid-cols-3 gap-4">

          {/* Recent Activities (Chart)  */}
          <div className="lg:col-span-2 bg-[#0d0d0d] p-6 rounded-2xl border border-gray-900">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-gray-200 font-bold">Resent Activites</h3>
              <button className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-gray-800 text-xs text-green-500">
                Last 20 Day <ChevronDown size={14} />
              </button>
            </div>
            
            {/* chart */}
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1db954" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1db954" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 10}} />
                  <Tooltip contentStyle={{backgroundColor: '#0d0d0d', border: '1px solid #333'}} />
                  <Area type="monotone" dataKey="value" stroke="#1db954" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Scan (Table) */}
          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-gray-900 flex flex-col">
            <h3 className="text-gray-200 font-bold mb-6">Resent Scan</h3>
            <table className="w-full text-left">
              <thead className="text-gray-600 text-xs uppercase border-b border-gray-900">
                <tr>
                  <th className="pb-4 font-medium">Item</th>
                  <th className="pb-4 font-medium">Type</th>
                  <th className="pb-4 font-medium">Result</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <TableRow item="support@phishy.com" type="Email" result="Threat" />
                <TableRow item="invoice_2025.pdf" type="File" result="Clean" />
                <TableRow item="http://suspicious.link" type="URL" result="Threat" />
              </tbody>
            </table>

            <button className="mt-auto w-full bg-[#1db954]/10 text-green-500 border border-green-500/20 py-3 rounded-xl font-bold hover:bg-green-500 hover:text-black transition duration-300">
              View All Scans
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ===================== المكونات الفرعية ===================== */

function NavItem({ icon, label, active, red, onClick }) {
  return (
    <li
      onClick={onClick}
      className={`
        flex items-center gap-4 cursor-pointer py-1 group
        ${active ? "text-green-500 border-r-4 border-green-500 -mr-6" : red ? "text-red-500" : "text-gray-500"}
        hover:text-white transition-all
      `}
    >
      <span className={`${active ? "text-green-500" : "group-hover:text-green-400"}`}>{icon}</span>
      <span className="font-medium">{label}</span>
    </li>
  );
}

function StatCard({ title, total, threat, clean }) {
  return (
    <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-gray-900 hover:border-green-500/30 transition-all group">
      <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-5xl font-black mb-6 group-hover:text-green-500 transition-colors">{total}</p>
      <div className="space-y-2 border-t border-gray-900 pt-4 text-xs font-bold">
        <p className="text-red-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.5)]"></span>
            THREAT: {threat}
        </p>
        <p className="text-green-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full shadow-[0_0_8px_rgba(22,163,74,0.5)]"></span>
            CLEAN: {clean}
        </p>
      </div>
    </div>
  );
}

function TableRow({ item, type, result }) {
  return (
    <tr className="border-b border-gray-900/50 group hover:bg-white/5 transition-all">
      <td className="py-4 text-gray-400 truncate max-w-[120px]">{item}</td>
      <td className="py-4 text-gray-600 text-xs">{type}</td>
      <td className={`py-4 font-bold text-xs uppercase ${result === "Threat" ? "text-red-500" : "text-green-500"}`}>
        • {result}
      </td>
    </tr>
  );
}