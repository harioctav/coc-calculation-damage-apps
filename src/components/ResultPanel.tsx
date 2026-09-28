import { useEffect, useState } from 'react'
import type { DamageResult } from '../lib/damage'
import { formatNumber } from '../lib/format'
import { HpBar } from './HpBar'
import { Panel } from './ui/Panel'

interface ResultPanelProps {
  targetName: string
  targetHp: number
  result: DamageResult
  onSave: () => void
  onReset: () => void
}

const SAVED_FEEDBACK_MS = 1500

export function ResultPanel({ targetName, targetHp, result, onSave, onReset }: ResultPanelProps) {
  const { segments, totalDamage, remainingHp, overkill, isDestroyed } = result
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    if (!justSaved) return
    const timeout = window.setTimeout(() => setJustSaved(false), SAVED_FEEDBACK_MS)
    return () => window.clearTimeout(timeout)
  }, [justSaved])

  return (
    <Panel title="Hasil Perhitungan" icon="📊" description={targetName}>
      <div
        key={String(isDestroyed)}
        className={`mb-5 animate-pop rounded-2xl p-4 text-center ring-1 ${
          isDestroyed
            ? 'bg-linear-to-br from-emerald-500/25 to-emerald-800/10 ring-emerald-400/40'
            : 'bg-linear-to-br from-rose-500/20 to-rose-900/10 ring-rose-400/30'
        }`}
        aria-live="polite"
      >
        <p
          className={`font-display text-3xl tracking-wide ${
            isDestroyed ? 'text-emerald-300' : 'text-rose-300'
          }`}
        >
          {isDestroyed ? '🏆 HANCUR!' : '🛡️ Belum Hancur'}
        </p>
        <p className="mt-1 text-sm text-slate-300">
          {isDestroyed
            ? `Kelebihan damage +${formatNumber(overkill)}`
            : `Masih kurang ${formatNumber(remainingHp)} HP`}
        </p>
      </div>

      <HpBar targetHp={targetHp} segments={segments} totalDamage={totalDamage} />

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-950/60 p-3 ring-1 ring-white/5">
          <dt className="text-xs font-semibold text-slate-500 uppercase">Total Damage</dt>
          <dd className="font-display text-2xl text-amber-200">{formatNumber(totalDamage)}</dd>
        </div>
        <div className="rounded-2xl bg-slate-950/60 p-3 ring-1 ring-white/5">
          <dt className="text-xs font-semibold text-slate-500 uppercase">Hitpoint</dt>
          <dd className="font-display text-2xl text-white">{formatNumber(targetHp)}</dd>
        </div>
      </dl>

      {segments.length > 0 && (
        <ul className="mt-5 space-y-2 text-sm">
          {segments.map((segment) => (
            <li key={segment.id} className="flex items-center gap-3">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
                aria-hidden
              />
              <span className="flex-1 truncate text-slate-300">
                <span aria-hidden>{segment.icon}</span> {segment.label}
                {segment.quantity > 1 && (
                  <span className="text-slate-500">
                    {' '}
                    ×{segment.quantity}
                    {segment.unitDamage !== null && ` (@${formatNumber(segment.unitDamage)})`}
                  </span>
                )}
              </span>
              <span className="font-semibold text-white">{formatNumber(segment.damage)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => {
            onSave()
            setJustSaved(true)
          }}
          className="flex-1 rounded-2xl bg-linear-to-b from-amber-300 to-amber-500 px-4 py-3 font-display tracking-wide text-slate-950 shadow-lg shadow-amber-500/25 transition hover:brightness-110 active:scale-95"
        >
          {justSaved ? '✓ Tersimpan!' : '💾 Simpan ke Riwayat'}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl bg-white/5 px-4 py-3 font-semibold text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 active:scale-95"
        >
          Reset
        </button>
      </div>
    </Panel>
  )
}
