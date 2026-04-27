DO $$
DECLARE
  v_user_id uuid;
  v_func_id uuid;
BEGIN
  -- 1. Garante que o usuário do Pedro exista na tabela auth.users para acesso ao sistema
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pedro@lucenera.com.br') THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'pedro@lucenera.com.br',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Pedro Leonel Laghi"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'pedro@lucenera.com.br' LIMIT 1;
  END IF;

  -- Garante que ele seja administrador na tabela de usuários para poder visualizar e gerenciar as férias
  UPDATE public.usuarios SET role = 'admin', nome = 'Pedro Leonel Laghi' WHERE id = v_user_id;

  -- 2. Garante que o funcionário Pedro exista na tabela de funcionários (RH)
  IF NOT EXISTS (SELECT 1 FROM public.funcionarios WHERE email = 'pedro@lucenera.com.br') THEN
    v_func_id := gen_random_uuid();
    INSERT INTO public.funcionarios (id, usuario_id, nome, email, status)
    VALUES (v_func_id, v_user_id, 'Pedro Leonel Laghi', 'pedro@lucenera.com.br', 'Ativo');
  ELSE
    SELECT id INTO v_func_id FROM public.funcionarios WHERE email = 'pedro@lucenera.com.br' LIMIT 1;
    -- Atualiza o nome para garantir conformidade
    UPDATE public.funcionarios SET nome = 'Pedro Leonel Laghi', status = 'Ativo' WHERE id = v_func_id;
  END IF;

  -- 3. Insere a solicitação de férias requisitada (19/08/2026 até 03/09/2026 = 16 dias)
  IF NOT EXISTS (SELECT 1 FROM public.ferias WHERE funcionario_id = v_func_id AND data_inicio = '2026-08-19') THEN
    INSERT INTO public.ferias (funcionario_id, data_inicio, data_fim, status)
    VALUES (v_func_id, '2026-08-19', '2026-09-03', 'Pendente');
  END IF;
END $$;
