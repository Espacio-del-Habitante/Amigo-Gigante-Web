# Agents — Prompts rápidos

Estos prompts están listos para pegar en https://cursor.com/agents.

## ⚙️ Setup inicial (solo una vez)

Asegúrate de tener configuradas las variables de entorno:

```bash
export CLICKUP_API_TOKEN="pk_..."
export CLICKUP_LIST_ID="901324355532"
export CLICKUP_STATUS_IN_PROGRESS="En curso"
export CLICKUP_STATUS_DONE="Finalizado"
export CLICKUP_ASSIGNEE_ID="123456"  # Opcional
```

Verifica que funcionan:
```bash
source scripts/clickup/setup_env.sh
```

---

## 🚀 Flujo de trabajo

### 1) Agente Coordinador
Pega `coordinator_prompt.md` y dale la idea de la HU.

### 2) Agente HU (creador)
Pega `creator_hu_prompt.md` cuando el Coordinador lo pida.
- Genera la HU completa
- Te da un comando para ejecutar localmente
- **Ejecuta ese comando en tu terminal local** para crear la tarea en ClickUp
- Comparte el TASK_ID y URL con el Coordinador

### 3) Agente Dev (implementador)
Pega `dev_hu_prompt.md` cuando el Coordinador lo pida.
- Implementa la HU
- **Ejecuta los comandos localmente** para actualizar estados

---

## 📝 Nota importante

Los agentes en cursor.com/agents/ **no pueden ejecutar scripts locales**. Por eso:
- Los agentes generan contenido e instrucciones
- Tú ejecutas los comandos en tu terminal local (donde sí tienes acceso a variables de entorno)


