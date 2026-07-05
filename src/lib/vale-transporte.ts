import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const FALTAS_INTEGRAIS_STATUS = [
  'ausente',
  'falta_injustificada',
  'atestado',
  'licenca_maternidade',
  'licenca_paternidade',
  'licenca_obito',
  'licenca_casamento',
  'licenca_militar',
  'licenca_medica',
]

export interface FuncionarioVT {
  id: string
  nome: string
  empresa: string | null
  cpf: string | null
  valor_vt_dia: number | null
}

export interface CalculoVT {
  funcionario: FuncionarioVT
  diasUteis: number
  diasFaltados: number
  diasEfetivos: number
  valorDiario: number
  valorTotal: number
}

export function calcularDiasUteis(
  year: number,
  month: number,
  feriados: { date: string }[],
): number {
  const start = startOfMonth(new Date(year, month))
  const end = endOfMonth(new Date(year, month))
  const feriadosMes = feriados
    .filter((f) => {
      const d = parseISO(f.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
    .map((f) => format(parseISO(f.date), 'yyyy-MM-dd'))
  return eachDayOfInterval({ start, end }).filter(
    (d) => !isWeekend(d) && !feriadosMes.includes(format(d, 'yyyy-MM-dd')),
  ).length
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function buildCalculos(
  funcs: FuncionarioVT[],
  faltas: any[],
  diasUteis: number,
): CalculoVT[] {
  return funcs.map((func) => {
    const funcFaltas = faltas?.filter((f) => f.funcionario_id === func.id) || []
    const diasFaltados = funcFaltas.filter(
      (f) => f.status && FALTAS_INTEGRAIS_STATUS.includes(f.status),
    ).length
    const diasEfetivos = Math.max(0, diasUteis - diasFaltados)
    const valorDiario = func.valor_vt_dia || 0
    return {
      funcionario: func,
      diasUteis,
      diasFaltados,
      diasEfetivos,
      valorDiario,
      valorTotal: diasEfetivos * valorDiario,
    }
  })
}

export function exportarRecibosWord(calculos: CalculoVT[], empresa: string, mes: string): void {
  if (!calculos.length) return
  const mesFmt = format(new Date(mes + '-01T12:00:00'), 'MMMM/yyyy', { locale: ptBR })
  const receipts = calculos
    .map(
      (c, i) => `
    <div${i < calculos.length - 1 ? " class='page-break'" : ''}>
      <div style="text-align:center;font-size:16pt;font-weight:bold;margin-bottom:20px">RECIBO DE VALE TRANSPORTE</div>
      <p style="text-align:justify;margin-bottom:20px">Recebi da empresa <strong>${c.funcionario.empresa || 'Lucenera'}</strong>, a importância de <strong>${formatBRL(c.valorTotal)}</strong>, referente ao benefício de Vale Transporte do mês de <strong>${mesFmt}</strong>.</p>
      <p>Dias Úteis: ${c.diasUteis}</p><p>Faltas Integrais Descontadas: ${c.diasFaltados}</p>
      <p>Valor Líquido a Receber: ${formatBRL(c.valorTotal)}</p>
      <p style="margin:20px 0">Por ser verdade, firmo o presente recibo.</p>
      <div style="margin-top:50px;text-align:center"><div style="width:300px;border-top:1px solid #000;margin:0 auto 10px"></div>
      <p>${c.funcionario.nome}</p><p>CPF: ${c.funcionario.cpf || 'Não informado'}</p><p>Data: ${format(new Date(), 'dd/MM/yyyy')}</p></div>
    </div>`,
    )
    .join('')
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>body{font-family:Arial,sans-serif;font-size:12pt;line-height:1.5;color:#000}.page-break{page-break-after:always}</style></head><body>${receipts}</body></html>`
  const link = document.createElement('a')
  link.href = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)
  link.download = `Recibos_VT_${empresa.replace(/\s+/g, '_')}_${mes}.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function gerarRelatoriosIndividuais(
  calculos: CalculoVT[],
  empresa: string,
  mes: string,
): boolean {
  if (!calculos.length) return false
  const mesFmt = format(new Date(mes + '-01T12:00:00'), 'MMMM/yyyy', { locale: ptBR })
  const hoje = format(new Date(), 'dd/MM/yyyy')
  const pages = calculos
    .map(
      (c, i) => `
    <div class="page${i < calculos.length - 1 ? ' page-break' : ''}">
      <div class="hdr"><h1>Relatório Individual de Vale Transporte</h1><h2>${empresa}</h2></div>
      <div class="info"><p><strong>Funcionário:</strong> ${c.funcionario.nome}</p>
      <p><strong>CPF:</strong> ${c.funcionario.cpf || 'Não informado'}</p>
      <p><strong>Mês de Referência:</strong> ${mesFmt}</p></div>
      <table class="bd">
        <tr><th>Dias Úteis</th><td>${c.diasUteis}</td></tr>
        <tr><th>Total de Faltas</th><td>${c.diasFaltados}</td></tr>
        <tr><th>Dias Efetivos</th><td>${c.diasEfetivos}</td></tr>
        <tr><th>Valor Diário</th><td>${formatBRL(c.valorDiario)}</td></tr>
        <tr class="total"><th>Valor Total Mensal</th><td>${formatBRL(c.valorTotal)}</td></tr>
      </table>
      <div class="sig"><div class="line"></div><p>${c.funcionario.nome}</p><p>${hoje}</p></div>
    </div>`,
    )
    .join('')
  const css = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a1a;padding:20px}.no-print{text-align:center;margin-bottom:20px}.no-print button{padding:10px 30px;font-size:14px;cursor:pointer;background:#2563eb;color:#fff;border:none;border-radius:6px}.page{max-width:700px;margin:0 auto;padding:40px}.page-break{page-break-after:always}.hdr{text-align:center;border-bottom:2px solid #2563eb;padding-bottom:20px;margin-bottom:30px}.hdr h1{font-size:18pt}.hdr h2{font-size:13pt;color:#555;font-weight:400;margin-top:5px}.info{background:#f8fafc;padding:20px;border-radius:8px;margin-bottom:30px}.info p{font-size:11pt;line-height:2}.bd{width:100%;border-collapse:collapse;margin-bottom:30px}.bd th,.bd td{padding:12px 16px;border:1px solid #e2e8f0;font-size:11pt}.bd th{background:#f1f5f9;width:60%;text-align:left}.bd .total th{background:#2563eb;color:#fff;font-size:13pt}.bd .total td{background:#eff6ff;font-size:13pt;font-weight:700;color:#2563eb}.sig{margin-top:60px;text-align:center}.sig .line{width:300px;border-top:1px solid #1a1a1a;margin:0 auto 10px}.sig p{font-size:10pt;color:#555;line-height:1.8}@media print{.no-print{display:none}body{padding:0}}`
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatórios Individuais - Vale Transporte</title><style>${css}</style></head><body><div class="no-print"><button onclick="window.print()">Imprimir / Salvar PDF</button></div>${pages}</body></html>`
  const w = window.open('', '_blank')
  if (!w) return false
  w.document.write(html)
  w.document.close()
  return true
}
