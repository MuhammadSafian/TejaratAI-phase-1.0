import jwt
from cryptography.hazmat.primitives import serialization
from datetime import datetime, timedelta
from core.config import settings
from core import db
import uuid, os

class JWTHandler:
    ACCESS_EXPIRY  = timedelta(minutes=15)
    REFRESH_EXPIRY = timedelta(days=7)

    def __init__(self):
        priv_path = settings.JWT_PRIVATE_KEY_PATH
        pub_path  = settings.JWT_PUBLIC_KEY_PATH
        if priv_path and os.path.exists(priv_path):
            with open(priv_path, "rb") as f:
                self.private_key = serialization.load_pem_private_key(f.read(), password=None)
            with open(pub_path, "rb") as f:
                self.public_key = serialization.load_pem_public_key(f.read())
        else:
            self.private_key = None
            self.public_key = None

    def create_access_token(self, seller_id: str) -> str:
        return jwt.encode({
            "sub":  seller_id,
            "type": "access",
            "jti":  str(uuid.uuid4()),
            "iat":  datetime.utcnow(),
            "exp":  datetime.utcnow() + self.ACCESS_EXPIRY,
        }, self.private_key, algorithm="RS256")

    def create_refresh_token(self, seller_id: str) -> str:
        jti = str(uuid.uuid4())
        token = jwt.encode({
            "sub":  seller_id,
            "type": "refresh",
            "jti":  jti,
            "iat":  datetime.utcnow(),
            "exp":  datetime.utcnow() + self.REFRESH_EXPIRY,
        }, self.private_key, algorithm="RS256")
        return token

    def verify_token(self, token: str, token_type: str = "access") -> dict:
        payload = jwt.decode(token, self.public_key, algorithms=["RS256"])
        if payload.get("type") != token_type:
            raise jwt.InvalidTokenError("Wrong token type")
        return payload

    def rotate_refresh_token(self, old_refresh_token: str) -> tuple[str, str]:
        payload = self.verify_token(old_refresh_token, "refresh")
        new_access  = self.create_access_token(payload["sub"])
        new_refresh = self.create_refresh_token(payload["sub"])
        return new_access, new_refresh
