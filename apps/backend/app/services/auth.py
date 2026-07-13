import logging

from sqlalchemy.orm import Session

from app.database.models import User
from app.core.utils.hash import security
from app.schemas.auth import AuthSchema, JwtPayload, UserResponse
from app.core.utils.exceptions.auth import (
    EmailAlreadyRegistered,
    PasswordHashFailed,
    TokenGenerationFailed,
    UserNotFound,
    InvalidCredentials,
)


class AuthService:
    @staticmethod
    def signup(input_data: AuthSchema, db: Session):
        # check user exist with current email
        if db.query(User).filter(User.email == input_data.email).first():
            logging.warning(f"user already register with email: {input_data.email}")
            raise EmailAlreadyRegistered(email=input_data.email)

        # hash password
        hash_pass = security.hash_text(password=input_data.password)
        if not hash_pass:
            logging.warning("incorrect password")
            raise PasswordHashFailed()

        # store in db
        user = User(email=input_data.email, password=hash_pass)
        db.add(user)
        try:
            db.commit()
            db.refresh(user)
        except Exception as e:
            db.rollback()
            logging.error(f"unable to create user in database for user {input_data.email}")
            raise ValueError(f"Failed to create user: {str(e)}")

        # generate tokens
        token = security.generate_token(user_data=JwtPayload(user_id=int(user.id)))
        if not token:
            logging.warning(f"unable to generate access token for user {input_data.email}")
            raise TokenGenerationFailed()

        user_response = UserResponse.model_validate(user)
        logging.info(f"user with {input_data.email}, successfully signup to the platform")
        return {"user": user_response.model_dump(), "token": token}

    @staticmethod
    def signin(input_data: AuthSchema, db: Session):
        # check user in db
        user = db.query(User).filter(User.email == input_data.email).first()
        if not user:
            logging.warning(f"user with {input_data.email}, does not found")
            raise UserNotFound(email=input_data.email)

        # match the password
        check_pass = security.check_hash(
            password=input_data.password, hash_password=str(user.password)
        )
        if not check_pass:
            logging.warning(f"user with {input_data.email}, password does not match")
            raise InvalidCredentials()

        # generate token
        token = security.generate_token(
            user_data=JwtPayload(user_id=int(user.id))  # type: ignore
        )
        if not token:
            logging.warning(f"user with {input_data.email}, failed to generate access token")
            raise TokenGenerationFailed()
        
        logging.info(f"user with {input_data.email}, successfully signin to the platform")
        return {
            "user": {
                "id": user.id,
                "email": user.email,
            },
            "token": token,
        }
