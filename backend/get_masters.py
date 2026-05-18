from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from datetime import date



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="beautycrm"
    )

@app.get("/Masters")
def get_masters():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id_mastera, fio, dolzhnost, kvalifikaciya, data_nachala_stazha, foto
        FROM masters
    """)
    masters = cursor.fetchall()
    conn.close()

    today = date.today()
    for m in masters:
        if m["data_nachala_stazha"]:
            start_year = m["data_nachala_stazha"].year
            m["stazh"] = date.today().year - start_date.year
        else:
            m["stazh"] = 0
        m["foto"] = f"/static/images/masters/{m['foto']}" if m.get("foto") else ""

    return masters
