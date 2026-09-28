import { isCurrentCombo, withCombo, type ComboSuggestion } from '../lib/damage'
import { describeLoadout } from '../lib/describe'
import { formatNumber } from '../lib/format'
import type { CalculatorState, Combo } from '../types'
import { Panel } from './ui/Panel'

interface ComboSuggestionsProps {
  state: CalculatorState
  suggestions: ComboSuggestion[]
  onApply: (combo: Combo) => void
}

export function ComboSuggestions({ state, suggestions, onApply }: ComboSuggestionsProps) {
  return (
    <Panel
      title="Saran Kombinasi"
      icon="💡"
      description="Kombinasi paling hemat berdasarkan level yang dipilih"
    >
      {suggestions.length === 0 ? (
        <p className="rounded-2xl bg-slate-950/50 p-4 text-center text-sm text-slate-500">
          {state.targetHp > 0
            ? 'Tidak ada kombinasi yang cukup untuk menghancurkan target ini.'
            : 'Pilih target dulu untuk melihat saran kombinasi.'}
        </p>
      ) : (
        <ol className="space-y-2">
          {suggestions.map(({ combo, result }, index) => {
            const isCurrent = isCurrentCombo(state, combo)
            return (
              <li
                key={index}
                className={`flex items-center gap-3 rounded-2xl p-3 ring-1 transition ${
                  isCurrent
                    ? 'bg-emerald-500/10 ring-emerald-400/40'
                    : 'bg-slate-950/50 ring-white/5 hover:ring-white/15'
                }`}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/5 font-display text-amber-200">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-100">
                    {describeLoadout(withCombo(state, combo))}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatNumber(result.totalDamage)} damage · lebih {formatNumber(result.overkill)}
                  </p>
                </div>
                {isCurrent ? (
                  <span className="text-xs font-bold text-emerald-300">Dipakai ✓</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onApply(combo)}
                    className="rounded-xl bg-amber-400/15 px-3 py-1.5 text-sm font-semibold text-amber-200 ring-1 ring-amber-400/30 transition hover:bg-amber-400/25 active:scale-95"
                  >
                    Pakai
                  </button>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </Panel>
  )
}
