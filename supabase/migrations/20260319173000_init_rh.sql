-- Alter usuarios to support new roles
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_role_check;
ALTER TABLE usuarios ADD CONSTRAINT usuarios_role_check CHECK (role = ANY (ARRAY['admin', 'viewer', 'gerente', 'funcionario']));

-- Create Departamentos
CREATE TABLE departamentos_rh (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE
);

-- Create Funcionarios
CREATE TABLE funcionarios_rh (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  cpf TEXT,
  data_admissao TIMESTAMPTZ,
  departamento_id UUID REFERENCES departamentos_rh(id),
  cargo TEXT,
  salario_base NUMERIC,
  status TEXT DEFAULT 'Ativo',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Ferias
CREATE TABLE ferias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funcionario_id UUID REFERENCES funcionarios_rh(id) ON DELETE CASCADE,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  dias INTEGER NOT NULL,
  status TEXT DEFAULT 'Pendente',
  data_solicitacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fix RLS for existing tables
ALTER TABLE entregas_finalizadas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_all_entregas_finalizadas" ON entregas_finalizadas FOR ALL TO authenticated USING (true);

ALTER TABLE entregas_pendentes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_all_entregas_pendentes" ON entregas_pendentes FOR ALL TO authenticated USING (true);

ALTER TABLE separacao_arquivos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_all_separacao_arquivos" ON separacao_arquivos FOR ALL TO authenticated USING (true);

ALTER TABLE separacao_itens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_all_separacao_itens" ON separacao_itens FOR ALL TO authenticated USING (true);

ALTER TABLE separacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_all_separacoes" ON separacoes FOR ALL TO authenticated USING (true);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_all_user_roles" ON user_roles FOR ALL TO authenticated USING (true);

-- Add RLS to new tables
ALTER TABLE departamentos_rh ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios_rh ENABLE ROW LEVEL SECURITY;
ALTER TABLE ferias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dept_select" ON departamentos_rh FOR SELECT TO authenticated USING (true);
CREATE POLICY "dept_all_admin" ON departamentos_rh FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role IN ('admin', 'gerente'))
);

CREATE POLICY "func_select" ON funcionarios_rh FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role IN ('admin', 'gerente')) OR
  user_id = auth.uid()
);
CREATE POLICY "func_all_admin" ON funcionarios_rh FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role IN ('admin', 'gerente'))
);

CREATE POLICY "ferias_select" ON ferias FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role IN ('admin', 'gerente')) OR
  funcionario_id IN (SELECT id FROM funcionarios_rh WHERE user_id = auth.uid())
);
CREATE POLICY "ferias_insert" ON ferias FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role IN ('admin', 'gerente')) OR
  funcionario_id IN (SELECT id FROM funcionarios_rh WHERE user_id = auth.uid())
);
CREATE POLICY "ferias_update" ON ferias FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role IN ('admin', 'gerente')) OR
  funcionario_id IN (SELECT id FROM funcionarios_rh WHERE user_id = auth.uid())
);
CREATE POLICY "ferias_delete" ON ferias FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role IN ('admin', 'gerente'))
);

-- Seed Data
INSERT INTO departamentos_rh (nome) VALUES ('TI'), ('Vendas'), ('RH'), ('Operações'), ('Financeiro');

DO $$
DECLARE
  admin_id uuid;
  gerente_id uuid;
  func_id uuid;
  dept_rh_id uuid;
  dept_ti_id uuid;
  dept_op_id uuid;
BEGIN
  -- Admin
  admin_id := gen_random_uuid();
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    admin_id, '00000000-0000-0000-0000-000000000000', 'admin@lucenera.com',
    crypt('Admin123!', gen_salt('bf')), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}', '{"name": "Admin Gestor"}',
    false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
  );
  INSERT INTO usuarios (id, email, nome, role) VALUES (admin_id, 'admin@lucenera.com', 'Admin Gestor', 'admin') ON CONFLICT (id) DO UPDATE SET role = 'admin';

  -- Gerente
  gerente_id := gen_random_uuid();
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    gerente_id, '00000000-0000-0000-0000-000000000000', 'gerente@lucenera.com',
    crypt('Gerente123!', gen_salt('bf')), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}', '{"name": "Gerente Silva"}',
    false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
  );
  INSERT INTO usuarios (id, email, nome, role) VALUES (gerente_id, 'gerente@lucenera.com', 'Gerente Silva', 'gerente') ON CONFLICT (id) DO UPDATE SET role = 'gerente';

  -- Funcionario
  func_id := gen_random_uuid();
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    func_id, '00000000-0000-0000-0000-000000000000', 'func@lucenera.com',
    crypt('Func123!', gen_salt('bf')), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}', '{"name": "João Funcionario"}',
    false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
  );
  INSERT INTO usuarios (id, email, nome, role) VALUES (func_id, 'func@lucenera.com', 'João Funcionario', 'funcionario') ON CONFLICT (id) DO UPDATE SET role = 'funcionario';

  -- Associate with Funcionarios
  SELECT id INTO dept_rh_id FROM departamentos_rh WHERE nome = 'RH' LIMIT 1;
  SELECT id INTO dept_ti_id FROM departamentos_rh WHERE nome = 'TI' LIMIT 1;
  SELECT id INTO dept_op_id FROM departamentos_rh WHERE nome = 'Operações' LIMIT 1;

  INSERT INTO funcionarios_rh (nome, email, telefone, cpf, data_admissao, departamento_id, cargo, salario_base, status, user_id)
  VALUES 
    ('Admin Gestor', 'admin@lucenera.com', '11999999999', '00000000000', NOW(), dept_rh_id, 'Diretor RH', 25000, 'Ativo', admin_id),
    ('Gerente Silva', 'gerente@lucenera.com', '11988888888', '11111111111', NOW(), dept_ti_id, 'Gerente TI', 18000, 'Ativo', gerente_id),
    ('João Funcionario', 'func@lucenera.com', '11977777777', '22222222222', NOW(), dept_op_id, 'Analista Op', 5000, 'Ativo', func_id);

END $$;
