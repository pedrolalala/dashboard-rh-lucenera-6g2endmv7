import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { useFeriados } from '@/hooks/use-feriados'
import { useToast } from '@/hooks/use-toast'
import { Bus, Loader2, Calculator, Download, Building2, AlertTriangle } from 'lucide-react'
import {
  calcularDiasUteis,
  countFeriadosInMonth,
  buildCalculos,
  formatBRL,
  gerarZipRecibos,
  type CalculoVT,
  type CalculoError,
  type EmpresaVT,
} from '@/lib/vale-transporte'
import { fetchEmpresas, type Empresa } from '@/services/empresas'

const ALL_COMPANIES = '__all__'
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i, 1).toLocaleString('pt-BR', { month: 'long' }),
}))
const YEARS = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - 2 + i))

export default function ValeTransporte() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [empresa, setEmpresa] = useState(ALL_COMPANIES)
  const [mes, setMes] = useState(String(new Date().getMonth() + 1))
  const [ano, setAno] = useState(String(new Date().getFullYear()))
  const [loading, setLoading] = useState(false)
  const [zipLoading, setZipLoading] = useState(false)
  const [empresasLoading, setEmpresasLoading] = useState(true)
  const [calculos, setCalculos] = useState<CalculoVT[]>([])
  const [errors, setErrors] = useState<CalculoError[]>([])

  const year = parseInt(ano)
  const month = parseInt(mes) - 1
  const { feriados } = useFeriados(year)
  const { toast } = useToast()

  useEffect(() => {
    fetchEmpresas()
      .then(setEmpresas)
      .catch((e: any) =>
        toast({
          title: 'Erro ao carregar empresas',
          description: e.message,
          variant: 'destructive',
        }),
      )
      .finally(() => setEmpresasLoading(false))
  }, [toast])

  const empresaLabel =
    empresa === ALL_COMPANIES
      ? 'Todas as Empresas'
      : empresas.find((e) => e.id === empresa)?.nome || empresa
  const mesLabel = `${MONTHS.find((m) => m.value === mes)?.label || ''}/${ano}`

  const validateConnection = async (): Promise<boolean> => {
    const { error } = await supabase.from('empresas').select('id').limit(1)
    if (error) {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível validar a conexão com o banco de dados.',
        variant: 'destructive',
      })
      return false
    }
    return true
  }

  const fetchCalculos = async (): Promise<{
    calculos: CalculoVT[]
    errors: CalculoError[]
  } | null> => {
    const isConnected = await validateConnection()
    if (!isConnected) return null

    const diasUteis = calcularDiasUteis(year, month, feriados)
    const feriadosCount = countFeriadosInMonth(year, month, feriados)

    const { data: funcsData } = await supabase
      .from('funcionarios_novo')
      .select('id, nome')
      .eq('ativo', true)
      .order('nome')
    if (!funcsData || funcsData.length === 0) return null

    const { data: benefData } = await supabase
      .from('funcionarios_beneficios_empresas')
      .select('funcionario_id, empresa, valor_vt_dia')
      .in(
        'funcionario_id',
        funcsData.map((f) => f.id),
      )
    let filteredBenef = benefData || []
    if (empresa !== ALL_COMPANIES) {
      const emp = empresas.find((e) => e.id === empresa)
      if (emp) filteredBenef = filteredBenef.filter((b: any) => b.empresa === emp.nome)
    }

    const funcionarios: any[] = funcsData.map((f) => {
      const benef = filteredBenef.find((b: any) => b.funcionario_id === f.id)
      return {
        id: f.id,
        nome: f.nome,
        empresa_nome: benef?.empresa || null,
        valor_vt_dia: Number(benef?.valor_vt_dia) || 0,
      }
    })

    let faltasData: any[] = []
    if (funcionarios.length > 0) {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0]
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]
      const { data } = await supabase
        .from('controle_falta')
        .select('funcionario_id, data, status')
        .in(
          'funcionario_id',
          funcionarios.map((f) => f.id),
        )
        .gte('data', startDate)
        .lte('data', endDate)
      faltasData = data || []
    }

    const empresasVT: EmpresaVT[] = empresas.map((e) => ({
      id: e.id,
      nome: e.nome,
      razao_social: e.razao_social,
      cnpj: e.cnpj,
      cidade: e.cidade,
    }))
    return buildCalculos(funcionarios, faltasData, diasUteis, feriadosCount, empresasVT)
  }

  const handleCalcular = async () => {
    setLoading(true)
    try {
      const result = await fetchCalculos()
      if (!result) {
        toast({
          title: 'Nenhum funcionário encontrado',
          description: 'Verifique funcionários ativos.',
        })
        setCalculos([])
        setErrors([])
        return
      }
      setCalculos(result.calculos)
      setErrors(result.errors)
      if (result.errors.length > 0)
        toast({
          title: `${result.errors.length} funcionário(s) sem benefício`,
          description: 'Verifique as inconsistências abaixo.',
        })
      else toast({ title: 'Cálculo realizado com sucesso' })
    } catch (e: any) {
      toast({ title: 'Erro ao calcular', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleGerarZip = async () => {
    setZipLoading(true)
    try {
      const result = await fetchCalculos()
      if (!result || result.calculos.length === 0) {
        toast({ title: 'Nenhum funcionário encontrado', variant: 'destructive' })
        return
      }
      setCalculos(result.calculos)
      setErrors(result.errors)
      const zipBlob = await gerarZipRecibos(result.calculos, mesLabel, year, month)
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Vale transporte do mes ${mesLabel.replace(/\//g, '-')}.zip`
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: 'ZIP gerado com sucesso',
        description: `${result.calculos.length} recibos .docx compactados.`,
      })
    } catch (e: any) {
      toast({ title: 'Erro ao gerar ZIP', description: e.message, variant: 'destructive' })
    } finally {
      setZipLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-light uppercase tracking-widest text-foreground flex items-center gap-2">
          <Bus className="h-6 w-6" /> Gestão de Vale Transporte
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Calcule e gere recibos de Vale Transporte em lote por empresa.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Lote de Recibos</CardTitle>
            <CardDescription>Selecione empresa, mês e ano.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select value={empresa} onValueChange={setEmpresa} disabled={empresasLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={empresasLoading ? 'Carregando...' : 'Selecione'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_COMPANIES}>
                    <span className="flex items-center gap-2 font-medium">
                      <Building2 className="h-4 w-4" /> Todas as Empresas
                    </span>
                  </SelectItem>
                  {empresas.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Mês</Label>
                <Select value={mes} onValueChange={setMes}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={m.value} className="capitalize">
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ano</Label>
                <Select value={ano} onValueChange={setAno}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Button onClick={handleCalcular} disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Calculator className="mr-2 h-4 w-4" />
                )}
                Calcular Lote
              </Button>
              <Button
                onClick={handleGerarZip}
                disabled={zipLoading}
                variant="secondary"
                className="w-full"
              >
                {zipLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Gerar Relatórios (.zip)
              </Button>
            </div>
          </CardContent>
        </Card>
        {calculos.length > 0 && (
          <Card className="lg:col-span-2 border-primary/20">
            <CardHeader>
              <CardTitle>Resumo do Processamento</CardTitle>
              <CardDescription>
                {calculos.length} recibos para <strong>{empresaLabel}</strong> — {mesLabel}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Funcionário</th>
                      <th className="px-4 py-3 font-medium text-right">Dias Úteis</th>
                      <th className="px-4 py-3 font-medium text-right">Faltas</th>
                      <th className="px-4 py-3 font-medium text-right">Dias Líquidos</th>
                      <th className="px-4 py-3 font-medium text-right">Valor Diário</th>
                      <th className="px-4 py-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {calculos.map((c) => (
                      <tr key={c.funcionario.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{c.funcionario.nome}</td>
                        <td className="px-4 py-3 text-right">{c.diasUteis}</td>
                        <td className="px-4 py-3 text-right text-red-500 font-semibold">
                          {c.diasFaltados > 0 ? c.diasFaltados : '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{c.diasLiquidos}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {formatBRL(c.valorDiario)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary">
                          {formatBRL(c.valorTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
        {errors.length > 0 && (
          <Card className="lg:col-span-3 border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" /> Inconsistências ({errors.length})
              </CardTitle>
              <CardDescription>
                Funcionários sem registro de benefício ou dados insuficientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {errors.map((err, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-md border border-destructive/20 bg-destructive/5 p-3"
                  >
                    <Badge variant="destructive" className="shrink-0">
                      Sem VT
                    </Badge>
                    <span className="font-medium">{err.funcionario_nome}</span>
                    <span className="text-sm text-muted-foreground">{err.erro}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
