/**
 * AI Service Gateway
 * Provides conversational learning advisor guidance for India's Official Statistical System.
 * Clean abstraction: Currently operates deterministic domain rule logic.
 * Later can seamlessly proxy to Python FastAPI (RAG / LLM / Vector DB).
 */

export const ADVISOR_RESPONSES = {
  'what should i learn next?': `**Recommended Next Step:**
Based on your current competency profile, your most urgent priority is **Module 3 (Pandas for Survey Microdata)** in *Python for Statistical Data Analysis*.

**Why?**
Your Python competency is currently at **38%** while your Statistical Officer role requires **80%**. Completing this module will boost your practical ability to compute survey weights and run automated aggregations.`,

  'why is python my highest priority?': `**Priority Rationale:**
1. **Competency Gap:** You have a **42% gap** (Current: 38% vs. Required: 80%), which is the largest single deficiency in your profile.
2. **Operational Demand:** The Data Analysis Division is currently transitioning legacy batch routines to Python pipelines for PLFS and Consumer Expenditure surveys.
3. **Prerequisite Skill:** High proficiency in Python is required before you can master Data Visualization and Statistical Computing modules.`,

  'explain my competency gaps.': `**Summary of Competency Gaps:**
1. **Python for Data Analysis:** Gap of **42%** (Current: 38% | Required: 80%) — *High Priority*
2. **Data Visualization:** Gap of **27%** (Current: 48% | Required: 75%) — *Medium Priority*
3. **Statistical Computing:** Gap of **15%** (Current: 55% | Required: 70%) — *Low Priority*

*Note: Your Statistics (84%), Survey Methodology (76%), and Data Interpretation (81%) competencies are already well above the required threshold.*`,

  'generate a learning plan.': `**Personalized 4-Week Study Plan:**
- **Week 1:** Complete Pandas DataFrames & Survey Weight aggregations (estimated 3 hours).
- **Week 2:** Complete Data Cleaning & Missing Value imputation on NSS datasets (estimated 2.5 hours).
- **Week 3:** Enroll in *Data Visualization for Official Statistics* and complete Modules 1 & 2 (estimated 3 hours).
- **Week 4:** Take the 20-question AI Adaptive Assessment to certify your updated competency score.`,

  'recommend resources for data visualization.': `**Recommended Resources for Data Visualization:**
1. **iGOT Course:** *Data Visualization & Dashboarding for Official Statistics* (4h 10m, includes Matplotlib & GeoPandas)
2. **Manual:** MoSPI Publication Guidelines for Charts, Indicators, and Geospatial Maps (2025 Edition)
3. **Practice Module:** Building interactive indicator dashboards with Python Plotly.`,

  default: `I am your **StatIQ AI Learning Advisor**, specialized in competency building for India's Official Statistical System.

Based on your profile as a **Statistical Officer (Grade II)**, I analyze your assessment outcomes and iGOT Karmayogi course completions to recommend targeted training. 

You can ask me about:
- What you should learn next
- Why Python is your highest priority
- Explaining your competency gaps
- Generating a customized 4-week study schedule`
};

export const getAdvisorResponse = async (promptText, officerContext = {}) => {
  const clean = (promptText || '').trim().toLowerCase();

  let matchedKey = 'default';
  for (const key of Object.keys(ADVISOR_RESPONSES)) {
    if (clean.includes(key.replace(/[.?]/g, '')) || key.includes(clean)) {
      matchedKey = key;
      break;
    }
  }

  // Future integration point:
  // If process.env.PYTHON_AI_SERVICE_URL is set, forward prompt to FastAPI:
  // const response = await fetch(`${process.env.PYTHON_AI_SERVICE_URL}/chat`, ...)

  return {
    prompt: promptText,
    response: ADVISOR_RESPONSES[matchedKey] || ADVISOR_RESPONSES.default,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};
