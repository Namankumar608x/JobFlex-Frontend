import { useState } from "react";
import Sidebar from "../components/Sidebar";

const API_BASE = "http://localhost:8000/api/scraper";

const POPULAR_SEARCHES = [
  "Python", "React", "Django", "Machine Learning",
  "Data Analyst", "Full Stack", "DevOps", "Java",
];

const LOCATIONS = [
  "bangalore", "mumbai", "delhi", "hyderabad",
  "pune", "chennai", "india", "remote",
];

const STATUS_COLORS = {
  fresher:     "bg-green-50 text-green-700 border border-green-200",
  experienced: "bg-amber-50 text-amber-600 border border-amber-200",
};

const SOURCE_META = {
  Internshala: "bg-violet-100 text-violet-700",
  LinkedIn:    "bg-blue-100 text-blue-700",
  Indeed:      "bg-indigo-100 text-indigo-600",
};

export default function JobSearch() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("bangalore");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [filterExp, setFilterExp] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("search");

  const toggleSave = (job) => {
    setSavedJobs((prev) =>
      prev.find((j) => j.id === job.id)
        ? prev.filter((j) => j.id !== job.id)
        : [...prev, job]
    );
  };
  const isSaved = (job) => savedJobs.some((j) => j.id === job.id);

  const handleSearch = async (q = query, loc = location) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch(
        `${API_BASE}/scrape/?query=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`
      );
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      } else {
        setError(data.message || "No jobs found.");
        setJobs([]);
      }
    } catch {
      setError("Could not connect to backend. Make sure Django server is running.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs
    .filter((job) => {
      if (filterExp === "Fresher")
        return job.experience?.toLowerCase().includes("no experience");
      if (filterExp === "Experienced")
        return !job.experience?.toLowerCase().includes("no experience");
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "salary") {
        const getSalary = (s) => parseInt(s?.replace(/[^0-9]/g, "") || "0");
        return getSalary(b.salary) - getSalary(a.salary);
      }
      return 0;
    });

  const displayJobs = activeTab === "saved" ? savedJobs : filteredJobs;

  return (
    <Sidebar>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        * { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .anim-1 { animation: fadeUp 0.4s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.4s ease 0.12s both; }
        .anim-3 { animation: fadeUp 0.4s ease 0.20s both; }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-card {
          background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
          background-size: 200% auto;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      {/* ── Page Header ── */}
      <div className="anim-1 flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-zinc-900 tracking-tight">
            Job Search
          </h1>
          <p className="text-zinc-400 text-sm mt-1 font-light">
            Real-time jobs scraped from Internshala — find your next opportunity.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("search")}
            className={`text-xs font-medium px-4 py-2 rounded-lg transition-all ${
              activeTab === "search"
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            🔍 Search
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`text-xs font-medium px-4 py-2 rounded-lg transition-all relative ${
              activeTab === "saved"
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            ♥ Saved
            {savedJobs.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {savedJobs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Search Box (only on search tab) ── */}
      {activeTab === "search" && (
        <div className="anim-2 bg-white border border-zinc-200 rounded-2xl p-6 mb-6">
          <div className="flex gap-3 mb-4">
            {/* Query */}
            <div className="flex-1 flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus-within:border-zinc-400 transition-colors">
              <span className="text-zinc-400 text-sm">💼</span>
              <input
                type="text"
                placeholder="Job title, skill, or company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 bg-transparent outline-none text-zinc-800 text-sm font-medium placeholder:text-zinc-400"
              />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus-within:border-zinc-400 transition-colors min-w-40">
              <span className="text-zinc-400 text-sm">📍</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent outline-none text-zinc-700 text-sm font-medium cursor-pointer"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc.charAt(0).toUpperCase() + loc.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Button */}
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="bg-zinc-900 text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 disabled:opacity-40 transition-all shadow-sm"
            >
              {loading ? "Searching..." : "Search Jobs"}
            </button>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mr-1">
              Popular:
            </span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  handleSearch(tag, location);
                }}
                className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Filters bar ── */}
      {displayJobs.length > 0 && (
        <div className="anim-2 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500 font-medium">
              {activeTab === "saved"
                ? `${savedJobs.length} saved jobs`
                : `${filteredJobs.length} jobs found`}
            </span>
            {searched && activeTab === "search" && (
              <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                "{query}" · {location}
              </span>
            )}
          </div>

          {activeTab === "search" && (
            <div className="flex items-center gap-3">
              {/* Experience filter pills */}
              <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg p-1">
                {["All", "Fresher", "Experienced"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterExp(f)}
                    className={`text-[11px] font-medium px-3 py-1.5 rounded-md transition-all ${
                      filterExp === f
                        ? "bg-zinc-900 text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-[11px] font-medium text-zinc-600 outline-none hover:border-zinc-400 transition-colors"
              >
                <option value="default">Sort: Default</option>
                <option value="salary">Sort: Salary ↑</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-zinc-100"
            >
              <div className="shimmer-card h-3 w-3/4 rounded-full mb-3" />
              <div className="shimmer-card h-2.5 w-1/2 rounded-full mb-6" />
              <div className="shimmer-card h-2.5 w-full rounded-full mb-2" />
              <div className="shimmer-card h-2.5 w-2/3 rounded-full mb-6" />
              <div className="shimmer-card h-9 w-full rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-16 text-center">
          <div className="text-4xl mb-3">◈</div>
          <p className="text-sm font-semibold text-zinc-700 mb-1">{error}</p>
          <p className="text-xs text-zinc-400">Try a different search term or location</p>
        </div>
      )}

      {/* ── Empty / Initial states ── */}
      {!loading && !error && searched && displayJobs.length === 0 && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-16 text-center">
          <div className="text-4xl mb-3">◈</div>
          <p className="text-sm font-semibold text-zinc-700 mb-1">No jobs found</p>
          <p className="text-xs text-zinc-400">Try different keywords or location</p>
        </div>
      )}

      {activeTab === "saved" && savedJobs.length === 0 && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-16 text-center">
          <div className="text-4xl mb-3">♥</div>
          <p className="text-sm font-semibold text-zinc-700 mb-1">No saved jobs yet</p>
          <p className="text-xs text-zinc-400">Click the heart on any job to save it</p>
        </div>
      )}

      {!loading && !error && !searched && activeTab === "search" && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-16 text-center">
          <div className="text-4xl mb-3">✦</div>
          <p className="text-sm font-semibold text-zinc-700 mb-1">
            Search for jobs above to get started
          </p>
          <p className="text-xs text-zinc-400">Real-time data scraped from Internshala</p>
        </div>
      )}

      {/* ── Job Cards ── */}
      {!loading && displayJobs.length > 0 && (
        <div className="anim-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayJobs.map((job) => {
            const isFresher = job.experience
              ?.toLowerCase()
              .includes("no experience");
            const expLabel = isFresher ? "Fresher" : job.experience;
            const expCls = isFresher
              ? STATUS_COLORS.fresher
              : STATUS_COLORS.experienced;
            const sourceCls =
              SOURCE_META[job.source] ?? "bg-zinc-100 text-zinc-600";

            return (
              <div
                key={job.id}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 flex-1 pr-2">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {job.company?.[0] ?? "?"}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900 leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs text-zinc-400 font-light mt-0.5">
                          {job.company}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSave(job)}
                      className={`text-lg transition-all hover:scale-110 flex-shrink-0 ${
                        isSaved(job) ? "text-red-500" : "text-zinc-300 hover:text-zinc-500"
                      }`}
                    >
                      {isSaved(job) ? "♥" : "♡"}
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                      📍 {job.location?.split(",")?.[0]?.trim()}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${expCls}`}
                    >
                      {isFresher ? "✓ " : ""}
                      {expLabel}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${sourceCls}`}
                    >
                      {job.source}
                    </span>
                  </div>

                  {/* Salary */}
                  <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 mb-5">
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mb-0.5">
                      Salary
                    </p>
                    <p className="text-sm font-semibold text-zinc-900">
                      {job.salary || "Not disclosed"}
                    </p>
                  </div>

                  {/* Apply button */}
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-zinc-900 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-700 transition-all shadow-sm"
                  >
                    Apply Now →
                  </a>

                  {/* Scraped time */}
                  <p className="text-center text-zinc-300 text-[10px] mt-3">
                    Scraped {new Date(job.scraped_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Sidebar>
  );
}
