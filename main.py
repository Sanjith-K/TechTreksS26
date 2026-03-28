from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import spaces, occupancy, profiles, auth

app = FastAPI(title="NYU Spaces API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spaces.router)
app.include_router(occupancy.router)
app.include_router(profiles.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "NYU Spaces API is running"}