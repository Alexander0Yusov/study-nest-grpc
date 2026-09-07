# Learning log

## 2026-09-04 — DOC-001: governance, roadmap и traceability

**Решение.** Введена traceability matrix курсов и цепочка `topic → task → code → verification → documentation → commit`. Кодовые пины хранятся в checklist, а не в комментариях исходного кода. Основной учебный код пользователь пишет руками; агент выполняет исследование, review и явно делегированные операции.

**Изменено.** Упрощён `AGENTS.md`; созданы course checklist и связи roadmap с course IDs; README получил ссылку на checklist.

**Проверка.** Документационные проверки и Git state выполнены; исходный код и корпоративные репозитории не изменялись.

**Закрытые course IDs.** Нет: DOC-001 создаёт систему отслеживания, а не реализует учебную тему в коде.

## Шаблон будущей записи

### YYYY-MM-DD — Layer N: название

- **Course IDs:**
- **Решение:**
- **Что изменено:**
- **Зачем:**
- **Изменённые файлы:**
- **Корпоративный аналог:**
- **Сознательные расхождения:**
- **Проверка:**
- **Результат:**
- **Закрытые course IDs:**
- **Технический долг:**

** 07-09-2026
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
