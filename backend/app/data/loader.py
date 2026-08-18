"""
Чтение отчёта ElPay по обороту терминалов из legacy .xls.

Файл пишет не Excel, поэтому его внутренняя структура слегка повреждена —
xlrd открывается с ignore_workbook_corruption=True. Данные при этом целы.
"""

from __future__ import annotations

import csv
from pathlib import Path

import xlrd

from app.data.models import Terminal

FIRST_DATA_ROW = 3

COL_NUMBER = 0
COL_NAME = 1
COL_PAYMENTS = 2
COL_FROM_CLIENT = 3
COL_TO_CREDIT = 4
COL_COMMISSION = 5
COL_REWARD = 6
COL_TOTAL = 7
COL_BASE_RENT = 8


def load_terminals(path: Path, region: str = "Ташкент") -> list[Terminal]:
    """
    Читает лист с оборотом и возвращает список терминалов.

    Строка "Итого:" в конце файла пропускается: в колонке номера
    там текст, а не число.
    """
    if not path.exists():
        raise FileNotFoundError(f"Файл отчёта не найден: {path}")

    book = xlrd.open_workbook(str(path), ignore_workbook_corruption=True)
    sheet = book.sheet_by_index(0)

    terminals: list[Terminal] = []
    for row in range(FIRST_DATA_ROW, sheet.nrows):
        raw_number = sheet.cell_value(row, COL_NUMBER)
        if not isinstance(raw_number, float):
            continue

        terminals.append(
            Terminal(
                number=int(raw_number),
                name=str(sheet.cell_value(row, COL_NAME)).strip(),
                payments=int(sheet.cell_value(row, COL_PAYMENTS) or 0),
                from_client=float(sheet.cell_value(row, COL_FROM_CLIENT) or 0),
                to_credit=float(sheet.cell_value(row, COL_TO_CREDIT) or 0),
                commission=float(sheet.cell_value(row, COL_COMMISSION) or 0),
                reward=float(sheet.cell_value(row, COL_REWARD) or 0),
                total=float(sheet.cell_value(row, COL_TOTAL) or 0),
                region=region,
            )
        )

    if not terminals:
        raise ValueError(f"В файле не найдено ни одной строки данных: {path}")

    return terminals


def load_terminals_csv(path: Path, region: str = "Ташкент") -> list[Terminal]:
    """
    Читает CSV-выгрузку ElPay (с колонкой "Аренда") и возвращает терминалы.

    Строка "Итого:" в конце файла пропускается так же, как в .xls-загрузчике.
    """
    if not path.exists():
        raise FileNotFoundError(f"Файл отчёта не найден: {path}")

    with path.open(encoding="utf-8", newline="") as f:
        rows = list(csv.reader(f))

    terminals: list[Terminal] = []
    for row in rows[1:]:
        raw_number = row[COL_NUMBER]
        if not raw_number.isdigit():
            continue

        terminals.append(
            Terminal(
                number=int(raw_number),
                name=row[COL_NAME].strip(),
                payments=int(row[COL_PAYMENTS] or 0),
                from_client=float(row[COL_FROM_CLIENT] or 0),
                to_credit=float(row[COL_TO_CREDIT] or 0),
                commission=float(row[COL_COMMISSION] or 0),
                reward=float(row[COL_REWARD] or 0),
                total=float(row[COL_TOTAL] or 0),
                region=region,
                base_rent=float(row[COL_BASE_RENT] or 0),
            )
        )

    if not terminals:
        raise ValueError(f"В файле не найдено ни одной строки данных: {path}")

    return terminals
