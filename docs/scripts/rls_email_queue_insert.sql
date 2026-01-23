    -- ============================================
    -- RLS Policy para INSERT en email_queue
    -- ============================================
    -- Permite que miembros de fundación (owner/editor) inserten correos
    -- relacionados con solicitudes de adopción de su fundación.
    -- También permite a admins insertar cualquier correo.

    -- Política: Miembros de fundación pueden insertar correos para solicitudes de su fundación
    drop policy if exists "email_queue_insert_by_foundation_member" on public.email_queue;

    create policy "email_queue_insert_by_foundation_member"
    on public.email_queue
    for insert
    with check (
    -- Admins pueden insertar cualquier correo
    is_admin()
    OR
    -- Miembros de fundación (owner/editor) pueden insertar correos cuando:
    -- 1. El payload contiene foundation_id que coincide con su fundación
    -- 2. El user_id es el adoptante de una solicitud de esa fundación
    (
        exists (
        select 1
        from foundation_members fm
        where fm.user_id = auth.uid()
            and fm.member_role in ('owner', 'editor')
            and (payload->>'foundation_id')::uuid = fm.foundation_id
        )
        AND
        -- Verificar que el user_id corresponde a un adoptante de una solicitud de esa fundación
        exists (
        select 1
        from adoption_requests ar
        where ar.adopter_user_id = user_id
            and ar.foundation_id = (payload->>'foundation_id')::uuid
        )
    )
    );
