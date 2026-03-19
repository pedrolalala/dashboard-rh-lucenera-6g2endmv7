DO $$
BEGIN
    DROP POLICY IF EXISTS "ponto_insert_own" ON public.controle_ponto;
    DROP POLICY IF EXISTS "ponto_update_own" ON public.controle_ponto;
END $$;

CREATE POLICY "ponto_insert_own" ON public.controle_ponto
  FOR INSERT TO authenticated
  WITH CHECK (funcionario_id IN (SELECT id FROM public.funcionarios_rh WHERE user_id = auth.uid()));

CREATE POLICY "ponto_update_own" ON public.controle_ponto
  FOR UPDATE TO authenticated
  USING (funcionario_id IN (SELECT id FROM public.funcionarios_rh WHERE user_id = auth.uid()))
  WITH CHECK (funcionario_id IN (SELECT id FROM public.funcionarios_rh WHERE user_id = auth.uid()));
