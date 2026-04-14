import { useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  FileText,
  Edit2,
  Save,
  X,
  CheckCircle2,
  Star,
  Target,
  Send,
  XCircle,
  Upload,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import SectionWrapper from "../components/Sectionwrapper";
import StatsCard from "../components/StatsCard";
import FileUpload from "../components/FileUpload";
import { useAuth } from "../context/authContext";
import { useDashboard } from "../context/dashboardContext"; 
import api from "../utils/api";
// ── Role badge ─────────────────────────────────────────────────────────────

const ROLE_META = {
  Candidate:  { color: "text-blue-600 bg-blue-50 border-blue-200" },
  Recruiter:  { color: "text-violet-600 bg-violet-50 border-violet-200" },
};

// ── Inline editable field ──────────────────────────────────────────────────

function EditableField({ label, value, editing, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-400 transition-all"
        />
      ) : (
        <p className="text-sm text-zinc-800 font-medium py-2.5">{value || <span className="text-zinc-300 font-light italic">Not set</span>}</p>
      )}
    </div>
  );
}

// ── Application stats (static placeholder) ────────────────────────────────


// ── Main Component ─────────────────────────────────────────────────────────

export default function Profile() {
  const { user } = useAuth();
  console.log(user);
  const {stats}=useDashboard();
  // console.log(stats);
  // Editable profile state
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:     user?.uname  || user?.name  || "",
    email:    user?.email  || "",
    role:     user?.role   || "Candidate",
    bio:      user?.bio    || "",
    location: user?.location || "",
    linkedin: user?.linkedin || "",
    leetcode: user?.leetcode_username || "",
    codeforces: user?.codeforces_username || "",
  });
  const [savedForm, setSavedForm] = useState({ ...form });

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeSaved, setResumeSaved] = useState(false);

const APP_STATS = [
  {
    label: "Total Applied",
    value: stats?.total || 0,
    icon: Briefcase,
    accent: true,
  },
  {
    label: "Applied",
    value: stats?.applied || 0,
    icon: Send,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    label: "Accepted",
    value: stats?.accepted || 0,
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    label: "Rejected",
    value: stats?.rejected || 0,
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
  },
];
  const handleField = (key) => (value) => setForm((p) => ({ ...p, [key]: value }));

const handleSave = async () => {
  try {
    const payload = {
      linkedin_url: form.linkedin,
      leetcode_username: form.leetcode,
      codeforces_username: form.codeforces,
    };

    await api("post", "user/update-profile-links/", payload);

    setSavedForm({ ...form });
    setEditing(false);

  } catch (err) {
    console.error(err);
  }
};

  const handleCancel = () => {
    setForm({ ...savedForm });
    setEditing(false);
  };

  const handleResumeUpload = (file) => {
    setResumeFile(file);
    setResumeSaved(false);
  };

  const handleResumeSave = () => {
    if (!resumeFile) return;
    // TODO: upload to backend
    setResumeSaved(true);
  };

  const initials = (form.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleMeta = ROLE_META[form.role] || ROLE_META.Candidate;

  return (
    <Sidebar>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .anim-1 { animation: fadeUp 0.4s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.4s ease 0.12s both; }
        .anim-3 { animation: fadeUp 0.4s ease 0.20s both; }
      `}</style>

      {/* ── Page Header ── */}
      <div className="anim-1 flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-zinc-900 tracking-tight leading-tight">Profile</h1>
          <p className="text-zinc-400 text-sm mt-1 font-light">Manage your personal information and preferences.</p>
        </div>

        {/* Edit / Save / Cancel */}
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 text-sm font-medium border border-zinc-200 bg-white text-zinc-700 px-4 py-2 rounded-xl hover:border-zinc-400 hover:text-zinc-900 transition-all"
          >
            <Edit2 size={14} /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-xs font-medium border border-zinc-200 bg-white text-zinc-500 px-3.5 py-2 rounded-lg hover:border-zinc-300 transition-all"
            >
              <X size={13} /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all shadow-sm"
            >
              <Save size={13} /> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* ── Profile Summary ── */}
      <div className="anim-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-orange-700 font-bold text-2xl font-display flex-shrink-0 shadow-sm">
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h2 className="font-display font-bold text-xl text-zinc-900 tracking-tight leading-none">
              {form.name || "Your Name"}
            </h2>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border self-center ${roleMeta.color}`}>
              {form.role}
            </span>
          </div>
          <p className="text-sm text-zinc-400 font-light mb-1">{form.email}</p>
          {form.location && (
            <p className="text-xs text-zinc-400 font-light">📍 {form.location}</p>
          )}
          {form.bio && (
            <p className="text-sm text-zinc-500 font-light mt-2 leading-relaxed max-w-lg">{form.bio}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 anim-3">

        {/* ── Left: Edit Fields ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Personal Info */}
          <SectionWrapper title="Personal Information" description="Basic profile details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <EditableField
                label="Full Name"
                value={form.name}
                editing={editing}
                onChange={handleField("name")}
                placeholder="Tarun Jain"
              />
              <EditableField
                label="Email Address"
                value={form.email}
                editing={editing}
                onChange={handleField("email")}
                type="email"
                placeholder="you@example.com"
              />
              <EditableField
                label="Location"
                value={form.location}
                editing={editing}
                onChange={handleField("location")}
                placeholder="Bangalore, India"
              />
              <EditableField
                label="LinkedIn URL"
                value={form.linkedin}
                editing={editing}
                onChange={handleField("linkedin")}
                placeholder="https://linkedin.com/in/..."
              />
              <EditableField
                label="LeetCode Username"
                value={form.leetcode}
                editing={editing}
                onChange={handleField("leetcode")}
                placeholder="your_leetcode"
              />

              <EditableField
                label="Codeforces Username"
                value={form.codeforces}
                editing={editing}
                onChange={handleField("codeforces")}
                placeholder="your_codeforces"
              />
            </div>

            {/* Role selector */}
            <div className="mt-5">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                Account Role
              </label>
              {editing ? (
                <select
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  className="bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all"
                >
                  <option value="Candidate">Candidate</option>
                  <option value="Recruiter">Recruiter</option>
                </select>
              ) : (
                <p className="text-sm text-zinc-800 font-medium py-2.5">{form.role}</p>
              )}
            </div>

            {/* Bio */}
            <div className="mt-5">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                Short Bio
              </label>
              {editing ? (
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  placeholder="A brief summary about yourself..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-400 transition-all resize-none font-light"
                />
              ) : (
                <p className="text-sm text-zinc-500 font-light py-2.5 leading-relaxed">
                  {form.bio || <span className="text-zinc-300 italic">No bio added yet</span>}
                </p>
              )}
            </div>
          </SectionWrapper>

          {/* Resume Status */}
          <SectionWrapper
            title="Resume"
            description="Upload your latest resume for ATS analysis"
            action={
              resumeFile && !resumeSaved ? (
                <button
                  onClick={handleResumeSave}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-900 text-white px-3.5 py-1.5 rounded-lg hover:bg-zinc-700 transition-all"
                >
                  <Upload size={12} /> Save Resume
                </button>
              ) : null
            }
          >
            <FileUpload
              onFileSelect={handleResumeUpload}
              accept=".pdf,.doc,.docx"
              label="Upload Resume"
            />
            {resumeSaved && (
              <div className="mt-3 flex items-center gap-2 text-emerald-600 text-xs font-medium bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                <CheckCircle2 size={13} /> Resume saved successfully
              </div>
            )}
            <p className="text-xs text-zinc-400 font-light mt-3">
              Go to <span className="text-zinc-600 font-medium">ATS Checker</span> to analyze your resume against job descriptions.
            </p>
          </SectionWrapper>
        </div>

        {/* ── Right: Stats ── */}
        <div className="space-y-5">

          {/* Application Stats */}
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 mb-3">Application Stats</p>
            <div className="grid grid-cols-2 gap-3">
              {APP_STATS.map((s, i) => (
                <StatsCard
                  key={i}
                  label={s.label}
                  value={s.value}
                  icon={s.icon}
                  accent={s.accent}
                  color={s.color}
                  bg={s.bg}
                />
              ))}
            </div>
          </div>

          {/* Account Info */}
          <SectionWrapper title="Account" description="Account details">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-50">
                <span className="text-xs text-zinc-400 font-medium">Member since</span>
                <span className="text-xs text-zinc-700 font-semibold">Jan 2025</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-50">
                <span className="text-xs text-zinc-400 font-medium">Plan</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Free
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-zinc-400 font-medium">Status</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-zinc-700 font-semibold">Active</span>
                </div>
              </div>
            </div>
          </SectionWrapper>

        </div>
      </div>
    </Sidebar>
  );
}