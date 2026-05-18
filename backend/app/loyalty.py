from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Klient, ProgrammaLoyalnosti, User
from app.auth_utils import get_current_user

router = APIRouter(prefix="/loyalty", tags=["Loyalty"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me")
def get_loyalty(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    klient = db.query(Klient).filter(Klient.id_user == current_user.id_user).first()
    if not klient:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    card = db.query(ProgrammaLoyalnosti).filter(
        ProgrammaLoyalnosti.id_klienta == klient.id_klienta
    ).first()

    if not card:
        return None

    return {
        "nomer_karty": card.nomer_karty,
        "data_sozdaniya": card.data_sozdaniya,
        "balans_bonysov": card.balans_bonysov,
        "status": card.status
    }
