import { DAMAGE_SOURCES, SOURCE_CATEGORY_LABELS } from '../data/damageSources'
import { MAX_EXTRA_DAMAGE } from '../state/calculatorReducer'
import type { SourceCategory, SourceSelection } from '../types'
import { DamageSourceCard } from './DamageSourceCard'
import { NumberInput } from './ui/NumberInput'
import { Panel } from './ui/Panel'

interface DamageSourcesPanelProps {
  selections: Record<string, SourceSelection>
  extraDamage: number
  onQuantityChange: (sourceId: string, quantity: number) => void
  onLevelChange: (sourceId: string, level: number) => void
  onExtraDamageChange: (damage: number) => void
}

const CATEGORIES: SourceCategory[] = ['equipment', 'spell']

export function DamageSourcesPanel({
  selections,
  extraDamage,
  onQuantityChange,
  onLevelChange,
  onExtraDamageChange,
}: DamageSourcesPanelProps) {
  return (
    <Panel title="Sumber Damage" icon="⚔️" description="Aktifkan hero equipment & spell yang dipakai">
      <div className="space-y-6">
        {CATEGORIES.map((category) => (
          <div key={category}>
            <h3 className="mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">
              {SOURCE_CATEGORY_LABELS[category]}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {DAMAGE_SOURCES.filter((source) => source.category === category).map((source) => (
                <DamageSourceCard
                  key={source.id}
                  source={source}
                  selection={selections[source.id]}
                  onQuantityChange={(quantity) => onQuantityChange(source.id, quantity)}
                  onLevelChange={(level) => onLevelChange(source.id, level)}
                />
              ))}
            </div>
          </div>
        ))}

        <div>
          <label
            htmlFor="extra-damage"
            className="mb-3 block text-xs font-bold tracking-widest text-slate-500 uppercase"
          >
            Damage Tambahan (manual)
          </label>
          <NumberInput
            id="extra-damage"
            value={extraDamage}
            max={MAX_EXTRA_DAMAGE}
            suffix="DMG"
            onValueChange={onExtraDamageChange}
            className="text-lg"
          />
        </div>
      </div>
    </Panel>
  )
}
