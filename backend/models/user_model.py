from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProfileUpdateRequest(BaseModel):
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = "India"
    address: Optional[str] = None
    alert_dashboard: Optional[bool] = True
    alert_email: Optional[bool] = True
    alert_sms: Optional[bool] = False


class UserResponse(BaseModel):
    id: str
    name: Optional[str] = None
    email: EmailStr

    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None

    created_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse