import { supabase } from '@/lib/supabase/client'

export interface Empresa {
  id: string
  nome: string
  razao_social: string | null
  cnpj: string | null
  codigo: number
}

export async function fetchEmpresas(): Promise<Empresa[]> {
  const { data, error } = await supabase
    .from('empresas')
    .select('id, nome, razao_social, cnpj, codigo')
    .order('nome', { ascending: true })

  if (error) throw error
  return (data || []) as Empresa[]
}
