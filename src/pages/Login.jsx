import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/authContext";

const NOTIFICATIONS = [
  { label: "New interview scheduled", sub: "Stripe · Frontend Engineer", dot: "bg-amber-400" },
  { label: "Offer received 🎉",        sub: "Vercel · SWE II",            dot: "bg-green-400" },
  { label: "Application sent",         sub: "Linear · Product Designer",  dot: "bg-blue-400" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const update = (k) => (e) => { setError(""); setForm(p => ({ ...p, [k]: e.target.value })); };

const googleLogin = async (response) => {

  if (!response?.credential) {
    alert("Google login failed");
    return;
  }

  const token = response.credential;

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/user/auth/google/`,
      { token },
      { withCredentials: true }
    );

    if (res.status === 200 || res.status === 201) {
      alert("Google login successful");
      
    }
navigate("/");
  } catch (error) {
    alert("Google login error");
    console.error(error);
  }
};

  const handleSubmit = async () => {
    if (!form.email)    { setError("Please enter your email address."); return; }
    if (!form.password) { setError("Please enter your password."); return; }

    setLoading(true);
    try {
      console.log("handle submmit called")
      const res=await api("POST","user/login/",{
        email:form.email,
        password:form.password,
        
      })
      if(res.status===200 || res.status===201){
        console.log(res.data);
        alert("Login successfull");
    navigate("/");
      }
    } catch (error) {
      console.error("Login error:",error);
      navigate("/");
    }
    setLoading(false);
   
  };

  return (
    <div className="min-h-screen flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Fraunces', serif; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .anim-1 { animation: fadeUp 0.4s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.4s ease 0.12s both; }
        .anim-3 { animation: fadeUp 0.4s ease 0.20s both; }
        .anim-4 { animation: fadeUp 0.4s ease 0.28s both; }
        .anim-5 { animation: fadeUp 0.4s ease 0.36s both; }
        .slide-1 { animation: slideIn 0.4s ease 0.1s both; }
        .slide-2 { animation: slideIn 0.4s ease 0.2s both; }
        .slide-3 { animation: slideIn 0.4s ease 0.3s both; }
        .spinner { width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block; }
      `}</style>

      {/* ── Left dark panel ── */}
      <div className="w-[420px] flex-shrink-0 bg-zinc-900 flex flex-col justify-between p-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline group">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-zinc-900 text-xs font-bold font-display">JF</div>
          <span className="font-display font-bold text-white text-lg tracking-tight">JobFlex</span>
        </Link>

        {/* Middle content */}
        <div>
          {/* Live notification cards */}
          <div className="mb-10 space-y-3">
            {NOTIFICATIONS.map((n, i) => (
              <div key={i}
                className={`bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 flex items-start gap-3 slide-${i+1}`}>
                <span className={`w-2 h-2 rounded-full ${n.dot} mt-1.5 flex-shrink-0`} />
                <div>
                  <div className="text-white text-[13px] font-medium leading-tight">{n.label}</div>
                  <div className="text-zinc-500 text-[11px] mt-0.5">{n.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="font-display text-zinc-400 text-[15px] leading-relaxed italic">
              "JobFlex helped me track 30+ applications and land my dream role at Stripe."
            </p>
            <div className="mt-3 text-zinc-600 text-xs">— Priya S., Software Engineer</div>
          </div>
        </div>

        <div className="text-zinc-700 text-xs">© 2025 JobFlex</div>
      </div>

      {/* ── Right light panel ── */}
      <div className="flex-1 bg-zinc-50 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[380px]">

          <p className="anim-1 text-[11px] tracking-widest uppercase text-zinc-400 font-semibold mb-2">Welcome back</p>
          <h1 className="anim-2 font-display text-4xl font-bold text-zinc-900 mb-1.5 tracking-tight">Sign in</h1>
          <p className="anim-2 text-zinc-400 text-sm mb-8 font-light">
            Don't have an account?{" "}
            <Link to="/signup" className="text-zinc-900 font-semibold underline underline-offset-2 hover:text-zinc-600 transition-colors">
              Sign up free
            </Link>
          </p>

          {/* Google */}
         <div className="anim-3">
  <GoogleLogin
    onSuccess={googleLogin}
    onError={() => console.log("Google Login Failed")}
  />
</div>

          {/* Divider */}
          <div className="anim-3 flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 font-medium">or</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3.5 py-2.5 mb-4">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <div className="anim-4 space-y-4">
             

            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                className="w-full bg-white border border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-zinc-700">Password</label>
                <button className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Your password"
                  value={form.password}
                  onChange={update("password")}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-white border border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 rounded-lg px-3.5 py-2.5 pr-11 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all"
                />
                <button
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors text-sm"
                >
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-700 disabled:opacity-60 text-white font-medium text-sm py-3 rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><span className="spinner" />Signing in…</>
              ) : "Sign in →"}
            </button>
          </div>

          <p className="anim-5 text-center text-xs text-zinc-400 mt-5 leading-relaxed">
            By signing in you agree to our{" "}
            <span className="text-zinc-500 underline cursor-pointer hover:text-zinc-700">Terms</span>
            {" "}and{" "}
            <span className="text-zinc-500 underline cursor-pointer hover:text-zinc-700">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}