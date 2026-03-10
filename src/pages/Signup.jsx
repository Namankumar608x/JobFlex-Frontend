import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
function PasswordStrength({ password }) {
  const calc = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const s = calc();
  const colors  = ["bg-zinc-200", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-green-400"];
  const labels  = ["", "Weak", "Fair", "Good", "Strong"];
  const txtCols = ["text-zinc-400", "text-red-500", "text-amber-500", "text-blue-500", "text-green-500"];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= s ? colors[s] : "bg-zinc-200"}`} />
        ))}
      </div>
      <p className={`text-[11px] mt-1.5 font-medium ${txtCols[s]}`}>{labels[s]} password</p>
    </div>
  );
}

const CHECKLIST = [
  "Auto-detect recruiter emails via Gmail",
  "One-click save from LinkedIn & Indeed",
  "Real-time analytics on your job hunt",
  "Free forever, no credit card needed",
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCfm, setShowCfm] = useState(false);

  const update = (k) => (e) => { setErrors(p => ({ ...p, [k]: "" })); setForm(p => ({ ...p, [k]: e.target.value })); };

  const strength = () => {
    const p = form.password; if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name = "Full name is required.";
    if (!form.email.trim())  e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password)      e.password = "Password is required.";
    else if (strength() < 2) e.password = "Choose a stronger password.";
    if (!form.confirm)       e.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res=await api("POST","user/register/",{
        uname:form.name,
        email:form.email,
        password:form.password,
      
      })
      if(res.status===200 || res.status===201){
        console.log(res.data);
        alert("Signup successfull");
    navigate("/dashboard");
      }
    } catch (error) {
       console.error("Login error:",error);
      navigate("/");
    }
    setLoading(false);
 
    setSuccess(true);
  };

  // ── Success screen ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
          body { font-family: 'DM Sans', sans-serif; }
          .font-display { font-family: 'Fraunces', serif; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
          .anim-1 { animation: fadeUp 0.45s ease 0.05s both; }
        `}</style>
        <div className="anim-1 bg-white border border-zinc-200 rounded-2xl p-12 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6 text-green-500 text-3xl">✓</div>
          <h2 className="font-display text-3xl font-bold text-zinc-900 mb-2 tracking-tight">You're all set!</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-1 font-light">
            Welcome to JobFlex, <strong className="text-zinc-800 font-semibold">{form.name.split(" ")[0]}</strong>. Your account is ready.
          </p>
          <p className="text-zinc-400 text-xs mb-8">Check <strong className="text-zinc-600">{form.email}</strong> for a confirmation link.</p>
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-3.5 py-2.5 mb-6 text-left">
            <span>✓</span> Account created successfully.
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-zinc-900 text-white font-medium text-sm py-3 rounded-xl hover:bg-zinc-700 transition-all shadow-md mb-3"
          >
            Go to sign in →
          </button>
          <Link to="/" className="block text-xs text-zinc-400 hover:text-zinc-600 transition-colors">← Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Fraunces', serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .anim-1 { animation: fadeUp 0.4s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.4s ease 0.12s both; }
        .anim-3 { animation: fadeUp 0.4s ease 0.20s both; }
        .anim-4 { animation: fadeUp 0.4s ease 0.28s both; }
        .anim-5 { animation: fadeUp 0.4s ease 0.36s both; }
        .spinner { width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block; }
      `}</style>

      {/* ── Left form panel ── */}
      <div className="flex-1 bg-zinc-50 flex items-center justify-center px-8 py-12 overflow-y-auto">
        <div className="w-full max-w-[440px]">

          <Link to="/" className="anim-1 inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors mb-8 no-underline">
            ← Back to home
          </Link>

          <p className="anim-1 text-[11px] tracking-widest uppercase text-zinc-400 font-semibold mb-2">Create account</p>
          <h1 className="anim-2 font-display text-4xl font-bold text-zinc-900 mb-1.5 tracking-tight">Get started</h1>
          <p className="anim-2 text-zinc-400 text-sm mb-7 font-light">
            Already have an account?{" "}
            <Link to="/login" className="text-zinc-900 font-semibold underline underline-offset-2 hover:text-zinc-600 transition-colors">
              Sign in
            </Link>
          </p>

          {/* Google */}
          {/* <div className="anim-3">
            <button className="w-full flex items-center justify-center gap-2.5 bg-white border border-zinc-300 hover:border-zinc-900 text-zinc-700 text-sm font-medium py-2.5 rounded-lg transition-all hover:shadow-sm mb-5">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div> */}

          {/* Divider */}
          <div className="anim-3 flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 font-medium">or</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <div className="anim-4 space-y-4">
            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Name</label>
                <input
                  type="text" placeholder="Tarun Jain"
                  value={form.name} onChange={update("name")}
                  className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all
                    ${errors.name ? "border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"}`}
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Email</label>
                <input
                  type="email" placeholder="you@email.com"
                  value={form.email} onChange={update("email")}
                  className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all
                    ${errors.email ? "border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"}`}
                />
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password} onChange={update("password")}
                  className={`w-full bg-white border rounded-lg px-3.5 py-2.5 pr-11 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all
                    ${errors.password ? "border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"}`}
                />
                <button onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors text-sm">
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>
              <PasswordStrength password={form.password} />
              {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type={showCfm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirm} onChange={update("confirm")}
                  className={`w-full bg-white border rounded-lg px-3.5 py-2.5 pr-11 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all
                    ${errors.confirm ? "border-red-400 focus:ring-2 focus:ring-red-400/20"
                    : form.confirm && form.confirm === form.password ? "border-green-400 focus:ring-2 focus:ring-green-400/20"
                    : "border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"}`}
                />
                <button onClick={() => setShowCfm(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors text-sm">
                  {showCfm ? "🙈" : "👁"}
                </button>
              </div>
              {form.confirm && (
                <p className={`text-[11px] mt-1 font-medium ${form.confirm === form.password ? "text-green-500" : "text-red-500"}`}>
                  {form.confirm === form.password ? "✓ Passwords match" : "✗ Passwords don't match"}
                </p>
              )}
              {errors.confirm && !form.confirm && <p className="text-[11px] text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-700 disabled:opacity-60 text-white font-medium text-sm py-3 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <><span className="spinner" />Creating account…</>
              ) : "Create account →"}
            </button>
          </div>

          <p className="anim-5 text-center text-xs text-zinc-400 mt-4 leading-relaxed">
            By signing up you agree to our{" "}
            <span className="text-zinc-500 underline cursor-pointer hover:text-zinc-700">Terms of Service</span>
            {" "}and{" "}
            <span className="text-zinc-500 underline cursor-pointer hover:text-zinc-700">Privacy Policy</span>.
            <br />Free forever. No credit card required.
          </p>
        </div>
      </div>

      {/* ── Right dark panel ── */}
      <div className="w-[400px] flex-shrink-0 bg-zinc-900 flex flex-col justify-center px-12 relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-900 text-sm font-bold font-display mb-8">JF</div>

          <h2 className="font-display text-[30px] font-bold text-white mb-4 leading-tight tracking-tight">
            Your next job<br />starts here.
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed font-light mb-12">
            One dashboard. Every application. Zero chaos.
          </p>

          {/* Checklist */}
          <div className="space-y-4 mb-12">
            {CHECKLIST.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-green-400 text-[10px] flex-shrink-0 mt-0.5">✓</div>
                <span className="text-zinc-400 text-sm font-light leading-relaxed">{f}</span>
              </div>
            ))}
          </div>

          {/* Review */}
          <div className="border-t border-zinc-800 pt-7">
            <div className="flex gap-0.5 mb-3">
              {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-sm">★</span>)}
            </div>
            <p className="text-zinc-500 text-[13px] leading-relaxed italic font-light">
              "I went from chaos spreadsheets to a clean dashboard. Got 3 interviews in 2 weeks."
            </p>
            <p className="text-zinc-700 text-xs mt-3">— Rohan M., Full Stack Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}