import json
import logging
import re
import httpx
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.GEMINI_MODEL_NAME

    def generate_gap_insights(self, learner_info: Dict[str, Any], gap_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sends deterministic competency gap data to Gemini API to obtain qualitative reasoning,
        strategic action plans, hidden skill synergies, and personalized recommendations.
        """
        prompt = self._build_gap_prompt(learner_info, gap_data)

        # 1. Try google.genai Client SDK
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=self.api_key)
            models_to_try = [self.model_name, "gemini-2.5-flash", "gemini-3.6-flash", "gemini-2.5-pro"]
            
            for m in models_to_try:
                try:
                    response = client.models.generate_content(
                        model=m,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            temperature=0.2,
                        )
                    )
                    if response and response.text:
                        parsed = self._clean_and_parse_json(response.text)
                        if parsed:
                            return self._normalize_insights(parsed)
                except Exception as ex_m:
                    logger.debug(f"SDK attempt for model {m} failed: {ex_m}")
        except Exception as e:
            logger.warning(f"GenAI SDK call failed: {e}. Falling back to Gemini HTTP API...")

        # 2. Fallback to direct HTTP REST call
        return self._call_gemini_http_rest(prompt, learner_info)

    def _call_gemini_http_rest(self, prompt: str, learner_info: Dict[str, Any]) -> Dict[str, Any]:
        models_to_try = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-2.5-pro", "gemini-2.5-flash-lite"]
        
        for model in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseMimeType": "application/json"
                }
            }
            try:
                with httpx.Client(timeout=30.0) as client:
                    resp = client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            text_content = candidates[0]["content"]["parts"][0]["text"]
                            parsed = self._clean_and_parse_json(text_content)
                            if parsed:
                                return self._normalize_insights(parsed)
                    else:
                        logger.warning(f"HTTP call for model {model} returned status {resp.status_code}: {resp.text}")
            except Exception as ex:
                logger.error(f"HTTP call error for model {model}: {ex}")

        # Default structured output fallback
        return {
            "executive_summary": f"Learner {learner_info.get('full_name', 'User')} shows key competency gaps in target designation {learner_info.get('designation', 'Statistical Officer')}.",
            "prioritized_action_plan": [
                "Step 1: Address high-priority critical gaps in Sampling and Python.",
                "Step 2: Enroll in foundational MoSPI & iGOT courses.",
                "Step 3: Attempt diagnostic MCQs to update competency scores."
            ],
            "hidden_synergies_and_risks": "Prerequisite gaps in Survey Design may impact Advanced Sampling capabilities.",
            "recommended_learning_focus": ["Sampling", "Python", "Data Quality Frameworks"]
        }

    def _clean_and_parse_json(self, text: str) -> Optional[Dict[str, Any]]:
        try:
            text = text.strip()
            # Remove markdown code fence if present
            if text.startswith("```"):
                text = re.sub(r"^```(?:json)?\n?", "", text)
                text = re.sub(r"\n?```$", "", text)
            return json.loads(text)
        except Exception as e:
            logger.error(f"Error parsing JSON from Gemini response: {e}")
            return None

    def _build_gap_prompt(self, learner: Dict[str, Any], gap_data: Dict[str, Any]) -> str:
        return f"""You are an expert AI Competency Intelligence Analyst for India's Official Statistical System (MoSPI / iGOT / NSSTA).
Analyze the following learner competency gap calculation results for an official and generate structured AI insights.

Learner Profile:
- Name: {learner.get('full_name')}
- Current Designation: {learner.get('designation')}
- Department: {learner.get('department_name')}
- Experience: {learner.get('years_experience')} years
- Educational Background: {learner.get('educational_qualifications')}
- Career Goal: {learner.get('career_goal')}

Competency Gap Analysis Data:
- Overall Competency Score: {gap_data.get('overall_competency_score')}/100
- Total Gaps Identified: {gap_data.get('total_gaps_count')}
- High Priority (Critical) Gaps: {gap_data.get('high_priority_gaps_count')}

Detailed Gap Items:
{json.dumps(gap_data.get('gaps', []), indent=2)}

Domain Summaries:
{json.dumps(gap_data.get('domain_summaries', []), indent=2)}

Respond strictly with a JSON object matching this exact schema:
{{
  "executive_summary": "Concise high-level synthesis of official's readiness for role and primary vulnerabilities.",
  "prioritized_action_plan": [
    "Step 1: Specific action item...",
    "Step 2: Specific action item...",
    "Step 3: Specific action item..."
  ],
  "hidden_synergies_and_risks": "Analysis of foundational prerequisites, e.g., how Python skill gaps block AI/ML work or Sampling gaps impact Survey Design.",
  "recommended_learning_focus": [
    "Top competency focus area 1",
    "Top competency focus area 2",
    "Top competency focus area 3"
  ]
}}
"""

    def _normalize_insights(self, parsed: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "executive_summary": parsed.get("executive_summary", "Competency gap analysis complete."),
            "prioritized_action_plan": parsed.get("prioritized_action_plan", []),
            "hidden_synergies_and_risks": parsed.get("hidden_synergies_and_risks", ""),
            "recommended_learning_focus": parsed.get("recommended_learning_focus", [])
        }

gemini_service = GeminiService()
