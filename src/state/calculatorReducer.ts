import { DAMAGE_SOURCES } from '../data/damageSources'
import { EARTHQUAKE_LEVELS, MAX_EARTHQUAKES, MAX_EARTHQUAKE_LEVEL } from '../data/earthquake'
import { findBuilding, getBuildingHp } from '../data/targets'
import { getMaxLevel, withCombo } from '../lib/damage'
import { clamp } from '../lib/math'
import type { CalculatorState, Combo, SourceSelection, TargetSelection } from '../types'

export const MAX_TARGET_HP = 100_000
export const MAX_EXTRA_DAMAGE = 100_000

export type CalculatorAction =
  | { type: 'setTargetHp'; hp: number }
  | { type: 'selectBuilding'; buildingId: string }
  | { type: 'setBuildingLevel'; level: number }
  | { type: 'setEarthquakeLevel'; level: number }
  | { type: 'setEarthquakeCount'; count: number }
  | { type: 'setSourceQuantity'; sourceId: string; quantity: number }
  | { type: 'setSourceLevel'; sourceId: string; level: number }
  | { type: 'setExtraDamage'; damage: number }
  | { type: 'applyCombo'; combo: Combo }
  | { type: 'load'; state: CalculatorState }
  | { type: 'reset' }

function withTarget(state: CalculatorState, target: TargetSelection): CalculatorState {
  const hp = getBuildingHp(target)
  return hp === undefined ? state : { ...state, target, targetHp: hp }
}

/** Semua isian kosong; level tetap di level tertinggi agar pilihan siap dipakai. */
export function createInitialState(): CalculatorState {
  return {
    targetHp: 0,
    target: null,
    earthquakeLevel: MAX_EARTHQUAKE_LEVEL,
    earthquakeCount: 0,
    selections: Object.fromEntries(
      DAMAGE_SOURCES.map((source) => [source.id, { quantity: 0, level: getMaxLevel(source) }]),
    ),
    extraDamage: 0,
  }
}

function updateSelection(
  state: CalculatorState,
  sourceId: string,
  update: (selection: SourceSelection) => SourceSelection,
): CalculatorState {
  const selection = state.selections[sourceId]
  if (!selection) return state
  return { ...state, selections: { ...state.selections, [sourceId]: update(selection) } }
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'setTargetHp':
      return { ...state, targetHp: clamp(action.hp, 0, MAX_TARGET_HP), target: null }

    case 'selectBuilding': {
      const building = findBuilding(action.buildingId)
      if (!building || state.target?.buildingId === building.id) return state
      return withTarget(state, { buildingId: building.id, level: building.defaultLevel })
    }

    case 'setBuildingLevel':
      return state.target
        ? withTarget(state, { buildingId: state.target.buildingId, level: action.level })
        : state

    case 'setEarthquakeLevel':
      return EARTHQUAKE_LEVELS.some((item) => item.level === action.level)
        ? { ...state, earthquakeLevel: action.level }
        : state

    case 'setEarthquakeCount':
      return { ...state, earthquakeCount: clamp(action.count, 0, MAX_EARTHQUAKES) }

    case 'setSourceQuantity': {
      const source = DAMAGE_SOURCES.find((item) => item.id === action.sourceId)
      if (!source) return state
      return updateSelection(state, action.sourceId, (selection) => ({
        ...selection,
        quantity: clamp(action.quantity, 0, source.maxQuantity),
      }))
    }

    case 'setSourceLevel': {
      const source = DAMAGE_SOURCES.find((item) => item.id === action.sourceId)
      if (!source?.levels.some((item) => item.level === action.level)) return state
      return updateSelection(state, action.sourceId, (selection) => ({
        ...selection,
        level: action.level,
      }))
    }

    case 'setExtraDamage':
      return { ...state, extraDamage: clamp(action.damage, 0, MAX_EXTRA_DAMAGE) }

    case 'applyCombo':
      return withCombo(state, action.combo)

    case 'load':
      return sanitizeState(action.state)

    case 'reset':
      return createInitialState()
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** Format lama (`targetPresetId`) yang mungkin masih tersimpan di localStorage pengguna. */
const LEGACY_PRESET_TARGETS: Record<string, TargetSelection> = {
  'clan-castle-11': { buildingId: 'clan-castle', level: 11 },
  'monolith-3': { buildingId: 'monolith', level: 3 },
}

function readNumber(value: unknown, fallback: number, min: number, max: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? clamp(value, min, max) : fallback
}

/** Memvalidasi state dari luar (localStorage, riwayat lama) terhadap data game terbaru. */
export function sanitizeState(raw: unknown): CalculatorState {
  const initial = createInitialState()
  if (!isRecord(raw)) return initial

  const rawSelections = isRecord(raw.selections) ? raw.selections : {}
  const earthquakeLevel = readNumber(raw.earthquakeLevel, initial.earthquakeLevel, 1, MAX_EARTHQUAKE_LEVEL)
  const target =
    isRecord(raw.target) &&
    typeof raw.target.buildingId === 'string' &&
    typeof raw.target.level === 'number'
      ? { buildingId: raw.target.buildingId, level: raw.target.level }
      : typeof raw.targetPresetId === 'string'
        ? (LEGACY_PRESET_TARGETS[raw.targetPresetId] ?? null)
        : null
  const buildingHp = target ? getBuildingHp(target) : undefined

  return {
    targetHp: buildingHp ?? readNumber(raw.targetHp, initial.targetHp, 0, MAX_TARGET_HP),
    target: buildingHp === undefined ? null : target,
    earthquakeLevel: EARTHQUAKE_LEVELS.some((item) => item.level === earthquakeLevel)
      ? earthquakeLevel
      : initial.earthquakeLevel,
    earthquakeCount: readNumber(raw.earthquakeCount, initial.earthquakeCount, 0, MAX_EARTHQUAKES),
    selections: Object.fromEntries(
      DAMAGE_SOURCES.map((source) => {
        const fallback = initial.selections[source.id]
        const selection = rawSelections[source.id]
        if (!isRecord(selection)) return [source.id, fallback]
        const level = readNumber(selection.level, fallback.level, 0, Number.MAX_SAFE_INTEGER)
        return [
          source.id,
          {
            quantity: readNumber(selection.quantity, fallback.quantity, 0, source.maxQuantity),
            level: source.levels.some((item) => item.level === level) ? level : fallback.level,
          },
        ]
      }),
    ),
    extraDamage: readNumber(raw.extraDamage, initial.extraDamage, 0, MAX_EXTRA_DAMAGE),
  }
}
