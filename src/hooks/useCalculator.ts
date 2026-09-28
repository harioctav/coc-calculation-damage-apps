import { useEffect, useMemo, useReducer } from 'react'
import { calculateDamage } from '../lib/damage'
import { readStorage, writeStorage } from '../lib/storage'
import { calculatorReducer, sanitizeState } from '../state/calculatorReducer'
import type { CalculatorState, Combo } from '../types'

const STORAGE_KEY = 'coc-calc:calculator:v1'

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, undefined, () =>
    sanitizeState(readStorage(STORAGE_KEY)),
  )

  useEffect(() => {
    writeStorage(STORAGE_KEY, state)
  }, [state])

  const result = useMemo(() => calculateDamage(state), [state])

  const actions = useMemo(
    () => ({
      setTargetHp: (hp: number) => dispatch({ type: 'setTargetHp', hp }),
      selectBuilding: (buildingId: string) => dispatch({ type: 'selectBuilding', buildingId }),
      setBuildingLevel: (level: number) => dispatch({ type: 'setBuildingLevel', level }),
      setEarthquakeLevel: (level: number) => dispatch({ type: 'setEarthquakeLevel', level }),
      setEarthquakeCount: (count: number) => dispatch({ type: 'setEarthquakeCount', count }),
      setSourceQuantity: (sourceId: string, quantity: number) =>
        dispatch({ type: 'setSourceQuantity', sourceId, quantity }),
      setSourceLevel: (sourceId: string, level: number) =>
        dispatch({ type: 'setSourceLevel', sourceId, level }),
      setExtraDamage: (damage: number) => dispatch({ type: 'setExtraDamage', damage }),
      applyCombo: (combo: Combo) => dispatch({ type: 'applyCombo', combo }),
      load: (loaded: CalculatorState) => dispatch({ type: 'load', state: loaded }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [],
  )

  return { state, result, actions }
}

export type CalculatorActions = ReturnType<typeof useCalculator>['actions']
