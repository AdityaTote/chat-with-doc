from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy.sql import func
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship, Mapped, mapped_column

from ..main import Base

if TYPE_CHECKING:
    from .documents import Document
    from .user import User
    from .chats import Chat


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), default="Session", nullable=True)
    session_token: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="sessions")
    user: Mapped["User"] = relationship("User", back_populates="sessions")
    chats: Mapped[list["Chat"]] = relationship(
        "Chat", back_populates="session", cascade="all, delete-orphan"
    )
