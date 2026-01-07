from pydantic import BaseModel


class GeneratePresignedURLResponseSchema(BaseModel):
    upload_url: str
    object_key: str
