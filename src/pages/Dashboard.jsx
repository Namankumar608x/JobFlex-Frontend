import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// ── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Total Applied",  value: "24", delta: "+3 this week",  deltaPos: true,  icon: "◈", iconBg: "bg-zinc-100",   iconColor: "text-zinc-600" },
  { label: "Shortlisted",    value: "6",  delta: "+1 this week",  deltaPos: true,  icon: "★", iconBg: "bg-amber-50",   iconColor: "text-amber-500" },
  { label: "Interviews",     value: "4",  delta: "2 upcoming",    deltaPos: true,  icon: "◉", iconBg: "bg-blue-50",    iconColor: "text-blue-500" },
  { label: "Offers",         value: "2",  delta: "74% reply rate",deltaPos: true,  icon: "✦", iconBg: "bg-green-50",   iconColor: "text-green-600" },
  { label: "Rejected",       value: "8",  delta: "-2 from last mo",deltaPos: false, icon: "✕", iconBg: "bg-red-50",     iconColor: "text-red-500"  },
];

const APPLICATIONS = [
  { id:1, company:"Stripe",   role:"Frontend Engineer",    date:"Mar 05, 2025", status:"Interview",  source:"LinkedIn",  lastUpdate:"2d ago" },
  { id:2, company:"Linear",   role:"Product Designer",     date:"Mar 03, 2025", status:"Applied",    source:"Chrome Ext","lastUpdate":"4d ago" },
  { id:3, company:"Vercel",   role:"Software Engineer II", date:"Feb 28, 2025", status:"Offer",      source:"Manual",    lastUpdate:"1w ago" },
  { id:4, company:"Figma",    role:"Growth Engineer",      date:"Feb 25, 2025", status:"Rejected",   source:"Indeed",    lastUpdate:"1w ago" },
  { id:5, company:"Notion",   role:"Backend Engineer",     date:"Feb 20, 2025", status:"Shortlisted",source:"LinkedIn",  lastUpdate:"2w ago" },
  { id:6, company:"Loom",     role:"Full Stack Engineer",  date:"Feb 18, 2025", status:"Applied",    source:"Chrome Ext","lastUpdate":"2w ago" },
  { id:7, company:"Supabase", role:"Developer Advocate",   date:"Feb 14, 2025", status:"Interview",  source:"Manual",    lastUpdate:"3w ago" },
];

const ACTIVITY = [
  { type:"email",  text:"Stripe replied — interview scheduled for Mar 12",  time:"2 hours ago",  color:"text-blue-500",  dot:"bg-blue-400" },
  { type:"status", text:"Vercel application moved to Offer stage",           time:"1 day ago",    color:"text-green-600", dot:"bg-green-400" },
  { type:"add",    text:"New application added: Linear · Product Designer",  time:"4 days ago",   color:"text-zinc-600",  dot:"bg-zinc-400" },
  { type:"email",  text:"Figma replied — position has been filled",          time:"1 week ago",   color:"text-red-500",   dot:"bg-red-400" },
  { type:"add",    text:"New application added: Notion · Backend Engineer",  time:"2 weeks ago",  color:"text-zinc-600",  dot:"bg-zinc-400" },
];

const STATUS_META = {
  "Applied":     { cls: "bg-blue-50 text-blue-600 border border-blue-200" },
  "Shortlisted": { cls: "bg-amber-50 text-amber-600 border border-amber-200" },
  "Interview":   { cls: "bg-violet-50 text-violet-600 border border-violet-200" },
  "Offer":       { cls: "bg-green-50 text-green-700 border border-green-200" },
  "Rejected":    { cls: "bg-red-50 text-red-500 border border-red-200" },
};

const SOURCE_META = {
  "LinkedIn":   "bg-blue-100 text-blue-700",
  "Chrome Ext": "bg-zinc-100 text-zinc-600",
  "Manual":     "bg-zinc-100 text-zinc-600",
  "Indeed":     "bg-indigo-100 text-indigo-600",
};

// ── Mini bar chart ────────────────────────────────────────────────────────────
const BAR_DATA = [
  { month:"Oct", val:3 }, { month:"Nov", val:5 }, { month:"Dec", val:2 },
  { month:"Jan", val:7 }, { month:"Feb", val:4 }, { month:"Mar", val:6 },
];
const MAX_VAL = Math.max(...BAR_DATA.map(d => d.val));

function BarChart() {
  return (
    <div className="flex items-end gap-2 h-24 mt-4">
      {BAR_DATA.map((d, i) => (
        <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-md bg-zinc-900 transition-all duration-500"
            style={{ height: `${(d.val / MAX_VAL) * 80}px`, opacity: i === BAR_DATA.length - 1 ? 1 : 0.25 + (i / BAR_DATA.length) * 0.55 }}
          />
          <span className="text-[10px] text-zinc-400">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ── Donut chart (SVG) ─────────────────────────────────────────────────────────
const DONUT_DATA = [
  { label:"Applied",     val:10, color:"#18181b" },
  { label:"Shortlisted", val:6,  color:"#f59e0b" },
  { label:"Interview",   val:4,  color:"#8b5cf6" },
  { label:"Offer",       val:2,  color:"#22c55e" },
  { label:"Rejected",    val:8,  color:"#ef4444" },
];
const TOTAL = DONUT_DATA.reduce((a, d) => a + d.val, 0);

function DonutChart() {
  let cumulative = 0;
  const R = 42, CX = 56, CY = 56, strokeW = 14;
  const circ = 2 * Math.PI * R;

  return (
    <div className="flex items-center gap-6">
      <svg width="112" height="112" viewBox="0 0 112 112">
        {DONUT_DATA.map((d) => {
          const fraction = d.val / TOTAL;
          const dash = fraction * circ;
          const gap = circ - dash;
          const offset = circ * (1 - cumulative);
          cumulative += fraction;
          return (
            <circle
              key={d.label}
              cx={CX} cy={CY} r={R}
              fill="none" stroke={d.color} strokeWidth={strokeW}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={offset}
              style={{ transition: "all 0.5s ease", transform: "rotate(-90deg)", transformOrigin: `${CX}px ${CY}px` }}
            />
          );
        })}
        <text x={CX} y={CY - 4} textAnchor="middle" className="font-display" style={{fontFamily:"Fraunces,serif",fontWeight:800,fontSize:18,fill:"#18181b"}}>{TOTAL}</text>
        <text x={CX} y={CY + 12} textAnchor="middle" style={{fontSize:9,fill:"#a1a1aa",fontFamily:"DM Sans,sans-serif"}}>total</text>
      </svg>

      <div className="space-y-2">
        {DONUT_DATA.map(d => (
          <div key={d.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:d.color}} />
            <span className="text-[12px] text-zinc-500 w-20">{d.label}</span>
            <span className="text-[12px] font-semibold text-zinc-900">{d.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [filter, setFilter] = useState("All");
  const [deleteId, setDeleteId] = useState(null);
  const [apps, setApps] = useState(APPLICATIONS);

  const filters = ["All", "Applied", "Shortlisted", "Interview", "Offer", "Rejected"];
  const filtered = filter === "All" ? apps : apps.filter(a => a.status === filter);

  const handleDelete = (id) => {
    setApps(prev => prev.filter(a => a.id !== id));
    setDeleteId(null);
  };

  return (
    <Sidebar>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .anim-1 { animation: fadeUp 0.4s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.4s ease 0.12s both; }
        .anim-3 { animation: fadeUp 0.4s ease 0.20s both; }
        .anim-4 { animation: fadeUp 0.4s ease 0.28s both; }
      `}</style>

      {/* ── Page header ── */}
      <div className="anim-1 flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1 font-light">Good morning, Aarav 👋 — here's your job hunt overview.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white border border-zinc-200 px-3 py-2 rounded-lg">
          <span>📅</span> March 2025
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="anim-2 grid grid-cols-5 gap-4 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="bg-white border border-zinc-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-zinc-400 font-medium">{s.label}</span>
              <div className={`w-7 h-7 rounded-lg ${s.iconBg} flex items-center justify-center ${s.iconColor} text-sm`}>{s.icon}</div>
            </div>
            <div className="font-display text-3xl font-bold text-zinc-900 leading-none mb-1">{s.value}</div>
            <div className={`text-[11px] font-medium ${s.deltaPos ? "text-green-500" : "text-red-400"}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* ── Middle row: charts ── */}
      <div className="anim-3 grid grid-cols-3 gap-5 mb-8">

        {/* Monthly bar chart */}
        <div className="col-span-1 bg-white border border-zinc-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-zinc-900 text-sm">Monthly Applications</h3>
            <span className="text-[10px] text-zinc-400">Last 6 months</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-light">6 applications this month</p>
          <BarChart />
        </div>

        {/* Donut */}
        <div className="col-span-1 bg-white border border-zinc-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-zinc-900 text-sm">Status Distribution</h3>
            <span className="text-[10px] text-zinc-400">All time</span>
          </div>
          <p className="text-[11px] text-zinc-400 mb-4 font-light">Breakdown by application status</p>
          <DonutChart />
        </div>

        {/* Activity feed */}
        <div className="col-span-1 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-900 text-sm">Recent Activity</h3>
            <span className="text-[10px] text-zinc-400">Live</span>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${a.dot}`} />
                  {i < ACTIVITY.length - 1 && <div className="w-px flex-1 bg-zinc-100 mt-1" />}
                </div>
                <div className="pb-3 flex-1">
                  <p className={`text-[12px] font-medium leading-snug ${a.color}`}>{a.text}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Applications table ── */}
      <div className="anim-4 bg-white border border-zinc-200 rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-zinc-900 text-sm">All Applications</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">{filtered.length} of {apps.length} applications</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg p-1">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[11px] font-medium px-3 py-1.5 rounded-md transition-all
                    ${filter === f ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900 hover:bg-white"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Link to="/applications/new"
              className="text-xs bg-zinc-900 text-white px-3 py-2 rounded-lg hover:bg-zinc-700 transition-all no-underline font-medium">
              + Add
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                {["Company","Role","Applied","Status","Source","Last Update","Actions"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <tr key={app.id}
                  className={`border-b border-zinc-50 hover:bg-zinc-50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                  {/* Company */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                        {app.company[0]}
                      </div>
                      <span className="text-sm font-semibold text-zinc-900">{app.company}</span>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-6 py-4 text-sm text-zinc-500 font-light">{app.role}</td>
                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-zinc-400">{app.date}</td>
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_META[app.status]?.cls}`}>
                      {app.status}
                    </span>
                  </td>
                  {/* Source */}
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-md ${SOURCE_META[app.source]}`}>
                      {app.source}
                    </span>
                  </td>
                  {/* Last update */}
                  <td className="px-6 py-4 text-xs text-zinc-400">{app.lastUpdate}</td>
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-all text-sm" title="View">
                        👁
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-blue-600 transition-all text-sm" title="Edit">
                        ✏
                      </button>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-all text-sm"
                        title="Delete"
                        onClick={() => setDeleteId(app.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-zinc-400">
              <div className="text-4xl mb-3">◈</div>
              <p className="text-sm font-medium text-zinc-500">No applications found</p>
              <p className="text-xs mt-1">Try a different filter or add a new application</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete confirmation modal ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl border border-zinc-200">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500 text-lg">🗑</div>
            <h3 className="font-display font-bold text-lg text-zinc-900 mb-1 tracking-tight">Delete application?</h3>
            <p className="text-zinc-400 text-sm font-light mb-6">This action cannot be undone. The application will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 text-sm border border-zinc-200 text-zinc-700 py-2.5 rounded-xl hover:border-zinc-400 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 text-sm bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition-all font-medium shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}