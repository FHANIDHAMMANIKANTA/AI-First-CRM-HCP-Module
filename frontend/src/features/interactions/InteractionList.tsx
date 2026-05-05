import { Interaction } from '../../types'

interface Props {
  interactions: Interaction[]
  selectedId?: number
  onSelect?: (interaction: Interaction) => void
}

function InteractionList({ interactions, selectedId, onSelect }: Props) {
  if (interactions.length === 0) {
    return null
  }

  return (
    <div className="interaction-list">
      <h2>Recent Interactions</h2>
      <ul>
        {interactions.map((item) => (
          <li
            key={item.id}
            className={item.id === selectedId ? 'selected' : ''}
            onClick={() => onSelect?.(item)}
          >
            <strong>{item.hcp_name}</strong>
            <p>{item.interaction_type} on {item.date} @ {item.time}</p>
            <p>{item.summary || item.topics || 'No summary available'}</p>
            <small>Click to load in chat for edit</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default InteractionList
