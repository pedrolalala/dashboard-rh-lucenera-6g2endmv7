DO $$
BEGIN
  ALTER TABLE public.controle_ponto DROP CONSTRAINT IF EXISTS controle_ponto_status_check;
  
  ALTER TABLE public.controle_ponto ADD CONSTRAINT controle_ponto_status_check CHECK (status = ANY (ARRAY[
    'presente'::text, 
    'ausente'::text, 
    'atraso'::text, 
    'meio_periodo'::text, 
    'atestado'::text, 
    'licenca_maternidade'::text, 
    'falta_injustificada'::text,
    'licenca_paternidade'::text,
    'licenca_obito'::text,
    'licenca_casamento'::text,
    'licenca_militar'::text,
    'licenca_medica'::text
  ]));
END $$;
