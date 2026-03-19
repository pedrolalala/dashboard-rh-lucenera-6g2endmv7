-- Ensure admin has specific policies for insert and update on funcionarios_rh
-- Although func_all_admin already gives ALL to admin and gerente, we add explicitly restrictive ones
-- to align perfectly with the "Admin-Only Access Control" requirement if needed in the future.

DO $$
BEGIN
    -- Policy to explicitly allow admins to INSERT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'funcionarios_rh' AND policyname = 'func_insert_admin_explicit'
    ) THEN
        CREATE POLICY "func_insert_admin_explicit" ON public.funcionarios_rh
            FOR INSERT TO authenticated
            WITH CHECK (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND role = 'admin'));
    END IF;

    -- Policy to explicitly allow admins to UPDATE
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'funcionarios_rh' AND policyname = 'func_update_admin_explicit'
    ) THEN
        CREATE POLICY "func_update_admin_explicit" ON public.funcionarios_rh
            FOR UPDATE TO authenticated
            USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND role = 'admin'))
            WITH CHECK (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND role = 'admin'));
    END IF;
END
$$;
