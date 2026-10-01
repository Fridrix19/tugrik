# Tugrik

Оплата зарубежных сервисов рублями: долларовая виртуальная карта и каталог из 139 сервисов, оплата по QR через СБП.

Бренд: зелёный `#12B76A` + лайм `#C8F542`, графит `#0E1A13`, фон `#F3F5EE`; шрифты Unbounded (заголовки), Manrope (текст), IBM Plex Mono (цифры). Знак — монета с символом ₮ (`build/brand/logo.svg`), иллюстрация первых экранов — `build/brand/hero-art.svg`. Дневная тема по умолчанию, ночная — переключателем в подвале и в мобильном меню.

## Структура

```
_proto/          собранный сайт (статика): главная, каталог, разделы, 139 страниц сервисов, карта, как это устроено,
                 помощь, контакты, вопросы, тарифы, вход, личный кабинет
src/base/        общая база: токены и компоненты (base.css, lib.css), шапка, подвал и мобильное меню, common.js
src/pages/       страницы: <page>.html|js|css, данные разделов section-<id>.json
build/           сборка build.py, бренд brand/, icon-lum.json (яркость логотипов сервисов)
source-site/     данные каталога: логотипы сервисов (assets/), список (search.js), тарифы (payment-flow.v2.js)
web/             бэкенд и админка: Nuxt 4 + Nitro, PostgreSQL — см. web/README.md
render.yaml      стенд на Render + Neon
```

## Сборка

```bash
python3 build/build.py            # все страницы, кроме сервисов
python3 build/build.py all        # всё, включая 139 страниц сервисов
cd web && npm ci && npm run build # сервер отдаёт _proto/ и API /api/*
```

## Отдельный стенд

У Tugrik своя база, свои админы и пользователи. Для стенда: новый проект в Neon, новый Web Service в Render из этого репозитория (настройки — в `render.yaml`), свои значения `NUXT_DATABASE_URL`, `NUXT_SECRET`, почты и `NUXT_PUBLIC_SITE_URL`. Первый вход в админку `/admin` — admin / admin, затем смена пароля.

## Запуск на своём компьютере (Mac)

Нужны Node.js 20+ и [Postgres.app](https://postgresapp.com) (Initialize → Start). Затем:

```
cd web && bash start-local.sh
```

Скрипт сам создаст базу `tugrik`, поставит зависимости, соберёт проект, применит миграции и запустит сервер: сайт — http://localhost:3000, админка — http://localhost:3000/admin (admin / admin, затем смена пароля). Код регистрации показывается на экране, письма — в логе.
