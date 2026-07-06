-- Fix infinite RLS recursion on usuarios table and dependent tables
-- Error: 42P17 (infinite recursion detected in policy for relation "usuarios")
-- Root cause: policies on various tables perform subqueries on usuarios,
-- and usuarios' own RLS policies also reference usuarios, creating infinite recursion.
-- Solution: replace all subqueries on usuarios with SECURITY DEFINER helper functions
-- that bypass RLS, breaking the recursive loop.

-- 1. Create SECURITY DEFINER helper functions (bypass RLS, no recursion)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role::text FROM public.usuarios WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_my_funcionario_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id FROM public.funcionarios WHERE usuario_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_my_funcionario_rh_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id FROM public.funcionarios_rh WHERE user_id = auth.uid();
$$;

-- 2. Fix usuarios table: drop all recursive policies, create non-recursive ones
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'usuarios' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.usuarios', r.policyname);
  END LOOP;
END $$;

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios_select_all" ON public.usuarios
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "usuarios_update_own" ON public.usuarios
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "usuarios_delete_admin" ON public.usuarios
  FOR DELETE TO authenticated
  USING (public.get_user_role() = 'admin');

-- 3. Fix ferias table policies (use helper functions instead of subquerying usuarios)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ferias' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.ferias', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "ferias_select" ON public.ferias
  FOR SELECT TO authenticated USING (
    public.get_user_role() IN ('admin', 'gerente') OR
    funcionario_id = public.get_my_funcionario_id()
  );

CREATE POLICY "ferias_insert" ON public.ferias
  FOR INSERT TO authenticated WITH CHECK (
    public.get_user_role() IN ('admin', 'gerente') OR
    funcionario_id = public.get_my_funcionario_id()
  );

CREATE POLICY "ferias_update" ON public.ferias
  FOR UPDATE TO authenticated USING (
    public.get_user_role() IN ('admin', 'gerente') OR
    funcionario_id = public.get_my_funcionario_id()
  );

CREATE POLICY "ferias_delete" ON public.ferias
  FOR DELETE TO authenticated USING (
    public.get_user_role() IN ('admin', 'gerente')
  );

-- 4. Fix funcionarios_rh table policies
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'funcionarios_rh' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.funcionarios_rh', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "func_rh_select" ON public.funcionarios_rh
  FOR SELECT TO authenticated USING (
    public.get_user_role() IN ('admin', 'gerente') OR user_id = auth.uid()
  );

CREATE POLICY "func_rh_insert" ON public.funcionarios_rh
  FOR INSERT TO authenticated WITH CHECK (
    public.get_user_role() IN ('admin', 'gerente')
  );

CREATE POLICY "func_rh_update" ON public.funcionarios_rh
  FOR UPDATE TO authenticated
  USING (public.get_user_role() IN ('admin', 'gerente'))
  WITH CHECK (public.get_user_role() IN ('admin', 'gerente'));

CREATE POLICY "func_rh_delete" ON public.funcionarios_rh
  FOR DELETE TO authenticated USING (
    public.get_user_role() IN ('admin', 'gerente')
  );

-- 5. Fix departamentos_rh table policies
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'departamentos_rh' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.departamentos_rh', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "dept_rh_select_all" ON public.departamentos_rh
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "dept_rh_modify_admin" ON public.departamentos_rh
  FOR ALL TO authenticated
  USING (public.get_user_role() IN ('admin', 'gerente'))
  WITH CHECK (public.get_user_role() IN ('admin', 'gerente'));

-- 6. Fix controle_ponto policies (use helper function instead of subquerying funcionarios_rh)
DROP POLICY IF EXISTS "ponto_insert_own" ON public.controle_ponto;
DROP POLICY IF EXISTS "ponto_update_own" ON public.controle_ponto;

CREATE POLICY "ponto_insert_own" ON public.controle_ponto
  FOR INSERT TO authenticated
  WITH CHECK (funcionario_id = public.get_my_funcionario_rh_id());

CREATE POLICY "ponto_update_own" ON public.controle_ponto
  FOR UPDATE TO authenticated
  USING (funcionario_id = public.get_my_funcionario_rh_id())
  WITH CHECK (funcionario_id = public.get_my_funcionario_rh_id());

-- 7. Ensure periodos_aquisitivos has non-recursive policies
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'periodos_aquisitivos' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.periodos_aquisitivos', r.policyname);
  END LOOP;
END $$;

ALTER TABLE public.periodos_aquisitivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "periodos_aquis_select" ON public.periodos_aquisitivos
  FOR SELECT TO authenticated USING (
    public.get_user_role() IN ('admin', 'gerente') OR
    funcionario_id = public.get_my_funcionario_id()
  );

CREATE POLICY "periodos_aquis_insert" ON public.periodos_aquisitivos
  FOR INSERT TO authenticated WITH CHECK (
    public.get_user_role() IN ('admin', 'gerente')
  );

CREATE POLICY "periodos_aquis_update" ON public.periodos_aquisitivos
  FOR UPDATE TO authenticated USING (
    public.get_user_role() IN ('admin', 'gerente')
  );

CREATE POLICY "periodos_aquis_delete" ON public.periodos_aquisitivos
  FOR DELETE TO authenticated USING (
    public.get_user_role() IN ('admin', 'gerente')
  );

-- 8. Ensure controle_falta has non-recursive policies
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'controle_falta' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.controle_falta', r.policyname);
  END LOOP;
END $$;

ALTER TABLE public.controle_falta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "controle_falta_select" ON public.controle_falta
  FOR SELECT TO authenticated USING (
    public.get_user_role() IN ('admin', 'gerente') OR
    funcionario_id = public.get_my_funcionario_id()
  );

CREATE POLICY "controle_falta_insert" ON public.controle_falta
  FOR INSERT TO authenticated WITH CHECK (
    public.get_user_role() IN ('admin', 'gerente') OR
    funcionario_id = public.get_my_funcionario_id()
  );

CREATE POLICY "controle_falta_update" ON public.controle_falta
  FOR UPDATE TO authenticated USING (
    public.get_user_role() IN ('admin', 'gerente')
  );

CREATE POLICY "controle_falta_delete" ON public.controle_falta
  FOR DELETE TO authenticated USING (
    public.get_user_role() IN ('admin', 'gerente')
  );

-- 9. Ensure funcionarios table has safe policies if RLS is enabled
DO $$
DECLARE
  r RECORD;
  has_rls boolean;
BEGIN
  SELECT c.relrowsecurity INTO has_rls
  FROM pg_class c
  JOIN pg_namespace n ON c.relnamespace = n.oid
  WHERE n.nspname = 'public' AND c.relname = 'funcionarios';

  IF has_rls THEN
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'funcionarios' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.funcionarios', r.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY "funcionarios_select_all" ON public.funcionarios FOR SELECT TO authenticated USING (true)';
    EXECUTE 'CREATE POLICY "funcionarios_modify_admin" ON public.funcionarios FOR ALL TO authenticated USING (public.get_user_role() IN (''admin'', ''gerente'')) WITH CHECK (public.get_user_role() IN (''admin'', ''gerente''))';
  END IF;
END $$;

-- 10. Ensure departamentos table has safe policies if RLS is enabled
DO $$
DECLARE
  r RECORD;
  has_rls boolean;
BEGIN
  SELECT c.relrowsecurity INTO has_rls
  FROM pg_class c
  JOIN pg_namespace n ON c.relnamespace = n.oid
  WHERE n.nspname = 'public' AND c.relname = 'departamentos';

  IF has_rls THEN
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'departamentos' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.departamentos', r.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY "departamentos_select_all" ON public.departamentos FOR SELECT TO authenticated USING (true)';
  END IF;
END $$;
