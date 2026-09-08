# Task ID UUID → int32 cutover plan

## 1. Goal

Move the Task identifier consistently from PostgreSQL UUID to PostgreSQL-generated `integer`, TypeORM `number`, protobuf `int32`, generated TypeScript `number`, and HTTP/OpenAPI `integer` with `format: int32`. Valid public and gRPC Task IDs are integers in `[1, 2147483647]`.

This is a plan only. No cutover implementation has started.

## 2. Current architecture

`apps/task-service` owns PostgreSQL and exposes unary `CreateTask`, server-streaming `StreamTasks`, client-streaming `UpdateTaskStatuses`, and bidi-streaming `DeleteTasks`. `apps/api-gateway` turns those RPCs into `POST /tasks`, `GET /tasks`, `PATCH /tasks/status`, and `DELETE /tasks/batch`.

Source contracts are in `libs/contracts/src/proto/task/v1/task.proto`; `scripts/generate-proto.cjs` invokes ts-proto 2.12.2 with `nestJs=true,fileSuffix=.pb,addGrpcMetadata=true,useOptionals=all`. It has no `oneof` option. Generated interfaces therefore use optional flat oneof fields (`deletedTask?`, `error?`) in `libs/contracts/src/generated/task/v1/task.pb.ts`. Both runtime gRPC loaders set only `longs: Number` in `apps/task-service/src/main.ts` and `apps/api-gateway/src/config/grpc.config.ts`; they do not set a oneof option. Do not introduce `oneof=unions-value` as part of this cutover: current application and dynamic loader use the flat runtime form.

## 3. Inventory of UUID dependencies

| File/layer | Current UUID use | Required change | Risk | Verification |
| --- | --- | --- | --- | --- |
| `libs/contracts/src/proto/task/v1/task.proto` / `Task` | `string id = 1` | Stage A: deprecate `id`; add derived unused `int32 task_id = 7`. Stage B: reserve `1` and `"id"`. | Wire incompatibility if type 1 is changed. | Regenerate; inspect `Task.taskId?: number`; contract tests. |
| same / `UpdateTaskStatusRequest` | `string id = 1` | Deprecate 1; add `int32 task_id = 3`; later reserve 1/`id`. | Client stream request mismatch. | PATCH sends numeric taskId per item. |
| same / `DeleteTaskRequest` | `string id = 1` | Deprecate 1; add `int32 task_id = 2`; later reserve 1/`id`. | Bidi request mismatch. | One result for every numeric request. |
| same / `DeleteTaskResponse` | `string requested_id = 1`; result oneof occupies 2, 3 | Deprecate 1; add `int32 requested_task_id = 4`; later reserve 1/`requested_id`. | Per-item correlation can be broken. | Preserve order and response oneof. |
| `libs/contracts/src/generated/task/v1/task.pb.ts` | `id?: string`, `requestedId?: string`, stream request types use strings | Generated-only change after each proto state. | Manual edits diverge from proto. | Run only `pnpm run proto:generate`; no manual edit. |
| `libs/contracts/src/index.ts` | Re-exports generated contract | No structural change expected. Confirm exports compile. | Import breakage. | Both app builds. |
| `apps/task-service/src/task/entities/task.entity.ts` | `@PrimaryGeneratedColumn('uuid') id!: string` | `@PrimaryGeneratedColumn()` (or explicitly approved integer generation) and `id!: number`; PostgreSQL generates it. | `synchronize` cannot safely transform a populated UUID primary key. | Reset/migration decision; save returns numeric id. |
| `apps/task-service/src/config/database.config.ts`, `task-service.module.ts` | PostgreSQL with `synchronize: true` | Do not rely on synchronize for UUID→integer conversion. Keep config unchanged unless separately approved. | Schema/data loss or failed conversion. | Disposable DB reset only after approval. |
| `apps/task-service/src/task/mappers/task.proto.mapper.ts` / `toProtoTask` | Maps `entity.id` to `Task.id` | Map numeric entity id to `Task.taskId`; keep timestamps/status unchanged. | Wrong field leaves ID as proto default 0. | Create/stream/delete output IDs are positive numbers. |
| `apps/task-service/src/task/mappers/deleted-task-row.mapper.ts` | `DeletedTaskRow.id: string`; mapper hydrates UUID id and snake_case timestamps | `id: number`; retain timestamp normalization and enum mapping. | Raw `RETURNING` row type mismatch. | DELETE returns numeric id and valid timestamps. |
| `apps/task-service/src/task/task.service.ts` / `createTask` | Repository generates UUID when saved | Let PostgreSQL integer identity generate id; no random UUID exists to remove. | Saved entity not populated. | `toProtoTask(savedTask)` has positive taskId. |
| same / `streamTasks` | Finds tasks and maps with `toProtoTask`; orders `createdAt ASC` | Only mapper/ID type changes; preserve order and empty completion. | Accidental stream behavior change. | GET returns numeric IDs and `{ items: [] }` on empty DB. |
| same / `processTaskStatusUpdates` | `ids: string[]`, `Set<string>`, `isUUID(id, '4')`, UUID text, `IN (:...ids)` | `number[]`, `Set<number>`, shared integer Task-ID validation; retain one bulk UPDATE. | Direct gRPC can supply 0/invalid number. | One UPDATE; missing IDs only reduce `updatedCount`. |
| same / `deleteTasks` | `Set<string>`, trims request ID, `isUUID`, UUID messages, per-item requestedId string | Number set and numeric validation; no trim; preserve `concatMap`, 500 guard, NOT_FOUND/DUPLICATE per-item values. | `0`, NaN, decimals or duplicate handling changes. | Ordered bidi responses and numeric requestedId. |
| same / `deleteTaskById` | `id: string`, `.where('id = :id', { id }).returning('*')` | `id: number`; retain exactly one `DELETE ... RETURNING` per request. | Parameter type/row mapper mismatch. | SQL logging/test evidence and DELETE regression. |
| same / `createDeleteErrorResponse` | `requestedId: string` | `requestedId: number`; invalid direct gRPC may report 0/invalid numeric input according to final error-response policy. | Cannot represent NaN on protobuf wire. | INVALID_ARGUMENT stays a per-item error when representable. |
| `apps/task-service/src/task/task.controller.ts` | Generated request/response interfaces expose string fields | Compile against generated numeric `taskId`/`requestedTaskId`; decorators stay unchanged. | Handler signature mismatch after generation. | Task-service build. |
| `apps/api-gateway/src/task/task.service.ts` | Maps `dto.ids` into `{ id }` for client/bidi streams | Send `{ taskId: id }`; consume generated numeric task fields. | Gateway/service field-name mismatch. | PATCH/DELETE end-to-end. |
| `apps/api-gateway/src/task/task.controller.ts` | Routes are ID-agnostic | Keep routes/statuses/operation IDs. Change only DTO types through service contracts. | Response-shape drift. | Swagger and HTTP regression. |
| `apps/api-gateway/src/task/dto/update-task-statuses-request.dto.ts` | `ids!: string[]`, `@IsUUID`, OpenAPI UUID strings | `number[]`, `@IsInt({ each: true })`, `@Min(1,{each:true})`, `@Max(2147483647,{each:true})`; retain array min/max/unique. | Transform can accept unsuitable values. | 400 for 0, negative, decimal, NaN/out-of-range. |
| `apps/api-gateway/src/task/dto/delete-tasks-request.dto.ts` | Same UUID array validation and examples | Same numeric validation and integer examples. | Duplicate semantics change if coercion is accidental. | 400 and 200 per-item errors as appropriate. |
| `apps/api-gateway/src/task/dto/task-response.dto.ts` | `id` Swagger `format: uuid` | `id: number`; `type: integer`, `format: int32`; numeric example. | Status/timestamp scope creep. | GET/delete schema only changes ID. |
| `apps/api-gateway/src/task/dto/create-task-response.dto.ts` | Created task `id` Swagger UUID | Numeric integer/int32 model; preserve nested protobuf timestamp representation. | Incorrectly normalizing timestamps. | POST shape remains `{ task }`. |
| `apps/api-gateway/src/task/dto/delete-tasks-response.dto.ts` | Both result variants have `requestedId!: string` and UUID Swagger | `requestedId!: number`, integer/int32; preserve `oneOf`. | OneOf alternatives accidentally collapse. | OpenAPI has two result variants. |
| `apps/api-gateway/src/task/mappers/task-http.mapper.ts` / `toTaskResponseDto` | Copies `task.id` into HTTP id | Copy `task.taskId` into HTTP `id`; ISO conversion unchanged. | 0/undefined output. | GET/delete numeric id assertions. |
| `apps/api-gateway/src/task/mappers/delete-task-response.mapper.ts` | Reads `response.requestedId`, checks falsy, maps task | Read `requestedTaskId`; explicitly reject `undefined` rather than falsy (`0` is invalid but must not be silently conflated); output number. | Proto default 0 handling. | OneOf/error mappings remain intact. |
| `apps/api-gateway/src/common/swagger/*`, `setup-swagger.ts` | UUID schemas/examples; Light/Dark UI independent of ID | Update only ID schemas/examples; keep `/docs`, `/docs-json`, CSS/script/theme key. | Swagger regression. | OpenAPI diff and visual regression. |
| `apps/task-service/test/app.e2e-spec.ts`, `apps/api-gateway/test/app.e2e-spec.ts` | Only bootstrap/root legacy tests; no Task ID coverage | Add focused tests only after approval. | Existing suite does not protect cutover. | New RPC/HTTP validation and integration tests. |
| `scripts/generate-proto.cjs`, `scripts/copy-proto-assets.cjs`, package scripts | Generator replaces generated dir; build copies source proto to dist | Use generator only at Stages 1/3; keep copy/build process. | Running generator at wrong stage changes contracts. | `pnpm run proto:generate`, then both builds. |
| `docs/course-checklist.md` | Mentions UUID batch validation | Update only as an approved learning-log/checklist action after implementation; do not touch in this plan. | User-owned current content. | Review separately. |

No `randomUUID` use was found. Existing UUID documentation is `docs/course-checklist.md`; it must not be edited in this run.

## 4. Protobuf field-number inventory

All currently occupied numbers were read from `task.proto`:

| Message | Existing fields/numbers | Stage A derived new integer field | Stage B reservation |
| --- | --- | --- | --- |
| `Task` | `id=1`, `title=2`, `description=3`, `status=4`, `created_at=5`, `updated_at=6` | `task_id=7`; `id=1 [deprecated=true]` | `reserved 1; reserved "id";` |
| `UpdateTaskStatusRequest` | `id=1`, `status=2` | `task_id=3`; `id=1 [deprecated=true]` | `reserved 1; reserved "id";` |
| `DeleteTaskRequest` | `id=1` | `task_id=2`; `id=1 [deprecated=true]` | `reserved 1; reserved "id";` |
| `DeleteTaskResponse` | `requested_id=1`, `deleted_task=2`, `error=3` | `requested_task_id=4`; `requested_id=1 [deprecated=true]` | `reserved 1; reserved "requested_id";` |

The new numbers are the lowest numbers not already occupied in each specific message; they are derived from this table, not reused or guessed. `Task` uses protobuf `task_id` → generated TypeScript `taskId`; HTTP stays `id`. Delete response uses protobuf `requested_task_id` → generated `requestedTaskId`; HTTP stays `requestedId`.

## 5. Compatibility policy

Never change `string id = 1` to `int32 id = 1`. Protobuf field number identifies its wire type and historical contract.

State A retains the old UUID field with `[deprecated = true]` and adds a new integer field. `deprecated` means the field remains present. State B removes the old field and then reserves both its number and name. `deprecated` and `reserved` cannot apply to the same existing field; a reserved number/name cannot be reused for the new type. Generated code changes only through the standard generator.

This project has no external consumers, so the approved shortcut may be: contract expansion → atomic application/database switch → regression → cleanup. It is not a production rolling-deployment strategy: legacy UUID clients cease to function after the integer database cutover even while deprecated fields remain in proto.

## 6. Database transition options

### Option A — controlled reset of a disposable local database (recommended)

After explicit approval, stop local services, remove/reset only the confirmed disposable study database/volume, and let the approved integer schema be created. Benefits: clean integer identity primary key, no irrelevant migration work, and alignment with the educational `synchronize: true` choice. Cost: all existing study tasks are lost. No reset, table drop, volume operation, or destructive Docker command is authorized by this plan.

### Option B — preserve data

Requires a separately designed migration: add integer identity, backfill deterministically, move foreign keys/references, replace the primary key, verify the sequence/identity, and provide rollback. It is substantially more complex and outside the agreed learning scope. Do not assume `synchronize: true` can perform it safely.

PostgreSQL `integer` and protobuf `int32` share the signed 32-bit upper bound. PostgreSQL must generate the ID; after `repository.save()`, the returned entity must contain the generated positive number. Verify sequence/identity next value after reset.

## 7. Recommended decision

Approve Option A only after explicitly confirming that the local study data may be discarded. Use a PostgreSQL-generated integer primary key and make Stage 2 an atomic service cutover. Do not add a migration unless the user instead selects Option B.

## 8. Invariants that must not change

- HTTP routes, HTTP success status codes, error filters, gRPC method topology, Task status representation, and timestamp representations stay unchanged.
- `StreamTasks` remains finite, ordered by `createdAt ASC`, and empty DB returns HTTP 200 `{ "items": [] }`.
- `UpdateTaskStatuses` remains one client message per ID and one bulk SQL `UPDATE`; missing IDs only affect `updatedCount`.
- `DeleteTasks` remains one `DELETE ... RETURNING` per inbound message, ordered by `concatMap`; NOT_FOUND and DUPLICATE remain per-item response values; unknown DB errors terminate RPC and become safe HTTP 500.
- DELETE OpenAPI remains `oneOf`; Swagger routes and Light/Dark switcher remain unchanged.

## 9. Implementation stages

### Stage 0 — Baseline

- Files changed: none.
- Actions/commands: record `git rev-parse HEAD`; `pnpm run build:api-gateway`; `pnpm run build:task-service`; manually regress Swagger with UUID inputs.
- Acceptance: both builds pass; current four RPCs and `/docs` baseline are recorded.
- Rollback: none; no mutation.
- Risk: running a destructive database reset before explicit approval.
- Proposed commit: none.

STOP: do not continue without user approval.

### Stage 1 — Expand protobuf contract

- Files: `libs/contracts/src/proto/task/v1/task.proto`; generator output under `libs/contracts/src/generated/**` only through `pnpm run proto:generate`.
- Actions: add the four derived integer fields; mark old UUID fields deprecated; do not change application behavior yet; generate; run both builds.
- Acceptance: old UUID behavior still works, generated interfaces expose the new optional numeric fields, all prior fields retain their wire numbers.
- Rollback: revert the isolated contract commit before application cutover.
- Risk: accidental type change of field 1 or manual generated edit.
- Proposed commit: `feat(contracts): add deprecated UUID and int32 task ID fields`.

STOP: do not continue without user approval and a separate commit.

### Stage 2 — Database and application cutover

- Files: `apps/task-service/src/task/entities/task.entity.ts`, `apps/task-service/src/task/mappers/task.proto.mapper.ts`, `apps/task-service/src/task/mappers/deleted-task-row.mapper.ts`, `apps/task-service/src/task/task.service.ts`, `apps/task-service/src/task/task.controller.ts`; `apps/api-gateway/src/task/task.service.ts`, controller, DTOs, HTTP mappers, Swagger DTOs; tests. Do not change filters, routes, proto field numbers, timestamps, or status semantics.
- Actions: after approved Option A reset, use integer generated primary key; map proto `taskId`/`requestedTaskId`; make arrays/sets/SQL parameters numbers; replace UUID decorators/examples/errors; add a shared Task-ID helper in Task Service if it keeps unary/client/bidi validation consistent.
- gRPC validation: reject absent/default `0`, negative values, fractions, `NaN`, non-safe/in-range violations, and values above `2147483647`; do not rely on HTTP validation because direct gRPC can call the service. HTTP arrays use `@IsInt({ each: true })`, `@Min(1,{each:true})`, `@Max(2147483647,{each:true})`, plus existing array min/max/unique rules. Consider `@Type(() => Number)` only if its coercion behavior is separately tested; do not silently coerce decimals.
- SQL: retain `where('id IN (:...ids)', { ids })` as one numeric bulk UPDATE. Retain `where('id = :id', { id }).returning('*')` once per delete message. Raw mapper keeps `created_at`/`updated_at` conversion and enum status while changing row `id` to number.
- Acceptance: all four RPCs use positive int32 IDs while deprecated UUID fields remain in proto; database identity/sequence works; Swagger is integer/int32 with numeric examples; full regression passes.
- Rollback: before reset, restore Stage 1 app code. After confirmed reset, recovery is source rollback plus a newly reset disposable DB; UUID data is not recoverable without a backup.
- Risk: old UUID callers become incompatible atomically; ID `0` default bypass; stale generated code; partial reset.
- Proposed commit: `feat(tasks): cut over task identifiers to int32`.

STOP: do not continue without user approval and full regression.

### Stage 3 — Contract cleanup

- Files: `task.proto`, generated contracts, temporary compatibility branches/helpers and their tests.
- Actions: remove deprecated UUID fields, add the listed `reserved` numbers and names, generate contracts, remove temporary dual-field logic, run both builds.
- Acceptance: no UUID Task-ID field/type/example/error remains; field 1 is reserved, never reused; integer fields are sole source of truth.
- Rollback: revert this isolated cleanup commit to Stage 2 protocol state.
- Risk: reserving a still-present field or failing to reserve its name.
- Proposed commit: `refactor(contracts): reserve retired UUID task ID fields`.

STOP: do not continue without user approval.

### Stage 4 — Final regression

- Files: tests and approved course/log documentation only if requested.
- Commands: `pnpm run build:api-gateway`; `pnpm run build:task-service`; targeted tests; Swagger manual regression; `git diff --check`.
- Acceptance: Swagger verifies CreateTask, StreamTasks, empty list, UpdateTaskStatuses, partial update, DeleteTasks, NOT_FOUND, DUPLICATE, 503 with Task Service stopped, and safe 500 for unexpected DB failure. Verify Light/Dark UI remains intact.
- Rollback: use the prior stage commit and the documented disposable-DB recovery path.
- Risk: conflating ID cutover with timestamp/status/UI changes.
- Proposed commit: `test(tasks): verify int32 task ID cutover` (only after approval).

STOP: do not continue without user approval and final commit authorization.

## 10. Verification matrix

| Scenario | Expected result |
| --- | --- |
| CreateTask | PostgreSQL creates positive integer; gRPC `taskId`; HTTP `task.id` number; status/timestamps unchanged. |
| StreamTasks | Every Task has numeric ID; `createdAt ASC` order retained; empty DB → 200 `{items: []}`. |
| UpdateTaskStatuses valid IDs | HTTP numeric array → one gRPC message each → one bulk update; counts preserve meaning. |
| UpdateTaskStatuses invalid IDs | HTTP and direct gRPC reject 0, negative, decimal, missing/default, overflow; no UUID wording. |
| UpdateTaskStatuses missing existing row | Whole stream succeeds; `updatedCount < requestedCount`. |
| DeleteTasks valid IDs | Numeric `requestedId`, numeric deleted Task id, response order retained. |
| DeleteTasks missing/duplicate | HTTP 200 oneOf per-item NOT_FOUND/DUPLICATE; no whole-batch 404. |
| DeleteTasks unknown DB error | RPC errors through `RpcExceptionFilter`; Gateway emits safe HTTP 500 through `HttpExceptionFilter`. |
| Gateway outage behavior | Stopped Task Service remains HTTP 503. |
| OpenAPI/UI | ID models/request examples are `integer/int32`; no Task-ID UUID format; status dropdown, theme switcher, `/docs`, `/docs-json` remain. |

## 11. Rollback and recovery points

Stage 1 is reversible by code/contract revert. Stage 2 must have an explicit pre-reset recovery decision: Option A destroys disposable data and has no data rollback without a user-provided backup. Never mix Stage 2 database reset with Stage 1 contract commit. Stage 3 is reversible to the Stage 2 compatibility commit. Record build/OpenAPI baselines at every STOP.

## 12. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Reusing field 1 with a new wire type | Two-state deprecated/reserved policy and field table above. |
| `synchronize` corrupts or cannot convert PK | Use only approved disposable reset; otherwise require dedicated migration design. |
| Proto default `0` accepted | Shared direct-gRPC integer validator, not HTTP-only checks. |
| HTTP transform accepts invalid number | Test decimal, empty, NaN-equivalent and bound behavior explicitly. |
| OneOf shape changes | Keep flat ts-proto/runtime loader representation and HTTP `oneOf`. |
| Bulk update becomes N queries | Retain existing `IN (:...ids)` QueryBuilder operation. |
| Bidi ordering changes | Retain `concatMap`; use `Set<number>`. |
| UUID leaks in docs/errors | Search `uuid`, `IsUUID`, `isUUID`, `format: 'uuid'`, `string[]`, `Set<string>` before Stage 3. |

## 13. Current checkpoint

- Active stage: Planning only.
- Last completed implementation stage: Swagger baseline.
- Baseline commit: `eb632c3f2994dd9bdc4c13c2e93c4a7995d0d0f7`.
- Database ID type: UUID.
- Protobuf ID type: string.
- HTTP ID type: UUID string.
- Plan status: awaiting user review.
- Next allowed action: none until explicit approval.

## 14. Decisions requiring approval

1. Confirm Option A and explicit authorization to reset the disposable local database, or choose the out-of-scope data-preserving migration design.
2. Confirm the derived State A protobuf names/numbers: `Task.task_id=7`, `UpdateTaskStatusRequest.task_id=3`, `DeleteTaskRequest.task_id=2`, `DeleteTaskResponse.requested_task_id=4`.
3. Confirm whether a small shared Task-ID validator is desired in Task Service to enforce the same direct-gRPC rules in client and bidi streams.
4. Approve Stage 1 only after this plan review.

STOP: do not continue without user approval.
