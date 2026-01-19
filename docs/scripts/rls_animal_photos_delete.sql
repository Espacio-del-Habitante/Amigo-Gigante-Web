-- Política de DELETE para animal_photos: solo miembros owner/editor de la misma fundación
-- Esta política permite que los miembros de fundación eliminen fotos de animales de su fundación

drop policy if exists "animal_photos_delete_by_foundation_member" on public.animal_photos;

create policy "animal_photos_delete_by_foundation_member"
on public.animal_photos
for delete
using (
  exists (
    select 1
    from public.animals a
    inner join public.foundation_members fm on fm.foundation_id = a.foundation_id
    where a.id = animal_photos.animal_id
      and fm.user_id = auth.uid()
      and fm.member_role in ('owner', 'editor')
  )
);
