from pydantic import BaseModel

class LoginSchema(BaseModel):
    telefon: str
    password: str


class RegisterSchema(BaseModel):
    telefon: str
    fio: str
    email: str
    password: str
    

