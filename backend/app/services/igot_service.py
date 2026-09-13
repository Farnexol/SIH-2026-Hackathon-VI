import logging
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import Course, CourseCompetency, Competency

logger = logging.getLogger(__name__)

class IGOTIntegrationService:
    """
    iGOT Karmayogi Integration Service.
    Normalizes external iGOT course payloads into internal Course & CourseCompetency schema.
    """

    def fetch_and_sync_igot_courses(self, db: Session) -> List[Dict[str, Any]]:
        # Seeded/normalized iGOT Karmayogi modules
        igot_payload = [
            {
                "external_id": "IGOT-STAT-101",
                "title": "Advanced Survey Sampling & Estimation",
                "provider_name": "iGOT Karmayogi",
                "source": "igot",
                "description": "Comprehensive course on probability sampling and survey weight estimation for statistical officers.",
                "url": "https://igotkarmayogi.gov.in/courses/sampling-101",
                "duration_minutes": 240,
                "difficulty": "medium",
                "target_competency": "Sampling",
                "target_level": 4,
                "relevance_score": 95.0
            },
            {
                "external_id": "IGOT-PY-202",
                "title": "Python for Data Analysis & Statistical Operations",
                "provider_name": "iGOT Karmayogi",
                "source": "igot",
                "description": "Applied Python programming using Pandas, NumPy and Statsmodels for MoSPI data pipelines.",
                "url": "https://igotkarmayogi.gov.in/courses/python-stats",
                "duration_minutes": 300,
                "difficulty": "medium",
                "target_competency": "Python",
                "target_level": 3,
                "relevance_score": 90.0
            },
            {
                "external_id": "IGOT-SURV-303",
                "title": "Survey Methodology & Field Data Quality",
                "provider_name": "iGOT Karmayogi",
                "source": "igot",
                "description": "Best practices for field survey instrument design, data validation and field quality control.",
                "url": "https://igotkarmayogi.gov.in/courses/survey-quality",
                "duration_minutes": 180,
                "difficulty": "easy",
                "target_competency": "Survey Design",
                "target_level": 3,
                "relevance_score": 92.0
            }
        ]

        synced = []
        for item in igot_payload:
            course = db.query(Course).filter(Course.title == item["title"]).first()
            if not course:
                course = Course(
                    external_id=item["external_id"],
                    title=item["title"],
                    provider_name=item["provider_name"],
                    source=item["source"],
                    description=item["description"],
                    url=item["url"],
                    duration_minutes=item["duration_minutes"],
                    difficulty=item["difficulty"]
                )
                db.add(course)
                db.commit()
                db.refresh(course)

                comp = db.query(Competency).filter(Competency.name == item["target_competency"]).first()
                if comp:
                    cc = CourseCompetency(
                        course_id=course.id,
                        competency_id=comp.id,
                        target_level=item["target_level"],
                        relevance_score=item["relevance_score"]
                    )
                    db.add(cc)
                    db.commit()

            synced.append({"course_id": course.id, "title": course.title, "source": course.source})

        return synced

igot_service = IGOTIntegrationService()
