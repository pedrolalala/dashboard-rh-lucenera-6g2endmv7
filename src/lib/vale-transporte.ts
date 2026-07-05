import { createZipBlob } from './zip-utils'

export interface EmpresaVT {
  id: string
  nome: string
  razao_social: string | null
  cnpj: string | null
}

export interface FuncionarioVT {
  id: string
  nome: string
  empresa_nome: string | null
  valor_vt_dia: number
}

export interface CalculoVT {
  funcionario: FuncionarioVT
  empresa: EmpresaVT | null
  diasUteis: number
  diasFaltados: number
  feriadosCount: number
  valorDiario: number
  valorTotal: number
}

export interface CalculoError {
  funcionario_id: string
  funcionario_nome: string
  erro: string
}

const SP_HOLIDAYS: Array<{ month: number; day: number }> = [{ month: 6, day: 9 }]

function getHolidayKeys(year: number, month: number, feriados: any[]): Set<string> {
  const keys = new Set(
    feriados.map((f: any) => {
      const d = new Date(f.date + 'T00:00:00')
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    }),
  )
  SP_HOLIDAYS.forEach((h) => keys.add(`${year}-${h.month}-${h.day}`))
  return keys
}

export function calcularDiasUteis(year: number, month: number, feriados: any[]): number {
  const holidayKeys = getHolidayKeys(year, month, feriados)
  let count = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = new Date(year, month, day).getDay()
    if (dow === 0 || dow === 6) continue
    if (!holidayKeys.has(`${year}-${month}-${day}`)) count++
  }
  return count
}

export function countFeriadosInMonth(year: number, month: number, feriados: any[]): number {
  const holidayKeys = getHolidayKeys(year, month, feriados)
  let count = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = new Date(year, month, day).getDay()
    if (dow === 0 || dow === 6) continue
    if (holidayKeys.has(`${year}-${month}-${day}`)) count++
  }
  return count
}

export function buildCalculos(
  funcionarios: FuncionarioVT[],
  faltas: any[],
  diasUteis: number,
  feriadosCount: number,
  empresas: EmpresaVT[],
): { calculos: CalculoVT[]; errors: CalculoError[] } {
  const faltasMap = new Map<string, number>()
  for (const f of faltas) {
    const id = f.funcionario_id as string
    faltasMap.set(id, (faltasMap.get(id) || 0) + 1)
  }
  const calculos: CalculoVT[] = []
  const errors: CalculoError[] = []
  for (const func of funcionarios) {
    if (!func.valor_vt_dia || func.valor_vt_dia <= 0) {
      errors.push({
        funcionario_id: func.id,
        funcionario_nome: func.nome,
        erro: 'Sem registro na tabela de benefícios ou valor_vt_dia zerado',
      })
      continue
    }
    const empresa = func.empresa_nome
      ? empresas.find((e) => e.nome === func.empresa_nome) || null
      : null
    const diasFaltados = faltasMap.get(func.id) || 0
    const diasLiquidos = Math.max(0, diasUteis - feriadosCount - diasFaltados)
    calculos.push({
      funcionario: func,
      empresa,
      diasUteis,
      diasFaltados,
      feriadosCount,
      valorDiario: func.valor_vt_dia,
      valorTotal: diasLiquidos * func.valor_vt_dia,
    })
  }
  return { calculos, errors }
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function docxRow(label: string, value: string): string {
  return `<w:tr><w:tc><w:tcPr><w:tcW w:w="3500" w:type="dxa"/></w:tcPr><w:p><w:r><w:t xml:space="preserve">${esc(label)}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="1500" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="right"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">${esc(value)}</w:t></w:r></w:p></w:tc></w:tr>`
}

function createDocxBlob(c: CalculoVT, mesLabel: string): Blob {
  const enc = new TextEncoder()
  const emp = c.empresa
  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t xml:space="preserve">RECIBO DE VALE TRANSPORTE</w:t></w:r></w:p><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t xml:space="preserve">Mês: ${esc(mesLabel)}</w:t></w:r></w:p><w:p/><w:p><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">Empresa: </w:t></w:r><w:r><w:t xml:space="preserve">${esc(emp?.razao_social || emp?.nome || 'N/A')}</w:t></w:r></w:p><w:p><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">CNPJ: </w:t></w:r><w:r><w:t xml:space="preserve">${esc(emp?.cnpj || 'N/A')}</w:t></w:r></w:p><w:p/><w:p><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">Funcionário: </w:t></w:r><w:r><w:t xml:space="preserve">${esc(c.funcionario.nome)}</w:t></w:r></w:p><w:p/><w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/></w:tblPr><w:tblGrid><w:gridCol w:w="3500"/><w:gridCol w:w="1500"/></w:tblGrid>${docxRow('Dias Úteis', String(c.diasUteis))}${docxRow('Feriados', String(c.feriadosCount))}${docxRow('Faltas', String(c.diasFaltados))}${docxRow('Dias Líquidos', String(c.diasUteis - c.feriadosCount - c.diasFaltados))}${docxRow('Valor Diário', formatBRL(c.valorDiario))}${docxRow('Valor Total', formatBRL(c.valorTotal))}</w:tbl><w:p/><w:p/><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t xml:space="preserve">_________________________________________</w:t></w:r></w:p><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t xml:space="preserve">${esc(c.funcionario.nome)}</w:t></w:r></w:p><w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`
  const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`
  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`
  return createZipBlob([
    { name: '[Content_Types].xml', data: enc.encode(ct) },
    { name: '_rels/.rels', data: enc.encode(rels) },
    { name: 'word/document.xml', data: enc.encode(doc) },
    { name: 'word/_rels/document.xml.rels', data: enc.encode(docRels) },
  ])
}

export async function gerarZipRecibos(calculos: CalculoVT[], mesLabel: string): Promise<Blob> {
  const safeMesLabel = mesLabel.replace(/\//g, '-')
  const folder = `Vale transporte do mes ${safeMesLabel}`
  const files: Array<{ name: string; data: Uint8Array }> = []
  for (const c of calculos) {
    const blob = createDocxBlob(c, mesLabel)
    const data = new Uint8Array(await blob.arrayBuffer())
    const safeName = c.funcionario.nome.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || c.funcionario.id
    files.push({ name: `${folder}/${safeName}.docx`, data })
  }
  return createZipBlob(files)
}
