import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { fetchData } from "../utils/profileData.js";
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
import { Tooltip } from "react-tooltip";
import { useCodeStats } from "../context/codingContext.jsx";
// ── Reusable Donut Chart Component (from Dashboard) ──────────────────────────
const GitHubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
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
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f4f4f5" strokeWidth={strokeWidth} fill="transparent" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#10b981" strokeWidth={strokeWidth} fill="transparent"
          strokeDasharray={`${easyPct} ${circumference}`} />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f59e0b" strokeWidth={strokeWidth} fill="transparent"
          strokeDasharray={`${mediumPct} ${circumference}`} strokeDashoffset={-easyPct} />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f43f5e" strokeWidth={strokeWidth} fill="transparent"
          strokeDasharray={`${hardPct} ${circumference}`} strokeDashoffset={-(easyPct + mediumPct)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-zinc-900 leading-none tabular-nums">{total}</span>
        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">Solved</span>
      </div>
    </div>
  );
};

// ── Heatmap Component ─────────────────────────────────────────────────────────

const Heatmap = () => {
  const {data, setData} = useCodeStats();
const [codingStats, setCodingStats] = useState({
    github: { contributions: 842, repos: 34, stars: 12 }
  });
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchData("tarundeepakjain", "tarundeepakjain");
        console.log("FULL DATA:", res);
        setData(res);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  if (!data) return <div className="p-8 text-zinc-400 text-sm">Loading...</div>;
  
  // Safe fallbacks
  const lcStats = data?.leetcode?.stats || {};
  const cfStats = data?.codeforces?.stats || {};
  const combined = data?.heatmap || [];
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  // Parse difficulty breakdowns
  const lcEasy = lcStats.submissions?.find(s => s.difficulty === "Easy")?.count ?? 0;
  const lcMedium = lcStats.submissions?.find(s => s.difficulty === "Medium")?.count ?? 0;
  const lcHard = lcStats.submissions?.find(s => s.difficulty === "Hard")?.count ?? 0;
  const lcTotal = lcStats.total ?? 0;

  const cfEasy = cfStats.easy ?? 0;
  const cfMedium = cfStats.medium ?? 0;
  const cfHard = cfStats.hard ?? 0;
  const cfTotal = cfStats.total ?? 0;

  return (
    <div className="font-sans">

      {/* ── Coding Profile Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

        {/* LeetCode Card */}
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-8">
          <CodingDonutChart
            easy={lcEasy}
            medium={lcMedium}
            hard={lcHard}
            total={lcTotal}
          />
          <div className="flex-1 w-full">
            <h3 className="font-bold text-xl text-zinc-900 mb-4 flex items-center gap-2">
              <Code size={18} className="text-zinc-400" /> LeetCode
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-500 uppercase tracking-widest">Easy</span>
                <span className="text-zinc-900 tabular-nums">{lcEasy}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-500 uppercase tracking-widest">Medium</span>
                <span className="text-zinc-900 tabular-nums">{lcMedium}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-rose-500 uppercase tracking-widest">Hard</span>
                <span className="text-zinc-900 tabular-nums">{lcHard}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Codeforces Card */}
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-8">
          <CodingDonutChart
            easy={cfTotal}
            medium={cfMedium}
            hard={cfHard}
            total={cfTotal}
          />
          <div className="flex-1 w-full">
            <h3 className="font-bold text-xl text-zinc-900 mb-2 flex items-center gap-2">
              <Activity size={18} className="text-zinc-400" /> Codeforces
            </h3>
            {cfStats.rank && (
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-4">{cfStats.rank}</p>
            )}
          
            {cfStats.rating && (
              <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-4">
                <span className="text-sm font-bold text-zinc-400">Rating</span>
                <span className="text-2xl font-bold text-blue-600 tabular-nums">{cfStats.rating }</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*Github*/}
        {/* <div className="bg-zinc-900 text-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
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
            </div> */}

      {/* ── Heatmap ── */}
      <div>
         <h2 className="font-display font-bold text-2xl text-zinc-900 tracking-tight leading-none mb-3">Activity Heatmap</h2>
      <CalendarHeatmap
  startDate={new Date(oneYearAgo)}
  endDate={new Date()}
  values={Array.isArray(combined) ? combined : []}

  classForValue={(value) => {
    if (!value || !value.total) return "color-empty";
    if (value.total >= 10) return "color-github-4";
    if (value.total >= 5) return "color-github-3";
    if (value.total >= 2) return "color-github-2";
    return "color-github-1";
  }}

  tooltipDataAttrs={(value) => {
    if (!value || !value.date) return {};

    return {
      "data-tooltip-id": "heatmap-tooltip",
      "data-tooltip-content": `${value.date}
LC: ${value.lc || 0}
CF: ${value.cf || 0}
Total: ${value.total || 0}`
    };
  }}
/>

<Tooltip id="heatmap-tooltip" />
</div>
    </div>
  );
};

export default Heatmap;