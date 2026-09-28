import {
  TARGET_BUILDINGS,
  findBuilding,
  getLevelLabel,
  getShortLevelLabel,
} from '../data/targets'
import { formatNumber } from '../lib/format'
import { MAX_TARGET_HP } from '../state/calculatorReducer'
import type { TargetSelection } from '../types'
import { NumberInput } from './ui/NumberInput'
import { Panel } from './ui/Panel'

interface TargetPanelProps {
  hp: number
  target: TargetSelection | null
  onHpChange: (hp: number) => void
  onBuildingSelect: (buildingId: string) => void
  onLevelSelect: (level: number) => void
}

const chipClass =
  'flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-sm font-semibold transition active:scale-95'
const activeChipClass = 'border-amber-400/60 bg-amber-400/15 text-amber-100'

export function TargetPanel({
  hp,
  target,
  onHpChange,
  onBuildingSelect,
  onLevelSelect,
}: TargetPanelProps) {
  const building = target ? findBuilding(target.buildingId) : undefined

  return (
    <Panel title="Target" icon="🎯" description="Pilih bangunan & level, atau isi hitpoint sendiri">
      <div className="mb-4 flex flex-wrap gap-2">
        {TARGET_BUILDINGS.map((item) => {
          const isActive = item.id === building?.id
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onBuildingSelect(item.id)}
              className={`${chipClass} ${
                isActive
                  ? activeChipClass
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25'
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.name}
            </button>
          )
        })}
        <span
          className={`${chipClass} ${
            target === null ? activeChipClass : 'border-dashed border-white/10 text-slate-500'
          }`}
        >
          <span aria-hidden>✏️</span> Custom
        </span>
      </div>

      {building && target && (
        <fieldset className="mb-4">
          <legend className="mb-2 text-sm font-semibold text-slate-300">
            Level {building.name}
          </legend>
          {building.levels.length > 1 ? (
            <div className="grid grid-cols-5 gap-1.5 rounded-2xl bg-slate-950/60 p-1.5 ring-1 ring-white/10 sm:grid-cols-7">
              {building.levels.map((item) => {
                const isActive = item.level === target.level
                return (
                  <button
                    key={item.level}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${getLevelLabel(building, item.level)}, ${formatNumber(item.hp)} HP`}
                    onClick={() => onLevelSelect(item.level)}
                    className={`rounded-xl px-1 py-1.5 transition ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <span className="block font-display text-base">
                      {getShortLevelLabel(item)}
                    </span>
                    <span className="block text-[10px] font-semibold opacity-80">
                      {formatNumber(item.hp)}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="inline-block rounded-xl bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-300">
              {getLevelLabel(building, target.level)}
            </p>
          )}
        </fieldset>
      )}

      <label htmlFor="target-hp" className="mb-2 block text-sm font-semibold text-slate-300">
        Hitpoint Target
      </label>
      <NumberInput
        id="target-hp"
        value={hp}
        max={MAX_TARGET_HP}
        suffix="HP"
        onValueChange={onHpChange}
        className="text-3xl"
      />
    </Panel>
  )
}
