from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models import UserProfile, LearnerProfile, Competency, LearnerCompetency, CompetencyAssessment, Department
from app.schemas import MockUserCreate, LearnerCompetencyInput

class CompetencyService:

    def create_user_profile(self, db: Session, user_data: MockUserCreate) -> UserProfile:
        # Check department
        dept = None
        if user_data.department_name:
            dept = db.query(Department).filter(Department.name == user_data.department_name).first()
            if not dept:
                unique_code = "".join(e for e in user_data.department_name if e.isalnum())[:10].upper()
                dept = Department(name=user_data.department_name, code=unique_code)
                db.add(dept)
                db.commit()
                db.refresh(dept)

        # Create User Profile
        user = UserProfile(
            full_name=user_data.full_name,
            role="learner",
            department_id=dept.id if dept else None,
            designation=user_data.designation,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create Learner Profile
        learner = LearnerProfile(
            user_id=user.id,
            educational_qualifications=user_data.educational_qualifications,
            years_experience=user_data.years_experience,
            career_goal=user_data.career_goal,
            current_overall_score=0.0
        )
        db.add(learner)

        # Populate Initial Competencies only if explicitly supplied in payload
        if user_data.initial_competencies:
            for item in user_data.initial_competencies:
                comp = db.query(Competency).filter(Competency.name == item.competency_name).first()
                if comp:
                    lc = LearnerCompetency(
                        user_id=user.id,
                        competency_id=comp.id,
                        level=item.level,
                        score=item.score,
                        confidence=item.confidence,
                        evidence_source=item.evidence_source,
                        last_assessed_at=datetime.utcnow()
                    )
                    db.add(lc)

        db.commit()
        db.refresh(user)
        return user

    def update_learner_competency(self, db: Session, user_id: str, comp_id: str, new_score: float, level: int, evidence_source: str = "Assessment"):
        lc = db.query(LearnerCompetency).filter(
            LearnerCompetency.user_id == user_id,
            LearnerCompetency.competency_id == comp_id
        ).first()

        if lc:
            lc.score = new_score
            lc.level = level
            lc.evidence_source = evidence_source
            lc.last_assessed_at = datetime.utcnow()
        else:
            lc = LearnerCompetency(
                user_id=user_id,
                competency_id=comp_id,
                level=level,
                score=new_score,
                evidence_source=evidence_source,
                last_assessed_at=datetime.utcnow()
            )
            db.add(lc)

        # Log historical assessment evidence
        ca = CompetencyAssessment(
            user_id=user_id,
            competency_id=comp_id,
            score=new_score,
            level=level,
            assessed_at=datetime.utcnow(),
            metadata_json={"source": evidence_source}
        )
        db.add(ca)
        db.commit()

competency_service = CompetencyService()
