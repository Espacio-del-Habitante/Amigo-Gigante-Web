#!/bin/bash
# Script de setup rápido para variables de ClickUp
# Uso: source scripts/clickup/setup_env.sh

echo "🔧 Verificando variables de ClickUp..."

if [ -z "$CLICKUP_API_TOKEN" ]; then
    echo "⚠️  CLICKUP_API_TOKEN no configurado"
    echo "   Agrega esto a tu ~/.zshrc:"
    echo "   export CLICKUP_API_TOKEN=\"pk_...\""
    exit 1
fi

if [ -z "$CLICKUP_LIST_ID" ]; then
    echo "⚠️  CLICKUP_LIST_ID no configurado"
    echo "   Agrega esto a tu ~/.zshrc:"
    echo "   export CLICKUP_LIST_ID=\"901324355532\""
    exit 1
fi

echo "✅ Variables configuradas correctamente"
echo "   CLICKUP_LIST_ID: $CLICKUP_LIST_ID"

