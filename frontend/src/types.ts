export interface Interaction {
  id: number
  hcp_name: string
  interaction_type: string
  date: string
  time: string
  attendees?: string
  topics?: string
  materials_shared?: string
  samples_distributed?: string
  sentiment?: string
  outcomes?: string
  follow_up_actions?: string
  summary?: string
}
