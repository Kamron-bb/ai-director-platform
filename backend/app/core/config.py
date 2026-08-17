"""Конфигурация приложения. Читается из .env один раз при старте."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../.env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "AI Director Platform"
    app_env: str = "local"
    api_port: int = 8000
    demo_password: str = ""
    cors_origins: str = "http://localhost:3000"


@lru_cache
def get_settings() -> Settings:
    """Кешируем, чтобы .env не перечитывался на каждый запрос."""
    return Settings()
