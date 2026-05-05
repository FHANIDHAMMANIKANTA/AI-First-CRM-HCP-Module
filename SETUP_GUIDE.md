# AI-First CRM HCP Module - Setup & Diagnostic Guide

## ✅ Current Status

The full-stack application is now **ready to run**. Here's what's been implemented:

### Frontend (React + Redux)
- ✅ Structured form for logging HCP interactions
- ✅ Conversational chat mode
- ✅ AI Assistant panel on the right side
- ✅ Sidebar showing recent interactions (when available)
- ✅ Selected interaction auto-loads in AI assistant
- ✅ Error handling with retry buttons
- ✅ Three-column responsive layout

### Backend (FastAPI + Python)
- ✅ Database models (Interactions table)
- ✅ CRUD operations for interactions
- ✅ LangGraph-style AI agent with 5 tools:
  - `log_interaction`
  - `edit_interaction`
  - `summarize_interaction`
  - `fetch_hcp_profile`
  - `generate_follow_up`
- ✅ Corrected Groq API integration (chat completions format)
- ✅ Demo response fallback when no API key is configured
- ✅ Database migrations with Alembic

## 🚀 How to Run

### 1. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### 2. Configure Backend (.env)
```
DATABASE_URL=sqlite:///./test.db
GROQ_API_KEY=your_actual_groq_api_key_here
GROQ_MODEL=gemma2-9b-it
LLAMA_MODEL=llama-3.3-70b-versatile
```

**To get a real API key:**
1. Go to https://console.groq.com
2. Sign up / log in
3. Create an API key
4. Replace `your_actual_groq_api_key_here` with your key

### 3. Start Backend
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will run at `http://localhost:8000`

### 4. Frontend Setup (in another terminal)
```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`

## 🧪 Testing the AI

### Without GROQ_API_KEY (Demo Mode)
- AI Assistant will return demo responses like:
  - `[Demo Response] Summarized: ... Please configure GROQ_API_KEY in .env to enable real AI summaries.`
- This allows testing the UI without a real API key

### With GROQ_API_KEY (Real AI Mode)
- Configure your actual Groq API key in `.env`
- Restart the backend: `uvicorn app.main:app --reload`
- AI will return real summaries from the `gemma2-9b-it` model

## 📋 Feature Checklist

### Logging Interactions
1. Click "Structured Form" button
2. Fill in HCP Name, Date, Time, Topics, etc.
3. Click "Log Interaction"
4. Interaction appears in sidebar and database

### Chat Mode
1. Click "Conversational Chat" button
2. Use the chat interface to log interactions
3. Select a tool from the dropdown (log, edit, summarize, etc.)
4. Results appear on screen

### AI Assistant
1. Type or select interaction text in the "Matter" field
2. Click "Ask AI"
3. Response appears below
4. If error: Click "Retry" for fallback attempt

### Recent Interactions
- Shows after you log your first interaction
- Click an interaction to select it
- Selected interaction auto-fills the AI assistant input
- Switch to chat mode and click "Edit selected interaction" button

## 🐛 Troubleshooting

### AI Assistant Not Responding
**Solution:** Check if the backend is running on `http://localhost:8000`. If not, see error in terminal.

### "Connection Error" in AI Panel
**Possible causes:**
1. Backend not running → Start it with `uvicorn app.main:app --reload`
2. Wrong port → Ensure frontend talks to `http://localhost:8000` (see `interactionsSlice.ts`)
3. CORS issue → Backend has CORS enabled for all origins

### No Interactions Appearing
**Solution:** Log one first! The sidebar only appears after your first interaction is created.

### Demo Response Instead of Real AI
**Solution:** Set `GROQ_API_KEY` in `.env` and restart backend.

## 📁 Project Structure
```
/backend
  /app
    main.py          ← FastAPI app
    llm_agent.py     ← LangGraph agent & Groq API client
    models.py        ← Database models
    schemas.py       ← Pydantic request/response schemas
    crud.py          ← Database operations
    /routers
      interactions.py ← API endpoints

/frontend
  /src
    App.tsx          ← Main app layout
    /features
      /interactions  ← Interaction components
      /ai            ← AI Assistant panel
    /app
      store.ts       ← Redux store
      hooks.ts       ← Redux hooks
```

## 🔧 Database

### SQLite (Default)
- File: `backend/test.db`
- No setup needed, auto-created on first run

### PostgreSQL (Production)
- Update `DATABASE_URL` in `.env`:
  ```
  DATABASE_URL=postgresql://user:password@localhost:5432/ai_crm
  ```
- Run migrations: `cd backend && alembic upgrade head`

## ✨ Next Enhancements
- Real Groq/LLaMA API integration
- User authentication
- HCP database lookup
- Voice note support
- Export interaction reports
- Advanced filtering in sidebar
