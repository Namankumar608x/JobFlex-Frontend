/**
 * SectionWrapper
 * Props:
 *  - title: string
 *  - description?: string
 *  - action?: ReactNode  — optional right-side action element
 *  - children: ReactNode
 *  - className?: string  — extra classes on wrapper
 */
export default function SectionWrapper({ title, description, action, children, className = "" }) {
  return (
    <div className={`bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <div>
          <h3 className="font-display font-bold text-base text-zinc-900 tracking-tight leading-none">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-zinc-400 font-light mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Body */}
      <div className="p-6">{children}</div>
    </div>
  );
}