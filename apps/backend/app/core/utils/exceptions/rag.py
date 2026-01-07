from .base import DomainError


class DocumentLoadError(DomainError):
    """Raised when document fails to load from S3"""

    def __init__(self, doc_key: str):
        super().__init__(
            message=f"Failed to load document: {doc_key}. Please check if the file exists.",
            status_code=404,
        )


class DocumentChunkingError(DomainError):
    """Raised when document chunking fails"""

    def __init__(self, doc_key: str):
        super().__init__(
            message=f"Failed to process document: {doc_key}. Document may be empty or corrupted.",
            status_code=422,
        )


class EmbeddingGenerationError(DomainError):
    """Raised when embedding generation fails"""

    def __init__(self, reason: str = "Unknown error"):
        super().__init__(
            message=f"Failed to generate embeddings: {reason}", status_code=500
        )


class VectorStoreError(DomainError):
    """Raised when vector database operation fails"""

    def __init__(self, reason: str = "Unknown error"):
        super().__init__(
            message=f"Failed to store vectors in database: {reason}", status_code=503
        )
