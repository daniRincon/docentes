-- =====================================================================
-- Robótica Sin Fronteras · Seguimiento de sesiones docentes
-- Ejecute este script UNA VEZ en Supabase: panel del proyecto >
-- SQL Editor > New query > pegar todo > Run.
-- =====================================================================

create table if not exists public.sesiones_docentes (
  id              uuid primary key default gen_random_uuid(),
  municipio       text not null check (municipio in ('istmina', 'belen')),
  docente         text not null check (length(trim(docente)) > 0),
  sesion          text not null check (length(trim(sesion)) > 0),
  fecha           date not null,
  minutos         integer not null check (minutos between 0 and 1440),
  observaciones   text not null default '',
  creado_en       timestamptz not null default now(),
  actualizado_en  timestamptz not null default now()
);

create index if not exists sesiones_docentes_municipio_docente_idx
  on public.sesiones_docentes (municipio, docente);

-- Mantiene actualizado_en al editar un registro
create or replace function public.sesiones_docentes_tocar_actualizado()
returns trigger language plpgsql as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;

drop trigger if exists sesiones_docentes_actualizado on public.sesiones_docentes;
create trigger sesiones_docentes_actualizado
  before update on public.sesiones_docentes
  for each row execute function public.sesiones_docentes_tocar_actualizado();

-- ---------------------------------------------------------------------
-- ACCESO ABIERTO: cualquiera con la clave pública (la página) puede
-- leer, crear, editar y borrar registros. Si más adelante se quiere
-- restringir, reemplace estas políticas por unas basadas en usuarios
-- autenticados (auth.uid()).
-- ---------------------------------------------------------------------
alter table public.sesiones_docentes enable row level security;

drop policy if exists "acceso abierto lectura"  on public.sesiones_docentes;
drop policy if exists "acceso abierto insertar" on public.sesiones_docentes;
drop policy if exists "acceso abierto editar"   on public.sesiones_docentes;
drop policy if exists "acceso abierto borrar"   on public.sesiones_docentes;

create policy "acceso abierto lectura"  on public.sesiones_docentes for select to anon, authenticated using (true);
create policy "acceso abierto insertar" on public.sesiones_docentes for insert to anon, authenticated with check (true);
create policy "acceso abierto editar"   on public.sesiones_docentes for update to anon, authenticated using (true) with check (true);
create policy "acceso abierto borrar"   on public.sesiones_docentes for delete to anon, authenticated using (true);

grant select, insert, update, delete on public.sesiones_docentes to anon, authenticated;

-- Recarga el esquema de la API para que la tabla quede disponible de inmediato
notify pgrst, 'reload schema';
