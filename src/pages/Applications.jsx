import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  Bookmark,
  Mail,
  ChevronDown,
  Plus,
  Search,
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
  User,
  FileText,
  X,
  ShieldCheck,
  MoreVertical
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import api from "../utils/api";
import { useApplications } from "../context/applicationsContext";
// ── Constants & Helpers ──────────────────────────────────────────────────────

const STATUSES = ["All", "Applied", "Shortlisted", "Interview", "Offer", "Rejected"];

const STATUS_CONFIG = {
  Applied: { label: "Applied", color: "text-blue-500 bg-blue-50/50" },
  Shortlisted: { label: "Shortlisted", color: "text-amber-500 bg-amber-50/50" },
  Interview: { label: "Interview", color: "text-violet-500 bg-violet-50/50" },
  Offer: { label: "Offer", color: "text-green-600 bg-green-50/50" },
  Rejected: { label: "Rejected", color: "text-red-500 bg-red-50/50" },
};

const SAMPLE_DATA = [
  {
    id: 1,
    company: "Google",
    role: "Senior Frontend Engineer",
    date: "2024-03-10",
    status: "Interview",
    confidence: 4,
    source: "LinkedIn",
    lastUpdate: "2h ago",
    link: "https://google.com/careers",
    saved: true,
    location: "Mountain View, CA",
    salary: "$180k - $220k",
    contact: "Sarah Jenkins",
    email: "sjenkins@google.com",
    notes: "Follow up in 2 weeks.",
    lastEmail: {
      subject: "Interview Schedule: Next Steps",
      sender: "Google Recruiting",
      content: "Hello! We would like to move forward with a technical interview...",
      parsedStatus: "Interview",
      confidence: 98
    }
  },
  {
    id: 2,
    company: "Stripe",
    role: "Product Engineer",
    date: "2024-03-12",
    status: "Applied",
    confidence: 100,
    source: "Manual",
    lastUpdate: "1d ago",
    link: "https://stripe.com/jobs",
    saved: false,
    location: "Remote",
    salary: "$160k",
    contact: "",
    email: "",
    notes: "",
    lastEmail: null
  },
];

const INITIAL_FORM_STATE = {
  company: "",
  role: "",
  link: "",
  date: "",
  status: "Applied",
  location: "",
  salary: "",
  contact: "",
  email: "",
  notes: ""
};

// ── Sub-Components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status, confidence }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Applied;
  
  const getConfidenceColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    return "text-zinc-400";
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
        {config.label}
      </span>
      {confidence && (
        <span className={`text-[10px] font-medium flex items-center gap-0.5 ${getConfidenceColor(confidence)}`}>
          <ShieldCheck size={10} />
          {confidence}%
        </span>
      )}
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function Applications() {
  const [apps, setApps] = useState(SAMPLE_DATA);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const {data,setData}=useApplications();
  // Modal states
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'delete' | 'email'
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Action menu state
  const [activeMenu, setActiveMenu] = useState(null); // stores app.id
  const menuRef = useRef(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const SkeletonRow = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 w-24 bg-zinc-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-32 bg-zinc-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-3 w-20 bg-zinc-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-28 bg-zinc-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-3 w-16 bg-zinc-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-3 w-20 bg-zinc-200 rounded"></div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="h-6 w-6 bg-zinc-200 rounded ml-auto"></div>
      </td>
    </tr>
  );
};
 useEffect(()=>{
  const fetch=async()=>{
     setLoading(true); 
    try {
      const res=await api("get","api/applications/");
      setData(res.data.applications);
    } catch (error) {
      console.error("Error fetching applications:",error);
    } 
    finally{
       setLoading(false); 
    }
  }
  fetch();
 },[])
  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prefill logic for Edit mode
  useEffect(() => {
    if (modalType === 'edit' && selectedApp) {
      setFormData({
        company: selectedApp.company || "",
        role: selectedApp.role || "",
        link: selectedApp.link || "",
        date: selectedApp.date || "",
        status: selectedApp.status || "Applied",
        location: selectedApp.location || "",
        salary: selectedApp.salary || "",
        contact: selectedApp.contact || "",
        email: selectedApp.email || "",
        notes: selectedApp.notes || ""
      });
    } else if (modalType === 'add') {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [modalType, selectedApp]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAddApplication = useCallback(() => {
    const newApp = {
      ...formData,
      id: Date.now(),
      confidence: 100, // Default for manual entries
      source: "Manual",
      lastUpdate: "Just now",
      saved: false,
      lastEmail: null
    };
    setApps(prev => [newApp, ...prev]);
    setModalType(null);
  }, [formData]);

  const handleEditApplication = useCallback((id) => {
    setApps(prev => prev.map(app => 
      app.id === id ? { ...app, ...formData, lastUpdate: "Just now" } : app
    ));
    setModalType(null);
  }, [formData]);

  const handleDeleteApplication = useCallback((id) => {
    setApps(prev => prev.filter(app => app.id !== id));
    setModalType(null);
  }, []);

  const handleStatusUpdate = useCallback((id, newStatus) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, status: newStatus, lastUpdate: "Just now" } : app));
  }, []);

  const handleBookmark = useCallback((id) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, saved: !app.saved } : app));
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      handleAddApplication();
    } else if (modalType === 'edit') {
      handleEditApplication(selectedApp.id);
    }
  };

  // ── Filtering Logic ────────────────────────────────────────────────────────
const normalizedData = useMemo(() => {
  return data.map(app => ({
    id: app.APP_ID,
    company: app.company,
    role: app.jobrole,
    date: new Date(app.changed_at).toLocaleDateString(),
    status: app.status,
    source: app.platform,
    link: app.link
  }));
}, [data]);
 const filteredApps = useMemo(() => {
  return normalizedData.filter(app => {
    const matchesFilter = filter === "All" || app.status === filter;

    const matchesSearch =
      app.company?.toLowerCase().includes(search.toLowerCase()) ||
      app.role?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });
}, [normalizedData, filter, search]);// ✅ FIXED dependency



  
  return (
    <div className="flex bg-zinc-50 min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-10 overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-zinc-900 tracking-tight leading-tight">
              Applications
            </h1>
            <p className="text-zinc-400 font-light text-sm mt-1">
              Track, manage, and analyze your job applications
            </p>
          </div>
          <button 
            onClick={() => setModalType('add')}
            className="bg-zinc-900 text-white rounded-xl py-2.5 px-5 font-semibold text-sm hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Add Application
          </button>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-5 mb-8 items-center justify-between">
          <div className="flex p-1 bg-zinc-200/50 rounded-xl w-full sm:w-auto">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === s 
                    ? "bg-white text-zinc-900 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-zinc-300" size={16} />
            <input 
              type="text" 
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-400 transition-all placeholder:text-zinc-300"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-visible">
         {loading ? (
  <tbody>
    {[...Array(6)].map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </tbody>
) : (
  <>
  { filteredApps.length > 0 ? (
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/30">
                  <th className="w-[15%] text-[10px] text-zinc-400 font-bold uppercase tracking-widest px-6 py-4">Company</th>
                  <th className="w-[20%] text-[10px] text-zinc-400 font-bold uppercase tracking-widest px-6 py-4">Role</th>
                  <th className="w-[15%] text-[10px] text-zinc-400 font-bold uppercase tracking-widest px-6 py-4">Applied Date</th>
                  <th className="w-[20%] text-[10px] text-zinc-400 font-bold uppercase tracking-widest px-6 py-4">Status & Confidence</th>
                  <th className="w-[10%] text-[10px] text-zinc-400 font-bold uppercase tracking-widest px-6 py-4">Source</th>
                  <th className="w-[10%] text-[10px] text-zinc-400 font-bold uppercase tracking-widest px-6 py-4">Last Update</th>
                  <th className="w-[10%] text-[10px] text-zinc-400 font-bold uppercase tracking-widest px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="group hover:bg-zinc-50 transition-all">
                    <td className="px-6 py-4 font-semibold text-zinc-900 text-sm truncate">{app.company}</td>
                    <td className="px-6 py-4 text-zinc-500 text-sm truncate">{app.role}</td>
                    <td className="px-6 py-4 text-zinc-400 text-xs font-light">{app.date}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} confidence={app.confidence} /></td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium border border-zinc-200 text-zinc-500 bg-zinc-50">
                        {app.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-[10px] font-medium italic">{app.lastUpdate}</td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === app.id ? null : app.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-zinc-100 transition-all text-zinc-400 hover:text-zinc-900"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      {/* Floating Actions Menu */}
                      {activeMenu === app.id && (
                        <div 
                          ref={menuRef}
                          className="absolute right-6 top-10 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                          <button 
                            onClick={() => { window.open(app.link, "_blank"); setActiveMenu(null); }}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                          >
                            <ExternalLink size={14} className="text-zinc-400" /> Open Job Link
                          </button>
                          <button 
                            onClick={() => { setSelectedApp(app); setModalType('email'); setActiveMenu(null); }}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                          >
                            <Mail size={14} className="text-zinc-400" /> View Last Email
                          </button>
                          <button 
                            onClick={() => { handleBookmark(app.id); setActiveMenu(null); }}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                          >
                            <Bookmark size={14} className={app.saved ? "text-amber-500" : "text-zinc-400"} fill={app.saved ? "currentColor" : "none"} /> 
                            {app.saved ? "Saved" : "Save Application"}
                          </button>
                          <div className="h-px bg-zinc-100 my-1 mx-2" />
                          <button 
                            onClick={() => { setSelectedApp(app); setModalType('edit'); setActiveMenu(null); }}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                          >
                            <Pencil size={14} className="text-zinc-400" /> Edit Details
                          </button>
                          <button 
                            onClick={() => { setSelectedApp(app); setModalType('delete'); setActiveMenu(null); }}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                
           
              </tbody>
              
            </table>
            
          ) : (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 text-zinc-200">
                <Briefcase size={32} />
              </div>
              <h3 className="font-display font-bold text-zinc-900 text-lg mb-1">No applications found</h3>
              <p className="text-zinc-400 text-sm font-light mb-6">Start by adding your first application</p>
              <button onClick={() => setModalType('add')} className="text-zinc-900 font-semibold text-sm hover:underline flex items-center gap-1">
                <Plus size={14} /> Create new
              </button>
            </div>
          )} 
             </>
               )
               }
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}

      {/* Add / Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-zinc-200 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-2xl text-zinc-900 tracking-tight">
                {modalType === 'add' ? "New Application" : "Edit Application"}
              </h3>
              <button onClick={() => setModalType(null)} className="text-zinc-400 hover:text-zinc-600"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <Briefcase size={10}/> Company
                    </label>
                    <input name="company" value={formData.company} onChange={handleFormChange} required type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all" placeholder="e.g. Google" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <User size={10}/> Role
                    </label>
                    <input name="role" value={formData.role} onChange={handleFormChange} required type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all" placeholder="e.g. Software Engineer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <ExternalLink size={10}/> Job Link
                    </label>
                    <input name="link" value={formData.link} onChange={handleFormChange} type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all" placeholder="https://..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Calendar size={10}/> Date
                      </label>
                      <input name="date" value={formData.date} onChange={handleFormChange} type="date" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Status</label>
                      <select name="status" value={formData.status} onChange={handleFormChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all">
                        {STATUSES.slice(1).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <MapPin size={10}/> Location
                    </label>
                    <input name="location" value={formData.location} onChange={handleFormChange} type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all" placeholder="e.g. New York, Remote" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <DollarSign size={10}/> Salary
                    </label>
                    <input name="salary" value={formData.salary} onChange={handleFormChange} type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all" placeholder="e.g. $120k - $150k" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <User size={10}/> Contact Person
                    </label>
                    <input name="contact" value={formData.contact} onChange={handleFormChange} type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all" placeholder="Recruiter name" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <Mail size={10}/> Contact Email
                    </label>
                    <input name="email" value={formData.email} onChange={handleFormChange} type="email" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all" placeholder="recruiter@company.com" />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <FileText size={10}/> Notes
                </label>
                <textarea name="notes" value={formData.notes} onChange={handleFormChange} rows={3} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all resize-none" placeholder="Key technologies, referral info, etc."></textarea>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setModalType(null)} className="flex-1 text-sm border border-zinc-200 text-zinc-700 py-2.5 rounded-xl hover:border-zinc-400 transition-all font-medium">Cancel</button>
                <button type="submit" className="flex-1 text-sm bg-zinc-900 text-white py-2.5 rounded-xl hover:bg-zinc-800 transition-all font-semibold shadow-sm">
                  {modalType === 'add' ? "Save Application" : "Update Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Last Email Modal */}
      {modalType === 'email' && selectedApp?.lastEmail && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-zinc-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-zinc-900 tracking-tight leading-none">Last Received Email</h3>
                <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest mt-1">From: {selectedApp.lastEmail.sender}</p>
              </div>
            </div>

            <div className="space-y-4 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
              <div className="pb-3 border-b border-zinc-200">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Subject</span>
                <p className="text-sm font-semibold text-zinc-900">{selectedApp.lastEmail.subject}</p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Content Snippet</span>
                <p className="text-sm text-zinc-600 leading-relaxed italic">"{selectedApp.lastEmail.content}"</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between p-4 bg-zinc-900 rounded-xl text-white">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Parsed Status</span>
                <p className="font-bold text-sm tracking-tight">{selectedApp.lastEmail.parsedStatus}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1 text-right">Detection Confidence</span>
                <p className="font-bold text-xl text-green-400 leading-none">{selectedApp.lastEmail.confidence}%</p>
              </div>
            </div>

            <button onClick={() => setModalType(null)} className="w-full mt-6 text-sm bg-zinc-100 text-zinc-900 py-2.5 rounded-xl hover:bg-zinc-200 transition-all font-semibold">Close Preview</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {modalType === 'delete' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl border border-zinc-200 animate-in fade-in zoom-in duration-200">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
              <Trash2 size={20} />
            </div>
            <h3 className="font-display font-bold text-xl text-zinc-900 mb-1 tracking-tight">Delete application?</h3>
            <p className="text-zinc-400 text-sm font-light mb-6">All tracking history for <b>{selectedApp?.company}</b> will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalType(null)} className="flex-1 text-sm border border-zinc-200 text-zinc-700 py-2.5 rounded-xl hover:border-zinc-400 transition-all font-medium">Cancel</button>
              <button onClick={() => handleDeleteApplication(selectedApp.id)} className="flex-1 text-sm bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition-all font-semibold shadow-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}