import { supabase } from '@/lib/supabase/client'

export interface ComissaoData {
  funcionario: string
  equipe: string
  comissao_percentual: number
  mes: string
  total_projetos: number
  valor_total_projetos: number
  comissao_calculada: number
}

export async function fetchComissaoMensal(mes: number, ano: number): Promise<ComissaoData[]> {
  const startDate = `${ano}-${String(mes).padStart(2, '0')}-01`
  const { data, error } = await supabase.from('vw_comissao_mensal').select('*').eq('mes', startDate)

  if (error) throw error

  return (data as ComissaoData[]) ?? []
}

export function exportComissaoCSV(data: ComissaoData[], mes: number, ano: number): void {
  const monthLabel = new Date(ano, mes - 1, 1).toLocaleString('pt-BR', { month: 'long' })
  const header = [
    'Responsavel',
    'Equipe',
    'Comissao (%)',
    'Projetos',
    'Valor Total',
    'Comissao Calculada',
  ]
  const rows = data.map((d) => [
    d.funcionario,
    d.equipe,
    `${d.comissao_percentual}%`,
    d.total_projetos,
    d.valor_total_projetos.toFixed(2),
    d.comissao_calculada.toFixed(2),
  ])
  const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comissao-${monthLabel}-${ano}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
