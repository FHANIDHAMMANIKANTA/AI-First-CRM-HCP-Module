# AI-First-CRM-HCP-Module

This repository contains a full-stack sample for an AI-first CRM HCP module featuring:

- React + Redux frontend for structured interaction logging and conversational chat mode
- Python FastAPI backend with SQLAlchemy for interaction persistence
- LangGraph-inspired AI agent tooling for `log_interaction`, `edit_interaction`, `summarize_interaction`, `fetch_hcp_profile`, and `generate_follow_up`
- Groq LLM integration placeholder with `gemma2-9b-it` model support

## Project Structure

- `frontend/` - React app and Redux store
- `backend/` - FastAPI backend, database models, agent tools
- `.gitignore` - ignore node_modules, Python caches, env files

## Install and Run

### Backend

1. Create a Python environment

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

2. Configure `.env`

Set `GROQ_API_KEY` if you want to enable real summarization via Groq. Set `DATABASE_URL` to a Postgres URL like `postgresql://user:password@localhost:5432/ai_crm` for production-style use.

3. Run database migrations

```bash
alembic upgrade head
```

4. Start the backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

1. Install dependencies

```bash
cd frontend
npm install
```

2. Start the frontend

```bash
npm run dev
```

3. Open the app at http://localhost:5173

## LangGraph Agent Tools

The backend includes a conceptual `LangGraphAgent` with tools:

- `log_interaction`: Captures interaction text, summarizes it, and extracts entities
- `edit_interaction`: Modifies previously logged interaction fields
- `summarize_interaction`: Creates an AI summary for a text record
- `fetch_hcp_profile`: Returns HCP profile details for planning
- `generate_follow_up`: Suggests follow-up actions based on interaction text

## Notes

- The UI supports both structured form logging and conversational chat where agents can summarize notes or generate follow-up tasks.
- The backend uses SQLite by default. You can switch to a Postgres or MySQL URL in `.env`.
- Alembic migration support is included under `backend/alembic/` so schema changes can be applied cleanly.
- The frontend uses Google Inter font and Redux Toolkit for state management.
