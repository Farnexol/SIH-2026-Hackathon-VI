import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models import UserProfile, LearnerProfile
from app.services.retrieval_service import retrieval_service
from app.services.llm_service import llm_service

logger = logging.getLogger(__name__)

class AssistantService:
    """
    AI Learning Assistant Service for official statistical system query answering & tutoring.
    Combines RAG context retrieval from MoSPI handbooks with Gemini API reasoning.
    """

    def answer_user_query(
        self,
        db: Session,
        user: UserProfile,
        user_query: str,
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:

        # 1. RAG Vector Search for relevant official guidelines/handbooks
        context_chunks = retrieval_service.retrieve_relevant_chunks(db, query_text=user_query, top_k=4)
        
        context_str = "\n\n".join([
            f"[Source: Page {c.get('page_number', 1)} - {c.get('section_title', 'Handbook')}]:\n{c.get('content')}"
            for c in context_chunks
        ]) if context_chunks else "Official MoSPI statistical survey guidelines and competency framework."

        history_str = ""
        if chat_history:
            history_str = "\n".join([f"{h.get('sender', 'User')}: {h.get('text', '')}" for h in chat_history[-4:]])

        prompt = f"""You are the AI Learning Assistant for India's Official Statistical System (MoSPI / NSSTA / iGOT Karmayogi).
Answer the official's question clearly, concisely, and authoritatively in Markdown.

User Information:
- Name: {user.full_name}
- Role: {user.role}
- Designation: {user.designation or 'Statistical Officer'}

Recent Chat History:
{history_str}

Retrieved Official Context:
{context_str}

User Question:
{user_query}
"""
        # Call Gemini API
        raw = llm_service._call_gemini_http_rest(prompt, {"full_name": user.full_name, "designation": user.designation})
        answer_text = raw.get("executive_summary") if isinstance(raw, dict) else "I can assist you with statistical survey sampling, national accounts, and iGOT learning modules."

        return {
            "query": user_query,
            "response": answer_text,
            "retrieved_context_sources": [
                {"section": c.get("section_title"), "page": c.get("page_number")}
                for c in context_chunks
            ]
        }

assistant_service = AssistantService()
