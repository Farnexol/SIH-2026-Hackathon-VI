from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db

# Import Routers
from app.api.v1.routes_auth import router as auth_router
from app.api.v1.routes_learners import router as learners_router
from app.api.v1.routes_gaps import router as gaps_router
from app.api.v1.routes_competencies import router as competencies_router
from app.api.v1.routes_courses import router as courses_router
from app.api.v1.routes_recommendations import router as recommendations_router
from app.api.v1.routes_materials import router as materials_router
from app.api.v1.routes_assessments import router as assessments_router
from app.api.v1.routes_admin import router as admin_router
from app.api.v1.routes_users import router as users_router
from app.api.v1.routes_assistant import router as assistant_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="SIH 2026 AI Engine — Complete Backend API Specification for India's Official Statistical System Platform. Integrates React Frontend with Supabase PostgreSQL, pgvector, and Gemini API.",
    version="1.0.0"
)

# CORS Middleware for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "gemini_api_configured": bool(settings.GEMINI_API_KEY)
    }

# Register API v1 Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(learners_router, prefix=settings.API_V1_STR)
app.include_router(gaps_router, prefix=settings.API_V1_STR)
app.include_router(competencies_router, prefix=settings.API_V1_STR)
app.include_router(courses_router, prefix=settings.API_V1_STR)
app.include_router(recommendations_router, prefix=settings.API_V1_STR)
app.include_router(materials_router, prefix=settings.API_V1_STR)
app.include_router(assessments_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(assistant_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
