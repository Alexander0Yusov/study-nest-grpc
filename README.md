# study-nest-grpc

Учебный Todo-проект для освоения NestJS, gRPC, PostgreSQL, TypeORM и production-подходов.

## Архитектура

В проекте ровно два приложения:

- `api-gateway` — публичный HTTP API и gRPC client;
- `task-service` — внутренний gRPC server и владелец Task-данных.

```text
HTTP client / Postman → API Gateway → gRPC → Task Service → PostgreSQL
```

Третьего микросервиса нет. Auth — отложенный scope и не входит в базовый MVP.

## Текущий статус

Репозиторий — Nest monorepo с NestJS 10, pnpm, CommonJS, strict TypeScript и двумя applications в `apps/`. Учебные gRPC contracts, transport, Task persistence и Todo API ещё не реализованы.

## Документация

- [План обучения и реализации](PLAN.md)
- [Матрица покрытия тем NestJS и gRPC](docs/course-checklist.md)
- [Карта Nest-конфигурации](docs/nest-configuration.md)
- [Learning log](docs/learning-log.md)
- [Правила работы агента](AGENTS.md)
- [Текущая одобренная задача](TASKS.md)
