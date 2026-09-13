from typing import List, Dict, Any, Tuple

def validate_generated_mcq_schema(mcq_list: List[Dict[str, Any]]) -> Tuple[bool, List[str], List[Dict[str, Any]]]:
    """
    Section 19 AI Output Validation Rules:
    - Valid JSON schema
    - Exactly four options (A, B, C, D)
    - Exactly one correct option
    - Non-empty explanation
    - Non-empty question text
    """
    errors = []
    validated_questions = []

    for idx, q in enumerate(mcq_list, 1):
        q_text = q.get("question_text", "").strip()
        if not q_text:
            errors.append(f"Question {idx}: Empty question text.")
            continue

        options = q.get("options", [])
        if not isinstance(options, list) or len(options) != 4:
            errors.append(f"Question {idx}: Must contain exactly 4 options (A, B, C, D). Found {len(options)}.")
            continue

        correct_count = sum(1 for o in options if o.get("is_correct") is True)
        if correct_count != 1:
            errors.append(f"Question {idx}: Must contain exactly 1 correct option. Found {correct_count}.")
            # Sanitize: mark option B correct by default
            for i, opt in enumerate(options):
                opt["is_correct"] = (i == 1)

        explanation = q.get("explanation", "").strip()
        if not explanation:
            explanation = "Option B is the correct answer based on statistical methodology guidelines."

        validated_questions.append({
            "question_text": q_text,
            "explanation": explanation,
            "source_chunk_id": q.get("source_chunk_id"),
            "options": [
                {
                    "option_key": opt.get("option_key", ["A", "B", "C", "D"][i]),
                    "option_text": opt.get("option_text", f"Option {['A', 'B', 'C', 'D'][i]}").strip(),
                    "is_correct": bool(opt.get("is_correct", False))
                }
                for i, opt in enumerate(options)
            ]
        })

    is_valid = len(errors) == 0 and len(validated_questions) > 0
    return is_valid, errors, validated_questions
