import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { fetchInteractions, selectInteractions, setMode } from './features/interactions/interactionsSlice'
import InteractionForm from './features/interactions/InteractionForm'
import InteractionChat from './features/interactions/InteractionChat'
import InteractionList from './features/interactions/InteractionList'
import AIAssistantPanel from './features/ai/AIAssistantPanel'
import { Interaction } from './types'
import './App.css'

function App() {
  const dispatch = useAppDispatch()
  const interactions = useAppSelector(selectInteractions)
  const mode = useAppSelector((state) => state.interactions.mode)
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null)
  const hasInteractions = interactions.length > 0

  useEffect(() => {
    dispatch(fetchInteractions())
  }, [dispatch])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>AI-First CRM HCP Interaction Logging</h1>
          <p>Log HCP meetings through structured data entry or conversational Chat AI.</p>
        </div>
        <div className="toggle-group">
          <button className={mode === 'form' ? 'active' : ''} onClick={() => dispatch(setMode('form'))}>
            Structured Form
          </button>
          <button className={mode === 'chat' ? 'active' : ''} onClick={() => dispatch(setMode('chat'))}>
            Conversational Chat
          </button>
        </div>
      </header>

      <main className={`main-content ${hasInteractions ? '' : 'no-sidebar'}`}>
        <section className="interaction-panel">
          {mode === 'form' ? (
            <InteractionForm />
          ) : (
            <InteractionChat selectedInteraction={selectedInteraction} />
          )}
        </section>
        {hasInteractions && (
          <aside className="sidebar">
            <InteractionList
              interactions={interactions}
              selectedId={selectedInteraction?.id}
              onSelect={setSelectedInteraction}
            />
          </aside>
        )}
        <aside className="assistant-panel">
          <AIAssistantPanel selectedInteraction={selectedInteraction} />
        </aside>
      </main>
    </div>
  )
}

export default App
