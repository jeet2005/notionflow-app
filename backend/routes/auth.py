from fastapi import APIRouter, HTTPException, Depends
from models import User, UserCreate, UserLogin
import database
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings (use environment variables in production)
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def get_db():
    return database.get_db()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=User)
async def register(user: UserCreate, db=Depends(get_db)):
    """Register a new user"""
    try:
        # Check if user exists
        existing = db.table("users").select("*").eq("email", user.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Hash password
        hashed_password = get_password_hash(user.password)

        # Create user
        user_data = {
            "email": user.email,
            "password_hash": hashed_password,
            "display_name": user.display_name,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }

        result = db.table("users").insert(user_data).execute()
        user_dict = result.data[0]
        return User(
            id=user_dict["id"],
            email=user_dict["email"],
            display_name=user_dict.get("display_name"),
            created_at=datetime.fromisoformat(user_dict["created_at"]),
            updated_at=datetime.fromisoformat(user_dict["updated_at"])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(user: UserLogin, db=Depends(get_db)):
    """Login user"""
    try:
        # Get user
        result = db.table("users").select("*").eq("email", user.email).execute()
        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        db_user = result.data[0]

        # Verify password
        if not verify_password(user.password, db_user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        db_user = result.data[0]
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user["id"],
                "email": db_user["email"],
                "display_name": db_user.get("display_name"),
                "created_at": db_user["created_at"],
                "updated_at": db_user["updated_at"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))