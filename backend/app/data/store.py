"""Хранилище отчёта в памяти. Файл читается один раз при старте."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from app.data.loader import load_terminals
from app.data.models import Terminal

REPORT_PATH = Path(__file__).resolve().parents[3] / "data" / "private" / "elpay-july-2026.xls"
PERIOD_LABEL = "Июль 2026"


@lru_cache(maxsize=1)
def get_terminals() -> tuple[Terminal, ...]:
    """
    Кортеж, а не список — lru_cache требует неизменяемости,
    иначе вызывающий код мог бы испортить общий кеш.
    """
    return tuple(load_terminals(REPORT_PATH))
