"""
Пересобирает backend/app/data/report.json из CSV-выгрузок по регионам.

Источники лежат в data/private/ (в .gitignore, в репозиторий не попадают).
Бэкенд CSV не читает — только report.json (см. коммит 095867a), поэтому
после правки любого CSV этот скрипт нужно перезапустить и закоммитить
получившийся report.json, иначе на Render ничего не изменится.

С июля 2026 источники — CSV с колонкой "Аренда" (базовая аренда терминала),
а не .xls, как раньше: xls не содержал эту колонку.

Запуск:
    cd backend && poetry run python ../scripts/build_report.py
"""

from __future__ import annotations

import csv
import json
import sys
from dataclasses import asdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "backend"))

from app.data.loader import COL_FROM_CLIENT, load_terminals_csv  # noqa: E402

SOURCES = [
    ("data/private/elpay-toshkent-july-2026.csv", "Ташкент"),
    ("data/private/elpay-qashqadaryo-july-2026.csv", "Кашкадарья"),
    ("data/private/elpay-andijon-july-2026.csv", "Андижан"),
]

OUTPUT = ROOT / "backend/app/data/report.json"


def itogo_turnover(path: Path) -> float:
    """Оборот из строки 'Итого:' — независимая сверка с суммой терминалов."""
    with path.open(encoding="utf-8", newline="") as f:
        rows = list(csv.reader(f))
    return float(rows[-1][COL_FROM_CLIENT])


def main() -> None:
    all_terminals = []

    for rel_path, region in SOURCES:
        path = ROOT / rel_path
        terminals = load_terminals_csv(path, region=region)
        loaded_turnover = sum(t.from_client for t in terminals)
        expected_turnover = itogo_turnover(path)

        if abs(loaded_turnover - expected_turnover) > 1:
            raise ValueError(
                f"{region}: сумма терминалов {loaded_turnover:,.2f} "
                f"не сходится со строкой 'Итого:' {expected_turnover:,.2f}"
            )

        print(
            f"{region}: {len(terminals)} терминалов, "
            f"оборот {loaded_turnover:,.0f} — сходится с 'Итого:'".replace(",", " ")
        )
        all_terminals.extend(terminals)

    OUTPUT.write_text(
        json.dumps([asdict(t) for t in all_terminals], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    regions = sorted({t.region for t in all_terminals})
    total_turnover = sum(t.from_client for t in all_terminals)

    print(f"\nЗаписей всего: {len(all_terminals)}")
    print(f"Регионов: {regions}")
    print(f"Суммарный оборот: {total_turnover:,.0f}".replace(",", " "))
    print(f"Записано в: {OUTPUT}")


if __name__ == "__main__":
    main()
