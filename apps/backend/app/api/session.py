from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.database.main import get_db
from app.core.s3.aws import ALLOWED_CONTENT_TYPES
from app.schemas.session import ChatParams
from app.services.session import SessionService
from app.core.utils.exceptions.base import DomainError
from app.schemas.response import ResponseSchema
from app.middlewares.auth_middleware import auth_middleware
from app.core.utils.params import get_pagination

session_router = APIRouter()


def model_to_dict(obj):
    """Convert SQLAlchemy model instance to dictionary"""
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


@session_router.post(
    "/create", status_code=status.HTTP_200_OK, dependencies=[Depends(auth_middleware)]
)
def file_upload(
    req: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    user = req.state.user
    if not user:
        raise HTTPException(
            status_code=401, detail="Unauthorized: User not authenticated"
        )

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid document type. Allowed types: {', '.join(ALLOWED_CONTENT_TYPES)}",
        )

    try:
        data = SessionService.create_session(
            file=file, user_id=user["id"], db=db, background_tasks=background_tasks
        )
        return ResponseSchema(
            success=True,
            message="file uploaded successfully",
            data=data.model_dump() if hasattr(data, "model_dump") else data.dict(),
        )
    except DomainError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@session_router.post(
    "/chat", status_code=status.HTTP_200_OK, dependencies=[Depends(auth_middleware)]
)
def chat(req: Request, input_data: ChatParams, db: Session = Depends(get_db)):
    user = req.state.user
    if not user:
        raise HTTPException(
            status_code=401, detail="Unauthorized: User not authenticated"
        )

    try:
        data = SessionService.chat(
            session_id=input_data.session_id,
            user_id=user["id"],
            message=input_data.message,
            db=db,
        )
        return ResponseSchema(
            success=True, message="chat message processed successfully", data=data
        )
    except DomainError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@session_router.get(
    "/", status_code=status.HTTP_200_OK, dependencies=[Depends(auth_middleware)]
)
def get_sessions(req: Request, db: Session = Depends(get_db)):
    user = req.state.user
    if not user:
        raise HTTPException(
            status_code=401, detail="Unauthorized: User not authenticated"
        )

    # get pagination params
    limit, offset = get_pagination(req)

    try:
        data = SessionService.get_sessions(
            user_id=user["id"], db=db, limit=limit, offset=offset
        )
        return ResponseSchema(
            success=True,
            message="sessions fetched successfully",
            data={"sessions": [model_to_dict(item) for item in data]},
        )
    except DomainError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@session_router.get(
    "/{session_id}",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(auth_middleware)],
)
def get_session(req: Request, session_id: str, db: Session = Depends(get_db)):
    user = req.state.user
    if not user:
        raise HTTPException(
            status_code=401, detail="Unauthorized: User not authenticated"
        )

    if not session_id:
        raise HTTPException(status_code=400, detail="session_id is required")

    # get pagination
    limit, offset = get_pagination(req)

    try:
        data = SessionService.get_session(
            user_id=user["id"], session_id=session_id, db=db, limit=limit, offset=offset
        )
        session_data = data["session"]
        chats_data = data["chats"]

        session_dict = model_to_dict(session_data)
        if session_data.document:
            session_dict["document_name"] = session_data.document.title
            session_dict["document_url"] = session_data.document.url

        return ResponseSchema(
            success=True,
            message="session fetched successfully",
            data={
                "session": session_dict,
                "chats": [model_to_dict(item) for item in chats_data],
            },
        )
    except DomainError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
