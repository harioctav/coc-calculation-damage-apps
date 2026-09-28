import { Analytics } from '@vercel/analytics/react'
import { useMemo } from 'react'
import { ComboSuggestions } from './components/ComboSuggestions'
import { DamageSourcesPanel } from './components/DamageSourcesPanel'
import { EarthquakePanel } from './components/EarthquakePanel'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HistoryPanel } from './components/HistoryPanel'
import { MobileResultBar } from './components/MobileResultBar'
import { ResultPanel } from './components/ResultPanel'
import { TargetPanel } from './components/TargetPanel'
import { useCalculator } from './hooks/useCalculator'
import { useHistory } from './hooks/useHistory'
import { findCombos } from './lib/damage'
import { getTargetName } from './lib/describe'

export default function App() {
  const { state, result, actions } = useCalculator()
  const history = useHistory()
  const suggestions = useMemo(() => findCombos(state), [state])

  return (
    <div className="min-h-dvh pb-28 lg:pb-12">
      <Header />

      <main className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-6">
          <TargetPanel
            hp={state.targetHp}
            target={state.target}
            onHpChange={actions.setTargetHp}
            onBuildingSelect={actions.selectBuilding}
            onLevelSelect={actions.setBuildingLevel}
          />
          <EarthquakePanel
            targetHp={state.targetHp}
            level={state.earthquakeLevel}
            count={state.earthquakeCount}
            hits={result.earthquakeHits}
            onLevelChange={actions.setEarthquakeLevel}
            onCountChange={actions.setEarthquakeCount}
          />
          <DamageSourcesPanel
            selections={state.selections}
            extraDamage={state.extraDamage}
            onQuantityChange={actions.setSourceQuantity}
            onLevelChange={actions.setSourceLevel}
            onExtraDamageChange={actions.setExtraDamage}
          />
        </div>

        <aside id="hasil" className="scroll-mt-6 lg:sticky lg:top-6 lg:self-start">
          <ResultPanel
            targetName={getTargetName(state)}
            targetHp={state.targetHp}
            result={result}
            onSave={() => history.addEntry(state)}
            onReset={actions.reset}
          />
        </aside>

        <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
          <ComboSuggestions state={state} suggestions={suggestions} onApply={actions.applyCombo} />
          <HistoryPanel
            entries={history.entries}
            onRestore={actions.load}
            onRemove={history.removeEntry}
            onClear={history.clearEntries}
          />
        </div>
      </main>

      <Footer />

      <MobileResultBar targetHp={state.targetHp} result={result} />
      <Analytics />
    </div>
  )
}
