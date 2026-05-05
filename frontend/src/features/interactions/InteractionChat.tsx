import { useEffect, useState } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { sendAgentTool } from './interactionsSlice'
import { Interaction } from '../../types'

interface Props {
  selectedInteraction?: Interaction | null
}

function InteractionChat({ selectedInteraction }: Props) {
  const dispatch = useAppDispatch()
  const [prompt, setPrompt] = useState('Summarize the interaction and identify follow-up actions.')
  const [chatLog, setChatLog] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([])
  const [toolResult, setToolResult] = useState<string>('')
  const [toolName, setToolName] = useState('log_interaction')
  const [hcpName, setHcpName] = useState('')
  const [interactionType, setInteractionType] = useState('Meeting')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))
  const [attendees, setAttendees] = useState('')
  const [topics, setTopics] = useState('')
  const [materialsShared, setMaterialsShared] = useState('')
  const [samplesDistributed, setSamplesDistributed] = useState('')
  const [sentiment, setSentiment] = useState('Neutral')
  const [outcomes, setOutcomes] = useState('')
  const [followUpActions, setFollowUpActions] = useState('')
  const [summary, setSummary] = useState('')
  const [editId, setEditId] = useState('')
  const [changesJson, setChangesJson] = useState('')

  useEffect(() => {
    if (selectedInteraction) {
      setEditId(String(selectedInteraction.id))
      setChangesJson(
        JSON.stringify(
          {
            topics: selectedInteraction.topics || undefined,
            sentiment: selectedInteraction.sentiment || undefined,
            follow_up_actions: selectedInteraction.follow_up_actions || undefined,
          },
          null,
          2,
        ),
      )
    }
  }, [selectedInteraction])

  const interactionData = {
    hcp_name: hcpName,
    interaction_type: interactionType,
    date,
    time,
    attendees,
    topics,
    materials_shared: materialsShared,
    samples_distributed: samplesDistributed,
    sentiment,
    outcomes,
    follow_up_actions: followUpActions,
    summary,
  }

  const handleSend = async () => {
    if (!prompt.trim()) return
    setChatLog((current) => [...current, { role: 'user', text: prompt }])

    const payload: any = { toolName, text: prompt }
    if (toolName === 'log_interaction') {
      payload.interaction_data = interactionData
    }
    if (toolName === 'edit_interaction') {
      payload.interaction_id = editId ? Number(editId) : undefined
      try {
        payload.changes = changesJson ? JSON.parse(changesJson) : undefined
      } catch (error) {
        setToolResult('Error: changes JSON is invalid.')
        return
      }
    }

    const result = await dispatch(sendAgentTool(payload))
    const responsePayload = (result as any).payload
    setToolResult(JSON.stringify(responsePayload, null, 2))
    setChatLog((current) => [
      ...current,
      { role: 'assistant', text: responsePayload?.summary || responsePayload?.follow_up || responsePayload?.details || 'No response' },
    ])
    setPrompt('')
  }

  return (
    <div>
      <h2>Conversational Agent</h2>

      {selectedInteraction && (
        <div className="selected-interaction-card">
          <div className="selected-interaction-header">
            <strong>Selected Interaction</strong>
            <button className="secondary-button" type="button" onClick={() => setToolName('edit_interaction')}>
              Edit selected interaction
            </button>
          </div>
          <p>{selectedInteraction.hcp_name} — {selectedInteraction.interaction_type} on {selectedInteraction.date}</p>
          <p>{selectedInteraction.topics || 'No topics available'}</p>
        </div>
      )}

      <div className="tool-selection">
        <label>Agent Tool</label>
        <select value={toolName} onChange={(e) => setToolName(e.target.value)}>
          <option value="log_interaction">Log Interaction</option>
          <option value="edit_interaction">Edit Interaction</option>
          <option value="summarize_interaction">Summarize Interaction</option>
          <option value="fetch_hcp_profile">Fetch HCP Profile</option>
          <option value="generate_follow_up">Generate Follow-up</option>
        </select>
      </div>

      {toolName === 'log_interaction' && (
        <div className="interaction-form">
          <div className="field-group">
            <label>HCP Name</label>
            <input value={hcpName} onChange={(e) => setHcpName(e.target.value)} placeholder="Dr. Smith" />
          </div>
          <div className="row-grid">
            <div className="field-group">
              <label>Type</label>
              <select value={interactionType} onChange={(e) => setInteractionType(e.target.value)}>
                <option>Meeting</option>
                <option>Call</option>
                <option>Webinar</option>
              </select>
            </div>
            <div className="field-group">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div className="field-group">
            <label>Attendees</label>
            <input value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="field-group">
            <label>Topics</label>
            <textarea value={topics} onChange={(e) => setTopics(e.target.value)} rows={2} />
          </div>
          <div className="field-group">
            <label>Materials Shared</label>
            <input value={materialsShared} onChange={(e) => setMaterialsShared(e.target.value)} />
          </div>
          <div className="field-group">
            <label>Samples Distributed</label>
            <input value={samplesDistributed} onChange={(e) => setSamplesDistributed(e.target.value)} />
          </div>
          <div className="field-group">
            <label>Sentiment</label>
            <select value={sentiment} onChange={(e) => setSentiment(e.target.value)}>
              <option>Positive</option>
              <option>Neutral</option>
              <option>Negative</option>
            </select>
          </div>
          <div className="field-group">
            <label>Outcomes</label>
            <textarea value={outcomes} onChange={(e) => setOutcomes(e.target.value)} rows={2} />
          </div>
          <div className="field-group">
            <label>Follow-up Actions</label>
            <textarea value={followUpActions} onChange={(e) => setFollowUpActions(e.target.value)} rows={2} />
          </div>
          <div className="field-group">
            <label>Summary Context</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
          </div>
        </div>
      )}

      {toolName === 'edit_interaction' && (
        <div className="interaction-form">
          <div className="field-group">
            <label>Interaction ID</label>
            <input value={editId} onChange={(e) => setEditId(e.target.value)} placeholder="123" />
          </div>
          <div className="field-group">
            <label>Changes JSON</label>
            <textarea
              value={changesJson}
              onChange={(e) => setChangesJson(e.target.value)}
              rows={6}
              placeholder='{"topics": "Updated topic details", "sentiment": "Positive"}'
            />
          </div>
        </div>
      )}

      <div className="chat-window">
        {chatLog.length === 0 ? <p>Enter a prompt to start the AI agent flow.</p> : null}
        {chatLog.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            <strong>{message.role === 'user' ? 'You' : 'Agent'}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div className="prompt-row">
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} />
        <button className="primary-button" onClick={handleSend}>Send to Agent</button>
      </div>
      {toolResult && (
        <div className="tool-result">
          <h3>Tool Output</h3>
          <pre>{toolResult}</pre>
        </div>
      )}
    </div>
  )
}

export default InteractionChat
