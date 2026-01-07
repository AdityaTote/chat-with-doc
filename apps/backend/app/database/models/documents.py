from datetime import datetime
from enum import Enum
from sqlalchemy.sql import func
from typing import TYPE_CHECKING
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Integer, String

from ..main import Base

if TYPE_CHECKING:
    from .sessions import Session
    from .user import User


class ContentType(str, Enum):
    PDF = "pdf"
    MARKDOWN = "md"
    DOCX = "docx"
    TEXT = "txt"


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    url: Mapped[str] = mapped_column(String(255), nullable=False)
    key: Mapped[str] = mapped_column(String(255), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    content_type: Mapped[ContentType] = mapped_column(
        SQLEnum(ContentType), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )
    # Relationships
    sessions: Mapped[list["Session"]] = relationship(
        "Session", back_populates="document", cascade="all, delete-orphan"
    )
    user: Mapped["User"] = relationship("User", back_populates="documents")
