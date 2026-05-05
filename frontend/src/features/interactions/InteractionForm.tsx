import { useState, FormEvent } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { createInteraction } from './interactionsSlice'
import { Interaction } from '../../types'

const defaultValues: Interaction = {
  id: 0,
  hcp_name: '',
  interaction_type: 'Meeting',
  date: new Date().toISOString().slice(0, 10),
  time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  attendees: '',
  topics: '',
  materials_shared: '',
  samples_distributed: '',
  sentiment: 'Neutral',
  outcomes: '',
  follow_up_actions: '',
  summary: '',
}

function InteractionForm() {
  const dispatch = useAppDispatch()
  const [form, setForm] = useState(defaultValues)
  const [notice, setNotice] = useState('')

  const handleChange = (field: keyof Interaction, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = { ...form }
    await dispatch(createInteraction(payload))
    setNotice('Logged successfully. Use conversational mode to summarize or extract follow-up actions.')
    setForm(defaultValues)
  }

  return (
    <div>
      <h2>Structured Interaction Log</h2>
      <form className="interaction-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label>HCP Name</label>
          <input value={form.hcp_name} onChange={(e) => handleChange('hcp_name', e.target.value)} required />
        </div>
        <div className="field-group">
          <label>Type</label>
          <select value={form.interaction_type} onChange={(e) => handleChange('interaction_type', e.target.value)}>
            <option>Meeting</option>
            <option>Call</option>
            <option>Webinar</option>
          </select>
        </div>
        <div className="row-grid">
          <div className="field-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} required />
          </div>
          <div className="field-group">
            <label>Time</label>
            <input type="time" value={form.time} onChange={(e) => handleChange('time', e.target.value)} required />
          </div>
        </div>
        <div className="field-group">
          <label>Attendees</label>
          <input value={form.attendees} onChange={(e) => handleChange('attendees', e.target.value)} />
        </div>
        <div className="field-group">
          <label>Topics Discussed</label>
          <textarea value={form.topics} onChange={(e) => handleChange('topics', e.target.value)} rows={3} />
        </div>
        <div className="field-group">
          <label>Materials Shared</label>
          <input value={form.materials_shared} onChange={(e) => handleChange('materials_shared', e.target.value)} />
        </div>
        <div className="field-group">
          <label>Samples Distributed</label>
          <input value={form.samples_distributed} onChange={(e) => handleChange('samples_distributed', e.target.value)} />
        </div>
        <div className="field-group">
          <label>Sentiment</label>
          <select value={form.sentiment} onChange={(e) => handleChange('sentiment', e.target.value)}>
            <option>Positive</option>
            <option>Neutral</option>
            <option>Negative</option>
          </select>
        </div>
        <div className="field-group">
          <label>Outcomes</label>
          <textarea value={form.outcomes} onChange={(e) => handleChange('outcomes', e.target.value)} rows={3} />
        </div>
        <div className="field-group">
          <label>Follow-up Actions</label>
          <textarea value={form.follow_up_actions} onChange={(e) => handleChange('follow_up_actions', e.target.value)} rows={3} />
        </div>
        <button type="submit" className="primary-button">Log Interaction</button>
      </form>
      {notice && <div className="form-notice">{notice}</div>}
    </div>
  )
}

export default InteractionForm
