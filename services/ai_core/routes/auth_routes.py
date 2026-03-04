from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from security.otp import send_otp, verify_otp
from security.jwt_handler import JWTHandler
from security.passwords import hash_password
from core import db

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
jwt_handler = JWTHandler()


class SendOtpRequest(BaseModel):
    phone: str

class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str

class GoogleLoginRequest(BaseModel):
    email: str
    name: str
    google_id: str
    picture: str = ""


@router.post("/send-otp")
async def api_send_otp(req: SendOtpRequest):
    success = await send_otp(req.phone)
    if not success:
        raise HTTPException(429, "Too many OTP requests. Retry after 1 hour.")
    return {"status": "otp_sent", "phone": req.phone}


@router.post("/verify-otp")
async def api_verify_otp(req: VerifyOtpRequest):
    valid = await verify_otp(req.phone, req.otp)
    if not valid:
        raise HTTPException(400, "Invalid or expired OTP")

    # Find or create seller
    seller = await db.fetch_one(
        "SELECT id, name FROM sellers WHERE phone = $1", req.phone,
    )
    if not seller:
        # Auto-create seller on first OTP verification
        seller_id = await db.fetch_val(
            """INSERT INTO sellers (name, phone, password_hash, created_at)
               VALUES ($1, $2, $3, NOW()) RETURNING id""",
            req.phone, req.phone, hash_password("otp_verified"),
        )
        seller_name = req.phone
    else:
        seller_id = str(seller["id"])
        seller_name = seller["name"]

    # Issue JWT
    token = jwt_handler.create_access_token(seller_id) if jwt_handler.private_key else f"mock_jwt_{seller_id}"

    return {
        "status": "verified",
        "seller_id": seller_id,
        "seller_name": seller_name,
        "jwt_token": token,
    }


@router.post("/google-login")
async def google_login(req: GoogleLoginRequest):
    # Find by email or create
    seller = await db.fetch_one(
        "SELECT id, name FROM sellers WHERE email = $1", req.email,
    )
    if not seller:
        seller_id = await db.fetch_val(
            """INSERT INTO sellers (name, email, phone, password_hash, created_at)
               VALUES ($1, $2, $3, $4, NOW()) RETURNING id""",
            req.name, req.email, f"google_{req.google_id}", hash_password(req.google_id),
        )
        seller_name = req.name
    else:
        seller_id = str(seller["id"])
        seller_name = seller["name"]

    token = jwt_handler.create_access_token(seller_id) if jwt_handler.private_key else f"mock_jwt_{seller_id}"

    return {
        "status": "authenticated",
        "seller_id": seller_id,
        "seller_name": seller_name,
        "jwt_token": token,
    }
