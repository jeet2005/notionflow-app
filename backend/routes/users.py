from fastapi import APIRouter, HTTPException, Depends
from models import User
import database
from datetime import datetime

router = APIRouter()

def get_db():
    return database.get_db()

@router.get("/me", response_model=User)
async def get_current_user(user_id: str, db=Depends(get_db)):
    """Get current user info"""
    try:
        result = db.table("users").select("*").eq("id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
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

@router.put("/me", response_model=User)
async def update_user(user_update: dict, user_id: str, db=Depends(get_db)):
    """Update user profile"""
    try:
        update_data = {k: v for k, v in user_update.items() if v is not None}
        update_data["updated_at"] = datetime.utcnow().isoformat()

        result = db.table("users").update(update_data).eq("id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
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