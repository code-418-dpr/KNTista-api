# KNTista-api

[![license](https://img.shields.io/github/license/Scorpi-ON/KNTista-api)](https://opensource.org/licenses/MIT)
[![release](https://img.shields.io/github/v/release/Scorpi-ON/KNTista-api.svg)](https://github.com/Scorpi-ON/KNTista-api/releases)
[![downloads](https://img.shields.io/github/downloads/Scorpi-ON/KNTista-api/total.svg)](https://github.com/Scorpi-ON/KNTista-api/releases)
[![code size](https://img.shields.io/github/languages/code-size/Scorpi-ON/KNTista-api.svg)](https://github.com/Scorpi-ON/KNTista-api)
[![tests](https://github.com/Scorpi-ON/KNTista-api/actions/workflows/tests.yaml/badge.svg)](https://github.com/Scorpi-ON/KNTista-api/actions/workflows/tests.yaml)
[![linter](https://github.com/Scorpi-ON/KNTista-api/actions/workflows/linter.yaml/badge.svg)](https://github.com/Scorpi-ON/KNTista-api/actions/workflows/linter.yaml)

Бэкенд для проекта KNTista

## Особенности реализации

- отслеживание активности на факультете:
    - [x] возможность заполнить справочники БД данными
    - [x] CRUD-операции со всеми сущностями
    - [ ] создание DOCX-отчётов об активности
- [x] документация Swagger
- [ ] авторизация JWT и OAuth
- [ ] покрытие тестами

## Стек

- **Node.js** — платформа для запуска JavaScript
- **SWC** — веб-сборщик (более быстрый, чем стандартный Babel)
- **Yarn** — пакетный менеджер
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

1. Установите Node.js и пакетный менеджер Yarn.
2. Установите зависимости:

```shell
yarn install --prod
```

3. Создайте файл `.env` на основе [.env.template](.env.template) и настройте все описанные там сервисы.
4. Если БД не заполнена, создайте необходимые таблицы:

```shell
yarn db:push
```

Заполнить справочные таблицы данными можно командой:

```shell
yarn db:seed
```

> [!WARNING]
> Эта команда очистит все данные справочных таблиц перед их заполнением!

Остальные данные можно внести в графическом режиме, открыв Drizzle Studio:

```shell
yarn db:studio
```

5. Соберите проект:

```shell
yarn build
```

6. Теперь запускать проект можно командой:

```shell
yarn start:prod
```

## Модификация

Если вы планируете модифицировать проект, установите все зависимости:

```shell
yarn install
```

Запуск сервера в режиме отладки осуществляется командой:

```shell
yarn start:debug
```

Документация API в Swagger UI, где его можно будет протестировать, при запуске на локалхосте со стандартными параметрами
доступна по ссылке https://localhost:3000/docs.

Прочие скрипты, необходимые для запуска линтера, форматировщика, тестов и т. д. находятся в
файле [package.json](./package.json).
