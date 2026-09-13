from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas import CompetencyOut
from app.models import Competency, RoleCompetency, LearnerCompetency
from app.services.competency_service import competency_service
from app.core.auth import get_current_user

router = APIRouter(prefix="/competencies", tags=["Competencies Framework"])

@router.get("", response_model=List[CompetencyOut])
def list_competencies(
    domain: Optional[str] = Query(None, description="Filter by domain"),
    db: Session = Depends(get_db)
):
    query = db.query(Competency).filter(Competency.is_active == True)
    if domain:
        query = query.filter(Competency.domain == domain)
    return query.all()

@router.get("/{competency_id}", response_model=CompetencyOut)
def get_competency_by_id(competency_id: str, db: Session = Depends(get_db)):
    comp = db.query(Competency).filter(Competency.id == competency_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Competency not found")
    return comp

@router.post("/assess")
def record_competency_assessment(
    user_id: str,
    competency_id: str,
    score: float,
    level: int,
    evidence_source: str = "Assessment Attempt",
    db: Session = Depends(get_db)
):
    comp = db.query(Competency).filter(Competency.id == competency_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Competency not found")

    competency_service.update_learner_competency(
        db, user_id=user_id, comp_id=competency_id, new_score=score, level=level, evidence_source=evidence_source
    )
    return {
        "message": f"Successfully updated competency '{comp.name}'",
        "user_id": user_id,
        "competency_name": comp.name,
        "new_score": score,
        "new_level": level
    }

@router.get("/roles/{designation}")
def get_role_competency_requirements(designation: str, db: Session = Depends(get_db)):
    reqs = db.query(RoleCompetency).filter(RoleCompetency.designation.ilike(f"%{designation}%")).all()
    results = []
    for r in reqs:
        comp = db.query(Competency).filter(Competency.id == r.competency_id).first()
        results.append({
            "id": r.id,
            "designation": r.designation,
            "competency_id": r.competency_id,
            "competency_name": comp.name if comp else r.competency_id,
            "domain": comp.domain if comp else "unknown",
            "required_level": r.required_level,
            "weight": r.weight
        })
    return results
