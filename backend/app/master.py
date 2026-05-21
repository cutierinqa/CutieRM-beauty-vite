from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from app.database import SessionLocal
from app.models import User, Master, Zapisi
from app.config import SECRET_KEY, ALGORITHM

master_router = APIRouter(tags=["Master"])

security = HTTPBearer()

# =========================
# DB
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# GET CURRENT USER
# =========================
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        telefon = payload.get("sub")

        if telefon is None:
            raise HTTPException(status_code=401)

    except JWTError:
        raise HTTPException(status_code=401)

    user = db.query(User).filter(
        User.telefon == telefon
    ).first()

    if not user:
        raise HTTPException(status_code=401)

    return user


# =========================
# MASTER PROFILE
# =========================
@master_router.get("/me")
def get_master_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # только мастер
    if current_user.id_role != 2:
        raise HTTPException(status_code=403)

    master = db.query(Master).filter(
        Master.telefon == current_user.telefon
    ).first()

    if not master:
        raise HTTPException(
            status_code=404,
            detail="Мастер не найден"
        )

    return {
        "id_mastera": master.id_mastera,
        "fio": master.fio,
        "dolzhnost": master.dolzhnost,
        "kvalifikaciya": master.kvalifikaciya,
        "telefon": master.telefon,
        "email": master.email,
        "foto": master.foto,
        "data_nachala_stazha": str(master.data_nachala_stazha)
    }


# =========================
# FUTURE ZAPISI
# =========================
@master_router.get("/future-zapisi")
def get_future_zapisi(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.id_role != 2:
        raise HTTPException(status_code=403)

    master = db.query(Master).filter(
        Master.telefon == current_user.telefon
    ).first()

    if not master:
        raise HTTPException(status_code=404)

    zapisi = db.query(Zapisi).filter(
        and_(
            Zapisi.id_mastera == master.id_mastera,
            Zapisi.data_zapisi >= datetime.now()
        )
    ).all()

    result = []

    for z in zapisi:
        result.append({
            "id_zapisi": z.id_zapisi,
            "data_zapisi": str(z.data_zapisi),
            "status": z.status
        })

    return result


# =========================
# HISTORY
# =========================
@master_router.get("/history")
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.id_role != 2:
        raise HTTPException(status_code=403)

    master = db.query(Master).filter(
        Master.telefon == current_user.telefon
    ).first()

    if not master:
        raise HTTPException(status_code=404)

    zapisi = db.query(Zapisi).filter(
        and_(
            Zapisi.id_mastera == master.id_mastera,
            Zapisi.data_zapisi < datetime.now()
        )
    ).all()

    result = []

    for z in zapisi:
        result.append({
            "id_zapisi": z.id_zapisi,
            "data_zapisi": str(z.data_zapisi),
            "status": z.status
        })

    return result


# =========================
# RASPISANIE
# =========================
@master_router.get("/raspisanie")
def get_raspisanie(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.id_role != 2:
        raise HTTPException(status_code=403)

    master = db.query(Master).filter(
        Master.telefon == current_user.telefon
    ).first()

    if not master:
        raise HTTPException(status_code=404)

    zapisi = db.query(Zapisi).filter(
        Zapisi.id_mastera == master.id_mastera
    ).order_by(
        Zapisi.data_zapisi.asc()
    ).all()

    result = []

    for z in zapisi:
        result.append({
            "id_zapisi": z.id_zapisi,
            "data_zapisi": str(z.data_zapisi),
            "status": z.status
        })

    return result

print("ROUTES LOADED:", master_router.routes)