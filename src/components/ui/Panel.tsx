import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  icon: string
  description?: string
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function Panel({ title, icon, description, action, className = '', children }: PanelProps) {
  return (
    <section
      className={`rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/30 backdrop-blur sm:p-6 ${className}`}
    >
      <header className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="grid size-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-amber-300/25 to-amber-600/10 text-2xl ring-1 ring-amber-300/20"
            aria-hidden
          >
            {icon}
          </span>
          <div>
            <h2 className="font-display text-xl tracking-wide text-amber-100">{title}</h2>
            {description && <p className="text-sm text-slate-400">{description}</p>}
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
