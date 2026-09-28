import type { DamageResult } from '../lib/damage'
import { formatNumber } from '../lib/format'

interface MobileResultBarProps {
  targetHp: number
  result: DamageResult
}

export function MobileResultBar({ targetHp, result }: MobileResultBarProps) {
  const progress = targetHp > 0 ? Math.min(result.totalDamage / targetHp, 1) * 100 : 0

  return (
    <a
      href="#hasil"
      className="fixed inset-x-3 bottom-3 z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl shadow-black/60 backdrop-blur lg:hidden"
    >
      <span className="text-2xl" aria-hidden>
        {result.isDestroyed ? '🏆' : '🛡️'}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`font-display tracking-wide ${
            result.isDestroyed ? 'text-emerald-300' : 'text-rose-300'
          }`}
        >
          {result.isDestroyed
            ? `HANCUR! +${formatNumber(result.overkill)}`
            : `Kurang ${formatNumber(result.remainingHp)} HP`}
        </p>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full transition-[width] duration-500 ${
              result.isDestroyed ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <span className="text-right text-xs text-slate-400">
        <span className="block font-display text-base text-amber-200">
          {formatNumber(result.totalDamage)}
        </span>
        / {formatNumber(targetHp)}
      </span>
    </a>
  )
}
