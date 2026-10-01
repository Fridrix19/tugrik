#!/bin/bash
# Локальный запуск Tugrik на Mac: сайт http://localhost:3000, админка http://localhost:3000/admin (admin / admin)
# Нужны Node.js 20+ и Postgres.app (postgresapp.com → Initialize). Запуск: bash start-local.sh
set -e
cd "$(dirname "$0")"

PGBIN=/Applications/Postgres.app/Contents/Versions/latest/bin
[ -d "$PGBIN" ] && export PATH="$PGBIN:$PATH"
if ! command -v psql >/dev/null; then echo "✗ Не найден PostgreSQL. Поставьте Postgres.app и нажмите Initialize."; exit 1; fi
if ! pg_isready -q -h localhost; then echo "✗ PostgreSQL не запущен. Откройте Postgres.app и нажмите Start."; exit 1; fi

export NUXT_DATABASE_URL="${NUXT_DATABASE_URL:-postgres://localhost/tugrik}"
export DATABASE_URL="$NUXT_DATABASE_URL"
export NUXT_SECRET="${NUXT_SECRET:-local-dev-secret-change-me}"
export NUXT_DEV_CODES=true
export NUXT_PUBLIC_SITE_URL=http://localhost:3000
export PORT="${PORT:-3000}"

psql -h localhost -lqt | cut -d'|' -f1 | grep -qw tugrik || { createdb -h localhost tugrik && echo "✓ создана база tugrik"; }
[ -d node_modules ] || npm ci
[ -f .output/server/index.mjs ] || npm run build
npm run migrate
echo "✓ Сайт: http://localhost:$PORT   Админка: http://localhost:$PORT/admin (admin / admin)"
exec node .output/server/index.mjs
