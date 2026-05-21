from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.security import pwd_context
from app.models import User
from app.database import SessionLocal
from app.schemas import RegisterSchema
from datetime import datetime

router = APIRouter()
pwd_context = CryptContext(
    schemes=["argon2"],  
    deprecated="auto"
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    hashed = pwd_context.hash(data.password)
    user = User (
        id_role=1, 
        telefon=data.telefon,
        fio=data.fio,
        email=data.email,
        password_hash=hashed,
        data_sozdaniya=datetime.now()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"msg": "Пользователь зарегистрирован"}
