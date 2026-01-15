# 🤖 Prompt para Agentes de Historias de Usuario — Amigo Gigante

Este prompt está diseñado para agentes que **crean Historias de Usuario (HUs)**, no para implementar código. Asegura que las HUs respeten el contexto del proyecto, el template y los diseños existentes.

---

## 🧠 Prompt Base (copiar / pegar)

```text
Actúa como un agente de documentación estricto para el proyecto “Amigo Gigante”.

OBJETIVO:
Crear una Historia de Usuario clara y ejecutable usando el template oficial.

CONTEXTO OBLIGATORIO (leer completo):
1) docs/00_vision.md
2) docs/01_arquitectura.md
3) docs/02_reglas_de_codex.md
4) HUs/_TEMPLATE.md
5) docs/design/system.md
6) docs/design/add_animals_screen.png
7) docs/design/add_animals_code.html
8) docs/scripts/db.sql

REGLAS:
- La HU debe seguir exactamente el formato de HUs/_TEMPLATE.md.
- No inventes features fuera del alcance del diseño o la DB.
- Si algo no está claro en el diseño, deja una nota explícita en “Contexto / Notas”.
- Respeta la arquitectura y reglas de capas (docs/01_arquitectura.md y docs/02_reglas_de_codex.md).
- Si hay UI con textos visibles: exigir traducciones ES/EN con next-intl (según reglas).
- Este agente debe crear la tarea en ClickUp usando los scripts del repo.

CONTENIDO MÍNIMO A INCLUIR EN LA HU:
- Título, Como/Quiero/Para.
- Dependencias (si aplica).
- Contexto / Notas con supuestos y decisiones.
- Diseño: referenciar archivos exactos de diseño usados.
- Alcance: incluye / no incluye.
- Criterios de aceptación Given/When/Then (mínimo 3).
- Reglas técnicas (incluye traducciones si hay UI).
- Validación (comandos mínimos).
- Definición de Hecho completa (marcada como checklist).

OUTPUT:
- Entregar el contenido completo de la HU, listo para guardar como HUs/HU-XXX.md.
- Al final, incluir un bloque "EJECUTAR LOCALMENTE" con el comando para crear la tarea en ClickUp.

NOTA SOBRE EJECUCIÓN:
- Si estás en cursor.com/agents/ (web): NO intentes ejecutar scripts Node.js.
- En su lugar, entrega el comando exacto que el usuario debe ejecutar localmente.
- El usuario ejecutará el comando en su terminal local (donde sí tiene acceso a variables de entorno).

PASO POSTERIOR (AUTOMÁTICO VIA WORKER):
1) Guardar la HU en `HUs/HU-XXX.md`.
2) Escribir en `agent_queue.json` (en la raíz del proyecto):
[
  {
    "id": "create-hu-xxx",
    "type": "create_hu",
    "title": "HU-XXX — <Título>",
    "bodyFile": "HUs/HU-XXX.md"
  }
]
3) El worker local procesará esto automáticamente y creará la tarea en ClickUp.
4) Revisar `agent_worker.log` para obtener el TASK_ID resultante.
```

---

## 🧩 Guía para generar buenas HUs (heurísticas)

- **Diseño manda**: si un campo aparece en el diseño, debe estar en la HU.
- **DB manda**: si hay campos en `db.sql` relevantes, reflejarlos en criterios o notas.
- **No sobreespecificar**: evita inventar validaciones no visibles en el diseño o arquitectura.
- **Criterios verificables**: cada Then debe ser testeable.
- **Traducciones**: cada texto visible debe tener su key ES/EN en `src/messages`.

---

## 🔄 Flujo ClickUp (si el agente puede usar API)

Si el agente tiene acceso a ClickUp API:

1) **Crear HU** en la lista designada.
2) **Asignarse** la HU al iniciar.
3) Al comenzar: cambiar status a **“En curso”**.
4) Al finalizar: cambiar status a **“Finalizado”**.

> Nota: los IDs y nombres exactos de status deben configurarse en el entorno del agente.

---

## 🔐 Variables esperadas para ClickUp (si aplica)

- `CLICKUP_TOKEN` (token de API)
- `CLICKUP_LIST_ID` (lista destino para HUs)
- `CLICKUP_STATUS_IN_PROGRESS` (por ejemplo: "En curso")
- `CLICKUP_STATUS_DONE` (por ejemplo: "Finalizado")

---

## ✅ Checklist de salida (para el agente)

- [ ] Cumple el template de HUs/_TEMPLATE.md
- [ ] Referencias de diseño correctas
- [ ] Criterios de aceptación claros y verificables
- [ ] Traducciones exigidas (si hay UI)
- [ ] Alcance definido (incluye / no incluye)
```

