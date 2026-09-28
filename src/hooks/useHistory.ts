import { useCallback, useEffect, useState } from 'react'
import { createSampleHistory } from '../data/sampleHistory'
import { MAX_HISTORY_ENTRIES, createHistoryEntry, sanitizeHistory } from '../lib/history'
import { readStorage, writeStorage } from '../lib/storage'
import type { CalculatorState, HistoryEntry } from '../types'

const STORAGE_KEY = 'coc-calc:history:v1'

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(
    () => sanitizeHistory(readStorage(STORAGE_KEY)) ?? createSampleHistory(),
  )

  useEffect(() => {
    writeStorage(STORAGE_KEY, entries)
  }, [entries])

  const addEntry = useCallback((state: CalculatorState) => {
    setEntries((current) => [createHistoryEntry(state), ...current].slice(0, MAX_HISTORY_ENTRIES))
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id))
  }, [])

  const clearEntries = useCallback(() => setEntries([]), [])

  return { entries, addEntry, removeEntry, clearEntries }
}
