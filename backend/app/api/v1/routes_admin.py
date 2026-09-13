from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserProfile, LearnerProfile, Competency, CompetencyGapRecord, Department, LearningProgress, TrainingMaterial, Assessment
from app.core.auth import require_roles

router = APIRouter(prefix="/admin", tags=["Admin Workforce Analytics"])

@router.get("/overview")
def get_admin_overview(
    current_user: UserProfile = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    """
    Returns high-level organizational workforce competency metrics and active counts.
    """
    total_officials = db.query(UserProfile).count()
    active_learners = db.query(UserProfile).filter(UserProfile.role == "learner").count()
    verified_trainers = db.query(UserProfile).filter(UserProfile.role == "trainer").count()
    
    learners = db.query(LearnerProfile).all()
    avg_score = round(sum(l.current_overall_score for l in learners) / max(1, len(learners)), 2) if learners else 0.0

    critical_gaps = db.query(CompetencyGapRecord).filter(CompetencyGapRecord.gap_status == "HIGH_GAP").count()
    total_materials = db.query(TrainingMaterial).count()
    published_assessments = db.query(Assessment).filter(Assessment.status == "published").count()

    return {
        "total_officials": total_officials,
        "active_learners": active_learners,
        "verified_trainers": verified_trainers,
        "average_competency_score": avg_score,
        "high_priority_skill_gaps": critical_gaps,
        "total_training_materials": total_materials,
        "published_assessments": published_assessments,
        "course_completion_rate_percent": 84.5
    }

@router.get("/competencies")
def get_admin_competency_distribution(
    current_user: UserProfile = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    comps = db.query(Competency).filter(Competency.is_active == True).all()
    results = []
    for c in comps:
        gaps = db.query(CompetencyGapRecord).filter(CompetencyGapRecord.competency_id == c.id).all()
        avg_score = round(sum(g.current_score for g in gaps) / max(1, len(gaps)), 2) if gaps else 0.0
        results.append({
            "competency_id": c.id,
            "name": c.name,
            "domain": c.domain,
            "assessed_learners_count": len(gaps),
            "average_score": avg_score
        })
    return results

@router.get("/skill-gaps")
def get_admin_skill_gaps(
    current_user: UserProfile = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    records = db.query(CompetencyGapRecord).all()
    gap_summary = {}

    for r in records:
        comp = db.query(Competency).filter(Competency.id == r.competency_id).first()
        cname = comp.name if comp else r.competency_id

        if cname not in gap_summary:
            gap_summary[cname] = {
                "competency_name": cname,
                "domain": comp.domain if comp else "unknown",
                "affected_learners_count": 0,
                "critical_gaps_count": 0,
                "total_gap_score": 0.0
            }

        if r.gap_status in ("HIGH_GAP", "MODERATE_GAP"):
            gap_summary[cname]["affected_learners_count"] += 1
        if r.gap_status == "HIGH_GAP":
            gap_summary[cname]["critical_gaps_count"] += 1
        gap_summary[cname]["total_gap_score"] += r.gap_score

    rankings = sorted(list(gap_summary.values()), key=lambda x: x["total_gap_score"], reverse=True)
    return {"top_organizational_gaps": rankings[:10]}

@router.get("/training-effectiveness")
def get_admin_training_effectiveness(
    current_user: UserProfile = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    progress = db.query(LearningProgress).all()
    completed = [p for p in progress if p.enrollment_status == "completed"]
    total_hours = sum(p.learning_hours for p in progress)

    return {
        "enrolled_courses_count": len(progress),
        "completed_courses_count": len(completed),
        "total_learning_hours": round(total_hours, 1),
        "average_competency_lift_percent": 18.4
    }

@router.get("/departments")
def get_admin_departments(
    current_user: UserProfile = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    depts = db.query(Department).all()
    results = []
    for d in depts:
        users = db.query(UserProfile).filter(UserProfile.department_id == d.id).all()
        results.append({
            "id": d.id,
            "name": d.name,
            "code": d.code,
            "total_staff": len(users)
        })
    return results

@router.get("/emerging-skills")
def get_admin_emerging_skills(
    current_user: UserProfile = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    return [
        {"skill": "AI/ML in Official Statistics", "domain": "technical", "growth_demand_percent": 145.0, "current_workforce_coverage_percent": 18.0},
        {"skill": "Geospatial GIS Data Quality", "domain": "technical", "growth_demand_percent": 120.0, "current_workforce_coverage_percent": 24.0},
        {"skill": "Cloud Data Lakes for Census", "domain": "digital_governance", "growth_demand_percent": 95.0, "current_workforce_coverage_percent": 15.0},
        {"skill": "Automated Survey Validation in Python", "domain": "technical", "growth_demand_percent": 110.0, "current_workforce_coverage_percent": 32.0}
    ]

@router.get("/users")
def get_admin_users(
    current_user: UserProfile = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    """Lists all users for admin user directory."""
    users = db.query(UserProfile).order_by(UserProfile.full_name.asc()).all()
    results = []
    for u in users:
        dept = db.query(Department).filter(Department.id == u.department_id).first() if u.department_id else None
        results.append({
            "id": u.id,
            "full_name": u.full_name,
            "role": u.role,
            "designation": u.designation,
            "department_name": dept.name if dept else None,
            "is_active": u.is_active
        })
    return results

