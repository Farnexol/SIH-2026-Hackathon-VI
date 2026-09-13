from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserProfile
from app.core.auth import get_current_user
from app.services.assistant_service import assistant_service

router = APIRouter(prefix="/assistant", tags=["AI Learning Assistant & Chatbot"])

class ChatRequest(BaseModel):
    message: str
    chat_history: Optional[List[Dict[str, str]]] = None

@router.post("/chat")
def assistant_chat(
    payload: ChatRequest,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Interactive AI Learning Assistant endpoint for government officials.
    Answers statistical methodology questions, explains survey concepts, and guides capacity building.
    """
    try:
        return assistant_service.answer_user_query(
            db, user=current_user, user_query=payload.message, chat_history=payload.chat_history
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant error: {str(e)}")
