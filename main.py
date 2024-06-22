from fastapi import FastAPI, File, UploadFile, Request, Body
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from html import escape
import cv2
import numpy as np
from io import BytesIO
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import json

# Configure allowed origins (adjust as needed)
allowed_origins = [
    "https://ai.pksinha.co.uk/face-detection",
    "https://ai.pksinha.co.uk"
]

app = FastAPI()
# Add CORS middleware with some restrictions
class SecurityHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1: mode=block'
        response.headers['Content-Security-Policy'] = "default-src 'self'"
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['Referrer-Policy'] = 'no-referrer'
        response.headers['Permissions-Policy'] = (
            "accelerometer=(), autoplay=(), camera=(), "
            "fullscreen=(), geolocation=(), gyroscope=(), "
            "magnetometer=(), microphone=(), midi=(), "
            "payment=(), sync-xhr=(), usb=(), vr=()"
        )
        response.headers['Expect-CT'] = 'max-age=86400, enforce'
        response.headers['X-Permitted-Cross-Domain-Policies'] = 'none'
        return response

app.add_middleware(SecurityHeaderMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
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
