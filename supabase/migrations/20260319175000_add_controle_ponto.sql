CREATE TABLE controle_ponto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funcionario_id UUID NOT NULL REFERENCES funcionarios_rh(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora_entrada TIME,
  hora_saida TIME,
  total_horas NUMERIC,
  status TEXT CHECK (status IN ('presente', 'ausente', 'atraso')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE controle_ponto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ponto_select_admin" ON controle_ponto
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role IN ('admin', 'gerente')));

CREATE POLICY "ponto_all_admin" ON controle_ponto
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role IN ('admin', 'gerente')));

CREATE POLICY "ponto_select_own" ON controle_ponto
  FOR SELECT TO authenticated
  USING (funcionario_id IN (SELECT id FROM funcionarios_rh WHERE user_id = auth.uid()));

-- Insert seed data safely
DO $$
DECLARE
  f1 uuid;
  f2 uuid;
BEGIN
  SELECT id INTO f1 FROM funcionarios_rh ORDER BY created_at ASC LIMIT 1;
  SELECT id INTO f2 FROM funcionarios_rh ORDER BY created_at ASC LIMIT 1 OFFSET 1;

  IF f1 IS NOT NULL THEN
    INSERT INTO controle_ponto (funcionario_id, data, hora_entrada, hora_saida, total_horas, status)
    VALUES
      (f1, CURRENT_DATE, '09:00:00', '18:00:00', 8.0, 'presente'),
      (f1, CURRENT_DATE - INTERVAL '1 day', '09:15:00', '18:00:00', 7.75, 'atraso'),
      (f1, CURRENT_DATE - INTERVAL '2 day', NULL, NULL, 0, 'ausente');
  END IF;

  IF f2 IS NOT NULL THEN
    INSERT INTO controle_ponto (funcionario_id, data, hora_entrada, hora_saida, total_horas, status)
    VALUES
      (f2, CURRENT_DATE, '08:50:00', '18:10:00', 8.33, 'presente'),
      (f2, CURRENT_DATE - INTERVAL '1 day', '09:00:00', '18:00:00', 8.0, 'presente');
  END IF;
END $$;
