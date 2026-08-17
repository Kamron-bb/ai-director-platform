"""Эндпоинты дашборда по обороту терминалов."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.core.auth import require_auth

from app.data.analytics import (
    build_distribution,
    efficiency_ranking,
    yield_per_million,
    build_segments,
    build_summary,
    top_terminals,
)
from app.data.store import PERIOD_LABEL, get_terminals
from app.schemas.dashboard import (
    BucketOut,
    EfficiencyItemOut,
    EfficiencyOut,
    SegmentOut,
    SummaryOut,
    TerminalOut,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
    dependencies=[Depends(require_auth)],
)


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
    return [
        SegmentOut(
            name=s.name,
            count=s.count,
            turnover=s.turnover,
            share=s.share,
            payments=s.payments,
            avg_check=s.avg_check,
        )
        for s in build_segments(list(get_terminals()))
    ]


@router.get("/distribution", response_model=list[BucketOut])
def distribution() -> list[BucketOut]:
    return [
        BucketOut(label=b.label, count=b.count, turnover=b.turnover)
        for b in build_distribution(list(get_terminals()))
    ]


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


@router.get("/efficiency", response_model=EfficiencyOut)
def efficiency() -> EfficiencyOut:
    best, worst, average = efficiency_ranking(list(get_terminals()), limit=5)

    def convert(items: list) -> list[EfficiencyItemOut]:
        return [
            EfficiencyItemOut(
                number=t.number,
                name=t.name,
                turnover=t.from_client,
                reward=t.reward,
                yield_per_million=yield_per_million(t),
                ratio_to_average=yield_per_million(t) / average if average else 0.0,
            )
            for t in items
        ]

    return EfficiencyOut(
        average=average,
        best=convert(best),
        worst=convert(worst),
    )
