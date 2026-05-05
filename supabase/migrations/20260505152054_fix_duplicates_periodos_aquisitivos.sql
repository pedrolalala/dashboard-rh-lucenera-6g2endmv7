DO $$
DECLARE
  dup RECORD;
BEGIN
  -- Identifica registros duplicados e consolida mantendo apenas o de menor ID
  FOR dup IN (
    SELECT funcionario_id, data_inicio, data_fim, MIN(id::text)::uuid as keep_id
    FROM public.periodos_aquisitivos
    GROUP BY funcionario_id, data_inicio, data_fim
    HAVING COUNT(*) > 1
  ) LOOP
    -- Atualiza as referências nas férias para apontar para o ID que será mantido
    UPDATE public.ferias
    SET periodo_aquisitivo_id = dup.keep_id
    WHERE periodo_aquisitivo_id IN (
      SELECT id FROM public.periodos_aquisitivos
      WHERE funcionario_id = dup.funcionario_id
        AND data_inicio = dup.data_inicio
        AND data_fim = dup.data_fim
        AND id != dup.keep_id
    );

    -- Deleta os períodos duplicados restantes
    DELETE FROM public.periodos_aquisitivos
    WHERE funcionario_id = dup.funcionario_id
      AND data_inicio = dup.data_inicio
      AND data_fim = dup.data_fim
      AND id != dup.keep_id;
  END LOOP;
END $$;
