import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Code,
  ExternalLink,
  Briefcase,
  Target,
  Award,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Globe,
  TrendingUp,
  ChevronRight,
  Zap,
  User,
  ArrowRight,
  FileText,
  Send,
  CheckCircle,
  XCircle
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Heatmap from "../components/Heatmap";
import { useAuth } from "../context/authContext";
import { useDashboard } from "../context/dashboardContext";
import api from "../utils/api";
// ── Custom Icons ─────────────────────────────────────────────────────────────

const GitHubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// ── Static Content ───────────────────────────────────────────────────────────
const StatSkeleton = () => {
  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 bg-zinc-200 rounded-2xl"></div>
        <div className="space-y-2">
          <div className="h-3 w-16 bg-zinc-200 rounded"></div>
          <div className="h-6 w-10 bg-zinc-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};
const SHEETS = [
  { name: "Striver A2Z Sheet", desc: "Step-by-step DSA mastery guide.", link: "https://takeuforward.org/strivers-a2z-dsa-course-sheet-2/" },
  { name: "NeetCode 150", desc: "The essential LeetCode patterns.", link: "https://neetcode.io/practice" },
  { name: "CSES Problem Set", desc: "Hardcore algorithmic practice.", link: "https://cses.fi/problemset/" }
];

const EVENTS = [
  { name: "GSoC 2026", date: "2026-03-25", type: "Open Source", link: "https://summerofcode.withgoogle.com/" },
  { name: "Google STEP Internship", date: "2025-10-15", type: "Internship", link: "https://buildyourfuture.withgoogle.com/programs/step" },
  { name: "Uber Hackercup", date: "2025-07-20", type: "Competition", link: "https://www.uber.com/careers" },
  { name: "Meta Hacker Cup", date: "2025-08-14", type: "Competition", link: "https://www.facebook.com/codingcompetitions/hacker-cup" }
].sort((a, b) => new Date(a.date) - new Date(b.date));

// ── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth();
  // console.log(user);
  const [currentTime, setCurrentTime] = useState(new Date());
  const {stats,setStats}=useDashboard();
  const [loading, setLoading] = useState(true);
  const [githubStats, setGithubStats] = useState({
    contributions: 842,
    repos: 34,
    stars: 12
  });
useEffect(()=>{
  const fetch=async()=>{
    setLoading(true);
    try {
      const res=await api("get","api/applications/summary/");
      console.log(res.data);

  setStats({
  total: res.data.total || 0,
  applied: res.data.status?.applied || 0,
  accepted: res.data.status?.accepted || 0, 
  rejected: res.data.status?.rejected || 0
});
    } catch (error) {
      console.log("error fetching stats",error);
    }
    finally{
      setLoading(false);
    }
  }
  fetch();
},[])
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const statsLoop = setInterval(() => {
      setGithubStats(prev => ({
        ...prev,
        contributions: prev.contributions + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 5000);
    return () => { clearInterval(timer); clearInterval(statsLoop); };
  }, []);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleString('en-US', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
    }).replace(',', ' ·');
  }, [currentTime]);
const applicationSummary = [
  {
    label: "Total",
    value: stats.total,
    icon: FileText,   // import from lucide-react
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  {
    label: "Applied",
    value: stats.applied,
    icon: Send,
    color: "text-yellow-600",
    bg: "bg-yellow-100"
  },
  {
    label: "Accepted",
    value: stats.accepted,
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100"
  },
  {
    label: "Rejected",
    value: stats.rejected,
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100"
  }
];

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto scroll-smooth">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-zinc-900 tracking-tight leading-tight">
              Welcome back, {user?.uname || "Aarav"}
            </h1>
            <p className="text-zinc-400 font-light text-sm mt-2 flex items-center gap-2">
              <Clock size={16} className="text-zinc-300" />
              {formattedDate}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="group bg-zinc-900 text-white rounded-2xl py-3 px-6 font-semibold text-sm hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-3"
            >
              View Profile
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {loading ? (
  [...Array(4)].map((_, i) => <StatSkeleton key={i} />)
) : (
  <>
          {applicationSummary.map((stat, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-zinc-900 leading-none tabular-nums">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
          </>
        )}
        </div>

        {/* Coding Insights Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8 px-1">
            <h2 className="font-display font-bold text-2xl text-zinc-900 tracking-tight">Coding Insights</h2>
            <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5 ml-2">
              <TrendingUp size={12} /> Live Data
            </div>
          </div>

          {/* GitHub Card — standalone full width or right-aligned */}
      
        </div>

        {/* Heatmap Section — now includes LC + CF donut cards + heatmap */}
        <div className="bg-white border border-zinc-200 rounded-[2rem] mb-12 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
           
              <p className="text-zinc-400 text-sm font-light italic">Detailed coding activity over the last year</p>
            </div>
            <div className="flex items-center gap-4 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Intensity</span>
              <div className="flex gap-2 pr-1">
                {[0, 1, 2, 3].map(v => (
                  <div key={v} className={`w-4 h-4 rounded-md ${v === 0 ? 'bg-zinc-100' : v === 1 ? 'bg-blue-100' : v === 2 ? 'bg-blue-300' : 'bg-blue-600'}`}></div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-8 bg-zinc-50/20 overflow-x-auto">
            <div className="min-w-[800px]">
              <Heatmap />
            </div>
          </div>
        </div>

        {/* Practice Sheets & Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Curated Sheets */}
          <div className="space-y-8">
            <h2 className="font-display font-bold text-2xl text-zinc-900 tracking-tight flex items-center gap-3 px-1">
              Curated Sheets <Award size={24} className="text-zinc-300" />
            </h2>
            <div className="space-y-4">
              {SHEETS.map((sheet, i) => (
                <div key={i} className="bg-white border border-zinc-200 rounded-[1.5rem] p-6 hover:border-zinc-400 hover:shadow-xl transition-all group flex items-center justify-between shadow-sm border-l-4 border-l-transparent hover:border-l-zinc-900">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{sheet.name}</h3>
                    <p className="text-zinc-400 text-sm font-light">{sheet.desc}</p>
                  </div>
                  <a href={sheet.link} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-sm border border-zinc-100">
                    <ExternalLink size={20} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div className="space-y-8">
            <h2 className="font-display font-bold text-2xl text-zinc-900 tracking-tight flex items-center gap-3 px-1">
              Upcoming Milestones <AlertCircle size={24} className="text-zinc-300" />
            </h2>
            <div className="space-y-4">
              {EVENTS.map((event, i) => (
                <div key={i} className="bg-white border border-zinc-200 rounded-[1.5rem] p-6 hover:border-zinc-400 hover:shadow-xl transition-all group flex items-center justify-between shadow-sm border-l-4 border-l-transparent hover:border-l-blue-600">
                  <div className="flex items-center gap-5">
                    <div className="text-center w-14 py-3 bg-zinc-50 rounded-2xl border border-zinc-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      <span className="text-[10px] font-black text-zinc-400 group-hover:text-blue-400 uppercase block leading-none mb-1">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</span>
                      <span className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 leading-none">{new Date(event.date).getDate()}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{event.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded">{event.type}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-200"></span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{new Date(event.date).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                  <a href={event.link} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-sm border border-zinc-100">
                    <ExternalLink size={20} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-20"></div>
      </main>
    </div>
  );
}