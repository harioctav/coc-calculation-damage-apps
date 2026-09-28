import { DAMAGE_SOURCES } from '../data/damageSources'
import { findBuilding, getLevelLabel } from '../data/targets'
import type { CalculatorState, DamageSource } from '../types'
import { formatNumber } from './format'

export function describeLoadout(
  state: CalculatorState,
  sources: DamageSource[] = DAMAGE_SOURCES,
): string {
  const parts: string[] = []

  if (state.earthquakeCount > 0) {
    parts.push(`${state.earthquakeCount}x Gempa (Lv. ${state.earthquakeLevel})`)
  }

  for (const source of sources) {
    const selection = state.selections[source.id]
    if (!selection || selection.quantity <= 0) continue
    const quantity = source.maxQuantity > 1 ? `${selection.quantity}x ` : ''
    parts.push(`${quantity}${source.name} (Lv. ${selection.level})`)
  }

  if (state.extraDamage > 0) {
    parts.push(`Damage tambahan ${formatNumber(state.extraDamage)}`)
  }

  return parts.length > 0 ? parts.join(' + ') : 'Belum ada serangan'
}

export function getTargetName(state: CalculatorState): string {
  if (!state.target) return 'Target Custom'
  const building = findBuilding(state.target.buildingId)
  return building
    ? `${building.name} ${getLevelLabel(building, state.target.level)}`
    : 'Target Custom'
}
