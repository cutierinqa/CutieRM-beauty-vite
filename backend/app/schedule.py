from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Master, Shift

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
# GET SCHEDULE
# ======================

@schedule_router.get("/")
def get_schedule(
    db: Session = Depends(get_db)
):

    masters = db.query(Master).all()

    result = []

    for master in masters:

        shifts = db.query(Shift).filter(
            Shift.id_mastera == master.id_mastera
        ).all()

        shift_list = []

        for shift in shifts:
            shift_list.append({
                "id_shift": shift.id_shift,

                "date": str(shift.data_smeny),

                "start":
                    shift.vremya_nachala.strftime("%H:%M"),

                "end":
                    shift.vremya_okonchaniya.strftime("%H:%M"),

                "type": shift.tip_smeny,

                "comment":
                    shift.kommentarii
            })

        result.append({
            "id_mastera": master.id_mastera,

            "fio": master.fio,

            "foto": master.foto,

            "shifts": shift_list
        })

    return result