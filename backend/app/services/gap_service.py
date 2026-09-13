import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import UserProfile, LearnerProfile, Competency, RoleCompetency, LearnerCompetency, CompetencyGapRecord
from app.schemas import CompetencyGapReport, CompetencyGapItem, DomainGapSummary, GeminiAIGapInsights
from app.services.gemini_service import gemini_service
from app.config import settings

logger = logging.getLogger(__name__)

class GapCalculationEngine:
    """
    Core Competency Gap Calculation Engine.
    Executes quantitative gap scoring, domain aggregation, priority ranking,
    and Gemini AI qualitative reasoning synthesis.
    """

    def calculate_user_gaps(self, db: Session, user_id: str, include_ai_insights: bool = True) -> CompetencyGapReport:
        # 1. Fetch user and learner profile
        user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
        if not user:
            raise ValueError(f"User with ID '{user_id}' not found.")
        
        learner_profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
        designation = user.designation or "Statistical Officer"

        # 2. Fetch role competency requirements
        role_reqs = db.query(RoleCompetency).filter(RoleCompetency.designation == designation).all()
        if not role_reqs:
            # Fallback: fetch Statistical Officer requirements if user's specific designation has no mappings
            role_reqs = db.query(RoleCompetency).filter(RoleCompetency.designation == "Statistical Officer").all()

        # 3. Fetch learner's current competencies
        learner_comps = db.query(LearnerCompetency).filter(LearnerCompetency.user_id == user_id).all()
        learner_comp_map = {lc.competency_id: lc for lc in learner_comps}

        gap_items: List[CompetencyGapItem] = []
        domain_buckets: Dict[str, Dict[str, Any]] = {}
        
        total_score_sum = 0.0
        req_count = len(role_reqs) if role_reqs else 1
        high_priority_count = 0
        total_gaps_count = 0

        # 4. Perform deterministic gap calculation per role competency
        for req in role_reqs:
            comp = db.query(Competency).filter(Competency.id == req.competency_id).first()
            if not comp:
                continue

            lc = learner_comp_map.get(req.competency_id)
            current_level = lc.level if lc else 1
            current_score = lc.score if lc else 0.0

            required_level = req.required_level
            required_score = required_level * 20.0  # Scale 1-5 level to 20-100 score

            level_gap = required_level - current_level
            gap_score = max(0.0, required_score - current_score)

            # Determine gap status
            if level_gap >= 2 or gap_score >= 35.0:
                gap_status = "HIGH_GAP"
                high_priority_count += 1
                total_gaps_count += 1
            elif level_gap == 1 or gap_score > 0.0:
                gap_status = "MODERATE_GAP"
                total_gaps_count += 1
            else:
                gap_status = "MET"

            domain_weight = settings.DOMAIN_WEIGHTS.get(comp.domain, 1.0)
            priority_score = round(gap_score * req.weight * domain_weight, 2)

            gap_item = CompetencyGapItem(
                competency_id=comp.id,
                competency_name=comp.name,
                domain=comp.domain,
                required_level=required_level,
                current_level=current_level,
                required_score=required_score,
                current_score=current_score,
                gap_score=round(gap_score, 2),
                gap_status=gap_status,
                priority_score=priority_score,
                weight=req.weight
            )
            gap_items.append(gap_item)

            total_score_sum += current_score

            # Domain aggregation
            if comp.domain not in domain_buckets:
                domain_buckets[comp.domain] = {
                    "total_gap_score": 0.0,
                    "critical_count": 0,
                    "comp_count": 0
                }
            domain_buckets[comp.domain]["total_gap_score"] += gap_score
            if gap_status == "HIGH_GAP":
                domain_buckets[comp.domain]["critical_count"] += 1
            domain_buckets[comp.domain]["comp_count"] += 1

            # Persist/update gap record in database
            self._save_gap_record(db, user_id, comp.id, designation, required_level, current_level, required_score, current_score, gap_score, gap_status, priority_score)

        db.commit()

        # Sort gaps by priority_score descending
        gap_items.sort(key=lambda x: x.priority_score, reverse=True)

        overall_score = round(total_score_sum / req_count, 2)
        if learner_profile:
            learner_profile.current_overall_score = overall_score
            db.commit()

        domain_summaries: List[DomainGapSummary] = []
        for domain_name, data in domain_buckets.items():
            avg_gap = round(data["total_gap_score"] / data["comp_count"], 2) if data["comp_count"] > 0 else 0.0
            domain_summaries.append(DomainGapSummary(
                domain=domain_name,
                average_gap_score=avg_gap,
                critical_gaps_count=data["critical_count"],
                total_domain_competencies=data["comp_count"]
            ))

        # 5. Build AI Insights via Gemini API
        ai_insights: Optional[GeminiAIGapInsights] = None
        if include_ai_insights:
            learner_info = {
                "user_id": user_id,
                "full_name": user.full_name,
                "designation": designation,
                "department_name": user.department_id or "MoSPI",
                "years_experience": learner_profile.years_experience if learner_profile else 0,
                "educational_qualifications": learner_profile.educational_qualifications if learner_profile else "",
                "career_goal": learner_profile.career_goal if learner_profile else ""
            }
            gap_summary_data = {
                "overall_competency_score": overall_score,
                "total_gaps_count": total_gaps_count,
                "high_priority_gaps_count": high_priority_count,
                "gaps": [g.dict() for g in gap_items],
                "domain_summaries": [d.dict() for d in domain_summaries]
            }
            raw_ai = gemini_service.generate_gap_insights(learner_info, gap_summary_data)
            ai_insights = GeminiAIGapInsights(**raw_ai)

        return CompetencyGapReport(
            user_id=user_id,
            full_name=user.full_name,
            designation=designation,
            calculated_at=datetime.utcnow(),
            overall_competency_score=overall_score,
            total_gaps_count=total_gaps_count,
            high_priority_gaps_count=high_priority_count,
            gaps=gap_items,
            domain_summaries=domain_summaries,
            ai_insights=ai_insights
        )

    def _save_gap_record(self, db: Session, user_id: str, comp_id: str, designation: str, req_lvl: int, curr_lvl: int, req_score: float, curr_score: float, gap_score: float, gap_status: str, priority_score: float):
        existing = db.query(CompetencyGapRecord).filter(
            CompetencyGapRecord.user_id == user_id,
            CompetencyGapRecord.competency_id == comp_id
        ).first()

        if existing:
            existing.designation = designation
            existing.required_level = req_lvl
            existing.current_level = curr_lvl
            existing.required_score = req_score
            existing.current_score = curr_score
            existing.gap_score = gap_score
            existing.gap_status = gap_status
            existing.priority_score = priority_score
            existing.calculated_at = datetime.utcnow()
        else:
            rec = CompetencyGapRecord(
                user_id=user_id,
                competency_id=comp_id,
                designation=designation,
                required_level=req_lvl,
                current_level=curr_lvl,
                required_score=req_score,
                current_score=curr_score,
                gap_score=gap_score,
                gap_status=gap_status,
                priority_score=priority_score,
                calculated_at=datetime.utcnow()
            )
            db.add(rec)

gap_engine = GapCalculationEngine()
