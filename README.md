# KNTista-api

[![license](https://img.shields.io/github/license/Scorpi-ON/KNTista-api)](https://opensource.org/licenses/MIT)
[![release](https://img.shields.io/github/v/release/Scorpi-ON/KNTista-api?include_prereleases)](https://github.com/Scorpi-ON/KNTista-api/releases)
[![downloads](https://img.shields.io/github/downloads/Scorpi-ON/KNTista-api/total)](https://github.com/Scorpi-ON/KNTista-api/releases)
[![code size](https://img.shields.io/github/languages/code-size/Scorpi-ON/KNTista-api.svg)](https://github.com/Scorpi-ON/KNTista-api)
[![tests](https://github.com/Scorpi-ON/KNTista-api/actions/workflows/tests.yaml/badge.svg)](https://github.com/Scorpi-ON/KNTista-api/actions/workflows/tests.yaml)
[![linter](https://github.com/Scorpi-ON/KNTista-api/actions/workflows/linter.yaml/badge.svg)](https://github.com/Scorpi-ON/KNTista-api/actions/workflows/linter.yaml)

Бэкенд для проекта KNTista

## Особенности реализации

- отслеживание активности на факультете:
    - [x] возможность заполнить справочники БД данными
    - [x] CRUD-операции со всеми сущностями
    - [x] создание DOCX-отчётов об активности
- [x] документация Swagger
- [ ] авторизация JWT и OAuth
- [ ] логирование
- [ ] кеширование ответов сервера
- [ ] покрытие тестами

## Стек

- **Node.js** — платформа для запуска JavaScript
- **SWC** — веб-сборщик (более быстрый, чем стандартный Babel)
- **pnpm** — пакетный менеджер
- **TypeScript** — язык программирования
- **NestJS** — основной бэкенд-фреймворк
- **Fastify** — фреймворк под капотом NestJS (более быстрый, чем стандартный Express)
- **Drizzle** — ORM
- **Jest** — фреймворк для тестирования
- **Swagger** — инструмент документирования API
- **ESLint** — статический анализатор кода
- **Prettier** — форматировщик кода
- **Docker** — платформа для контейнеризации

## Установка и запуск

0. Клонируйте репозиторий и перейдите в его папку.

### Посредством Docker

1. Установите Docker.
2. Создайте файл `.env` на основе [.env.template](.env.template) и настройте все описанные там сервисы.

...

### Без использования Docker

1. Установите Node.js и пакетный менеджер pnpm.
2. Установите зависимости:

```shell
pnpm i
```

3. Создайте файл `.env` на основе [.env.template](.env.template) и настройте все описанные там сервисы.
4. Если БД не заполнена, создайте необходимые таблицы:

```shell
pnpm db:push
```

Заполнить справочные таблицы данными можно командой:

```shell
pnpm db:seed
```

> [!WARNING]
> Эта команда очистит все данные справочных таблиц перед их заполнением!

Остальные данные можно внести в графическом режиме, открыв Drizzle Studio:

```shell
pnpm db:studio
```

5. Соберите проект:

```shell
pnpm build
```

6. Теперь запускать проект можно командой:

```shell
pnpm start:prod
```

## Модификация

Запуск сервера в режиме отладки осуществляется командой:

```shell
pnpm start:debug
```

Документация API в Swagger UI, где его можно будет протестировать, при запуске на локалхосте со стандартными параметрами
доступна по ссылке https://localhost:3000/docs.

Прочие скрипты, необходимые для запуска линтера, форматировщика, тестов и т. д. находятся в
файле [package.json](./package.json).
