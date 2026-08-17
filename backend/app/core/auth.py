"""Простая защита демо одним паролем."""

from __future__ import annotations

import hmac

from fastapi import Header, HTTPException, status

from app.core.config import get_settings


def verify_password(password: str) -> bool:
    """compare_digest защищает от подбора по времени ответа."""
    expected = get_settings().demo_password
    if not expected:
        return False
    return hmac.compare_digest(password, expected)


def require_auth(x_demo_token: str = Header(default="")) -> None:
    """Зависимость FastAPI: пускает дальше только с верным токеном."""
    if not verify_password(x_demo_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный пароль",
        )
