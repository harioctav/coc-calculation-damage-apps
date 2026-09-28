export type SourceCategory = 'spell' | 'equipment'

export interface LevelDamage {
  level: number
  damage: number
}

export interface DamageSource {
  id: string
  name: string
  category: SourceCategory
  icon: string
  color: string
  /** Berapa kali sumber damage ini bisa dipakai dalam satu serangan. */
  maxQuantity: number
  /** Diurutkan dari level terendah ke tertinggi. */
  levels: LevelDamage[]
}

export interface LevelHitpoints {
  level: number
  hp: number
  /** Nomor Supercharge; level-nya tetap diberi nomor lanjutan agar unik. */
  supercharge?: number
}

export interface TargetBuilding {
  id: string
  name: string
  icon: string
  defaultLevel: number
  /** Diurutkan dari level terendah ke tertinggi. */
  levels: LevelHitpoints[]
}

export interface TargetSelection {
  buildingId: string
  level: number
}

export interface SourceSelection {
  quantity: number
  level: number
}

export interface CalculatorState {
  targetHp: number
  /** `null` berarti hitpoint diisi manual (target custom). */
  target: TargetSelection | null
  earthquakeLevel: number
  earthquakeCount: number
  selections: Record<string, SourceSelection>
  extraDamage: number
}

export interface Combo {
  earthquakeCount: number
  quantities: Record<string, number>
}

export interface HistoryEntry {
  id: string
  createdAt: number
  targetName: string
  state: CalculatorState
  totalDamage: number
  isDestroyed: boolean
}
