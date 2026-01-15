# 🔄 Flujo Simplificado con Orquestador Local

El problema con agentes web aislados es que **no comparten contexto**. Esta es la solución optimizada.

---

## 🎯 Flujo Recomendado (Orquestador Local)

### Opción 1: Flujo Manual Simplificado

```bash
# 1. Crea la HU base localmente
node scripts/orchestrator.mjs create "Modo dark en la web"
# → Te da: HU-038.md (edítalo manualmente o con un agente local)

# 2. Sube a ClickUp
node scripts/clickup/flow.mjs --title "HU-038 — Modo dark" --body-file "HUs/HU-038.md"
# → Te da: TASK_ID

# 3. Marca como "En curso" y prepara implementación
node scripts/orchestrator.mjs implement HU-038 <TASK_ID>

# 4. Implementa con UN SOLO agente (en Cursor local, no web)
# Pega docs/99_prompt_codex.md + HUs/HU-038.md

# 5. Finaliza
node scripts/orchestrator.mjs finish <TASK_ID>
```

### Opción 2: Todo en Cursor Local (Recomendado)

**Ventaja**: Un solo agente ve todo el contexto del workspace.

1. Abre Cursor local (no web)
2. Pega `docs/99_prompt_codex.md`
3. Pégale `HUs/HU-038.md`
4. El agente:
   - Marca ClickUp como "En curso" (ejecutando el script localmente)
   - Implementa la HU
   - Marca como "Finalizado"
   
**Todo en una sesión, todo el contexto disponible.**

---

## ❌ Por qué NO funciona el flujo multi-agente web

- ❌ Cada agente web tiene su propio workspace/contexto
- ❌ No ven archivos creados por otros agentes
- ❌ Requieren pasar contexto manualmente (ineficiente)
- ❌ Propenso a errores de sincronización

## ✅ Por qué SÍ funciona el orquestador local

- ✅ Mantiene todo en el mismo workspace
- ✅ Un solo agente ve todo el contexto
- ✅ Scripts locales tienen acceso a variables de entorno
- ✅ Menos pasos manuales

---

## 📝 Ejemplo Completo: Modo Dark

```bash
# Paso 1: Crear HU base
node scripts/orchestrator.mjs create "Modo dark en la web"
# Edita HUs/HU-038.md con los detalles

# Paso 2: Subir a ClickUp
node scripts/clickup/flow.mjs \
  --title "HU-038 — Modo dark en la web" \
  --body-file "HUs/HU-038.md"
# Anota el TASK_ID: 86aejm1tv

# Paso 3: Iniciar implementación
node scripts/orchestrator.mjs implement HU-038 86aejm1tv

# Paso 4: Implementar (en Cursor LOCAL)
# - Abre Cursor
# - Pega docs/99_prompt_codex.md
# - Pega HUs/HU-038.md
# - El agente implementa TODO

# Paso 5: Finalizar
node scripts/orchestrator.mjs finish 86aejm1tv
```

---

## 🚀 Próximos Pasos

Si quieres automatizar más:
1. Usar Cursor API (si está disponible) para llamar agentes programáticamente
2. Integrar generación de HU con IA local (usando prompts sin agentes web)
3. Crear un dashboard web local que orqueste todo

Pero **la solución actual (orquestador + Cursor local) ya es mucho más eficiente** que agentes web aislados.

