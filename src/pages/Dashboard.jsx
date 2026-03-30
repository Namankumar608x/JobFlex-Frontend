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
  ArrowRight
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Heatmap from "../components/Heatmap"; 
import { useAuth } from "../context/authContext";

// ── Custom Icons ─────────────────────────────────────────────────────────────

const GitHubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// ── Reusable Donut Chart Component ───────────────────────────────────────────

const CodingDonutChart = ({ easy, medium, hard, total }) => {
  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const totalVal = (easy + medium + hard) || 1;
  const easyPct = (easy / totalVal) * circumference;
  const mediumPct = (medium / totalVal) * circumference;
  const hardPct = (hard / totalVal) * circumference;

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke="#f4f4f5" strokeWidth={strokeWidth} fill="transparent" />
        <circle cx={size/2} cy={size/2} r={radius} stroke="#10b981" strokeWidth={strokeWidth} fill="transparent" 
          strokeDasharray={`${easyPct} ${circumference}`} />
        <circle cx={size/2} cy={size/2} r={radius} stroke="#f59e0b" strokeWidth={strokeWidth} fill="transparent" 
          strokeDasharray={`${mediumPct} ${circumference}`} strokeDashoffset={-easyPct} />
        <circle cx={size/2} cy={size/2} r={radius} stroke="#f43f5e" strokeWidth={strokeWidth} fill="transparent" 
          strokeDasharray={`${hardPct} ${circumference}`} strokeDashoffset={-(easyPct + mediumPct)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-zinc-900 leading-none tabular-nums">{total}</span>
        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">Solved</span>
      </div>
    </div>
  );
};

// ── Static Content ───────────────────────────────────────────────────────────

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
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Simulated Live Stats State
  const [codingStats, setCodingStats] = useState({
    leetcode: { solved: 452, easy: 120, medium: 280, hard: 52, rank: "Top 5%" },
    codeforces: { rating: 1542, solved: 210, easy: 40, medium: 120, hard: 50, rank: "Specialist" },
    github: { contributions: 842, repos: 34, stars: 12 }
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const statsLoop = setInterval(() => {
      setCodingStats(prev => ({
        ...prev,
        leetcode: { ...prev.leetcode, solved: prev.leetcode.solved + (Math.random() > 0.95 ? 1 : 0) },
        github: { ...prev.github, contributions: prev.github.contributions + (Math.random() > 0.8 ? 1 : 0) }
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
    { label: "Applied", value: 24, icon: Briefcase, color: "text-zinc-600", bg: "bg-zinc-100" },
    { label: "Shortlisted", value: 6, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Interviews", value: 4, icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Offers", value: 2, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto scroll-smooth">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-zinc-900 tracking-tight leading-tight">
              Welcome back, {user?.name || "Aarav"}
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
        </div>

        {/* Coding Profiles & Pie Charts */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8 px-1">
            <h2 className="font-display font-bold text-2xl text-zinc-900 tracking-tight">Coding Insights</h2>
            <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5 ml-2">
              <TrendingUp size={12} /> Live Data
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LeetCode Donut Card */}
            <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-8">
              <CodingDonutChart 
                easy={codingStats.leetcode.easy} 
                medium={codingStats.leetcode.medium} 
                hard={codingStats.leetcode.hard} 
                total={codingStats.leetcode.solved} 
              />
              <div className="flex-1 w-full">
                <h3 className="font-display font-bold text-xl text-zinc-900 mb-4 flex items-center gap-2">
                  <Code size={18} className="text-zinc-400"/> LeetCode
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-500 uppercase tracking-widest">Easy</span>
                    <span className="text-zinc-900 tabular-nums">{codingStats.leetcode.easy}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-500 uppercase tracking-widest">Medium</span>
                    <span className="text-zinc-900 tabular-nums">{codingStats.leetcode.medium}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-rose-500 uppercase tracking-widest">Hard</span>
                    <span className="text-zinc-900 tabular-nums">{codingStats.leetcode.hard}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Codeforces Donut Card */}
            <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-8">
              <CodingDonutChart 
                easy={codingStats.codeforces.easy} 
                medium={codingStats.codeforces.medium} 
                hard={codingStats.codeforces.hard} 
                total={codingStats.codeforces.solved} 
              />
              <div className="flex-1 w-full">
                <h3 className="font-display font-bold text-xl text-zinc-900 mb-2 flex items-center gap-2">
                  <Activity size={18} className="text-zinc-400"/> Codeforces
                </h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-4">{codingStats.codeforces.rank}</p>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-2">
                  <span className="text-sm font-bold text-zinc-400">Rating</span>
                  <span className="text-2xl font-bold text-blue-600 tabular-nums">{codingStats.codeforces.rating}</span>
                </div>
              </div>
            </div>

            {/* GitHub Card (Muted Dark Style) */}
            <div className="bg-zinc-900 text-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <GitHubIcon size={28} className="text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700">Analytics</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <span className="text-5xl font-bold tracking-tight block tabular-nums">{codingStats.github.contributions}</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 block">Yearly Contributions</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 pt-4 border-t border-zinc-800">
                    <div>
                      <span className="text-2xl font-bold block tabular-nums">{codingStats.github.repos}</span>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Repositories</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold block tabular-nums">{codingStats.github.stars}</span>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Total Stars</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000 pointer-events-none">
                <GitHubIcon size={200} />
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="bg-white border border-zinc-200 rounded-[2rem] mb-12 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-zinc-900 tracking-tight leading-none mb-3">Activity Heatmap</h2>
              <p className="text-zinc-400 text-sm font-light italic">Detailed coding activity over the last year</p>
            </div>
            <div className="flex items-center gap-4 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Intensity</span>
               <div className="flex gap-2 pr-1">
                 {[0,1,2,3].map(v => <div key={v} className={`w-4 h-4 rounded-md ${v===0 ? 'bg-zinc-100' : v===1 ? 'bg-blue-100' : v===2 ? 'bg-blue-300' : 'bg-blue-600'}`}></div>)}
               </div>
            </div>
          </div>
          {/* Heatmap wrapper to suppress internal styles from Heatmap.jsx if possible */}
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