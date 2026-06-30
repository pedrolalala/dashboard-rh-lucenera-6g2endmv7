-- Create vw_comissao_mensal view for commission tracking
DROP VIEW IF EXISTS public.vw_comissao_mensal;

CREATE OR REPLACE VIEW public.vw_comissao_mensal AS
SELECT
  ep.equipes AS funcionario,
  ep.equipes AS equipe,
  3::numeric AS comissao_percentual,
  DATE_TRUNC('month', pf.data_fechamento)::date AS mes,
  COUNT(*)::integer AS total_projetos,
  COALESCE(SUM(pf.valor_fechado), 0)::numeric AS valor_total_projetos,
  (COALESCE(SUM(pf.valor_fechado), 0) * 0.03)::numeric AS comissao_calculada
FROM public.projetos_fechados pf
JOIN public.projetos p ON p.codigo = pf.cod
JOIN public.equipes_projetos ep ON p.equipe_id = ep.id
WHERE pf.data_fechamento IS NOT NULL
GROUP BY ep.equipes, DATE_TRUNC('month', pf.data_fechamento);

-- Grant access
GRANT SELECT ON public.vw_comissao_mensal TO authenticated;

-- Seed equipes if not exist
INSERT INTO public.equipes_projetos (id, equipes)
SELECT gen_random_uuid(), t.equipe
FROM (VALUES ('Thais'), ('Marina'), ('Thairine')) AS t(equipe)
WHERE NOT EXISTS (
  SELECT 1 FROM public.equipes_projetos WHERE equipes = t.equipe
);

-- Seed sample projetos_fechados data for 2026-06 if not present
DO $$
DECLARE
  thais_id uuid;
  marina_id uuid;
  thairine_id uuid;
  i integer;
BEGIN
  SELECT id INTO thais_id FROM public.equipes_projetos WHERE equipes = 'Thais' LIMIT 1;
  SELECT id INTO marina_id FROM public.equipes_projetos WHERE equipes = 'Marina' LIMIT 1;
  SELECT id INTO thairine_id FROM public.equipes_projetos WHERE equipes = 'Thairine' LIMIT 1;

  IF thais_id IS NOT NULL AND marina_id IS NOT NULL AND thairine_id IS NOT NULL THEN
    -- Insert sample projetos with codes if they don't exist
    FOR i IN 1..28 LOOP
      IF NOT EXISTS (SELECT 1 FROM public.projetos WHERE codigo = 'COM-' || i::text) THEN
        INSERT INTO public.projetos (codigo, nome, equipe_id, status, data_entrada, valor_total)
        VALUES (
          'COM-' || i::text,
          'Projeto Comissão ' || i::text,
          CASE WHEN i <= 12 THEN thais_id WHEN i <= 21 THEN marina_id ELSE thairine_id END,
          'Estudo Inicial',
          CURRENT_DATE,
          CASE WHEN i <= 12 THEN 20000 WHEN i <= 21 THEN 20000 ELSE 20000 END
        );
      END IF;
    END LOOP;

    -- Insert sample projetos_fechados for June 2026
    IF NOT EXISTS (
      SELECT 1 FROM public.projetos_fechados
      WHERE data_fechamento = '2026-06-15'::date AND cod = 'COM-1'
    ) THEN
      -- Thais: 12 projects, 240000 total
      FOR i IN 1..12 LOOP
        INSERT INTO public.projetos_fechados (cod, valor_fechado, data_fechamento)
        VALUES ('COM-' || i::text, 20000, '2026-06-15'::date);
      END LOOP;
      -- Marina: 9 projects, 180000 total
      FOR i IN 13..21 LOOP
        INSERT INTO public.projetos_fechados (cod, valor_fechado, data_fechamento)
        VALUES ('COM-' || i::text, 20000, '2026-06-15'::date);
      END LOOP;
      -- Thairine: 7 projects, 140000 total
      FOR i IN 22..28 LOOP
        INSERT INTO public.projetos_fechados (cod, valor_fechado, data_fechamento)
        VALUES ('COM-' || i::text, 20000, '2026-06-15'::date);
      END LOOP;
    END IF;
  END IF;
END $$;
