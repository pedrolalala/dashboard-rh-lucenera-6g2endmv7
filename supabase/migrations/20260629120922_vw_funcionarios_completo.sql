-- Create comprehensive employee view joining all related tables
DROP VIEW IF EXISTS public.vw_funcionarios_completo;
CREATE VIEW public.vw_funcionarios_completo AS
SELECT
  fn.id,
  fn.nome,
  fn.cargo,
  fn.ativo,
  fn.data_admissao,
  fn.created_at,
  fd.cpf,
  fd.rg,
  fd.data_nascimento,
  fd.endereco,
  fd.telefone,
  fd.email,
  ff.salario_base,
  ff.salario_por_fora,
  ff.comissao_percentual,
  ff.salario_liquido,
  fb.empresa,
  fb.valor_vt_dia
FROM public.funcionarios_novo fn
LEFT JOIN public.funcionarios_detalhes fd ON fd.funcionario_id = fn.id
LEFT JOIN public.funcionarios_financeiro ff ON ff.funcionario_id = fn.id
LEFT JOIN public.funcionarios_beneficios_empresas fb ON fb.funcionario_id = fn.id;

-- Enable RLS on all employee-related tables
ALTER TABLE public.funcionarios_novo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios_detalhes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios_financeiro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios_beneficios_empresas ENABLE ROW LEVEL SECURITY;

-- RLS policies for funcionarios_novo
DROP POLICY IF EXISTS "fn_novo_select_auth" ON public.funcionarios_novo;
CREATE POLICY "fn_novo_select_auth" ON public.funcionarios_novo
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "fn_novo_insert_auth" ON public.funcionarios_novo;
CREATE POLICY "fn_novo_insert_auth" ON public.funcionarios_novo
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "fn_novo_update_auth" ON public.funcionarios_novo;
CREATE POLICY "fn_novo_update_auth" ON public.funcionarios_novo
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "fn_novo_delete_auth" ON public.funcionarios_novo;
CREATE POLICY "fn_novo_delete_auth" ON public.funcionarios_novo
  FOR DELETE TO authenticated USING (true);

-- RLS policies for funcionarios_detalhes
DROP POLICY IF EXISTS "fn_det_select_auth" ON public.funcionarios_detalhes;
CREATE POLICY "fn_det_select_auth" ON public.funcionarios_detalhes
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "fn_det_insert_auth" ON public.funcionarios_detalhes;
CREATE POLICY "fn_det_insert_auth" ON public.funcionarios_detalhes
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "fn_det_update_auth" ON public.funcionarios_detalhes;
CREATE POLICY "fn_det_update_auth" ON public.funcionarios_detalhes
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "fn_det_delete_auth" ON public.funcionarios_detalhes;
CREATE POLICY "fn_det_delete_auth" ON public.funcionarios_detalhes
  FOR DELETE TO authenticated USING (true);

-- RLS policies for funcionarios_financeiro
DROP POLICY IF EXISTS "fn_fin_select_auth" ON public.funcionarios_financeiro;
CREATE POLICY "fn_fin_select_auth" ON public.funcionarios_financeiro
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "fn_fin_insert_auth" ON public.funcionarios_financeiro;
CREATE POLICY "fn_fin_insert_auth" ON public.funcionarios_financeiro
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "fn_fin_update_auth" ON public.funcionarios_financeiro;
CREATE POLICY "fn_fin_update_auth" ON public.funcionarios_financeiro
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "fn_fin_delete_auth" ON public.funcionarios_financeiro;
CREATE POLICY "fn_fin_delete_auth" ON public.funcionarios_financeiro
  FOR DELETE TO authenticated USING (true);

-- RLS policies for funcionarios_beneficios_empresas
DROP POLICY IF EXISTS "fn_ben_select_auth" ON public.funcionarios_beneficios_empresas;
CREATE POLICY "fn_ben_select_auth" ON public.funcionarios_beneficios_empresas
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "fn_ben_insert_auth" ON public.funcionarios_beneficios_empresas;
CREATE POLICY "fn_ben_insert_auth" ON public.funcionarios_beneficios_empresas
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "fn_ben_update_auth" ON public.funcionarios_beneficios_empresas;
CREATE POLICY "fn_ben_update_auth" ON public.funcionarios_beneficios_empresas
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "fn_ben_delete_auth" ON public.funcionarios_beneficios_empresas;
CREATE POLICY "fn_ben_delete_auth" ON public.funcionarios_beneficios_empresas
  FOR DELETE TO authenticated USING (true);

-- Ensure pedro@lucenera.com.br exists in auth.users
DO $$
DECLARE
  pedro_id uuid;
BEGIN
  SELECT id INTO pedro_id FROM auth.users WHERE email = 'pedro@lucenera.com.br' LIMIT 1;

  IF pedro_id IS NULL THEN
    pedro_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      pedro_id,
      '00000000-0000-0000-0000-000000000000',
      'pedro@lucenera.com.br',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Pedro"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  END IF;

  -- Ensure usuario record
  INSERT INTO public.usuarios (id, email, nome, role)
  VALUES (pedro_id, 'pedro@lucenera.com.br', 'Pedro', 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin', nome = 'Pedro';
END $$;

-- Seed sample employees if funcionarios_novo is empty
DO $$
DECLARE
  emp_count integer;
  emp1_id uuid;
  emp2_id uuid;
  emp3_id uuid;
  emp4_id uuid;
BEGIN
  SELECT count(*) INTO emp_count FROM public.funcionarios_novo;

  IF emp_count = 0 THEN
    -- Employee 1
    emp1_id := gen_random_uuid();
    INSERT INTO public.funcionarios_novo (id, nome, cargo, data_admissao, ativo)
    VALUES (emp1_id, 'Mariane Costa', 'Gerente de RH', '2023-01-15', true);
    INSERT INTO public.funcionarios_detalhes (funcionario_id, cpf, rg, data_nascimento, endereco, telefone, email)
    VALUES (emp1_id, '123.456.789-00', '12.345.678-9', '1990-05-20', 'Rua das Flores, 123 - Centro, Ribeirão Preto - SP, CEP 14000-000', '(16) 99999-1111', 'mariane@lucenera.com.br');
    INSERT INTO public.funcionarios_financeiro (funcionario_id, salario_base, salario_por_fora, comissao_percentual, salario_liquido)
    VALUES (emp1_id, 8500.00, 0, 0, 6927.50);
    INSERT INTO public.funcionarios_beneficios_empresas (funcionario_id, empresa, valor_vt_dia)
    VALUES (emp1_id, 'Islight', 12.00);

    -- Employee 2
    emp2_id := gen_random_uuid();
    INSERT INTO public.funcionarios_novo (id, nome, cargo, data_admissao, ativo)
    VALUES (emp2_id, 'Vinicius Santos', 'Desenvolvedor Full Stack', '2022-08-01', true);
    INSERT INTO public.funcionarios_detalhes (funcionario_id, cpf, rg, data_nascimento, endereco, telefone, email)
    VALUES (emp2_id, '987.654.321-00', '98.765.432-1', '1995-11-10', 'Av. Paulista, 1000 - São Paulo - SP, CEP 01310-100', '(11) 98888-2222', 'vinicius@lucenera.com.br');
    INSERT INTO public.funcionarios_financeiro (funcionario_id, salario_base, salario_por_fora, comissao_percentual, salario_liquido)
    VALUES (emp2_id, 12000.00, 2000.00, 5.0, 10270.00);
    INSERT INTO public.funcionarios_beneficios_empresas (funcionario_id, empresa, valor_vt_dia)
    VALUES (emp2_id, 'Islight', 15.50);

    -- Employee 3 (with missing detail data to test "Não informado")
    emp3_id := gen_random_uuid();
    INSERT INTO public.funcionarios_novo (id, nome, cargo, data_admissao, ativo)
    VALUES (emp3_id, 'Tricia Almeida', 'Analista Financeiro', '2024-03-10', true);
    INSERT INTO public.funcionarios_detalhes (funcionario_id, cpf, telefone, email)
    VALUES (emp3_id, '456.789.123-00', '(16) 97777-3333', 'tricia@lucenera.com.br');
    INSERT INTO public.funcionarios_financeiro (funcionario_id, salario_base, salario_por_fora, comissao_percentual, salario_liquido)
    VALUES (emp3_id, 0, 3500.00, 3.5, 0);
    INSERT INTO public.funcionarios_beneficios_empresas (funcionario_id, empresa, valor_vt_dia)
    VALUES (emp3_id, 'Manoela', 8.00);

    -- Employee 4 (with zero salary to test fallback logic)
    emp4_id := gen_random_uuid();
    INSERT INTO public.funcionarios_novo (id, nome, cargo, data_admissao, ativo)
    VALUES (emp4_id, 'Giovana Gonella', 'Consultora de Vendas', '2023-09-20', true);
    INSERT INTO public.funcionarios_detalhes (funcionario_id, cpf, rg, data_nascimento, endereco, telefone, email)
    VALUES (emp4_id, '321.654.987-00', '32.165.498-7', '1992-03-25', 'Rua dos Pinheiros, 456 - Jardim Paulista, Ribeirão Preto - SP', '(16) 96666-4444', 'giovana@lucenera.com.br');
    INSERT INTO public.funcionarios_financeiro (funcionario_id, salario_base, salario_por_fora, comissao_percentual, salario_liquido)
    VALUES (emp4_id, 0, 0, 8.0, 0);
    INSERT INTO public.funcionarios_beneficios_empresas (funcionario_id, empresa, valor_vt_dia)
    VALUES (emp4_id, 'Foco', 10.00);
  END IF;
END $$;
