# Карта Nest-конфигурации

Состояние ниже основано только на текущих файлах `study-nest-grpc`; отсутствующие настройки не предполагаются.

| Файл | Поле | Текущее значение | Назначение | Корпоративный аналог | Запланированное изменение |
|---|---|---|---|---|---|
| `package.json` | `name` | `api-gateway` | Имя npm-пакета | Обычные single-project package names | Пока не менять |
| `package.json` | Nest dependencies | `^10.0.0` | NestJS 10 runtime | Gateway использует Nest 10; task reference — Nest 9 | Выровнять реальные версии только отдельной задачей |
| `package.json` | `packageManager` | Пока не настроено | Фиксирует package manager/version | В corporate repos есть поле | Добавить только по approval |
| `package.json` | scripts | build/start/lint/test; `lint` содержит `--fix` | Lifecycle и quality commands | `lint:pr` без fix в corporate repos | Добавить non-mutating lint script только по approval |
| `pnpm-lock.yaml` | lockfile | Есть | Закрепляет dependency graph pnpm | Corporate repos используют `yarn.lock` | Не менять в DOC-001 |
| `nest-cli.json` | `monorepo` | `true` | Включает Nest monorepo mode | Corporate repos — standard single-project mode | Оставить |
| `nest-cli.json` | `root` | `apps/api-gateway` | Default Nest project | В corporate standard mode root не нужен | Оставить |
| `nest-cli.json` | `sourceRoot` | `apps/api-gateway/src` | Root source default project | Corporate: `src` | Оставить |
| `nest-cli.json` | `projects` | `api-gateway`, `task-service` | Реестр двух applications | Corporate repos отдельные | Оставить; третье application не добавлять |
| `nest-cli.json` | `entryFile` | `main` у обоих apps | Nest bootstrap entry | Corporate: `src/main.ts` | Оставить |
| `nest-cli.json` | `webpack` | `true` | Nest build bundler | Не зафиксировано в corporate configs | Проверить отдельной задачей |
| `nest-cli.json` | `assets` | Пока не настроено | Копирование non-TS assets, например `.proto` | Corporate assets: `**/*.proto` | Настроить на слое gRPC contracts |
| `apps/` | apps | `api-gateway`, `task-service` | Два deployable Nest applications | Corporate Gateway и Task Service — polyrepo | Оставить |
| `libs/` | libs | Пока не существует | Будущие shared libraries | Corporate proto contracts дублированы | Создать `libs/contracts` только на слое 2 |
| `tsconfig.json` | `module` | `commonjs` | Runtime module format | CommonJS в обоих corporate repos | Оставить |
| `tsconfig.json` | `target` | `ES2021` | JS language target | Corporate: `es2017` | Оставить: сознательное расхождение |
| `tsconfig.json` | strict options | true | Строгая типизация | Corporate configs нестрогие | Оставить: сознательное расхождение |
| `tsconfig.json` | `baseUrl` | `./` | База module resolution | Такое же поле в corporate configs | Оставить |
| `tsconfig.json` | `paths` | `{}` | TypeScript aliases | Пока не настроено | Только при доказанной потребности |
| `tsconfig.build.json` | `extends`, `exclude` | Extends root; excludes node_modules/test/dist/specs | Общие build exclusions | Аналогично corporate repos | Оставить |
| `apps/*/tsconfig.app.json` | extends/outDir/include/exclude | Extends root; отдельный `dist/apps/*` | Per-app compilation boundary | Corporate standard apps без app-specific tsconfig | Оставить |
| `.eslintrc.js` | ESLint | Файл существует; DOC-001 его не менял | Static analysis | Corporate: Airbnb + TypeScript + Unicorn + Prettier + Nest typed | Сравнить отдельной задачей |
| `.prettierrc` | Prettier | Файл существует; DOC-001 его не менял | Formatting policy | Corporate: single quotes, trailing commas | Сравнить отдельной задачей |
| `.gitignore` | Git exclusions | Файл существует; DOC-001 его не менял | Исключение local artifacts | Corporate repos имеют `.gitignore` | Проверить при добавлении generated proto/certs |

## Термины организации репозитория

| Модель | Как распознать | Важное замечание |
|---|---|---|
| Nest standard mode | Один `src`, `sourceRoot: "src"`, обычно нет `projects`/`monorepo` | Каждый corporate reference repo устроен так |
| Nest monorepo | `monorepo: true`, `projects`, обычно `apps/` и опционально `libs/` | Текущий `study-nest-grpc` — такой проект |
| Nx monorepo | Обычно `nx.json`, `project.json` или Nx workspace tooling | Nest monorepo не означает Nx |
| Polyrepo | Независимые Git repositories для сервисов | Нет специального поля: это организационная модель |

## Aliases, webpack и assets

- TypeScript aliases: пока не настроено (`paths: {}`).
- Webpack: включён в root `compilerOptions` Nest CLI.
- `.proto` assets: пока не настроено; рассматривать на слое gRPC contracts.
- `libs/contracts`: пока не существует.
