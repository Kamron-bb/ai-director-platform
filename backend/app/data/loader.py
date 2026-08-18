"""
Чтение отчёта ElPay по обороту терминалов из legacy .xls.

Файл пишет не Excel, поэтому его внутренняя структура слегка повреждена —
xlrd открывается с ignore_workbook_corruption=True. Данные при этом целы.
"""

from __future__ import annotations

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
