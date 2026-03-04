from cryptography.fernet import Fernet
from core.config import settings
from core import db
import json, base64
from hashlib import sha256

class TokenVault:
    """AES-256 Fernet encryption for platform tokens."""

    def __init__(self):
        master_key = settings.VAULT_MASTER_KEY.encode()
        derived = base64.urlsafe_b64encode(sha256(master_key).digest())
        self.fernet = Fernet(derived)

    async def store(self, seller_id: str, platform: str, credentials: dict):
        plaintext = json.dumps(credentials).encode()
        ciphertext = self.fernet.encrypt(plaintext).decode()
        await db.execute(
            """
            INSERT INTO platform_tokens (seller_id, platform, encrypted_token, created_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (seller_id, platform) DO UPDATE SET
                encrypted_token = $3, updated_at = NOW()
            """,
            seller_id, platform, ciphertext,
        )

    async def retrieve(self, seller_id: str, platform: str) -> dict:
        row = await db.fetch_one(
            "SELECT encrypted_token FROM platform_tokens WHERE seller_id = $1 AND platform = $2",
            seller_id, platform,
        )
        if not row:
            raise ValueError(f"No {platform} credentials for seller {seller_id}")
        plaintext = self.fernet.decrypt(row["encrypted_token"].encode())
        return json.loads(plaintext)

    async def rotate_key(self, new_master_key: str):
        new_fernet = Fernet(base64.urlsafe_b64encode(sha256(new_master_key.encode()).digest()))
        rows = await db.fetch_all("SELECT seller_id, platform, encrypted_token FROM platform_tokens")
        for row in rows:
            plaintext = self.fernet.decrypt(row["encrypted_token"].encode())
            new_cipher = new_fernet.encrypt(plaintext).decode()
            await db.execute(
                "UPDATE platform_tokens SET encrypted_token = $1 WHERE seller_id = $2 AND platform = $3",
                new_cipher, row["seller_id"], row["platform"],
            )
        self.fernet = new_fernet

token_vault = TokenVault()

async def get_decrypted_token(seller_id: str, platform: str) -> dict:
    return await token_vault.retrieve(seller_id, platform)
