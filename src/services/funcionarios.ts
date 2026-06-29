import { supabase } from '@/lib/supabase/client'

export interface EmployeeComplete {
  id: string
  nome: string
  cargo: string | null
  ativo: boolean
  data_admissao: string | null
  cpf: string | null
  rg: string | null
  data_nascimento: string | null
  endereco: string | null
  telefone: string | null
  email: string | null
  salario_base: number
  salario_por_fora: number
  comissao_percentual: number
  salario_liquido: number
  empresa: string | null
  valor_vt_dia: number
}

function normalizeEmployee(d: any): EmployeeComplete {
  return {
    id: d.id,
    nome: d.nome || '',
    cargo: d.cargo || null,
    ativo: d.ativo ?? true,
    data_admissao: d.data_admissao || null,
    cpf: d.cpf || null,
    rg: d.rg || null,
    data_nascimento: d.data_nascimento || null,
    endereco: d.endereco || null,
    telefone: d.telefone || null,
    email: d.email || null,
    salario_base: Number(d.salario_base) || 0,
    salario_por_fora: Number(d.salario_por_fora) || 0,
    comissao_percentual: Number(d.comissao_percentual) || 0,
    salario_liquido: Number(d.salario_liquido) || 0,
    empresa: d.empresa || null,
    valor_vt_dia: Number(d.valor_vt_dia) || 0,
  }
}

export async function fetchEmployees(): Promise<EmployeeComplete[]> {
  const { data, error } = await supabase
    .from('vw_funcionarios_completo')
    .select('*')
    .order('nome', { ascending: true })

  if (error) throw error
  return (data || []).map(normalizeEmployee)
}

async function upsertDetail(
  table: string,
  funcionarioId: string,
  payload: Record<string, any>,
): Promise<void> {
  const { data: existing } = await supabase
    .from(table)
    .select('id')
    .eq('funcionario_id', funcionarioId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase.from(table).update(payload).eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from(table)
      .insert({ ...payload, funcionario_id: funcionarioId })
    if (error) throw error
  }
}

export async function createEmployee(data: any): Promise<void> {
  const { data: novo, error: errNovo } = await supabase
    .from('funcionarios_novo')
    .insert({
      nome: data.nome,
      cargo: data.cargo || null,
      data_admissao: data.data_admissao || null,
      ativo: data.ativo,
    })
    .select('id')
    .single()

  if (errNovo) throw errNovo
  const id = novo.id

  await upsertDetail('funcionarios_detalhes', id, {
    cpf: data.cpf || null,
    rg: data.rg || null,
    data_nascimento: data.data_nascimento || null,
    endereco: data.endereco || null,
    telefone: data.telefone || null,
    email: data.email || null,
  })

  await upsertDetail('funcionarios_financeiro', id, {
    salario_base: Number(data.salario_base) || 0,
    salario_por_fora: Number(data.salario_por_fora) || 0,
    comissao_percentual: Number(data.comissao_percentual) || 0,
    salario_liquido: Number(data.salario_liquido) || 0,
  })

  await upsertDetail('funcionarios_beneficios_empresas', id, {
    empresa: data.empresa || null,
    valor_vt_dia: Number(data.valor_vt_dia) || 0,
  })
}

export async function updateEmployee(id: string, data: any): Promise<void> {
  const { error: errNovo } = await supabase
    .from('funcionarios_novo')
    .update({
      nome: data.nome,
      cargo: data.cargo || null,
      data_admissao: data.data_admissao || null,
      ativo: data.ativo,
    })
    .eq('id', id)

  if (errNovo) throw errNovo

  await upsertDetail('funcionarios_detalhes', id, {
    cpf: data.cpf || null,
    rg: data.rg || null,
    data_nascimento: data.data_nascimento || null,
    endereco: data.endereco || null,
    telefone: data.telefone || null,
    email: data.email || null,
  })

  await upsertDetail('funcionarios_financeiro', id, {
    salario_base: Number(data.salario_base) || 0,
    salario_por_fora: Number(data.salario_por_fora) || 0,
    comissao_percentual: Number(data.comissao_percentual) || 0,
    salario_liquido: Number(data.salario_liquido) || 0,
  })

  await upsertDetail('funcionarios_beneficios_empresas', id, {
    empresa: data.empresa || null,
    valor_vt_dia: Number(data.valor_vt_dia) || 0,
  })
}

export async function deleteEmployee(id: string): Promise<void> {
  await supabase.from('funcionarios_beneficios_empresas').delete().eq('funcionario_id', id)
  await supabase.from('funcionarios_financeiro').delete().eq('funcionario_id', id)
  await supabase.from('funcionarios_detalhes').delete().eq('funcionario_id', id)
  const { error } = await supabase.from('funcionarios_novo').delete().eq('id', id)
  if (error) throw error
}
