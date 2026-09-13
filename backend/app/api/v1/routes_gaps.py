from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import CompetencyGapReport
from app.services.gap_service import gap_engine
from app.models import CompetencyGapRecord, UserProfile, Competency
from typing import Dict, Any, List

router = APIRouter(prefix="/gaps", tags=["Competency Gaps"])

@router.post("/calculate/{user_id}", response_model=CompetencyGapReport)
def calculate_competency_gaps(
    user_id: str,
    include_ai: bool = Query(True, description="Whether to invoke Gemini API for AI reasoning & executive summary"),
    db: Session = Depends(get_db)
):
    """
    Calculates detailed competency gaps for a given user against their role requirements.
    Combines mathematical gap scoring with Gemini AI qualitative reasoning.
    """
    try:
        report = gap_engine.calculate_user_gaps(db, user_id=user_id, include_ai_insights=include_ai)
        return report
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating competency gaps: {str(e)}")

@router.get("/user/{user_id}", response_model=CompetencyGapReport)
def get_user_gap_report(
    user_id: str,
    include_ai: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Retrieves or calculates the latest competency gap report for a learner.
    """
    try:
        return gap_engine.calculate_user_gaps(db, user_id=user_id, include_ai_insights=include_ai)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))

@router.get("/admin/workforce-summary")
def get_workforce_gap_summary(db: Session = Depends(get_db)):
    """
    Admin workforce analytics endpoint: Summarizes organizational skill gaps across all learners.
    """
    records = db.query(CompetencyGapRecord).all()
    if not records:
        return {
            "total_learners_assessed": 0,
            "top_organizational_gaps": [],
            "message": "No competency gap records calculated yet. Run gap calculations for learners first."
        }

    gap_summary: Dict[str, Dict[str, Any]] = {}
    users_set = set()

    for r in records:
        users_set.add(r.user_id)
        comp = db.query(Competency).filter(Competency.id == r.competency_id).first()
        comp_name = comp.name if comp else r.competency_id

        if comp_name not in gap_summary:
            gap_summary[comp_name] = {
                "competency_name": comp_name,
                "domain": comp.domain if comp else "unknown",
                "affected_learners_count": 0,
                "critical_gaps_count": 0,
                "total_gap_score": 0.0
            }

        if r.gap_status in ("HIGH_GAP", "MODERATE_GAP"):
            gap_summary[comp_name]["affected_learners_count"] += 1
        if r.gap_status == "HIGH_GAP":
            gap_summary[comp_name]["critical_gaps_count"] += 1
        gap_summary[comp_name]["total_gap_score"] += r.gap_score

    rankings = []
    total_users = max(1, len(users_set))
    for comp_name, data in gap_summary.items():
        data["avg_gap_score"] = round(data["total_gap_score"] / total_users, 2)
        data["workforce_gap_percentage"] = round((data["affected_learners_count"] / total_users) * 100, 1)
        rankings.append(data)

    rankings.sort(key=lambda x: x["total_gap_score"], reverse=True)

    return {
        "total_learners_assessed": total_users,
        "top_organizational_gaps": rankings[:10]
    }
