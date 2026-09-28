import type { DamageSegment } from '../lib/damage'
import { formatNumber } from '../lib/format'

interface HpBarProps {
  targetHp: number
  segments: DamageSegment[]
  totalDamage: number
}

export function HpBar({ targetHp, segments, totalDamage }: HpBarProps) {
  const scale = Math.max(targetHp, totalDamage, 1)
  const hpMarker = (targetHp / scale) * 100

  return (
    <div>
      <div
        className="relative h-7 overflow-hidden rounded-full bg-slate-950 ring-1 ring-white/10"
        role="img"
        aria-label={`Damage ${formatNumber(totalDamage)} dari ${formatNumber(targetHp)} HP`}
      >
        <div className="flex h-full">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="h-full border-r border-slate-950/60 transition-[width] duration-500 ease-out last:border-r-0"
              style={{ width: `${(segment.damage / scale) * 100}%`, backgroundColor: segment.color }}
              title={`${segment.label}: ${formatNumber(segment.damage)}`}
            />
          ))}
        </div>
        {totalDamage > targetHp && (
          <div
            className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_white]"
            style={{ left: `calc(${hpMarker}% - 2px)` }}
          />
        )}
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-slate-500">
        <span>0</span>
        <span>{formatNumber(targetHp)} HP</span>
      </div>
    </div>
  )
}
