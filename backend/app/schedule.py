from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.database import SessionLocal
from app import models
from app.models import Zapisi

schedule_router = APIRouter()


# ======================
# DB
# ======================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ======================
# FULL SCHEDULE
# ======================
@schedule_router.get("/schedule")
def get_schedule(db: Session = Depends(get_db)):

    masters = db.query(models.Master).options(
        joinedload(models.Master.shifts)
    ).all()

    bookings = db.query(Zapisi).all()

    booked_set = {
        (b.id_mastera, b.data, b.vremya)
        for b in bookings
    }

    result = []

    for m in masters:
        result.append({
            "id_mastera": m.id_mastera,
            "fio": m.fio,
            "dolzhnost": m.dolzhnost,
            "kvalifikaciya": m.kvalifikaciya,
            "foto": f"http://127.0.0.1:8000/uploads/{m.foto}" if m.foto else None,

            "shifts": [
                {
                    "id_shift": s.id_shift,
                    "data_smeny": str(s.data_smeny),
                    "vremya_nachala": str(s.vremya_nachala),
                    "vremya_okonchaniya": str(s.vremya_okonchaniya),
                    "tip_smeny": s.tip_smeny,

                    "is_booked": (
                        m.id_mastera,
                        s.data_smeny,
                        s.vremya_nachala
                    ) in booked_set
                }
                for s in m.shifts
            ]
        })

    return result