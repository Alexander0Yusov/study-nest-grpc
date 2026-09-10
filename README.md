# study-nest-grpc

Учебный NestJS monorepo для практики HTTP API, аутентификации, gRPC и PostgreSQL.

## Технологии

NestJS, TypeScript, pnpm, Fastify, gRPC, Protocol Buffers, RxJS, TypeORM, PostgreSQL, JWT и Swagger/OpenAPI.

## Архитектура

```text
HTTP Client → API Gateway → gRPC → Task Service → PostgreSQL
```

API Gateway и Task Service используют разные логические базы в одном PostgreSQL-контейнере: `study_gateway` и `study_tasks`.

## Реализовано

- NestJS monorepo и трёхслойная архитектура;
- JWT access/refresh authentication, Guards, validation и error mapping;
- TypeORM и PostgreSQL;
- Swagger/OpenAPI;
- все четыре типа gRPC RPC.

| Тип | gRPC method | HTTP endpoint |
| --- | --- | --- |
| Unary | `CreateTask`, `GetTask`, `GetTasksPage` | `POST /tasks`, `GET /tasks/:taskId`, `GET /tasks/paginated` |
| Server streaming | `StreamTasks` | `GET /tasks` |
| Client streaming | `UpdateTaskStatuses` | `PATCH /tasks/status` |
| Bidirectional streaming | `DeleteTasks` | `DELETE /tasks/batch` |

## Зачем gRPC

gRPC использует Protocol Buffers, строгие контракты и code generation; HTTP/2 даёт multiplexing, header compression и двунаправленный streaming. Streaming в отдельных Task-сценариях выбран осознанно для учебной практики и не заявляется оптимальным бизнес-решением.

## Требования

- Node.js;
- pnpm;
- Docker Desktop.

Точные версии Node.js, pnpm и Docker Desktop в репозитории не зафиксированы.

## Быстрый локальный запуск

```bash
pnpm install
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/task-service/.env.example apps/task-service/.env
pnpm run dev
```

`pnpm run dev` поднимает или переиспользует PostgreSQL, собирает contracts и запускает Task Service и API Gateway. Завершайте работу через `Ctrl+C`: локальные сервисы остановятся, PostgreSQL продолжит работать.

## Пошаговый запуск

```bash
pnpm install
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/task-service/.env.example apps/task-service/.env
pnpm run infra:up
pnpm run build:contracts
```

Первый терминал:

```bash
pnpm run start:task-service
```

Второй терминал:

```bash
pnpm run start:api-gateway
```

## Управление инфраструктурой

```bash
pnpm run infra:up
pnpm run infra:stop
pnpm run infra:down
```

`infra:up` создаёт или запускает PostgreSQL и ждёт readiness. `infra:stop` останавливает контейнер, сохраняя контейнер, network и named volume. `infra:down` удаляет compose-контейнер и network, но сохраняет named volume и данные БД.

## Адреса

```text
API Gateway: http://localhost:3000
Swagger UI: http://localhost:3000/docs
OpenAPI JSON: http://localhost:3000/docs-json
Task Service gRPC: localhost:50051
PostgreSQL: localhost:5435
```

## Разработка контрактов

```bash
pnpm run proto:generate
pnpm run build:contracts
pnpm run proto:copy-assets
pnpm run build:all
```

`proto:generate` нужен только после изменения `.proto` и требует `protoc`. В обычном запуске используются уже хранимые в Git generated TypeScript-контракты.

Подробный учебный прогресс: [LEARNING_LOG.md](./LEARNING_LOG.md)
