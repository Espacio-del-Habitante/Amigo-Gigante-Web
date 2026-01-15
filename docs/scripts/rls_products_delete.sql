-- 1) Activar RLS en products (si no está activo)
alter table public.products enable row level security;
 
-- 2) Policy de DELETE: solo miembros owner/editor de la misma fundación
drop policy if exists "products_delete_by_foundation_member" on public.products;
 
create policy "products_delete_by_foundation_member"
on public.products
for delete
using (
  exists (
    select 1
    from public.foundation_members fm
    where fm.foundation_id = products.foundation_id
      and fm.user_id = auth.uid()
      and fm.member_role in ('owner', 'editor')
  )
);