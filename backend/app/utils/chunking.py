from typing import List, Dict, Any

def chunk_parsed_document(
    parsed_data: Dict[str, Any],
    max_chunk_size: int = 500,
    overlap: int = 50
) -> List[Dict[str, Any]]:
    """
    Sliding window chunking algorithm preserving page numbers, section headers, and token counts.
    """
    chunks = []
    chunk_index = 0
    pages = parsed_data.get("pages", [])

    if not pages:
        full_text = parsed_data.get("full_text", "")
        pages = [{"page_number": 1, "text": full_text}]

    for page in pages:
        p_num = page.get("page_number", 1)
        p_text = page.get("text", "").strip()
        if not p_text:
            continue

        paragraphs = p_text.split("\n\n")
        current_chunk = ""

        for para in paragraphs:
            para_clean = para.strip()
            if not para_clean:
                continue

            if len(current_chunk) + len(para_clean) > max_chunk_size and current_chunk:
                words = current_chunk.split()
                section_title = f"Page {p_num} — " + (" ".join(words[:5]) if words else "Section")
                chunks.append({
                    "chunk_index": chunk_index,
                    "content": current_chunk.strip(),
                    "token_count": len(words),
                    "page_number": p_num,
                    "section_title": section_title
                })
                chunk_index += 1

                # Sliding overlap
                overlap_text = " ".join(words[-10:]) if len(words) >= 10 else ""
                current_chunk = overlap_text + "\n\n" + para_clean if overlap_text else para_clean
            else:
                current_chunk += "\n\n" + para_clean if current_chunk else para_clean

        if current_chunk:
            words = current_chunk.split()
            section_title = f"Page {p_num} — " + (" ".join(words[:5]) if words else "Section")
            chunks.append({
                "chunk_index": chunk_index,
                "content": current_chunk.strip(),
                "token_count": len(words),
                "page_number": p_num,
                "section_title": section_title
            })
            chunk_index += 1

    return chunks
