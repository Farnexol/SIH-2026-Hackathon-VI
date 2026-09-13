from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.database import get_db
from app.models import UserProfile, LearnerProfile, LearnerCompetency, Competency, CompetencyAssessment, Recommendation, Course, LearningProgress
from app.core.auth import get_current_user
from app.services.gap_service import gap_engine

router = APIRouter(prefix="/learners", tags=["Learner Operations"])

class LearnerUpdateSchema(BaseModel):
    full_name: Optional[str] = None
    designation: Optional[str] = None
    educational_qualifications: Optional[str] = None
    years_experience: Optional[float] = None
    career_goal: Optional[str] = None

@router.get("/me")
def get_learner_me(current_user: UserProfile = Depends(get_current_user), db: Session = Depends(get_db)):
    learner = db.query(LearnerProfile).filter(LearnerProfile.user_id == current_user.id).first()
    return {
        "user_id": current_user.id,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "designation": current_user.designation,
        "educational_qualifications": learner.educational_qualifications if learner else None,
        "years_experience": learner.years_experience if learner else 0.0,
        "career_goal": learner.career_goal if learner else None,
        "current_overall_score": learner.current_overall_score if learner else 0.0
    }

@router.put("/me")
def update_learner_me(
    payload: LearnerUpdateSchema,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.full_name:
        current_user.full_name = payload.full_name
    if payload.designation:
        current_user.designation = payload.designation
    
    learner = db.query(LearnerProfile).filter(LearnerProfile.user_id == current_user.id).first()
    if not learner:
        learner = LearnerProfile(user_id=current_user.id)
        db.add(learner)

    if payload.educational_qualifications is not None:
        learner.educational_qualifications = payload.educational_qualifications
    if payload.years_experience is not None:
        learner.years_experience = payload.years_experience
    if payload.career_goal is not None:
        learner.career_goal = payload.career_goal

    db.commit()
    return {"message": "Learner profile updated successfully"}

@router.get("/me/competencies")
def get_learner_competencies(current_user: UserProfile = Depends(get_current_user), db: Session = Depends(get_db)):
    comps = db.query(LearnerCompetency).filter(LearnerCompetency.user_id == current_user.id).all()
    results = []
    for lc in comps:
        comp = db.query(Competency).filter(Competency.id == lc.competency_id).first()
        results.append({
            "competency_id": lc.competency_id,
            "competency_name": comp.name if comp else lc.competency_id,
            "domain": comp.domain if comp else "unknown",
            "level": lc.level,
            "score": lc.score,
            "confidence": lc.confidence,
            "evidence_source": lc.evidence_source,
            "last_assessed_at": lc.last_assessed_at
        })
    return results

@router.get("/me/gaps")
def get_learner_gaps(current_user: UserProfile = Depends(get_current_user), db: Session = Depends(get_db)):
    return gap_engine.calculate_user_gaps(db, user_id=current_user.id, include_ai_insights=True)

@router.get("/me/recommendations")
def get_learner_recommendations(current_user: UserProfile = Depends(get_current_user), db: Session = Depends(get_db)):
    recs = db.query(Recommendation).filter(
        Recommendation.user_id == current_user.id,
        Recommendation.is_dismissed == False
    ).order_by(Recommendation.rank.asc()).all()

    results = []
    for r in recs:
        course = db.query(Course).filter(Course.id == r.course_id).first()
        comp = db.query(Competency).filter(Competency.id == r.competency_id).first() if r.competency_id else None
        results.append({
            "recommendation_id": r.id,
            "course_id": r.course_id,
            "course_title": course.title if course else "Course",
            "source": course.source if course else "igot",
            "provider_name": course.provider_name if course else "iGOT Karmayogi",
            "competency_name": comp.name if comp else None,
            "reason": r.reason,
            "rank": r.rank,
            "score": r.score
        })
    return results

@router.get("/me/progress")
def get_learner_progress(current_user: UserProfile = Depends(get_current_user), db: Session = Depends(get_db)):
    progress_list = db.query(LearningProgress).filter(LearningProgress.user_id == current_user.id).all()
    results = []
    for p in progress_list:
        course = db.query(Course).filter(Course.id == p.course_id).first()
        results.append({
            "progress_id": p.id,
            "course_id": p.course_id,
            "course_title": course.title if course else "Course",
            "enrollment_status": p.enrollment_status,
            "progress_percent": p.progress_percent,
            "learning_hours": p.learning_hours,
            "started_at": p.started_at,
            "completed_at": p.completed_at
        })
    return results

@router.get("/me/assessments")
def get_learner_assessments(current_user: UserProfile = Depends(get_current_user), db: Session = Depends(get_db)):
    assessments = db.query(CompetencyAssessment).filter(CompetencyAssessment.user_id == current_user.id).order_by(CompetencyAssessment.assessed_at.desc()).all()
    results = []
    for ca in assessments:
        comp = db.query(Competency).filter(Competency.id == ca.competency_id).first()
        results.append({
            "id": ca.id,
            "competency_name": comp.name if comp else ca.competency_id,
            "score": ca.score,
            "level": ca.level,
            "assessed_at": ca.assessed_at,
            "source": ca.metadata_json.get("source", "Assessment") if ca.metadata_json else "Assessment"
        })
    return results
