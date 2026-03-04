from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://tijarat:password@localhost:5432/tijarat"
    REDIS_URL: str = "redis://localhost:6379"
    GOOGLE_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    VAULT_MASTER_KEY: str = "dummy_vault_key"

    # Daraz
    DARAZ_APP_KEY: str = ""
    DARAZ_APP_SECRET: str = ""

    # Courier APIs
    TCS_API_KEY: str = ""
    LEOPARDS_API_KEY: str = ""
    LEOPARDS_API_PASSWORD: str = ""
    POSTEX_TOKEN: str = ""
    TRAX_API_KEY: str = ""
    TRAX_USERNAME: str = ""
    BLUEEX_USERNAME: str = ""
    BLUEEX_PASSWORD: str = ""

    # WhatsApp
    WHATSAPP_TOKEN: str = ""
    WHATSAPP_PHONE_ID: str = ""

    # JWT
    JWT_PRIVATE_KEY_PATH: str = ""
    JWT_PUBLIC_KEY_PATH: str = ""

    # Platform
    APP_URL: str = "http://localhost"

    class Config:
        env_file = ".env"

settings = Settings()
