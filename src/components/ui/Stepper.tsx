interface StepperProps {
  value: number
  min?: number
  max: number
  label: string
  onChange: (value: number) => void
}

const buttonClass =
  'grid size-9 place-items-center rounded-xl bg-white/5 text-lg font-bold text-slate-200 transition hover:bg-amber-400/20 hover:text-amber-200 active:scale-90 disabled:pointer-events-none disabled:opacity-30'

export function Stepper({ value, min = 0, max, label, onChange }: StepperProps) {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-slate-950/60 p-1 ring-1 ring-white/10">
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Kurangi ${label}`}
      >
        −
      </button>
      <output className="w-8 text-center font-display text-lg text-white" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Tambah ${label}`}
      >
        +
      </button>
    </div>
  )
}
