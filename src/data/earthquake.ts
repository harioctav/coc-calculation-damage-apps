/** Persentase damage ke bangunan. https://clashofclans.fandom.com/wiki/Earthquake_Spell */
export const EARTHQUAKE_LEVELS = [
  { level: 1, percent: 14.5 },
  { level: 2, percent: 17 },
  { level: 3, percent: 21 },
  { level: 4, percent: 25 },
  { level: 5, percent: 29 },
  { level: 6, percent: 29 },
  { level: 7, percent: 29 },
  { level: 8, percent: 29 },
] as const

export const MAX_EARTHQUAKE_LEVEL = EARTHQUAKE_LEVELS[EARTHQUAKE_LEVELS.length - 1].level
export const MAX_EARTHQUAKES = 4
export const EARTHQUAKE_ICON = '💥'
export const EARTHQUAKE_COLOR = '#d6a24e'

export function getEarthquakePercent(level: number): number {
  const entry = EARTHQUAKE_LEVELS.find((item) => item.level === level)
  return entry?.percent ?? EARTHQUAKE_LEVELS[EARTHQUAKE_LEVELS.length - 1].percent
}
