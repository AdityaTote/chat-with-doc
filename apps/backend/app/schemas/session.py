from pydantic import BaseModel


# params
class ChatParams(BaseModel):
    session_id: str
    message: str


# response
class CreateSessionResponse(BaseModel):
    doc_id: int
    doc_key: str
    doc_url: str
    session_id: int
    session_token: str
