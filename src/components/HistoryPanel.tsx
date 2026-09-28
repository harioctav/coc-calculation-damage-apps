import { describeLoadout } from '../lib/describe'
import { formatDate, formatNumber } from '../lib/format'
import type { CalculatorState, HistoryEntry } from '../types'
import { Panel } from './ui/Panel'

interface HistoryPanelProps {
  entries: HistoryEntry[]
  onRestore: (state: CalculatorState) => void
  onRemove: (id: string) => void
  onClear: () => void
}

export function HistoryPanel({ entries, onRestore, onRemove, onClear }: HistoryPanelProps) {
  return (
    <Panel
      title="Riwayat"
      icon="📜"
      description="Klik untuk memuat ulang perhitungan"
      action={
        entries.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Hapus semua riwayat perhitungan?')) onClear()
            }}
            className="text-xs font-semibold text-slate-500 transition hover:text-rose-300"
          >
            Hapus semua
          </button>
        )
      }
    >
      {entries.length === 0 ? (
        <p className="rounded-2xl bg-slate-950/50 p-4 text-center text-sm text-slate-500">
          Belum ada riwayat. Simpan perhitungan dari panel hasil.
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="group relative">
              <button
                type="button"
                onClick={() => onRestore(entry.state)}
                className="w-full rounded-2xl bg-slate-950/50 p-3 pr-10 text-left ring-1 ring-white/5 transition hover:ring-amber-400/30"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-lg px-2 py-0.5 text-xs font-bold ${
                      entry.isDestroyed
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-rose-500/15 text-rose-300'
                    }`}
                  >
                    {entry.isDestroyed ? 'Hancur' : 'Gagal'}
                  </span>
                  <span className="truncate font-semibold text-slate-100">{entry.targetName}</span>
                  <span className="ml-auto shrink-0 text-xs text-slate-500">
                    {formatNumber(entry.state.targetHp)} HP
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-400">{describeLoadout(entry.state)}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {formatNumber(entry.totalDamage)} damage · {formatDate(entry.createdAt)}
                </p>
              </button>
              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                aria-label={`Hapus riwayat ${entry.targetName}`}
                className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-500/15 hover:text-rose-300 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
