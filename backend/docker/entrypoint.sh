#!/bin/sh
set -e

echo "🚀 Iniciando Laravel..."

# instala deps se não existir vendor
if [ ! -d "vendor" ]; then
  echo "📦 Instalando dependências..."
  composer install --no-interaction --prefer-dist
fi

# gera .env se não existir
if [ ! -f ".env" ]; then
  echo "⚙️ Criando .env..."
  cp .env.example .env
fi

# gera key se não existir
if ! grep -q "APP_KEY=base64" .env; then
  echo "🔑 Gerando APP_KEY..."
  php artisan key:generate
fi

echo "🗄️ Rodando migrations..."
php artisan migrate --force

echo "🌱 Rodando seed..."
php artisan db:seed --force || true

echo "✅ Laravel pronto!"

exec "$@"
