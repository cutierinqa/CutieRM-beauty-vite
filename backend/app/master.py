from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from app.database import SessionLocal
from app.models import User, Master, Zapisi, Shifts
from app.config import SECRET_KEY, ALGORITHM
from datetime import date

master_router = APIRouter()

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

def calculate_stazh(start_date: date):
    if not start_date:
        return "Не указан"

    today = date.today()

    years = today.year - start_date.year
    months = today.month - start_date.month

    if months < 0:
        years -= 1
        months += 12

    if years >= 1:
        if years == 1:
            return "1 год"
        elif 2 <= years <= 4:
            return f"{years} года"
        else:
            return f"{years} лет"
    else:
        return f"{months} мес."
# =========================
# MASTER PROFILE
# =========================
@master_router.get("/me")
def get_master_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # проверка роли
    if current_user.id_role != 2:
        raise HTTPException(status_code=403, detail="Not a master")

    # ищем мастера через user_id (как ты уже правильно сделала)
    master = db.query(Master).filter(
        Master.id_user == current_user.id_user
    ).first()

    if not master:
        raise HTTPException(status_code=404, detail="Master not found")
    
    foto_url = None

    if master.foto:
        foto_url = f"http://127.0.0.1:8000/uploads/{master.foto}"
    return {
        "id_mastera": master.id_mastera,
        "fio": master.fio,
        "dolzhnost": master.dolzhnost,
        "kvalifikaciya": master.kvalifikaciya,
        "telefon": master.telefon,
        "email": master.email,
        "foto": foto_url,
        "stazh": calculate_stazh(master.data_nachala_stazha)
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
    Master.id_user == current_user.id_user
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
    Master.id_user == current_user.id_user
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
    Master.id_user == current_user.id_user
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

@master_router.get("/current-records")
def get_current_records(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    master = db.query(Master).filter(
        Master.id_user == current_user.id_user
    ).first()

    if not master:
        raise HTTPException(status_code=404)

    now = datetime.now()

    records = db.query(Zapisi).filter(
        Zapisi.id_mastera == master.id_mastera
    ).all()

    result = []

    for r in records:

        record_datetime = datetime.strptime(
            f"{r.data} {r.vremya}",
            "%Y-%m-%d %H:%M:%S"
        )

        if record_datetime > now:

            result.append({
                "id_zapisi": r.id_zapisi,
                "klient": r.klient.fio,
                "usluga": r.usluga.nazvanie,
                "data": str(r.data),
                "vremya": str(r.vremya)[:5]
            })

    return result

@master_router.get("/history-records")
def get_history_records(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    master = db.query(Master).filter(
        Master.id_user == current_user.id_user
    ).first()

    if not master:
        raise HTTPException(status_code=404)

    now = datetime.now()

    records = db.query(Zapisi).filter(
        Zapisi.id_mastera == master.id_mastera
    ).all()

    result = []

    for r in records:

        record_datetime = datetime.strptime(
            f"{r.data} {r.vremya}",
            "%Y-%m-%d %H:%M:%S"
        )

        if record_datetime < now:

            result.append({
                "id_zapisi": r.id_zapisi,
                "klient": r.klient.fio,
                "usluga": r.usluga.nazvanie,
                "data": str(r.data),
                "vremya": str(r.vremya)[:5]
            })

    return result

@master_router.get("/shifts")
def get_master_shifts(
    date: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    master = db.query(Master).filter(
        Master.id_user == current_user.id_user
    ).first()

    if not master:
        raise HTTPException(status_code=404)

    selected_date = datetime.strptime(
        date,
        "%Y-%m-%d"
    ).date()

    shifts = db.query(Shifts).filter(
    Shifts.id_mastera == master.id_mastera,
    Shifts.data_smeny == selected_date
).order_by(Shifts.vremya_nachala).all()

    return shifts


@master_router.delete("/shifts/{id_shift}")
def delete_shift(
    id_shift: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    master = db.query(Master).filter(
        Master.id_user == current_user.id_user
    ).first()
    if not master:
        raise HTTPException(status_code=404)

    shift = db.query(Shifts).filter(
        Shifts.id_shift == id_shift,
        Shifts.id_mastera == master.id_mastera
    ).first()

    if not shift:
        raise HTTPException(status_code=404)

    db.delete(shift)
    db.commit()

    return {
        "message": "Удалено"
    }

@master_router.post("/shifts")
def create_shift(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    master = db.query(Master).filter(
        Master.id_user == current_user.id_user
    ).first()
    if not master:
        raise HTTPException(status_code=404)

    try:
        selected_date = datetime.strptime(
            data["date"],
            "%Y-%m-%d"
        ).date()

        start_time = datetime.strptime(
            data["start_time"],
            "%H:%M"
        ).time()

        end_time = datetime.strptime(
            data["end_time"],
            "%H:%M"
        ).time()
    except:
        raise HTTPException(status_code=400, detail="Invalid date or time format")

    if start_time >= end_time:
        raise HTTPException(status_code=400, detail="Start time must be before end time")

    new_shift = Shifts(
        id_mastera=master.id_mastera,
        data_smeny=selected_date,
        vremya_nachala=start_time,
        vremya_konca=end_time
    )

    db.add(new_shift)
    db.commit()
    db.refresh(new_shift)

    return {
        "message": "Смена добавлена",
        "shift": {
            "id_shift": new_shift.id_shift,
            "data_smeny": str(new_shift.data_smeny),
            "vremya_nachala": str(new_shift.vremya_nachala)[:5],
            "vremya_konca": str(new_shift.vremya_konca)[:5]
        }
    }