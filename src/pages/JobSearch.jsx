import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8000/api/scraper";

const COLORS = [
  "from-pink-500 to-rose-500",
  "from-violet-500 to-purple-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-fuchsia-500 to-pink-500",
];

const TAG_COLORS = [
  "bg-pink-100 text-pink-700",
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-fuchsia-100 text-fuchsia-700",
];

const POPULAR_SEARCHES = [
  "Python", "React", "Django", "Machine Learning",
  "Data Analyst", "Full Stack", "DevOps", "Java"
];

const LOCATIONS = [
  "bangalore", "mumbai", "delhi", "hyderabad",
  "pune", "chennai", "india", "remote"
];

export default function JobSearch() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("bangalore");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [filterExp, setFilterExp] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("search"); // search | saved

  // Load saved jobs from state
  const toggleSave = (job) => {
    setSavedJobs(prev =>
      prev.find(j => j.id === job.id)
        ? prev.filter(j => j.id !== job.id)
        : [...prev, job]
    );
  };

  const isSaved = (job) => savedJobs.some(j => j.id === job.id);

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
    } catch (e) {
      setError("Could not connect to backend. Make sure Django server is running.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSaved = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/jobs/`);
      const data = await res.json();
      if (data.success) setJobs(data.jobs);
    } catch (e) {
      setError("Failed to load saved jobs.");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs
    .filter(job => {
      if (filterExp === "fresher") return job.experience?.toLowerCase().includes("no experience");
      if (filterExp === "experienced") return !job.experience?.toLowerCase().includes("no experience");
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
    <div style={{ fontFamily: "'Outfit', sans-serif" }} className="min-h-screen bg-gray-50">

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        .gradient-text {
          background: linear-gradient(135deg, #f472b6, #a855f7, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .card-hover {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        .search-glow:focus-within {
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.3);
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-card {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% auto;
          animation: shimmer 1.5s infinite;
        }
        .tag-pill {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .tag-pill:hover {
          transform: scale(1.05);
        }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">JF</span>
            </div>
            <span className="font-black text-xl tracking-tight">
              Job<span className="gradient-text">Flex</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("search")}
              className={`px-4 py-2 rounded-full text-sm font-600 transition-all ${activeTab === "search" ? "bg-violet-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}
            >
              🔍 Search
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-2 rounded-full text-sm font-600 transition-all relative ${activeTab === "saved" ? "bg-pink-500 text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}
            >
              ❤️ Saved
              {savedJobs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {savedJobs.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">

          {/* Floating emoji */}
          <div style={{ animation: "float 3s ease-in-out infinite" }} className="text-5xl mb-6">🚀</div>

          <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
            Find Your <span className="gradient-text">Dream Job</span>
          </h1>
          <p className="text-gray-500 text-lg mb-10 font-400">
            Scraping real-time jobs from Internshala • Powered by Django REST API
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto">
            <div className="search-glow bg-white rounded-2xl border-2 border-gray-200 p-2 flex gap-2 shadow-lg">
              {/* Query input */}
              <div className="flex-1 flex items-center gap-3 px-4 bg-gray-50 rounded-xl">
                <span className="text-xl">💼</span>
                <input
                  type="text"
                  placeholder="Job title, skill, company..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  className="flex-1 bg-transparent outline-none text-gray-800 font-500 text-base py-3"
                />
              </div>

              {/* Location select */}
              <div className="flex items-center gap-2 px-4 bg-gray-50 rounded-xl min-w-36">
                <span className="text-xl">📍</span>
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="bg-transparent outline-none text-gray-700 font-500 text-sm cursor-pointer"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>
                      {loc.charAt(0).toUpperCase() + loc.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="bg-gradient-to-r from-violet-600 to-pink-500 text-white px-8 py-3 rounded-xl font-700 text-base hover:opacity-90 disabled:opacity-50 transition-all shadow-lg hover:shadow-violet-200 hover:shadow-xl whitespace-nowrap"
              >
                {loading ? "..." : "Search Jobs"}
              </button>
            </div>

            {/* Popular searches */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              <span className="text-gray-400 text-sm font-500 mr-1 self-center">Popular:</span>
              {POPULAR_SEARCHES.map((tag, i) => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag); handleSearch(tag, location); }}
                  className={`tag-pill px-3 py-1 rounded-full text-xs font-600 ${TAG_COLORS[i % TAG_COLORS.length]}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Filters bar - show only when jobs exist */}
        {displayJobs.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm font-500">
                {activeTab === "saved" ? `${savedJobs.length} saved jobs` : `${filteredJobs.length} jobs found`}
              </span>
              {searched && activeTab === "search" && (
                <span className="bg-violet-100 text-violet-700 text-xs px-2 py-1 rounded-full font-600">
                  "{query}" in {location}
                </span>
              )}
            </div>

            {activeTab === "search" && (
              <div className="flex gap-3">
                {/* Experience filter */}
                <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  {[["all", "All"], ["fresher", "Fresher"], ["experienced", "Experienced"]].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setFilterExp(val)}
                      className={`px-4 py-2 text-xs font-600 transition-all ${filterExp === val ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-600 text-gray-600 outline-none shadow-sm"
                >
                  <option value="default">Sort: Default</option>
                  <option value="salary">Sort: Salary ↑</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="shimmer-card h-4 w-3/4 rounded-full mb-3"></div>
                <div className="shimmer-card h-3 w-1/2 rounded-full mb-6"></div>
                <div className="shimmer-card h-3 w-full rounded-full mb-2"></div>
                <div className="shimmer-card h-3 w-2/3 rounded-full mb-6"></div>
                <div className="shimmer-card h-8 w-full rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-gray-500 font-500">{error}</p>
            <p className="text-gray-400 text-sm mt-2">Try a different search term or location</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && searched && displayJobs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 font-500">No jobs found for your search</p>
            <p className="text-gray-400 text-sm mt-2">Try different keywords or location</p>
          </div>
        )}

        {/* Saved empty */}
        {activeTab === "saved" && savedJobs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❤️</div>
            <p className="text-gray-500 font-500">No saved jobs yet</p>
            <p className="text-gray-400 text-sm mt-2">Click the heart on any job to save it</p>
          </div>
        )}

        {/* Initial state */}
        {!loading && !error && !searched && activeTab === "search" && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-gray-500 font-500">Search for jobs above to get started</p>
            <p className="text-gray-400 text-sm mt-2">Real-time data scraped from Internshala</p>
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && displayJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayJobs.map((job, i) => (
              <div key={job.id} className="card-hover bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Card color top bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${COLORS[i % COLORS.length]}`}></div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-2">
                      <h3 className="font-700 text-gray-900 text-base leading-snug mb-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-500 text-sm font-500">{job.company}</p>
                    </div>
                    <button
                      onClick={() => toggleSave(job)}
                      className="text-2xl transition-transform hover:scale-125 flex-shrink-0"
                    >
                      {isSaved(job) ? "❤️" : "🤍"}
                    </button>
                  </div>

                  {/* Tags row */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {/* Location */}
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-500">
                      📍 {job.location?.split(",")[0]?.trim()}
                    </span>

                    {/* Experience */}
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-500 ${job.experience?.toLowerCase().includes("no experience") ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {job.experience?.toLowerCase().includes("no experience") ? "✅ Fresher" : `💼 ${job.experience}`}
                    </span>

                    {/* Source */}
                    <span className="flex items-center gap-1 bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full font-500">
                      🌐 {job.source}
                    </span>
                  </div>

                  {/* Salary */}
                  <div className={`bg-gradient-to-r ${COLORS[i % COLORS.length]} p-3 rounded-xl mb-5`}>
                    <p className="text-white text-xs font-500 opacity-80 mb-0.5">Salary</p>
                    <p className="text-white font-700 text-sm">{job.salary}</p>
                  </div>

                  {/* Apply Button */}
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center bg-gradient-to-r ${COLORS[i % COLORS.length]} text-white py-2.5 rounded-xl font-600 text-sm hover:opacity-90 transition-opacity shadow-sm`}
                  >
                    Apply Now →
                  </a>

                  {/* Scraped time */}
                  <p className="text-center text-gray-300 text-xs mt-3 font-400">
                    Scraped {new Date(job.scraped_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-10 py-8 text-center">
        <p className="text-gray-400 text-sm">
          Built with <span className="text-pink-500">♥</span> using{" "}
          <span className="font-600 text-violet-600">Django REST Framework</span> +{" "}
          <span className="font-600 text-blue-500">React</span> +{" "}
          <span className="font-600 text-emerald-600">Neon PostgreSQL</span>
        </p>
      </footer>
    </div>
  );
}