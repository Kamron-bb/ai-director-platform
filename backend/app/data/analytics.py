"""Расчёт показателей для дашборда по данным отчёта."""

from __future__ import annotations

from dataclasses import dataclass

from app.data.models import Terminal


@dataclass(frozen=True, slots=True)
class Summary:
    """Сводка по всей сети — верхние KPI-карточки."""

    terminals: int
    payments: int
    turnover: float
    reward: float
    commission: float
    avg_check: float
    zero_commission_count: int
    zero_commission_turnover: float


@dataclass(frozen=True, slots=True)
class Segment:
    """Группа терминалов по объёму оборота."""

    name: str
    count: int
    turnover: float
    share: float
    payments: int
    avg_check: float


@dataclass(frozen=True, slots=True)
class Bucket:
    """Диапазон оборота для гистограммы распределения."""

    label: str
    count: int
    turnover: float


SEGMENT_BOUNDS: list[tuple[str, int, int | None]] = [
    ("Топ-20", 0, 20),
    ("21–60", 20, 60),
    ("61–120", 60, 120),
    ("Остальные", 120, None),
]

BUCKET_BOUNDS: list[tuple[float, float, str]] = [
    (0, 10_000_000, "до 10 млн"),
    (10_000_000, 25_000_000, "10–25 млн"),
    (25_000_000, 50_000_000, "25–50 млн"),
    (50_000_000, 75_000_000, "50–75 млн"),
    (75_000_000, 100_000_000, "75–100 млн"),
    (100_000_000, 150_000_000, "100–150 млн"),
    (150_000_000, float("inf"), "свыше 150 млн"),
]


def build_summary(terminals: list[Terminal]) -> Summary:
    payments = sum(t.payments for t in terminals)
    turnover = sum(t.from_client for t in terminals)
    without_commission = [t for t in terminals if not t.has_commission]

    return Summary(
        terminals=len(terminals),
        payments=payments,
        turnover=turnover,
        reward=sum(t.reward for t in terminals),
        commission=sum(t.commission for t in terminals),
        avg_check=turnover / payments if payments else 0.0,
        zero_commission_count=len(without_commission),
        zero_commission_turnover=sum(t.from_client for t in without_commission),
    )


def build_segments(terminals: list[Terminal]) -> list[Segment]:
    ranked = sorted(terminals, key=lambda t: -t.from_client)
    total = sum(t.from_client for t in ranked) or 1.0

    segments: list[Segment] = []
    for name, low, high in SEGMENT_BOUNDS:
        group = ranked[low:high] if high is not None else ranked[low:]
        if not group:
            continue

        turnover = sum(t.from_client for t in group)
        payments = sum(t.payments for t in group)
        segments.append(
            Segment(
                name=name,
                count=len(group),
                turnover=turnover,
                share=turnover / total * 100,
                payments=payments,
                avg_check=turnover / payments if payments else 0.0,
            )
        )
    return segments


def build_distribution(terminals: list[Terminal]) -> list[Bucket]:
    buckets: list[Bucket] = []
    for low, high, label in BUCKET_BOUNDS:
        group = [t for t in terminals if low <= t.from_client < high]
        buckets.append(
            Bucket(
                label=label,
                count=len(group),
                turnover=sum(t.from_client for t in group),
            )
        )
    return buckets


def top_terminals(terminals: list[Terminal], limit: int = 20) -> list[Terminal]:
    return sorted(terminals, key=lambda t: -t.from_client)[:limit]
