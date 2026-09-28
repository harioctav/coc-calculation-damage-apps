import type { LevelHitpoints, TargetBuilding, TargetSelection } from '../types'

/** Untuk menambah bangunan atau level baru cukup tambahkan entri di sini. */
export const TARGET_BUILDINGS: TargetBuilding[] = [
  {
    id: 'clan-castle',
    name: 'Clan Castle',
    icon: '🏰',
    defaultLevel: 11,
    // https://clashofclans.fandom.com/wiki/Clan_Castle
    levels: [
      { level: 1, hp: 600 },
      { level: 2, hp: 1200 },
      { level: 3, hp: 1800 },
      { level: 4, hp: 2600 },
      { level: 5, hp: 3000 },
      { level: 6, hp: 3400 },
      { level: 7, hp: 4000 },
      { level: 8, hp: 4400 },
      { level: 9, hp: 4800 },
      { level: 10, hp: 5200 },
      { level: 11, hp: 5400 },
      { level: 12, hp: 5600 },
      { level: 13, hp: 5800 },
      { level: 14, hp: 6000 },
    ],
  },
  {
    id: 'monolith',
    name: 'Monolith',
    icon: '🗿',
    defaultLevel: 3,
    // https://clashofclans.fandom.com/wiki/Monolith
    levels: [
      { level: 1, hp: 4747 },
      { level: 2, hp: 5050 },
      { level: 3, hp: 5353 },
      { level: 4, hp: 5656 },
      { level: 5, hp: 5959 },
      { level: 6, hp: 5959, supercharge: 1 },
      { level: 7, hp: 6161, supercharge: 2 },
    ],
  },
  {
    id: 'eagle-artillery',
    name: 'Eagle Artillery',
    icon: '🦅',
    defaultLevel: 7,
    // https://clashofclans.fandom.com/wiki/Eagle_Artillery
    levels: [
      { level: 1, hp: 4000 },
      { level: 2, hp: 4400 },
      { level: 3, hp: 4800 },
      { level: 4, hp: 5200 },
      { level: 5, hp: 5600 },
      { level: 6, hp: 5900 },
      { level: 7, hp: 6200 },
    ],
  },
  {
    id: 'revenge-tower',
    name: 'Revenge Tower',
    icon: '🗼',
    defaultLevel: 2,
    // https://clashofclans.fandom.com/wiki/Revenge_Tower
    levels: [
      { level: 1, hp: 5800 },
      { level: 2, hp: 6200 },
      { level: 3, hp: 6200, supercharge: 1 },
      { level: 4, hp: 6300, supercharge: 2 },
    ],
  },
]

export function findBuilding(id: string): TargetBuilding | undefined {
  return TARGET_BUILDINGS.find((building) => building.id === id)
}

function findLevel(building: TargetBuilding, level: number): LevelHitpoints | undefined {
  return building.levels.find((item) => item.level === level)
}

/** Label pendek untuk tombol level, mis. "11" atau "⚡1". */
export function getShortLevelLabel(entry: LevelHitpoints): string {
  return entry.supercharge ? `⚡${entry.supercharge}` : String(entry.level)
}

/** Label lengkap, mis. "Lv. 11" atau "Lv. 2 + Supercharge 1". */
export function getLevelLabel(building: TargetBuilding, level: number): string {
  const entry = findLevel(building, level)
  if (!entry?.supercharge) return `Lv. ${level}`
  const baseLevel = Math.max(
    ...building.levels.filter((item) => !item.supercharge).map((item) => item.level),
  )
  return `Lv. ${baseLevel} + Supercharge ${entry.supercharge}`
}

export function getBuildingHp(target: TargetSelection): number | undefined {
  const building = findBuilding(target.buildingId)
  return building ? findLevel(building, target.level)?.hp : undefined
}
