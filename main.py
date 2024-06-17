from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
from io import BytesIO
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.templates import TemplateResponse
from starlette.requests import Request

# Configure allowed origins (adjust as needed)
allowed_origins = ["https://pksinha.co.uk"]

# Custom XSS protection middleware
async def xss_protection_middleware(request: Request, call_next):
    # Access request data (e.g., query params, body) for sanitization
    data = request.query_params if request.method == "GET" else await request.body()
    # Sanitize data using bleach (consider customizing allowed tags/attributes)
    cleaned_data = clean(data, tags=[], attributes={}, strip=True)

    # Update request object with sanitized data
    async def wrapped_call_next():
        request.scope["cleaned_data"] = cleaned_data
        response = await call_next()
        return response
    response = await wrapped_call_next()

    # Escape data in templates before rendering (if using templates)
    if isinstance(response, TemplateResponse):
        response.context_data["cleaned_data"] = cleaned_data  # Pass sanitized data to template
    return response

app = FastAPI()

# Add XSS protection middleware
app.add_middleware(xss_protection_middleware)

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

    _, img_decode = cv2.imencode('.png', img)
    img_bytes = BytesIO(img_decode.tobytes())

    return StreamingResponse(img_bytes, media_type="image/png")