import { supabase } from '@/lib/supabase/client'

export interface Empresa {
  id: string
  codigo: number
  nome: string
  razao_social: string | null
  cnpj: string | null
  cidade: string | null
  estado: string | null
  ativo: boolean
  created_at: string
  updated_at: string
  inscricao_estadual: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cep: string | null
  cor_hex: string | null
  regime_tributario: string | null
}

export async function fetchEmpresas(): Promise<Empresa[]> {
  const { data, error } = await supabase
    .from('empresas')
    .select(
      'id, codigo, nome, razao_social, cnpj, cidade, estado, ativo, created_at, updated_at, inscricao_estadual, logradouro, numero, complemento, bairro, cep, cor_hex, regime_tributario',
    )
    .eq('ativo', true)
    .order('codigo', { ascending: true })

  if (error) throw error
  return (data || []) as Empresa[]
}
