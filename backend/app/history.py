from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User, Klient, Zapisi
from app.auth_utils import get_current_user

router = APIRouter(prefix="/history", tags=["History"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me")
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    klient = db.query(Klient).filter(Klient.id_user == current_user.id_user).first()
    if not klient:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    records = db.query(Zapisi).filter(Zapisi.id_klienta == klient.id_klienta).all()

    result = []
    for r in records:
        result.append({
            "id_zapisi": r.id_zapisi,
            "data": r.data,
            "vremya": r.vremya,
            "master": r.master.fio if r.master else None,   
            "usluga": r.usluga.nazvanie if r.usluga else None
        })

    return result
