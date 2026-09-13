from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserProfile, Recommendation, Course, Competency
from app.core.auth import get_current_user
from app.services.recommendation_service import recommendation_engine

router = APIRouter(prefix="/recommendations", tags=["Personalized Recommendations Engine"])

@router.post("/generate")
def generate_recommendations(
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Triggers Recommendation Engine to generate personalized course recommendations targeting top competency gaps.
    """
    try:
        return recommendation_engine.generate_recommendations(db, user_id=current_user.id)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation engine error: {str(e)}")

@router.get("/me")
def get_my_recommendations(
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recs = db.query(Recommendation).filter(
        Recommendation.user_id == current_user.id,
        Recommendation.is_dismissed == False
    ).order_by(Recommendation.rank.asc()).all()

    results = []
    for r in recs:
        course = db.query(Course).filter(Course.id == r.course_id).first()
        comp = db.query(Competency).filter(Competency.id == r.competency_id).first() if r.competency_id else None
        results.append({
            "id": r.id,
            "course_id": r.course_id,
            "title": course.title if course else "Course",
            "source": course.source if course else "igot",
            "provider_name": course.provider_name if course else "iGOT Karmayogi",
            "description": course.description if course else None,
            "url": course.url if course else None,
            "duration_minutes": course.duration_minutes if course else 120,
            "difficulty": course.difficulty if course else "medium",
            "competency_name": comp.name if comp else None,
            "reason": r.reason,
            "rank": r.rank,
            "score": r.score
        })
    return {"recommendations": results}

@router.post("/{recommendation_id}/dismiss")
def dismiss_recommendation(
    recommendation_id: str,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rec = db.query(Recommendation).filter(
        Recommendation.id == recommendation_id,
        Recommendation.user_id == current_user.id
    ).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    rec.is_dismissed = True
    db.commit()
    return {"message": "Recommendation dismissed"}
