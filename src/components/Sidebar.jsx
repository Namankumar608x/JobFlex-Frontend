import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/dashboard",       icon: "⊞", label: "Dashboard"    },
  { path: "/applications",    icon: "◈", label: "Applications" },
  { path: "/analytics",       icon: "◑", label: "Analytics"    },
  { path: "/email-logs",      icon: "✉", label: "Email Logs"   },
  { path: "/settings",        icon: "◻", label: "Settings"     },
];

export default function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-zinc-200 flex flex-col h-screen">

        {/* Logo */}
        <div className="px-5 h-16 flex items-center border-b border-zinc-100">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-xs font-bold font-display">JF</div>
            <span className="font-display font-bold text-zinc-900 text-[17px] tracking-tight">JobFlex</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold px-3 mb-3">Menu</p>
          {NAV_ITEMS.map(({ path, icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline
                  ${active
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
              >
                <span className={`text-base ${active ? "text-white" : "text-zinc-400"}`}>{icon}</span>
                {label}
                {label === "Email Logs" && (
                  <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-amber-100 text-amber-600"}`}>3</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Gmail connection status */}
        <div className="mx-3 mb-3 p-3 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" style={{animation:"pulse 2s infinite"}} />
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
            <span className="text-[11px] font-semibold text-green-700">Gmail Connected</span>
          </div>
          <p className="text-[10px] text-green-600">Auto-tracking recruiter emails</p>
        </div>

        {/* User */}
        <div className="border-t border-zinc-100 px-3 py-4">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-zinc-50 cursor-pointer transition-all group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center text-xs font-bold text-orange-800 flex-shrink-0">AS</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-900 truncate">Aarav Shah</div>
              <div className="text-[11px] text-zinc-400 truncate">aarav@email.com</div>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all text-xs"
              title="Log out"
            >⏏</button>
          </div>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">⌕</span>
            <input
              type="text"
              placeholder="Search applications…"
              className="pl-8 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 transition-all w-64"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-50 border border-zinc-200 transition-all text-zinc-500 hover:text-zinc-900">
              🔔
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>

            {/* Add application CTA */}
            <Link to="/applications/new"
              className="flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all shadow-sm no-underline">
              + Add Application
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}