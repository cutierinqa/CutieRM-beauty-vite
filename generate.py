from diffusers import StableDiffusionPipeline
import torch

model_id = "runwayml/stable-diffusion-v1-5"

pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16
)

pipe = pipe.to("cuda")

prompt = """
beautiful realistic manicure,
pink nude nails,
luxury nail design,
salon quality,
professional manicure,
high detail,
soft lighting
"""

image = pipe(
    prompt,
    num_inference_steps=20,
    guidance_scale=7.5
).images[0]

image.save("result.png")

print("ГОТОВО")