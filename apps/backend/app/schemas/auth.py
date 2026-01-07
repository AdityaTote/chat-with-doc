from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator


class AuthSchema(BaseModel):
    email: EmailStr
    password: str

    class Config:
        from_attributes = True

    @field_validator("password")
    @classmethod
    def validate_password_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("password should be greater than 8 characters")
        return v.strip()

    @field_validator("email")
    @classmethod
    def strip_email(cls, v: str) -> str:
        return v.strip()


class JwtPayload(BaseModel):
    user_id: int

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    email: str
    username: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
