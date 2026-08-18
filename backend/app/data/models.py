"""Структуры данных отчёта по обороту терминалов."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class Terminal:
    """Один терминал за отчётный период."""

    number: int
    name: str
    payments: int
    from_client: float
    to_credit: float
    commission: float
    reward: float
    total: float
    region: str = "Ташкент"

    @property
    def avg_check(self) -> float:
        """Средний чек. Ноль платежей возможен, поэтому проверка."""
        return self.from_client / self.payments if self.payments else 0.0

    @property
    def has_commission(self) -> bool:
        return self.commission > 0
