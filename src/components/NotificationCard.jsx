import { Bell, Check, MailOpen, Mail } from "lucide-react";

const TYPE_META = {
  interview: { icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  offer:     { icon: Check, color: "text-emerald-500", bg: "bg-emerald-50" },
  rejection: { icon: MailOpen, color: "text-red-500", bg: "bg-red-50" },
  update:    { icon: Mail, color: "text-blue-500", bg: "bg-blue-50" },
  default:   { icon: Bell, color: "text-zinc-400", bg: "bg-zinc-100" },
};

/**
 * NotificationCard
 * Props:
 *  - notification: { id, title, message, timestamp, read, type }
 *  - onToggleRead: (id) => void
 */
export default function NotificationCard({ notification, onToggleRead }) {
  const { id, title, message, timestamp, read, type = "default" } = notification;
  const meta = TYPE_META[type] || TYPE_META.default;
  const Icon = meta.icon;

  return (
    <div
      className={`flex items-start gap-4 px-6 py-4 border-b border-zinc-100 transition-colors last:border-b-0
        ${read ? "bg-white" : "bg-zinc-50/70"}`}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${meta.bg}`}>
        <Icon size={16} className={meta.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className={`text-sm leading-snug ${read ? "text-zinc-600 font-normal" : "text-zinc-900 font-semibold"}`}>
            {title}
          </p>
          {!read && (
            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed font-light line-clamp-2">{message}</p>
        <p className="text-[10px] text-zinc-300 mt-1.5 font-medium uppercase tracking-wider">{timestamp}</p>
      </div>

      {/* Toggle read */}
      <button
        onClick={() => onToggleRead(id)}
        title={read ? "Mark as unread" : "Mark as read"}
        className="flex-shrink-0 text-zinc-300 hover:text-zinc-600 transition-colors mt-1"
      >
        {read ? <Mail size={15} /> : <MailOpen size={15} />}
      </button>
    </div>
  );
}