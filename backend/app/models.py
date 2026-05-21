from sqlalchemy import Column, Table, Integer, String, Date, DateTime, ForeignKey, Float, Time
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Role(Base):
    __tablename__ = "roles"
    id_role = Column(Integer, primary_key=True)
    nazvanie_role = Column(String)
    opisanie = Column(String)

class User(Base):
    __tablename__ = "users"

    id_user = Column(Integer, primary_key=True, index=True)
    id_role = Column(Integer, ForeignKey("roles.id_role"), nullable=False)

    telefon = Column(String, unique=True, nullable=False, index=True)
    fio = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

    aktivnost = Column(DateTime, default=datetime.utcnow)
    data_sozdaniya = Column(DateTime, default=datetime.utcnow)

    role = relationship("Role", backref="users")

    # 👇 ОБРАТНАЯ СВЯЗЬ
    master = relationship("Master", back_populates="user")
    

class KategoriiKlientov(Base):
    __tablename__ = "kategorii_klientov"
    id_kategoriiklient = Column(Integer, primary_key=True, index=True)
    nazvanie = Column(String(255), nullable=False)
    opisanie = Column(String(500), nullable=True)

    klienty = relationship("Klient", back_populates="kategoria")

class Klient(Base):
    __tablename__ = "klienty"
    id_klienta = Column(Integer, primary_key=True, index=True)
    id_kategoriiklient = Column(Integer, ForeignKey("kategorii_klientov.id_kategoriiklient"), nullable=True)
    fio = Column(String(255), nullable=False)
    telefon = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    kolichestvo_vizitov = Column(Integer, default=0)
    data_pervogo_vizita = Column(Date, nullable=True)
    data_poslednego_vizita = Column(Date, nullable=True)
    id_user = Column(Integer, ForeignKey("users.id_user"), nullable=False)

    zapisi = relationship("Zapisi", back_populates="klient")
    kategoria = relationship("KategoriiKlientov", back_populates="klienty")
    programma_loyalnosti = relationship("ProgrammaLoyalnosti", back_populates="klient", uselist=False)
    

class Master(Base):
    __tablename__ = "mastera"

    id_mastera = Column(Integer, primary_key=True, index=True)
    fio = Column(String(255), nullable=False)
    dolzhnost = Column(String(100))
    kvalifikaciya = Column(String(255))
    data_nachala_stazha = Column(Date)

    telefon = Column(String(20))
    email = Column(String(100))
    foto = Column(String(255))

    id_user = Column(Integer, ForeignKey("users.id_user"))

    zapisi = relationship("Zapisi", back_populates="master")

    # 👇 ВАЖНО: НЕ backref
    user = relationship("User", back_populates="master")

class KategoriiUslug(Base):
    __tablename__ = "kategorii_uslug"
    id_kategorii = Column(Integer, primary_key=True, index=True)
    nazvanie = Column(String(255), nullable=False)
    opisanie = Column(String(500), nullable=True)

    uslugi = relationship("Usluga", back_populates="kategoria")

class Usluga(Base):
    __tablename__ = "uslugi"
    id_uslugi = Column(Integer, primary_key=True, index=True)
    nazvanie = Column(String(255), nullable=False)
    opisanie = Column(String(500), nullable=True)
    id_kategorii = Column(Integer, ForeignKey("kategorii_uslug.id_kategorii"), nullable=True)
    dlitelnost = Column(Integer, nullable=True)
    bazovaya_cena = Column(Float, nullable=True)
    is_main = Column(Integer, default=1)

    zapisi = relationship("Zapisi", back_populates="usluga")
    kategoria = relationship("KategoriiUslug", back_populates="uslugi")

zapisi_dop_uslugi = Table(
    "zapisi_dop_uslugi",
    Base.metadata,

    Column(
        "id_zapisi",
        Integer,
        ForeignKey("zapisi.id_zapisi")
    ),

    Column(
        "id_uslugi",
        Integer,
        ForeignKey("uslugi.id_uslugi")
    )
)
    
class Zapisi(Base):
    __tablename__ = "zapisi"

    id_zapisi = Column(Integer, primary_key=True, index=True)

    id_klienta = Column(
        Integer,
        ForeignKey("klienty.id_klienta"),
        nullable=False
    )

    id_mastera = Column(
        Integer,
        ForeignKey("mastera.id_mastera"),
        nullable=False
    )

    id_uslugi = Column(
        Integer,
        ForeignKey("uslugi.id_uslugi"),
        nullable=False
    )

    data = Column(Date, nullable=False)

    vremya = Column(Time, nullable=False)

    klient = relationship("Klient", back_populates="zapisi")

    master = relationship("Master", back_populates="zapisi")

    usluga = relationship("Usluga", back_populates="zapisi")

    dop_uslugi = relationship(
        "Usluga",
        secondary=zapisi_dop_uslugi
    )
class ProgrammaLoyalnosti(Base):
    __tablename__ = "programma_loyalnosti"

    id_karty = Column(Integer, primary_key=True, index=True)
    id_klienta = Column(Integer, ForeignKey("klienty.id_klienta"), nullable=False)
    nomer_karty = Column(String(50), nullable=False, unique=True)
    data_sozdaniya = Column(Date, default=datetime.utcnow)
    balans_bonysov = Column(Integer, default=0)
    status = Column(String(50), default="Активная")  

    klient = relationship("Klient", back_populates="programma_loyalnosti")
    
    class Shift(Base):
        __tablename__ = "shifts"

    id_shift = Column(Integer, primary_key=True, index=True)

    id_mastera = Column(
        Integer,
        ForeignKey("mastera.id_mastera")
    )
    data_smeny = Column(Date)
    vremya_nachala = Column(Time)
    vremya_okonchaniya = Column(Time)
    tip_smeny = Column(String(50))
    kommentarii = Column(String(255))
    master = relationship(
        "Master",
        backref="shifts"
    )
