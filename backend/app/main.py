from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import interactions

app = FastAPI(title="AI-First CRM HCP Module Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interactions.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
