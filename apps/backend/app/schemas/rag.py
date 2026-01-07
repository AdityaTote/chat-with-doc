from enum import Enum
from typing import List
from pydantic import BaseModel


class RagStore(BaseModel):
    doc_id: int
    doc_key: str

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
    context: str | None = None
    history: List[History] | None = None

    class Config:
        from_attributes = True
