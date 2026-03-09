from fastapi import APIRouter, Depends, HTTPException
from models.user_model import ProfileUpdateRequest, UserResponse
from database.supabase_client import get_supabase_admin
from utils.security import get_current_user
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    db = get_supabase_admin()

    result = db.table("users").select("*").eq("id", current_user["sub"]).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")

    user = result.data[0]

    return UserResponse(
        id=str(user["id"]),
        name=user.get("name"),
        email=user["email"],
        phone=user.get("phone"),
        city=user.get("city"),
        state=user.get("state"),
        country=user.get("country"),
        address=user.get("address"),
        created_at=user.get("created_at"),
    )


@router.post("/profile", response_model=UserResponse)
async def update_profile(
    data: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    db = get_supabase_admin()

    update_data = {k: v for k, v in data.model_dump().items() if v is not None}

    db.table("users").update(update_data).eq("id", current_user["sub"]).execute()

    result = db.table("users").select("*").eq("id", current_user["sub"]).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")

    user = result.data[0]

    logger.info(f"Profile updated for user: {current_user['email']}")

    return UserResponse(
        id=str(user["id"]),
        name=user.get("name"),
        email=user["email"],
        phone=user.get("phone"),
        city=user.get("city"),
        state=user.get("state"),
        country=user.get("country"),
        address=user.get("address"),
        created_at=user.get("created_at"),
    )