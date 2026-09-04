# План обучения и реализации

## Зафиксированная целевая архитектура

Учебная система состоит ровно из двух приложений: `api-gateway` (публичный HTTP API и gRPC client) и `task-service` (внутренний gRPC server и владелец Task-данных). Вспомогательные CLI/scripts не являются микросервисами. `.proto` — источник истины контракта. Auth — отложенный scope.

Перед началом задачи выбираются связанные course IDs и записываются в `TASKS.md`. До завершения задачи обновляется checklist; `VERIFIED` допустим только после проверки. Кодовые пины добавляются в том же коммите, что и реализация, а learning log фиксирует закрытые IDs.

| Слой | Статус | Цель и теория | Планируемые изменения | Проверка и Definition of Done | Course coverage |
|---|---|---|---|---|---|
| 0. Governance и документация | Выполнен | Approval workflow, traceability | Документация и learning log | Документы согласованы; diff check | NEST-001–005, GRPC-001–015 |
| 1. Bootstrap и Nest configuration | Частично подготовлен | Nest 10, pnpm, CommonJS, strict, monorepo | Apps, tsconfig, aliases, ESLint/Prettier, scripts | Обе apps собираются; lint без fix | NEST-001–005, GRPC-016–022 |
| 2. gRPC contracts | Не начат | Proto-first, ts-proto | `libs/contracts`, generated types, build assets | Генерация воспроизводима; один контракт | GRPC-001–004, GRPC-016–019 |
| 3. Transport bootstrap | Не начат | Fastify, gRPC, ConfigModule, Pino, lifecycle | Gateway, Task Server, client, health, shutdown | Processes start; health/shutdown | GRPC-020–022, GRPC-050–052 |
| 4. Unary Todo и RpcLab | Не начат | Nest layers, unary RPC | CRUD, REST DTO, Sum API | REST→gRPC; CRUD/Sum tested | NEST-006–022, GRPC-023–027, GRPC-059–068 |
| 5. Validation и errors | Не начат | Pipes, validation, status mapping | ValidationPipe, filters, neutral errors | Invalid input/errors tested | NEST-023–030, GRPC-050–052 |
| 6. PostgreSQL и TypeORM | Не начат | Data Mapper, repositories, migrations | Docker, Task entity, persistent CRUD | Migrations and persistence work | NEST-031–044, GRPC-059–069 |
| 7. Server streaming | Не начат | Observable streams, cancellation | Task list stream, Primes API | Stream/cancel tests | GRPC-028–032 |
| 8. Client streaming | Не начат | Aggregation | Batch tasks, Average API | Aggregation/error tests | GRPC-033–037 |
| 9. Bidirectional streaming | Не начат | Duplex lifecycle | Todo bidi stream, Maximum API | Complete/error/cancel tests | GRPC-038–042 |
| 10. Advanced gRPC | Не начат | Metadata, deadlines, limits, retry | Safe retry and unavailable handling | Deadline/cancel visible | GRPC-050–056 |
| 11. Security | Не начат | TLS, mTLS, transport security | Local TLS/mTLS, optional service authorization | Training certs work | GRPC-015, GRPC-053–054 |
| 12. Observability и HTTP/2 | Не начат | Logs, correlation, HTTP/2 internals | RPC metrics and transport lab | Metrics/frames separated | GRPC-005–010, GRPC-057 |
| 13. Testing | Не начат | Unit, integration, e2e | RPC modes, errors, deadlines, Postman | Target scenarios automated | NEST-013, NEST-023–030, GRPC-023–056 |
| 14. Operations | Не начат | Containers, readiness, ports | Dockerfiles, Compose, runbook | Local operations reproducible | NEST-031–033, GRPC-020–022, GRPC-053–056 |
| 15. Final demo | Не начат | Evidence and trade-offs | Demo, technical logs, README | Demo reproducible | NEST-006–044, GRPC-001–069 |

## Optional scope (только после отдельного решения)

Authentication и ownership перечислены в checklist как `DEFERRED`: NEST-045–067.
