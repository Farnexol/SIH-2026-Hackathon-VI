import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "SIH 2026 AI Engine - Competency Gap Calculation Engine"
    API_V1_STR: str = "/api/v1"
    
    # Gemini API Credentials
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL_NAME: str = os.getenv("GEMINI_MODEL_NAME", "gemini-2.0-flash")
    
    # Database Settings (Connected to Supabase PostgreSQL)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres.byjycsclsddggluqkqta:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
    )
    
    # Domain Weights for Priority Calculation
    DOMAIN_WEIGHTS: dict = {
        "statistical": 1.2,
        "technical": 1.1,
        "digital_governance": 1.0,
        "behavioural_managerial": 0.9
    }

settings = Settings()
