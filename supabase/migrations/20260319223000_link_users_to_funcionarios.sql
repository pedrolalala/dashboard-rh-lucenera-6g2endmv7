DO $$
DECLARE
  u RECORD;
BEGIN
  -- Garante que todo usuario da tabela usuarios (incluindo administradores e TI) tenha um vínculo em funcionarios_rh
  FOR u IN SELECT id, email, nome FROM public.usuarios LOOP
    -- Tenta atualizar um funcionario existente com o mesmo email
    UPDATE public.funcionarios_rh
    SET user_id = u.id
    WHERE email = u.email AND user_id IS NULL;

    -- Se ainda nao existir ninguem com esse user_id, insere um novo registro de funcionario
    IF NOT EXISTS (SELECT 1 FROM public.funcionarios_rh WHERE user_id = u.id) THEN
      INSERT INTO public.funcionarios_rh (nome, email, user_id, status)
      VALUES (u.nome, u.email, u.id, 'Ativo');
    END IF;
  END LOOP;
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "ponto_insert_own" ON public.controle_ponto;
    DROP POLICY IF EXISTS "ponto_update_own" ON public.controle_ponto;
END $$;

-- Garante que qualquer usuário autenticado (incluindo admins/gerentes) possa inserir/atualizar seus próprios pontos
CREATE POLICY "ponto_insert_own" ON public.controle_ponto
  FOR INSERT TO authenticated
  WITH CHECK (funcionario_id IN (SELECT id FROM public.funcionarios_rh WHERE user_id = auth.uid()));

CREATE POLICY "ponto_update_own" ON public.controle_ponto
  FOR UPDATE TO authenticated
  USING (funcionario_id IN (SELECT id FROM public.funcionarios_rh WHERE user_id = auth.uid()))
  WITH CHECK (funcionario_id IN (SELECT id FROM public.funcionarios_rh WHERE user_id = auth.uid()));
