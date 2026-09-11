# study-nest-grpc

Учебный NestJS monorepo для практики HTTP API, аутентификации, gRPC и PostgreSQL.

## Технологии

NestJS, TypeScript, pnpm, Fastify, gRPC, Protocol Buffers, RxJS, TypeORM, PostgreSQL, JWT и Swagger/OpenAPI.

## Архитектура

```text
HTTP Client → API Gateway → gRPC → Task Service → PostgreSQL
```

API Gateway и Task Service используют разные логические базы в одном PostgreSQL-контейнере: `gateway_db` и `task_db`.

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

## Режимы запуска

> **Не запускайте оба режима одновременно.** В каждом режиме запускаются собственные экземпляры API Gateway и Task Service. При одновременном запуске экземпляры Gateway конфликтуют за host port `3000`, а два экземпляра Task Service могут параллельно обрабатывать запросы и работать с одними данными. Перед переключением полностью остановите текущий режим.

### Локальная разработка

Для изменений кода используйте:

> Если локальные `.env` ещё не созданы, скопируйте их из `.env.example`. Не выполняйте команды копирования поверх существующих `.env`, чтобы не потерять локальные секреты и настройки.

```bash
pnpm install --frozen-lockfile

cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/task-service/.env.example apps/task-service/.env

pnpm dev
```

`.env.example` содержит безопасные шаблонные значения. При необходимости замените значения `replace-with-...` уникальными локальными JWT secrets. Файлы `.env` не должны попадать в Git.

`pnpm dev` использует `compose.yaml` вместе с `compose.dev.yaml`:

```text
infra:up → PostgreSQL → db-init → migration jobs →
локальный Task Service → локальный API Gateway
```

В Docker работают PostgreSQL, `db-init`, `gateway-migrations` и `task-migrations`; Task Service и Gateway — локальные Node.js-процессы. PostgreSQL доступен им на `127.0.0.1:15432`; Gateway использует `gateway_db`, а Task Service — `task_db`. Этот режим удобен для разработки и логов приложений в терминале.

> Если локальные `.env` были созданы ранее, синхронизируйте их с актуальными `.env.example`: используйте `GATEWAY_DB_PORT=15432`, `GATEWAY_DB_NAME=gateway_db`, `TASK_DB_PORT=15432` и `TASK_DB_NAME=task_db`. Удалите устаревшие переменные `GATEWAY_DB_SYNCHRONIZE` и `TASK_DB_SYNCHRONIZE`, если они присутствуют. TypeORM `synchronize` отключён, а схема обеих баз управляется только миграциями.

`Ctrl+C` завершает только локальные Node.js-процессы. Инфраструктурой управляют:

```bash
pnpm infra:stop
pnpm infra:down
```

`infra:stop` останавливает контейнеры без удаления. `infra:down` удаляет контейнеры и сеть текущего Compose-проекта. Обе команды не используют `-v`, поэтому named volume PostgreSQL и данные сохраняются.

### Полностью контейнерный локальный запуск

Это режим проверки проекта, требуемый руководителем:

```bash
docker compose up --build
```

Эквивалентный pnpm alias:

```bash
pnpm docker:up
```

Compose собирает образы при необходимости, запускает PostgreSQL, создаёт `gateway_db` и `task_db`, применяет миграции, а затем запускает Task Service и API Gateway во внутренней сети. PostgreSQL наружу не публикуется: контейнеры используют `postgres:5432`, Gateway обращается к Task Service по `task-service:50051`. Gateway доступен на [http://localhost:3000](http://localhost:3000).

- Gateway: [http://localhost:3000](http://localhost:3000)
- Swagger/OpenAPI: [http://localhost:3000/docs](http://localhost:3000/docs)
- OpenAPI JSON: [http://localhost:3000/docs-json](http://localhost:3000/docs-json)

Дополнительные команды:

```bash
pnpm docker:up:detach
pnpm docker:ps
pnpm docker:logs
pnpm docker:stop
pnpm docker:down
```

`docker:up:detach` запускает систему в фоне; `docker:ps` показывает состояние; `docker:logs` открывает логи; `docker:stop` останавливает контейнеры; `docker:down` удаляет контейнеры и сеть, но сохраняет named volume, поскольку `-v` не используется. Ручной запуск миграций после `docker compose up --build` не нужен.

`db-init`, `gateway-migrations` и `task-migrations` — одноразовые контейнеры: после успеха они отображаются как `Exited (0)`. Это нормальное состояние. Постоянно работают `postgres`, `task-service` и `api-gateway`.

### Переключение между режимами

Из локальной разработки в Docker:

1. Остановите `pnpm dev` через `Ctrl+C`.
2. Выполните `pnpm infra:down`.
3. Выполните `pnpm docker:up` или `docker compose up --build`.

Из Docker в локальную разработку:

1. Если Compose работает в foreground, остановите его через `Ctrl+C`.
2. Выполните `pnpm docker:down`.
3. Выполните `pnpm dev`.

`docker:down` и `infra:down` не используют `-v`, поэтому named volume PostgreSQL и данные сохраняются.

| Характеристика | Локальная разработка | Полностью в Docker |
| --- | --- | --- |
| Команда | `pnpm dev` | `docker compose up --build` или `pnpm docker:up` |
| Compose-файлы | `compose.yaml` + `compose.dev.yaml` | Только `compose.yaml` |
| PostgreSQL | Docker, `127.0.0.1:15432` | Docker, наружу не опубликован |
| DB init и миграции | Docker jobs | Docker jobs |
| Task Service | Локальный Node.js-процесс | Docker-контейнер |
| API Gateway | Локальный Node.js-процесс | Docker-контейнер |
| Назначение | Разработка | Воспроизводимый запуск и проверка |
| Одновременный запуск с другим режимом | Не допускается | Не допускается |

## Разработка контрактов

```bash
pnpm run proto:generate
pnpm run build:contracts
pnpm run proto:copy-assets
pnpm run build:all
```

`proto:generate` нужен только после изменения `.proto` и требует `protoc`. В обычном запуске используются уже хранимые в Git generated TypeScript-контракты.

Подробный учебный прогресс: [LEARNING_LOG.md](./LEARNING_LOG.md)
