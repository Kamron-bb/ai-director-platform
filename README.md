# El-Pay Dashboard

Аналитическая платформа для сети платёжных терминалов: исполнительный
дашборд, мониторинг терминалов, прогнозирование оборота и AI-аналитик
с доступом к данным только на чтение.

## Стек

| Слой           | Технологии                                     |
|----------------|------------------------------------------------|
| Frontend       | Next.js, React, TypeScript, TailwindCSS        |
| Визуализация   | собственная, на SVG (без BI и chart-библиотек)  |
| Backend        | Python 3.12, FastAPI, Pydantic, SQLAlchemy     |
| Данные         | PostgreSQL (OLTP), ClickHouse (OLAP), dbt      |
| Инфраструктура | Docker, GitHub Actions                         |
| AI             | Claude API, семантический слой, read-only SQL  |

## Структура

    backend/         FastAPI-приложение
    frontend/        Next.js-дашборд
    data/            генераторы и валидация синтетических данных
    dbt/             staging → intermediate → marts
    infrastructure/  docker-compose, конфигурация окружений
    scripts/         служебные скрипты
    tests/           сквозные тесты
    docs/            архитектура и решения

## Локальный запуск

Скопируйте `.env.example` в `.env` и заполните значения:

    cp .env.example .env

## Статус

В разработке. MVP — декабрь 2026, продакшн — январь 2027.
