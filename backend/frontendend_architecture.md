# SIH 2026 — Frontend Architecture

## React + Vite + Tailwind CSS

### Derived from `architecture.md`

---

# 1. Purpose

This document defines the frontend architecture for the SIH 2026 AI Skill Intelligence & Learning Platform.

It is derived from the finalized backend/system architecture and is intended to let the frontend team build the application **against the completed FastAPI backend** without introducing business logic into React.

The frontend is responsible for:

- presentation
- client-side interaction
- routing
- page rendering
- form state
- dashboard visualizations
- assessment UI
- file upload UI
- loading/error states
- authenticated API calls

The frontend must **not** contain:

- Gemini API keys
- Supabase service-role keys
- database credentials
- competency/recommendation business logic
- authoritative scoring formulas
- privileged integration credentials

All business decisions are made by FastAPI.

---

# 2. Core Frontend Principle

The frontend visualizes and orchestrates the backend's competency loop:

```text
Learner Profile
      ↓
Competency Assessment
      ↓
Skill Gap
      ↓
Recommendation
      ↓
Learning
      ↓
Assessment
      ↓
Assessment Result
      ↓
Updated Competency
      ↓
Updated Skill Gap
      ↓
Next Recommendation
```

The frontend should make this loop visible to the user rather than behaving like a generic LMS.

---

# 3. Technology Stack

## Core

- React
- Vite
- Tailwind CSS
- React Router
- TypeScript recommended

## Backend communication

- REST JSON over HTTPS
- FastAPI as the application API
- Supabase Auth for identity

## Visualization

Use a charting library suitable for React for:

- competency bars
- competency domain charts
- progress trends
- workforce analytics
- skill-gap distributions

## Frontend data handling

Use a server-state library such as TanStack Query if available in the team stack. Otherwise use a small API/query abstraction around `fetch`.

Avoid duplicating backend state unnecessarily in global React state.

---

# 4. Application Roles

The finalized architecture defines three application roles:

```text
LEARNER
TRAINER
ADMIN
```

The original architecture later discusses privileged platform administration / Super Admin conceptually. If the implemented backend exposes a separate `super_admin` role, the frontend should support it through the same RBAC mechanism rather than hard-coding special pages in components.

### Learner

The official/employee consuming learning and taking assessments.

Can:

- log in
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
- view competency improvement over time

Default learner material upload is disabled unless product policy explicitly permits it.

### Trainer

Owns the learning-content-to-assessment workflow.

Can:

- manage learning materials
- upload PDF/DOCX/PPTX/TXT and supported media
- trigger processing
- generate MCQs/quizzes/mock tests
- review AI-generated questions
- edit questions/options/explanations
- approve/reject questions
- publish/archive assessments
- inspect source material/chunks used for questions
- view performance for trainer-owned assessments

### Admin

Owns organization-level workforce intelligence.

Can:

- view workforce competency distribution
- view department-level skill gaps
- view designation-level competency gaps
- view training participation/completion
- view assessment performance
- monitor training effectiveness
- identify high-priority workforce gaps
- manage departments
- manage competency framework
- manage role-to-competency requirements
- manage user roles
- verify trainers
- manage course catalogue metadata when required

---

# 5. Frontend Application Structure

Recommended project structure:

```text
frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   ├── providers.tsx
│   │   └── routeGuards.tsx
│   │
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.api.ts
│   │   ├── learner.api.ts
│   │   ├── competency.api.ts
│   │   ├── course.api.ts
│   │   ├── recommendation.api.ts
│   │   ├── material.api.ts
│   │   ├── assessment.api.ts
│   │   └── admin.api.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── competency/
│   │   ├── assessment/
│   │   ├── recommendation/
│   │   ├── courses/
│   │   ├── materials/
│   │   ├── trainer/
│   │   └── admin/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── learner/
│   │   ├── trainer/
│   │   ├── admin/
│   │   ├── competency/
│   │   ├── recommendations/
│   │   └── assessments/
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCurrentUser.ts
│   │   ├── useCompetencies.ts
│   │   ├── useRecommendations.ts
│   │   └── useAssessment.ts
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── queryClient.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── competency.ts
│   │   ├── course.ts
│   │   ├── recommendation.ts
│   │   ├── material.ts
│   │   └── assessment.ts
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── learner/
│   │   ├── trainer/
│   │   └── admin/
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   └── main.tsx
│
├── public/
└── package.json
```

Keep route/page code separate from reusable UI components.

---

# 6. Routing Architecture

## Public routes

```text
/
/login
/signup
/forgot-password
```

Optional:

```text
/unauthorized
/not-found
/error
```

## Learner routes

```text
/learner
/learner/profile
/learner/competencies
/learner/gaps
/learner/learning
/learner/courses
/learner/courses/:id
/learner/assessments
/learner/assessments/:id
/learner/assessments/:id/attempt
/learner/attempts/:attemptId/result
/learner/progress
```

## Trainer routes

```text
/trainer
/trainer/materials
/trainer/materials/new
/trainer/materials/:id
/trainer/assessments
/trainer/assessments/new
/trainer/assessments/:id
/trainer/assessments/:id/edit
/trainer/assessments/:id/review
/trainer/assessments/:id/preview
/trainer/assessments/:id/publish
```

## Admin routes

```text
/admin
/admin/workforce
/admin/competencies
/admin/skill-gaps
/admin/training-effectiveness
/admin/departments
/admin/trainers
/admin/roles
/admin/courses
```

If the backend exposes Super Admin pages, add:

```text
/super-admin
/super-admin/users
/super-admin/organizations
/super-admin/settings
```

---

# 7. Route Protection

Authentication and authorization happen server-side, but the frontend must also protect the user experience.

Flow:

```text
Open protected route
      ↓
Is Supabase session present?
      ├── No → /login
      └── Yes
            ↓
       Load /auth/me
            ↓
       Read application role
            ↓
       Check allowed route
            ├── allowed → render page
            └── denied → /unauthorized
```

Frontend route guards are for UX only. FastAPI remains authoritative.

Never assume that hiding a sidebar item is a security control.

---

# 8. Authentication Flow

Supabase Auth is the identity provider.

```text
User enters credentials
      ↓
Supabase Auth
      ↓
Access token/session
      ↓
Frontend API client
      ↓
FastAPI
      ↓
Validate token
      ↓
Load user_profiles.role
```

After successful authentication:

```text
/login
  ↓
GET /api/v1/auth/me
  ↓
Load profile + role
  ↓
Redirect to correct dashboard
```

Role-to-dashboard:

```text
learner → /learner
trainer → /trainer
admin   → /admin
```

If Super Admin exists:

```text
super_admin → /super-admin
```

---

# 9. Global Layout

Use a consistent application shell for authenticated users.

```text
┌─────────────────────────────────────────────────────────┐
│ Top Bar                                                 │
│ Logo | Page title | Notifications | Profile             │
├───────────────┬─────────────────────────────────────────┤
│ Sidebar       │ Main content                            │
│               │                                         │
│ Dashboard     │                                         │
│ Competencies  │                                         │
│ Assessments   │                                         │
│ Learning      │                                         │
│ Courses       │                                         │
│ Progress      │                                         │
│               │                                         │
│ Role-specific │                                         │
│ items         │                                         │
└───────────────┴─────────────────────────────────────────┘
```

Sidebar entries are role-dependent.

### Learner sidebar

```text
Dashboard
Competencies
Skill Gaps
Learning Path
Courses
Assessments
Progress
Profile
```

### Trainer sidebar

```text
Dashboard
Materials
Assessment Studio
Published Assessments
Performance
Profile
```

### Admin sidebar

```text
Dashboard
Workforce
Competencies
Skill Gaps
Training Effectiveness
Departments
Trainers
Roles
Courses
```

---

# 10. Shared UI Components

Create reusable primitives first.

## Layout

```text
AppShell
Sidebar
TopBar
PageHeader
Breadcrumbs
ContentContainer
```

## Feedback

```text
LoadingSpinner
SkeletonCard
SkeletonTable
ErrorState
EmptyState
SuccessToast
ErrorToast
ConfirmDialog
```

## Data display

```text
StatCard
ProgressBar
ProgressRing
Badge
StatusBadge
DataTable
Pagination
FilterBar
SearchInput
```

## Competency

```text
CompetencyCard
CompetencyProgressBar
CompetencyLevelBadge
CompetencyRadar
SkillGapCard
SkillGapList
CompetencyDomainCard
```

## Recommendations

```text
RecommendationCard
RecommendationList
LearningPath
LearningPathStep
CourseCard
CourseSourceBadge
```

## Assessment

```text
AssessmentCard
AssessmentHeader
QuestionCard
MCQOption
QuestionNavigator
AssessmentTimer
AssessmentProgress
AssessmentSubmitDialog
AssessmentResult
SkillResultCard
ExplanationCard
```

## Trainer

```text
FileDropzone
UploadProgress
ProcessingStatus
MaterialCard
GenerationSettings
QuestionEditor
QuestionReviewCard
SourceReferenceCard
PublishDialog
```

## Admin

```text
KPIGrid
CompetencyChart
SkillGapTable
DepartmentComparison
TrainingEffectivenessChart
WorkforceDistribution
```

---

# 11. Learner Experience

## 11.1 Learner Dashboard

Route:

```text
/learner
```

Backend sources:

```text
GET /api/v1/learners/me
GET /api/v1/learners/me/competencies
GET /api/v1/learners/me/gaps
GET /api/v1/learners/me/recommendations
GET /api/v1/learners/me/progress
GET /api/v1/learners/me/assessments
```

The dashboard must show:

```text
Welcome, [Name]

Overall Competency: 68/100

Top Skill Gaps
[Sampling] [Python] [Data Visualization]

Recommended Next Step
[Advanced Sampling Course]

Recent Assessment
82%

Competency Trend
[chart]

Learning Activity
[recent courses / assessments]
```

The dashboard should not calculate the 68/100 value. It renders the backend result.

---

# 12. Learner Profile

Route:

```text
/learner/profile
```

Backend:

```text
GET /api/v1/learners/me
PUT /api/v1/learners/me
```

Show:

- name
- designation
- department
- education
- years of experience
- career goal
- employee code where permitted
- joining date where permitted
- current overall score

Editable fields must be driven by backend permissions.

---

# 13. Competency Page

Route:

```text
/learner/competencies
```

Backend:

```text
GET /api/v1/learners/me/competencies
```

Show five competency levels:

```text
1 = Beginner
2 = Basic
3 = Intermediate
4 = Advanced
5 = Expert
```

Each competency also has a 0–100 score.

Primary view:

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

Individual competency drill-down should show:

```text
Competency name
Current level
Current score
Required level
Gap
Related skills
Recent evidence/assessments
Recommended next step
```

---

# 14. Skill Gap Page

Route:

```text
/learner/gaps
```

Backend:

```text
GET /api/v1/learners/me/gaps
```

Recommended layout:

```text
Critical gaps

Sampling
Current: 42
Required: Level 4
Gap: High

Python
Current: 34
Required: Level 3
Gap: High

Data Visualization
Current: 61
Required: Level 3
Gap: Moderate
```

The frontend should consume the backend's gap priority/reason information.

Do not independently calculate priority in React.

---

# 15. Mandatory Diagnostic Assessment UX

The mandatory competency assessment is part of onboarding for a new learner.

Suggested flow:

```text
Login
 ↓
Profile loaded
 ↓
Role/designation loaded
 ↓
If diagnostic required
 ↓
Show onboarding assessment screen
```

The architecture does not specify a dedicated `GET diagnostic` endpoint. If the completed backend exposes a dedicated endpoint, use it. Otherwise use the competency/assessment APIs exposed by the backend.

### Mandatory assessment intro screen

Show:

```text
Competency Diagnostic Assessment

Role: Statistical Officer

Purpose:
Establish your current competency baseline.

This is not a training course.
Your results will be used to identify skill gaps
and recommend learning.

[Start Assessment]
```

Do not show the learner the correct answers during the diagnostic.

---

# 16. Assessment Taking UI

Route:

```text
/learner/assessments/:id/attempt
```

Start attempt:

```text
POST /api/v1/assessments/{id}/attempts
```

Then render the assessment returned by the backend.

Recommended layout:

```text
┌─────────────────────────────────────────────────┐
│ Assessment title                  Question 4/20 │
│ ███████░░░░░░░░░░░ 20%                         │
├─────────────────────────────────────────────────┤
│                                                 │
│ Q4. Which ...?                                  │
│                                                 │
│ ○ Option A                                      │
│ ○ Option B                                      │
│ ○ Option C                                      │
│ ○ Option D                                      │
│                                                 │
├─────────────────────────────────────────────────┤
│ [Previous]                       [Next]          │
└─────────────────────────────────────────────────┘
```

If the backend provides a timed assessment, show a timer. Do not invent a timer requirement when the backend does not provide one.

### Required interaction behavior

- preserve selected answer while navigating
- prevent accidental loss of progress
- show question number
- show answered/unanswered state
- allow navigation according to assessment rules
- show submit confirmation
- disable double submission
- show network failure state without destroying local selections

---

# 17. Assessment Question Navigator

For larger assessments:

```text
Questions

1 ✓
2 ✓
3 ✓
4 ●
5 ○
6 ○
7 ○
...
```

Legend:

```text
✓ answered
● current
○ unanswered
```

The backend remains authoritative for the assessment definition and attempt.

---

# 18. Submit Assessment

Flow:

```text
Learner answers questions
      ↓
Frontend stores local selections
      ↓
Learner selects Submit
      ↓
Confirmation dialog
      ↓
POST /api/v1/attempts/{id}/submit
      ↓
Disable submission controls
      ↓
Receive result
      ↓
Navigate to result page
```

If submission fails:

```text
Submission failed

Your answers are still present.
Please try again.
```

Never silently clear answers after a failed request.

---

# 19. Assessment Result Page

Route:

```text
/learner/attempts/:attemptId/result
```

Backend:

```text
GET /api/v1/attempts/{id}
```

Do not show only:

```text
Score = 82%
```

The architecture requires competency-specific results.

Show:

```text
Assessment Result

Overall Score
82/100

Sampling
72%

Survey Design
91%

Data Quality
60%
```

Also show explanations where returned.

---

# 20. Competency Improvement Visualization

After a post-learning assessment, show the before/after change when historical evidence exists.

Example:

```text
Sampling

Before     42%
After      68%

              +26 points

████░░░░░░ 42%
███████░░░ 68%
```

This visual directly communicates the platform's value.

The backend retains historical assessment evidence in `competency_assessments` and current state in `learner_competencies`.

The frontend should display both when available.

---

# 21. Recommendation Page

Route:

```text
/learner/learning
```

Backend:

```text
GET /api/v1/learners/me/recommendations
```

Each recommendation should render:

```text
Course title
Source: iGOT / NSSTA / TPAC / internal
Competency gap addressed
Current competency
Required competency/level
Reason
Rank
CTA
```

Example:

```text
Advanced Survey Sampling

SOURCE
iGOT

ADDRESSES
Sampling

WHY THIS IS RECOMMENDED
Your current Sampling score is 41/100
while your role requires Level 4.

[Open Course]
```

The `reason` should come from the backend whenever possible.

---

# 22. Learning Path UI

The recommendation experience should be presented as a learning path instead of a flat list when the backend returns ordered recommendations.

Example:

```text
Your Learning Path

1. Sampling Fundamentals          ✓
       iGOT

2. Advanced Survey Sampling       → Current
       iGOT

3. Survey Methodology Programme   ○
       NSSTA / TPAC

4. Sampling Reassessment           ○
       Platform
```

The frontend should not mark a course as completed based on a local button click unless the backend confirms completion.

---

# 23. Course Catalogue UI

Route:

```text
/learner/courses
```

Backend:

```text
GET /api/v1/courses
```

Course source types:

```text
iGOT
NSSTA/TPAC
internal
```

Course card:

```text
Course title
Provider
Source badge
Competency
Duration
Difficulty
Short description
[View]
```

Course detail route:

```text
/learner/courses/:id
```

Backend:

```text
GET /api/v1/courses/{id}
```

Show the normalized course fields:

- external_id if needed for debugging/admins
- title
- provider_name
- source
- description
- URL
- duration
- difficulty
- metadata
- mapped competencies

External courses should be opened using the URL supplied by the backend.

---

# 24. Learner Progress Page

Route:

```text
/learner/progress
```

Backend:

```text
GET /api/v1/learners/me/progress
```

Show:

```text
Competency improvement
Assessment history
Learning activity
Learning hours
Recent course activity
```

Primary visualization:

```text
Competency trend over time

100 ┤
 80 ┤                  ●
 60 ┤          ●
 40 ┤   ●
 20 ┤
    └──────────────────────
      Jan   Feb   Mar   Apr
```

---

# 25. Handling a Learner with No Competency History

If the backend indicates the learner has no diagnostic history:

```text
No competency baseline yet.

Complete your mandatory diagnostic assessment
to generate your competency profile.

[Start Diagnostic]
```

Do not display fake zeroes as if they are measured competency.

---

# 26. Handling a Learner with No Gaps

If the learner meets all role requirements:

```text
You currently meet the required competency
level for your assigned role.

No mandatory remedial learning is required.

Recommended options:

[Explore Advanced Learning]
[View All Courses]
[View Progress]
```

The frontend should render this based on backend recommendation/gap state.

---

# 27. Handling a Learner Who Scores 100%

Do not show:

```text
You have completed the platform.
```

Instead:

```text
Diagnostic Result

100/100

All assessed competencies met or exceeded
the required level for your role.

Status: Requirement Met

Next options:
• Advanced learning
• Specialization
• Periodic reassessment
• View competency profile
```

This supports the architecture's gap-based recommendation model.

---

# 28. Trainer Dashboard

Route:

```text
/trainer
```

Show:

```text
Materials                  12
Draft Assessments           4
Published Assessments       8
Total Attempts            432
Average Score              78%
```

Main actions:

```text
[Upload Material]
[Generate Assessment]
[Review Drafts]
[View Performance]
```

Backend data should drive all totals.

---

# 29. Trainer Material Page

Route:

```text
/trainer/materials
```

Backend:

```text
GET /api/v1/materials
```

Material card should show:

- title/name
- type
- processing status
- upload time
- owner
- processing error if any
- action

Statuses:

```text
pending
processing
completed
failed
```

Do not invent additional backend statuses unless the API supports them.

---

# 30. Material Upload Flow

Route:

```text
/trainer/materials/new
```

Backend:

```text
POST /api/v1/materials
```

Upload UI:

```text
┌───────────────────────────────────────────┐
│ Drag & drop file here                     │
│                                           │
│ PDF / DOCX / PPTX / TXT                   │
│                                           │
│ [Choose File]                             │
└───────────────────────────────────────────┘

[Upload]
```

After upload:

```text
Upload complete

Material processing
  ↓
Chunking
  ↓
Embeddings
  ↓
Vector indexing
```

The frontend can poll the material detail endpoint or use the backend's supported update mechanism.

---

# 31. Material Processing Status

Route:

```text
/trainer/materials/:id
```

Backend:

```text
GET /api/v1/materials/{id}
```

Display:

```text
Material: Survey_Sampling.pdf

Status: Processing

✓ Uploaded
✓ Extracted
✓ Chunked
→ Embedding
○ Indexed
```

If status is `completed`:

```text
Material ready.

[Generate Assessment]
```

If `failed`:

```text
Processing failed.

[View Error]
[Retry Processing]
```

Use the backend's processing endpoint:

```text
POST /api/v1/materials/{id}/process
```

---

# 32. Trainer Assessment Studio

Route:

```text
/trainer/assessments/new
```

Backend generation endpoint:

```text
POST /api/v1/assessments/generate
```

Settings form:

```text
Source Material       [select]
Question Count        [15]
Difficulty             [Medium]
Assessment Type        [Mock Test]
Competency             [Sampling]
Topic / Query          [optional]

[Generate]
```

The frontend collects these settings and sends them to FastAPI.

It must not build the RAG prompt.

---

# 33. Generated Assessment Review

The backend pipeline is:

```text
Trainer request
↓
Validate
↓
Retrieve chunks
↓
Gemini
↓
JSON validation
↓
Draft assessment
↓
Trainer review
↓
Publish
```

The frontend should mirror this workflow visibly.

### Review page

Route:

```text
/trainer/assessments/:id/review
```

Each question:

```text
Question 1

[Question text]

A. ...
B. ...
C. ...
D. ...

Correct answer: B

Explanation:
...

Competency: Sampling
Difficulty: Medium

Source:
Survey_Sampling.pdf
Chunk: ...

[Edit] [Approve] [Reject]
```

The architecture explicitly requires trainer approval before publication.

---

# 34. Assessment Editing

Route:

```text
/trainer/assessments/:id/edit
```

Editable fields should correspond to backend-supported assessment/question update fields.

Typical fields:

```text
Question text
Option A
Option B
Option C
Option D
Correct option
Explanation
Competency
Difficulty
```

Avoid adding frontend-only question metadata that the backend cannot persist.

---

# 35. Assessment Publish Flow

Route:

```text
/trainer/assessments/:id/publish
```

Backend:

```text
POST /api/v1/assessments/{id}/publish
```

Publish confirmation should display:

```text
Publish assessment?

After publication, learners can attempt this assessment.

[Cancel] [Publish]
```

After success:

```text
Assessment published successfully.
```

Assessment states:

```text
draft
published
archived
```

---

# 36. Trainer Assessment List

Route:

```text
/trainer/assessments
```

Backend:

```text
GET /api/v1/assessments
```

Columns:

```text
Title
Type
Competency
Status
Questions
Created
Attempts
Actions
```

Filters:

```text
Status
Assessment type
Competency
Difficulty
```

---

# 37. Trainer Performance Page

The architecture permits trainers to view learner assessment performance for trainer-owned assessments.

Possible view:

```text
Assessment: Sampling Mock Test

Attempts: 120
Average score: 74%

Question performance
Q1  94%
Q2  81%
Q3  48%
Q4  77%
```

Where the backend provides competency-level aggregation, show:

```text
Sampling        71%
Survey Design   83%
Data Quality    59%
```

Do not calculate organizational analytics in the trainer UI.

---

# 38. Admin Dashboard

Route:

```text
/admin
```

Backend:

```text
GET /api/v1/admin/overview
```

Core cards:

```text
Total Officials
Active Learners
Verified Trainers
Average Competency Score
High-Priority Skill Gaps
Course Completion Rate
Assessment Effectiveness
```

Below KPIs:

```text
Competency Distribution
Department Comparison
Top Skill Gaps
Training Effectiveness
Emerging Skills
Future Skill Requirement
```

---

# 39. Admin Workforce Page

Route:

```text
/admin/workforce
```

Backend:

```text
GET /api/v1/admin/departments
GET /api/v1/admin/competencies
```

Potential table:

```text
Department
Officials
Avg competency
Below required level
Top gap
Training completion
```

Filters:

```text
Department
Designation
Competency
Score range
```

---

# 40. Admin Competency Analytics

Route:

```text
/admin/competencies
```

Backend:

```text
GET /api/v1/admin/competencies
```

Show:

```text
Average score by competency
Average score by department
Average score by designation
Percentage above required level
```

Example:

```text
Sampling
41% proficient

AI/ML
24% proficient

Python
46% proficient

Cybersecurity
79% proficient
```

---

# 41. Admin Skill Gap Analytics

Route:

```text
/admin/skill-gaps
```

Backend:

```text
GET /api/v1/admin/skill-gaps
```

Show:

```text
Top organizational gaps
Affected officials
Average gap
Required level
Current average
Department spread
Top recommended courses
```

Example:

```text
Sampling

41% proficient

Affected officials: 312
Required level: 4
Average current level: 2.1

[View Departments]
[View Recommended Training]
```

---

# 42. Admin Training Effectiveness

Route:

```text
/admin/training-effectiveness
```

Backend:

```text
GET /api/v1/admin/training-effectiveness
```

Architecture expects training-effectiveness measures such as:

```text
Enrollment
Completion
Pre-assessment score
Post-assessment score
Average improvement
```

Recommended visualization:

```text
Course / Programme

Pre: 52%
Post: 73%
Improvement: +21
```

---

# 43. Admin Department Comparison

Route:

```text
/admin/departments
```

Backend:

```text
GET /api/v1/admin/departments
```

Compare:

```text
Department A   68%
Department B   61%
Department C   76%
```

Support selecting a department to drill down into competency and skill gaps.

---

# 44. Admin Trainer Management

Route:

```text
/admin/trainers
```

Admin capabilities include trainer verification.

UI:

```text
Trainer name
Organization
Specialization
Verification state
Verifier
Timestamp

[Verify]
[View Profile]
```

Do not expose backend-only verification operations in the UI unless the API supports them.

---

# 45. Admin Role and Competency Management

Routes:

```text
/admin/roles
/admin/competencies
```

These pages are particularly important because the architecture makes `role_competencies` the source of role requirements.

### Role page

Show:

```text
Role: Statistical Officer

Required Competencies

Python                 Level 3
SQL                    Level 3
Survey Sampling        Level 4
Data Visualization     Level 3
```

The frontend should support management UI only if corresponding backend APIs exist.

The backend remains the authority for:

- required levels
- role weights
- competency relevance
- gap calculation

---

# 46. Course Catalogue Management

Admin route:

```text
/admin/courses
```

Backend:

```text
GET /api/v1/courses
POST /api/v1/courses/sync/igot
POST /api/v1/courses/sync/nssta
```

Admin UI may show:

```text
Source
Course
Mapped Competencies
Difficulty
Duration
Sync status
```

The frontend should treat the integration as a backend responsibility.

It should never call iGOT directly.

---

# 47. API Client Architecture

Create a single authenticated HTTP client.

Example responsibility:

```text
api/client.ts

- attach Supabase access token
- parse JSON
- normalize API errors
- handle 401
- handle network failures
```

Then domain APIs:

```text
assessment.api.ts
competency.api.ts
recommendation.api.ts
course.api.ts
material.api.ts
admin.api.ts
```

Example conceptual usage:

```ts
const result = await assessmentApi.submitAttempt(attemptId, payload);
```

Components should not contain raw fetch URLs.

---

# 48. API Contract Mapping

## Authentication

```text
POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

## Learner

```text
GET /api/v1/learners/me
PUT /api/v1/learners/me
GET /api/v1/learners/me/competencies
GET /api/v1/learners/me/gaps
GET /api/v1/learners/me/recommendations
GET /api/v1/learners/me/progress
GET /api/v1/learners/me/assessments
```

## Competencies

```text
GET  /api/v1/competencies
GET  /api/v1/competencies/{id}
POST /api/v1/competencies/assess
GET  /api/v1/competencies/roles/{designation}
```

## Courses

```text
GET  /api/v1/courses
GET  /api/v1/courses/{id}
POST /api/v1/courses/sync/igot
POST /api/v1/courses/sync/nssta
```

## Recommendations

```text
POST /api/v1/recommendations/generate
GET  /api/v1/recommendations/me
POST /api/v1/recommendations/{id}/dismiss
```

## Materials

```text
POST   /api/v1/materials
GET    /api/v1/materials
GET    /api/v1/materials/{id}
POST   /api/v1/materials/{id}/process
DELETE /api/v1/materials/{id}
```

## Assessments

```text
POST /api/v1/assessments/generate
GET  /api/v1/assessments
GET  /api/v1/assessments/{id}
PUT  /api/v1/assessments/{id}
POST /api/v1/assessments/{id}/publish
POST /api/v1/assessments/{id}/archive
```

## Attempts

```text
POST /api/v1/assessments/{id}/attempts
POST /api/v1/attempts/{id}/submit
GET  /api/v1/attempts/{id}
```

## Admin

```text
GET /api/v1/admin/overview
GET /api/v1/admin/competencies
GET /api/v1/admin/skill-gaps
GET /api/v1/admin/training-effectiveness
GET /api/v1/admin/departments
GET /api/v1/admin/emerging-skills
```

---

# 49. Frontend Type Model

Types should mirror backend response schemas.

Do not invent a different semantic model in React.

Suggested TypeScript types:

```ts
export type UserRole = 'learner' | 'trainer' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
  department_id?: string | null;
  designation?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
}

export interface Competency {
  id: string;
  name: string;
  domain?: string;
}

export interface LearnerCompetency {
  competency_id: string;
  competency_name: string;
  level: number;
  score: number;
  required_level?: number;
  gap?: number;
}

export interface Course {
  id: string;
  external_id?: string | null;
  title: string;
  provider_name?: string | null;
  source: 'igot' | 'nssta_tpac' | 'internal';
  description?: string | null;
  url?: string | null;
  duration_minutes?: number | null;
  difficulty?: string | null;
  metadata?: Record<string, unknown>;
}
```

Exact property names must follow the actual FastAPI schemas.

---

# 50. Server State vs UI State

## Server state

Use query/cache management for:

- profile
- competencies
- skill gaps
- recommendations
- courses
- materials
- assessments
- attempts
- admin analytics

## Local/UI state

Use component/local state for:

- modal open/close
- selected tab
- search input
- assessment answer selections before submission
- upload drag state
- expanded question
- temporary form fields

Do not copy backend competency scores into global state and mutate them locally.

---

# 51. Assessment Answer State

For the assessment-taking UI:

```ts
answers = {
  [questionId]: selectedOptionId
}
```

Behavior:

- persist while navigating within the attempt
- preserve on temporary network failure
- validate before submission
- clear only after confirmed completed submission/navigation

For a multi-page assessment, keep the attempt state at the assessment page/layout level, not only inside a single question component.

---

# 52. File Upload State

Recommended state model:

```text
idle
selecting
uploading
uploaded
processing
completed
failed
```

Backend material processing itself may use:

```text
pending
processing
completed
failed
```

The frontend may maintain ephemeral UI upload state separately from persisted backend processing state.

---

# 53. Loading States

Every data-dependent page needs an intentional loading state.

Examples:

```text
Dashboard skeleton
Competency cards skeleton
Course card skeleton
Assessment list skeleton
Admin chart skeleton
Material processing state
```

Do not show a blank page while waiting for API responses.

---

# 54. Error States

Normalize backend error responses such as:

```json
{
  "error": {
    "code": "ASSESSMENT_GENERATION_FAILED",
    "message": "Unable to generate the assessment from the supplied material."
  }
}
```

Frontend mapping:

```text
AUTHENTICATION_ERROR
→ Please sign in again.

AUTHORIZATION_ERROR
→ You do not have permission to access this page.

RESOURCE_NOT_FOUND
→ The requested resource could not be found.

VALIDATION_ERROR
→ Please check the entered information.

MATERIAL_PROCESSING_FAILED
→ The material could not be processed.

EMBEDDING_FAILED
→ The material indexing step failed.

VECTOR_SEARCH_FAILED
→ The assessment context could not be retrieved.

LLM_GENERATION_FAILED
→ AI generation failed. Please retry.

LLM_OUTPUT_INVALID
→ The generated assessment failed validation. Please retry.

INTEGRATION_ERROR
→ External course data is temporarily unavailable.

DATABASE_ERROR
→ We could not save your changes.
```

Technical stack traces must not be displayed to users.

---

# 55. Empty States

Examples:

### No recommendations

```text
No active skill gaps found.

You currently meet the required competency level.
```

### No assessments

```text
No assessments available.

Your trainer will publish assessments here.
```

### No materials

```text
No training materials uploaded yet.

[Upload Material]
```

### No competency history

```text
No competency baseline has been established.

[Start Diagnostic]
```

---

# 56. Accessibility Expectations

Minimum frontend requirements:

- keyboard navigable controls
- visible focus state
- labels for form controls
- semantic buttons and links
- sufficient contrast
- error messages associated with inputs
- assessment choices usable without mouse
- charts accompanied by textual values
- do not rely on color alone to communicate score status

For example:

```text
Sampling — 42% — High Gap
```

not only a red bar.

---

# 57. Responsive Design

The platform should work on:

- desktop
- laptop
- tablet

Assessment UI should prioritize readability over dense dashboard layouts.

Admin analytics can use wider layouts but should collapse gracefully.

Suggested responsive hierarchy:

```text
Desktop:
Sidebar + content

Tablet:
Collapsed sidebar + content

Mobile/tablet narrow:
Drawer navigation + single-column content
```

---

# 58. Design System Direction

Tailwind should use a consistent semantic system instead of ad hoc colors throughout components.

Recommended semantic states:

```text
success
warning
critical
info
neutral
```

Competency status:

```text
High Gap       → critical
Moderate Gap   → warning
Requirement Met → success
Informational  → info
```

Do not hard-code semantic status only through color; include labels/icons/text.

---

# 59. Competency Visualization Rules

Score ranges should visually communicate state but remain driven by backend state.

Example:

```text
0–39   Needs foundational development
40–59  Developing
60–74  Competent
75–89  Proficient
90–100 Advanced
```

These labels are a frontend presentation convention unless the backend sends authoritative labels.

If the backend provides a competency level directly, prefer that value over recomputing one locally.

---

# 60. Learner End-to-End Frontend Flow

The complete learner journey should look like this:

```text
/login
  ↓
/auth/me
  ↓
/learner
  ↓
Check competency history
  ↓
If diagnostic required
  ↓
Mandatory Diagnostic
  ↓
Assessment Result
  ↓
Competency Profile
  ↓
Skill Gaps
  ↓
Recommendations
  ↓
iGOT / NSSTA / TPAC learning
  ↓
Return to Learning Path
  ↓
Practice / Mock Test
  ↓
Assessment Result
  ↓
Competency Improvement
  ↓
Updated Skill Gaps
  ↓
Updated Recommendations
```

The architecture's final product loop is:

```text
Assess → Gap → Recommend → Learn → Assess → Improve → Monitor
```

---

# 61. Trainer End-to-End Frontend Flow

```text
/trainer
  ↓
Upload Material
  ↓
Material Processing
  ↓
Processing Completed
  ↓
Generate Assessment
  ↓
Generation
  ↓
Draft Assessment
  ↓
Review Questions
  ↓
Edit / Approve / Reject
  ↓
Publish
  ↓
Learners can attempt
  ↓
Trainer Performance
```

The frontend should make the human-in-the-loop step obvious.

---

# 62. Admin End-to-End Frontend Flow

```text
/admin
  ↓
Workforce Overview
  ↓
Competency Distribution
  ↓
Skill Gap Analysis
  ↓
Department Comparison
  ↓
Training Effectiveness
  ↓
Role / Competency Configuration
  ↓
Trainer Management
```

---

# 63. Frontend Behavior Around iGOT

The frontend never directly integrates with iGOT.

Correct:

```text
React
  ↓
FastAPI
  ↓
Integration Service
  ↓
iGOT / Mock iGOT
```

The UI should simply display the normalized course returned by FastAPI.

A course card should not care whether the course came from:

- live iGOT
- mocked iGOT data
- NSSTA
- internal training

Use the `source` returned by the backend to display the source badge.

---

# 64. Frontend Behavior Around AI

The frontend should expose AI functionality through workflows rather than direct model calls.

Correct:

```text
Trainer clicks Generate
      ↓
FastAPI assessment generation endpoint
      ↓
RAG + Gemini
      ↓
Validated draft
      ↓
Frontend receives draft
```

Incorrect:

```text
React → Gemini API
```

The frontend must never contain the Gemini API key.

---

# 65. Frontend Behavior Around Recommendations

Do not calculate recommendation ranking in React.

The backend owns:

```text
Current competency
Required competency
Previous learning
Job role
Department priorities
Course competency mapping
Future skill requirements
```

and returns ranked recommendations.

The frontend renders:

```text
rank
course
competency gap addressed
reason
source
```

---

# 66. Frontend Behavior Around Competency Scores

The frontend does not become the authority for competency.

Backend responsibilities:

- calculate assessment score
- calculate competency-specific result
- update learner competency state
- calculate gap
- calculate ranking

Frontend responsibilities:

- render score
- render level
- render gap
- render change over time
- navigate to recommendations

---

# 67. Performance and Caching

Cache relatively stable data:

- competencies
- role metadata
- course catalogue
- user profile

Refetch after mutations:

- assessment submission
- recommendation generation/dismissal
- material processing
- assessment publish/archive
- profile update

Especially after submitting an assessment:

```text
submit attempt
  ↓
invalidate attempt
  ↓
invalidate competencies
  ↓
invalidate gaps
  ↓
invalidate recommendations
  ↓
refresh dashboard
```

This ensures the learner sees the updated competency loop immediately.

---

# 68. Suggested Query Keys

If using TanStack Query:

```text
['me']
['learner', 'profile']
['learner', 'competencies']
['learner', 'gaps']
['learner', 'recommendations']
['learner', 'progress']
['learner', 'assessments']
['course', courseId]
['courses', filters]
['materials', filters]
['material', materialId]
['assessments', filters]
['assessment', assessmentId]
['attempt', attemptId]
['admin', 'overview']
['admin', 'competencies']
['admin', 'skill-gaps']
['admin', 'training-effectiveness']
['admin', 'departments']
```

---

# 69. Mutation Invalidation Rules

## Assessment submission

Invalidate:

```text
attempt
learner competencies
gaps
recommendations
progress
learner assessments
dashboard
```

## Recommendation dismissal

Invalidate:

```text
recommendations
```

## Material upload

Invalidate:

```text
materials
```

## Material process

Invalidate:

```text
material
materials
```

## Assessment generation

Invalidate:

```text
trainer assessments
```

## Assessment publish

Invalidate:

```text
trainer assessments
learner assessments
```

## Profile update

Invalidate:

```text
me
learner profile
dashboard
```

---

# 70. Demo Optimization for SIH

The frontend should support the final SIH demo story without requiring the judges to navigate through many screens.

Recommended demo navigation:

```text
Learner Login
   ↓
Competency Dashboard
   ↓
Skill Gaps
   ↓
Recommended iGOT / NSSTA learning
   ↓
Assessment
   ↓
Result
   ↓
Competency improvement
   ↓
Trainer uploads material
   ↓
AI generates questions
   ↓
Trainer approves
   ↓
Learner attempts
   ↓
Updated recommendation
   ↓
Admin workforce dashboard
```

Use seeded data so the dashboards visibly show different learner profiles.

---

# 71. Demo Data Expectations

The finalized backend architecture suggests approximately:

```text
Departments: 3–5
Learners: 20–50
Trainers: 3–5
Admins: 2–3
Competencies: ~30 starter competencies
Courses: 30–50
Training materials: 5–10
Assessments: 10–20
```

The frontend should not assume all entities have to exist in production quantities during development.

---

# 72. Frontend Testing

## Authentication

Test:

- login
- logout
- expired session
- unauthorized route
- role-based redirect

## Learner

Test:

- dashboard loading
- competency rendering
- gap rendering
- recommendation rendering
- assessment navigation
- answer persistence
- submit
- result rendering
- competency refresh after submission

## Trainer

Test:

- upload
- processing state
- generation settings
- generated question display
- edit
- approve
- publish

## Admin

Test:

- KPI rendering
- chart loading
- filters
- department comparison
- skill-gap pages

---

# 73. Frontend Security Rules

Never store in React source:

```text
Gemini API key
Supabase service-role key
private iGOT credentials
private NSSTA credentials
database credentials
```

The frontend may have the Supabase public/anon configuration required by Supabase Auth, subject to the project's security model.

Every privileged action goes through FastAPI.

Never trust frontend role checks as authorization.

---

# 74. Important Frontend Boundaries

The following logic belongs in FastAPI, not React:

```text
competency scoring
skill-gap calculation
recommendation ranking
question generation
RAG retrieval
LLM prompting
question validation
assessment evaluation
iGOT integration
NSSTA integration
admin analytics calculations
RBAC enforcement
```

The following belongs in React:

```text
navigation
rendering
forms
local UI state
assessment answer selection before submission
charts
loading states
error states
dialogs
responsive layout
```

---

# 75. Recommended Build Order

Build frontend in the same dependency order as the backend architecture.

## Phase 1 — Foundation

1. Vite + React setup
2. Tailwind setup
3. React Router
4. API client
5. Supabase Auth integration
6. global layout
7. route guards
8. shared UI primitives

## Phase 2 — Core Learner

1. profile
2. dashboard
3. competency page
4. gap page
5. recommendation page
6. course catalogue
7. progress

## Phase 3 — Assessment

1. assessment list
2. assessment detail
3. attempt creation
4. question UI
5. navigator
6. submission
7. result page
8. competency refresh

## Phase 4 — Trainer

1. trainer dashboard
2. material list
3. upload
4. processing state
5. assessment generation
6. review/edit
7. publish
8. performance

## Phase 5 — Admin

1. dashboard
2. workforce
3. competencies
4. skill gaps
5. training effectiveness
6. departments
7. trainers
8. role/competency management
9. course management

## Phase 6 — Polish

1. skeletons
2. error states
3. empty states
4. responsive layouts
5. accessibility
6. chart polish
7. demo shortcuts
8. end-to-end testing

---

# 76. Definition of Done — Frontend

A frontend feature is complete when:

- route exists
- loading state exists
- error state exists
- empty state exists where relevant
- API client method exists
- response type exists
- authorization is respected
- responsive UI exists
- user feedback exists for mutations
- backend result is rendered without duplicating business logic
- feature works end-to-end through the UI

A page is not complete merely because it renders static mock data.

---

# 77. Final Frontend Architecture

```text
                           REACT + VITE
                                │
              ┌─────────────────┼──────────────────┐
              │                 │                  │
           Learner           Trainer             Admin
              │                 │                  │
              └─────────────────┼──────────────────┘
                                ↓
                         Route / Layout Layer
                                ↓
                       Feature / Component Layer
                                ↓
                           API Client Layer
                                ↓
                           FastAPI Backend
                                │
         ┌──────────────────────┼───────────────────────┐
         │                      │                       │
    Competency              Recommendation          Assessment
      Engine                    Engine                Engine
         │                      │                       │
         │                 ┌────┴────┐                 │
         │                 │         │                 │
         │                iGOT     NSSTA                │
         │                                           RAG / AI
         │                                               │
         └─────────────────────────┬─────────────────────┘
                                   ↓
                               Supabase
                         Auth / DB / Storage / pgvector
```

---

# 78. Core Frontend Principle

The frontend's primary job is to make the competency loop understandable and actionable:

```text
PROFILE
   ↓
ASSESS
   ↓
SEE COMPETENCY
   ↓
SEE GAP
   ↓
GET RECOMMENDATION
   ↓
LEARN
   ↓
TAKE ASSESSMENT
   ↓
SEE IMPROVEMENT
   ↓
GET NEXT RECOMMENDATION
```

The trainer frontend turns authoritative learning material into reviewed assessments.

The admin frontend turns individual competency results into organization-level workforce intelligence.

The learner frontend turns recommendations and assessments into measurable competency improvement.

---

# 79. Backend-to-Frontend Contract Rule

The backend architecture is the source of truth for business behavior.

If the backend changes:

- API paths
- response fields
- assessment schema
- competency calculation output
- recommendation format
- role names
- course source values

the frontend types/API layer must be updated first, then pages/components should consume the updated contract.

Do not compensate for backend contract changes with scattered transformations inside arbitrary React components.

Keep transformations close to the API/domain layer.

---

# 80. Final Frontend Delivery Target

The finished frontend should allow the team to demonstrate:

```text
1. User logs in.
2. Role-aware dashboard opens.
3. Learner completes mandatory competency assessment.
4. Competency profile is displayed.
5. Skill gaps are displayed.
6. Personalized iGOT/NSSTA recommendations are displayed.
7. Learner can inspect recommended learning.
8. Trainer uploads authoritative material.
9. Material processing status is visible.
10. Trainer generates an AI mock test.
11. Generated questions are reviewed and edited.
12. Trainer publishes the assessment.
13. Learner takes the assessment.
14. Score and competency-specific results are shown.
15. Competency improvement is displayed.
16. Recommendations refresh.
17. Admin views organization-level competency intelligence.
```

That completes the frontend representation of the backend architecture's central loop:

```text
Assess → Gap → Recommend → Learn → Assess → Update → Recommend Again
```
