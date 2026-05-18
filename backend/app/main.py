from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from datetime import date
from app.auth import router
from app.register import router as register_router
from app.client import router as client_router
from app.history import router as history_router
from app.loyalty import router as loyalty_router
from app.admin import admin_router, history_router
from app.models import User, Klient, Master, Zapisi, Usluga
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI()

app.add_middleware( CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(register_router)
app.include_router(client_router)
app.include_router(history_router)
app.include_router(loyalty_router)
app.include_router(admin_router)
app.include_router(history_router)


BASE_DIR = Path(__file__).resolve().parent.parent

app.mount(
    "/uploads",
    StaticFiles(directory=str(BASE_DIR / "uploads")),
    name="uploads"
)

@app.get("/")

def root():
    return {"status": "ok"}

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "beautycrm"
}

@app.get("/services")
def get_services():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    sql = """
        SELECT 
            u.id_uslugi,
            u.nazvanie AS usluga,
            u.opisanie,
            u.dlitelnost,
            u.bazovaya_cena,
            k.nazvanie AS kategoriya
        FROM uslugi u
        JOIN kategorii_uslug k ON u.id_kategorii = k.id_kategorii
    """

    cursor.execute(sql)
    services = cursor.fetchall()

    cursor.close()
    conn.close()

    return services

def format_years(years: int) -> str:
    if years == 1:
        return "1 год"
    elif 2 <= years <= 4:
        return f"{years} года"
    else:
        return f"{years} лет"
    
    
    
@app.get("/masters")
def get_masters():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id_mastera, fio, dolzhnost, kvalifikaciya, data_nachala_stazha, foto
        FROM mastera
    """)
    masters = cursor.fetchall()

    today = date.today()
    for m in masters:
        start_date = m["data_nachala_stazha"]
        if start_date:
            delta_years = today.year - start_date.year
            delta_months = today.month - start_date.month
            if delta_months < 0:
                delta_years -= 1
                delta_months += 12

            if delta_years >= 1:
                m["stazh"] = format_years(delta_years)
            else:
                m["stazh"] = f"{delta_months} мес."
        else:
            m["stazh"] = "Не указан"

    conn.close()
    return masters
