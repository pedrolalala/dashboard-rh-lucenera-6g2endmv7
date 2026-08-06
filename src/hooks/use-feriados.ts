import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface Feriado {
  date: string
  name: string
  type: string
  id?: string
  origem: 'nacional' | 'manual'
  observacao?: string | null
}

export function useFeriados(year: number) {
  const [feriados, setFeriados] = useState<Feriado[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFeriados = useCallback(async () => {
    if (!year || isNaN(year)) return
    setLoading(true)
    try {
      const [apiRes, manuaisRes] = await Promise.all([
        fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`)
          .then((res) => (res.ok ? res.json() : []))
          .catch(() => []),
        supabase
          .from('feriados')
          .select('id, data, descricao, tipo, observacao')
          .eq('ativo', true)
          .gte('data', `${year}-01-01`)
          .lte('data', `${year}-12-31`),
      ])

      const nacionais: Feriado[] = (apiRes || []).map((f: any) => ({
        date: f.date,
        name: f.name,
        type: f.type,
        origem: 'nacional' as const,
      }))

      const manuais: Feriado[] = (manuaisRes.data || []).map((f: any) => ({
        date: f.data,
        name: f.descricao,
        type: f.tipo,
        id: f.id,
        observacao: f.observacao,
        origem: 'manual' as const,
      }))

      setFeriados([...nacionais, ...manuais])
    } catch (e) {
      console.error('Erro ao buscar feriados:', e)
      setFeriados([])
    } finally {
      setLoading(false)
    }
  }, [year])

  useEffect(() => {
    fetchFeriados()
  }, [fetchFeriados])

  return { feriados, loading, refetch: fetchFeriados }
}
