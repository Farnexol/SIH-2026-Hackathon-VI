# SAMARTH — ACTIVE STATE / MULTIPLAYER BRAIN

## 0. PROJECT ROOT

The current working directory is the Samarth project root.

```text
. = Samarth/
```

All paths are relative to:

```text
./
```

Never create another:

```text
./Samarth/
```

---

# 1. CRITICAL DIRECTIVE — GIT PUSH

## ABSOLUTE RULE

**A changelog entry MUST be appended before EVERY Git push.**

Required sequence:

```text
Work
 ↓
Test
 ↓
Update ./AI/3_active_state.md
 ↓
Review git diff
 ↓
Commit
 ↓
Push
```

Never push before updating the changelog.

## AI EXECUTION RULE FOR GIT

**CRITICAL:** AI Agents must **NEVER** automatically run `git add`, `git commit`, or `git push` via terminal commands, **UNLESS** the current developer is explicitly identified as `Dev 1 / Legionnaire_meet`.

For all other developers, the AI must:
1. Prepare the commit message and changelog.
2. Stop and explicitly tell the human developer: *"It is now safe to run `git add .`, `git commit`, and `git push`."*
3. Wait for the human to execute the commands manually.
---

# 2. DEVELOPER BOOT

Every developer must identify themselves before development begins.

Required:

```text
Developer ID:
Developer Name:
Git Username:
Git Email:
```

Developers:

```text
Dev1
Dev2
Dev3
Dev4
Dev5
Dev6
```

---

# 3. TEAM ROSTER

| Developer | Name      | Git Username | Git Email | Primary Area | Status    |
| --------- | --------- | ------------ | --------- | ------------ | --------- |
| Dev1      | Legionnaire_meet | MeetRaval91  | hetalraval1209@gmail.com | Dynamic      | ACTIVE    |
| Dev2      | [FILL IN] | [FILL IN]    | [FILL IN] | Frontend (Learner)    | [FILL IN] |
| Dev3      | [FILL IN] | [FILL IN]    | [FILL IN] | Frontend (Admin/Trainer)    | [FILL IN] |
| Dev4      | [FILL IN] | [FILL IN]    | [FILL IN] | Backend (FastAPI Core)    | [FILL IN] |
| Dev5      | [FILL IN] | [FILL IN]    | [FILL IN] | AI / RAG Pipeline    | [FILL IN] |
| Dev6      | [FILL IN] | [FILL IN]    | [FILL IN] | [FILL IN]    | [FILL IN] |

---

# 4. CURRENT APPLICATION STATUS

## Unified Portal

```text
Status: PLANNED (Unified frontend)
```

Purpose:

```text
Unified frontend for Learner, Trainer, and Admin using RBAC.
```

---

# 5. FILE OWNERSHIP

| Area       | Primary Developer | Secondary | Files                  |
| ---------- | ----------------- | --------- | ---------------------- |
| Client     | Dev2 & Dev3       | [FILL IN] | `./Client/`            |
| Server     | Dev4              | [FILL IN] | `./Server/`            |
| AI/RAG     | Dev5              | [FILL IN] | `./AI/` & `./Server/`  |
| Design     | Dev1              | [FILL IN] | `./AI/4_design_system.md` |
| Database   | Dev4              | [FILL IN] | `./Database/`          |

---

# 6. OWNERSHIP RULE

Before modifying a shared or owned area:

```text
Check owner
 ↓
Check current task
 ↓
Check active conflicts
 ↓
Modify only what is necessary
```

Do not overwrite another developer's work blindly.

---

# 7. CURRENT SPRINT

Sprint:

```text
[FILL IN: Sprint name]
```

Goal:

```text
[FILL IN: Sprint goal]
```

---

# 8. ACTIVE TASKS

| ID       | Task      | Developer | Priority | Status | Dependency |
| -------- | --------- | --------- | -------- | ------ | ---------- |
| TASK-001 | [FILL IN] | [FILL IN] | High     | TODO   | [FILL IN]  |
| TASK-002 | [FILL IN] | [FILL IN] | High     | TODO   | [FILL IN]  |
| TASK-003 | [FILL IN] | [FILL IN] | Medium   | TODO   | [FILL IN]  |

Valid status:

```text
TODO
IN PROGRESS
BLOCKED
IN REVIEW
DONE
```

---

# 9. QUARANTINE ZONE

Known bugs/issues that should NOT block unrelated development.

```text
[FILL IN: Bug]
[FILL IN: Bug]
[FILL IN: Bug]
```

Deferred work:

```text
[FILL IN]
```

Experimental work:

```text
[FILL IN]
```

AI MUST NOT spontaneously fix quarantined issues during unrelated tasks.

---

# 10. ACTIVE DECISIONS

| Date      | Decision  | Why       | Impact    | Owner     |
| --------- | --------- | --------- | --------- | --------- |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

AI MUST check this section before suggesting a conflicting implementation.

---

# 11. BLOCKERS

```text
[FILL IN: Current blockers]
```

Format:

```text
Blocker:
[FILL IN]

Developer:
[FILL IN]

Affected Area:
[FILL IN]

Impact:
[FILL IN]

Required Action:
[FILL IN]

Status:
[FILL IN]
```

---

# 12. ENVIRONMENT STATE

Frontend:

```text
Unified Client/ app initialized (Vite).
```

Backend:

```text
FastAPI planned.
```

Database:

```text
Supabase + PostgreSQL + pgvector schema created (`Database/sih_skill_platform_schema.sql`).
```

AI:

```text
Gemini API + pgvector RAG pipeline planned.
```

iGOT:

```text
Integration planned.
```

Authentication:

```text
Supabase Auth planned. SuperAdmin bypass active.
```

---

# 13. CHANGELOG — MANDATORY BEFORE PUSH

Every push must have a corresponding entry.

Use:

```text
## [DATE]

Agent Name: [DevX / Developer Name]

What:
[What changed]

Why:
[Why it changed]

Files:
[Important files]

Testing:
[Tests/build/validation performed]

Git Status:
[Commit hash / branch / pushed status]
```

---

# 14. CURRENT CHANGELOG

## 2026-09-12

Agent Name:

```text
Dev 1 / Legionnaire_meet
```

What:

```text
Executed the comprehensive Minimal All-in-one initialization prompt.
- Set up root files: .gitignore, .gitattributes, LICENSE.
- Scaffolded SuperAdmin with Vite/React, Tailwind CSS, Axios, Lucide React.
- Scaffolded complete detailed structure for Server, Database, and Docs.
```

Why:

```text
To establish the foundational project repository structure for the hackathon.
```

Files:

```text
.gitignore
.gitattributes
LICENSE
Client/SuperAdmin/*
Server/*
Database/*
Docs/*
```

Testing:

```text
Verified successful scaffolding of Vite and creation of all placeholder directories/files.
```

Git Status:

```text
Pending push
```

---

## 2026-09-12 (Consolidate Admin and User to Portal)

Agent Name:

```text
Dev 1 / Legionnaire_meet
```

What:

```text
Removed empty Client/Admin and Client/User directories and replaced them with Client/Portal.
Updated AI rules, architecture, and active state to reflect two frontend applications (SuperAdmin and Portal).
```

Why:

```text
To consolidate the organization members (Headmasters and Teachers) into a single RBAC-enabled application.
```

Files:

```text
Client/Portal/
AI/1_ai_rules.md
AI/2_architecture.md
AI/3_active_state.md
```

Testing:

```text
Verified successful updating of context documentation and folder creation.
```

Git Status:

```text
Pending push
```

---

## 2026-09-12 (Adopt UI/UX Design System)

Agent Name:

```text
Dev 1 / Legionnaire_meet
```

What:

```text
Created AI/4_design_system.md based on GovTech 2.0 aesthetics.
Updated AI/1_ai_rules.md to enforce framer-motion, recharts, and the new design system.
```

Why:

```text
To establish a rigid, premium aesthetic and frontend consistency across Samarth.
```

Files:

```text
AI/1_ai_rules.md
AI/3_active_state.md
AI/4_design_system.md
```

Testing:

```text
Verified successful creation of the design system specification.
```

Git Status:

```text
Pending push
```

---

## 2026-09-12 (One-Shot SuperAdmin Frontend)

Agent Name:

```text
Dev 1 / Legionnaire_meet
```

What:

```text
Fully scaffolded the SuperAdmin React frontend.
- Setup routing (react-router-dom) with ProtectedRoute.
- Setup global state (zustand) with useAuthStore and useMockStore.
- Created UI components: Button, Badge, StatCard, Modal, EmptyState, PageHeader.
- Created pages: Login, Dashboard, Organizations, Admins, Users.
- Applied GovTech 2.0 aesthetics with tailwindcss and framer-motion.
```

Why:

```text
To provide a complete, interactive one-shot implementation of the SuperAdmin client for the hackathon demo.
```

Files:

```text
Client/SuperAdmin/src/*
```

Testing:

```text
Vite server starts successfully. Note: Automated browser verification failed due to playwright driver issues, requires manual visual verification.
```

Git Status:

```text
Pending push
```

---

## 2026-09-12 (Integrate Supabase SQL Schema)

Agent Name:

```text
Dev 1 / Legionnaire_meet
```

What:

```text
Saved the authoritative sih_skill_platform_schema.sql to the Database/ directory.
Updated AI/2_architecture.md and AI/1_ai_rules.md to reference the saved schema.
```

Why:

```text
To establish the final database schema, which includes the app_role (learner, trainer, admin), competencies, materials, chunking with pgvector, and assessment structures.
```

Files:

```text
Database/sih_skill_platform_schema.sql
AI/2_architecture.md
AI/1_ai_rules.md
```

Testing:

```text
N/A (Schema definition only)
```

Git Status:

```text
Pending push
```

---

# 15. PRE-PUSH CHECKLIST

Before every Git push:

```text
[ ] Developer identity confirmed
[ ] Correct Git username configured
[ ] Correct Git email configured
[ ] Correct branch confirmed
[ ] Changes reviewed
[ ] No unrelated changes
[ ] No secrets
[ ] .env excluded
[ ] Tests/build completed where applicable
[ ] Changelog appended
[ ] Git diff reviewed
[ ] Commit created
[ ] Push target confirmed
```

---

# 16. GIT CONFIGURATION

Configure human developer identity:

```bash
git config user.name "[GIT_USERNAME]"
git config user.email "[GIT_EMAIL]"
```

Verify:

```bash
git config user.name
git config user.email
```

Never use AI identity.

---

# 17. PENDING PROJECT INFORMATION

```text
[FILL IN: Team member names]

[FILL IN: Git usernames]

[FILL IN: Git emails]

[FILL IN: Final task allocation]

[FILL IN: Branching strategy]

[FILL IN: Commit convention]

[FILL IN: Pull request strategy]

[FILL IN: Final requirements]

[FILL IN: Database schema]

[FILL IN: API contracts]

[FILL IN: iGOT details]

[FILL IN: AI provider/model]

[FILL IN: Competency framework]

[FILL IN: Hackathon requirements]
```

This file is the project's current-state memory.

Update it whenever shared development state changes.
