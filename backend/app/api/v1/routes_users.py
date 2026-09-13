from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import MockUserCreate, LearnerProfileOut
from app.services.competency_service import competency_service
from app.models import UserProfile, LearnerProfile, Department

router = APIRouter(prefix="/users", tags=["Users & Learner Profiles"])

@router.post("", response_model=LearnerProfileOut)
def create_learner_profile(
    user_data: MockUserCreate,
    db: Session = Depends(get_db)
):
    """
    Creates a new user and learner profile in Supabase.
    """
    try:
        user = competency_service.create_user_profile(db, user_data)
        dept = db.query(Department).filter(Department.id == user.department_id).first()
        learner = db.query(LearnerProfile).filter(LearnerProfile.user_id == user.id).first()

        return LearnerProfileOut(
            user_id=user.id,
            full_name=user.full_name,
            role=user.role,
            designation=user.designation or "Statistical Officer",
            department_name=dept.name if dept else None,
            years_experience=learner.years_experience if learner else None,
            current_overall_score=learner.current_overall_score if learner else 0.0
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user profile: {str(e)}")

@router.get("/{user_id}", response_model=LearnerProfileOut)
def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    dept = db.query(Department).filter(Department.id == user.department_id).first()
    learner = db.query(LearnerProfile).filter(LearnerProfile.user_id == user.id).first()

    return LearnerProfileOut(
        user_id=user.id,
        full_name=user.full_name,
        role=user.role,
        designation=user.designation or "Statistical Officer",
        department_name=dept.name if dept else None,
        years_experience=learner.years_experience if learner else None,
        current_overall_score=learner.current_overall_score if learner else 0.0
    )
