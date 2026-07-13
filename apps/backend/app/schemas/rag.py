from enum import Enum
from typing import List, Optional
from pydantic import BaseModel

from app.database.models.documents import ContentType


class RagStore(BaseModel):
    doc_id: int
    doc_key: str
    doc_type: ContentType

    class Config:
        from_attributes = True


class Role(Enum):
    user = "user"
    system = "system"


class History(BaseModel):
    role: Role
    content: str


class LlmQuery(BaseModel):
    query: str
    doc_data: List[str]
    context: str | None = None
    history: List[History] | None = None

    class Config:
        from_attributes = True


class RagQuery(BaseModel):
    query: str
    doc_id: int
    doc_type: ContentType
    context: str | None = None
    history: List[History] | None = None

    class Config:
        from_attributes = True

class Metadata(BaseModel):
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    source: Optional[str] = None
    content_type: Optional[ContentType] = None
    char_count: Optional[int] = None
    word_count: Optional[int] = None
    page: Optional[int] = None
    page_count: Optional[int] = None

class DocumentData(BaseModel):
    text: str
    metadata: Metadata
