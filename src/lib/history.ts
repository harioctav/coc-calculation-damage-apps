import { sanitizeState } from '../state/calculatorReducer'
import type { CalculatorState, HistoryEntry } from '../types'
import { calculateDamage } from './damage'
import { getTargetName } from './describe'

export const MAX_HISTORY_ENTRIES = 30

export function createHistoryEntry(
  state: CalculatorState,
  createdAt = Date.now(),
  id: string = crypto.randomUUID(),
): HistoryEntry {
  const result = calculateDamage(state)
  return {
    id,
    createdAt,
    targetName: getTargetName(state),
    state,
    totalDamage: result.totalDamage,
    isDestroyed: result.isDestroyed,
  }
}

export function sanitizeHistory(raw: unknown): HistoryEntry[] | undefined {
  if (!Array.isArray(raw)) return undefined
  return raw
    .filter(
      (item): item is HistoryEntry =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.createdAt === 'number',
    )
    .map((item) => createHistoryEntry(sanitizeState(item.state), item.createdAt, item.id))
    .slice(0, MAX_HISTORY_ENTRIES)
}
