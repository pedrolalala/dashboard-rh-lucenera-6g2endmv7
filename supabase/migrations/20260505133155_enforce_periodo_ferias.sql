DO $DO$
BEGIN
  -- Remover registros de férias órfãos (sem período)
  DELETE FROM public.ferias WHERE periodo_aquisitivo_id IS NULL;
  
  -- Adicionar constraint para garantir que periodo_aquisitivo_id seja obrigatório
  ALTER TABLE public.ferias ALTER COLUMN periodo_aquisitivo_id SET NOT NULL;
END $DO$;
