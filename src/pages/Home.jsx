import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
const APPS = [
  { co: "Stripe",  role: "Frontend Engineer",    tag: "Interview",  tagCls: "bg-amber-50 text-amber-600 border border-amber-200" },
  { co: "Linear",  role: "Product Designer",     tag: "Applied",    tagCls: "bg-blue-50 text-blue-600 border border-blue-200" },
  { co: "Vercel",  role: "Software Engineer II", tag: "Offer ✦",    tagCls: "bg-green-50 text-green-700 border border-green-200" },
  { co: "Figma",   role: "Growth Engineer",      tag: "Rejected",   tagCls: "bg-red-50 text-red-500 border border-red-200" },
];

function MockDashboard() {

  
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden"
      style={{ animation: "floatY 5s ease-in-out infinite" }}>
      <style>{`
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>

      {/* Browser bar */}
      <div className="bg-zinc-900 px-4 py-3 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-80" />
        <div className="ml-3 bg-zinc-800 rounded text-zinc-500 text-[11px] px-3 py-1 flex-1">
          jobflex.app/dashboard
        </div>
      </div>

      {/* Metric cards */}
      <div className="p-4 grid grid-cols-4 gap-2">
        {[["24","Total"],["6","Shortlisted"],["2","Offers"],["74%","Reply"]].map(([n,l]) => (
          <div key={l} className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
            <div className="text-lg font-bold text-zinc-900 leading-none">{n}</div>
            <div className="text-[10px] text-zinc-400 mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="px-4 pb-2 flex justify-between items-center">
        <span className="text-xs font-semibold text-zinc-800">Recent Applications</span>
        <span className="text-[10px] text-zinc-400">View all →</span>
      </div>

      {/* Rows */}
      <div className="px-4 pb-4">
        {APPS.map((a) => (
          <div key={a.co} className="flex items-center justify-between py-2.5 border-b border-zinc-50 last:border-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-[11px] font-bold">
                {a.co[0]}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-zinc-800">{a.co}</div>
                <div className="text-[11px] text-zinc-400">{a.role}</div>
              </div>
            </div>
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${a.tagCls}`}>
              {a.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const {user}=useAuth();
//  console.log(user);
    const navigate=useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Fraunces', serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .anim-1 { animation: fadeUp 0.45s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.45s ease 0.13s both; }
        .anim-3 { animation: fadeUp 0.45s ease 0.22s both; }
        .anim-4 { animation: fadeUp 0.45s ease 0.31s both; }
        .anim-5 { animation: fadeUp 0.45s ease 0.40s both; }
        .live-dot { animation: pulse2 2s infinite; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-zinc-50/80 backdrop-blur-xl border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-xs font-bold font-display">JF</div>
            <span onClick={()=>navigate("/")} className="font-bold text-zinc-900 text-[18px] tracking-tight font-display">JobFlex</span>
          </div>
          <div className="flex items-center gap-1">
   {!user ? (
    <>
            <Link to="/login" className="text-sm text-zinc-700 border border-zinc-300 hover:border-zinc-900 hover:bg-white px-5 py-2 rounded-lg transition-all ml-2">
              Log in
            </Link>
            <Link to="/signup" className="text-sm bg-zinc-900 text-white px-5 py-2 rounded-lg hover:bg-zinc-700 transition-all shadow-sm ml-1">
              Get started
            </Link>
            </>
   ):(
   <Link to="/dashboard" className="text-sm bg-zinc-900 text-white px-5 py-2 rounded-lg hover:bg-zinc-700 transition-all shadow-sm ml-1">
              Dashboard
            </Link>
   )
            
   }
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 grid grid-cols-2 gap-16 items-center">
        <div>
          <div className="anim-1 inline-flex items-center gap-2 bg-zinc-900 text-white text-[11px] font-semibold px-4 py-1.5 rounded-full mb-7 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />
            Smart Job Tracking
          </div>

          <h1 className="anim-2 font-display text-[58px] font-bold leading-[1.05] tracking-tight text-zinc-900 mb-5">
            Track every<br />
            application,<br />
            <em className="text-zinc-400 not-italic">effortlessly.</em>
          </h1>

          <p className="anim-3 text-zinc-500 text-base leading-relaxed mb-8 max-w-[400px] font-light">
            JobFlex centralizes your job hunt — auto-detects recruiter replies from Gmail, captures jobs via Chrome extension, and shows real-time analytics.
          </p>

          <div className="anim-4 flex items-center gap-3">
            <Link to="/signup"
              className="bg-zinc-900 text-white text-sm font-medium px-7 py-3.5 rounded-xl hover:bg-zinc-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200">
              Start tracking free →
            </Link>
            <Link to="/login"
              className="text-sm font-medium text-zinc-700 border border-zinc-300 px-7 py-3.5 rounded-xl hover:border-zinc-900 hover:bg-white transition-all">
              Sign in
            </Link>
          </div>

          <div className="anim-5 flex items-center gap-3 mt-8">
            <div className="flex">
              {["bg-amber-100","bg-violet-100","bg-emerald-100","bg-sky-100"].map((c,i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-zinc-50 ${i > 0 ? "-ml-2" : ""}`} />
              ))}
            </div>
            <p className="text-xs text-zinc-400">
              Trusted by <strong className="text-zinc-800 font-semibold">10,000+</strong> job seekers
            </p>
          </div>
        </div>

        <div className="anim-3">
          <MockDashboard />
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="border-y border-zinc-200 bg-white py-10">
        <div className="max-w-5xl mx-auto flex justify-center gap-20 flex-wrap">
          {[["24k+","Applications tracked"],["98%","Detection accuracy"],["3×","More interviews"],["< 2s","Dashboard load"]].map(([n,l]) => (
            <div key={l} className="text-center">
              <div className="font-display text-[38px] font-bold text-zinc-900 leading-none">{n}</div>
              <div className="text-sm text-zinc-400 mt-2">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-[11px] tracking-widest uppercase text-zinc-400 font-semibold mb-3">Features</div>
        <h2 className="font-display text-[40px] font-bold text-zinc-900 mb-12 max-w-md leading-tight tracking-tight">
          Everything you need to land the job.
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {[
            { icon: "◈", title: "Application Tracker",  desc: "One view for every application. Add manually or let the Chrome extension do it instantly." },
            { icon: "✉", title: "Gmail Intelligence",   desc: "Auto-reads recruiter emails and updates your status — shortlisted, rejected, or offer received." },
            { icon: "⟳", title: "Chrome Extension",     desc: "Save jobs from LinkedIn, Indeed, or Naukri with one click. Zero copy-pasting ever again." },
            { icon: "◑", title: "Analytics Dashboard",  desc: "Track response rates, success patterns, and monthly trends with clean visual charts." },
            { icon: "☰", title: "Email Audit Logs",     desc: "Full history of every recruiter email that triggered a status change, with timestamps." },
            { icon: "◻", title: "Secure by Default",    desc: "JWT auth, bcrypt hashing, and encrypted data. Your job search stays completely private." },
          ].map(f => (
            <div key={f.title}
              className="group bg-white border border-zinc-200 rounded-2xl p-7 hover:border-zinc-900 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-default">
              <div className="text-2xl mb-4 text-zinc-700 group-hover:text-zinc-900 transition-colors">{f.icon}</div>
              <div className="font-semibold text-zinc-900 text-[14px] mb-2">{f.title}</div>
              <div className="text-zinc-400 text-[13px] leading-relaxed font-light">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="bg-zinc-900 rounded-2xl px-14 py-16 flex items-center justify-between gap-10 flex-wrap">
          <div>
            <h2 className="font-display text-[38px] font-bold text-white mb-3 tracking-tight">Ready to take control?</h2>
            <p className="text-zinc-400 font-light text-sm">Join thousands who landed their dream role with JobFlex.</p>
          </div>
          <Link to="/signup"
            className="flex-shrink-0 bg-white text-zinc-900 font-semibold text-sm px-8 py-4 rounded-xl hover:bg-zinc-100 transition-all shadow-lg hover:-translate-y-0.5 duration-200">
            Create free account →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-200 px-8 py-6 max-w-6xl mx-auto flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-zinc-900 rounded flex items-center justify-center text-white text-[9px] font-bold">JF</div>
          <span className="font-display font-bold text-zinc-900 text-base">JobFlex</span>
        </div>
        <span>© 2025 JobFlex. All rights reserved.</span>
      </footer>
    </div>
  );
}