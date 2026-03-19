-- Allow employees to insert their own daily logs
CREATE POLICY "ponto_insert_own" ON public.controle_ponto
  FOR INSERT TO authenticated
  WITH CHECK (funcionario_id IN (SELECT id FROM public.funcionarios_rh WHERE user_id = auth.uid()));

-- Allow employees to update their own daily logs (e.g. clocking out)
CREATE POLICY "ponto_update_own" ON public.controle_ponto
  FOR UPDATE TO authenticated
  USING (funcionario_id IN (SELECT id FROM public.funcionarios_rh WHERE user_id = auth.uid()))
  WITH CHECK (funcionario_id IN (SELECT id FROM public.funcionarios_rh WHERE user_id = auth.uid()));
