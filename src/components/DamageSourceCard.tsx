import { getLevelDamage } from '../lib/damage'
import { formatNumber } from '../lib/format'
import type { DamageSource, SourceSelection } from '../types'
import { Stepper } from './ui/Stepper'
import { Toggle } from './ui/Toggle'

interface DamageSourceCardProps {
  source: DamageSource
  selection: SourceSelection
  onQuantityChange: (quantity: number) => void
  onLevelChange: (level: number) => void
}

export function DamageSourceCard({
  source,
  selection,
  onQuantityChange,
  onLevelChange,
}: DamageSourceCardProps) {
  const isActive = selection.quantity > 0
  const unitDamage = getLevelDamage(source, selection.level)
  const levelSelectId = `${source.id}-level`

  return (
    <article
      className={`rounded-2xl border p-4 transition ${
        isActive
          ? 'border-white/20 bg-white/7 shadow-lg'
          : 'border-white/5 bg-slate-950/40 opacity-75 hover:opacity-100'
      }`}
      style={isActive ? { boxShadow: `0 0 0 1px ${source.color}55, 0 10px 30px -12px ${source.color}88` } : undefined}
    >
      <div className="flex items-center gap-3">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-2xl text-2xl"
          style={{ backgroundColor: `${source.color}26` }}
          aria-hidden
        >
          {source.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-white">{source.name}</h3>
          <p className="text-sm text-slate-400">
            <span className="font-semibold" style={{ color: source.color }}>
              {formatNumber(unitDamage)}
            </span>{' '}
            damage
            {selection.quantity > 1 && (
              <span className="text-slate-500">
                {' '}
                × {selection.quantity} = {formatNumber(unitDamage * selection.quantity)}
              </span>
            )}
          </p>
        </div>
        {source.maxQuantity === 1 ? (
          <Toggle
            checked={isActive}
            label={`Gunakan ${source.name}`}
            onChange={(checked) => onQuantityChange(checked ? 1 : 0)}
          />
        ) : (
          <Stepper
            value={selection.quantity}
            max={source.maxQuantity}
            label={source.name}
            onChange={onQuantityChange}
          />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-sm">
        {source.levels.length > 1 ? (
          <label htmlFor={levelSelectId} className="text-slate-500">
            Level
          </label>
        ) : (
          <span className="text-slate-500">Level</span>
        )}
        {source.levels.length > 1 ? (
          <select
            id={levelSelectId}
            value={selection.level}
            onChange={(event) => onLevelChange(Number(event.target.value))}
            className="rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 font-semibold text-slate-200 outline-none focus:border-amber-400/60"
          >
            {source.levels.map((item) => (
              <option key={item.level} value={item.level}>
                Lv. {item.level} · {formatNumber(item.damage)}
              </option>
            ))}
          </select>
        ) : (
          <span className="rounded-xl bg-white/5 px-3 py-1.5 font-semibold text-slate-300">
            Lv. {selection.level}
          </span>
        )}
      </div>
    </article>
  )
}
