from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.database import get_db, Base, engine
from app.llm_agent import LangGraphAgent

Base.metadata.create_all(bind=engine)

router = APIRouter()
agent = LangGraphAgent()

@router.post("/interactions", response_model=schemas.Interaction)
def create_interaction(interaction: schemas.InteractionCreate, db: Session = Depends(get_db)):
    return crud.create_interaction(db=db, interaction=interaction)

@router.get("/interactions", response_model=list[schemas.Interaction])
def list_interactions(db: Session = Depends(get_db)):
    return crud.get_interactions(db=db)

@router.get("/interactions/{interaction_id}", response_model=schemas.Interaction)
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    db_interaction = crud.get_interaction(db, interaction_id)
    if not db_interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return db_interaction

@router.patch("/interactions/{interaction_id}", response_model=schemas.Interaction)
def patch_interaction(interaction_id: int, changes: schemas.InteractionUpdate, db: Session = Depends(get_db)):
    updated = crud.update_interaction(db=db, interaction_id=interaction_id, changes=changes)
    if not updated:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return updated

@router.post("/agent/tool")
async def call_agent_tool(tool_name: str, request: schemas.AgentRequest, db: Session = Depends(get_db)):
    payload = request.dict(exclude_none=True)
    result = await agent.run_tool(tool_name, payload, db=db)
    return result

@router.get("/agent/tools")
def list_agent_tools():
    return {
        "tools": [
            {"name": "log_interaction", "description": "Capture and summarize HCP interaction text."},
            {"name": "edit_interaction", "description": "Modify an existing interaction record."},
            {"name": "summarize_interaction", "description": "Summarize notes and extract action items."},
            {"name": "fetch_hcp_profile", "description": "Retrieve HCP profile details for planning."},
            {"name": "generate_follow_up", "description": "Create follow-up action recommendations."},
        ]
    }
