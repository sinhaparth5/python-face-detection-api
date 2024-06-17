from fastapi import FastAPI, File, UploadFile, Request, Body
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from html import escape
import cv2
import numpy as np
from io import BytesIO
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
import json

# Configure allowed origins (adjust as needed)
allowed_origins = [
    "https://ai.pksinha.co.uk/face-detection",
    "https://ai.pksinha.co.uk"
]

app = FastAPI()

# Add CORS middleware with some restrictions (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,  # Disable credentials for now
    allow_methods=["*"],  # Consider restricting methods if necessary
    allow_headers=["*"],  # Consider restricting headers if necessary
)

face_cascade = cv2.CascadeClassifier('frontalface.xml')

@app.post("/api/v1/face-detection")
async def detect_face(file: UploadFile = File(...)):
    content = await file.read()
    nparr = np.frombuffer(content, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    faces = face_cascade.detectMultiScale(img, 1.1, 4)

    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)

    _, img_encode = cv2.imencode('.png', img)
    img_bytes = BytesIO(img_encode.tobytes())

    return StreamingResponse(img_bytes, media_type="image/png")
