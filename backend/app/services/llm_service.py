import json
import logging
import re
import httpx
from typing import Dict, Any, List, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class LLMService:
    """
    Centralized Gemini LLM Service for SIH 2026 AI Engine.
    Handles all generative AI operations: Gap Reasoning, Recommendation Rationales,
    RAG-grounded MCQ Assessment Generation, and Attempt Evaluation.
    """

    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.GEMINI_MODEL_NAME

    def generate_content_json(self, prompt: str) -> Optional[Dict[str, Any]]:
        """
        Executes a Gemini LLM request with strict JSON output formatting.
        """
        models_to_try = [self.model_name, "gemini-2.0-flash", "gemini-2.5-flash", "gemini-3.6-flash"]
        
        for model in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
            payload = {
                "contents": [
                    {
                        "parts": [{"text": prompt}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseMimeType": "application/json"
                }
            }
            try:
                with httpx.Client(timeout=35.0) as client:
                    resp = client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            text_content = candidates[0]["content"]["parts"][0]["text"]
                            parsed = self._clean_and_parse_json(text_content)
                            if parsed is not None:
                                return parsed
                    else:
                        logger.warning(f"Gemini LLM model '{model}' HTTP {resp.status_code}: {resp.text}")
            except Exception as ex:
                logger.error(f"Error calling Gemini API for model '{model}': {ex}")

        return None

    def generate_grounded_mcqs(
        self,
        retrieved_chunks: List[Dict[str, Any]],
        question_count: int,
        difficulty: str,
        competency_name: str
    ) -> List[Dict[str, Any]]:
        """
        RAG MCQ Generation Prompting Rules (Section 18 of architecture.md).
        Grounds MCQ generation strictly in retrieved source context chunks.
        """
        context_str = "\n\n".join([
            f"[Source Chunk ID: {c.get('chunk_id')}] (Page {c.get('page_number', 1)}, {c.get('section_title', 'Section')}):\n{c.get('content')}"
            for c in retrieved_chunks
        ])

        prompt = f"""You are an expert AI Assessment Engine for India's Official Statistical System.
Generate strictly grounded Multiple Choice Questions (MCQs) ONLY from the supplied source context below.
Do not invent facts outside the provided source context.

Target Competency: {competency_name}
Target Difficulty: {difficulty}
Question Count Required: {question_count}

Source Context Chunks:
{context_str}

Respond strictly with a JSON list of questions matching this exact schema:
[
  {{
    "question_text": "Clear, unambiguous statistical question...",
    "difficulty": "{difficulty}",
    "explanation": "Detailed explanation referencing source context...",
    "source_chunk_id": "<valid chunk_id from above>",
    "options": [
      {{"option_key": "A", "option_text": "Option A text", "is_correct": false}},
      {{"option_key": "B", "option_text": "Option B text", "is_correct": true}},
      {{"option_key": "C", "option_text": "Option C text", "is_correct": false}},
      {{"option_key": "D", "option_text": "Option D text", "is_correct": false}}
    ]
  }}
]
"""
        parsed = self.generate_content_json(prompt)
        if isinstance(parsed, list):
            return parsed
        elif isinstance(parsed, dict) and "questions" in parsed:
            return parsed["questions"]
        
        return []

    def _clean_and_parse_json(self, text: str) -> Optional[Any]:
        try:
            text = text.strip()
            if text.startswith("```"):
                text = re.sub(r"^```(?:json)?\n?", "", text)
                text = re.sub(r"\n?```$", "", text)
            return json.loads(text)
        except Exception as e:
            logger.error(f"Failed to parse LLM JSON output: {e}")
            return None

llm_service = LLMService()
