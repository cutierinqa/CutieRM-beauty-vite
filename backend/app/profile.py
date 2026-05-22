from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.auth_utils import get_current_user

profile_router = APIRouter(prefix="/profile", tags=["Profile"])


@profile_router.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id_user == current_user.id_user).first()

    return {
        "id_user": user.id_user,
        "fio": user.fio,
        "email": user.email,
        "telefon": user.telefon,
        "avatar": user.avatar,
        "bg_color": user.bg_color
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