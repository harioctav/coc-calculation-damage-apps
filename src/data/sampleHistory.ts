import { createHistoryEntry } from '../lib/history'
import { createInitialState } from '../state/calculatorReducer'
import type { CalculatorState, HistoryEntry } from '../types'

function scenario(overrides: Partial<CalculatorState>, rocketBackpackLevel: number): CalculatorState {
  const initial = createInitialState()
  return {
    ...initial,
    ...overrides,
    selections: {
      ...initial.selections,
      'giant-arrow': { quantity: 1, level: 18 },
      'rocket-backpack': { quantity: 1, level: rocketBackpackLevel },
    },
  }
}

/** Contoh riwayat yang ditampilkan saat pengguna pertama kali membuka aplikasi. */
export function createSampleHistory(now = Date.now()): HistoryEntry[] {
  return [
    createHistoryEntry(
      scenario(
        { targetHp: 5400, target: { buildingId: 'clan-castle', level: 11 }, earthquakeCount: 2 },
        27,
      ),
      now,
      'sample-clan-castle',
    ),
    createHistoryEntry(
      scenario(
        { targetHp: 5353, target: { buildingId: 'monolith', level: 3 }, earthquakeCount: 2 },
        27,
      ),
      now - 1,
      'sample-monolith',
    ),
    createHistoryEntry(
      scenario({ targetHp: 5900, target: null, earthquakeCount: 3 }, 24),
      now - 2,
      'sample-5900',
    ),
  ]
}
