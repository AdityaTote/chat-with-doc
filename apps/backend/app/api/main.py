from fastapi import APIRouter

from .auth import auth_router
from .session import session_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(session_router, prefix="/session", tags=["session"])
