ALTER TABLE public.folha_pagamento ADD COLUMN IF NOT EXISTS comissao numeric NOT NULL DEFAULT 0;
