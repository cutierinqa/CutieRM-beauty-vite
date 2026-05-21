import traceback
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Klient, Master, Zapisi, Usluga, zapisi_dop_uslugi, Role
from app.auth_utils import get_current_user
from datetime import datetime

admin_router = APIRouter(prefix="/admin", tags=["Admin"])
history_router = APIRouter(prefix="/history",tags=["History"])


# ===================== ADMIN ME
@admin_router.get("/me")
def get_admin_me(
    current_user: User = Depends(get_current_user)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403, detail="Нет доступа")

    return {
        "fio": current_user.fio,
        "email": current_user.email,
        "telefon": current_user.telefon
    }

#=============ЮЗЕРЫ
@admin_router.get("/users")
def get_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    users = db.query(User).all()

    result = []

    for u in users:
        role = db.query(Role).filter(
            Role.id_role == u.id_role
        ).first()

        result.append({
            "id_user": u.id_user,
            "fio": u.fio,
            "email": u.email,
            "telefon": u.telefon,
            "id_role": u.id_role,
            "role": role.nazvanie_role if role else "",
            "aktivnost": u.aktivnost,
            "data_sozdaniya": str(u.data_sozdaniya)
        })

    return result

@admin_router.post("/users")
def create_user(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    new_user = User(
        fio=data.get("fio"),
        email=data.get("email"),
        telefon=data.get("telefon"),
        id_role=int(data.get("id_role") or 1),
        aktivnost=True,
        password_hash=bcrypt.hash(data.get("password"))
    )

    db.add(new_user)
    db.commit()

    return {"message": "user created"}

@admin_router.put("/users/{id_user}")
def update_user(
    id_user: int,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    user = db.query(User).filter(
        User.id_user == id_user
    ).first()

    if not user:
        raise HTTPException(404, "User not found")

    user.fio = data.get("fio")
    user.email = data.get("email")
    user.telefon = data.get("telefon")

    if data.get("id_role"):
        user.id_role = int(data.get("id_role"))

    # пароль менять только если передан
    if data.get("password"):
        user.password_hash = bcrypt.hash(data.get("password"))

    db.commit()
    return {"message": "updated"}

@admin_router.delete("/users/{id_user}")
def delete_user(
    id_user: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    user = db.query(User).filter(
        User.id_user == id_user
    ).first()

    if not user:
        raise HTTPException(404, "User not found")

    db.delete(user)
    db.commit()

    return {"message": "deleted"}

@admin_router.get("/roles")
def get_roles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    roles = db.query(Role).all()

    return [
        {
            "id_role": r.id_role,
            "nazvanie_role": r.nazvanie_role,
            "opisanie": r.opisanie
        }
        for r in roles
    ]


# ===================== CLIENTS LIST
@admin_router.get("/clients")
def get_all_clients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    return db.query(Klient).all()

@admin_router.put("/clients/{id_klienta}")
def update_client(
    id_klienta: int,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    client = db.query(Klient).filter(
        Klient.id_klienta == id_klienta
    ).first()

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Клиент не найден"
        )

    client.fio = data.get("fio")
    client.telefon = data.get("telefon")
    client.email = data.get("email")

    client.kolichestvo_vizitov = int(
        data.get("kolichestvo_vizitov") or 0
    )

    # даты
    if data.get("data_pervogo_vizita"):
        client.data_pervogo_vizita = datetime.strptime(
            data.get("data_pervogo_vizita"),
            "%Y-%m-%d"
        ).date()

    if data.get("data_poslednego_vizita"):
        client.data_poslednego_vizita = datetime.strptime(
            data.get("data_poslednego_vizita"),
            "%Y-%m-%d"
        ).date()

    db.commit()

    return {
        "message": "Клиент обновлен"
    }

@admin_router.delete("/clients/{id_klienta}")
def delete_client(
    id_klienta: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    client = db.query(Klient).filter(
        Klient.id_klienta == id_klienta
    ).first()

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Клиент не найден"
        )

    db.delete(client)
    db.commit()

    return {
        "message": "Клиент удален"
    }

@admin_router.post("/clients")
def create_client(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    new_client = Klient(
        fio=data.get("fio"),
        telefon=data.get("telefon"),
        email=data.get("email"),

        kolichestvo_vizitov=int(
            data.get("kolichestvo_vizitov") or 0
        ),

        data_pervogo_vizita=(
            datetime.strptime(
                data.get("data_pervogo_vizita"),
                "%Y-%m-%d"
            ).date()
            if data.get("data_pervogo_vizita")
            else None
        ),

        data_poslednego_vizita=(
            datetime.strptime(
                data.get("data_poslednego_vizita"),
                "%Y-%m-%d"
            ).date()
            if data.get("data_poslednego_vizita")
            else None
        )
    )

    db.add(new_client)
    db.commit()

    return {
        "message": "Клиент добавлен"
    }
# ===================== MASTERS LIST
@admin_router.get("/masters")
def get_all_masters(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    return db.query(Master).all()

@admin_router.post("/masters")
def create_master(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    new_master = Master(
        fio=data.get("fio"),
        dolzhnost=data.get("dolzhnost"),
        kvalifikaciya=data.get("kvalifikaciya"),
        telefon=data.get("telefon"),
        email=data.get("email"),
        foto=data.get("foto"),

        data_nachala_stazha=(
            datetime.strptime(
                data.get("data_nachala_stazha"),
                "%Y-%m-%d"
            ).date()
            if data.get("data_nachala_stazha")
            else None
        )
    )

    db.add(new_master)
    db.commit()

    return {
        "message": "Мастер добавлен"
    }
@admin_router.put("/masters/{id_mastera}")
def update_master(
    id_mastera: int,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    master = db.query(Master).filter(
        Master.id_mastera == id_mastera
    ).first()

    if not master:
        raise HTTPException(
            status_code=404,
            detail="Мастер не найден"
        )

    master.fio = data.get("fio")
    master.dolzhnost = data.get("dolzhnost")
    master.kvalifikaciya = data.get("kvalifikaciya")
    master.telefon = data.get("telefon")
    master.email = data.get("email")
    master.foto = data.get("foto")

    if data.get("data_nachala_stazha"):
        master.data_nachala_stazha = datetime.strptime(
            data.get("data_nachala_stazha"),
            "%Y-%m-%d"
        ).date()

    db.commit()

    return {
        "message": "Мастер обновлен"
    }
@admin_router.delete("/masters/{id_mastera}")
def delete_master(
    id_mastera: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    master = db.query(Master).filter(
        Master.id_mastera == id_mastera
    ).first()

    if not master:
        raise HTTPException(
            status_code=404,
            detail="Мастер не найден"
        )

    db.delete(master)
    db.commit()

    return {
        "message": "Мастер удален"
    }

# ===================== LISTS FOR DROPDOWN
@admin_router.get("/clients-list")
def clients_list(db: Session = Depends(get_db)):
    return [{"id": c.id_klienta, "name": c.fio} for c in db.query(Klient).all()]


@admin_router.get("/masters-list")
def masters_list(db: Session = Depends(get_db)):
    return [
        {
            "id": m.id_mastera,
            "name": m.fio,
            "kvalifikaciya": m.kvalifikaciya
        }
        for m in db.query(Master).all()
    ]


@admin_router.get("/uslugi-list")
def uslugi_list(db: Session = Depends(get_db)):
    return [{"id": u.id_uslugi, "name": u.nazvanie} for u in db.query(Usluga).all()]

@admin_router.get("/uslugi-main")
def get_main_uslugi(db: Session = Depends(get_db)):
    return [
        {
            "id": u.id_uslugi,
            "name": u.nazvanie
        }
        for u in db.query(Usluga).filter(Usluga.is_main == 1).all()
    ]
@admin_router.get("/uslugi-extra")
def get_extra_uslugi(db: Session = Depends(get_db)):
    return [
        {
            "id": u.id_uslugi,
            "name": u.nazvanie
        }
        for u in db.query(Usluga).filter(Usluga.is_main == 0).all()
    ]


# ===================== ЗАПИСИ
# ==================ДОБАВИТЬ
@admin_router.post("/records")
def create_record(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        print("DATA:", data)
        print("USER:", current_user.id_user)

        klient = db.query(Klient).filter(
            Klient.id_klienta == int(data.get("id_klienta"))
        ).first()

        if not klient:
            raise HTTPException(
                status_code=404,
                detail="Клиент не найден"
            )

        # СОЗДАЕМ ОСНОВНУЮ ЗАПИСЬ
        new_record = Zapisi(
            id_klienta=klient.id_klienta,
            id_mastera=int(data.get("id_mastera")),
            id_uslugi=int(data.get("id_uslugi")),
            data=datetime.strptime(
    data.get("data"),
    "%Y-%m-%d"
).date(),

vremya=datetime.strptime(
    data.get("vremya"),
    "%H:%M"
).time()
        )

        db.add(new_record)
        db.flush()

        # ДОП УСЛУГИ
        extra = data.get("extra_uslugi") or []

        if isinstance(extra, int):
            extra = [extra]

        for usluga_id in extra:

            db.execute(
                zapisi_dop_uslugi.insert().values(
                    id_zapisi=new_record.id_zapisi,
                    id_uslugi=int(usluga_id)
                )
            )

        db.commit()

        return {
            "message": "Запись создана"
        }

    except Exception as e:
        db.rollback()

        print("ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

#==========================CRUD ЗАПИСИ
@admin_router.get("/records")
def get_records(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    records = db.query(Zapisi).all()

    result = []

    for r in records:

        # ОСНОВНАЯ УСЛУГА
        main_service = db.query(Usluga).filter(
            Usluga.id_uslugi == r.id_uslugi
        ).first()

        # ДОП УСЛУГИ
        extra_rows = db.execute(
            zapisi_dop_uslugi.select().where(
                zapisi_dop_uslugi.c.id_zapisi == r.id_zapisi
            )
        ).fetchall()

        extra_services = []
        extra_ids = []

        for extra in extra_rows:

            usluga = db.query(Usluga).filter(
                Usluga.id_uslugi == extra.id_uslugi
                
            ).first()

            if usluga:
                extra_services.append(usluga.nazvanie)
                extra_ids.append(usluga.id_uslugi)

        result.append({
            "id_zapisi": r.id_zapisi,

            "klient": r.klient.fio,
            "master": r.master.fio,

            "usluga": main_service.nazvanie if main_service else "",

            "dop_uslugi": ", ".join(extra_services),
            "extra_uslugi_ids": extra_ids,

            "data": str(r.data),
            "vremya": str(r.vremya)
        })

    return result
#=====================удаление в таблице админок записи
@admin_router.delete("/records/{id_zapisi}")
def delete_record(
    id_zapisi: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = db.query(Zapisi).filter(Zapisi.id_zapisi == id_zapisi).first()

    if not record:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    # удалить доп услуги
    db.execute(
        zapisi_dop_uslugi.delete().where(
            zapisi_dop_uslugi.c.id_zapisi == id_zapisi
        )
    )

    db.delete(record)
    db.commit()

    return {"message": "Удалено"}

@admin_router.put("/records/{id_zapisi}")
def update_record(
    id_zapisi: int,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    record = db.query(Zapisi).filter(
        Zapisi.id_zapisi == id_zapisi
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Запись не найдена"
        )

    # =========================
    # ОСНОВНЫЕ ПОЛЯ
    # =========================

    if data.get("id_klienta"):
        record.id_klienta = int(
            data.get("id_klienta")
        )

    if data.get("id_mastera"):
        record.id_mastera = int(
            data.get("id_mastera")
        )

    if data.get("id_uslugi"):
        record.id_uslugi = int(
            data.get("id_uslugi")
        )

    # =========================
    # ДАТА
    # =========================

    if data.get("data"):
        record.data = datetime.strptime(
            data.get("data"),
            "%Y-%m-%d"
        ).date()

    # =========================
    # ВРЕМЯ
    # =========================

    if data.get("vremya"):
        record.vremya = data.get("vremya")[:5]

    # =========================
    # ДОП УСЛУГИ
    # =========================

    extra = data.get("extra_uslugi") or []

    if isinstance(extra, (int, str)):
        extra = [extra]

    # удалить старые
    db.execute(
        zapisi_dop_uslugi.delete().where(
            zapisi_dop_uslugi.c.id_zapisi == id_zapisi
        )
    )

    # добавить новые
    for usluga_id in extra:

        db.execute(
            zapisi_dop_uslugi.insert().values(
                id_zapisi=id_zapisi,
                id_uslugi=int(usluga_id)
            )
        )

    db.commit()

    return {
        "message": "updated"
    }


@history_router.get("/me")
def get_my_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    klient = db.query(Klient).filter(
        Klient.id_user == current_user.id_user
    ).first()

    if not klient:
        raise HTTPException(status_code=404)

    records = db.query(Zapisi).filter(
        Zapisi.id_klienta == klient.id_klienta
    ).all()

    result = []

    for r in records:

        # ОСНОВНАЯ УСЛУГА
        main_service = db.query(Usluga).filter(
            Usluga.id_uslugi == r.id_uslugi
        ).first()

        # ДОП УСЛУГИ
        extra_rows = db.execute(
            zapisi_dop_uslugi.select().where(
                zapisi_dop_uslugi.c.id_zapisi == r.id_zapisi
            )
        ).fetchall()

        extra_services = []

        for extra in extra_rows:

            usluga = db.query(Usluga).filter(
                Usluga.id_uslugi == extra.id_uslugi
            ).first()

            if usluga:
                extra_services.append(usluga.nazvanie)

        result.append({
            "id_zapisi": r.id_zapisi,
            "data": str(r.data),
            "vremya": str(r.vremya),

            "master": r.master.fio,

            "usluga": (
                main_service.nazvanie
                if main_service else ""
            ),

            "dop_uslugi": ", ".join(extra_services)
        })

    return result