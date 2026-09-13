import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models import MaterialChunk, TrainingMaterial
from app.services.embedding_service import embedding_service

logger = logging.getLogger(__name__)

class RetrievalService:
    """
    RAG Retrieval Service using Supabase pgvector and BGE-small-en-v1.5 embeddings.
    Performs cosine similarity search to retrieve grounded context chunks from uploaded training materials.
    """

    def retrieve_relevant_chunks(
        self,
        db: Session,
        query_text: str,
        material_id: Optional[str] = None,
        top_k: int = 6,
        similarity_threshold: float = 0.30
    ) -> List[Dict[str, Any]]:
        """
        Embeds query_text with bge-small-en-v1.5 and executes pgvector similarity search in Supabase.
        """
        # 1. Embed search query
        query_embedding = embedding_service.embed_query(query_text)

        # 2. Perform pgvector cosine similarity search
        # First try Supabase RPC match_material_chunks
        try:
            rpc_query = text("""
                select chunk_id, material_id, content, page_number, section_title, similarity
                from public.match_material_chunks(
                    query_embedding := :emb,
                    match_threshold := :threshold,
                    match_count := :top_k,
                    filter_material_id := :mat_id
                )
            """)
            params = {
                "emb": str(query_embedding),
                "threshold": similarity_threshold,
                "top_k": top_k,
                "mat_id": material_id
            }
            res = db.execute(rpc_query, params).fetchall()
            if res:
                return [
                    {
                        "chunk_id": str(r[0]),
                        "material_id": str(r[1]),
                        "content": r[2],
                        "page_number": r[3],
                        "section_title": r[4],
                        "similarity": float(r[5])
                    }
                    for r in res
                ]
        except Exception as ex_rpc:
            logger.debug(f"RPC match_material_chunks call deferred/fallback: {ex_rpc}")

        # 3. Fallback: Query MaterialChunk table directly from SQLAlchemy
        query = db.query(MaterialChunk)
        if material_id:
            query = query.filter(MaterialChunk.material_id == material_id)

        chunks = query.all()
        if not chunks:
            return []

        # Calculate cosine similarity in Python if pgvector extension is unindexed in local test DB
        results = []
        for chunk in chunks:
            sim = self._calculate_cosine_similarity(query_embedding, chunk.content)
            if sim >= similarity_threshold:
                results.append({
                    "chunk_id": chunk.id,
                    "material_id": chunk.material_id,
                    "content": chunk.content,
                    "page_number": chunk.page_number or 1,
                    "section_title": chunk.section_title or "Section",
                    "similarity": round(sim, 3)
                })

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:top_k]

    def _calculate_cosine_similarity(self, query_vec: List[float], content_text: str) -> float:
        # Generate embedding for content text and compute dot product
        content_vec = embedding_service.embed_text(content_text[:400])
        dot_product = sum(q * c for q, c in zip(query_vec, content_vec))
        return max(0.0, min(1.0, dot_product))

retrieval_service = RetrievalService()
