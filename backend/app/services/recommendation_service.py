import os
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import UserProfile, LearnerProfile, Course, CourseCompetency, Competency, Recommendation, LearningProgress
from app.services.gap_service import gap_engine
from app.services.gemini_service import gemini_service
from app.config import settings

logger = logging.getLogger(__name__)

class RecommendationEngine:
    """
    SIH 2026 Personalized Recommendation Engine Service.
    Combines learner competency gaps, job role requirements, course competency mappings,
    and Gemini AI qualitative reasoning to generate personalized learning paths.
    """

    def generate_recommendations(self, db: Session, user_id: str, max_recs: int = 5) -> Dict[str, Any]:
        # 1. Fetch user and learner profile
        user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
        if not user:
            raise ValueError(f"User with ID '{user_id}' not found.")
        
        learner = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
        designation = user.designation or "Statistical Officer"

        # 2. Run Gap Calculation Engine to get current gaps
        gap_report = gap_engine.calculate_user_gaps(db, user_id=user_id, include_ai_insights=False)
        
        # Filter active gaps (HIGH_GAP or MODERATE_GAP)
        top_gaps = [g for g in gap_report.gaps if g.gap_status in ("HIGH_GAP", "MODERATE_GAP")]
        if not top_gaps:
            return {
                "message": "Learner currently meets all competency requirements for their role.",
                "user_id": user_id,
                "recommendations": []
            }

        # 3. Fetch completed course IDs to exclude
        completed_course_ids = set(
            lp.course_id for lp in db.query(LearningProgress).filter(
                LearningProgress.user_id == user_id,
                LearningProgress.enrollment_status == "completed"
            ).all()
        )

        # 4. Find candidate courses mapped to top gap competencies
        candidate_items = []
        seen_course_ids = set()

        for gap in top_gaps:
            # Query courses mapped to this competency via course_competencies
            course_mappings = db.query(CourseCompetency).filter(CourseCompetency.competency_id == gap.competency_id).all()
            
            for cm in course_mappings:
                if cm.course_id in completed_course_ids or cm.course_id in seen_course_ids:
                    continue

                course = db.query(Course).filter(Course.id == cm.course_id, Course.is_active == True).first()
                if not course:
                    continue

                # Mathematical Ranking Formula:
                # Score = Gap Priority Score * (Relevance / 100) * Level Alignment
                relevance = cm.relevance_score or 80.0
                target_lvl = cm.target_level or 3
                
                # Level alignment factor
                lvl_diff = abs(target_lvl - gap.required_level)
                alignment_factor = 1.2 if lvl_diff == 0 else (1.0 if lvl_diff == 1 else 0.8)

                rank_score = round(gap.priority_score * (relevance / 100.0) * alignment_factor, 2)

                candidate_items.append({
                    "course": course,
                    "competency_id": gap.competency_id,
                    "competency_name": gap.competency_name,
                    "gap_status": gap.gap_status,
                    "current_score": gap.current_score,
                    "required_level": gap.required_level,
                    "rank_score": rank_score
                })
                seen_course_ids.add(cm.course_id)

        # Fallback: if no mapped courses in database, fetch all active courses and pair with top gap
        if not candidate_items:
            all_courses = db.query(Course).filter(Course.is_active == True).all()
            for idx, c in enumerate(all_courses[:max_recs]):
                if c.id not in completed_course_ids:
                    top_gap = top_gaps[0] if top_gaps else None
                    candidate_items.append({
                        "course": c,
                        "competency_id": top_gap.competency_id if top_gap else None,
                        "competency_name": top_gap.competency_name if top_gap else "General Statistics",
                        "gap_status": top_gap.gap_status if top_gap else "HIGH_GAP",
                        "current_score": top_gap.current_score if top_gap else 20.0,
                        "required_level": top_gap.required_level if top_gap else 4,
                        "rank_score": 50.0 - idx
                    })

        # Sort candidates by rank_score descending
        candidate_items.sort(key=lambda x: x["rank_score"], reverse=True)
        top_candidates = candidate_items[:max_recs]

        # 5. Generate Gemini AI Reasoning for Top Recommendations
        ai_reasons = self._generate_ai_recommendation_reasons(user, learner, top_gaps, top_candidates)

        # 6. Save Recommendations to Supabase DB & Build Payload
        final_recommendations = []
        
        for rank_idx, item in enumerate(top_candidates, 1):
            course = item["course"]
            c_id = course.id
            comp_name = item["competency_name"]

            # Fallback reason if AI reason missing
            default_reason = f"Your current {comp_name} score is {item['current_score']}/100 while your role requires level {item['required_level']}."
            ai_reason = ai_reasons.get(c_id, default_reason)

            # Persist or update in database
            existing_rec = db.query(Recommendation).filter(
                Recommendation.user_id == user_id,
                Recommendation.course_id == c_id
            ).first()

            if existing_rec:
                existing_rec.competency_id = item["competency_id"]
                existing_rec.reason = ai_reason
                existing_rec.score = item["rank_score"]
                existing_rec.rank = rank_idx
                existing_rec.is_dismissed = False
                existing_rec.created_at = datetime.utcnow()
            else:
                rec = Recommendation(
                    user_id=user_id,
                    course_id=c_id,
                    competency_id=item["competency_id"],
                    reason=ai_reason,
                    score=item["rank_score"],
                    rank=rank_idx,
                    generated_by="ai_engine",
                    created_at=datetime.utcnow()
                )
                db.add(rec)

            final_recommendations.append({
                "recommendation_id": existing_rec.id if existing_rec else None,
                "course_id": c_id,
                "title": course.title,
                "source": course.source,
                "provider_name": course.provider_name or "iGOT Karmayogi",
                "description": course.description,
                "url": course.url,
                "duration_minutes": course.duration_minutes,
                "difficulty": course.difficulty,
                "competency_addressed": comp_name,
                "reason": ai_reason,
                "ranking_score": item["rank_score"],
                "rank": rank_idx
            })

        db.commit()

        return {
            "user_id": user_id,
            "full_name": user.full_name,
            "designation": designation,
            "total_recommendations": len(final_recommendations),
            "recommendations": final_recommendations
        }

    def _generate_ai_recommendation_reasons(
        self, user: UserProfile, learner: Optional[LearnerProfile], top_gaps: List[Any], candidates: List[Dict[str, Any]]
    ) -> Dict[str, str]:
        """
        Calls Gemini API to craft personalized justifications for candidate courses.
        """
        top_gaps_summary = [
            f"- Competency: {g.competency_name} | Gap Status: {g.gap_status} | Curr Score: {g.current_score}/100 | Req Level: {g.required_level}"
            for g in top_gaps[:3]
        ]
        candidate_summary = [
            f"- Course ID: {c['course'].id} | Title: {c['course'].title} | Source: {c['course'].source} | Target Competency: {c['competency_name']}"
            for c in candidates
        ]

        prompt = f"""You are the AI Learning Path Curator for India's Official Statistical System (MoSPI / iGOT / NSSTA).
Craft personalized course recommendation justifications for an official based on their competency gap profile.

Learner Profile:
- Name: {user.full_name}
- Designation: {user.designation}
- Career Goal: {learner.career_goal if learner else 'Skill advancement'}

Top Competency Gaps:
{chr(10).join(top_gaps_summary)}

Candidate Courses:
{chr(10).join(candidate_summary)}

Respond strictly with a JSON object mapping each course_id to a 1-2 sentence compelling personalized justification:
{{
  "<course_id_1>": "Your current Sampling score is 25/100 while your role requires level 4. This course directly bridges your sampling methodology gap.",
  "<course_id_2>": "Justification..."
}}
"""
        raw = gemini_service._call_gemini_http_rest(prompt, {"full_name": user.full_name, "designation": user.designation})
        if isinstance(raw, dict):
            return raw
        return {}

recommendation_engine = RecommendationEngine()
