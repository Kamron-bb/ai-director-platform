"""Вход в демо."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.auth import verify_password

router = APIRouter(tags=["auth"])


class LoginIn(BaseModel):
    password: str


class LoginOut(BaseModel):
    token: str


@router.post("/login", response_model=LoginOut)
def login(payload: LoginIn) -> LoginOut:
    if not verify_password(payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный пароль",
        )
    return LoginOut(token=payload.password)
