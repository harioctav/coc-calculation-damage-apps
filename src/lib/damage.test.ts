import { describe, expect, it } from 'vitest'
import { createSampleHistory } from '../data/sampleHistory'
import { calculatorReducer, createInitialState, sanitizeState } from '../state/calculatorReducer'
import type { CalculatorState } from '../types'
import { DAMAGE_SOURCES } from '../data/damageSources'
import { getEarthquakePercent } from '../data/earthquake'
import {
  calculateDamage,
  findCombos,
  getEarthquakeHits,
  getLevelDamage,
  withCombo,
} from './damage'
import { describeLoadout, getTargetName } from './describe'

function buildState(overrides: Partial<CalculatorState> = {}): CalculatorState {
  const initial = createInitialState()
  return { ...initial, ...overrides, selections: { ...initial.selections, ...overrides.selections } }
}

describe('getEarthquakeHits', () => {
  it('gempa ke-2, 3, 4 memberi 1/3, 1/5, 1/7 dari damage gempa pertama', () => {
    const [first, second, third, fourth] = getEarthquakeHits(4800, 29, 4)
    expect(first).toBe(1392)
    expect(second).toBe(464)
    expect(third).toBeCloseTo(278.4)
    expect(fourth).toBeCloseTo(1392 / 7)
  })

  it('HP 6300 hancur dengan 3 gempa + Giant Arrow & Rocket Backpack level max (hasil lapangan)', () => {
    const result = calculateDamage(
      buildState({ targetHp: 6300, target: null, earthquakeCount: 3 }),
    )
    expect(result.totalDamage).toBeCloseTo(6451.4)
    expect(result.isDestroyed).toBe(true)
  })

  it.each([
    [1, 14.5],
    [4, 25],
    [5, 29],
    [8, 29],
  ])('Earthquake Lv. %i = %d%% hitpoint', (level, percent) => {
    expect(getEarthquakePercent(level)).toBe(percent)
  })

  it('mengembalikan array kosong jika tidak ada gempa', () => {
    expect(getEarthquakeHits(4800, 29, 0)).toEqual([])
  })
})

describe('calculateDamage', () => {
  it('menjumlahkan gempa dan sumber damage lain', () => {
    const state = buildState({
      targetHp: 4800,
      earthquakeCount: 2,
      selections: {
        'giant-arrow': { quantity: 0, level: 18 },
        'rocket-backpack': { quantity: 0, level: 27 },
      },
      extraDamage: 3400,
    })
    const result = calculateDamage(state)
    expect(result.totalDamage).toBe(5256)
    expect(result.isDestroyed).toBe(true)
    expect(result.overkill).toBe(456)
  })

  it('menghitung sisa HP jika belum hancur', () => {
    const state = buildState({
      targetHp: 10000,
      earthquakeCount: 0,
      selections: { 'giant-arrow': { quantity: 1, level: 18 } },
    })
    const result = calculateDamage(state)
    expect(result.isDestroyed).toBe(false)
    expect(result.remainingHp).toBe(10000 - 1500 - 2150)
  })

  it.each(createSampleHistory().map((entry) => [entry.targetName, entry.state] as const))(
    'riwayat "%s" hancur',
    (_, state) => {
      expect(calculateDamage(state).isDestroyed).toBe(true)
    },
  )
})

describe('getLevelDamage', () => {
  const giantArrow = DAMAGE_SOURCES.find((source) => source.id === 'giant-arrow')!

  it.each([
    [1, 750],
    [12, 1200],
    [18, 1500],
  ])('Giant Arrow Lv. %i = %i damage', (level, damage) => {
    expect(getLevelDamage(giantArrow, level)).toBe(damage)
  })

  const rocketBackpack = DAMAGE_SOURCES.find((source) => source.id === 'rocket-backpack')!

  it.each([
    [1, 575],
    [15, 1500],
    [24, 2050],
    [27, 2150],
  ])('Rocket Backpack Lv. %i = %i damage', (level, damage) => {
    expect(getLevelDamage(rocketBackpack, level)).toBe(damage)
  })

  const lightning = DAMAGE_SOURCES.find((source) => source.id === 'lightning')!

  it.each([
    [1, 150],
    [11, 640],
    [13, 720],
  ])('Lightning Spell Lv. %i = %i damage', (level, damage) => {
    expect(getLevelDamage(lightning, level)).toBe(damage)
  })

  const fireball = DAMAGE_SOURCES.find((source) => source.id === 'fireball')!

  it.each([
    [1, 1500],
    [14, 2750],
    [27, 4100],
  ])('Fireball Lv. %i = %i damage', (level, damage) => {
    expect(getLevelDamage(fireball, level)).toBe(damage)
  })
})

describe('findCombos', () => {
  it('hanya mengembalikan kombinasi minimal yang menghancurkan target', () => {
    const state = createInitialState()
    const suggestions = findCombos(state)

    expect(suggestions.length).toBeGreaterThan(0)
    for (const { combo, result } of suggestions) {
      expect(result.isDestroyed).toBe(true)
      expect(calculateDamage(withCombo(state, combo)).isDestroyed).toBe(true)
    }
  })

  it('mengembalikan array kosong untuk target tanpa hitpoint', () => {
    expect(findCombos(buildState({ targetHp: 0 }))).toEqual([])
  })
})

describe('describeLoadout', () => {
  it('mendeskripsikan kombinasi seperti catatan manual', () => {
    const state = buildState({
      earthquakeCount: 3,
      selections: {
        'giant-arrow': { quantity: 1, level: 18 },
        'rocket-backpack': { quantity: 1, level: 24 },
      },
    })
    expect(describeLoadout(state)).toBe(
      '3x Gempa (Lv. 8) + Giant Arrow (Lv. 18) + Rocket Backpack (Lv. 24)',
    )
  })
})

describe('calculatorReducer', () => {
  it('membatasi jumlah sumber damage sesuai maxQuantity', () => {
    const state = calculatorReducer(createInitialState(), {
      type: 'setSourceQuantity',
      sourceId: 'giant-arrow',
      quantity: 5,
    })
    expect(state.selections['giant-arrow'].quantity).toBe(1)
  })

  it('mengabaikan level yang tidak tersedia', () => {
    const initial = createInitialState()
    const state = calculatorReducer(initial, {
      type: 'setSourceLevel',
      sourceId: 'rocket-backpack',
      level: 99,
    })
    expect(state).toBe(initial)
  })

  it('memilih level bangunan mengisi hitpoint sesuai tabel', () => {
    const state = calculatorReducer(createInitialState(), { type: 'setBuildingLevel', level: 14 })
    expect(state.target).toEqual({ buildingId: 'clan-castle', level: 14 })
    expect(state.targetHp).toBe(6000)
  })

  it('mendukung level Supercharge pada Revenge Tower', () => {
    const tower = calculatorReducer(createInitialState(), {
      type: 'selectBuilding',
      buildingId: 'revenge-tower',
    })
    expect(tower.targetHp).toBe(6200)

    const supercharged = calculatorReducer(tower, { type: 'setBuildingLevel', level: 4 })
    expect(supercharged.targetHp).toBe(6300)
    expect(getTargetName(supercharged)).toBe('Revenge Tower Lv. 2 + Supercharge 2')
  })

  it('mendukung semua level Monolith termasuk Supercharge', () => {
    const monolith = calculatorReducer(createInitialState(), {
      type: 'selectBuilding',
      buildingId: 'monolith',
    })
    expect(monolith.targetHp).toBe(5353)

    const supercharged = calculatorReducer(monolith, { type: 'setBuildingLevel', level: 7 })
    expect(supercharged.targetHp).toBe(6161)
    expect(getTargetName(supercharged)).toBe('Monolith Lv. 5 + Supercharge 2')
  })

  it('memilih Eagle Artillery memakai level default dan tabel hitpoint-nya', () => {
    const eagle = calculatorReducer(createInitialState(), {
      type: 'selectBuilding',
      buildingId: 'eagle-artillery',
    })
    expect(eagle.target).toEqual({ buildingId: 'eagle-artillery', level: 7 })
    expect(eagle.targetHp).toBe(6200)
    expect(calculatorReducer(eagle, { type: 'setBuildingLevel', level: 4 }).targetHp).toBe(5200)
  })

  it('mengubah hitpoint manual menjadikan target custom', () => {
    const state = calculatorReducer(createInitialState(), { type: 'setTargetHp', hp: 5900 })
    expect(state.target).toBeNull()
    expect(state.targetHp).toBe(5900)
  })

  it('sanitizeState mengambil hitpoint dari tabel bangunan', () => {
    expect(
      sanitizeState({ target: { buildingId: 'clan-castle', level: 9 }, targetHp: 1 }),
    ).toMatchObject({ targetHp: 4800 })
    expect(sanitizeState({ target: { buildingId: 'clan-castle', level: 99 } }).target).toBeNull()
    expect(sanitizeState({ targetPresetId: 'monolith-3' }).target).toEqual({
      buildingId: 'monolith',
      level: 3,
    })
  })

  it('sanitizeState memulihkan data rusak ke nilai default', () => {
    expect(sanitizeState('rusak')).toEqual(createInitialState())
    expect(sanitizeState({ targetHp: -50, earthquakeCount: 99 })).toMatchObject({
      targetHp: 0,
      earthquakeCount: 4,
    })
  })
})
