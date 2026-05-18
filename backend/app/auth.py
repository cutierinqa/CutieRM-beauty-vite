from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_HOURS
from app.database import SessionLocal
from app.models import User, Role
from app.schemas import LoginSchema

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

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.telefon == data.telefon).first()
    if not user:
        raise HTTPException(status_code=400, detail="Пользователь не найден")

    if not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Неверный пароль")

    # дата ласт активности
    user.aktivnost = datetime.now()
    db.commit()

    # JWT
    access_token = jwt.encode(
        {"sub": user.telefon, "role": user.id_role, "exp": datetime.utcnow() + timedelta(hours=1)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    role_map = {1: "client", 2: "master", 3: "admin"}

    return {
        "access_token": access_token,
        "role": role_map.get(user.id_role, "client")
    }

