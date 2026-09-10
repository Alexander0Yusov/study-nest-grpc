# Learning Log

| Аспект обучения | Статус | Практическая реализация |
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
| DTO validation | Изучена теория и выполнена практика | [Gateway bootstrap](./apps/api-gateway/src/main.ts), [Task DTOs](./apps/api-gateway/src/task/dto) |
| JWT access/refresh | Изучена теория и выполнена практика | [Auth service](./apps/api-gateway/src/auth/auth.service.ts), [Auth controller](./apps/api-gateway/src/auth/auth.controller.ts) |
| Guards | Изучена теория и выполнена практика | [Bearer access guard](./apps/api-gateway/src/auth/guards/bearer-access/bearer-access.guard.ts), [Bearer refresh guard](./apps/api-gateway/src/auth/guards/bearer-refresh/bearer-refresh.guard.ts) |
| TypeORM/PostgreSQL | Изучена теория и выполнена практика | [Task entity](./apps/task-service/src/task/entities/task.entity.ts), [database configuration](./apps/task-service/src/config/database.config.ts) |
| Docker Compose | Изучена теория и выполнена практика | [Compose configuration](./compose.yaml), [PostgreSQL init SQL](./docker/postgres/init/10-create-local-databases.sql) |
| Swagger/OpenAPI | Изучена теория и выполнена практика | [Swagger setup](./apps/api-gateway/src/common/swagger/setup-swagger.ts), [Task HTTP controller](./apps/api-gateway/src/task/task.controller.ts) |
| Логирование streaming-сценариев | Изучена теория и выполнена практика | [Task Service logging](./apps/task-service/src/task/task.service.ts), [Gateway streaming logging](./apps/api-gateway/src/task/task.service.ts) |
