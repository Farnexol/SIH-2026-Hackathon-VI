from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserProfile, Assessment, Question, QuestionOption, AssessmentAttempt, AttemptAnswer, Competency, TrainingMaterial
from app.core.auth import get_current_user, require_roles
from app.services.assessment_service import assessment_service

router = APIRouter(tags=["Assessments & MCQ Generation"])

class AssessmentGenerateRequest(BaseModel):
    title: str
    assessment_type: str = "mock_test" # mcq, quiz, mock_test
    competency_id: Optional[str] = None
    source_material_id: Optional[str] = None
    material_id: Optional[str] = None
    question_count: int = 5
    difficulty: str = "medium"

class SubmitAttemptRequest(BaseModel):
    answers: Dict[str, str] # question_id -> option_id or option_key
    user_id: Optional[str] = None  # Accepted but ignored — actual user comes from JWT

@router.post("/assessments/generate")
def generate_assessment(
    payload: AssessmentGenerateRequest,
    current_user: UserProfile = Depends(require_roles(["trainer", "admin"])),
    db: Session = Depends(get_db)
):
    """
    Trainer endpoint: Generates draft AI MCQs / Quiz using RAG pgvector retrieval + Gemini LLM.
    Human-in-the-loop: Assessment is created in 'draft' status until reviewed & published by trainer.
    """
    try:
        resolved_material_id = payload.source_material_id or payload.material_id
        return assessment_service.generate_rag_assessment(
            db,
            creator_id=current_user.id,
            title=payload.title,
            material_id=resolved_material_id,
            competency_id=payload.competency_id,
            question_count=payload.question_count,
            difficulty=payload.difficulty,
            assessment_type=payload.assessment_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate RAG assessment: {str(e)}")

class QuestionOptionUpdate(BaseModel):
    id: Optional[str] = None
    option_key: str
    option_text: str
    is_correct: bool = False

class QuestionUpdateRequest(BaseModel):
    question_text: str
    explanation: Optional[str] = None
    options: List[QuestionOptionUpdate]
    is_trainer_approved: bool = True

class VerifyQuestionRequest(BaseModel):
    is_approved: bool = True

class CreateQuestionRequest(BaseModel):
    question_text: str
    explanation: Optional[str] = None
    options: List[QuestionOptionUpdate]
    difficulty: str = "medium"

@router.get("/assessments")
def list_assessments(
    status: Optional[str] = Query(None),
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Assessment)
    if current_user.role == "learner":
        query = query.filter(Assessment.status == "published")
    elif status:
        query = query.filter(Assessment.status == status)
    return query.order_by(Assessment.created_at.desc()).all()

@router.get("/assessments/{assessment_id}")
def get_assessment(assessment_id: str, db: Session = Depends(get_db)):
    asm = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not asm:
        raise HTTPException(status_code=404, detail="Assessment not found")

    questions = db.query(Question).filter(Question.assessment_id == assessment_id).order_by(Question.question_order.asc()).all()
    q_results = []
    for q in questions:
        opts = db.query(QuestionOption).filter(QuestionOption.question_id == q.id).order_by(QuestionOption.option_key.asc()).all()
        q_results.append({
            "id": q.id,
            "question_order": q.question_order,
            "question_text": q.question_text,
            "explanation": q.explanation,
            "is_trainer_approved": bool(q.is_trainer_approved),
            "is_ai_generated": bool(q.is_ai_generated),
            "options": [{"id": o.id, "option_key": o.option_key, "option_text": o.option_text, "is_correct": bool(o.is_correct)} for o in opts]
        })

    return {
        "assessment": asm,
        "questions": q_results
    }

@router.post("/assessments/{assessment_id}/questions/{question_id}/verify")
def verify_question(
    assessment_id: str,
    question_id: str,
    payload: Optional[VerifyQuestionRequest] = None,
    current_user: UserProfile = Depends(require_roles(["trainer", "admin"])),
    db: Session = Depends(get_db)
):
    q = db.query(Question).filter(Question.id == question_id, Question.assessment_id == assessment_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    q.is_trainer_approved = payload.is_approved if payload else True
    db.commit()
    return {"message": "Question verification status updated", "question_id": q.id, "is_trainer_approved": q.is_trainer_approved}

@router.put("/assessments/{assessment_id}/questions/{question_id}")
def update_assessment_question(
    assessment_id: str,
    question_id: str,
    payload: QuestionUpdateRequest,
    current_user: UserProfile = Depends(require_roles(["trainer", "admin"])),
    db: Session = Depends(get_db)
):
    import uuid
    q = db.query(Question).filter(Question.id == question_id, Question.assessment_id == assessment_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    q.question_text = payload.question_text
    if payload.explanation is not None:
        q.explanation = payload.explanation
    q.is_trainer_approved = payload.is_trainer_approved

    for opt_data in payload.options:
        if opt_data.id:
            opt = db.query(QuestionOption).filter(QuestionOption.id == opt_data.id).first()
            if opt:
                opt.option_text = opt_data.option_text
                opt.option_key = opt_data.option_key
                opt.is_correct = opt_data.is_correct
        else:
            new_opt = QuestionOption(
                id=str(uuid.uuid4()),
                question_id=q.id,
                option_key=opt_data.option_key,
                option_text=opt_data.option_text,
                is_correct=opt_data.is_correct
            )
            db.add(new_opt)

    db.commit()
    return {"message": "Question and options updated successfully", "question_id": q.id, "is_trainer_approved": q.is_trainer_approved}

@router.delete("/assessments/{assessment_id}/questions/{question_id}")
def delete_assessment_question(
    assessment_id: str,
    question_id: str,
    current_user: UserProfile = Depends(require_roles(["trainer", "admin"])),
    db: Session = Depends(get_db)
):
    q = db.query(Question).filter(Question.id == question_id, Question.assessment_id == assessment_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(q)

    asm = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if asm:
        asm.question_count = max(0, db.query(Question).filter(Question.assessment_id == assessment_id).count())
    db.commit()
    return {"message": "Question discarded successfully", "question_id": question_id}

@router.post("/assessments/{assessment_id}/questions")
def add_assessment_question(
    assessment_id: str,
    payload: CreateQuestionRequest,
    current_user: UserProfile = Depends(require_roles(["trainer", "admin"])),
    db: Session = Depends(get_db)
):
    import uuid
    asm = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not asm:
        raise HTTPException(status_code=404, detail="Assessment not found")

    order = db.query(Question).filter(Question.assessment_id == assessment_id).count() + 1
    q = Question(
        id=str(uuid.uuid4()),
        assessment_id=assessment_id,
        question_text=payload.question_text,
        question_order=order,
        explanation=payload.explanation,
        difficulty=payload.difficulty,
        is_ai_generated=False,
        is_trainer_approved=True
    )
    db.add(q)
    db.flush()

    for opt in payload.options:
        qo = QuestionOption(
            id=str(uuid.uuid4()),
            question_id=q.id,
            option_key=opt.option_key,
            option_text=opt.option_text,
            is_correct=opt.is_correct
        )
        db.add(qo)

    asm.question_count = order
    db.commit()
    return {"message": "Question added and verified", "question_id": q.id}

@router.post("/assessments/{assessment_id}/publish")
def publish_assessment(
    assessment_id: str,
    current_user: UserProfile = Depends(require_roles(["trainer", "admin"])),
    db: Session = Depends(get_db)
):
    asm = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not asm:
        raise HTTPException(status_code=404, detail="Assessment not found")
    asm.status = "published"
    # Approve all questions when publishing
    db.query(Question).filter(Question.assessment_id == assessment_id).update({"is_trainer_approved": True})
    db.commit()
    return {"message": "Assessment published successfully. Learners can now attempt it."}

class StartAttemptRequest(BaseModel):
    user_id: Optional[str] = None  # Accepted but ignored — actual user comes from JWT

@router.post("/assessments/{assessment_id}/attempts")
def start_assessment_attempt(
    assessment_id: str,
    payload: Optional[StartAttemptRequest] = None,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    asm = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not asm:
        raise HTTPException(status_code=404, detail="Assessment not found")

    questions = db.query(Question).filter(Question.assessment_id == assessment_id).all()

    attempt = AssessmentAttempt(
        assessment_id=assessment_id,
        user_id=current_user.id,
        started_at=datetime.utcnow(),
        total_questions=len(questions)
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return {
        "attempt_id": attempt.id,
        "assessment_id": assessment_id,
        "title": asm.title,
        "started_at": attempt.started_at
    }

@router.post("/attempts/{attempt_id}/submit")
def submit_attempt(
    attempt_id: str,
    payload: SubmitAttemptRequest,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits answers, scores the attempt, and updates learner competency state in database!
    """
    try:
        return assessment_service.evaluate_attempt(db, attempt_id=attempt_id, answers=payload.answers, user_id=current_user.id)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating attempt: {str(e)}")

@router.get("/attempts/{attempt_id}")
def get_attempt_result(attempt_id: str, db: Session = Depends(get_db)):
    attempt = db.query(AssessmentAttempt).filter(AssessmentAttempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    asm = db.query(Assessment).filter(Assessment.id == attempt.assessment_id).first()

    return {
        "attempt_id": attempt.id,
        "assessment_title": asm.title if asm else "Assessment",
        "score": attempt.score,
        "correct_count": attempt.correct_count,
        "total_questions": attempt.total_questions,
        "submitted_at": attempt.submitted_at
    }
