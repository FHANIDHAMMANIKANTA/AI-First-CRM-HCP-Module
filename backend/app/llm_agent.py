import os
from typing import Dict, Any
import httpx
from app.config import settings
from app import crud, schemas


class LLMClient:
    def __init__(self):
        self.api_key = settings.groq_api_key
        self.model = settings.groq_model
        self.endpoint = "https://api.groq.com/openai/v1/chat/completions"

    async def summarize_text(self, text: str) -> str:
        if not self.api_key or self.api_key == "your_groq_api_key_here":
            return f"[Demo Response] Summarized: {text[:200]}... Please configure GROQ_API_KEY in .env to enable real AI summaries."

        try:
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that summarizes HCP interactions concisely."},
                    {"role": "user", "content": text}
                ],
                "temperature": 0.2,
                "max_tokens": 256,
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.endpoint,
                    json=payload,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                )
                response.raise_for_status()
                data = response.json()
                return data.get("choices", [{}])[0].get("message", {}).get("content", "[no response from AI]")
        except Exception as e:
            return f"[AI Error] {str(e)}"

    async def extract_entities(self, text: str) -> Dict[str, Any]:
        return {"key_topics": [topic.strip() for topic in text.split(",")[:5]]}


class LangGraphAgent:
    def __init__(self):
        self.llm = LLMClient()
        self.tools = {
            "log_interaction": self.log_interaction,
            "edit_interaction": self.edit_interaction,
            "summarize_interaction": self.summarize_interaction,
            "fetch_hcp_profile": self.fetch_hcp_profile,
            "generate_follow_up": self.generate_follow_up,
        }

    async def run_tool(self, tool_name: str, payload: Dict[str, Any], db=None):
        tool = self.tools.get(tool_name)
        if not tool:
            return {"error": "Tool not found"}
        return await tool(payload, db=db)

    async def log_interaction(self, payload: Dict[str, Any], db=None):
        text = payload.get("text", "")
        summary = await self.llm.summarize_text(text)
        entities = await self.llm.extract_entities(text)
        created = None

        if db is not None and payload.get("interaction_data"):
            interaction_data = payload["interaction_data"]
            created = crud.create_interaction(db, schemas.InteractionCreate(**interaction_data))

        return {
            "tool": "log_interaction",
            "summary": summary,
            "entities": entities,
            "created_interaction_id": getattr(created, "id", None),
            "raw": text,
        }

    async def edit_interaction(self, payload: Dict[str, Any], db=None):
        interaction_id = payload.get("interaction_id")
        changes = payload.get("changes")
        updated = None

        if db is not None and interaction_id and changes:
            updated = crud.update_interaction(db, interaction_id, schemas.InteractionUpdate(**changes))

        return {
            "tool": "edit_interaction",
            "details": "Use this tool to update recorded HCP interaction fields and preserve audit context.",
            "updated_interaction_id": getattr(updated, "id", None),
            "updated_fields": list(changes.keys()) if changes else [],
            "input": payload,
        }

    async def summarize_interaction(self, payload: Dict[str, Any]):
        text = payload.get("text", "")
        summary = await self.llm.summarize_text(text)
        return {"tool": "summarize_interaction", "summary": summary}

    async def fetch_hcp_profile(self, payload: Dict[str, Any]):
        hcp_name = payload.get("hcp_name")
        return {"tool": "fetch_hcp_profile", "profile": {"name": hcp_name, "specialty": "Oncology", "tier": "A"}}

    async def generate_follow_up(self, payload: Dict[str, Any]):
        text = payload.get("text", "")
        return {"tool": "generate_follow_up", "follow_up": f"Recommend scheduling a follow-up within 2 weeks based on interaction summary: {text[:120]}"}
