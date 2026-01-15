-- 1) Activar RLS en animals (si no está activo)
alter table public.animals enable row level security;
 
-- 2) Policy de DELETE: solo miembros owner/editor de la misma fundación
drop policy if exists "animals_delete_by_foundation_member" on public.animals;
 
create policy "animals_delete_by_foundation_member"
on public.animals
for delete
using (
  exists (
    select 1
    from public.foundation_members fm
    where fm.foundation_id = animals.foundation_id
      and fm.user_id = auth.uid()
      and fm.member_role in ('owner', 'editor')
  )
);