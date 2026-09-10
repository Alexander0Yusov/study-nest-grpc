# Learning Log

| Аспект обучения | Статус | **Практическая реализация** (ссылка на файл) |
| --- | --- | --- |
| HTTP/1.1 и HTTP/2 | Изучена теория | — |
| Multiplexing и header compression | Изучена теория | — |
| Основы gRPC | Изучена теория и выполнена практика | [Task proto](./libs/contracts/src/proto/task/v1/task.proto), [gRPC bootstrap](./apps/task-service/src/main.ts) |
| Protocol Buffers | Изучена теория и выполнена практика | [Task proto](./libs/contracts/src/proto/task/v1/task.proto) |
| ts-proto / code generation | Изучена теория и выполнена практика | [generator](./scripts/generate-proto.cjs), [contracts config](./libs/contracts) |
| Unary RPC | Изучена теория и выполнена практика | [Task handlers](./apps/task-service/src/task/task.controller.ts), [Gateway Task controller](./apps/api-gateway/src/task/task.controller.ts) |
| Server streaming | Изучена теория и выполнена практика | [Task streaming handler](./apps/task-service/src/task/task.controller.ts), [Gateway client](./apps/api-gateway/src/task/task.service.ts) |
| Client streaming | Изучена теория и выполнена практика | [Task streaming handler](./apps/task-service/src/task/task.controller.ts), [Gateway client](./apps/api-gateway/src/task/task.service.ts) |
| Bidirectional streaming | Изучена теория и выполнена практика | [Task streaming handler](./apps/task-service/src/task/task.controller.ts), [Gateway client](./apps/api-gateway/src/task/task.service.ts) |
| RxJS Observable/Subject | Изучена теория и выполнена практика | [Task Service](./apps/task-service/src/task/task.service.ts), [Gateway Task Service](./apps/api-gateway/src/task/task.service.ts) |
| NestJS gRPC transport | Изучена теория и выполнена практика | [Task Service bootstrap](./apps/task-service/src/main.ts), [Gateway gRPC config](./apps/api-gateway/src/config/grpc.config.ts) |
| API Gateway | Изучена теория и выполнена практика | [Gateway bootstrap](./apps/api-gateway/src/main.ts), [Task HTTP controller](./apps/api-gateway/src/task/task.controller.ts) |
| gRPC → HTTP error mapping | Изучена теория и выполнена практика | [gRPC status mapper](./apps/api-gateway/src/common/filters/http-exception/grpc-status-to-http-status.mapper.ts), [HTTP exception filter](./apps/api-gateway/src/common/filters/http-exception/http-exception.filter.ts) |
| Глобальные Pipes и DTO validation | Изучена теория и выполнена практика | [ValidationPipe](./apps/api-gateway/src/main.ts), [Task DTOs](./apps/api-gateway/src/task/dto) |
| JWT access/refresh | Изучена теория и выполнена практика | [Auth service](./apps/api-gateway/src/auth/auth.service.ts), [Auth controller](./apps/api-gateway/src/auth/auth.controller.ts) |
| Guards | Изучена теория и выполнена практика | [Bearer access guard](./apps/api-gateway/src/auth/guards/bearer-access/bearer-access.guard.ts), [Bearer refresh guard](./apps/api-gateway/src/auth/guards/bearer-refresh/bearer-refresh.guard.ts) |
| TypeORM/PostgreSQL | Изучена теория и выполнена практика | [Task entity](./apps/task-service/src/task/entities/task.entity.ts), [database configuration](./apps/task-service/src/config/database.config.ts) |
| Docker Compose | Изучена теория и выполнена практика | [Compose configuration](./compose.yaml), [PostgreSQL init SQL](./docker/postgres/init/10-create-local-databases.sql) |
| Swagger/OpenAPI | Изучена теория и выполнена практика | [Swagger setup](./apps/api-gateway/src/common/swagger/setup-swagger.ts), [Task HTTP controller](./apps/api-gateway/src/task/task.controller.ts) |
| Логирование streaming-сценариев | Изучена теория и выполнена практика | [Task Service logging](./apps/task-service/src/task/task.service.ts), [Gateway streaming logging](./apps/api-gateway/src/task/task.service.ts) |
| NestJS modules, controllers и Dependency Injection | Изучена теория и выполнена практика | [Gateway AppModule](./apps/api-gateway/src/app.module.ts), [TaskModule](./apps/task-service/src/task/task.module.ts), [TaskService provider](./apps/task-service/src/task/task.service.ts) |
| Трёхслойная архитектура | Изучена теория и выполнена практика | [HTTP Task controller](./apps/api-gateway/src/task/task.controller.ts), [Gateway Task service](./apps/api-gateway/src/task/task.service.ts), [Task Service persistence](./apps/task-service/src/task/task.service.ts) |
| Configuration Module | Изучена теория и выполнена практика | [Gateway configuration bootstrap](./apps/api-gateway/src/app.module.ts), [gRPC client configuration](./apps/api-gateway/src/config/grpc.config.ts) |
| Exception Filters | Изучена теория и выполнена практика | [HTTP exception filter](./apps/api-gateway/src/common/filters/http-exception/http-exception.filter.ts), [gRPC exception filter](./apps/task-service/src/common/filters/rpc-exception/rpc-exception.filter.ts) |
| Custom parameter decorators | Изучена теория и выполнена практика | [AuthUser decorator](./apps/api-gateway/src/utils/decorators/auth-user.decorator.ts), [authenticated Task controller](./apps/api-gateway/src/task/task.controller.ts) |
| TypeORM Repository и Data Mapper | Изучена теория и выполнена практика | [Task repository service](./apps/task-service/src/task/task.service.ts), [Task entity](./apps/task-service/src/task/entities/task.entity.ts) |
| TypeORM QueryBuilder и транзакции | Изучена теория и выполнена практика | [Task QueryBuilder operations](./apps/task-service/src/task/task.service.ts), [Session rotation transaction](./apps/api-gateway/src/session/session.service.ts) |
| Password hashing с bcrypt | Изучена теория и выполнена практика | [PasswordHasherService](./apps/api-gateway/src/auth/infrastructure/crypto/password-hasher.service.ts), [User passwordHash model](./apps/api-gateway/src/user/entities/user.entity.ts) |
| Session lifecycle и refresh-token rotation | Изучена теория и выполнена практика | [Auth token flow](./apps/api-gateway/src/auth/auth.service.ts), [SessionsService](./apps/api-gateway/src/session/session.service.ts) |
| gRPC metadata и Task ownership | Изучена теория и выполнена практика | [Gateway user metadata](./apps/api-gateway/src/task/task.service.ts), [strict metadata reader](./apps/task-service/src/task/require-grpc-user-id.ts), [owner-scoped Task operations](./apps/task-service/src/task/task.service.ts) |
