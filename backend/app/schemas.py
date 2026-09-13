from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CompetencyBase(BaseModel):
    name: str
    domain: str
    description: Optional[str] = None

class CompetencyOut(CompetencyBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class LearnerCompetencyInput(BaseModel):
    competency_name: str
    level: int = Field(..., ge=1, le=5)
    score: float = Field(..., ge=0.0, le=100.0)
    confidence: Optional[float] = 100.0
    evidence_source: Optional[str] = "Self-Assessment / Initial Placement"

class MockUserCreate(BaseModel):
    full_name: str = "Rajesh Sharma"
    designation: str = "Statistical Officer"
    department_name: Optional[str] = "Ministry of Statistics and Programme Implementation (MoSPI)"
    years_experience: Optional[float] = 4.5
    educational_qualifications: Optional[str] = "M.Sc. Statistics"
    career_goal: Optional[str] = "Advance to Senior Statistical Officer and lead National Accounts survey methodology"
    initial_competencies: Optional[List[LearnerCompetencyInput]] = None

class LearnerProfileOut(BaseModel):
    user_id: str
    full_name: str
    role: str
    designation: str
    department_name: Optional[str] = None
    years_experience: Optional[float] = None
    current_overall_score: float = 0.0

class CompetencyGapItem(BaseModel):
    competency_id: str
    competency_name: str
    domain: str
    required_level: int
    current_level: int
    required_score: float
    current_score: float
    gap_score: float
    gap_status: str  # HIGH_GAP, MODERATE_GAP, MET
    priority_score: float
    weight: float

class DomainGapSummary(BaseModel):
    domain: str
    average_gap_score: float
    critical_gaps_count: int
    total_domain_competencies: int

class GeminiAIGapInsights(BaseModel):
    executive_summary: str
    prioritized_action_plan: List[str]
    hidden_synergies_and_risks: str
    recommended_learning_focus: List[str]

class CompetencyGapReport(BaseModel):
    user_id: str
    full_name: str
    designation: str
    calculated_at: datetime
    overall_competency_score: float
    total_gaps_count: int
    high_priority_gaps_count: int
    gaps: List[CompetencyGapItem]
    domain_summaries: List[DomainGapSummary]
    ai_insights: Optional[GeminiAIGapInsights] = None
