// SPEC-324: le os .xlsx da contabilidade (Folha de Pagto e Totais da Folha) no navegador.
// Localiza tudo pelos ROTULOS (nunca por celula fixa) e recusa layout desconhecido.
// O servidor revalida (folha_importar_conferir): nada aqui e confiado.

export type RubricaFolha = {
  cod: string
  desc: string
  tipo: 'provento' | 'desconto' | 'base'
  ref: number | null
  valor: number
}

export type HoleriteLido = {
  matricula: string
  nome: string
  cpf: string | null
  cargo: string | null
  admissao: string | null
  demissao: string | null
  vencimentos: number
  descontos: number
  liquido: number
  liquido_arquivo: number | null // 09900 lido do proprio holerite (conferencia local)
  rubricas: RubricaFolha[]
}

export type TotaisLidos = {
  liquido: number
  vencimentos: number
  descontos: number
  ativos: number
  gps: number
  fgts: number
  irrf: number
  assistencial: number
  consignado: number
}

export type ArquivoLido = {
  nome: string
  hash: string
  tipo: 'folha' | 'totais'
  cnpj: string
  codigoEmpresa: string
  nomeEmpresa: string
  ano: number
  mes: number
  holerites: HoleriteLido[]
  totais: TotaisLidos | null
}

type Cel = { col: number; txt: string; num: number | null }

const semAcento = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()

function paraNumero(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const t = v.trim()
    if (!t || !/^-?[\d.,]+$/.test(t)) return null
    const n = t.includes(',') ? Number(t.replace(/\./g, '').replace(',', '.')) : Number(t)
    return Number.isFinite(n) ? n : null
  }
  return null
}

const r2 = (n: number) => Math.round(n * 100) / 100

function dataBr(s: string): string | null {
  const m = s.match(/(\d{2})\/(\d{2})\/(\d{4})/)
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null
}

async function sha256(buf: ArrayBuffer): Promise<string> {
  const h = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(h))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function lerArquivoFolha(file: File): Promise<ArquivoLido> {
  if (!/\.xlsx$/i.test(file.name)) {
    throw new Error('Envie o arquivo .xlsx exportado pela contabilidade (o formato .xls antigo nao e aceito).')
  }
  const buf = await file.arrayBuffer()
  const hash = await sha256(buf)
  // Leitor proprio (JSZip + XML): o exportador da contabilidade grava "worksheets/Sheet1.xml" com S maiusculo,
  // e bibliotecas de Excel que procuram "sheet1.xml" devolvem a planilha vazia. Aqui o caminho vem do workbook.xml.rels.
  const JSZip = (await import('jszip')).default
  const zip = await JSZip.loadAsync(buf)
  const lerZip = async (nome: string): Promise<string | null> => {
    const alvo = Object.keys(zip.files).find((k) => k.toLowerCase() === nome.toLowerCase())
    return alvo ? zip.files[alvo].async('string') : null
  }
  const wbXml = await lerZip('xl/workbook.xml')
  const relsXml = await lerZip('xl/_rels/workbook.xml.rels')
  if (!wbXml || !relsXml) throw new Error('Arquivo nao parece um .xlsx valido.')
  const rid = wbXml.match(/<sheet\b[^>]*\br:id="([^"]+)"/)?.[1]
  const alvoRel = rid
    ? relsXml.match(new RegExp('<Relationship [^>]*Id="' + rid + '"[^>]*>'))?.[0].match(/Target="([^"]+)"/)?.[1]
    : undefined
  if (!alvoRel) throw new Error('Planilha vazia.')
  const sheetXml = await lerZip('xl/' + alvoRel.replace(/^\/?(xl\/)?/, ''))
  if (!sheetXml) throw new Error('Planilha vazia.')
  const decode = (s: string) =>
    s.replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_m, n) => String.fromCharCode(parseInt(n, 16))).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
  const ssXml = await lerZip('xl/sharedStrings.xml')
  const compartilhadas: string[] = []
  if (ssXml) {
    for (const m of ssXml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)) {
      compartilhadas.push(decode(Array.from(m[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)).map((x) => x[1]).join('')))
    }
  }
  const colNum = (ref: string) => {
    let n = 0
    for (const ch of ref.replace(/\d+/g, '')) n = n * 26 + (ch.charCodeAt(0) - 64)
    return n
  }
  const linhas: Cel[][] = []
  for (const rm of sheetXml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const cels: Cel[] = []
    for (const cm of rm[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const at = cm[1]
      const corpo = cm[2]
      if (!corpo) continue
      const ref = at.match(/\br="([A-Z]+\d+)"/)?.[1]
      if (!ref) continue
      const t = at.match(/\bt="(\w+)"/)?.[1] ?? 'n'
      const v = corpo.match(/<v>([\s\S]*?)<\/v>/)?.[1]
      let txt = ''
      let num: number | null = null
      if (t === 's' && v !== undefined) txt = compartilhadas[Number(v)] ?? ''
      else if (t === 'inlineStr') txt = decode(Array.from(corpo.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)).map((x) => x[1]).join(''))
      else if (t === 'str' && v !== undefined) txt = decode(v)
      else if (v !== undefined && Number.isFinite(Number(v))) { num = Number(v); txt = String(num) }
      txt = txt.trim()
      if (t === 's' || t === 'str' || t === 'inlineStr') num = paraNumero(txt)
      if (txt !== '' || num !== null) cels.push({ col: colNum(ref), txt, num })
    }
    cels.sort((a, b) => a.col - b.col)
    if (cels.length) linhas.push(cels)
  }

  const topo = linhas.slice(0, 12).flat()
  const titulo = semAcento(topo.map((c) => c.txt).join(' | '))
  let tipo: 'folha' | 'totais'
  if (titulo.includes('TOTAIS DA FOLHA DE PAGAMENTO')) tipo = 'totais'
  else if (titulo.includes('FOLHA DE PAGAMENTO')) tipo = 'folha'
  else throw new Error('Layout desconhecido: nao encontrei o titulo "FOLHA DE PAGAMENTO".')

  const cab = topo.find((c) => /^\d{4}-/.test(c.txt))
  const cnpjTxt = topo.map((c) => c.txt).find((t) => /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/.test(t))
  const comp = topo.map((c) => c.txt).find((t) => /^\d{2}\/\d{4}$/.test(t))
  if (!cab || !cnpjTxt || !comp) throw new Error('Layout desconhecido: nao achei empresa, CNPJ ou competencia no cabecalho.')
  const cnpj = cnpjTxt.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)![0]
  const [mm, aa] = comp.split('/')
  const base = {
    nome: file.name,
    hash,
    tipo,
    cnpj,
    codigoEmpresa: cab.txt.slice(0, 4),
    nomeEmpresa: cab.txt.slice(5).trim(),
    ano: Number(aa),
    mes: Number(mm),
  }

  // ---- rubricas de uma linha: cada rotulo "NNNNN DESCRICAO" pega os numeros ate o proximo rotulo
  const ehRotulo = (t: string) => /^\d{4,5}\s+\S/.test(t)
  type Lido = { cod: string; desc: string; col: number; ref: number | null; valor: number | null }
  function rubricasDaLinha(cels: Cel[]): Lido[] {
    const out: Lido[] = []
    for (let i = 0; i < cels.length; i++) {
      const c = cels[i]
      if (!ehRotulo(c.txt) || c.num !== null) continue
      const m = c.txt.match(/^(\d{4,5})\s*-?\s*(.*)$/)!
      const nums: number[] = []
      for (let j = i + 1; j < cels.length && !(ehRotulo(cels[j].txt) && cels[j].num === null); j++) {
        if (cels[j].num !== null) nums.push(cels[j].num as number)
      }
      out.push({
        cod: m[1].padStart(5, '0'),
        desc: m[2].trim(),
        col: c.col,
        ref: nums.length > 1 ? nums[0] : null,
        valor: nums.length ? nums[nums.length - 1] : null,
      })
    }
    return out
  }
  // colunas iniciais dos 3 blocos (linha de cabecalho com 3 x "DESCRICAO")
  function blocosDoCabecalho(cels: Cel[]): number[] | null {
    const d = cels.filter((c) => semAcento(c.txt) === 'DESCRICAO')
    return d.length >= 3 ? d.slice(0, 3).map((c) => c.col) : null
  }
  const grupo = (col: number, blocos: number[]): 'provento' | 'desconto' | 'base' =>
    col >= blocos[2] ? 'base' : col >= blocos[1] ? 'desconto' : 'provento'

  // ================= TOTAIS =================
  if (tipo === 'totais') {
    let blocos: number[] | null = null
    const t: TotaisLidos = { liquido: 0, vencimentos: 0, descontos: 0, ativos: 0, gps: 0, fgts: 0, irrf: 0, assistencial: 0, consignado: 0 }
    let achouLiquido = false
    let achouGps = false
    for (const cels of linhas) {
      blocos = blocosDoCabecalho(cels) ?? blocos
      const linhaTxt = semAcento(cels.map((c) => c.txt).join(' '))
      const at = linhaTxt.match(/ATIVOS:\s*(\d+)/)
      if (at && !t.ativos) t.ativos = Number(at[1])
      if (linhaTxt.includes('VALOR A RECOLHER GPS')) {
        const n = cels.find((c) => c.num !== null)
        if (n) {
          t.gps = r2(n.num as number)
          achouGps = true
        }
      }
      for (const r of rubricasDaLinha(cels)) {
        if (r.valor === null) continue
        const d = semAcento(r.desc)
        if (r.cod === '09900' || /^TOTAL LIQUIDO/.test(d)) { t.liquido = r2(r.valor); achouLiquido = true; continue }
        if (r.cod === '09880') { t.vencimentos = r2(r.valor); continue }
        if (r.cod === '09890') { t.descontos = r2(r.valor); continue }
        const g = blocos ? grupo(r.col, blocos) : 'desconto'
        if (r.cod === '09930') t.fgts = r2(r.valor)
        else if (g === 'desconto' && r.cod === '09870') t.irrf = r2(r.valor)
        else if (g === 'desconto' && r.cod === '05841') t.assistencial = r2(r.valor)
        else if (g === 'desconto' && /EMPREST|CONSIGN/.test(d)) t.consignado = r2(t.consignado + r.valor)
      }
    }
    if (!achouLiquido) throw new Error('Layout desconhecido: "TOTAL LIQUIDO" nao encontrado no arquivo de Totais.')
    if (!achouGps) throw new Error('Layout desconhecido: "VALOR A RECOLHER GPS" nao encontrado no arquivo de Totais.')
    return { ...base, holerites: [], totais: t }
  }

  // ================= FOLHA (um holerite por funcionario) =================
  const porMat = new Map<string, HoleriteLido>()
  let atual: HoleriteLido | null = null
  let blocos: number[] | null = null
  const totaisHol = new Map<string, number>()
  for (const cels of linhas) {
    blocos = blocosDoCabecalho(cels) ?? blocos
    const a = cels[0]
    if (a.col === 1 && /^\d{6}$/.test(a.txt)) {
      const nomeCel = cels.find((c) => c.col === 2)
      const get = (rot: string) => {
        const i = cels.findIndex((c) => semAcento(c.txt).startsWith(rot))
        return i >= 0 && cels[i + 1] ? cels[i + 1].txt : ''
      }
      const cargoCel = cels.find((c) => c.col >= 7 && c.col <= 9 && c.txt && c.num === null)
      let h = porMat.get(a.txt)
      if (!h) {
        h = {
          matricula: a.txt,
          nome: nomeCel?.txt ?? '',
          cpf: null,
          cargo: cargoCel?.txt ?? null,
          admissao: dataBr(get('ADM:')),
          demissao: dataBr(get('DEM:')),
          vencimentos: 0,
          descontos: 0,
          liquido: 0,
          liquido_arquivo: null,
          rubricas: [],
        }
        porMat.set(a.txt, h)
      }
      atual = h
      continue
    }
    if (!atual) continue
    const cpf = cels.map((c) => c.txt).join(' ').match(/CPF:\s*(\d{3}\.?\d{3}\.?\d{3}-?\d{2})/)
    if (cpf) { atual.cpf = cpf[1].replace(/\D/g, ''); continue }
    if (!blocos) continue
    for (const r of rubricasDaLinha(cels)) {
      if (r.valor === null) continue
      if (r.cod === '09900') { atual.liquido_arquivo = r2((atual.liquido_arquivo ?? 0) + r.valor); totaisHol.set(atual.matricula, r.valor); continue }
      if (r.cod === '09880' || r.cod === '09890') continue
      atual.rubricas.push({ cod: r.cod, desc: r.desc, tipo: grupo(r.col, blocos), ref: r.ref, valor: r2(r.valor) })
    }
  }
  if (!porMat.size) throw new Error('Nenhum holerite encontrado no arquivo (matricula de 6 digitos na coluna A).')
  const holerites = Array.from(porMat.values()).map((h) => {
    const v = h.rubricas.filter((r) => r.tipo === 'provento').reduce((s, r) => s + r.valor, 0)
    const d = h.rubricas.filter((r) => r.tipo === 'desconto').reduce((s, r) => s + r.valor, 0)
    return { ...h, vencimentos: r2(v), descontos: r2(d), liquido: r2(v - d) }
  })
  for (const h of holerites) {
    if (h.liquido_arquivo !== null && Math.abs(h.liquido - h.liquido_arquivo) > 0.02) {
      throw new Error(`Holerite da matricula ${h.matricula} nao fecha com o "VALOR LIQUIDO" do arquivo (${h.liquido} x ${h.liquido_arquivo}).`)
    }
  }
  return { ...base, holerites, totais: null }
}

// ------------------------------------------------------------ vencimentos sugeridos (editaveis na tela)
function diaUtilN(ano: number, mes0: number, n: number): Date {
  const d = new Date(ano, mes0, 1)
  let c = 0
  while (true) {
    const w = d.getDay()
    if (w !== 0 && w !== 6) c++
    if (c === n) return d
    d.setDate(d.getDate() + 1)
  }
}
function diaUtilAnterior(d: Date): Date {
  const x = new Date(d)
  while (x.getDay() === 0 || x.getDay() === 6) x.setDate(x.getDate() - 1)
  return x
}
export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Salario: 5o dia util do mes seguinte; guias: dia 20 do mes seguinte (antecipa para o dia util anterior). Sao so SUGESTAO. */
export function vencimentosSugeridos(ano: number, mes: number) {
  const prox = mes === 12 ? { a: ano + 1, m0: 0 } : { a: ano, m0: mes }
  const guia = iso(diaUtilAnterior(new Date(prox.a, prox.m0, 20)))
  return {
    salario: iso(diaUtilN(prox.a, prox.m0, 5)),
    gps_inss: guia,
    fgts: guia,
    irrf: guia,
    sindicato: guia,
    consignado: guia,
  }
}
