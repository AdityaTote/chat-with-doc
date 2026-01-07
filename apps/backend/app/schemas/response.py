from typing import Optional
from pydantic import BaseModel


class ResponseSchema(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
