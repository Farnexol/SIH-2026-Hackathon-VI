-- SIH 2026: AI Skill Intelligence & Learning Platform
-- Supabase / PostgreSQL schema
-- Includes pgvector support for the material -> mock-test generation pipeline.

create extension if not exists vector;
create extension if not exists pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================

do $$ begin
  create type public.app_role as enum ('learner', 'trainer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.admin_level as enum ('org_admin', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.competency_domain as enum (
    'statistical',
    'technical',
    'digital_governance',
    'behavioural_managerial'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.learning_source as enum ('igot', 'nssta_tpac', 'internal');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.material_type as enum ('pdf', 'docx', 'pptx', 'txt', 'video', 'audio', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.assessment_type as enum ('mcq', 'quiz', 'mock_test');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.question_difficulty as enum ('easy', 'medium', 'hard');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.assessment_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

-- ============================================================
-- ORGANIZATION / IDENTITY
-- ============================================================

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'learner',
  department_id uuid references public.departments(id) on delete set null,
  designation text,
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learner_profiles (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  current_assignment text,
  educational_qualifications text,
  years_experience numeric(5,2) check (years_experience >= 0),
  career_goal text,
  employee_code text,
  joining_date date,
  current_overall_score numeric(5,2) check (current_overall_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trainer_profiles (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  specialization text,
  organization text,
  bio text,
  is_verified boolean not null default false,
  verified_by uuid references public.user_profiles(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  admin_level public.admin_level not null default 'org_admin',
  created_at timestamptz not null default now()
);

-- ============================================================
-- COMPETENCY FRAMEWORK
-- ============================================================

create table if not exists public.competencies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  domain public.competency_domain not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.role_competencies (
  id uuid primary key default gen_random_uuid(),
  designation text not null,
  competency_id uuid not null references public.competencies(id) on delete cascade,
  required_level smallint not null check (required_level between 1 and 5),
  weight numeric(5,2) not null default 1.0 check (weight >= 0),
  created_at timestamptz not null default now(),
  unique (designation, competency_id)
);

create table if not exists public.learner_competencies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  competency_id uuid not null references public.competencies(id) on delete cascade,
  level smallint not null default 1 check (level between 1 and 5),
  score numeric(5,2) not null default 0 check (score between 0 and 100),
  confidence numeric(5,2) check (confidence between 0 and 100),
  evidence_source text,
  last_assessed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, competency_id)
);

create table if not exists public.competency_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  competency_id uuid not null references public.competencies(id) on delete cascade,
  assessment_id uuid,
  score numeric(5,2) not null check (score between 0 and 100),
  level smallint check (level between 1 and 5),
  assessed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

-- ============================================================
-- COURSE CATALOGUE / RECOMMENDATIONS
-- ============================================================

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  title text not null,
  provider_name text,
  source public.learning_source not null,
  description text,
  url text,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  difficulty public.question_difficulty,
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source, external_id)
);

create table if not exists public.course_competencies (
  course_id uuid not null references public.courses(id) on delete cascade,
  competency_id uuid not null references public.competencies(id) on delete cascade,
  target_level smallint check (target_level between 1 and 5),
  relevance_score numeric(5,2) check (relevance_score between 0 and 100),
  primary key (course_id, competency_id)
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  competency_id uuid references public.competencies(id) on delete set null,
  reason text,
  score numeric(6,3),
  rank integer,
  generated_by text not null default 'ai',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  is_dismissed boolean not null default false
);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrollment_status text not null default 'recommended',
  progress_percent numeric(5,2) not null default 0 check (progress_percent between 0 and 100),
  learning_hours numeric(8,2) not null default 0 check (learning_hours >= 0),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- ============================================================
-- TRAINING MATERIALS + PGVECTOR PIPELINE
-- ============================================================

create table if not exists public.training_materials (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null references public.user_profiles(id) on delete restrict,
  title text not null,
  description text,
  material_type public.material_type not null,
  storage_path text,
  source_url text,
  file_size_bytes bigint,
  mime_type text,
  checksum text,
  processing_status text not null default 'pending',
  extracted_text text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.material_chunks (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.training_materials(id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  token_count integer,
  page_number integer,
  section_title text,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(768), -- Change to your embedding model dimension if different.
  created_at timestamptz not null default now(),
  unique (material_id, chunk_index)
);

-- HNSW is generally a good default for semantic retrieval once the corpus grows.
create index if not exists material_chunks_embedding_hnsw_idx
on public.material_chunks
using hnsw (embedding vector_cosine_ops);

create index if not exists material_chunks_material_id_idx
on public.material_chunks(material_id);

-- ============================================================
-- ASSESSMENTS / MOCK TEST GENERATION
-- ============================================================

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.user_profiles(id) on delete restrict,
  title text not null,
  description text,
  assessment_type public.assessment_type not null default 'mock_test',
  status public.assessment_status not null default 'draft',
  competency_id uuid references public.competencies(id) on delete set null,
  source_material_id uuid references public.training_materials(id) on delete set null,
  question_count integer,
  duration_minutes integer,
  difficulty public.question_difficulty,
  generation_model text,
  generation_prompt_version text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  question_text text not null,
  question_type text not null default 'mcq',
  difficulty public.question_difficulty,
  explanation text,
  source_chunk_id uuid references public.material_chunks(id) on delete set null,
  competency_id uuid references public.competencies(id) on delete set null,
  question_order integer not null,
  is_ai_generated boolean not null default true,
  is_trainer_approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique (assessment_id, question_order)
);

create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_key char(1) not null check (option_key in ('A','B','C','D','E')),
  option_text text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now(),
  unique (question_id, option_key)
);

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  score numeric(5,2) check (score between 0 and 100),
  correct_count integer not null default 0,
  total_questions integer not null default 0,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  duration_seconds integer,
  feedback text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option_id uuid references public.question_options(id) on delete set null,
  is_correct boolean,
  answered_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

-- ============================================================
-- OPTIONAL: RETRIEVAL AUDIT FOR THE 3RD MOCK TEST PIPELINE
-- ============================================================

create table if not exists public.mock_test_generations (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null references public.user_profiles(id) on delete restrict,
  material_id uuid not null references public.training_materials(id) on delete cascade,
  assessment_id uuid references public.assessments(id) on delete set null,
  query_text text,
  retrieval_top_k integer not null default 8,
  retrieved_chunk_ids uuid[] not null default '{}',
  model_name text,
  status text not null default 'started',
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists user_profiles_role_idx on public.user_profiles(role);
create index if not exists user_profiles_department_idx on public.user_profiles(department_id);
create index if not exists learner_competencies_user_idx on public.learner_competencies(user_id);
create index if not exists learner_competencies_competency_idx on public.learner_competencies(competency_id);
create index if not exists recommendations_user_idx on public.recommendations(user_id, created_at desc);
create index if not exists learning_progress_user_idx on public.learning_progress(user_id);
create index if not exists assessments_created_by_idx on public.assessments(created_by);
create index if not exists questions_assessment_idx on public.questions(assessment_id);
create index if not exists attempts_user_idx on public.assessment_attempts(user_id, submitted_at desc);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_learner_profiles_updated_at on public.learner_profiles;
create trigger trg_learner_profiles_updated_at
before update on public.learner_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_trainer_profiles_updated_at on public.trainer_profiles;
create trigger trg_trainer_profiles_updated_at
before update on public.trainer_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_courses_updated_at on public.courses;
create trigger trg_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

drop trigger if exists trg_learner_competencies_updated_at on public.learner_competencies;
create trigger trg_learner_competencies_updated_at
before update on public.learner_competencies
for each row execute function public.set_updated_at();

drop trigger if exists trg_learning_progress_updated_at on public.learning_progress;
create trigger trg_learning_progress_updated_at
before update on public.learning_progress
for each row execute function public.set_updated_at();

drop trigger if exists trg_training_materials_updated_at on public.training_materials;
create trigger trg_training_materials_updated_at
before update on public.training_materials
for each row execute function public.set_updated_at();

drop trigger if exists trg_assessments_updated_at on public.assessments;
create trigger trg_assessments_updated_at
before update on public.assessments
for each row execute function public.set_updated_at();

-- ============================================================
-- SUPABASE AUTH PROFILE TRIGGER
-- Creates a learner profile by default whenever Auth creates a user.
-- FastAPI/admin provisioning can later promote the role.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    'learner'
  )
  on conflict (id) do nothing;

  insert into public.learner_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ============================================================
-- VECTOR MATCH FUNCTION FOR SUPABASE RPC
-- FastAPI can call this via Supabase RPC or use a direct DB connection.
-- ============================================================

create or replace function public.match_material_chunks(
  query_embedding vector(768),
  match_threshold float default 0.70,
  match_count int default 8,
  filter_material_id uuid default null
)
returns table (
  chunk_id uuid,
  material_id uuid,
  content text,
  page_number integer,
  section_title text,
  similarity float
)
language sql
stable
as $$
  select
    mc.id,
    mc.material_id,
    mc.content,
    mc.page_number,
    mc.section_title,
    1 - (mc.embedding <=> query_embedding) as similarity
  from public.material_chunks mc
  where mc.embedding is not null
    and (filter_material_id is null or mc.material_id = filter_material_id)
    and 1 - (mc.embedding <=> query_embedding) >= match_threshold
  order by mc.embedding <=> query_embedding
  limit least(match_count, 50);
$$;

-- ============================================================
-- SEED: COMPETENCY FRAMEWORK STARTER DATA
-- ============================================================

insert into public.competencies (name, domain, description) values
('Survey Design', 'statistical', 'Design of statistical surveys and instruments.'),
('Sampling', 'statistical', 'Sampling methods and survey sampling techniques.'),
('National Accounts', 'statistical', 'National accounting concepts and methods.'),
('Price Statistics', 'statistical', 'Compilation and interpretation of price statistics.'),
('Labour Statistics', 'statistical', 'Concepts and methods for labour statistics.'),
('Agricultural Statistics', 'statistical', 'Collection and analysis of agricultural statistics.'),
('Industrial Statistics', 'statistical', 'Collection and analysis of industrial statistics.'),
('SDG Indicators', 'statistical', 'Statistical indicators supporting SDG monitoring.'),
('Metadata Standards', 'statistical', 'Metadata standards for official statistics.'),
('Data Quality Frameworks', 'statistical', 'Quality dimensions and frameworks for statistical data.'),
('Python', 'technical', 'Python programming for data analysis and statistical work.'),
('R', 'technical', 'R programming for statistical computing.'),
('SQL', 'technical', 'Relational data querying and database operations.'),
('GIS', 'technical', 'Geospatial analysis and geographic information systems.'),
('Data Visualization', 'technical', 'Data presentation and visual analytics.'),
('AI/ML', 'technical', 'Artificial intelligence and machine learning.'),
('Cloud Computing', 'technical', 'Cloud platforms and services.'),
('APIs', 'technical', 'API use and integration.'),
('Open Data', 'technical', 'Open data publishing and consumption.'),
('Cybersecurity', 'digital_governance', 'Cybersecurity principles for government systems.'),
('Data Privacy', 'digital_governance', 'Data protection and privacy practices.'),
('Digital Signatures', 'digital_governance', 'Use and governance of digital signatures.'),
('Government Cloud', 'digital_governance', 'Government cloud platforms and patterns.'),
('Digital Public Infrastructure', 'digital_governance', 'Digital public infrastructure concepts.'),
('Leadership', 'behavioural_managerial', 'Leadership and team management.'),
('Communication', 'behavioural_managerial', 'Professional communication.'),
('Project Management', 'behavioural_managerial', 'Planning and execution of projects.'),
('Ethics', 'behavioural_managerial', 'Professional and public-sector ethics.'),
('Decision Making', 'behavioural_managerial', 'Structured decision making.'),
('Change Management', 'behavioural_managerial', 'Managing organizational change.')
on conflict (name) do nothing;

-- ============================================================
-- NOTES
-- ============================================================
-- 1. auth.users is managed by Supabase Auth; never store plaintext passwords here.
-- 2. Keep service_role credentials only on FastAPI/server-side. Never expose them in Vite.
-- 3. Set vector(768) to match the embedding model you actually deploy.
-- 4. For generated MCQs, trainer approval is intentionally separate from AI generation.
-- 5. Add RLS policies after choosing whether the frontend accesses Supabase directly
--    or all data access goes through FastAPI. For a FastAPI-only data plane, keep the
--    privileged DB/Supabase credentials server-side and expose domain APIs from FastAPI.
