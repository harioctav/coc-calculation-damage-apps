const numberFormatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatDate(timestamp: number): string {
  return dateFormatter.format(timestamp)
}
