#!/bin/sh
set -e

echo "🚀 Iniciando backend Node.js..."

if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependências..."
  npm install --include=dev --no-audit --no-fund
fi

echo "✅ Backend Node pronto!"

exec "$@"
