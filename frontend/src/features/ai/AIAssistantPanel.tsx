import { useEffect, useState } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { sendAgentTool } from '../interactions/interactionsSlice'
import { Interaction } from '../../types'

interface Props {
  selectedInteraction?: Interaction | null
}

function AIAssistantPanel({ selectedInteraction }: Props) {
  const dispatch = useAppDispatch()
  const [matter, setMatter] = useState('')
  const [result, setResult] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  useEffect(() => {
    if (!selectedInteraction) return

    const sourceText =
      selectedInteraction.summary?.trim() ||
      selectedInteraction.topics?.trim() ||
      selectedInteraction.outcomes?.trim() ||
      selectedInteraction.follow_up_actions?.trim() ||
      `${selectedInteraction.hcp_name} ${selectedInteraction.interaction_type} on ${selectedInteraction.date} at ${selectedInteraction.time}`

    setMatter(`Review this selected interaction:\n${sourceText}`)
  }, [selectedInteraction])

  const handleAsk = async (promptToUse?: string) => {
    const prompt = promptToUse ?? matter
    if (!prompt.trim()) return
    setStatus('loading')

    try {
      setErrorMessage('')
      const response = await dispatch(sendAgentTool({ toolName: 'summarize_interaction', text: prompt }))
      if ((response as any).meta?.requestStatus === 'fulfilled') {
        const payload = (response as any).payload
        setResult(payload?.summary || payload?.follow_up || payload?.details || 'No response from AI')
        setErrorMessage('')
      } else {
        const errorText = (response as any).error?.message || 'AI tool request failed'
        setErrorMessage(errorText)
        setResult('')
      }
    } catch (error) {
      setErrorMessage(`AI request error: ${String(error)}`)
      setResult('')
    }

    setStatus('idle')
  }

  const handleRetry = async () => {
    if (!matter.trim()) return
    const fallbackPrompt = `Shortly summarize this interaction and list the key follow-up actions:\n${matter}`
    setErrorMessage('Retrying with a shorter fallback prompt...')
    await handleAsk(fallbackPrompt)
  }

  return (
    <div className="assistant-panel-inner">
      <div className="assistant-header">
        <h2>AI Assistant</h2>
        <p>Enter matter to get AI-driven summarization and guidance.</p>
      </div>
      <div className="field-group">
        <label>Matter</label>
        <textarea value={matter} onChange={(e) => setMatter(e.target.value)} rows={6} placeholder="Type your notes, topic, or interaction matter here..." />
      </div>
      <button className="primary-button" type="button" onClick={handleAsk} disabled={status === 'loading'}>
        {status === 'loading' ? 'Thinking...' : 'Ask AI'}
      </button>
      {errorMessage && (
        <div className="assistant-error">
          <div className="assistant-error-header">
            <h3>Connection Error</h3>
            <button className="secondary-button" type="button" onClick={handleRetry} disabled={status === 'loading'}>
              Retry
            </button>
          </div>
          <p>{errorMessage}</p>
        </div>
      )}
      {result && (
        <div className="assistant-output">
          <h3>AI Response</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}

export default AIAssistantPanel
