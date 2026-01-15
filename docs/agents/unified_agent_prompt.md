# 🤖 Prompt Unificado — Agente Todo-en-Uno (Local)

Este prompt permite que **un solo agente** maneje TODO el flujo de una HU en Cursor local.

---

## 🚀 Uso Simple

**Solo le dices al agente:**
> "Necesito implementar: [descripción de la feature]"
> 
> Ejemplo: "Necesito implementar modo dark en la web"

**El agente automáticamente:**
1. ✅ Crea la HU (`HUs/HU-XXX.md`)
2. ✅ La sube a ClickUp
3. ✅ Marca como "En curso"
4. ✅ Implementa el código
5. ✅ Marca como "Finalizado"

---

## 📋 Prompt Completo (para el agente)

```text
Actúa como un agente completo para el proyecto "Amigo Gigante" que maneja TODO el flujo de una HU.

CONTEXTO OBLIGATORIO (leer):
- docs/00_vision.md
- docs/01_arquitectura.md
- docs/02_reglas_de_codex.md
- docs/design/system.md
- docs/scripts/db.sql
- HUs/_TEMPLATE.md

TAREA COMPLETA:

1) CREAR LA HU
- Genera un ID único (HU-XXX) buscando el siguiente número disponible en HUs/
- Crea HUs/HU-XXX.md siguiendo EXACTAMENTE el template _TEMPLATE.md
- Incluye: título, Como/Quiero/Para, dependencias, contexto, alcance, criterios de aceptación, reglas técnicas
- Si hay UI: exigir traducciones ES/EN obligatorias

2) SUBIR A CLICKUP (AUTOMÁTICO VIA WORKER)
- Escribe en agent_queue.json (en la raíz del proyecto):
[
  {
    "id": "create-hu-xxx",
    "type": "create_hu",
    "title": "HU-XXX — <Título>",
    "bodyFile": "HUs/HU-XXX.md"
  }
]
- El worker local procesará esto y creará la tarea en ClickUp
- Lee agent_worker.log para obtener el TASK_ID resultante (busca "TASK_ID:" en el log)

3) MARCAR "EN CURSO" (AUTOMÁTICO VIA WORKER)
- Una vez tengas el TASK_ID, escribe en agent_queue.json:
[
  {
    "id": "start-hu-xxx",
    "type": "update_status",
    "taskId": "<TASK_ID>",
    "status": "--in-progress"
  }
]

4) IMPLEMENTAR LA HU
- Lee HUs/HU-XXX.md completamente
- Implementa EXACTAMENTE lo definido en la HU
- Respeta arquitectura (Domain/Infrastructure/Presentation)
- Si hay UI: TODOS los textos traducidos con next-intl
- NO inventes requisitos no definidos en la HU

5) VALIDAR
- Ejecuta: npm run build (verificar que compila)
- Verifica que cumple los criterios de aceptación

6) FINALIZAR (AUTOMÁTICO VIA WORKER)
- Escribe en agent_queue.json:
{
  "id": "finish-hu-xxx",
  "type": "finish_task",
  "taskId": "<TASK_ID>"
}

7) RESUMEN FINAL
- Lista de archivos creados/modificados
- TASK_ID y URL de ClickUp
- Checklist de cumplimiento

REGLAS ESTRICTAS:
- Solo implementar lo que está en la HU
- No cambiar arquitectura sin autorización
- Traducciones obligatorias si hay UI
- Mantener el proyecto funcional en cada paso
- Ejecutar comandos localmente (tienes acceso a variables de entorno)

Si algo no está claro en la HU, preguntar antes de asumir.
```

---

## 💡 Ejemplo de Conversación

**Usuario:**
> Necesito implementar modo dark en la web. Alcance: toda la web. Activación: toggle manual + respeta preferencia del sistema. Persistencia: localStorage.

**Agente:**
> Perfecto. Voy a:
> 1. Crear HU-038.md
> 2. Subirla a ClickUp
> 3. Implementarla
> 4. Finalizarla
> 
> [Ejecuta todo automáticamente]
> 
> ✅ Completado. HU-038 implementada y finalizada.
> - TASK_ID: 86aejm1tv
> - URL: https://app.clickup.com/t/86aejm1tv
> - Archivos: [lista]

---

## ✅ Ventajas de este enfoque

- ✅ **Un solo agente** ve todo el contexto
- ✅ **Un solo prompt** para todo
- ✅ **Automático** - solo describes la feature
- ✅ **Mantiene estado** - todo en el mismo workspace
- ✅ **Menos errores** - no hay pérdida de contexto entre agentes

---

## 🎯 Cuándo usar cada enfoque

| Enfoque | Cuándo usar |
|---------|-------------|
| **Unificado (este)** | Para HUs completas que puedes describir claramente |
| **Orquestador + agentes separados** | Si necesitas revisar/editar la HU antes de implementar |
| **Cursor web agents** | NO recomendado (problema de contexto aislado) |

---

**Recomendación:** Usa este prompt unificado en Cursor local para máxima eficiencia.

