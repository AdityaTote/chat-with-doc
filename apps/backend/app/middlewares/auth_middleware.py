from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.utils.hash import security
from app.database.main import get_db
from app.database.models.user import User


def auth_middleware(req: Request, db: Session = Depends(get_db)):

    token = req.headers.get("Authorization")
    if not token:
        raise HTTPException(detail="not token provide", status_code=401)

    token = token.replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        user_data = security.decode_token(token=token)

        user = db.query(User).filter(User.id == user_data["user_id"]).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        req.state.user = {"id": user.id, "email": user.email, "username": user.username}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error decoding token: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")
    return None
