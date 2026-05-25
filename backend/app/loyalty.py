from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Klient, Platyzhi, ProgrammaLoyalnosti, User, Usluga, Zapisi
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
@router.get("/history")
def loyalty_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    klient = db.query(Klient).filter(
        Klient.id_user == current_user.id_user
    ).first()

    payments = (
        db.query(Platyzhi, Zapisi, Usluga)
        .join(
            Zapisi,
            Platyzhi.id_zapisi == Zapisi.id_zapisi
        )
        .join(
            Usluga,
            Zapisi.id_uslugi == Usluga.id_uslugi
        )
        .filter(
            Zapisi.id_klienta == klient.id_klienta
        )
        .order_by(
            Platyzhi.data_platyzha.desc()
        )
        .all()
    )

    result = []

    for payment, zapis, usluga in payments:

        result.append({
            "id": payment.id_platyzha,
            "usluga": usluga.nazvanie,
            "summa": float(payment.summa_fact),
            "bonus": float(
                payment.nachisleno_bonusov or 0
            ),
            "date": payment.data_platyzha
        })

    return result