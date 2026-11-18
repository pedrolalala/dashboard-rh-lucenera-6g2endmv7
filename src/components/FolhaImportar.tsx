// SPEC-324: importar a Folha da contabilidade (.xlsx) e gerar o Contas a Pagar.
// Fluxo: enviar arquivos -> conferir (servidor revalida) -> resolver pendencias -> vencimentos -> gerar. Historico com cancelamento.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FileSpreadsheet, Loader2, Upload, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { lerArquivoFolha, vencimentosSugeridos, type ArquivoLido } from '@/lib/folha-xlsx'

const db = supabase as any
const brl = (v: number | null | undefined) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0))
const mesNome = (m: number) => new Date(2000, m - 1, 1).toLocaleString('pt-BR', { month: 'long' })

const ROTULO_GUIA: Record<string, string> = {
  gps_inss: 'GPS (INSS)',
  fgts: 'FGTS',
  irrf: 'IRRF (DARF)',
  sindicato: 'Contribuição assistencial (sindicato)',
  consignado: 'Consignado (repasse ao banco)',
}

type Empresa = { id: string; nome: string; cnpj: string }
type Func = { id: string; nome: string }
type Grupo = { chave: string; cnpj: string; ano: number; mes: number; folha?: ArquivoLido; totais?: ArquivoLido }
type Estado = {
  busy?: boolean
  perfil: string
  venc: Record<string, string>
  salarioPagoEm: string
  importacaoId?: string
  conf?: any
  detalhe?: any
  resultado?: any
  erro?: string
}

export default function FolhaImportar({ onGerou }: { onGerou?: () => void }) {
  const { toast } = useToast()
  const [arquivos, setArquivos] = useState<ArquivoLido[]>([])
  const [erros, setErros] = useState<string[]>([])
  const [lendo, setLendo] = useState(false)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [funcs, setFuncs] = useState<Func[]>([])
  const [estado, setEstado] = useState<Record<string, Estado>>({})
  const [historico, setHistorico] = useState<any[]>([])
  const [motivoCancel, setMotivoCancel] = useState<Record<string, string>>({})
  const [motivoExcl, setMotivoExcl] = useState<Record<string, string>>({})

  useEffect(() => {
    db.from('empresas').select('id, nome, cnpj').then(({ data }: any) => setEmpresas(data || []))
    db.from('funcionarios')
      .select('id, nome')
      .eq('status', 'Ativo')
      .order('nome')
      .then(({ data }: any) => setFuncs(data || []))
  }, [])

  const carregarHistorico = useCallback(async () => {
    const { data, error } = await db.rpc('folha_importar_listar', { p_limite: 60 })
    if (!error) setHistorico(data || [])
  }, [])
  useEffect(() => {
    carregarHistorico()
  }, [carregarHistorico])

  const grupos: Grupo[] = useMemo(() => {
    const m = new Map<string, Grupo>()
    for (const a of arquivos) {
      const chave = `${a.cnpj}|${a.ano}-${a.mes}`
      const g = m.get(chave) || { chave, cnpj: a.cnpj, ano: a.ano, mes: a.mes }
      if (a.tipo === 'folha') g.folha = a
      else g.totais = a
      m.set(chave, g)
    }
    return Array.from(m.values())
  }, [arquivos])

  const empresaDe = (cnpj: string) => empresas.find((e) => e.cnpj === cnpj)
  const st = (g: Grupo): Estado =>
    estado[g.chave] || { perfil: 'ribeirao', venc: vencimentosSugeridos(g.ano, g.mes), salarioPagoEm: '' }
  const setSt = (chave: string, patch: Partial<Estado>, g?: Grupo) =>
    setEstado((prev) => {
      const base = prev[chave] || { perfil: 'ribeirao', venc: vencimentosSugeridos(g?.ano || 2000, g?.mes || 1), salarioPagoEm: '' }
      return { ...prev, [chave]: { ...base, ...patch } }
    })

  async function aoEscolher(files: FileList | null) {
    if (!files?.length) return
    setLendo(true)
    const novos: ArquivoLido[] = []
    const msgs: string[] = []
    for (const f of Array.from(files)) {
      try {
        novos.push(await lerArquivoFolha(f))
      } catch (e: any) {
        msgs.push(`${f.name}: ${e.message}`)
      }
    }
    setErros(msgs)
    setArquivos((prev) => {
      const sem = prev.filter((p) => !novos.some((n) => n.hash === p.hash))
      return [...sem, ...novos]
    })
    setLendo(false)
  }

  async function detalhar(g: Grupo, id: string) {
    const { data, error } = await db.rpc('folha_importar_detalhe', { p_importacao: id })
    if (error) throw error
    setSt(g.chave, { detalhe: data }, g)
  }

  async function conferir(g: Grupo) {
    const emp = empresaDe(g.cnpj)
    if (!emp) return toast({ title: 'Empresa não cadastrada', description: `CNPJ ${g.cnpj} não existe em Empresas.`, variant: 'destructive' })
    if (!g.totais?.totais) return toast({ title: 'Falta o arquivo de Totais desta empresa/mês.', variant: 'destructive' })
    const s = st(g)
    setSt(g.chave, { busy: true, erro: undefined, resultado: undefined }, g)
    try {
      const payload = {
        empresa_id: emp.id,
        codigo_empresa: g.totais.codigoEmpresa,
        ano: g.ano,
        mes: g.mes,
        perfil: s.perfil,
        arquivos: [g.folha, g.totais].filter(Boolean).map((a) => ({ nome: a!.nome, hash: a!.hash })),
        totais: g.totais.totais,
        holerites: (g.folha?.holerites || []).map((h) => ({
          matricula: h.matricula,
          nome: h.nome,
          cpf: h.cpf,
          cargo: h.cargo,
          admissao: h.admissao,
          demissao: h.demissao,
          vencimentos: h.vencimentos,
          descontos: h.descontos,
          liquido: h.liquido,
          rubricas: h.rubricas,
        })),
      }
      const { data, error } = await db.rpc('folha_importar_conferir', { p_importacao: payload })
      if (error) throw error
      setSt(g.chave, { importacaoId: data.importacao_id, conf: data }, g)
      await detalhar(g, data.importacao_id)
    } catch (e: any) {
      setSt(g.chave, { erro: e.message }, g)
    } finally {
      setSt(g.chave, { busy: false }, g)
    }
  }

  async function vincular(g: Grupo, holeriteId: string, funcId: string) {
    const { error } = await db.rpc('folha_importar_vincular', { p_holerite: holeriteId, p_funcionario: funcId })
    if (error) return toast({ title: 'Erro ao vincular', description: error.message, variant: 'destructive' })
    await detalhar(g, st(g).importacaoId!)
  }
  async function excluir(g: Grupo, holeriteId: string) {
    const motivo = motivoExcl[holeriteId] || ''
    const { error } = await db.rpc('folha_importar_excluir_holerite', { p_holerite: holeriteId, p_motivo: motivo })
    if (error) return toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    await detalhar(g, st(g).importacaoId!)
  }

  async function gerar(g: Grupo) {
    const s = st(g)
    setSt(g.chave, { busy: true, erro: undefined }, g)
    try {
      const temExcluidos = (s.detalhe?.holerites || []).some((h: any) => h.situacao === 'excluido')
      const { data, error } = await db.rpc('folha_importar_gerar_titulos', {
        p_importacao: s.importacaoId,
        p_venc: { ...s.venc, aceita_excluidos: temExcluidos },
        p_salario_pago_em: s.salarioPagoEm || null,
      })
      if (error) throw error
      setSt(g.chave, { resultado: data }, g)
      toast({ title: 'Contas a Pagar gerado', description: `${data.titulos_salario} salários + ${data.titulos_guias} guias.` })
      await detalhar(g, s.importacaoId!)
      carregarHistorico()
      onGerou?.()
    } catch (e: any) {
      setSt(g.chave, { erro: e.message }, g)
    } finally {
      setSt(g.chave, { busy: false }, g)
    }
  }

  async function cancelar(id: string) {
    const motivo = motivoCancel[id] || ''
    const { error } = await db.rpc('folha_importar_cancelar', { p_importacao: id, p_motivo: motivo })
    if (error) return toast({ title: 'Não foi possível cancelar', description: error.message, variant: 'destructive' })
    toast({ title: 'Importação cancelada e títulos cancelados.' })
    carregarHistorico()
    onGerou?.()
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-none border-border">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" /> Importar folha da contabilidade
          </CardTitle>
          <CardDescription>
            Arraste de uma vez os arquivos .xlsx do mês: “Folha de Pagto” (holerites) e “Totais da Folha” de cada empresa. O
            sistema descobre a empresa e o mês sozinho e confere os holerites com os totais da contabilidade antes de gerar.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer border border-dashed border-border rounded-md p-4 hover:bg-muted/20">
            {lendo ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            <span className="text-sm">Escolher arquivos .xlsx</span>
            <input
              type="file"
              accept=".xlsx"
              multiple
              className="hidden"
              onChange={(e) => {
                aoEscolher(e.target.files)
                e.target.value = ''
              }}
            />
          </label>
          {erros.map((m) => (
            <p key={m} className="text-sm text-red-500 flex gap-2"><XCircle className="h-4 w-4 shrink-0 mt-0.5" />{m}</p>
          ))}
        </CardContent>
      </Card>

      {grupos.map((g) => {
        const emp = empresaDe(g.cnpj)
        const s = st(g)
        const conf = s.conf
        const det = s.detalhe
        const gerada = det?.importacao?.situacao === 'gerada'
        const pend = (det?.holerites || []).filter((h: any) => h.situacao === 'pendente_cadastro')
        const guiasPrev: any[] = det?.guias_previstas || []
        return (
          <Card key={g.chave} className="shadow-none border-border">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-sm uppercase tracking-widest flex flex-wrap items-center gap-2">
                {emp?.nome || g.totais?.nomeEmpresa || g.folha?.nomeEmpresa || g.cnpj} · <span className="capitalize">{mesNome(g.mes)}/{g.ano}</span>
                {gerada && <Badge className="bg-emerald-600">Gerada</Badge>}
              </CardTitle>
              <CardDescription className="space-y-1">
                <span className="block">
                  Totais da contabilidade: {g.totais ? <b>lido</b> : <b className="text-red-500">FALTA o arquivo “Totais da Folha”</b>} · Holerites:{' '}
                  {g.folha ? <b>{g.folha.holerites.length} lidos</b> : <b className="text-amber-600">não enviados (só as guias serão geradas)</b>}
                </span>
                {!emp && <span className="block text-red-500">CNPJ {g.cnpj} não está cadastrado em Empresas.</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-5">
              {!conf && (
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={s.perfil} onValueChange={(v) => setSt(g.chave, { perfil: v }, g)}>
                    <SelectTrigger className="w-[190px]"><SelectValue placeholder="Perfil" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ribeirao">Perfil Ribeirão</SelectItem>
                      <SelectItem value="sao_paulo">Perfil São Paulo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button disabled={s.busy || !g.totais || !emp} onClick={() => conferir(g)} className="uppercase tracking-widest text-xs">
                    {s.busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Conferir
                  </Button>
                </div>
              )}

              {s.erro && <p className="text-sm text-red-500 flex gap-2"><XCircle className="h-4 w-4 shrink-0 mt-0.5" />{s.erro}</p>}

              {conf && (
                <>
                  <div className="grid gap-3 sm:grid-cols-3 text-sm">
                    <div className="border border-border rounded-md p-3">
                      <div className="text-xs uppercase text-muted-foreground">Holerites × Totais</div>
                      {conf.sem_holerites ? (
                        <div className="flex items-center gap-2 text-amber-600"><AlertTriangle className="h-4 w-4" /> Sem holerites individuais</div>
                      ) : (
                        <div className={`flex items-center gap-2 ${conf.confere ? 'text-emerald-600' : 'text-red-500'}`}>
                          {conf.confere ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          {brl(conf.soma_liquido_holerites)} × {brl(conf.liquido_totais)}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">{conf.holerites_lidos} holerites × {conf.funcionarios_totais} ativos nos Totais</div>
                    </div>
                    <div className="border border-border rounded-md p-3">
                      <div className="text-xs uppercase text-muted-foreground">Guias da empresa</div>
                      <div className="font-medium">{brl(conf.total_guias)}</div>
                    </div>
                    <div className="border border-border rounded-md p-3">
                      <div className="text-xs uppercase text-muted-foreground">Total que a empresa desembolsa</div>
                      <div className="font-medium">{brl(conf.total_empresa)}</div>
                    </div>
                  </div>

                  {pend.length > 0 && !gerada && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="h-4 w-4" /> {pend.length} holerite(s) sem cadastro: ligue ao funcionário ou exclua com motivo
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow><TableHead>Nome no holerite</TableHead><TableHead>Líquido</TableHead><TableHead>Ligar a</TableHead><TableHead>Ou excluir (motivo)</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                          {pend.map((h: any) => (
                            <TableRow key={h.id}>
                              <TableCell>{h.nome} <span className="text-xs text-muted-foreground">(mat. {h.matricula})</span></TableCell>
                              <TableCell>{brl(h.liquido)}</TableCell>
                              <TableCell>
                                <Select onValueChange={(fid) => vincular(g, h.id, fid)}>
                                  <SelectTrigger className="w-[240px]"><SelectValue placeholder="Escolher funcionário" /></SelectTrigger>
                                  <SelectContent>{funcs.map((f) => <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>)}</SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Input className="w-[200px]" placeholder="Motivo" value={motivoExcl[h.id] || ''} onChange={(e) => setMotivoExcl((p) => ({ ...p, [h.id]: e.target.value }))} />
                                  <Button variant="outline" size="sm" onClick={() => excluir(g, h.id)}>Excluir</Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {!gerada && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Prévia do Contas a Pagar (vencimentos editáveis)</p>
                      <Table>
                        <TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Valor</TableHead><TableHead>Vencimento</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {!conf.sem_holerites && (
                            <TableRow>
                              <TableCell>Salário líquido de cada funcionário ({(det?.holerites || []).filter((h: any) => h.situacao === 'ok').length}) — só o RH vê</TableCell>
                              <TableCell>{brl((det?.holerites || []).filter((h: any) => h.situacao === 'ok').reduce((a: number, h: any) => a + Number(h.liquido), 0))}</TableCell>
                              <TableCell><Input type="date" className="w-[170px]" value={s.venc.salario} onChange={(e) => setSt(g.chave, { venc: { ...s.venc, salario: e.target.value } }, g)} /></TableCell>
                            </TableRow>
                          )}
                          {guiasPrev.map((gp) => (
                            <TableRow key={gp.tipo}>
                              <TableCell>{ROTULO_GUIA[gp.tipo] || gp.tipo}</TableCell>
                              <TableCell>{brl(gp.valor)}</TableCell>
                              <TableCell><Input type="date" className="w-[170px]" value={s.venc[gp.tipo] || ''} onChange={(e) => setSt(g.chave, { venc: { ...s.venc, [gp.tipo]: e.target.value } }, g)} /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <p className="text-xs text-muted-foreground">Vencimentos sugeridos: salário no 5º dia útil e guias no dia 20 do mês seguinte. Confirme com a contabilidade antes de gerar.</p>
                      {!conf.sem_holerites && (
                        <label className="flex flex-wrap items-center gap-3 text-sm">
                          Salário já foi pago em (opcional — gera já com baixa):
                          <Input type="date" className="w-[170px]" value={s.salarioPagoEm} onChange={(e) => setSt(g.chave, { salarioPagoEm: e.target.value }, g)} />
                        </label>
                      )}
                      <Button
                        disabled={s.busy || pend.length > 0 || (!conf.confere && !conf.sem_holerites)}
                        onClick={() => gerar(g)}
                        className="uppercase tracking-widest text-xs"
                      >
                        {s.busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Gerar Contas a Pagar
                      </Button>
                    </div>
                  )}

                  {gerada && (
                    <p className="text-sm text-emerald-600 flex gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      Contas a Pagar gerado
                      {s.resultado ? `: ${s.resultado.titulos_salario} salários (${brl(s.resultado.total_salario)}) + ${s.resultado.titulos_guias} guias (${brl(s.resultado.total_guias)}).` : '.'}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )
      })}

      <Card className="shadow-none border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-sm uppercase tracking-widest">Histórico de importações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead><TableHead>Empresa</TableHead><TableHead>Situação</TableHead><TableHead>Holerites</TableHead>
                <TableHead>Líquido</TableHead><TableHead>Total da empresa</TableHead><TableHead>Cancelar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historico.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-6 text-xs uppercase tracking-widest text-muted-foreground">Nenhuma importação ainda.</TableCell></TableRow>
              ) : historico.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="capitalize">{mesNome(h.mes)}/{h.ano}</TableCell>
                  <TableCell>{h.empresa}</TableCell>
                  <TableCell><Badge variant={h.situacao === 'gerada' ? 'default' : 'outline'}>{h.situacao}</Badge></TableCell>
                  <TableCell>{h.sem_holerites ? 'só Totais' : `${h.holerites}${h.pendentes ? ` (${h.pendentes} pend.)` : ''}`}</TableCell>
                  <TableCell>{brl(h.total_liquido)}</TableCell>
                  <TableCell>{brl(h.conferencia?.total_empresa)}</TableCell>
                  <TableCell>
                    {h.situacao !== 'cancelada' && (
                      <div className="flex gap-2">
                        <Input className="w-[170px]" placeholder="Motivo" value={motivoCancel[h.id] || ''} onChange={(e) => setMotivoCancel((p) => ({ ...p, [h.id]: e.target.value }))} />
                        <Button variant="outline" size="sm" onClick={() => cancelar(h.id)}>Cancelar</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
