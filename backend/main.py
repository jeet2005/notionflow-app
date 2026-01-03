from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NotionFlow API", version="1.0.0")

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes import auth, pages, users

@app.get("/")
async def root():
    return {"message": "NotionFlow API is running"}

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(pages.router, prefix="/pages", tags=["pages"])
app.include_router(users.router, prefix="/users", tags=["users"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)