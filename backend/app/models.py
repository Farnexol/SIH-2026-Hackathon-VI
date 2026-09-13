import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.types import TypeDecorator
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from app.database import Base

class GUID(TypeDecorator):
    """Platform-independent GUID/UUID type.
    Uses PostgreSQL's native UUID type, otherwise uses String(36).
    """
    impl = String
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=False))
        else:
            return dialect.type_descriptor(String(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        return str(value)

class Department(Base):
    __tablename__ = "departments"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    code = Column(String, unique=True, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="learner") # learner, trainer, admin
    department_id = Column(GUID, ForeignKey("departments.id"), nullable=True)
    designation = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    learner_profile = relationship("LearnerProfile", back_populates="user", uselist=False)
    competencies = relationship("LearnerCompetency", back_populates="user")

class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    user_id = Column(GUID, ForeignKey("user_profiles.id"), primary_key=True)
    current_assignment = Column(Text, nullable=True)
    educational_qualifications = Column(Text, nullable=True)
    years_experience = Column(Float, nullable=True)
    career_goal = Column(Text, nullable=True)
    employee_code = Column(String, nullable=True)
    joining_date = Column(String, nullable=True)
    current_overall_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("UserProfile", back_populates="learner_profile")

class TrainerProfile(Base):
    __tablename__ = "trainer_profiles"

    user_id = Column(GUID, ForeignKey("user_profiles.id"), primary_key=True)
    specialization = Column(Text, nullable=True)
    organization = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AdminProfile(Base):
    __tablename__ = "admin_profiles"

    user_id = Column(GUID, ForeignKey("user_profiles.id"), primary_key=True)
    admin_level = Column(String, default="org_admin") # org_admin, super_admin
    created_at = Column(DateTime, default=datetime.utcnow)

class Competency(Base):
    __tablename__ = "competencies"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    domain = Column(String, nullable=False) # statistical, technical, digital_governance, behavioural_managerial
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class RoleCompetency(Base):
    __tablename__ = "role_competencies"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    designation = Column(String, nullable=False)
    competency_id = Column(GUID, ForeignKey("competencies.id"), nullable=False)
    required_level = Column(Integer, nullable=False, default=1)
    weight = Column(Float, nullable=False, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    competency = relationship("Competency")

class LearnerCompetency(Base):
    __tablename__ = "learner_competencies"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(GUID, ForeignKey("user_profiles.id"), nullable=False)
    competency_id = Column(GUID, ForeignKey("competencies.id"), nullable=False)
    level = Column(Integer, nullable=False, default=1) # 1-5
    score = Column(Float, nullable=False, default=0.0) # 0-100
    confidence = Column(Float, nullable=True)
    evidence_source = Column(String, nullable=True)
    last_assessed_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("UserProfile", back_populates="competencies")
    competency = relationship("Competency")

class CompetencyAssessment(Base):
    __tablename__ = "competency_assessments"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(GUID, ForeignKey("user_profiles.id"), nullable=False)
    competency_id = Column(GUID, ForeignKey("competencies.id"), nullable=False)
    assessment_id = Column(GUID, nullable=True)
    score = Column(Float, nullable=False)
    level = Column(Integer, nullable=True)
    assessed_at = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column("metadata", JSON, default=dict)

class CompetencyGapRecord(Base):
    __tablename__ = "competency_gaps"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(GUID, ForeignKey("user_profiles.id"), nullable=False)
    competency_id = Column(GUID, ForeignKey("competencies.id"), nullable=False)
    designation = Column(String, nullable=False)
    required_level = Column(Integer, nullable=False)
    current_level = Column(Integer, nullable=False)
    required_score = Column(Float, nullable=False)
    current_score = Column(Float, nullable=False)
    gap_score = Column(Float, nullable=False)
    gap_status = Column(String, nullable=False) # CRITICAL_GAP, MODERATE_GAP, MET
    priority_score = Column(Float, nullable=False)
    calculated_at = Column(DateTime, default=datetime.utcnow)

    competency = relationship("Competency")

class Course(Base):
    __tablename__ = "courses"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    external_id = Column(String, nullable=True)
    title = Column(String, nullable=False)
    provider_name = Column(String, nullable=True)
    source = Column(String, nullable=False) # igot, nssta_tpac, internal
    description = Column(Text, nullable=True)
    url = Column(String, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    difficulty = Column(String, nullable=True) # easy, medium, hard
    metadata_json = Column("metadata", JSON, default=dict)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CourseCompetency(Base):
    __tablename__ = "course_competencies"

    course_id = Column(GUID, ForeignKey("courses.id"), primary_key=True)
    competency_id = Column(GUID, ForeignKey("competencies.id"), primary_key=True)
    target_level = Column(Integer, nullable=True)
    relevance_score = Column(Float, nullable=True)

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(GUID, ForeignKey("user_profiles.id"), nullable=False)
    course_id = Column(GUID, ForeignKey("courses.id"), nullable=False)
    competency_id = Column(GUID, ForeignKey("competencies.id"), nullable=True)
    reason = Column(Text, nullable=True)
    score = Column(Float, nullable=True)
    rank = Column(Integer, nullable=True)
    generated_by = Column(String, default="ai")
    metadata_json = Column("metadata", JSON, default=dict)
    is_dismissed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course")

class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(GUID, ForeignKey("user_profiles.id"), nullable=False)
    course_id = Column(GUID, ForeignKey("courses.id"), nullable=False)
    enrollment_status = Column(String, default="recommended") # recommended, enrolled, completed
    progress_percent = Column(Float, default=0.0)
    learning_hours = Column(Float, default=0.0)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    course = relationship("Course")

class TrainingMaterial(Base):
    __tablename__ = "training_materials"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    uploaded_by = Column(GUID, ForeignKey("user_profiles.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    material_type = Column(String, nullable=False) # pdf, docx, pptx, txt
    storage_path = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    mime_type = Column(String, nullable=True)
    processing_status = Column(String, default="pending") # pending, processing, completed, error
    extracted_text = Column(Text, nullable=True)
    metadata_json = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    chunks = relationship("MaterialChunk", back_populates="material", cascade="all, delete-orphan")

class MaterialChunk(Base):
    __tablename__ = "material_chunks"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    material_id = Column(GUID, ForeignKey("training_materials.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    token_count = Column(Integer, nullable=True)
    page_number = Column(Integer, nullable=True)
    section_title = Column(String, nullable=True)
    metadata_json = Column("metadata", JSON, default=dict)

    material = relationship("TrainingMaterial", back_populates="chunks")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_by = Column(GUID, ForeignKey("user_profiles.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    assessment_type = Column(String, default="mock_test") # mcq, quiz, mock_test
    status = Column(String, default="draft") # draft, published, archived
    competency_id = Column(GUID, ForeignKey("competencies.id"), nullable=True)
    source_material_id = Column(GUID, ForeignKey("training_materials.id"), nullable=True)
    question_count = Column(Integer, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    difficulty = Column(String, nullable=True)
    generation_model = Column(String, nullable=True)
    metadata_json = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    assessment_id = Column(GUID, ForeignKey("assessments.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String, default="mcq")
    difficulty = Column(String, nullable=True)
    explanation = Column(Text, nullable=True)
    source_chunk_id = Column(GUID, ForeignKey("material_chunks.id"), nullable=True)
    competency_id = Column(GUID, ForeignKey("competencies.id"), nullable=True)
    question_order = Column(Integer, nullable=False)
    is_ai_generated = Column(Boolean, default=True)
    is_trainer_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    assessment = relationship("Assessment", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")

class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    question_id = Column(GUID, ForeignKey("questions.id"), nullable=False)
    option_key = Column(String, nullable=False) # A, B, C, D
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)

    question = relationship("Question", back_populates="options")

class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    assessment_id = Column(GUID, ForeignKey("assessments.id"), nullable=False)
    user_id = Column(GUID, ForeignKey("user_profiles.id"), nullable=False)
    score = Column(Float, nullable=True)
    correct_count = Column(Integer, default=0)
    total_questions = Column(Integer, default=0)
    started_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)
    metadata_json = Column("metadata", JSON, default=dict)

    assessment = relationship("Assessment")
    answers = relationship("AttemptAnswer", back_populates="attempt", cascade="all, delete-orphan")

class AttemptAnswer(Base):
    __tablename__ = "attempt_answers"

    id = Column(GUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    attempt_id = Column(GUID, ForeignKey("assessment_attempts.id"), nullable=False)
    question_id = Column(GUID, ForeignKey("questions.id"), nullable=False)
    selected_option_id = Column(GUID, ForeignKey("question_options.id"), nullable=True)
    is_correct = Column(Boolean, nullable=True)
    answered_at = Column(DateTime, default=datetime.utcnow)

    attempt = relationship("AssessmentAttempt", back_populates="answers")
