# Realtime para notificaciones

Para habilitar las notificaciones en tiempo real en Supabase:

1. Abrir Supabase Dashboard.
2. Ir a **Database > Replication**.
3. Buscar la tabla **notifications**.
4. Activar Realtime para la tabla.
5. Confirmar que estén habilitados los eventos **INSERT** y **UPDATE**.

Esto permite que la suscripción en la app reciba nuevas notificaciones y cambios de lectura en tiempo real.
