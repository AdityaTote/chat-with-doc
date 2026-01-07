from sqlalchemy import Column, ForeignKey, Table

from app.database.main import Base

users_chats_table = Table(
    "users_chats_table",
    Base.metadata,
    Column("users", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("chats", ForeignKey("chats.id", ondelete="CASCADE"), primary_key=True),
)
