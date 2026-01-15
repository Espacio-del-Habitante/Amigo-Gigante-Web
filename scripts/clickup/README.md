# ClickUp — Scripts de HUs

Estos scripts crean HUs en ClickUp y actualizan su estado. Usan variables de entorno para evitar credenciales en el repo.

## Variables de entorno

- `CLICKUP_API_TOKEN` (obligatorio)
- `CLICKUP_LIST_ID` (obligatorio para crear)
- `CLICKUP_STATUS_IN_PROGRESS` (opcional, recomendado)
- `CLICKUP_STATUS_DONE` (opcional, recomendado)
- `CLICKUP_ASSIGNEE_ID` (opcional)

## Crear HU

```bash
node scripts/clickup/create_hu.mjs \
  --title "HU-038 — Crear animal" \
  --body-file "HUs/HU-038.md"
```

## Crear HU (modo rápido)

```bash
node scripts/clickup/flow.mjs \
  --title "HU-038 — Crear animal" \
  --body-file "HUs/HU-038.md"
```

## Actualizar estado

```bash
node scripts/clickup/update_status.mjs <TASK_ID> "Finalizado"
```

O usando flags:

```bash
node scripts/clickup/update_status.mjs <TASK_ID> --in-progress
node scripts/clickup/update_status.mjs <TASK_ID> --done
```

## Flujo sugerido

1) Crear HU (usa `CLICKUP_STATUS_IN_PROGRESS` si existe)
2) Al terminar, actualizar a `CLICKUP_STATUS_DONE`

