/**
 * StatsCard
 * Props:
 *  - label: string
 *  - value: string | number
 *  - icon: Lucide icon component
 *  - accent?: boolean  — uses accent gradient styling
 *  - color?: string    — icon color class e.g. "text-blue-500"
 *  - bg?: string       — icon bg class e.g. "bg-blue-50"
 */
export default function StatsCard({ label, value, icon: Icon, accent = false, color = "text-zinc-600", bg = "bg-zinc-100" }) {
  return (
    <div className={`border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group
      ${accent
        ? "bg-zinc-900 border-zinc-800"
        : "bg-white border-zinc-200"
      }`}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform
            ${accent ? "bg-white/10" : bg}`}
          >
            <Icon size={22} className={accent ? "text-white" : color} />
          </div>
        )}
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5
            ${accent ? "text-zinc-400" : "text-zinc-400"}`}
          >
            {label}
          </p>
          <p className={`text-3xl font-bold leading-none tabular-nums
            ${accent ? "text-white" : "text-zinc-900"}`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}