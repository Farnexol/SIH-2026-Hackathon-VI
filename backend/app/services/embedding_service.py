import logging
import math
from typing import List, Optional

logger = logging.getLogger(__name__)

class EmbeddingService:
    """
    Embedding Service using BAAI/bge-small-en-v1.5 (dimension = 384).
    Produces normalized vector embeddings for pgvector semantic search.
    """

    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5"):
        self.model_name = model_name
        self._model = None
        self.dimension = 384

    def _load_model(self):
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading embedding model: {self.model_name}...")
                self._model = SentenceTransformer(self.model_name)
                logger.info(f"Successfully loaded embedding model {self.model_name} (Dimension: {self.dimension})")
            except Exception as e:
                logger.warning(f"SentenceTransformer load deferred/failed: {e}. Using vector fallback.")
                self._model = False
        return self._model if self._model is not False else None

    def embed_text(self, text: str) -> List[float]:
        """
        Embeds a single string into a 384-dimensional normalized vector.
        """
        model = self._load_model()
        if model is not None:
            try:
                # Add BGE instruction query prefix for short queries if helpful
                vec = model.encode(text, normalize_embeddings=True)
                return vec.tolist()
            except Exception as ex:
                logger.error(f"Error generating embedding with model: {ex}")

        # Lightweight deterministic fallback vector (384-dim normalized)
        return self._generate_fallback_embedding(text)

    def embed_query(self, query: str) -> List[float]:
        """
        Embeds a search query with BGE query instruction prefix.
        """
        instruction_query = f"Represent this sentence for searching relevant passages: {query}"
        return self.embed_text(instruction_query)

    def _generate_fallback_embedding(self, text: str) -> List[float]:
        """
        Produces a deterministic 384-dimensional normalized vector based on text hash.
        Used as a zero-downtime fallback when model files are offline.
        """
        import hashlib
        vec = []
        hash_seed = hashlib.sha256(text.encode("utf-8")).digest()
        for i in range(self.dimension):
            byte_val = hash_seed[i % len(hash_seed)]
            val = ((byte_val + i) % 100) / 50.0 - 1.0
            vec.append(val)
        
        # Normalize vector
        norm = math.sqrt(sum(v * v for v in vec)) or 1.0
        return [v / norm for v in vec]

embedding_service = EmbeddingService()
