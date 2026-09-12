# SIH 2026 — AI Skill Intelligence & Learning Platform

## Final Architecture & Team Implementation Specification

**Status:** Finalized for development  
**Frontend:** React + Vite + Tailwind CSS  
**Backend:** FastAPI  
**Database/Auth/Storage:** Supabase (PostgreSQL + Supabase Auth + Storage + pgvector)  
**LLM:** Gemini API  
**ML/NLP:** Open-source models where useful + Gemini for generation/reasoning  
**Primary AI Retrieval:** PostgreSQL pgvector semantic search  

---

# 1. Purpose

The platform is an AI-enabled Skill Intelligence and Learning Platform for officials working in India's Official Statistical System.

The system does four major things:

1. Builds a competency profile for each learner.
2. Identifies competency/skill gaps against role requirements.
3. Recommends personalized learning from iGOT Karmayogi and NSSTA/TPAC training programmes.
4. Generates AI-powered MCQs, quizzes and mock tests from uploaded learning materials and uses assessment results to continuously update learner competency.

The platform has three application roles:

- **Learner** — government official/employee consuming learning and taking assessments.
- **Trainer** — trainer/subject-matter expert who uploads material, generates/reviews assessments and publishes them.
- **Admin** — organization-level manager who monitors workforce competency, training effectiveness and future skill needs.

---

# 2. Core Product Principle

This is **not just an LMS** and **not just an MCQ generator**.

The central product loop is:

```text
                   ┌──────────────────────┐
                   │   Learner Profile    │
                   └──────────┬───────────┘
                              ↓
                   ┌──────────────────────┐
                   │ Competency Assessment│
                   └──────────┬───────────┘
                              ↓
                   ┌──────────────────────┐
                   │   Skill Gap Engine   │
                   └──────────┬───────────┘
                              ↓
                   ┌──────────────────────┐
                   │ Recommendation Engine│
                   └──────────┬───────────┘
                              ↓
             ┌────────────────┴────────────────┐
             ↓                                 ↓
      iGOT Courses                    NSSTA / TPAC Programmes
             └────────────────┬────────────────┘
                              ↓
                           Learning
                              ↓
                   ┌──────────────────────┐
                   │  Assessment Engine   │
                   │ MCQ / Quiz / Mock   │
                   └──────────┬───────────┘
                              ↓
                       Assessment Result
                              ↓
                  Update Competency Scores
                              ↓
                    Recalculate Skill Gaps
                              ↓
                     Recommend Next Steps
```

The platform is therefore a **continuous competency improvement loop**.

---

# 3. High-Level System Architecture

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         REACT + VITE CLIENT                        │
│                         Tailwind CSS UI                            │
├─────────────────────────────────────────────────────────────────────┤
│ Auth │ Learner Dashboard │ Trainer Studio │ Admin Analytics        │
│ Profile │ Competencies │ Recommendations │ Assessments            │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTPS / REST JSON
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         FASTAPI BACKEND                            │
├─────────────────────────────────────────────────────────────────────┤
│ API Routes                                                        │
│ ├── Auth / User / RBAC                                            │
│ ├── Learner / Competency                                          │
│ ├── Recommendations                                               │
│ ├── Courses / iGOT / NSSTA                                       │
│ ├── Trainer / Materials                                           │
│ ├── Assessment / Mock Test                                       │
│ ├── Analytics / Admin                                             │
│ └── Health / Integration                                          │
│                                                                   │
│ Service Layer                                                     │
│ ├── Competency Service                                            │
│ ├── Recommendation Service                                       │
│ ├── Assessment Service                                            │
│ ├── RAG / Retrieval Service                                      │
│ ├── LLM Service                                                   │
│ ├── Course Integration Service                                   │
│ └── Analytics Service                                             │
│                                                                   │
│ AI / NLP Layer                                                    │
│ ├── Document extraction                                           │
│ ├── Text chunking                                                 │
│ ├── Embedding generation                                          │
│ ├── pgvector retrieval                                            │
│ ├── Prompt assembly                                               │
│ ├── Gemini generation                                             │
│ └── Output validation                                             │
└──────────────┬───────────────────────┬────────────────────────────┘
               │                       │
               │                       └───────────────┐
               ↓                                       ↓
┌──────────────────────────────┐         ┌───────────────────────────┐
│      SUPABASE PLATFORM       │         │     EXTERNAL SOURCES      │
├──────────────────────────────┤         ├───────────────────────────┤
│ PostgreSQL                   │         │ iGOT APIs / Catalogue      │
│ Supabase Auth                │         │ NSSTA / TPAC data         │
│ Supabase Storage             │         │ Gemini API                 │
│ pgvector                     │         └───────────────────────────┘
└──────────────────────────────┘
```

---

# 4. Responsibility of Each Technology

## React + Vite + Tailwind

Responsible only for presentation and client-side interaction.

It should handle:

- routing
- page rendering
- form state
- dashboard visualizations
- assessment UI
- file upload UI
- loading/error states
- authenticated API calls

It should **not** contain Gemini API keys, Supabase service-role keys, database credentials, or competency/recommendation business logic.

## FastAPI

FastAPI is the **main application/API layer and business-logic layer**.

It handles:

- authentication/session validation
- role-based authorization
- all application routes
- database operations
- competency calculations
- skill-gap calculations
- recommendation logic
- iGOT/NSSTA integration
- material ingestion
- chunking
- embedding generation
- vector search
- Gemini requests
- MCQ/quiz generation
- assessment evaluation
- competency updates
- admin analytics

## Supabase

Supabase provides:

- PostgreSQL
- Auth
- Storage
- pgvector
- database functions/RPC where useful

## Gemini

Gemini is used for tasks where generative reasoning adds value, especially:

- generating explanations
- generating MCQs/quizzes/mock tests
- semantic interpretation of profile/course descriptions
- recommendation reasoning where deterministic rules alone are insufficient
- AI assistant responses

Gemini must not be treated as the database or source of truth.

## Open-source ML/NLP

Use open-source models where they provide deterministic/local processing advantages, for example:

- text embedding model
- language detection
- text preprocessing
- classification/ranking
- document parsing support

The exact embedding model must match the pgvector dimension configured in Supabase.

---

# 5. User Roles

## 5.1 Learner

A learner is an official/employee using the system for competency development.

### Learner capabilities

- login
- view/update profile
- complete competency assessment
- view competency scores
- view skill gaps
- view recommended learning paths
- view iGOT courses
- view NSSTA/TPAC programmes
- track learning progress
- take published quizzes/mock tests
- view results and explanations
- upload material only if product policy explicitly permits it; default is **Trainer-only uploads**
- view competency improvement over time

### Learner dashboard

Must show:

```text
Current competency overview
Top skill gaps
Recommended learning path
Recent learning activity
Assessment performance
Competency improvement
Learning hours
```

---

# 6. Trainer Role

The Trainer is the owner of the learning-content-to-assessment workflow.

## Trainer capabilities

- create/manage learning materials
- upload PDF/DOCX/PPTX/TXT and supported media
- trigger document processing
- generate embeddings
- generate MCQs
- generate quizzes
- generate mock tests
- review AI-generated questions
- edit questions/options/explanations
- approve/reject questions
- publish assessments
- archive assessments
- inspect source material/chunks used for questions
- view learner assessment performance for trainer-owned assessments

## Important rule

**AI-generated questions are NOT automatically published.**

Required workflow:

```text
Trainer uploads material
        ↓
Processing
        ↓
Chunking + embeddings
        ↓
Trainer selects assessment settings
        ↓
RAG retrieves relevant chunks
        ↓
Gemini generates questions
        ↓
Validation
        ↓
Draft assessment
        ↓
Trainer reviews/edits
        ↓
Trainer approves
        ↓
Publish
        ↓
Learners can attempt
```

This gives the project a human-in-the-loop safety/quality layer.

---

# 7. Admin Role

Admin is responsible for **organization-level workforce intelligence**, not individual learning.

## Admin capabilities

- view workforce competency distribution
- view department-level skill gaps
- view designation-level competency gaps
- view training participation/completion
- view assessment performance
- monitor training effectiveness
- identify high-priority workforce gaps
- inspect emerging technology skill requirements
- view future workforce readiness analytics
- manage departments
- manage competency framework
- manage role-to-competency requirements
- manage user roles
- verify trainers
- manage course catalogue metadata if required

## Admin dashboard

Core cards/charts:

```text
Total Officials
Active Learners
Verified Trainers
Average Competency Score
High-Priority Skill Gaps
Course Completion Rate
Assessment Effectiveness
```

Then:

```text
Competency Distribution
Department Comparison
Top Skill Gaps
Training Effectiveness
Emerging Skills
Future Skill Requirement
```

---

# 8. Database Architecture

The finalized schema is in:

`./Database/sih_skill_platform_schema.sql`

The schema uses Supabase `auth.users` for authentication and application tables in `public`.

## Identity tables

```text
auth.users
    │
    ▼
user_profiles
    │
    ├──────── learner_profiles
    ├──────── trainer_profiles
    └──────── admin_profiles
```

### `user_profiles`

Common identity and RBAC information:

- id
- full_name
- role
- department_id
- designation
- phone
- avatar_url
- is_active

### `learner_profiles`

Learner-specific information:

- current assignment
- education
- years of experience
- career goal
- employee code
- joining date
- overall score

### `trainer_profiles`

Trainer-specific information:

- specialization
- organization
- bio
- verification state
- verifier
- verification timestamp

### `admin_profiles`

Admin-specific information:

- admin level

---

# 9. Competency Model

The competency framework follows four domains from the problem statement.

```text
Competency Domain
├── Statistical
├── Technical
├── Digital Governance
└── Behavioural / Managerial
```

Starter competencies include:

### Statistical

- Survey Design
- Sampling
- National Accounts
- Price Statistics
- Labour Statistics
- Agricultural Statistics
- Industrial Statistics
- SDG Indicators
- Metadata Standards
- Data Quality Frameworks

### Technical

- Python
- R
- SQL
- GIS
- Data Visualization
- AI/ML
- Cloud Computing
- APIs
- Open Data

### Digital Governance

- Cybersecurity
- Data Privacy
- Digital Signatures
- Government Cloud
- Digital Public Infrastructure

### Behavioural / Managerial

- Leadership
- Communication
- Project Management
- Ethics
- Decision Making
- Change Management

---

# 10. Competency Levels

Use a simple five-level model across the platform:

```text
1 = Beginner
2 = Basic
3 = Intermediate
4 = Advanced
5 = Expert
```

In the database, `learner_competencies` stores both:

- level: 1–5
- score: 0–100

The level is the human-readable competency band; score provides finer-grained ranking.

Example:

```text
Python
level = 2
score = 42

Survey Sampling
level = 1
score = 28

SQL
level = 4
score = 81
```

---

# 11. Role-to-Competency Mapping

The table `role_competencies` defines what a role/designation requires.

Example:

```text
Designation: Statistical Officer

Python             required_level = 3
SQL                required_level = 3
Survey Sampling    required_level = 4
Data Visualization required_level = 3
```

The competency-gap engine compares the learner against these requirements.

### Gap calculation

Conceptually:

```text
required_score - current_score = gap
```

For level-based comparison:

```text
required_level > learner_level → competency gap
```

For ranking gaps:

```text
gap_priority = gap_size × role_weight × competency_relevance
```

Exact formula can evolve, but the API contract should stay stable.

---

# 12. Competency Assessment Pipeline

```text
Learner Profile
      +
Existing Learning History
      +
Role Requirements
      +
Diagnostic Assessment
      ↓
Competency Assessment Service
      ↓
competency_assessments
      ↓
Aggregate scores
      ↓
learner_competencies
      ↓
Skill Gap Engine
```

The system should retain assessment evidence instead of overwriting history.

`competency_assessments` is the historical evidence.

`learner_competencies` is the latest current competency state.

---

# 13. Personalized Recommendation Engine

The recommendation engine combines:

```text
Current competency
        +
Required competency
        +
Previous learning
        +
Job role
        +
Department priorities
        +
Course competency mapping
        +
Future skill requirements
        ↓
Recommendation ranking
```

## Course sources

The course table supports:

```text
igot
nssta_tpac
internal
```

The problem requires both:

- iGOT Karmayogi course modules
- NSSTA/TPAC recommended training programmes

## Recommendation output

Each recommendation should include:

```text
course
competency gap addressed
reason
ranking score
rank
source
```

Example API response:

```json
{
  "recommendations": [
    {
      "course_id": "...",
      "title": "Advanced Survey Sampling",
      "source": "igot",
      "competency": "Sampling",
      "reason": "Your current Sampling score is 41/100 while your role requires level 4.",
      "rank": 1
    }
  ]
}
```

---

# 14. iGOT / NSSTA Integration Strategy

Do not couple the frontend directly to external government APIs.

Use:

```text
React
  ↓
FastAPI
  ↓
Integration Service
  ↓
iGOT / NSSTA
```

The integration service should normalize external data into the internal `courses` model.

## Normalization

External fields may differ. Map them into:

```text
external_id
title
provider_name
source
description
url
duration_minutes
difficulty
metadata
```

Then map relevant competencies using `course_competencies`.

For the initial hackathon demo, use seeded/mock catalogue data behind the same service interface if live APIs/credentials are unavailable.

The frontend should never know whether a course came from:

- live iGOT
- mocked iGOT data
- NSSTA
- internal training

---

# 15. Training Material Pipeline

The trainer upload flow is the beginning of the RAG pipeline.

```text
Trainer
  ↓
POST /materials
  ↓
Supabase Storage
  ↓
training_materials row
  ↓
processing_status = pending
  ↓
FastAPI processing service
  ↓
Document extraction
  ↓
Cleaning / normalization
  ↓
Chunking
  ↓
material_chunks
  ↓
Embedding model
  ↓
embedding vector
  ↓
pgvector
  ↓
processing_status = completed
```

## Supported materials

The schema supports:

- PDF
- DOCX
- PPTX
- TXT
- Video
- Audio
- Other

The first stable implementation should prioritize:

1. PDF
2. DOCX
3. PPTX
4. TXT

Video/audio should be added after transcription support is stable.

---

# 16. pgvector Architecture

`material_chunks.embedding` stores the semantic vector for each chunk.

The current SQL schema uses:

```sql
vector(768)
```

**This must match the actual embedding model used by FastAPI.**

If the team selects a different embedding model dimension, modify the database schema and RPC together.

## Vector retrieval

The database exposes:

```text
match_material_chunks()
```

FastAPI can call it using Supabase RPC or direct Postgres access.

Retrieval sequence:

```text
User/Trainer request
      ↓
Create query text
      ↓
Embedding model
      ↓
query_embedding
      ↓
match_material_chunks()
      ↓
Top-K chunks by cosine similarity
      ↓
Context builder
```

---

# 17. Third Mock Test Generation Pipeline

This is the main GenAI/RAG demonstration pipeline.

## Input

Trainer selects:

```text
Material
Question count
Difficulty
Assessment type
Optional competency
Optional topic/query
```

Example:

```text
Material: Survey_Sampling.pdf
Questions: 15
Difficulty: Medium
Type: Mock Test
Competency: Sampling
```

## Pipeline

```text
              TRAINER REQUEST
                    │
                    ▼
          POST /assessments/generate
                    │
                    ▼
         Validate material + settings
                    │
                    ▼
            Build retrieval query
                    │
                    ▼
              Embed query text
                    │
                    ▼
            pgvector top-K search
                    │
                    ▼
        Relevant material chunks
                    │
                    ▼
       Build grounded Gemini prompt
                    │
                    ▼
                Gemini
                    │
                    ▼
        Structured JSON questions
                    │
                    ▼
        Schema + quality validation
                    │
                    ├── invalid → retry/fix
                    │
                    └── valid
                    │
                    ▼
            Save draft assessment
                    │
                    ▼
            Trainer review/edit
                    │
                    ▼
                 Publish
```

---

# 18. RAG Prompting Rules for MCQ Generation

Gemini should receive:

1. Assessment instructions.
2. Difficulty.
3. Question count.
4. Target competency.
5. Retrieved source context.
6. Strict output schema.
7. Requirement to avoid unsupported facts.

Conceptual prompt:

```text
You are an assessment-generation engine.
Generate MCQs ONLY from the supplied source context.
Do not invent facts outside the context.

Target competency: {competency}
Difficulty: {difficulty}
Question count: {count}

For every question return:
- question_text
- options A/B/C/D
- correct_option
- explanation
- difficulty
- competency
- source_chunk_reference

Return valid JSON only.
```

The actual prompt should be versioned using `generation_prompt_version`.

---

# 19. AI Output Validation

Never trust raw LLM output.

Validate:

- valid JSON
- exact question count
- exactly four/five allowed options
- exactly one correct option
- non-empty explanation
- valid difficulty
- valid competency ID/name
- no duplicated questions
- source chunk exists
- question is grounded in retrieved context

If validation fails:

```text
Gemini output
   ↓
Validator
   ├── valid → save
   └── invalid → repair/retry
```

The system should have a maximum retry count to prevent infinite API loops.

---

# 20. Assessment Data Model

Assessment hierarchy:

```text
assessment
    │
    ├── question
    │      └── question_options
    │
    └── assessment_attempt
               └── attempt_answers
```

## Assessment statuses

```text
draft
published
archived
```

Only published assessments can normally be attempted by learners.

## Trainer approval

A generated question has:

```text
is_ai_generated = true
is_trainer_approved = false
```

Trainer approval changes:

```text
is_trainer_approved = true
```

before publication.

---

# 21. Learner Assessment Flow

```text
Learner opens published mock test
        ↓
GET assessment
        ↓
Create assessment_attempt
        ↓
Display questions
        ↓
Learner submits answers
        ↓
FastAPI evaluates
        ↓
attempt_answers
        ↓
Calculate score
        ↓
assessment_attempts
        ↓
Generate feedback
        ↓
Update competency evidence
        ↓
Update learner_competencies
        ↓
Recalculate skill gaps
        ↓
Refresh recommendations
```

The result is not just:

> “You scored 82%.”

It should also produce:

> “Your Sampling competency improved from 52 to 68. You still have a gap against the level required for your role.”

---

# 22. Connecting Assessment Results to Competency

Each question can optionally be mapped to a competency.

Example:

```text
Q1 → Sampling
Q2 → Sampling
Q3 → Survey Design
Q4 → Sampling
Q5 → Data Quality Frameworks
```

Then performance can be calculated by competency.

Example:

```text
Overall = 80%

Sampling = 72%
Survey Design = 91%
Data Quality = 60%
```

This is much more valuable than only having an overall score.

The competency-specific result becomes new evidence for `learner_competencies`.

---

# 23. Mock Test Generation Audit Trail

The `mock_test_generations` table stores generation metadata.

Record:

- requester
- source material
- final assessment
- query
- top-K retrieval count
- retrieved chunk IDs
- model name
- status
- error message
- timestamps

This helps debugging and gives the team traceability during the hackathon demo.

---

# 24. API Architecture

FastAPI should be organized by business domain.

Recommended structure:

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── logging.py
│   │
│   ├── db/
│   │   ├── client.py
│   │   └── models.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── competency.py
│   │   ├── course.py
│   │   ├── recommendation.py
│   │   ├── material.py
│   │   ├── assessment.py
│   │   └── analytics.py
│   │
│   ├── routes/
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── learners.py
│   │   ├── trainers.py
│   │   ├── admins.py
│   │   ├── competencies.py
│   │   ├── recommendations.py
│   │   ├── courses.py
│   │   ├── materials.py
│   │   ├── assessments.py
│   │   └── analytics.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── competency_service.py
│   │   ├── gap_service.py
│   │   ├── recommendation_service.py
│   │   ├── assessment_service.py
│   │   ├── material_service.py
│   │   ├── retrieval_service.py
│   │   ├── embedding_service.py
│   │   ├── llm_service.py
│   │   ├── igot_service.py
│   │   ├── nssta_service.py
│   │   └── analytics_service.py
│   │
│   ├── prompts/
│   │   ├── mcq_generation.txt
│   │   ├── recommendation.txt
│   │   └── assistant.txt
│   │
│   └── utils/
│       ├── chunking.py
│       ├── parsing.py
│       └── validators.py
│
└── tests/
```

The exact naming can differ, but **keep route/controller logic separate from service logic**.

---

# 25. API Route Groups

## Authentication

```text
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

## Learner

```text
GET    /api/v1/learners/me
PUT    /api/v1/learners/me
GET    /api/v1/learners/me/competencies
GET    /api/v1/learners/me/gaps
GET    /api/v1/learners/me/recommendations
GET    /api/v1/learners/me/progress
GET    /api/v1/learners/me/assessments
```

## Competencies

```text
GET    /api/v1/competencies
GET    /api/v1/competencies/{id}
POST   /api/v1/competencies/assess
GET    /api/v1/competencies/roles/{designation}
```

## Courses

```text
GET    /api/v1/courses
GET    /api/v1/courses/{id}
POST   /api/v1/courses/sync/igot
POST   /api/v1/courses/sync/nssta
```

## Recommendations

```text
POST   /api/v1/recommendations/generate
GET    /api/v1/recommendations/me
POST   /api/v1/recommendations/{id}/dismiss
```

## Trainer materials

```text
POST   /api/v1/materials
GET    /api/v1/materials
GET    /api/v1/materials/{id}
POST   /api/v1/materials/{id}/process
DELETE /api/v1/materials/{id}
```

## Assessment generation

```text
POST   /api/v1/assessments/generate
GET    /api/v1/assessments
GET    /api/v1/assessments/{id}
PUT    /api/v1/assessments/{id}
POST   /api/v1/assessments/{id}/publish
POST   /api/v1/assessments/{id}/archive
```

## Learner attempts

```text
POST   /api/v1/assessments/{id}/attempts
POST   /api/v1/attempts/{id}/submit
GET    /api/v1/attempts/{id}
```

## Admin analytics

```text
GET    /api/v1/admin/overview
GET    /api/v1/admin/competencies
GET    /api/v1/admin/skill-gaps
GET    /api/v1/admin/training-effectiveness
GET    /api/v1/admin/departments
GET    /api/v1/admin/emerging-skills
```

---

# 26. Authentication & Authorization

Supabase Auth is the identity provider.

Recommended flow:

```text
React
  ↓
Supabase Auth
  ↓
access token
  ↓
FastAPI Authorization
  ↓
Load user_profiles.role
  ↓
RBAC dependency
  ↓
Route access
```

Example:

```text
GET /admin/overview

Token valid?
  ↓ yes
User role = admin?
  ↓ yes
Admin service
```

## Role rules

```text
Learner → learner endpoints
Trainer → trainer + shared learner read endpoints as appropriate
Admin → admin endpoints
Super Admin → privileged organization/platform administration
```

Do not rely solely on frontend route hiding for security.

Every protected FastAPI route must enforce authorization server-side.

---

# 27. Supabase Storage

Use a storage bucket for training materials.

Suggested object structure:

```text
training-materials/
  {trainer_user_id}/
    {material_id}/
      original-file.pdf
```

Store the object path in:

```text
training_materials.storage_path
```

Never expose service-role credentials to React.

---

# 28. Security Rules

## Secrets

Only FastAPI may access:

- Gemini API key
- Supabase service-role key
- private integration credentials
- database credentials

React receives only short-lived user access tokens and public configuration.

## File upload security

Validate:

- MIME type
- extension
- file size
- checksum
- uploaded user role

Reject unsupported formats.

## LLM security

Never put secrets inside prompts.

Never allow a learner to directly specify arbitrary system prompts.

All generated content must be treated as untrusted until validated.

## Database security

Use foreign keys and constraints.

Add RLS policies if the team decides to allow the client to query Supabase directly.

For the current architecture, **FastAPI is the main data plane**, so privileged DB operations stay server-side.

---

# 29. Admin Analytics Calculations

The admin dashboard should not query raw tables for every chart in an ad hoc way.

Create service-level aggregation queries for:

### Workforce competency

```text
average score by competency
average score by department
average score by designation
percentage above required level
```

### Skill gaps

```text
count of learners below required level
average gap by competency
top 5 organizational gaps
```

### Training effectiveness

```text
enrollment
completion
pre-assessment score
post-assessment score
average improvement
```

### Emerging skills

For the hackathon, the first version can combine:

- predefined emerging-skill tags
- admin-defined priority
- future-role competency requirements

A sophisticated predictive model can be a later enhancement.

Do not fake ML predictions with unexplained random numbers.

---

# 30. Recommended Learner Experience

## Page 1 — Dashboard

```text
Welcome, [Name]

Overall Competency: 68/100

Top Gaps
[Python] [Sampling] [Data Visualization]

Recommended Next Step
[Advanced Sampling Course]

Recent Assessment
[82%]

Competency Trend
[chart]
```

## Page 2 — Competencies

Domain-based view:

```text
Statistical
████████░░ 76%

Technical
█████░░░░░ 52%

Digital Governance
█████████░ 88%

Behavioural
███████░░░ 70%
```

## Page 3 — Learning Path

```text
1. Sampling Fundamentals      ✓
2. Advanced Survey Sampling   → current
3. Survey Design              locked/recommended
```

## Page 4 — Assessments

```text
Available
In Progress
Completed
```

---

# 31. Recommended Trainer Experience

## Trainer Dashboard

```text
Materials: 12
Draft Assessments: 4
Published Assessments: 8
Total Attempts: 432
Average Score: 78%
```

## Material Studio

```text
Upload File
   ↓
Processing Status
   ↓
Chunks Created
   ↓
Generate Mock Test
```

## Assessment Studio

```text
Question Count: 15
Difficulty: Medium
Competency: Sampling

[Generate]

Q1 ...
A ...
B ...
C ...
D ...

[Edit] [Approve]
```

After review:

```text
[Publish Assessment]
```

---

# 32. Recommended Admin Experience

## Admin Overview

```text
Workforce: 1,240
Average Competency: 64%
High-Priority Gaps: 7
Training Completion: 71%
```

## Skill Intelligence

```text
Sampling               41% proficient
AI/ML                  24% proficient
Python                 46% proficient
Cybersecurity          79% proficient
```

Clicking a competency should reveal:

```text
Total affected officials
Departments affected
Average score
Required level
Top recommended courses
```

---

# 33. End-to-End Example

Use this scenario when integrating the modules.

### Step 1 — Learner onboarding

A Statistical Officer signs in.

Profile:

```text
Designation: Statistical Officer
Department: Example Statistics Department
Experience: 4 years
Education: MA Economics
```

### Step 2 — Competency assessment

The system assesses:

```text
Sampling = 42
Python = 34
SQL = 78
Data Visualization = 61
```

### Step 3 — Gap engine

Role requires:

```text
Sampling = level 4
Python = level 3
SQL = level 3
Data Visualization = level 3
```

Result:

```text
HIGH GAP: Sampling
HIGH GAP: Python
MODERATE GAP: Data Visualization
NO GAP: SQL
```

### Step 4 — Recommendations

The system retrieves:

```text
iGOT: Advanced Sampling
NSSTA/TPAC: Survey Methodology Programme
iGOT: Python for Data Analysis
```

and ranks them.

### Step 5 — Learning

Learner completes a course.

### Step 6 — Assessment

Trainer uploads a relevant training PDF.

The AI creates a mock test using pgvector + Gemini.

### Step 7 — Assessment result

Learner scores:

```text
Sampling: 78%
Python: 71%
```

### Step 8 — Competency update

System updates:

```text
Sampling: 42 → 68
Python: 34 → 57
```

### Step 9 — Re-recommend

Sampling remains below the role requirement, so the platform recommends the next learning stage.

This demonstrates the complete intelligence loop.

---

# 34. Team Development Split

Recommended division for a hackathon team:

## Team Member A — Frontend / Learner

Own:

- auth screens
- learner dashboard
- competency visualization
- recommendation page
- learning progress
- assessment-taking UI

## Team Member B — Frontend / Trainer + Admin

Own:

- trainer dashboard
- upload material UI
- assessment editor
- question review
- admin dashboard
- analytics components

## Team Member C — FastAPI / Core Backend

Own:

- project structure
- auth middleware
- RBAC
- database integration
- learner/profile APIs
- competency APIs
- recommendation APIs

## Team Member D — AI / RAG

Own:

- document extraction
- chunking
- embeddings
- pgvector RPC
- Gemini prompts
- MCQ generation
- validation
- mock-test pipeline

If there are fewer team members, merge frontend responsibilities first; do not merge the AI and backend responsibilities too aggressively.

---

# 35. Development Order

Do the work in this order.

## Phase 1 — Foundation

1. Create Supabase project.
2. Enable `vector` extension.
3. Run the provided SQL schema.
4. Configure Auth.
5. Configure Storage.
6. Configure FastAPI environment.
7. Verify DB connection.
8. Implement authentication + role middleware.

## Phase 2 — Core Competency Engine

1. Seed competencies.
2. Create role-to-competency mappings.
3. Create learner profiles.
4. Implement assessment submission.
5. Calculate learner competency scores.
6. Calculate skill gaps.
7. Expose learner competency APIs.

## Phase 3 — Course Recommendation

1. Seed mock iGOT courses.
2. Seed mock NSSTA/TPAC programmes.
3. Map courses to competencies.
4. Implement recommendation scoring.
5. Build learner recommendations UI.

## Phase 4 — RAG / Mock Test Pipeline

1. Upload material.
2. Store object in Supabase Storage.
3. Extract text.
4. Chunk text.
5. Generate embeddings.
6. Store `material_chunks`.
7. Verify vector search.
8. Implement Gemini generation.
9. Validate generated JSON.
10. Store questions.
11. Trainer review.
12. Publish assessment.

## Phase 5 — Assessment Loop

1. Learner starts test.
2. Save attempt.
3. Save answers.
4. Calculate score.
5. Calculate competency-specific result.
6. Update learner competencies.
7. Refresh recommendations.

## Phase 6 — Admin Analytics

1. Workforce overview.
2. Competency distribution.
3. Skill-gap analytics.
4. Training effectiveness.
5. Department comparisons.
6. Emerging/future skill view.

## Phase 7 — Integration + Polish

1. Replace/mock external course data through integration service.
2. Add real iGOT integration when API access is available.
3. Add NSSTA/TPAC integration.
4. Improve loading/error states.
5. Add logging.
6. Add security checks.
7. Prepare demo data.
8. Prepare SIH presentation/demo flow.

---

# 36. MVP Boundary

The team must avoid trying to implement every requirement at production depth.

## Mandatory demo features

### Must work

- authentication
- learner/trainer/admin roles
- learner competency profile
- skill-gap calculation
- personalized recommendation
- iGOT/NSSTA mock catalogue through an integration interface
- trainer material upload
- document processing
- embeddings + pgvector retrieval
- Gemini MCQ/mock-test generation
- trainer review
- published assessment
- learner attempt
- score + explanation
- competency update
- learner dashboard
- admin dashboard

### Nice to have

- multilingual generation
- AI chat assistant
- video transcription
- advanced predictive analytics
- real-time iGOT sync
- advanced adaptive testing
- virtual labs

Do not sacrifice the core loop to implement secondary features.

---

# 37. Important Engineering Decisions

## Decision 1 — FastAPI is the central data/application layer

React does not directly manage business logic.

## Decision 2 — Supabase Auth is identity source

Application profile data lives in `user_profiles` and role-specific tables.

## Decision 3 — pgvector is the retrieval layer

Do not send an entire PDF to Gemini and ask it to figure everything out for large materials.

Use retrieval first.

## Decision 4 — Gemini is grounded by retrieved context

Question generation must use retrieved source chunks.

## Decision 5 — Trainer approval is mandatory before publishing AI questions

Human-in-the-loop.

## Decision 6 — Competency history is preserved

Do not overwrite all previous assessment evidence.

## Decision 7 — External course sources are normalized

The recommendation engine operates on the internal course model, regardless of source.

## Decision 8 — Use mock integrations when live government APIs are unavailable

The service interface stays the same; only the data provider changes.

---

# 38. Environment Variables

FastAPI should use environment variables similar to:

```env
APP_ENV=development
APP_NAME=SIH Skill Intelligence Platform

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_URL=

GEMINI_API_KEY=
GEMINI_MODEL=

EMBEDDING_MODEL=
EMBEDDING_DIMENSION=768

IGOT_BASE_URL=
IGOT_API_KEY=
NSSTA_BASE_URL=
NSSTA_API_KEY=

VECTOR_MATCH_THRESHOLD=0.70
VECTOR_TOP_K=8
MAX_LLM_RETRIES=2
```

The exact environment variable names can differ, but secrets must never be committed to Git.

---

# 39. Error Handling

Every API should return predictable errors.

Example:

```json
{
  "error": {
    "code": "ASSESSMENT_GENERATION_FAILED",
    "message": "Unable to generate the assessment from the supplied material."
  }
}
```

Potential error categories:

```text
AUTHENTICATION_ERROR
AUTHORIZATION_ERROR
RESOURCE_NOT_FOUND
VALIDATION_ERROR
MATERIAL_PROCESSING_FAILED
EMBEDDING_FAILED
VECTOR_SEARCH_FAILED
LLM_GENERATION_FAILED
LLM_OUTPUT_INVALID
INTEGRATION_ERROR
DATABASE_ERROR
```

Frontend should display user-friendly messages while logging technical details server-side.

---

# 40. Logging

Log important backend events:

```text
user login
material upload
material processing started/completed
embedding generation
vector retrieval
Gemini call
assessment generation
assessment publish
assessment attempt
competency update
course sync
external API failure
```

Never log:

- passwords
- API keys
- service-role credentials
- sensitive tokens

---

# 41. Testing Strategy

## Backend unit tests

Test independently:

- gap calculation
- recommendation ranking
- assessment scoring
- MCQ validation
- role authorization
- chunking

## Integration tests

Test:

```text
upload → process → embed → retrieve → generate
```

and:

```text
assessment → attempt → score → competency update → recommendation
```

## Frontend tests

At minimum test:

- login routing
- role-based dashboards
- quiz submission
- material upload state
- admin filters

---

# 42. Demo Data Strategy

The hackathon demo should use a controlled dataset.

Create approximately:

```text
Departments: 3–5
Learners: 20–50
Trainers: 3–5
Admins: 2–3
Competencies: 30 starter competencies
Courses: 30–50
Training materials: 5–10
Assessments: 10–20
```

Create visibly different competency profiles so the recommendation engine produces different outputs for different users.

Example:

```text
Learner A → weak Python
Learner B → weak Sampling
Learner C → weak Cybersecurity
```

This makes personalization obvious during the demo.

---

# 43. Final SIH Demo Story

The demo should follow one person and one organizational view.

### Scene 1 — Learner logs in

Show profile and competency radar/bar chart.

### Scene 2 — AI detects gaps

Show:

```text
Sampling: High Gap
Python: High Gap
```

### Scene 3 — Personalized recommendation

Show:

```text
iGOT Course
NSSTA/TPAC Training Programme
```

### Scene 4 — Trainer uploads source material

Upload a real statistical PDF.

### Scene 5 — AI generates mock test

Show:

```text
Retrieve relevant chunks
↓
Generate MCQs
↓
Preview
```

### Scene 6 — Trainer validates

Edit/approve and publish.

### Scene 7 — Learner attempts

Show questions, score and explanations.

### Scene 8 — Competency changes

Show:

```text
Sampling: 42 → 68
```

### Scene 9 — Recommendations change

Show the next course.

### Scene 10 — Admin view

Show organization-level insight:

```text
Sampling gap affects 37% of workforce.
Python gap affects 29%.
```

This completes the story:

```text
Assess → Gap → Recommend → Learn → Assess → Improve → Monitor
```

---

# 44. Definition of Done

A feature is considered complete when:

- the API has validation
- authorization is enforced
- database writes are constrained
- frontend has loading/error states
- AI output is validated
- failures are logged
- demo data exists
- the feature works end-to-end through the UI

Do not consider a feature complete just because the endpoint works in Postman.

---

# 45. Final Architecture Summary

```text
                           SIH PLATFORM
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
          Learner            Trainer             Admin
             │                  │                  │
             └──────────────────┼──────────────────┘
                                ↓
                         React + Vite
                                ↓
                              FastAPI
                                │
           ┌────────────────────┼────────────────────┐
           │                    │                    │
      Competency           Recommendation         Assessment
       Engine                  Engine              Engine
           │                    │                    │
           │             ┌──────┴──────┐             │
           │             │             │             │
           │           iGOT         NSSTA            │
           │                                        │
           └────────────────┬───────────────────────┘
                            ↓
                       Supabase DB
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
       Auth              Storage          PostgreSQL
                                            │
                                         pgvector
                                            ↑
                                            │
                                      RAG Retrieval
                                            ↑
                                            │
                                    Material Chunks
                                            ↑
                                            │
                                     Uploaded Files
                                            │
                                         Trainer

                          Gemini API
                              ↑
                              │
                    Grounded retrieved context
                              │
                         Question Generator
```

## Core principle

**Profile → Assess → Detect Gap → Recommend → Learn → Assess → Update → Recommend Again.**

The MCQ/mock-test system is not isolated. It is an assessment mechanism that feeds evidence back into the competency intelligence system.

The admin layer turns individual competency data into organization-level workforce intelligence.

The trainer layer turns learning material into reviewed, publishable assessments.

The learner layer turns recommendations and assessments into measurable competency improvement.

---

# 46. Immediate Team Checklist

Before anyone starts implementing feature work:

```text
[ ] Supabase project created
[ ] SQL schema applied
[ ] vector extension enabled
[ ] Auth configured
[ ] Storage bucket configured
[ ] FastAPI project bootstrapped
[ ] Environment variables configured
[ ] React app bootstrapped
[ ] API client created
[ ] Auth/RBAC working
[ ] Competencies seeded
[ ] Role competencies seeded
[ ] Mock iGOT/NSSTA courses seeded
[ ] Learner dashboard skeleton ready
[ ] Trainer upload flow ready
[ ] pgvector retrieval verified
[ ] Gemini generation verified
[ ] Assessment publish flow verified
[ ] Learner assessment flow verified
[ ] Competency update verified
[ ] Admin analytics verified
```

Once these are complete, the project has a working end-to-end foundation for the SIH demonstration.
