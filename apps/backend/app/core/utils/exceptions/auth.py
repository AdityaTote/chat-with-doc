from .base import DomainError


class AuthError(DomainError):
    code = "auth_error"


class EmailAlreadyRegistered(AuthError):
    code = "email_already_registered"

    def __init__(self, email: str):
        super().__init__(
            message=f"Email '{email}' is already registered",
            status_code=409,
        )


class PasswordHashFailed(AuthError):
    code = "password_hash_failed"

    def __init__(self):
        super().__init__(
            message="Failed to hash password",
            status_code=500,
        )


class TokenGenerationFailed(AuthError):
    code = "token_generation_failed"

    def __init__(self):
        super().__init__(
            message="Failed to generate authentication token",
            status_code=500,
        )


class UserNotFound(AuthError):
    code = "user_not_found"

    def __init__(self, email: str):
        super().__init__(
            message=f"User with email '{email}' not found",
            status_code=404,
        )


class InvalidCredentials(AuthError):
    code = "invalid_credentials"

    def __init__(self):
        super().__init__(
            message="Invalid email or password",
            status_code=401,
        )
