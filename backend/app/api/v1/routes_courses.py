from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db
from app.models import Course, CourseCompetency, Competency

router = APIRouter(prefix="/courses", tags=["Courses Catalogue"])

class CourseCreateSchema(BaseModel):
    title: str
    source: str # igot, internal
    provider_name: Optional[str] = "iGOT Karmayogi"
    description: Optional[str] = None
    url: Optional[str] = None
    duration_minutes: Optional[int] = 120
    difficulty: Optional[str] = "medium"

@router.get("")
def list_courses(
    source: Optional[str] = Query(None, description="Filter by learning source (igot, internal)"),
    difficulty: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Course).filter(Course.is_active == True)
    if source:
        query = query.filter(Course.source == source)
    if difficulty:
        query = query.filter(Course.difficulty == difficulty)
    return query.all()

@router.get("/{course_id}")
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    comp_mappings = db.query(CourseCompetency).filter(CourseCompetency.course_id == course_id).all()
    mapped_comps = []
    for cm in comp_mappings:
        comp = db.query(Competency).filter(Competency.id == cm.competency_id).first()
        mapped_comps.append({
            "competency_id": cm.competency_id,
            "competency_name": comp.name if comp else cm.competency_id,
            "target_level": cm.target_level,
            "relevance_score": cm.relevance_score
        })

    return {
        "course": course,
        "mapped_competencies": mapped_comps
    }

@router.post("/sync/igot")
def sync_igot_catalogue(db: Session = Depends(get_db)):
    """
    Syncs/populates official starter iGOT Karmayogi statistics and governance courses.
    """
    igot_courses = [
        ("Advanced Survey Sampling & Estimation", "igot", "iGOT Karmayogi", "Comprehensive course on probability sampling and survey weight estimation for statistical officers.", "https://igotkarmayogi.gov.in/courses/sampling-101", 240, "medium", "Sampling"),
        ("Python for Data Analysis & Statistical Operations", "igot", "iGOT Karmayogi", "Applied Python programming using Pandas, NumPy and Statsmodels for MoSPI data pipelines.", "https://igotkarmayogi.gov.in/courses/python-stats", 300, "medium", "Python"),
        ("National Accounts Statistics & GDP Compilation", "igot", "iGOT Karmayogi", "In-depth course on System of National Accounts (SNA 2008) and GVA compilation methodologies.", "https://igotkarmayogi.gov.in/courses/national-accounts", 360, "hard", "National Accounts"),
        ("Survey Methodology & Field Data Quality", "igot", "iGOT Karmayogi", "Best practices for field survey instrument design, data validation and field quality control.", "https://igotkarmayogi.gov.in/courses/survey-quality", 180, "easy", "Survey Design"),
        ("Data Quality Frameworks in Official Statistics", "igot", "iGOT Karmayogi", "Frameworks and standard operating procedures for verifying data quality in large-scale sample surveys.", "https://igotkarmayogi.gov.in/courses/dq-framework", 200, "medium", "Data Quality Frameworks")
    ]

    synced_count = 0
    for title, source, provider, desc, url, duration, diff, comp_name in igot_courses:
        existing = db.query(Course).filter(Course.title == title).first()
        if not existing:
            c = Course(
                title=title,
                source=source,
                provider_name=provider,
                description=desc,
                url=url,
                duration_minutes=duration,
                difficulty=diff
            )
            db.add(c)
            db.commit()
            db.refresh(c)
            synced_count += 1

            # Map to competency
            comp = db.query(Competency).filter(Competency.name == comp_name).first()
            if comp:
                cc = CourseCompetency(
                    course_id=c.id,
                    competency_id=comp.id,
                    target_level=4,
                    relevance_score=95.0
                )
                db.add(cc)
                db.commit()

    return {"message": f"Successfully synced {synced_count} iGOT Karmayogi courses into catalogue"}
