DROP VIEW IF EXISTS public.vw_controle_ferias_clt;

CREATE VIEW public.vw_controle_ferias_clt AS
WITH faltas_agg AS (
    SELECT pa.id AS periodo_id, COUNT(cf.id) AS total_faltas
    FROM public.periodos_aquisitivos pa
    LEFT JOIN public.controle_falta cf 
        ON cf.funcionario_id = pa.funcionario_id 
        AND cf.data >= pa.data_inicio 
        AND cf.data <= pa.data_fim
        AND cf.status = 'ausente' 
        AND (cf.justificativa IS NULL OR cf.justificativa = '')
    GROUP BY pa.id
),
gozados_agg AS (
    SELECT periodo_aquisitivo_id AS periodo_id, COALESCE(SUM(dias), 0) AS total_gozados
    FROM public.ferias
    WHERE status IN ('Aprovado', 'Pendente')
    GROUP BY periodo_aquisitivo_id
)
SELECT 
    pa.id AS periodo_id,
    pa.funcionario_id,
    f.nome AS funcionario_nome,
    pa.data_inicio,
    pa.data_fim,
    pa.data_limite_gozo,
    COALESCE(fa.total_faltas, 0)::integer AS total_faltas,
    (CASE 
        WHEN COALESCE(fa.total_faltas, 0) <= 5 THEN 30
        WHEN COALESCE(fa.total_faltas, 0) <= 14 THEN 24
        WHEN COALESCE(fa.total_faltas, 0) <= 23 THEN 18
        WHEN COALESCE(fa.total_faltas, 0) <= 32 THEN 12
        ELSE 0
    END)::integer AS dias_direito,
    COALESCE(ga.total_gozados, 0)::integer AS dias_gozados,
    ((CASE 
        WHEN COALESCE(fa.total_faltas, 0) <= 5 THEN 30
        WHEN COALESCE(fa.total_faltas, 0) <= 14 THEN 24
        WHEN COALESCE(fa.total_faltas, 0) <= 23 THEN 18
        WHEN COALESCE(fa.total_faltas, 0) <= 32 THEN 12
        ELSE 0
    END) - COALESCE(ga.total_gozados, 0))::integer AS saldo_disponivel
FROM public.periodos_aquisitivos pa
JOIN public.funcionarios f ON f.id = pa.funcionario_id
LEFT JOIN faltas_agg fa ON fa.periodo_id = pa.id
LEFT JOIN gozados_agg ga ON ga.periodo_id = pa.id;
