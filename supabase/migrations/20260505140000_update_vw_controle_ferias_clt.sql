CREATE OR REPLACE VIEW public.vw_controle_ferias_clt AS
WITH faltas_agrupadas AS (
  SELECT 
    cf.funcionario_id,
    pa.id AS periodo_id,
    COUNT(cf.id)::integer AS total_faltas
  FROM public.controle_falta cf
  JOIN public.periodos_aquisitivos pa 
    ON pa.funcionario_id = cf.funcionario_id 
    AND cf.data >= pa.data_inicio 
    AND cf.data <= pa.data_fim
  WHERE cf.status = 'ausente' AND (cf.justificativa IS NULL OR cf.justificativa = '')
  GROUP BY cf.funcionario_id, pa.id
),
dias_gozados_agrupados AS (
  SELECT 
    f.funcionario_id,
    f.periodo_aquisitivo_id AS periodo_id,
    SUM(f.dias)::integer AS dias_gozados
  FROM public.ferias f
  WHERE f.status IN ('Pendente', 'Aprovado')
  GROUP BY f.funcionario_id, f.periodo_aquisitivo_id
)
SELECT 
  pa.id AS periodo_id,
  pa.funcionario_id,
  func.nome AS funcionario_nome,
  pa.data_inicio,
  pa.data_fim,
  pa.data_limite_gozo,
  COALESCE(fa.total_faltas, 0) AS total_faltas,
  CASE
    WHEN COALESCE(fa.total_faltas, 0) <= 5 THEN 30
    WHEN COALESCE(fa.total_faltas, 0) <= 14 THEN 24
    WHEN COALESCE(fa.total_faltas, 0) <= 23 THEN 18
    WHEN COALESCE(fa.total_faltas, 0) <= 32 THEN 12
    ELSE 0
  END AS dias_direito,
  COALESCE(dg.dias_gozados, 0) AS dias_gozados,
  (CASE
    WHEN COALESCE(fa.total_faltas, 0) <= 5 THEN 30
    WHEN COALESCE(fa.total_faltas, 0) <= 14 THEN 24
    WHEN COALESCE(fa.total_faltas, 0) <= 23 THEN 18
    WHEN COALESCE(fa.total_faltas, 0) <= 32 THEN 12
    ELSE 0
  END) - COALESCE(dg.dias_gozados, 0) AS saldo_disponivel
FROM public.periodos_aquisitivos pa
JOIN public.funcionarios func ON pa.funcionario_id = func.id
LEFT JOIN faltas_agrupadas fa ON fa.periodo_id = pa.id
LEFT JOIN dias_gozados_agrupados dg ON dg.periodo_id = pa.id
WHERE pa.status = 'Ativo' OR pa.status = 'Vencido';
