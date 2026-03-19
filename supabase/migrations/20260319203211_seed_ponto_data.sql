-- Populate sample data for testing the 'Controle de Ponto' features
DO $$
DECLARE
  dept_id_1 uuid;
  dept_id_2 uuid;
  emp_id_1 uuid;
  emp_id_2 uuid;
  emp_id_3 uuid;
BEGIN
  -- Insert mock departments
  INSERT INTO departamentos_rh (nome)
  VALUES ('Engenharia'), ('Operações')
  ON CONFLICT (nome) DO NOTHING;

  SELECT id INTO dept_id_1 FROM departamentos_rh WHERE nome = 'Engenharia' LIMIT 1;
  SELECT id INTO dept_id_2 FROM departamentos_rh WHERE nome = 'Operações' LIMIT 1;

  -- Insert mock employees
  IF NOT EXISTS (SELECT 1 FROM funcionarios_rh WHERE email = 'marcos.silva@lucenera.com') THEN
    INSERT INTO funcionarios_rh (nome, email, departamento_id, status) 
    VALUES ('Marcos Silva', 'marcos.silva@lucenera.com', dept_id_1, 'Ativo')
    RETURNING id INTO emp_id_1;
  ELSE
    SELECT id INTO emp_id_1 FROM funcionarios_rh WHERE email = 'marcos.silva@lucenera.com' LIMIT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM funcionarios_rh WHERE email = 'julia.costa@lucenera.com') THEN
    INSERT INTO funcionarios_rh (nome, email, departamento_id, status) 
    VALUES ('Julia Costa', 'julia.costa@lucenera.com', dept_id_1, 'Ativo')
    RETURNING id INTO emp_id_2;
  ELSE
    SELECT id INTO emp_id_2 FROM funcionarios_rh WHERE email = 'julia.costa@lucenera.com' LIMIT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM funcionarios_rh WHERE email = 'roberto.alves@lucenera.com') THEN
    INSERT INTO funcionarios_rh (nome, email, departamento_id, status) 
    VALUES ('Roberto Alves', 'roberto.alves@lucenera.com', dept_id_2, 'Ativo')
    RETURNING id INTO emp_id_3;
  ELSE
    SELECT id INTO emp_id_3 FROM funcionarios_rh WHERE email = 'roberto.alves@lucenera.com' LIMIT 1;
  END IF;

  -- Insert mock attendance records (only if they don't exist to prevent duplicates on rerun)
  -- For emp 1 (Presente, Atraso)
  IF NOT EXISTS (SELECT 1 FROM controle_ponto WHERE funcionario_id = emp_id_1 AND data = CURRENT_DATE) THEN
    INSERT INTO controle_ponto (funcionario_id, data, hora_entrada, hora_saida, total_horas, status)
    VALUES (emp_id_1, CURRENT_DATE, '08:50:00', '18:00:00', 8.16, 'presente');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM controle_ponto WHERE funcionario_id = emp_id_1 AND data = CURRENT_DATE - INTERVAL '1 day') THEN
    INSERT INTO controle_ponto (funcionario_id, data, hora_entrada, hora_saida, total_horas, status)
    VALUES (emp_id_1, CURRENT_DATE - INTERVAL '1 day', '09:20:00', '18:15:00', 7.91, 'atraso');
  END IF;

  -- For emp 2 (Ausente)
  IF NOT EXISTS (SELECT 1 FROM controle_ponto WHERE funcionario_id = emp_id_2 AND data = CURRENT_DATE) THEN
    INSERT INTO controle_ponto (funcionario_id, data, hora_entrada, hora_saida, total_horas, status)
    VALUES (emp_id_2, CURRENT_DATE, NULL, NULL, 0, 'ausente');
  END IF;

  -- For emp 3 (Presente today)
  IF NOT EXISTS (SELECT 1 FROM controle_ponto WHERE funcionario_id = emp_id_3 AND data = CURRENT_DATE) THEN
    INSERT INTO controle_ponto (funcionario_id, data, hora_entrada, hora_saida, total_horas, status)
    VALUES (emp_id_3, CURRENT_DATE, '08:58:00', '17:55:00', 7.95, 'presente');
  END IF;

END $$;
