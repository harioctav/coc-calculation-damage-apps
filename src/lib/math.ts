export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0)
}
