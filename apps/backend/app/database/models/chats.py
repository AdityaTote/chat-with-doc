from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING
from sqlalchemy.sql import func
from sqlalchemy import DateTime, ForeignKey, Integer, String, Enum as SQLEnum
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.database.main import Base
from .users_chats_table import users_chats_table

if TYPE_CHECKING:
    from .user import User
    from .sessions import Session


class Role(Enum):
    USER = "user"
    ASSISTANT = "assistant"


class Chat(Base):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[str] = mapped_column(
        ForeignKey("sessions.session_token", ondelete="CASCADE"), nullable=False
    )
    message: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[Role] = mapped_column(SQLEnum(Role), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )

    # Relationships
    session: Mapped["Session"] = relationship("Session", back_populates="chats")
    users: Mapped[list["User"]] = relationship(
        "User", secondary=users_chats_table, back_populates="chats"
    )
