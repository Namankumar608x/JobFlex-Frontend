import { useState, useMemo } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import NotificationCard from "../components/NotificationCard";

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_NOTIFICATIONS = [
  {
    id: 1,
    type: "interview",
    title: "Interview scheduled at Stripe",
    message: "Your technical interview for the Frontend Engineer role has been scheduled for April 10, 2026 at 11:00 AM IST.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "offer",
    title: "Offer received from Vercel",
    message: "Congratulations! Vercel has extended an offer for the Software Engineer II position. Please review the offer letter.",
    timestamp: "1 day ago",
    read: false,
  },
  {
    id: 3,
    type: "update",
    title: "Application shortlisted — Linear",
    message: "Your application for Product Designer at Linear has moved to the shortlist stage.",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: 4,
    type: "rejection",
    title: "Application update from Google",
    message: "Thank you for your interest in the Senior Frontend Engineer role. After careful review, we have decided to move forward with other candidates.",
    timestamp: "3 days ago",
    read: true,
  },
  {
    id: 5,
    type: "update",
    title: "New job match found",
    message: "Based on your profile, we found 4 new openings matching 'React Engineer' in Bangalore. Check them out.",
    timestamp: "4 days ago",
    read: false,
  },
  {
    id: 6,
    type: "interview",
    title: "Follow-up reminder — Figma",
    message: "It's been 7 days since your interview with Figma. Consider sending a follow-up email to the hiring manager.",
    timestamp: "5 days ago",
    read: true,
  },
];

const FILTER_TABS = ["All", "Unread", "Read"];

// ── Page Component ─────────────────────────────────────────────────────────────

export default function Notifications() {
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("All");

  // ── Derived state ───────────────────────────────────────────────────────────
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    if (activeFilter === "Unread") return notifications.filter((n) => !n.read);
    if (activeFilter === "Read")   return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, activeFilter]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  return (
    <Sidebar>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-zinc-900 tracking-tight leading-tight">
            Notifications
          </h1>
          <p className="text-zinc-400 text-sm mt-1 font-light">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 border border-zinc-200 bg-white px-3.5 py-2 rounded-lg hover:border-zinc-400 hover:text-zinc-900 transition-all"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}
          <button
            onClick={handleClearRead}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 border border-zinc-200 bg-white px-3.5 py-2 rounded-lg hover:border-red-300 hover:text-red-500 transition-all"
          >
            <Trash2 size={14} />
            Clear read
          </button>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-1 bg-zinc-100/70 border border-zinc-200 rounded-xl p-1 w-fit mb-6">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === tab
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {tab}
            {tab === "Unread" && unreadCount > 0 && (
              <span className="ml-1.5 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Notification List ── */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden max-w-3xl">
        {filtered.length > 0 ? (
          filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onToggleRead={handleToggleRead}
            />
          ))
        ) : (
          <div className="py-20 flex flex-col items-center text-center px-6">
            <div className="w-14 h-14 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-4">
              <Bell size={24} className="text-zinc-200" />
            </div>
            <p className="text-sm font-semibold text-zinc-700 mb-1">
              {activeFilter === "Unread" ? "No unread notifications" : "No notifications"}
            </p>
            <p className="text-xs text-zinc-400 font-light">
              {activeFilter === "Unread"
                ? "You're all caught up. Great work!"
                : "Notifications will appear here as your applications progress."}
            </p>
          </div>
        )}
      </div>
    </Sidebar>
  );
}