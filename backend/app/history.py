from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User, Klient, Zapisi
from datetime import datetime
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
    klient = db.query(Klient).filter(
        Klient.id_user == current_user.id_user
    ).first()

    if not klient:
        raise HTTPException(status_code=404)

    records = db.query(Zapisi).filter(
        Zapisi.id_klienta == klient.id_klienta
    ).all()

    now = datetime.now()

    past = []
    upcoming = []

    for r in records:

        record_datetime = datetime.strptime(
            f"{r.data} {r.vremya}",
            "%Y-%m-%d %H:%M:%S"
        )

        item = {
            "id_zapisi": r.id_zapisi,
            "data": str(r.data),
            "vremya": str(r.vremya),

            "master": r.master.fio if r.master else "",
            "usluga": r.usluga.nazvanie if r.usluga else "",
        }

        print("NOW:", now)
        print("RECORD:", record_datetime)

        if record_datetime < now:
            past.append(item)
        else:
            upcoming.append(item)

    return {
        "past": past,
        "upcoming": upcoming
    }