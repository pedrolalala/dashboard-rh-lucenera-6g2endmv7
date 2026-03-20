ALTER TABLE public.controle_ponto ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE;
ALTER TABLE public.controle_ponto ADD COLUMN IF NOT EXISTS edit_history JSONB DEFAULT '[]'::jsonb;
