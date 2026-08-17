"""Хранилище отчёта в памяти. Файл читается один раз при старте."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from app.data.models import Terminal

REPORT_JSON = Path(__file__).resolve().parent / "report.json"
PERIOD_LABEL = "Июль 2026"


@lru_cache(maxsize=1)
def get_terminals() -> tuple[Terminal, ...]:
    """
    Кортеж, а не список — lru_cache требует неизменяемости,
    иначе вызывающий код мог бы испортить общий кеш.
    """
    if not REPORT_JSON.exists():
        raise FileNotFoundError(
            f"Файл данных не найден: {REPORT_JSON}. "
            "Сгенерируйте его из .xls перед запуском."
        )

    raw = json.loads(REPORT_JSON.read_text(encoding="utf-8"))
    return tuple(Terminal(**item) for item in raw)
