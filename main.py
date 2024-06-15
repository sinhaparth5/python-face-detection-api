from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from io import BytesIO

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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

    _, img_decode = cv2.imencode('.png', img)
    img_bytes = BytesIO(img_decode.tobytes())

    return StreamingResponse(img_bytes, media_type="image/png")