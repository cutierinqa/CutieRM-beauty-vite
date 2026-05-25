from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.auth_utils import get_current_user
from app.models import User, Klient
profile_router = APIRouter(prefix="/profile", tags=["Profile"])


@profile_router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "avatar": current_user.avatar,
        "bg_color": current_user.bg_color,
        "telefon": current_user.telefon
    }
# =========================
# UPDATE MY PROFILE
# =========================
@profile_router.put("/me")
def update_my_profile(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id_user == current_user.id_user).first()

    if not user:
        raise HTTPException(status_code=404)

    user.telefon = data.get("telefon", user.telefon)
    user.email = data.get("email", user.email)
    user.avatar = data.get("avatar", user.avatar)
    user.bg_color = data.get("bg_color", user.bg_color)

    db.commit()

    return {"message": "profile updated"}