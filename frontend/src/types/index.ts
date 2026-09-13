export type UserRole = 'LEARNER' | 'TRAINER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department_id?: string;
  department_name?: string;
  designation?: string;
  cadre?: string;
  batch_year?: number;
  posting_location?: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Competency {
  id: string;
  code: string;
  name: string;
  domain: string;
  description: string;
  target_level?: number;
  current_level?: number;
  current_score?: number;
  weight?: number;
}

export interface CompetencyGap {
  id?: string;
  competency_id: string;
  competency_code: string;
  competency_name: string;
  domain: string;
  required_level: number;
  current_level: number;
  level_gap: number;
  current_score: number;
  target_score: number;
  score_gap: number;
  domain_weight: number;
  weighted_gap: number;
  gap_priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  recommended_action?: string;
}

export interface GapAnalysisResponse {
  learner_id: string;
  total_gaps: number;
  critical_gaps_count: number;
  average_level_gap: number;
  executive_summary?: string;
  ai_narrative?: string;
  domain_breakdown: Record<string, {
    domain_weight: number;
    gaps_count: number;
    average_gap: number;
  }>;
  gaps: CompetencyGap[];
}

export interface Course {
  id: string;
  code?: string;
  title: string;
  provider: 'iGOT' | 'NSSTA' | 'TPAC' | 'INTERNAL';
  domain?: string;
  level?: number;
  duration_hours?: number;
  format?: string;
  description?: string;
  url?: string;
  competencies_addressed?: string[];
  match_score?: number;
  rationale?: string;
}

export interface Recommendation {
  id: string;
  learner_id: string;
  course_id: string;
  course_title: string;
  provider: string;
  match_score: number;
  target_competency_name: string;
  level_gap_addressed: number;
  ai_rationale: string;
  duration_hours: number;
  status: 'RECOMMENDED' | 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface TrainingMaterial {
  id: string;
  title: string;
  description?: string;
  material_type: string;
  file_url?: string;
  uploaded_by: string;
  uploader_name?: string;
  created_at: string;
  chunk_count?: number;
  status?: string;
}

export interface MaterialChunk {
  id: string;
  material_id: string;
  chunk_index: number;
  content: string;
  page_number?: number;
  section_title?: string;
  similarity_score?: number;
}

export interface QuestionOption {
  id: string;
  option_key: 'A' | 'B' | 'C' | 'D';
  option_text: string;
  is_correct?: boolean;
}

export interface Question {
  id: string;
  assessment_id?: string;
  question_text: string;
  options: QuestionOption[];
  difficulty_level?: 'EASY' | 'MEDIUM' | 'HARD';
  correct_option?: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  competency_id?: string;
  competency_name?: string;
  source_chunk_id?: string;
  source_citation?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  assessment_type: 'QUIZ' | 'MOCK_TEST' | 'DIAGNOSTIC' | 'POST_TRAINING';
  target_competency_id?: string;
  target_competency_name?: string;
  total_questions: number;
  duration_minutes: number;
  pass_percentage: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  created_by: string;
  created_at: string;
  questions?: Question[];
}

export interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  assessment_title: string;
  learner_id: string;
  score_percentage: number;
  passed: boolean;
  total_questions: number;
  correct_answers: number;
  competency_score_delta?: number;
  completed_at: string;
  answers?: AttemptAnswer[];
}

export interface AttemptAnswer {
  question_id: string;
  question_text: string;
  selected_option: 'A' | 'B' | 'C' | 'D';
  correct_option: 'A' | 'B' | 'C' | 'D';
  is_correct: boolean;
  explanation: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  parent_id?: string;
  head_name?: string;
  learner_count?: number;
  average_competency_score?: number;
}

export interface WorkforceAnalytics {
  total_learners: number;
  total_assessments_completed: number;
  average_readiness_score: number;
  domain_strengths: { domain: string; average_score: number; gap_index: number }[];
  department_gaps: { department: string; avg_gap: number; high_priority_count: number }[];
  critical_skills_shortage: { competency: string; affected_officials: number; priority: string }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
