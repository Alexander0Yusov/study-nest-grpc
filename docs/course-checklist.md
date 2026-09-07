# Покрытие курсов NestJS и gRPC

Это единая traceability matrix: каждая практическая задача ссылается на course IDs, реализация получает кодовый пин, а после проверки обновляются этот checklist и learning log. Полностью проработанной тема считается только со статусом `VERIFIED`.

Статусы: `PLANNED` — запланирована; `THEORY` — теория разобрана без практики; `IMPLEMENTED` — код есть, проверка не завершена; `VERIFIED` — теория, практика и проверка завершены; `DEFERRED` — сознательно отложена; `NOT_APPLICABLE` — заменена или неприменима.

Кодовый пин всегда содержит относительную Markdown-ссылку на файл и имя класса, метода, функции или настройки, например `[TaskController.createTask](../apps/api-gateway/src/task/task.controller.ts)`. До реализации: `— будет добавлено в слое N`. Учебные IDs не добавляются в комментарии исходного кода и не используют номера строк.

## NestJS

| ID       | Тема курса                               | Практика в Todo-проекте                        | Статус   | Проверка/доказательство     | Кодовый пин                                |
| -------- | ---------------------------------------- | ---------------------------------------------- | -------- | --------------------------- | ------------------------------------------ |
| NEST-001 | Setup: Node.js и package manager         | Подтвердить Node/pnpm окружение                | PLANNED  | Версии и install documented | — будет добавлено в слое 1                 |
| NEST-002 | Setup: NestJS CLI                        | Зафиксировать CLI workflow                     | PLANNED  | CLI usage reproduced        | — будет добавлено в слое 1                 |
| NEST-003 | Setup: создание через Nest CLI           | Проследить исходный scaffold                   | PLANNED  | Scaffold объяснён           | — будет добавлено в слое 1                 |
| NEST-004 | Setup: структура NestJS-проекта          | Разобрать apps/libs                            | PLANNED  | Structure review            | — будет добавлено в слое 1                 |
| NEST-005 | Setup: standard и monorepo mode          | Сравнить current monorepo и corporate standard | PLANNED  | Configuration review        | — будет добавлено в слое 1                 |
| NEST-006 | REST: NestJS modules                     | Ввести domain module                           | PLANNED  | Module unit test            | — будет добавлено в слое 4                 |
| NEST-007 | REST: TasksModule                        | Создать Task module boundary                   | PLANNED  | Module imports verified     | — будет добавлено в слое 4                 |
| NEST-008 | REST: controllers                        | Разобрать HTTP transport role                  | PLANNED  | HTTP e2e                    | — будет добавлено в слое 4                 |
| NEST-009 | REST: TasksController                    | HTTP facade для Task                           | PLANNED  | Route e2e                   | — будет добавлено в слое 4                 |
| NEST-010 | REST: providers и services               | DI и domain service                            | PLANNED  | Unit test                   | — будет добавлено в слое 4                 |
| NEST-011 | REST: TasksService                       | Orchestration Gateway→gRPC                     | PLANNED  | Unit/integration test       | — будет добавлено в слое 4                 |
| NEST-012 | REST: получение всех задач               | List REST endpoint                             | PLANNED  | HTTP e2e                    | — будет добавлено в слое 4                 |
| NEST-013 | REST: Postman collection                 | Коллекция Todo requests                        | PLANNED  | Collection run              | — будет добавлено в слое 13                |
| NEST-014 | REST: Task model                         | Transport-facing task response                 | PLANNED  | DTO contract test           | — будет добавлено в слое 4                 |
| NEST-015 | REST: создание через controller          | Create HTTP route                              | PLANNED  | HTTP e2e                    | — будет добавлено в слое 4                 |
| NEST-016 | REST: создание через service             | gRPC create orchestration                      | PLANNED  | Service unit test           | — будет добавлено в слое 4                 |
| NEST-017 | REST: DTO                                | Request/response DTO boundary                  | PLANNED  | Validation test             | — будет добавлено в слое 4                 |
| NEST-018 | REST: CreateTaskDto                      | Validated create request                       | PLANNED  | Invalid input e2e           | — будет добавлено в слое 5                 |
| NEST-019 | REST: получение Task по ID               | Get HTTP route                                 | PLANNED  | HTTP e2e                    | — будет добавлено в слое 4                 |
| NEST-020 | REST: удаление Task                      | Delete HTTP route                              | PLANNED  | HTTP e2e                    | — будет добавлено в слое 4                 |
| NEST-021 | REST: обновление статуса                 | Update status route                            | PLANNED  | HTTP e2e                    | — будет добавлено в слое 4                 |
| NEST-022 | REST: поиск и фильтрация                 | List query parameters                          | PLANNED  | Query e2e                   | — будет добавлено в слое 5                 |
| NEST-023 | Validation: Pipes                        | Explain pipe placement                         | PLANNED  | Unit/e2e                    | — будет добавлено в слое 5                 |
| NEST-024 | Validation: global ValidationPipe        | Global input validation                        | PLANNED  | Bootstrap test              | — будет добавлено в слое 5                 |
| NEST-025 | Validation: создание Task                | Validate create fields                         | PLANNED  | Invalid create e2e          | — будет добавлено в слое 5                 |
| NEST-026 | Errors: несуществующая Task при get      | Map missing task                               | PLANNED  | 404 mapping e2e             | — будет добавлено в слое 5                 |
| NEST-027 | Errors: несуществующая Task при delete   | Map missing task                               | PLANNED  | 404 mapping e2e             | — будет добавлено в слое 5                 |
| NEST-028 | Validation: статус                       | Validate status enum                           | PLANNED  | Invalid status e2e          | — будет добавлено в слое 5                 |
| NEST-029 | Validation: фильтрация и поиск           | Validate query params                          | PLANNED  | Invalid query e2e           | — будет добавлено в слое 5                 |
| NEST-030 | Errors: HTTP boundary                    | Central gRPC→HTTP mapping                      | PLANNED  | Mapper unit test            | — будет добавлено в слое 5                 |
| NEST-031 | PostgreSQL: Docker                       | Local database container                       | PLANNED  | Compose health              | — будет добавлено в слое 6                 |
| NEST-032 | PostgreSQL                               | Database lifecycle basics                      | PLANNED  | Connection check            | — будет добавлено в слое 6                 |
| NEST-033 | PostgreSQL: подключение БД               | Configured DB connection                       | PLANNED  | Integration test            | — будет добавлено в слое 6                 |
| NEST-034 | TypeORM                                  | Integrate ORM                                  | PLANNED  | App boot                    | — будет добавлено в слое 6                 |
| NEST-035 | TypeORM: Task Entity                     | Persistent Task schema                         | PLANNED  | Migration/integration test  | — будет добавлено в слое 6                 |
| NEST-036 | TypeORM: Active Record и Data Mapper     | Choose and explain Data Mapper                 | PLANNED  | Architecture review         | — будет добавлено в слое 6                 |
| NEST-037 | TypeORM: Repository                      | Inject repository                              | PLANNED  | Service unit test           | — будет добавлено в слое 6                 |
| NEST-038 | Persistence: рефакторинг TasksService    | Delegate persistence to repository             | PLANNED  | Integration test            | — будет добавлено в слое 6                 |
| NEST-039 | Persistence: GetTaskById                 | Persisted get                                  | PLANNED  | Integration test            | — будет добавлено в слое 6                 |
| NEST-040 | Persistence: CreateTask                  | Persisted create                               | PLANNED  | Integration test            | — будет добавлено в слое 6                 |
| NEST-041 | Persistence: DeleteTask                  | Persisted delete                               | PLANNED  | Integration test            | — будет добавлено в слое 6                 |
| NEST-042 | Persistence: UpdateTaskStatus            | Persisted update                               | PLANNED  | Integration test            | — будет добавлено в слое 6                 |
| NEST-043 | Persistence: GetAllTasks                 | Persisted list                                 | PLANNED  | Integration test            | — будет добавлено в слое 6                 |
| NEST-044 | TypeORM: migrations                      | Reproducible schema changes                    | PLANNED  | Clean DB migration run      | — будет добавлено в слое 6                 |
| NEST-045 | Authentication и Authorization           | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-046 | AuthModule                               | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-047 | User Entity                              | Базовый MVP без users                          | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-048 | User Repository                          | Базовый MVP без users                          | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-049 | signup                                   | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-050 | credentials/password validation          | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-051 | username conflict                        | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-052 | безопасное хранение пароля               | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-053 | bcrypt                                   | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-054 | signin                                   | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-055 | JWT                                      | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-056 | JWT Module                               | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-057 | Passport                                 | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-058 | подписание JWT                           | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-059 | JWT validation                           | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-060 | custom GetUser decorator                 | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-061 | guards                                   | Базовый MVP без auth                           | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-062 | Ownership: связь User и Task             | Базовый MVP без ownership                      | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-063 | Ownership: пользователь владеет задачами | Базовый MVP без ownership                      | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-064 | Ownership: сериализация User             | Базовый MVP без ownership                      | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-065 | Ownership: ограничение списка задач      | Базовый MVP без ownership                      | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-066 | Ownership: ограничение получения по ID   | Базовый MVP без ownership                      | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |
| NEST-067 | Ownership: ограничение update/delete     | Базовый MVP без ownership                      | DEFERRED | Deferred by plan            | — будет добавлено после отдельного решения |

## gRPC

| ID       | Тема курса                                   | Практика в Todo-проекте                                                | Статус         | Проверка/доказательство                   | Кодовый пин                 |
| -------- | -------------------------------------------- | ---------------------------------------------------------------------- | -------------- | ----------------------------------------- | --------------------------- |
| GRPC-001 | Theory: Protocol Buffers                     | Объяснить protobuf contract                                            | PLANNED        | Theory note                               | — будет добавлено в слое 2  |
| GRPC-002 | Theory: schema-first contract                | `.proto` как source of truth                                           | PLANNED        | Contract review                           | — будет добавлено в слое 2  |
| GRPC-003 | Theory: language interoperability            | Generated types as boundary                                            | PLANNED        | Theory note                               | — будет добавлено в слое 2  |
| GRPC-004 | Theory: HTTP/2                               | Transport model                                                        | PLANNED        | Theory note                               | — будет добавлено в слое 12 |
| GRPC-005 | Theory: persistent connection                | Reuse gRPC channel                                                     | PLANNED        | Transport lab                             | — будет добавлено в слое 12 |
| GRPC-006 | Theory: multiplexing                         | Multiple RPC streams                                                   | PLANNED        | Transport lab                             | — будет добавлено в слое 12 |
| GRPC-007 | Theory: streams и frames                     | Explain HTTP/2 frames                                                  | PLANNED        | Transport lab                             | — будет добавлено в слое 12 |
| GRPC-008 | Theory: HPACK                                | Explain header compression                                             | PLANNED        | Transport lab                             | — будет добавлено в слое 12 |
| GRPC-009 | Theory: binary serialization                 | Compare protobuf payloads                                              | PLANNED        | Payload observation                       | — будет добавлено в слое 12 |
| GRPC-010 | Theory: gRPC metadata                        | Request metadata model                                                 | PLANNED        | Metadata test                             | — будет добавлено в слое 10 |
| GRPC-011 | Theory: status codes                         | gRPC error semantics                                                   | PLANNED        | Mapper test                               | — будет добавлено в слое 5  |
| GRPC-012 | Theory: четыре типа API                      | Unary and streaming map                                                | PLANNED        | Theory note                               | — будет добавлено в слое 4  |
| GRPC-013 | Theory: scalability                          | Boundary and connection trade-offs                                     | PLANNED        | Architecture note                         | — будет добавлено в слое 12 |
| GRPC-014 | Theory: security                             | Transport security concepts                                            | PLANNED        | Theory note                               | — будет добавлено в слое 11 |
| GRPC-015 | Theory: security                             | TLS/mTLS context                                                       | PLANNED        | TLS lab                                   | — будет добавлено в слое 11 |
| GRPC-016 | Setup: gRPC dependencies                     | Add approved packages                                                  | PLANNED        | Lockfile/build                            | — будет добавлено в слое 2  |
| GRPC-017 | Setup: proto files                           | Define contracts                                                       | PLANNED        | Proto lint/review                         | — будет добавлено в слое 2  |
| GRPC-018 | Setup: ts-proto                              | Generate typed bindings                                                | PLANNED        | Reproducible generation                   | — будет добавлено в слое 2  |
| GRPC-019 | Setup: generated TypeScript types            | Consume generated API                                                  | PLANNED        | Typecheck                                 | — будет добавлено в слое 2  |
| GRPC-020 | Setup: gRPC server bootstrap                 | Start Task Service transport                                           | PLANNED        | Integration smoke test                    | — будет добавлено в слое 3  |
| GRPC-021 | Setup: gRPC client bootstrap                 | Register Gateway client                                                | PLANNED        | Integration smoke test                    | — будет добавлено в слое 3  |
| GRPC-022 | Setup: Gateway → Task Service connection     | Call internal service                                                  | PLANNED        | End-to-end smoke test                     | — будет добавлено в слое 3  |
| GRPC-023 | Unary: API definition                        | Define unary RPCs                                                      | PLANNED        | Proto contract review                     | — будет добавлено в слое 4  |
| GRPC-024 | Unary: server implementation                 | Task handlers                                                          | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-025 | Unary: client implementation                 | Gateway unary client                                                   | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-026 | Unary: Todo CRUD                             | CRUD over unary RPC                                                    | PLANNED        | HTTP/gRPC e2e                             | — будет добавлено в слое 4  |
| GRPC-027 | Unary: Sum API                               | RpcLab Sum endpoint                                                    | PLANNED        | RPC test                                  | — будет добавлено в слое 4  |
| GRPC-028 | Server streaming: API definition             | Define server stream                                                   | PLANNED        | Proto review                              | — будет добавлено в слое 7  |
| GRPC-029 | Server streaming: server implementation      | Emit Task list stream                                                  | PLANNED        | Stream integration test                   | — будет добавлено в слое 7  |
| GRPC-030 | Server streaming: client implementation      | Consume stream in Gateway                                              | PLANNED        | Stream integration test                   | — будет добавлено в слое 7  |
| GRPC-031 | Server streaming: Todo stream                | Stream task list                                                       | PLANNED        | Completion/cancel test                    | — будет добавлено в слое 7  |
| GRPC-032 | Server streaming: Primes API                 | RpcLab primes stream                                                   | PLANNED        | RPC test                                  | — будет добавлено в слое 7  |
| GRPC-033 | Client streaming: API definition             | Define client stream                                                   | PLANNED        | Proto review                              | — будет добавлено в слое 8  |
| GRPC-034 | Client streaming: server implementation      | Aggregate task batch                                                   | PLANNED        | Stream integration test                   | — будет добавлено в слое 8  |
| GRPC-035 | Client streaming: client implementation      | Send task batch                                                        | PLANNED        | Stream integration test                   | — будет добавлено в слое 8  |
| GRPC-036 | Client streaming: Todo stream                | Batch task upload                                                      | PLANNED        | Message count test                        | — будет добавлено в слое 8  |
| GRPC-037 | Client streaming: Average API                | RpcLab average                                                         | PLANNED        | RPC test                                  | — будет добавлено в слое 8  |
| GRPC-038 | Bidirectional: API definition                | Define duplex stream                                                   | PLANNED        | Proto review                              | — будет добавлено в слое 9  |
| GRPC-039 | Bidirectional: server implementation         | Independent server flow                                                | PLANNED        | Stream integration test                   | — будет добавлено в слое 9  |
| GRPC-040 | Bidirectional: client implementation         | Independent client flow                                                | PLANNED        | Stream integration test                   | — будет добавлено в слое 9  |
| GRPC-041 | Bidirectional: Todo stream                   | Duplex task exchange                                                   | PLANNED        | Complete/error/cancel test                | — будет добавлено в слое 9  |
| GRPC-042 | Bidirectional: Maximum API                   | RpcLab maximum                                                         | PLANNED        | RPC test                                  | — будет добавлено в слое 9  |
| GRPC-043 | Advanced: error handling                     | Neutral errors and mapping                                             | PLANNED        | Unit/e2e                                  | — будет добавлено в слое 5  |
| GRPC-044 | Advanced: deadlines                          | Deadline propagation                                                   | PLANNED        | Deadline test                             | — будет добавлено в слое 10 |
| GRPC-045 | Advanced: cancellation                       | Cancellation propagation                                               | PLANNED        | Cancel test                               | — будет добавлено в слое 10 |
| GRPC-046 | Advanced: SSL/TLS                            | Local TLS                                                              | PLANNED        | TLS integration test                      | — будет добавлено в слое 11 |
| GRPC-047 | Advanced: mTLS                               | Local client certificate auth                                          | PLANNED        | mTLS integration test                     | — будет добавлено в слое 11 |
| GRPC-048 | Advanced: interceptors                       | Cross-cutting transport concerns                                       | PLANNED        | Interceptor test                          | — будет добавлено в слое 10 |
| GRPC-049 | Advanced: metadata                           | Pass and read metadata                                                 | PLANNED        | Metadata test                             | — будет добавлено в слое 10 |
| GRPC-050 | Advanced: message size limits                | Configure safe limits                                                  | PLANNED        | Oversized message test                    | — будет добавлено в слое 10 |
| GRPC-051 | Observability: активные RPC streams          | Stream gauge                                                           | PLANNED        | Metrics test                              | — будет добавлено в слое 12 |
| GRPC-052 | Observability: сообщения в stream            | Message counter                                                        | PLANNED        | Metrics test                              | — будет добавлено в слое 12 |
| GRPC-053 | Observability: protobuf sizes                | Payload-size metric                                                    | PLANNED        | Metrics test                              | — будет добавлено в слое 12 |
| GRPC-054 | Observability: HTTP/2 stream ID              | Observe stream identifier                                              | PLANNED        | Transport lab                             | — будет добавлено в слое 12 |
| GRPC-055 | Observability: HTTP/2 frame types            | Observe frame kinds                                                    | PLANNED        | Wireshark/NODE_DEBUG lab                  | — будет добавлено в слое 12 |
| GRPC-056 | Observability: frame sizes                   | Observe frame lengths                                                  | PLANNED        | Wireshark/NODE_DEBUG lab                  | — будет добавлено в слое 12 |
| GRPC-057 | Observability: streams in one TCP connection | Demonstrate multiplexing                                               | PLANNED        | Transport lab                             | — будет добавлено в слое 12 |
| GRPC-058 | Observability: Wireshark/tool                | Capture transport evidence                                             | PLANNED        | Saved lab procedure                       | — будет добавлено в слое 12 |
| GRPC-059 | CRUD: Create server                          | Create RPC handler                                                     | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-060 | CRUD: Create client                          | Gateway create RPC call                                                | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-061 | CRUD: Read server                            | Read RPC handler                                                       | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-062 | CRUD: Read client                            | Gateway read RPC call                                                  | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-063 | CRUD: Update server                          | Update RPC handler                                                     | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-064 | CRUD: Update client                          | Gateway update RPC call                                                | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-065 | CRUD: List server                            | List RPC handler                                                       | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-066 | CRUD: List client                            | Gateway list RPC call                                                  | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-067 | CRUD: Delete server                          | Delete RPC handler                                                     | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-068 | CRUD: Delete client                          | Gateway delete RPC call                                                | PLANNED        | Integration test                          | — будет добавлено в слое 4  |
| GRPC-069 | MongoDB курса                                | Заменено PostgreSQL + TypeORM: цель — gRPC CRUD и persistence boundary | NOT_APPLICABLE | Решение зафиксировано в PLAN/NestJS части | — заменено в слое 6         |

** ручные примечания
*выполнено:
protoc 36.0 + ts-proto 2.12.2;
shared contracts library;
импорт google.protobuf.Timestamp;
воспроизводимую генерацию;
ссылки на task.proto и generate-proto.cjs;
unary RPC пока не отмечай как VERIFIED — он только описан, но ещё не запущен.

gRPC-only bootstrap;
unary server implementation;
ручная проверка через Postman;
успешный optional description;
INVALID_ARGUMENT для пустого title;
ссылки на main.ts, task.controller.ts, task.service.ts.

единый .proto-контракт из libs/contracts;
копирование runtime .proto для обоих приложений;
ClientsModule.registerAsync() в Gateway;
DI-токен TASK_SERVICE_NAME из generated-контракта;
ClientGrpc и типизированный TaskServiceClient;
инициализация stub в onModuleInit();
unary-вызов через firstValueFrom();
маршрут POST /tasks → gRPC CreateTask;
глобальный gRPC→HTTP mapping в Gateway;
глобальный RpcExceptionFilter в Task Service;
сокрытие внутренних ошибок.
