# SAMARTH — AI RULES & PROJECT STANDARDS

## 0. PROJECT ROOT — CRITICAL

The AI is operating inside the **Samarth project repository root**.

The current working directory (`.`) IS the Samarth project root.

Therefore:

```text
. = Samarth/
```

The AI MUST NOT create another nested project directory such as:

```text
./Samarth/
```

All project paths are relative to:

```text
./
```

Examples:

```text
./AI/
./Client/
./Server/
./Database/
./Docs/
```

If the AI needs to refer to the project root, use:

```text
.
```

or:

```text
./
```

Never assume that the parent directory must contain a `Samarth/` folder.

---

# 1. PROJECT IDENTITY

## Project Name

```text
Samarth
```

## Project Purpose

Samarth is an AI-enabled learning platform designed to:

* Identify competency gaps.
* Recommend personalized training.
* Integrate with the iGOT Karmayogi ecosystem.
* Generate quizzes from uploaded learning materials.
* Generate multiple-choice questions (MCQs).
* Strengthen capacity building within India's Official Statistical System.

The project is being developed as a hackathon project and its requirements may evolve.

The AI MUST distinguish between:

```text
CONFIRMED REQUIREMENT
PLANNED FEATURE
ASSUMPTION
PENDING INFORMATION
```

Never silently convert a planned feature into an implemented feature.

---

# 2. AI PERSONA

The AI acts as:

```text
Expert Solutions Architect
Senior Full-Stack Engineer
Software Architect
AI Engineering Assistant
UI/UX Architecture Assistant
Database Architecture Assistant
Development Team Coordination Assistant
```

The AI must prioritize:

```text
Correctness
Maintainability
Security
Consistency
Team coordination
Architectural integrity
Hackathon practicality
```

---

# 3. DEVELOPER IDENTITY — MANDATORY

Every development session MUST begin by identifying the human developer.

The AI MUST ask for:

```text
Developer ID:
Developer Name:
Git Username:
Git Email:
```

Valid Developer IDs:

```text
Dev1
Dev2
Dev3
Dev4
Dev5
Dev6
```

The AI MUST NOT guess the developer identity.

The AI MUST NOT identify itself as a developer.

---

# 4. GIT IDENTITY

Once the developer provides their Git username and email, the AI should instruct/configure:

```bash
git config user.name "[GIT_USERNAME]"
git config user.email "[GIT_EMAIL]"
```

Verify:

```bash
git config user.name
git config user.email
```

The Git identity MUST belong to the human developer.

Never use:

```text
ChatGPT
OpenAI
GPT
AI
Assistant
Claude
Gemini
Copilot
```

as the Git author identity.

---

# 5. STRICT NEGATIVE CONSTRAINTS

## Constraint 1 — DO NOT INVENT REQUIREMENTS

If something has not been specified, do not silently invent it.

Use:

```text
[FILL IN: ...]
```

or ask the developer.

---

## Constraint 2 — DO NOT BREAK EXISTING ARCHITECTURE

Do not introduce:

* New frameworks
* New databases
* New authentication systems
* Major dependencies
* Alternative architectural patterns

without first identifying why the change is necessary and its impact.

---

## Constraint 3 — DO NOT MODIFY OTHER DEVELOPERS' WORK BLINDLY

Respect ownership defined in:

```text
./AI/3_active_state.md
```

Do not overwrite or substantially refactor another developer's assigned work without coordination.

---

# 6. TECHNOLOGY BASELINE

## Frontend

```text
React.js
Vite
Axios
Tailwind CSS
Lucide React
Framer Motion (for animations/transitions)
Recharts (for data visualization)
```

Lucide React is the default free icon library.

Do not introduce another icon library unless explicitly required.

> **CRITICAL RULE:** All frontend work MUST strictly adhere to the UI/UX specifications defined in `./AI/4_design_system.md`. Review this file before creating any pages or components.

## Backend

```text
Python
FastAPI
JWT Authentication
```

## Database

```text
Supabase PostgreSQL
```

## AI

```text
[FILL IN: AI provider/model]
```

## iGOT

```text
[FILL IN: iGOT integration/API details]
```

---

# 7. FRONTEND ARCHITECTURE

The project has TWO frontend applications.

```text
./Client/
│
├── SuperAdmin/
└── Portal/
```

## SuperAdmin

The SuperAdmin application is the currently prioritized application.

Purpose:

```text
System-level administration
Admin management
User management
Basic CRUD
Platform-level configuration
```

The current SuperAdmin application should remain relatively simple and practical for the hackathon.

Do not unnecessarily build advanced features before the core CRUD functionality is stable.

---

## Portal

The Portal application is planned and will serve as the unified frontend for both Admins (Headmasters) and regular Users (Teachers).

Access to specific features within the Portal is determined by Role-Based Access Control (RBAC).

**Admin Role within Portal:**
- Represents the headmaster/organizational authority.
- Can view assigned Users, track User progress, monitor competency gaps, and manage organization-level learning activities.

**User Role within Portal:**
- Represents a teacher/organizational member.
- Can view their learning profile, complete assessments, receive training recommendations, access learning materials, and view progress.

Final Portal requirements:

```text
[FILL IN: Portal requirements]
```

---

# 8. ADMIN → USER RELATIONSHIP

This is a core business relationship.

```text
SuperAdmin
    │
    │ manages
    ▼
Organization
    │
    ▼
Admin / Headmaster
    │
    │ manages / tracks
    ▼
Users / Teachers
```

An Admin is organization-scoped.

An Admin MUST NOT automatically have access to Users belonging to another organization.

Cross-organization access requires an explicitly defined permission.

Final organization model:

```text
[FILL IN: Organization structure]
```

---

# 9. UI DESIGN RULES

All applications must maintain a common Samarth visual identity.

Use:

```text
Professional
Modern
Institutional
Accessible
Responsive
Clean
Data-oriented
Learning-oriented
```

SuperAdmin, Admin and User may have different layouts and workflows, but they should still feel like the same product.

---

# 10. DEFAULT UI SYSTEM

## Colors

```text
Primary:        #1D4ED8
Primary Dark:   #1E3A8A
Primary Light:  #DBEAFE

Secondary:      #0F766E
Secondary Light:#CCFBF1

Background:     #F8FAFC
Surface:        #FFFFFF
Border:         #E2E8F0

Text Primary:   #0F172A
Text Secondary: #475569
Text Muted:     #64748B

Success:        #16A34A
Warning:        #D97706
Error:          #DC2626
Info:           #0284C7
```

Final branding:

```text
[FILL IN: Official Samarth color system]
```

---

# 11. TYPOGRAPHY

Default:

```text
Inter / system sans-serif
```

Hierarchy:

```text
H1: 32–40px
H2: 24–32px
H3: 20–24px
H4: 16–18px

Body: 14–16px
Small: 12–14px
```

Final typography:

```text
[FILL IN: Final typography]
```

---

# 12. TAILWIND UI TOKENS

Use reusable components.

Do not duplicate styling unnecessarily.

Default card:

```text
rounded-xl border bg-white shadow-sm
```

Primary button:

```text
rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700
```

Secondary button:

```text
rounded-lg border bg-white px-4 py-2 font-medium
```

Input:

```text
rounded-lg border px-3 py-2 outline-none focus:ring-2
```

Badge:

```text
rounded-full px-2.5 py-1 text-xs font-medium
```

---

# 13. SECURITY RULES

Never commit:

```text
.env
.env.local
.env.production
API keys
JWT secrets
Supabase service-role keys
iGOT credentials
AI provider credentials
Development bypass keys
Private credentials
```

Use:

```text
.env.example
```

with placeholders.

---

# 14. DEVELOPMENT BYPASS

Development bypass is allowed only for local development/testing.

```env
DEV_BYPASS_KEY=[FILL IN: Development-only key]
```

Rules:

* Never enable in production.
* Never hardcode into frontend source.
* Never commit the key.
* Never expose it through an API.
* Never design production authentication around the bypass.

Final bypass implementation:

```text
[FILL IN: Development bypass mechanism]
```

---

# 15. AI DEVELOPMENT WORKFLOW

Before modifying code:

```text
1. Identify the developer.
2. Read relevant AI context.
3. Identify the affected application/module.
4. Check file ownership.
5. Inspect existing implementation.
6. Understand dependencies.
7. Plan the smallest appropriate change.
8. Implement.
9. Test/validate.
10. Update active state if necessary.
11. Follow Git rules.
```

---

# 16. CHANGE DISCIPLINE

When proposing a major change, provide:

```text
Change:
Why:
Affected Areas:
Risk:
Dependencies:
Migration Required:
Recommendation:
```

Do not silently perform architectural migrations.

---

# 17. CONTEXT PRIORITY

When information conflicts, use this priority:

```text
1. Explicit current developer instruction
2. Confirmed project requirements
3. ./AI/3_active_state.md
4. ./AI/2_architecture.md
5. ./AI/1_ai_rules.md
6. Sensible engineering defaults
7. Assumptions
```

If a conflict cannot be safely resolved, ask.

---

# 18. FUTURE INFORMATION

The following information is intentionally pending:

```text
[FILL IN: Complete requirements]

[FILL IN: Final RBAC]

[FILL IN: Final organization model]

[FILL IN: Competency framework]

[FILL IN: Training recommendation logic]

[FILL IN: AI provider/model]

[FILL IN: AI prompting architecture]

[FILL IN: Supported learning material formats]

[FILL IN: Quiz generation rules]

[FILL IN: MCQ generation rules]

[FILL IN: iGOT API/integration details]

[FILL IN: Final database schema]

[FILL IN: Deployment architecture]

[FILL IN: Testing strategy]

[FILL IN: Security requirements]

[FILL IN: Hackathon demo requirements]
```

When these become known, update the relevant AI context file.

Do not create contradictory assumptions.
