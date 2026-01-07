from bcrypt import gensalt, hashpw, checkpw
from jwt import encode, decode

from app.schemas.auth import JwtPayload
from app.config import Config


class Security:
    def __init__(self, secret):
        self._secret = secret

    def hash_text(self, password: str):
        return hashpw(password.encode("utf-8"), gensalt()).decode("utf-8")

    def check_hash(self, password: str, hash_password: str) -> bool:
        return checkpw(
            password=password.encode("utf-8"),
            hashed_password=hash_password.encode("utf-8"),
        )

    def generate_token(self, user_data: JwtPayload):
        return encode(
            payload=user_data.model_dump(), key=self._secret, algorithm="HS256"
        )

    def decode_token(self, token: str):
        data = decode(token, self._secret, algorithms=["HS256"])
        return data


security = Security(secret=Config["Env"].access_token_secret)
