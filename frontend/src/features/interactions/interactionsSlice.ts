import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Interaction } from '../../types'

interface InteractionsState {
  interactions: Interaction[]
  mode: 'form' | 'chat'
  status: 'idle' | 'loading' | 'failed'
  error?: string
}

const initialState: InteractionsState = {
  interactions: [],
  mode: 'form',
  status: 'idle',
}

export const fetchInteractions = createAsyncThunk('interactions/fetch', async () => {
  const response = await axios.get<Interaction[]>('http://localhost:8000/api/interactions')
  return response.data
})

export const createInteraction = createAsyncThunk('interactions/create', async (payload: Interaction) => {
  const response = await axios.post<Interaction>('http://localhost:8000/api/interactions', payload)
  return response.data
})

export const sendAgentTool = createAsyncThunk(
  'interactions/agentTool',
  async (payload: { toolName: string; text?: string; prompt?: string; interaction_id?: number; interaction_data?: any; changes?: any }) => {
    const { toolName, ...body } = payload
    const response = await axios.post(`http://localhost:8000/api/agent/tool?tool_name=${toolName}`, body)
    return response.data
  },
)

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<'form' | 'chat'>) {
      state.mode = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.status = 'idle'
        state.interactions = action.payload
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.interactions.unshift(action.payload)
      })
  },
})

export const { setMode } = interactionsSlice.actions
export const selectInteractions = (state: { interactions: InteractionsState }) => state.interactions.interactions
export default interactionsSlice.reducer
