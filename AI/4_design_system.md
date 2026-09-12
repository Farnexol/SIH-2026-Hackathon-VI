# SAMARTH — FRONTEND UI/UX DESIGN SYSTEM & SPECIFICATION

> **Target Platform:** Samarth — AI-Powered Learning & Competency Platform  
> **Purpose:** Authoritative reference guide for developers building new pages and components to ensure 100% visual, architectural, and behavioral consistency across the platform.

---

## 1. BRAND IDENTITY & PRODUCT PHILOSOPHY

| Attribute | Specification |
| :--- | :--- |
| **Product Name** | **Samarth** |
| **Domain** | AI-enabled learning platform & competency gap identification |
| **Key Stakeholders** | Organization Headmasters (Admins), Teachers (Users), System Administrators (SuperAdmins) |
| **Integration Context** | **iGOT Karmayogi** ecosystem |
| **Design Aesthetic** | **Institutional GovTech 2.0:** Modern, data-dense, authoritative, trustworthy, premium enterprise dashboard. Balances government official prestige with cutting-edge AI capability. |
| **Visual Tone** | Deep Navy institutional shell (`#0B1F3A`), crisp white cards, slate surfaces (`#F8FAFC`), electric blue interaction accents (`#155EEF`), and national saffron/amber accents (`#FF9933`). |

---

## 2. COLOR PALETTE & DESIGN TOKENS

### 2.1 Core Palette

```text
========================================================================================
TOKEN               HEX CODE    TAILWIND EQUIV     USAGE
========================================================================================
Brand Navy (Header) #0B1F3A     custom / #0B1F3A   Sticky Top Navigation bar background
Brand Action Blue   #155EEF     gov-500 / blue-600 Primary buttons, active state highlights, icons
National Accent     #FF9933     amber-500/custom   Level 2 section dots, active nav indicators
App Background      #F8FAFC     slate-50           Main screen canvas background
Card Background     #FFFFFF     white              Primary content cards & modal surfaces
Elevated Panel      #FFFFFF     white/95           Cards over ambient glow backgrounds
Dark Surface        #0F172A     slate-900          Tooltips, dark mode banners, code blocks
Ultra Dark          #0B1322     navy-900 / #070B14 Auth screens, AI engine dark hero sections
========================================================================================
```

### 2.2 Semantic Competency & Priority Colors

| Status / Severity | Background | Text Color | Border Color | Tailwind Classes |
| :--- | :--- | :--- | :--- | :--- |
| **Strong / Mastery (>75%)** | `#ECFDF5` | `#047857` (emerald-700) | `#A7F3D0` | `bg-emerald-50 text-emerald-700 border-emerald-200` |
| **Moderate / In-Progress (50-75%)**| `#FFFBEB` | `#B45309` (amber-700) | `#FDE68A` | `bg-amber-50 text-amber-700 border-amber-200` |
| **Gap / Deficit / High Priority (<50%)**| `#FFF1F2` | `#BE123C` (rose-700) | `#FECDD3` | `bg-rose-50 text-rose-700 border-rose-200` |
| **iGOT Karmayogi Integrated** | `#EEF2FF` | `#4338CA` (indigo-700) | `#C7D2FE` | `bg-indigo-50 text-indigo-700 border-indigo-200` |
| **Informational / Neutral** | `#F1F5F9` | `#334155` (slate-700) | `#E2E8F0` | `bg-slate-100 text-slate-700 border-slate-200` |

---

## 3. TYPOGRAPHY & TEXT HIERARCHY

All fonts are loaded via Google Fonts in `index.html`:
1. **Primary Sans:** `'Inter', system-ui, -apple-system, sans-serif`
2. **Monospace / Numerics:** `'JetBrains Mono', monospace` (for User IDs, percentages, scores, timers, timestamps).

### Component Typography Rules

| Role | Style & Tailwind Classes | Sample Usage |
| :--- | :--- | :--- |
| **Page H1** | `text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900` | Page header titles |
| **Section H2** | `text-lg sm:text-xl font-bold tracking-tight text-slate-900` | Card group / Section headers |
| **Card H3** | `text-base sm:text-lg font-bold text-slate-900 leading-snug` | Stat cards, Course cards, Gap titles |
| **Kicker / Overline**| `text-xs font-bold uppercase tracking-wider text-slate-500` | Category tags, metric labels |
| **Body Primary** | `text-sm sm:text-base text-slate-600 leading-relaxed` | Descriptions, AI rationales |
| **Body Secondary**| `text-xs sm:text-sm text-slate-500 leading-normal` | Card captions, footer notes, tooltips |
| **Metric Hero** | `text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums` | Stat card numbers, score displays |
| **Code / Badge Monospace** | `font-mono text-xs font-bold` | User ID, percentage counters, timestamps |

---

## 4. LAYOUT ARCHITECTURE & NAVIGATION MODEL

The application follows a **Full-Width Header + Centralized Canvas** model for both `SuperAdmin` and `Portal`.

### Two-Level Drill-Down Navigation Architecture

1. **Level 1 (Global Platform View)**
   - **Brand Logo:** Square blue badge (`#155EEF`) with "S" initial + "Samarth" title.
   - **Top Navigation Items:** High-level domains (e.g., Dashboard, Learning, AI Tools, Competency, Analytics).
   - **Active Indicator:** Orange vertical bar (`#FF9933`) next to the active menu item.

2. **Level 2 (Section Context Drilldown)**
   - When user navigates into an inner section, Level 1 links are replaced by an **intelligent Back Button**.
   - Saffron dot (`#FF9933`) + Section Title & Subtitle.
   - **AI Advisor Trigger (`✨ AI Advisor`):** Always accessible in top right header to open the AI dialogue drawer.

---

## 5. UI COMPONENT LIBRARY SPECIFICATIONS

### 5.1 Page Header
Always place a consistent `PageHeader` at the top of every new page.
It must include a clear `title`, `subtitle`, an optional semantic `badge`, and primary `actions`.

### 5.2 Stat Card
Used in metric grids (typically 4-column responsive grid). Use Lucide React icons.

### 5.3 Buttons
- `primary`: Solid blue (`bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20`)
- `secondary`: Deep slate (`bg-slate-900 hover:bg-slate-800 text-white`)
- `outline`: Clean white card button (`bg-white text-slate-700 border border-slate-300 hover:bg-slate-50`)
- `ghost`: Transparent (`hover:bg-slate-100 text-slate-600`)

### 5.4 Semantic Badges
Always use semantic badges for status and metadata tags mapping to the Semantic Color Palette in Section 2.2.

---

## 6. CSS UTILITIES & SPECIAL CUSTOM STYLES

### Premium Card Hover Lift (`.premium-card`)
Adds smooth lift and drop shadow on cards for a premium feel. Every main content card should use this.

### AI Glow Feature Card (`.ai-glow-card`)
For prominent AI diagnostic or generation cards. Uses a subtle gradient and a glowing top border line.

---

## 7. MOTION & ANIMATION STANDARDS (`framer-motion`)

1. **`PageTransition`**: Wrap root element of every page for a smooth page entry (`opacity: 0 -> 1`, `y: 14 -> 0`).
2. **`FadeIn`**: Stagger sections or rows with incremental delays (`delay={0.1}`, `delay={0.2}`).
3. **`AnimatedNumber`**: Counts up numbers smoothly for metric heroes.

---

## 8. CHARTS & DATA VISUALIZATION (`recharts`)

Samarth uses Recharts for official data analytics:
- **Tooltip Styling**: Always use the dark slate theme tooltip (`#0f172a`) so it looks integrated with the premium aesthetic.
- **Chart Colors**: Primary metric line/bar (`#2563eb`), Secondary/Benchmark (`#64748b`).

---

## 9. DEVELOPER CHECKLIST FOR NEW PAGES

Before committing a newly created page, verify the following:
- [ ] **Routing:** Page is registered in React Router and wrapped in `<ProtectedRoute>` based on RBAC (Admin vs User).
- [ ] **Animation Wrapper:** Enclosed in a Framer Motion `<PageTransition>`.
- [ ] **Page Header:** Features the standard `<PageHeader>` component.
- [ ] **Colors & Styling:** Cards use `.premium-card bg-white rounded-2xl border border-slate-200/90 shadow-sm`.
- [ ] **Loading States:** Uses a standardized `<LoadingSpinner />`.
- [ ] **Empty States:** Uses a standardized `<EmptyState />` for zero-result states.
