from pydantic import BaseModel
from typing import Any, Dict, Optional

class InteractionBase(BaseModel):
    hcp_name: str
    interaction_type: str
    date: str
    time: str
    attendees: Optional[str] = None
    topics: Optional[str] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    sentiment: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    summary: Optional[str] = None

class InteractionCreate(InteractionBase):
    pass

class InteractionUpdate(BaseModel):
    attendees: Optional[str] = None
    topics: Optional[str] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    sentiment: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    summary: Optional[str] = None

class Interaction(InteractionBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class AgentRequest(BaseModel):
    text: Optional[str] = None
    prompt: Optional[str] = None
    interaction_id: Optional[int] = None
    hcp_name: Optional[str] = None
    interaction_data: Optional[Dict[str, Any]] = None
    changes: Optional[Dict[str, Any]] = None
