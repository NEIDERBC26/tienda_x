#!/bin/sh
set -e

echo "[entrypoint] Ejecutando migraciones..."
npx prisma migrate deploy

if [ "${RUN_SEED}" = "true" ]; then
  echo "[entrypoint] Ejecutando seed inicial..."
  npm run db:seed
fi

echo "[entrypoint] Iniciando aplicación..."
exec "$@"
