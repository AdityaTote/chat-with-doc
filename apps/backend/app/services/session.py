import uuid
from fastapi import BackgroundTasks, UploadFile
from sqlalchemy.orm import Session as db_session

from app.core.s3.aws import s3
from app.database.models import Document, Session
from app.core.rag.rag import Rag
from app.database.models.chats import Chat, Role
from app.schemas.session import CreateSessionResponse
from app.schemas.rag import RagQuery, RagStore
from app.schemas.rag import History, Role as RagRole
from app.database.models.documents import ContentType
from app.core.utils.exceptions.session import (
    ChatsNotFound,
    InvalidContentType,
    FileUploadFailed,
    DocumentSaveFailed,
    SessionCreationFailed,
    SessionsNotFound,
    SessionNotFound,
    ChatSaveFailed,
    RagQueryFailed,
)

CONTENT_TYPE_MAP = {
    "application/pdf": ContentType.PDF,
    "text/markdown": ContentType.MARKDOWN,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ContentType.DOCX,
    "text/plain": ContentType.TEXT,
}

class SessionService:

    @staticmethod
    def create_session(
        file: UploadFile,
        user_id: int,
        db: db_session,
        background_tasks: BackgroundTasks,
    ) -> CreateSessionResponse:
        if not file.content_type:
            raise InvalidContentType()

        file_data = s3.generate_put_presigned_url(content_type=file.content_type)

        data = s3.upload_file_to_presigned_url(
            url=file_data.upload_url,
            object_key=file_data.object_key,
            file=file.file.read(),
            content_type=file.content_type,
        )
        if not data:
            raise FileUploadFailed()

        content_type_enum = CONTENT_TYPE_MAP.get(file.content_type)
        # save doc to db
        doc = Document(
            key=file_data.object_key,
            title=file.filename,
            url=data,
            content_type=content_type_enum,
            user_id=user_id,
        )
        db.add(doc)
        try:
            db.commit()
            db.refresh(doc)
            print("Saved document to DB with ID:", doc.id)
        except Exception as e:
            db.rollback()
            raise DocumentSaveFailed(details=str(e))

        # create session
        session_token_id = uuid.uuid4()
        session = Session(
            session_token=session_token_id, document_id=doc.id, user_id=user_id
        )
        db.add(session)
        try:
            db.commit()
            db.refresh(doc)
            print("Created session with ID:", session.id)
        except Exception as e:
            db.rollback()
            raise SessionCreationFailed(details=str(e))

        # store in vector db
        Rag.store(RagStore(doc_id=int(doc.id), doc_key=str(doc.key)))

        # generate session name in background
        background_tasks.add_task(Rag.generate_session_name, session_token=str(session.session_token), db=db)

        return CreateSessionResponse(
            doc_id=int(doc.id),
            doc_key=str(doc.key),
            doc_url=str(doc.url),
            session_id=int(session.id),
            session_token=str(session.session_token),
        )

    @staticmethod
    def chat(session_id: str, user_id: int, message: str, db: db_session):
        session = (
            db.query(Session)
            .filter(Session.session_token == session_id, Session.user_id == user_id)
            .first()
        )
        if not session:
            raise SessionNotFound(session_id=session_id)

        input_data = RagQuery(
            query=message, doc_id=int(session.document_id)
        )

        # get last two chats (one chat of user and other of assistance)
        latest_chats = (
            db.query(Chat)
            .filter(Chat.session_id == session.session_token)
            .order_by(Chat.created_at.desc(), Chat.id.desc())
            .limit(2)
            .all()
        )

        if latest_chats and len(latest_chats) == 2:
            latest_chats.reverse()
            input_data.history = [
                History(
                    role=RagRole.user if chat.role.value == "user" else RagRole.system,
                    content=str(chat.message),
                )
                for chat in latest_chats
            ]

        try:
            response = Rag.query(input_data)
        except Exception as e:
            raise RagQueryFailed(details=str(e))

        # Save user message to chat
        user_chat = Chat(
            session_id=session.session_token,
            message=message,
            role=Role.USER,
        )
        db.add(user_chat)

        # Save assistant response to chat
        assistant_chat = Chat(
            session_id=session.session_token,
            message=response,
            role=Role.ASSISTANT,
        )
        db.add(assistant_chat)

        try:
            db.commit()
        except Exception as e:
            db.rollback()
            raise ChatSaveFailed(details=str(e))

        return {"response": response}

    @staticmethod
    def get_sessions(user_id: int, db: db_session, limit: int = 10, offset: int = 0):
        sessions = (
            db.query(Session)
            .filter(Session.user_id == user_id)
            .order_by(Session.created_at.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )
        if not sessions:
            raise SessionsNotFound()
        return sessions
    
    @staticmethod
    def get_session(user_id: str, session_id: str, db: db_session, limit: int = 10, offset: int = 0):
        # First, find the session by session_token (UUID string)
        session = (
            db.query(Session)
            .filter(Session.session_token == session_id, Session.user_id == user_id)
            .first()
        )
        if not session:
            raise SessionNotFound(session_id=session_id)
        
        # Then query chats using the session's integer id
        chats = db.query(Chat).filter(
            Chat.session_id == session.session_token
        ).order_by(Chat.created_at.desc(), Chat.id.desc()).limit(limit).offset(offset).all()

        return {
            "session": session,
            "chats": chats
        }