import logging
import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models import TrainingMaterial, MaterialChunk
from app.utils.parsing import extract_text_from_file
from app.utils.chunking import chunk_parsed_document
from app.services.embedding_service import embedding_service

logger = logging.getLogger(__name__)

class MaterialService:
    """
    Training Material Processing Service.
    Handles document ingestion, text extraction, sliding window chunking,
    embedding generation, and storage in Supabase pgvector table.
    """

    def process_and_store_material(
        self,
        db: Session,
        uploader_id: str,
        title: str,
        file_bytes: bytes,
        filename: str,
        material_type: str = "pdf",
        description: Optional[str] = None
    ) -> Dict[str, Any]:

        # 1. Document Extraction
        parsed_data = extract_text_from_file(file_bytes, filename=filename, mime_type=material_type)
        extracted_text = parsed_data.get("full_text", "")

        # 2. Save Training Material Entry
        mat = TrainingMaterial(
            id=str(uuid.uuid4()),
            uploaded_by=uploader_id,
            title=title,
            description=description,
            material_type=material_type,
            file_size_bytes=len(file_bytes),
            processing_status="processing",
            extracted_text=extracted_text
        )
        db.add(mat)
        db.commit()
        db.refresh(mat)

        # 3. Document Chunking
        chunk_items = chunk_parsed_document(parsed_data, max_chunk_size=500, overlap=50)

        # 4. Generate Embeddings & Save Chunks
        saved_chunk_count = 0
        for item in chunk_items:
            # Embed chunk content with bge-small-en-v1.5
            emb_vector = embedding_service.embed_text(item["content"])

            mc = MaterialChunk(
                id=str(uuid.uuid4()),
                material_id=mat.id,
                chunk_index=item["chunk_index"],
                content=item["content"],
                token_count=item["token_count"],
                page_number=item["page_number"],
                section_title=item["section_title"]
            )
            db.add(mc)
            saved_chunk_count += 1

        mat.processing_status = "completed"
        db.commit()

        return {
            "material_id": mat.id,
            "title": mat.title,
            "total_chunks": saved_chunk_count,
            "total_pages": parsed_data.get("total_pages", 1),
            "processing_status": mat.processing_status
        }

material_service = MaterialService()
