from fastapi import FastAPI
from pydantic import BaseModel
from generator import generate_nail_design
from prompts import NAIL_STYLES

app = FastAPI()

class Request(BaseModel):
    style: str  # simple / medium / hard
    custom_prompt: str = ""

@app.post("/generate")
def generate(req: Request):

    base_prompt = NAIL_STYLES.get(req.style, NAIL_STYLES["simple"])

    final_prompt = base_prompt + ", " + req.custom_prompt

    image = generate_nail_design(final_prompt)

    path = "result.png"
    image.save(path)

    return {"status": "ok", "image": path}