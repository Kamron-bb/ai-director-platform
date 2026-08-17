"""Ручная проверка парсера. Запуск: poetry run python -m app.data.check"""

from pathlib import Path

from app.data.loader import load_terminals

REPORT = Path(__file__).resolve().parents[3] / "data" / "private" / "elpay-july-2026.xls"


def main() -> None:
    terminals = load_terminals(REPORT)

    turnover = sum(t.from_client for t in terminals)
    payments = sum(t.payments for t in terminals)
    reward = sum(t.reward for t in terminals)
    zero_commission = [t for t in terminals if not t.has_commission]

    print(f"Терминалов:      {len(terminals)}")
    print(f"Оборот:          {turnover:,.0f}")
    print(f"Платежей:        {payments:,}")
    print(f"Вознаграждение:  {reward:,.0f}")
    print(f"Средний чек:     {turnover / payments:,.0f}")
    print(f"Без комиссии:    {len(zero_commission)} терм., оборот {sum(t.from_client for t in zero_commission):,.0f}")

    print("\nТоп-5 по обороту:")
    for t in sorted(terminals, key=lambda x: -x.from_client)[:5]:
        print(f"  {t.number}  {t.name[:32]:32} {t.from_client:>15,.0f}")


if __name__ == "__main__":
    main()
