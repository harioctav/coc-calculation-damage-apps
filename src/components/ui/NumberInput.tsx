import { useState, type InputHTMLAttributes } from 'react'
import { clamp } from '../../lib/math'

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'min' | 'max'> {
  value: number
  min?: number
  max: number
  suffix?: string
  onValueChange: (value: number) => void
}

export function NumberInput({
  value,
  min = 0,
  max,
  suffix,
  onValueChange,
  className = '',
  ...inputProps
}: NumberInputProps) {
  // Menyimpan teks mentah selama diketik agar input boleh kosong sementara.
  const [draft, setDraft] = useState<string | null>(null)

  return (
    <div className="relative">
      <input
        {...inputProps}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        placeholder="0"
        value={draft ?? (value === 0 ? '' : String(value))}
        onChange={(event) => {
          const text = event.target.value
          setDraft(text)
          const parsed = Number(text)
          if (text !== '' && Number.isFinite(parsed)) onValueChange(clamp(parsed, min, max))
        }}
        onFocus={(event) => event.target.select()}
        onBlur={() => setDraft(null)}
        className={`w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 font-display tracking-wide text-white outline-none transition [appearance:textfield] focus:border-amber-400/60 focus:ring-4 focus:ring-amber-400/15 [&::-webkit-inner-spin-button]:appearance-none ${
          suffix ? 'pr-14' : ''
        } ${className}`}
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-500">
          {suffix}
        </span>
      )}
    </div>
  )
}
