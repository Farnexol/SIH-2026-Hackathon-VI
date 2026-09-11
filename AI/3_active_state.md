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
| Dev2      | [FILL IN] | [FILL IN]    | [FILL IN] | [FILL IN]    | [FILL IN] |
| Dev3      | [FILL IN] | [FILL IN]    | [FILL IN] | [FILL IN]    | [FILL IN] |
| Dev4      | [FILL IN] | [FILL IN]    | [FILL IN] | [FILL IN]    | [FILL IN] |
| Dev5      | [FILL IN] | [FILL IN]    | [FILL IN] | [FILL IN]    | [FILL IN] |
| Dev6      | [FILL IN] | [FILL IN]    | [FILL IN] | [FILL IN]    | [FILL IN] |

---

# 4. CURRENT APPLICATION STATUS

## SuperAdmin

```text
Status: ACTIVE
```

Purpose:

```text
System-level administration
Admin CRUD
User CRUD
```

---

## Admin

```text
Status: PLANNED
```

Purpose:

```text
Organization/headmaster management
User tracking
```

---

## User

```text
Status: PLANNED
```

Purpose:

```text
Teacher/member learning experience
```

---

# 5. FILE OWNERSHIP

| Area       | Primary Developer | Secondary | Files                  |
| ---------- | ----------------- | --------- | ---------------------- |
| SuperAdmin | [FILL IN]         | [FILL IN] | `./Client/SuperAdmin/` |
| Admin      | [FILL IN]         | [FILL IN] | `./Client/Admin/`      |
| User       | [FILL IN]         | [FILL IN] | `./Client/User/`       |
| Server     | [FILL IN]         | [FILL IN] | `./Server/`            |
| AI         | [FILL IN]         | [FILL IN] | `./AI/`                |
| Database   | [FILL IN]         | [FILL IN] | `./Database/`          |

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
[FILL IN]
```

Backend:

```text
[FILL IN]
```

Database:

```text
[FILL IN]
```

AI:

```text
[FILL IN]
```

iGOT:

```text
[FILL IN]
```

Authentication:

```text
[FILL IN]
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
