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
from app.data.models import Terminal
from app.data.store import PERIOD_LABEL, get_terminals
from app.schemas.dashboard import (
    BucketOut,
    EfficiencyItemOut,
    EfficiencyOut,
    RegionSummaryOut,
    SegmentOut,
    SummaryOut,
    TerminalOut,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
    dependencies=[Depends(require_auth)],
)

# Потолок /terminals?limit= считается от факта в report.json, а не
# захардкожен: захардкоженные 215 уже один раз молча обрезали половину
# сети, когда добавили второй и третий регион (см. Блок 2.2 в задаче).
MAX_TERMINALS = len(get_terminals())


def _filtered_terminals(region: str | None) -> list[Terminal]:
    terminals = list(get_terminals())
    if region:
        terminals = [t for t in terminals if t.region == region]
    return terminals


@router.get("/summary", response_model=SummaryOut)
def summary(region: str | None = Query(default=None)) -> SummaryOut:
    data = build_summary(_filtered_terminals(region))
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
def segments(region: str | None = Query(default=None)) -> list[SegmentOut]:
    return [
        SegmentOut(
            name=s.name,
            count=s.count,
            turnover=s.turnover,
            share=s.share,
            payments=s.payments,
            avg_check=s.avg_check,
        )
        for s in build_segments(_filtered_terminals(region))
    ]


@router.get("/distribution", response_model=list[BucketOut])
def distribution(region: str | None = Query(default=None)) -> list[BucketOut]:
    return [
        BucketOut(label=b.label, count=b.count, turnover=b.turnover)
        for b in build_distribution(_filtered_terminals(region))
    ]


@router.get("/terminals", response_model=list[TerminalOut])
def terminals(
    limit: int = Query(default=20, ge=1, le=MAX_TERMINALS),
    order: str = Query(default="desc", pattern="^(asc|desc)$"),
    region: str | None = Query(default=None),
) -> list[TerminalOut]:
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
            region=t.region,
        )
        for t in top_terminals(
            _filtered_terminals(region), limit=limit, ascending=order == "asc"
        )
    ]


@router.get("/efficiency", response_model=EfficiencyOut)
def efficiency(region: str | None = Query(default=None)) -> EfficiencyOut:
    best, worst, average = efficiency_ranking(_filtered_terminals(region), limit=5)

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


@router.get("/regions", response_model=list[RegionSummaryOut])
def regions() -> list[RegionSummaryOut]:
    all_terminals = list(get_terminals())
    network_turnover = build_summary(all_terminals).turnover or 1.0

    result: list[RegionSummaryOut] = []
    for region_name in sorted({t.region for t in all_terminals}):
        group = [t for t in all_terminals if t.region == region_name]
        data = build_summary(group)
        _, _, average_yield = efficiency_ranking(group)

        result.append(
            RegionSummaryOut(
                region=region_name,
                terminals=data.terminals,
                payments=data.payments,
                turnover=data.turnover,
                share=data.turnover / network_turnover * 100,
                avg_check=data.avg_check,
                reward=data.reward,
                yield_per_million=average_yield,
                zero_commission_count=data.zero_commission_count,
            )
        )
    return result
