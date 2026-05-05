from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///./test.db"
    groq_api_key: str = ""
    groq_model: str = "gemma2-9b-it"
    llama_model: str = "llama-3.3-70b-versatile"

    class Config:
        env_file = ".env"

settings = Settings()
