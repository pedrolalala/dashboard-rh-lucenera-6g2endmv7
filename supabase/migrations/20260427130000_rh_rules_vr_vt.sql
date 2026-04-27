DO $$
BEGIN
  ALTER TABLE public.controle_ponto DROP CONSTRAINT IF EXISTS controle_ponto_status_check;
  ALTER TABLE public.controle_ponto ADD CONSTRAINT controle_ponto_status_check CHECK (status = ANY (ARRAY['presente'::text, 'ausente'::text, 'atraso'::text, 'meio_periodo'::text, 'atestado'::text, 'licenca_maternidade'::text, 'falta_injustificada'::text]));
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS valor_vr numeric DEFAULT 0;
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS valor_vt numeric DEFAULT 0;

ALTER TABLE public.folha_pagamento ADD COLUMN IF NOT EXISTS dias_trabalhados integer DEFAULT 0;
ALTER TABLE public.folha_pagamento ADD COLUMN IF NOT EXISTS dias_abonados integer DEFAULT 0;
ALTER TABLE public.folha_pagamento ADD COLUMN IF NOT EXISTS dias_falta integer DEFAULT 0;
ALTER TABLE public.folha_pagamento ADD COLUMN IF NOT EXISTS valor_vr_vt numeric DEFAULT 0;
