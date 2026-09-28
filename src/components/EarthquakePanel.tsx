import {
  EARTHQUAKE_ICON,
  EARTHQUAKE_LEVELS,
  MAX_EARTHQUAKES,
  getEarthquakePercent,
} from '../data/earthquake'
import { getEarthquakeDivisor } from '../lib/damage'
import { formatNumber } from '../lib/format'
import { sum } from '../lib/math'
import { Panel } from './ui/Panel'

interface EarthquakePanelProps {
  targetHp: number
  level: number
  count: number
  hits: number[]
  onLevelChange: (level: number) => void
  onCountChange: (count: number) => void
}

export function EarthquakePanel({
  targetHp,
  level,
  count,
  hits,
  onLevelChange,
  onCountChange,
}: EarthquakePanelProps) {
  const percent = getEarthquakePercent(level)

  return (
    <Panel
      title="Earthquake Spell"
      icon="🌋"
      description="Damage berdasarkan persentase hitpoint target"
    >
      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-semibold text-slate-300">Level Spell</legend>
        <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-slate-950/60 p-1.5 ring-1 ring-white/10 sm:grid-cols-8">
          {EARTHQUAKE_LEVELS.map((item) => {
            const isActive = item.level === level
            return (
              <button
                key={item.level}
                type="button"
                aria-pressed={isActive}
                onClick={() => onLevelChange(item.level)}
                className={`rounded-xl px-1 py-2 transition ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span className="block font-display text-sm">Lv. {item.level}</span>
                <span className="block text-xs font-semibold opacity-80">
                  {formatNumber(item.percent)}%
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-semibold text-slate-300">
          Jumlah Gempa <span className="text-slate-500">({count} dari {MAX_EARTHQUAKES})</span>
        </legend>
        <div className="flex gap-2">
          {Array.from({ length: MAX_EARTHQUAKES }, (_, index) => {
            const isActive = index < count
            const nextCount = count === index + 1 ? index : index + 1
            return (
              <button
                key={index}
                type="button"
                aria-pressed={isActive}
                aria-label={`Gempa ke-${index + 1}`}
                onClick={() => onCountChange(nextCount)}
                className={`grid h-14 flex-1 place-items-center rounded-2xl text-2xl transition active:scale-90 ${
                  isActive
                    ? 'bg-linear-to-b from-amber-400/30 to-amber-700/20 ring-2 ring-amber-400/60'
                    : 'bg-white/5 opacity-40 grayscale ring-1 ring-white/10 hover:opacity-70'
                }`}
              >
                {EARTHQUAKE_ICON}
              </button>
            )
          })}
        </div>
      </fieldset>

      {hits.length > 0 ? (
        <ol className="space-y-1.5 rounded-2xl bg-slate-950/50 p-4 text-sm ring-1 ring-white/5">
          {hits.map((hit, index) => (
            <li key={index} className="flex items-center justify-between gap-3">
              <span className="text-slate-400">Gempa ke-{index + 1}</span>
              <span className="flex-1 truncate text-right text-slate-500">
                {index === 0
                  ? `${formatNumber(targetHp)} × ${formatNumber(percent)}%`
                  : `${formatNumber(hits[0])} ÷ ${getEarthquakeDivisor(index)}`}
              </span>
              <span className="w-20 text-right font-semibold text-amber-200">
                {formatNumber(hit)}
              </span>
            </li>
          ))}
          <li className="mt-2 flex justify-between border-t border-white/10 pt-2 font-semibold">
            <span className="text-slate-300">Total Gempa</span>
            <span className="text-amber-300">{formatNumber(sum(hits))}</span>
          </li>
        </ol>
      ) : (
        <p className="rounded-2xl bg-slate-950/50 p-4 text-center text-sm text-slate-500 ring-1 ring-white/5">
          Tidak memakai Earthquake Spell
        </p>
      )}
    </Panel>
  )
}
