import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL

# If user hasn't replaced the placeholder password, fallback gracefully to SQLite for local development
if "[YOUR-PASSWORD]" in db_url or "YOUR_PASSWORD" in db_url:
    logger.warning("DATABASE_URL contains placeholder password. Falling back to local SQLite: sqlite:///./sih_skill_platform.db")
    db_url = "sqlite:///./sih_skill_platform.db"

connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

try:
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True
    )
    # Test connection
    with engine.connect() as conn:
        pass
except Exception as e:
    logger.warning(f"Failed to connect to primary DATABASE_URL ({e}). Falling back to local SQLite database: sqlite:///./sih_skill_platform.db")
    db_url = "sqlite:///./sih_skill_platform.db"
    engine = create_engine(
        db_url,
        connect_args={"check_same_thread": False},
        pool_pre_ping=True
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    global engine, SessionLocal
    from app import models
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized/verified.")
    except Exception as e:
        logger.warning(f"Note on DB schema verification ({e}). Continuing with configured engine.")
