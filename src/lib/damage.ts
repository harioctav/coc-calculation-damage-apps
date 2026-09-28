import { DAMAGE_SOURCES } from '../data/damageSources'
import {
  EARTHQUAKE_COLOR,
  EARTHQUAKE_ICON,
  MAX_EARTHQUAKES,
  getEarthquakePercent,
} from '../data/earthquake'
import type { CalculatorState, Combo, DamageSource } from '../types'
import { sum } from './math'

/** Toleransi pembulatan floating point saat membandingkan damage dengan hitpoint. */
const EPSILON = 1e-6

export interface DamageSegment {
  id: string
  label: string
  icon: string
  color: string
  quantity: number
  unitDamage: number | null
  damage: number
}

export interface DamageResult {
  earthquakeHits: number[]
  segments: DamageSegment[]
  totalDamage: number
  remainingHp: number
  overkill: number
  isDestroyed: boolean
}

export interface ComboSuggestion {
  combo: Combo
  result: DamageResult
  spellCount: number
  equipmentCount: number
}

/** Gempa ke-1, 2, 3, 4 memberi 1, 1/3, 1/5, 1/7 dari damage gempa pertama. */
export function getEarthquakeDivisor(index: number): number {
  return 2 * index + 1
}

export function getEarthquakeHits(targetHp: number, percent: number, count: number): number[] {
  const firstHit = (targetHp * percent) / 100
  return Array.from({ length: count }, (_, index) => firstHit / getEarthquakeDivisor(index))
}

export function getMaxLevel(source: DamageSource): number {
  return source.levels[source.levels.length - 1].level
}

export function getLevelDamage(source: DamageSource, level: number): number {
  const entry =
    source.levels.find((item) => item.level === level) ?? source.levels[source.levels.length - 1]
  return entry.damage
}

export function calculateDamage(
  state: CalculatorState,
  sources: DamageSource[] = DAMAGE_SOURCES,
): DamageResult {
  const earthquakeHits = getEarthquakeHits(
    state.targetHp,
    getEarthquakePercent(state.earthquakeLevel),
    state.earthquakeCount,
  )

  const segments: DamageSegment[] = []

  if (state.earthquakeCount > 0) {
    segments.push({
      id: 'earthquake',
      label: `Gempa Lv. ${state.earthquakeLevel}`,
      icon: EARTHQUAKE_ICON,
      color: EARTHQUAKE_COLOR,
      quantity: state.earthquakeCount,
      unitDamage: null,
      damage: sum(earthquakeHits),
    })
  }

  for (const source of sources) {
    const selection = state.selections[source.id]
    if (!selection || selection.quantity <= 0) continue

    const unitDamage = getLevelDamage(source, selection.level)
    segments.push({
      id: source.id,
      label: `${source.name} Lv. ${selection.level}`,
      icon: source.icon,
      color: source.color,
      quantity: selection.quantity,
      unitDamage,
      damage: unitDamage * selection.quantity,
    })
  }

  if (state.extraDamage > 0) {
    segments.push({
      id: 'extra',
      label: 'Damage tambahan',
      icon: '➕',
      color: '#a78bfa',
      quantity: 1,
      unitDamage: null,
      damage: state.extraDamage,
    })
  }

  const totalDamage = sum(segments.map((segment) => segment.damage))
  const isDestroyed = state.targetHp > 0 && totalDamage + EPSILON >= state.targetHp

  return {
    earthquakeHits,
    segments,
    totalDamage,
    remainingHp: Math.max(state.targetHp - totalDamage, 0),
    overkill: Math.max(totalDamage - state.targetHp, 0),
    isDestroyed,
  }
}

export function withCombo(state: CalculatorState, combo: Combo): CalculatorState {
  return {
    ...state,
    earthquakeCount: combo.earthquakeCount,
    selections: Object.fromEntries(
      Object.entries(state.selections).map(([id, selection]) => [
        id,
        { ...selection, quantity: combo.quantities[id] ?? 0 },
      ]),
    ),
  }
}

export function isCurrentCombo(state: CalculatorState, combo: Combo): boolean {
  return (
    state.earthquakeCount === combo.earthquakeCount &&
    Object.entries(state.selections).every(
      ([id, selection]) => selection.quantity === (combo.quantities[id] ?? 0),
    )
  )
}

function toCombo(vector: number[], sources: DamageSource[]): Combo {
  return {
    earthquakeCount: vector[0],
    quantities: Object.fromEntries(sources.map((source, index) => [source.id, vector[index + 1]])),
  }
}

function* cartesian(maxima: number[]): Generator<number[]> {
  const vector = maxima.map(() => 0)
  while (true) {
    yield [...vector]
    let index = 0
    while (index < vector.length && vector[index] === maxima[index]) {
      vector[index] = 0
      index++
    }
    if (index === vector.length) return
    vector[index]++
  }
}

/**
 * Mencari kombinasi paling hemat yang bisa menghancurkan target, memakai level
 * yang sedang dipilih. Hanya kombinasi minimal yang dikembalikan: jika satu
 * item saja dikurangi, target tidak lagi hancur.
 */
export function findCombos(
  state: CalculatorState,
  sources: DamageSource[] = DAMAGE_SOURCES,
  limit = 5,
): ComboSuggestion[] {
  if (state.targetHp <= 0) return []

  const evaluate = (vector: number[]) =>
    calculateDamage(withCombo(state, toCombo(vector, sources)), sources)

  const suggestions: ComboSuggestion[] = []

  for (const vector of cartesian([MAX_EARTHQUAKES, ...sources.map((s) => s.maxQuantity)])) {
    const result = evaluate(vector)
    if (!result.isDestroyed) continue

    const isMinimal = vector.every(
      (quantity, index) => quantity === 0 || !evaluate(vector.with(index, quantity - 1)).isDestroyed,
    )
    if (!isMinimal) continue

    const quantityByCategory = (category: DamageSource['category']) =>
      sum(sources.map((source, index) => (source.category === category ? vector[index + 1] : 0)))

    suggestions.push({
      combo: toCombo(vector, sources),
      result,
      spellCount: vector[0] + quantityByCategory('spell'),
      equipmentCount: quantityByCategory('equipment'),
    })
  }

  return suggestions
    .sort(
      (a, b) =>
        a.spellCount - b.spellCount ||
        a.equipmentCount - b.equipmentCount ||
        a.result.totalDamage - b.result.totalDamage,
    )
    .slice(0, limit)
}
