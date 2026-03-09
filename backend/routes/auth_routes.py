from fastapi import APIRouter, HTTPException
from models.user_model import SignupRequest, LoginRequest, AuthResponse, UserResponse
from database.supabase_client import get_supabase_admin
from utils.security import hash_password, verify_password, create_access_token
from utils.sms import send_login_sms, send_signup_sms
import uuid
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


# ── POST /auth/signup ─────────────────────────────────────────────────────────

@router.post("/signup", response_model=AuthResponse, status_code=201)
async def signup(data: SignupRequest):
    db = get_supabase_admin()

    existing = db.table("users").select("id").eq("email", data.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    hashed  = hash_password(data.password)

    result = db.table("users").insert({
        "id":            user_id,
        "name":          data.name,
        "email":         data.email,
        "password_hash": hashed,
        "country":       "India",
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create user")

    token = create_access_token({"sub": user_id, "email": data.email})
    logger.info(f"New user signed up: {data.email}")

    # SMS welcome — fires only if phone was provided at signup
    phone = getattr(data, "phone", None)
    if phone:
        await send_signup_sms(phone=phone, name=data.name)

    return AuthResponse(
        access_token=token,
        user=UserResponse(id=user_id, name=data.name, email=data.email),
    )


# ── POST /auth/login ──────────────────────────────────────────────────────────

@router.post("/login", response_model=AuthResponse)
async def login(data: LoginRequest):
    db = get_supabase_admin()

    result = db.table("users").select("*").eq("email", data.email).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = result.data[0]
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user["id"], "email": user["email"]})
    logger.info(f"User logged in: {data.email}")

    # SMS login notification — fires only if user has a phone saved
    phone = user.get("phone")
    if phone:
        await send_login_sms(phone=phone, name=user.get("name", "there"))

    return AuthResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            phone=phone,
            city=user.get("city"),
            state=user.get("state"),
            country=user.get("country"),
            address=user.get("address"),
        ),
    )