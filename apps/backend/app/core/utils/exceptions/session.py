from .base import DomainError


class FileUploadError(DomainError):
    code = "file_upload_error"


class InvalidContentType(FileUploadError):
    code = "invalid_content_type"

    def __init__(self):
        super().__init__(
            message="File must have a content type",
            status_code=400,
        )


class FileUploadFailed(FileUploadError):
    code = "file_upload_failed"

    def __init__(self):
        super().__init__(
            message="Failed to upload file to storage",
            status_code=500,
        )


class DocumentSaveFailed(FileUploadError):
    code = "document_save_failed"

    def __init__(self, details: str):
        super().__init__(
            message=f"Failed to save document to database: {details}",
            status_code=500,
        )


class SessionCreationFailed(FileUploadError):
    code = "session_creation_failed"

    def __init__(self, details: str):
        super().__init__(
            message=f"Failed to create session: {details}",
            status_code=500,
        )


class VectorStoreFailed(FileUploadError):
    code = "vector_store_failed"

    def __init__(self, doc_id: int, doc_key: str):
        super().__init__(
            message=f"Failed to store document (ID: {doc_id}, Key: {doc_key}) in vector database",
            status_code=500,
        )


class SessionNotFound(DomainError):
    code = "session_not_found"

    def __init__(self, session_id: str):
        super().__init__(
            message=f"Session '{session_id}' not found or access denied",
            status_code=404,
        )


class SessionsNotFound(DomainError):
    code = "session_not_found"

    def __init__(self):
        super().__init__(
            message="Sessions not found or access denied",
            status_code=404,
        )


class ChatSaveFailed(DomainError):
    code = "chat_save_failed"

    def __init__(self, details: str):
        super().__init__(
            message=f"Failed to save chat messages: {details}",
            status_code=500,
        )


class RagQueryFailed(DomainError):
    code = "rag_query_failed"

    def __init__(self, details: str):
        super().__init__(
            message=f"Failed to process RAG query: {details}",
            status_code=500,
        )

class ChatsNotFound(DomainError):
    code = "chats_not_found"

    def __init__(self):
        super().__init__(
            message="No chat messages found for this session",
            status_code=404,
        )