"""Схемы ответов дашборда."""

from __future__ import annotations

from pydantic import BaseModel


class SummaryOut(BaseModel):
    terminals: int
    payments: int
    turnover: float
    reward: float
    commission: float
    avg_check: float
    zero_commission_count: int
    zero_commission_turnover: float
    period: str


class SegmentOut(BaseModel):
    name: str
    count: int
    turnover: float
    share: float
    payments: int
    avg_check: float


class BucketOut(BaseModel):
    label: str
    count: int
    turnover: float


class TerminalOut(BaseModel):
    number: int
    name: str
    payments: int
    turnover: float
    reward: float
    commission: float
    avg_check: float
    has_commission: bool


class EfficiencyItemOut(BaseModel):
    number: int
    name: str
    turnover: float
    reward: float
    yield_per_million: float
    ratio_to_average: float


class EfficiencyOut(BaseModel):
    average: float
    best: list[EfficiencyItemOut]
    worst: list[EfficiencyItemOut]
