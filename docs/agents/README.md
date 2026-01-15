# 🤖 Agents — Flujo Automatizado

Sistema automatizado para que los agentes trabajen **completamente solos** sin tu intervención.

---

## 🚀 Inicio Rápido

### 1. Setup (una sola vez)

```bash
# Inicia el worker en background
node scripts/clickup/setup_env.sh  # Verifica variables
node scripts/agent_worker.mjs &

# O con PM2 (recomendado)
pm2 start scripts/agent_worker.mjs --name agent-worker
pm2 save
```

### 2. Usa el agente

En Cursor (local o web):
1. Pega `docs/agents/unified_agent_prompt.md`
2. Escribe: "Necesito implementar: [tu feature]"
3. **Listo** - el agente hace TODO automáticamente

---

## 📚 Archivos

| Archivo | Descripción |
|---------|-------------|
| `unified_agent_prompt.md` | **Prompt principal** - úsalo para todo |
| `AUTOMATED_FLOW.md` | Guía detallada del flujo automatizado |
| `../98_prompt_hu_agent.md` | Prompt base para crear HUs (si necesitas) |
| `../99_prompt_codex.md` | Prompt base para implementar (si necesitas) |

---

## 🔄 Cómo Funciona

1. **Tú** describes la feature al agente
2. **Agente** crea HU y escribe instrucciones en `agent_queue.json`
3. **Worker local** ejecuta comandos automáticamente (ClickUp, etc.)
4. **Agente** implementa código
5. **Agente** finaliza la tarea
6. **Tú** trabajas en otras cosas sin intervenir

---

## 📖 Documentación Completa

Ver `AUTOMATED_FLOW.md` para detalles completos.

---

## 🐛 Troubleshooting

```bash
# Ver logs del worker
tail -f agent_worker.log

# Ver estado (con PM2)
pm2 status
pm2 logs agent-worker

# Ver cola actual
cat agent_queue.json
```

---

**Todo funciona automáticamente. Solo describe la feature y los agentes trabajan solos.** 🎉
