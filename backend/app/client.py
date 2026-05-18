from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User, Klient
from app.auth_utils import get_current_user

router = APIRouter(prefix="/client", tags=["Client"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    klient = db.query(Klient).filter(Klient.id_user == current_user.id_user).first()

    if not klient:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    return {
        "fio": klient.fio,
        "telefon": klient.telefon,
        "email": klient.email,
        "kolichestvo_vizitov": klient.kolichestvo_vizitov,
        "data_pervogo_vizita": klient.data_pervogo_vizita,
        "data_poslednego_vizita": klient.data_poslednego_vizita,
        "kategoria": {
            "id_kategoriiklient": klient.kategoria.id_kategoriiklient if klient.kategoria else None,
            "nazvanie": klient.kategoria.nazvanie if klient.kategoria else None,
            "opisanie": klient.kategoria.opisanie if klient.kategoria else None
        }
    }