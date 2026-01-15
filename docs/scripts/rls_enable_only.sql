-- ============================================
-- ACTIVAR RLS SOLO (SIN POLÍTICAS)
-- ============================================
-- Este script solo activa RLS sin crear políticas
-- Útil para probar paso a paso
-- ⚠️ ADVERTENCIA: Después de ejecutar esto, las tablas estarán bloqueadas
-- hasta que crees las políticas en rls_policies.sql

-- Activar RLS en todas las tablas
alter table profiles enable row level security;
alter table foundations enable row level security;
alter table foundation_members enable row level security;
alter table foundation_contacts enable row level security;
alter table animals enable row level security;
alter table animal_photos enable row level security;
alter table products enable row level security;
alter table events enable row level security;
alter table adoption_requests enable row level security;
alter table adoption_request_details enable row level security;
alter table adoption_request_documents enable row level security;

-- Forzar RLS (requiere políticas para cualquier acceso)
alter table profiles force row level security;
alter table foundations force row level security;
alter table foundation_members force row level security;
alter table foundation_contacts force row level security;
alter table animals force row level security;
alter table animal_photos force row level security;
alter table products force row level security;
alter table events force row level security;
alter table adoption_requests force row level security;
alter table adoption_request_details force row level security;
alter table adoption_request_documents force row level security;
