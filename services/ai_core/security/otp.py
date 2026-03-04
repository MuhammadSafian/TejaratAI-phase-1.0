import random
import redis.asyncio as aioredis
from core.config import settings
from integrations.whatsapp import WhatsAppBusinessAPI

OTP_EXPIRY_SECONDS = 300  # 5 minutes
OTP_LENGTH = 6

_redis = None

async def _get_redis():
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis


def generate_otp() -> str:
    """Generate a 6-digit OTP."""
    return str(random.randint(100000, 999999))


async def send_otp(phone: str) -> bool:
    """Generate OTP, store in Redis, send via WhatsApp."""
    otp = generate_otp()
    r = await _get_redis()

    # Store OTP with expiry
    key = f"otp:{phone}"
    await r.setex(key, OTP_EXPIRY_SECONDS, otp)

    # Track attempts (max 5 per hour)
    attempt_key = f"otp_attempts:{phone}"
    attempts = await r.get(attempt_key)
    if attempts and int(attempts) >= 5:
        return False  # Rate limited

    await r.incr(attempt_key)
    await r.expire(attempt_key, 3600)

    # Send via WhatsApp
    wa = WhatsAppBusinessAPI()
    msg = (
        f"🔐 Tejarat AI — Verification Code\n\n"
        f"Your OTP: *{otp}*\n\n"
        f"Yeh code 5 minute mein expire ho jayega.\n"
        f"Kisi ke saath share na karein."
    )
    result = await wa.send_text(phone, msg)
    return "messages" in result


async def verify_otp(phone: str, otp: str) -> bool:
    """Verify OTP from Redis."""
    r = await _get_redis()
    key = f"otp:{phone}"
    stored = await r.get(key)

    if stored is None:
        return False  # Expired or not sent

    if stored == otp:
        await r.delete(key)  # One-time use
        return True

    # Wrong OTP — track failed attempts
    fail_key = f"otp_fail:{phone}"
    fails = await r.incr(fail_key)
    await r.expire(fail_key, 900)  # 15 min lockout window

    if fails >= 5:
        await r.delete(key)  # Invalidate OTP after 5 wrong tries

    return False
