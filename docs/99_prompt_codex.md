# 🤖 Prompt Estándar para Codex — Amigo Gigante

Este es el **prompt oficial y reutilizable** para ejecutar Historias de Usuario (HUs)
en el proyecto **Amigo Gigante** usando Codex (CLI o Cloud).

👉 Este prompt **no debe modificarse** HU a HU, salvo el identificador del archivo de la HU.

---

## 🧠 Prompt Base (copiar / pegar)

```text
Actúa como un agente de código estricto para el proyecto “Amigo Gigante”.

CONTEXTO OBLIGATORIO:
1) Lee completamente y SOLO estos archivos:
   - docs/00_vision.md
   - docs/01_arquitectura.md
   - docs/02_reglas_de_codex.md
   - HUs/HU-XXX.md
2) Ignora cualquier otro archivo del repositorio (incluyendo otras HUs y docs adicionales).

REGLAS:
- Implementa EXACTAMENTE lo definido en HUs/HU-XXX.md.
- No inventes requisitos ni agregues features no solicitadas.
- No cambies la arquitectura ni las convenciones.
- No introduzcas dependencias nuevas sin autorización explícita.
- No refactorices más allá de lo estrictamente necesario para cumplir la HU.
- **TRADUCCIONES OBLIGATORIAS**: Si la HU incluye UI con texto visible:
  - TODOS los textos deben estar traducidos (español e inglés).
  - Agregar traducciones en `src/messages/es/` y `src/messages/en/`.
  - Usar `useTranslations` de `next-intl` en componentes.
  - NO hardcodear textos en español/inglés directamente en componentes.

IMPORTANTE (conectividad / 403):
- Si durante la ejecución aparece un error 403 o de conectividad porque no alcanzas algún dominio:
  1) DETENTE inmediatamente.
  2) Solicita el listado de dominios que necesitas que habiliten.
  3) Explica, por cada dominio, por qué es necesario habilitarlo (qué comando o parte del proceso lo requiere).
  4) No continúes hasta que se resuelva el bloqueo.

TAREA:
- Implementa la HU indicada respetando las capas y reglas del proyecto.
- Crea, modifica o mueve archivos SOLO si la HU lo pide.
- Mantén el proyecto en estado funcional.

CLICKUP (obligatorio - AUTOMÁTICO VIA WORKER):
- Al iniciar: escribir en `agent_queue.json`:
[
  {
    "id": "start-hu-xxx",
    "type": "update_status",
    "taskId": "<TASK_ID>",
    "status": "--in-progress"
  }
]

- Al finalizar: agregar a `agent_queue.json`:
{
  "id": "finish-hu-xxx",
  "type": "finish_task",
  "taskId": "<TASK_ID>"
}

El worker local procesará estas instrucciones automáticamente.

ENTREGA (obligatoria):
1) Resumen breve de lo realizado.
2) Lista de archivos creados/modificados.
3) Justificación de los cambios.
4) Comandos para validar localmente (dev/build/test).
5) Checklist de la Definición de Hecho de la HU (marcada).

NO DIGAS que ejecutaste comandos si no los ejecutaste realmente.
Si algo no está claro, pregunta antes de continuar.
```

---

## 🧾 Cómo usar este prompt

1) Reemplaza `HU-XXX` por la HU real  
   Ejemplo:
   - `HUs/HU-002.md`

2) Pega el prompt completo en Codex.

3) Ejecuta en una **rama dedicada a la HU**.

---

## 📌 Reglas de oro

- **Una HU por ejecución**
- **Un prompt estándar**
- **Un commit por HU**
- **Si hay bloqueo → se documenta, no se fuerza**

Este prompt es parte del contrato del proyecto.
