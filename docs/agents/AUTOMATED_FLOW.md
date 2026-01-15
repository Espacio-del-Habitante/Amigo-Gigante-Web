# 🤖 Flujo 100% Automatizado (Sin Intervención Manual)

Esta guía te permite que los agentes trabajen **completamente solos** mientras tú haces otras cosas.

---

## 🎯 Cómo Funciona

1. **Worker local** corre en background escuchando instrucciones
2. **Agentes web** escriben comandos en `agent_queue.json`
3. **Worker ejecuta** los comandos automáticamente
4. **Tú trabajas** en otras cosas sin intervenir

---

## 🚀 Setup (Una sola vez)

### 1. Inicia el worker en background

```bash
# Opción A: Terminal separada (simple)
node scripts/agent_worker.mjs &

# Opción B: Con PM2 (recomendado, se reinicia solo)
npm install -g pm2
pm2 start scripts/agent_worker.mjs --name agent-worker
pm2 save  # Guarda para reiniciar al boot
```

### 2. Verifica que funciona

```bash
# Ver logs
tail -f agent_worker.log

# O con PM2
pm2 logs agent-worker
```

---

## 📝 Cómo los Agentes Escriben Instrucciones

### Para el Agente Creador de HU

Cuando termine de crear `HUs/HU-XXX.md`, debe escribir esto en `agent_queue.json`:

```json
[
  {
    "id": "create-hu-038",
    "type": "create_hu",
    "title": "HU-038 — Modo dark en la web",
    "bodyFile": "HUs/HU-038.md"
  }
]
```

### Para el Agente Implementador

Al empezar:
```json
[
  {
    "id": "start-hu-038",
    "type": "update_status",
    "taskId": "86aejm1tv",
    "status": "--in-progress"
  }
]
```

Al terminar:
```json
[
  {
    "id": "finish-hu-038",
    "type": "finish_task",
    "taskId": "86aejm1tv"
  }
]
```

---

## 🔧 Prompt para Agentes Web Actualizado

### Agente Creador de HU (actualizado)

```text
[... contenido del prompt existente ...]

AL FINALIZAR (OBLIGATORIO):
1. Guarda la HU en HUs/HU-XXX.md
2. Escribe en agent_queue.json (en la raíz del proyecto):

[
  {
    "id": "create-hu-xxx",
    "type": "create_hu",
    "title": "HU-XXX — <Título>",
    "bodyFile": "HUs/HU-XXX.md"
  }
]

El worker local procesará esto automáticamente y creará la tarea en ClickUp.
```

### Agente Implementador (actualizado)

```text
[... contenido del prompt existente ...]

AL INICIAR (OBLIGATORIO):
Escribe en agent_queue.json:

[
  {
    "id": "start-hu-xxx",
    "type": "update_status",
    "taskId": "<TASK_ID>",
    "status": "--in-progress"
  }
]

AL FINALIZAR (OBLIGATORIO):
Agrega a agent_queue.json:

{
  "id": "finish-hu-xxx",
  "type": "finish_task",
  "taskId": "<TASK_ID>"
}
```

---

## ✅ Flujo Completo Automatizado

### 1. Tú escribes (una vez)
> "Necesito modo dark en la web"

### 2. Agente Creador (web)
- Crea `HUs/HU-038.md`
- Escribe en `agent_queue.json` → crear tarea ClickUp
- **Worker ejecuta automáticamente** → tarea creada

### 3. Agente Implementador (web)
- Lee `HUs/HU-038.md`
- Escribe en `agent_queue.json` → marcar "En curso"
- **Worker ejecuta automáticamente** → estado actualizado
- Implementa código
- Escribe en `agent_queue.json` → marcar "Finalizado"
- **Worker ejecuta automáticamente** → tarea completada

### 4. Tú trabajas en otras cosas
✅ **Sin intervención manual en ningún momento**

---

## 📊 Monitoreo

### Ver qué está pasando

```bash
# Logs en tiempo real
tail -f agent_worker.log

# Estado del worker (con PM2)
pm2 status

# Ver la cola actual
cat agent_queue.json
```

### Si algo falla

El worker escribe errores en `agent_worker.log`. Revisa ahí.

---

## 🔒 Seguridad

El worker solo ejecuta comandos específicos permitidos:
- `scripts/clickup/flow.mjs`
- `scripts/clickup/update_status.mjs`

No ejecuta comandos arbitrarios por seguridad.

---

## 🎯 Ventajas

✅ **100% automático** - los agentes trabajan solos
✅ **Sin intervención** - tú haces otras cosas
✅ **Transparente** - logs de todo lo que pasa
✅ **Seguro** - solo comandos permitidos
✅ **Confiables** - PM2 reinicia si falla

---

## 🚨 Troubleshooting

**Worker no procesa:**
- Verifica que está corriendo: `pm2 status`
- Revisa logs: `pm2 logs agent-worker`
- Verifica permisos del archivo `agent_queue.json`

**Agentes no pueden escribir:**
- Verifica que el archivo existe y tiene permisos
- Los agentes web pueden tener problemas escribiendo archivos → usa prompt que les diga exactamente qué escribir

---

**Con esto, los agentes trabajan completamente solos mientras tú haces otras cosas.** 🎉

