"""Эндпоинты дашборда по обороту терминалов."""

from __future__ import annotations

from fastapi import APIRouter, Query

from app.data.analytics import (
    build_distribution,
    build_segments,
    build_summary,
    top_terminals,
)
from app.data.store import PERIOD_LABEL, get_terminals
from app.schemas.dashboard import BucketOut, SegmentOut, SummaryOut, TerminalOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=SummaryOut)
def summary() -> SummaryOut:
    data = build_summary(list(get_terminals()))
    return SummaryOut(
        terminals=data.terminals,
        payments=data.payments,
        turnover=data.turnover,
        reward=data.reward,
        commission=data.commission,
        avg_check=data.avg_check,
        zero_commission_count=data.zero_commission_count,
        zero_commission_turnover=data.zero_commission_turnover,
        period=PERIOD_LABEL,
    )


@router.get("/segments", response_model=list[SegmentOut])
def segments() -> list[SegmentOut]:
    return [SegmentOut(**vars(s)) for s in build_segments(list(get_terminals()))]


@router.get("/distribution", response_model=list[BucketOut])
def distribution() -> list[BucketOut]:
    return [BucketOut(**vars(b)) for b in build_distribution(list(get_terminals()))]


@router.get("/terminals", response_model=list[TerminalOut])
def terminals(limit: int = Query(default=20, ge=1, le=215)) -> list[TerminalOut]:
    return [
        TerminalOut(
            number=t.number,
            name=t.name,
            payments=t.payments,
            turnover=t.from_client,
            reward=t.reward,
            commission=t.commission,
            avg_check=t.avg_check,
            has_commission=t.has_commission,
        )
        for t in top_terminals(list(get_terminals()), limit=limit)
    ]
