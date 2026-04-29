DO $$
BEGIN
  ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS endereco_completo TEXT;
END $$;
