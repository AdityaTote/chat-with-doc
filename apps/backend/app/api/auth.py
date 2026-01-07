from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.auth import AuthSchema
from app.database import get_db
from app.schemas.response import ResponseSchema
from app.services.auth import AuthService
from app.core.utils.exceptions.base import DomainError

auth_router = APIRouter()


@auth_router.post("/signup", status_code=status.HTTP_200_OK)
def signup(input_data: AuthSchema, db: Session = Depends(get_db)):
    try:
        data = AuthService.signup(input_data=input_data, db=db)
        return ResponseSchema(
            success=True, message="user created successfully", data=data
        )

    except DomainError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@auth_router.post("/signin", status_code=status.HTTP_200_OK)
def signin(input_data: AuthSchema, db: Session = Depends(get_db)):
    try:
        data = AuthService.signin(input_data=input_data, db=db)
        return ResponseSchema(
            success=True, message="user signed in successfully", data=data
        )

    except DomainError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
