import traceback
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Shift, User, Klient, Master, Zapisi, Usluga, zapisi_dop_uslugi, Role, Otzyv, Incidenty, KategoriiKlientov,  Platyzhi
from app.auth_utils import get_current_user
from datetime import datetime
from decimal import ROUND_HALF_UP, Decimal
from app.security import pwd_context
from passlib.context import CryptContext


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

    hashed = pwd_context.hash(data.get("password"))

    user = User(
        id_role=data.get("id_role"),
        fio=data.get("fio"),
        email=data.get("email"),
        telefon=data.get("telefon"),
        password_hash=hashed,
        aktivnost=1,
        data_sozdaniya=datetime.now()
    )

    db.add(user)
    db.commit() 
    db.refresh(user)

    # если роль клиент
    if int(data.get("id_role")) == 1:

        klient = Klient(
        id_user=user.id_user,
        fio=user.fio,
        telefon=user.telefon,
        email=user.email,
        kolichestvo_vizitov=0
    )

    db.add(klient)
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
        user.password_hash = pwd_context.hash(data.get("password"))

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
def get_kategoriya_by_vizity(vizity: int):
    if vizity <= 2:
        return 3  # Новый клиент
    elif vizity <= 10:
        return 1  # Обычный клиент
    elif vizity <= 18:
        return 2  # Постоянный клиент
    else:
        return 4  # VIP клиент
    
@admin_router.get("/clients")
def get_all_clients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    clients = db.query(Klient).all()

    result = []

    for c in clients:

        category = db.query(KategoriiKlientov).filter(
            KategoriiKlientov.id_kategoriiklient == c.id_kategoriiklient
        ).first()

        result.append({
            "id_klienta": c.id_klienta,
            "fio": c.fio,
            "telefon": c.telefon,
            "email": c.email,

            "kolichestvo_vizitov": c.kolichestvo_vizitov,

            "id_kategoriiklient": c.id_kategoriiklient,
            "kategoriya": category.nazvanie if category else "Без категории",

            "data_pervogo_vizita": str(c.data_pervogo_vizita) if c.data_pervogo_vizita else "",
            "data_poslednego_vizita": str(c.data_poslednego_vizita) if c.data_poslednego_vizita else ""
        })

    return result


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
        raise HTTPException(status_code=404)

    # базовые поля
    client.fio = data.get("fio")
    client.telefon = data.get("telefon")
    client.email = data.get("email")

    # визиты
    if data.get("kolichestvo_vizitov") is not None:
        client.kolichestvo_vizitov = int(data.get("kolichestvo_vizitov"))

    # 🔥 пересчёт категории ВСЕГДА
    client.id_kategoriiklient = get_kategoriya_by_vizity(
        client.kolichestvo_vizitov
    )

    # даты
    if data.get("data_pervogo_vizita"):
        client.data_pervogo_vizita = datetime.strptime(
            data["data_pervogo_vizita"],
            "%Y-%m-%d"
        ).date()

    if data.get("data_poslednego_vizita"):
        client.data_poslednego_vizita = datetime.strptime(
            data["data_poslednego_vizita"],
            "%Y-%m-%d"
        ).date()

    db.commit()

    return {"message": "Клиент обновлен"}

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

    vizity = int(data.get("kolichestvo_vizitov") or 0)

    new_client = Klient(
        fio=data.get("fio"),
        telefon=data.get("telefon"),
        email=data.get("email"),

        kolichestvo_vizitov=vizity,
        id_kategoriiklient=get_kategoriya_by_vizity(vizity),

        data_pervogo_vizita=(
            datetime.strptime(data["data_pervogo_vizita"], "%Y-%m-%d").date()
            if data.get("data_pervogo_vizita")
            else None
        ),

        data_poslednego_vizita=(
            datetime.strptime(data["data_poslednego_vizita"], "%Y-%m-%d").date()
            if data.get("data_poslednego_vizita")
            else None
        )
    )

    db.add(new_client)
    db.commit()

    return {"message": "Клиент добавлен"}

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
        Klient.id_user == current_user.id_user
    ).first()

        if not klient:
             raise HTTPException(status_code=404, detail="Клиент не найден")
        vremya_str = data.get("vremya")

        if len(vremya_str) == 5:
            vremya_obj = datetime.strptime(
                vremya_str,
                "%H:%M"
            ).time()
        else:
            vremya_obj = datetime.strptime(
                vremya_str,
                "%H:%M:%S"
            ).time()

        # СОЗДАЕМ ОСНОВНУЮ ЗАПИСЬ
        new_record = Zapisi(
        id_klienta=klient.id_klienta,
        id_mastera=int(data.get("id_mastera")),
        id_uslugi=int(data.get("id_uslugi")),
        data=datetime.strptime(
            data.get("data"),
            "%Y-%m-%d"
                ).date(),
                vremya=vremya_obj
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
        klient.kolichestvo_vizitov += 1

        klient.id_kategoriiklient = get_kategoriya_by_vizity(
        klient.kolichestvo_vizitov
    )

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

    now = datetime.now()

    past = []
    upcoming = []

    for r in records:

        review = db.query(Otzyv).filter(
            Otzyv.id_zapisi == r.id_zapisi
        ).first()

        incident = db.query(Incidenty).filter(
            Incidenty.id_klienta == klient.id_klienta,
            Incidenty.id_mastera == r.id_mastera,
            Incidenty.id_uslugi == r.id_uslugi
        ).first()

        record_datetime = datetime.strptime(
            f"{r.data} {r.vremya}",
            "%Y-%m-%d %H:%M:%S"
        )

        item = {
            "id_zapisi": r.id_zapisi,

            "data": str(r.data),
            "vremya": str(r.vremya),

            "master": r.master.fio if r.master else "",

            "usluga": (
                r.usluga.nazvanie
                if r.usluga else ""
            ),

            "extra_uslugi": [
                u.id_uslugi
                for u in r.dop_uslugi
            ],
            # ✅ ЖАЛОБА
            "has_incident": bool(incident),
            "incident": {
                "tip_incidenta": incident.tip_incidenta,
                "opisanie": incident.opisanie,
                "status": incident.status,
                "data": str(incident.data)
            } if incident else None,


            # 👇 ОТЗЫВ
            "has_review": True if review else False,
            

            "review": {
                "ocenka": review.ocenka,
                "tekst_otzyva": review.tekst_otzyva,
                "data_otzyva": str(review.data_otzyva)
            } if review else None
        }

        if record_datetime < now:
            past.append(item)
        else:
            upcoming.append(item)

    return {
        "past": past,
        "upcoming": upcoming
    }

@history_router.post("/review")
def create_review(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
        klient = db.query(Klient).filter(
            Klient.id_user == current_user.id_user
        ).first()

        if not klient:
            raise HTTPException(status_code=404)

        # проверка что запись существует
        zapis = db.query(Zapisi).filter(
            Zapisi.id_zapisi == data.get("id_zapisi")
        ).first()

        if not zapis:
            raise HTTPException(status_code=404)

        # запрет повторного отзыва
        existing = db.query(Otzyv).filter(
            Otzyv.id_zapisi == zapis.id_zapisi
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Отзыв уже существует"
            )

        review = Otzyv(
            id_klienta=klient.id_klienta,
            id_mastera=zapis.id_mastera,
            id_zapisi=zapis.id_zapisi,
            ocenka=data.get("ocenka"),
            tekst_otzyva=data.get("tekst_otzyva")
        )

        db.add(review)
        db.commit()

        return {
            "message": "Отзыв сохранен"
        }
@history_router.post("/incident")
def create_incident(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    klient = db.query(Klient).filter(
        Klient.id_user == current_user.id_user
    ).first()

    zapisi = db.query(Zapisi).filter(
        Zapisi.id_zapisi == data["id_zapisi"]
    ).first()

    if not zapisi:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    incident = Incidenty(
        id_klienta=klient.id_klienta,
        id_mastera=zapisi.id_mastera,
        id_uslugi=zapisi.id_uslugi,
        tip_incidenta=data["tip_incidenta"],
        opisanie=data["opisanie"],
        data=datetime.now(),
        status="new"
        
    )
    

    db.add(incident)
    db.commit()

    return {"message": "incident created"}

# ===================== РАСПИСАНИЕ
@admin_router.get("/schedule")
def get_schedule(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    records = db.query(Zapisi).all()

    result = []

    for r in records:

        record_datetime = datetime.strptime(
            f"{r.data} {r.vremya}",
            "%Y-%m-%d %H:%M:%S"
        )

        # только будущие записи
        if record_datetime < datetime.now():
            continue

        result.append({
            "id_zapisi": r.id_zapisi,

            "master": (
                r.master.fio
                if r.master else ""
            ),

            "klient": (
                r.klient.fio
                if r.klient else ""
            ),

            "usluga": (
                r.usluga.nazvanie
                if r.usluga else ""
            ),

            "data": str(r.data),

            "vremya_nachala": (
                str(r.vremya)[:5]
                if r.vremya else ""
            ),

            # раз запись существует -> слот занят
            "status": "Занято"
        })

    return result
@admin_router.post("/payments")
def create_payment(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    zapis = db.query(Zapisi).filter(
        Zapisi.id_zapisi == data.get("id_zapisi")
    ).first()

    if not zapis:
        raise HTTPException(status_code=404)

    klient = db.query(Klient).filter(
        Klient.id_klienta == zapis.id_klienta
    ).first()

    procent_map = {
        1: 0.03,
        2: 0.07,
        3: 0.01,
        4: 0.10,
    }

    summa_fact = Decimal(str(data.get("summa_fact") or 0))
    summa_bonus = Decimal(str(data.get("summa_bonus") or 0))
    summa = Decimal(str(data.get("summa") or 0))

    if summa_fact + summa_bonus != summa:
        raise HTTPException(
            status_code=400,
            detail="Сумма оплаты некорректна"
        )
    if summa_fact < 0 or summa_bonus < 0 or summa < 0:
        raise HTTPException(
            status_code=400,
            detail="Суммы не могут быть отрицательными"
        )
    

    procent = Decimal(str(
    procent_map.get(klient.id_kategoriiklient, 0)
))

    # начисление
    nachislenie = (
    summa_fact * procent
        ).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP
        )

    if klient.programma_loyalnosti:

        if (
            summa_bonus >
            klient.programma_loyalnosti.balans_bonysov
        ):
            raise HTTPException(
                status_code=400,
                detail="Недостаточно бонусов"
            )

    if summa_bonus > 0:
        klient.programma_loyalnosti.balans_bonysov -= summa_bonus

    klient.programma_loyalnosti.balans_bonysov += nachislenie

    payment = Platyzhi(
    id_zapisi=zapis.id_zapisi,
    summa=summa,
    summa_fact=summa_fact,
    summa_bonus=summa_bonus,
    tip_oplaty=data.get("tip_oplaty"),
    data_platyzha=datetime.now(),
    nachisleno_bonusov=nachislenie
)

    db.add(payment)
    db.commit()

    return {
        "message": "Оплата сохранена",
        "bonus_added": nachislenie
    }


# ПОЛУЧИТЬ ВСЕ УСЛУГИ


@admin_router.get("/uslugi")
def get_uslugi(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    uslugi = (
            db.query(Usluga)
            .options(joinedload(Usluga.kategoria))  # 👈 ВОТ СЮДА
            .all()
        )

    return uslugi


# ДОБАВИТЬ УСЛУГУ

@admin_router.post("/uslugi")
def create_usluga(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.id_role != 3:
        raise HTTPException(
            status_code=403,
            detail="Нет доступа"
        )

    usluga = Usluga(
        nazvanie=data.get("nazvanie"),
        opisanie=data.get("opisanie"),
        cena=data.get("cena")
    )

    db.add(usluga)

    db.commit()

    db.refresh(usluga)

    return {
        "message": "Услуга добавлена",
        "id": usluga.id_uslugi
    }


# РЕДАКТИРОВАТЬ УСЛУГУ

@admin_router.put("/uslugi/{id_uslugi}")
def update_usluga(
    id_uslugi: int,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.id_role != 3:
        raise HTTPException(
            status_code=403,
            detail="Нет доступа"
        )

    usluga = db.query(Usluga).filter(
        Usluga.id_uslugi == id_uslugi
    ).first()

    if not usluga:
        raise HTTPException(
            status_code=404,
            detail="Услуга не найдена"
        )

    usluga.nazvanie = data.get("nazvanie")

    usluga.opisanie = data.get("opisanie")

    usluga.cena = data.get("cena")

    db.commit()

    return {
        "message": "Услуга обновлена"
    }


# УДАЛИТЬ УСЛУГУ

@admin_router.delete("/uslugi/{id_uslugi}")
def delete_usluga(
    id_uslugi: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.id_role != 3:
        raise HTTPException(
            status_code=403,
            detail="Нет доступа"
        )

    usluga = db.query(Usluga).filter(
        Usluga.id_uslugi == id_uslugi
    ).first()

    if not usluga:
        raise HTTPException(
            status_code=404,
            detail="Услуга не найдена"
        )

    db.delete(usluga)

    db.commit()

    return {
        "message": "Услуга удалена"
    }

@admin_router.get("/payments")
def get_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.id_role != 3:
        raise HTTPException(status_code=403)

    payments = (
        db.query(Platyzhi)
        .options(
            joinedload(Platyzhi.zapis)
            .joinedload(Zapisi.klient),

            joinedload(Platyzhi.zapis)
            .joinedload(Zapisi.usluga)
        )
        .all()
    )

    result = []

    for p in payments:

        result.append({
            "id_platyzha": p.id_platyzha,

            "klient": (
                p.zapis.klient.fio
                if p.zapis and p.zapis.klient
                else "—"
            ),

            "usluga": (
                p.zapis.usluga.nazvanie
                if p.zapis and p.zapis.usluga
                else "—"
            ),

            "summa": float(p.summa),

            "summa_fact": float(p.summa_fact),

            "summa_bonus": float(p.summa_bonus),

            "tip_oplaty": p.tip_oplaty,

            "data_platyzha": str(p.data_platyzha),

            "nachisleno_bonusov": float(
                p.nachisleno_bonusov
            )
        })

    return result

@admin_router.post("/shifts")
def create_shift_for_master(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(
            status_code=403,
            detail="Нет доступа"
        )

    master = db.query(Master).filter(
        Master.id_mastera == data["id_mastera"]
    ).first()

    if not master:
        raise HTTPException(status_code=404)

    shift = Shift(
        id_mastera=master.id_mastera,
        data_smeny=datetime.strptime(data["data_smeny"], "%Y-%m-%d").date(),
        vremya_nachala=datetime.strptime(data["vremya_nachala"], "%H:%M").time(),
        vremya_okonchaniya=datetime.strptime(data["vremya_okonchaniya"], "%H:%M").time(),
        tip_smeny=data["tip_smeny"],
        kommentarii=data["kommentarii"]
    )

    db.add(shift)
    db.commit()
    db.refresh(shift)

    return shift

@admin_router.get("/shifts")
def get_shifts(
    date: str,
    masterId: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(
            status_code=403,
            detail="Нет доступа"
        )

    selected_date = datetime.strptime(date, "%Y-%m-%d").date()

    return db.query(Shift).filter(
        Shift.id_mastera == masterId,
        Shift.data_smeny == selected_date
    ).all()

@admin_router.delete("/shifts/{id_shift}")
def delete_shift(
    id_shift: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id_role != 3:
        raise HTTPException(
            status_code=403,
            detail="Нет доступа"
        )

    shift = db.query(Shift).filter(
        Shift.id_shift == id_shift
    ).first()

    if not shift:
        raise HTTPException(status_code=404)

    db.delete(shift)
    db.commit()

    return {"message": "deleted"}
#====================ИНЦИДЕНТЫ
@admin_router.get("/incidents")
def get_incidents(db: Session = Depends(get_db), current_user=Depends(get_current_user)):

    if current_user.id_role != 1:
        raise HTTPException(status_code=403)

    return db.query(Incidenty).all()

@admin_router.put("/incidents/{id}")
def update_incident_status(id: int, status: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):

    if current_user.id_role != 1:
        raise HTTPException(status_code=403)

    incident = db.query(Incidenty).filter(Incidenty.id_incidenta == id).first()

    if not incident:
        raise HTTPException(status_code=404)

    incident.status = status
    db.commit()

    return {"message": "updated"}
#====================отзывы
@admin_router.get("/reviews")
def get_reviews(db: Session = Depends(get_db), current_user=Depends(get_current_user)):

    if current_user.id_role != 1:
        raise HTTPException(status_code=403)

    return db.query(Otzyv).all()