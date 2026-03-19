-- Create folha_pagamento table
CREATE TABLE folha_pagamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funcionario_id UUID NOT NULL REFERENCES funcionarios_rh(id) ON DELETE CASCADE,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL,
  salario_base NUMERIC NOT NULL,
  descontos NUMERIC NOT NULL,
  adicionais NUMERIC NOT NULL,
  salario_liquido NUMERIC NOT NULL,
  data_geracao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE folha_pagamento ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "folha_all_admin_gerente" ON folha_pagamento 
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role IN ('admin', 'gerente'))
  );

CREATE POLICY "folha_select_own" ON folha_pagamento 
  FOR SELECT TO authenticated USING (
    funcionario_id IN (SELECT id FROM funcionarios_rh WHERE user_id = auth.uid())
  );
