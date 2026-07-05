import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Bus, FileText, Loader2, Calculator, Printer, Building2 } from 'lucide-react'
import {
  calcularDiasUteis,
  buildCalculos,
  formatBRL,
  exportarRecibosWord,
  gerarRelatoriosIndividuais,
  type CalculoVT,
  type FuncionarioVT,
} from '@/lib/vale-transporte'
import { fetchEmpresas, type Empresa } from '@/services/empresas'

const ALL_COMPANIES = '__all__'

export default function ValeTransporte() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [empresa, setEmpresa] = useState('')
  const [mes, setMes] = useState(format(new Date(), 'yyyy-MM'))
  const [loading, setLoading] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [empresasLoading, setEmpresasLoading] = useState(true)
  const [calculos, setCalculos] = useState<CalculoVT[]>([])

  const year = parseInt(mes.split('-')[0])
  const month = parseInt(mes.split('-')[1]) - 1
  const { feriados } = useFeriados(year)
  const { toast } = useToast()

  useEffect(() => {
    const loadEmpresas = async () => {
      try {
        const data = await fetchEmpresas()
        setEmpresas(data)
      } catch (e: any) {
        toast({
          title: 'Erro ao carregar empresas',
          description: e.message,
          variant: 'destructive',
        })
      } finally {
        setEmpresasLoading(false)
      }
    }
    loadEmpresas()
  }, [toast])

  const empresaLabel =
    empresa === ALL_COMPANIES
      ? 'Todas as Empresas'
      : empresas.find((e) => e.id === empresa)?.nome || empresa

  const fetchCalculos = async (): Promise<CalculoVT[] | null> => {
    const start = startOfMonth(new Date(year, month))
    const end = endOfMonth(new Date(year, month))
    const diasUteis = calcularDiasUteis(year, month, feriados)

    let query = supabase
      .from('funcionarios')
      .select('id, nome, empresa, valor_vt_dia')
      .eq('status', 'Ativo')

    if (empresa !== ALL_COMPANIES) {
      query = query.eq('empresa_id', empresa)
    } else {
      const empresaIds = empresas.map((e) => e.id)
      if (empresaIds.length > 0) {
        query = query.in('empresa_id', empresaIds)
      }
    }

    const { data: funcs } = await query

    if (!funcs || funcs.length === 0) return null

    const { data: faltas } = await supabase
      .from('controle_falta')
      .select('funcionario_id, status')
      .in(
        'funcionario_id',
        funcs.map((f: any) => f.id),
      )
      .gte('data', format(start, 'yyyy-MM-dd'))
      .lte('data', format(end, 'yyyy-MM-dd'))

    return buildCalculos(funcs as FuncionarioVT[], faltas || [], diasUteis)
  }

  const handleCalcularLote = async () => {
    if (!empresa || !mes) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const results = await fetchCalculos()
      if (!results) {
        toast({
          title: 'Nenhum funcionário encontrado',
          description: 'Verifique se há funcionários ativos vinculados a esta empresa.',
        })
        setCalculos([])
        return
      }
      setCalculos(results)
      toast({ title: 'Cálculo em lote realizado com sucesso' })
    } catch (e: any) {
      toast({ title: 'Erro ao calcular', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleGerarRelatorios = async () => {
    if (!empresa || !mes) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' })
      return
    }
    setReportLoading(true)
    try {
      const results = await fetchCalculos()
      if (!results) {
        toast({
          title: 'Nenhum funcionário encontrado',
          description: 'Verifique se há funcionários ativos vinculados a esta empresa.',
        })
        return
      }
      setCalculos(results)
      const success = gerarRelatoriosIndividuais(results, empresaLabel, mes)
      if (!success) {
        toast({
          title: 'Erro ao abrir relatórios',
          description: 'Verifique se o bloqueador de pop-ups está desativado.',
          variant: 'destructive',
        })
        return
      }
      toast({
        title: 'Relatórios individuais gerados',
        description: `${results.length} relatórios abertos em nova janela.`,
      })
    } catch (e: any) {
      toast({
        title: 'Erro ao gerar relatórios',
        description: e.message,
        variant: 'destructive',
      })
    } finally {
      setReportLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-light uppercase tracking-widest text-foreground flex items-center gap-2">
          <Bus className="h-6 w-6" /> Gestão de Vale Transporte
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gere recibos e relatórios individuais de Vale Transporte em lote por empresa.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Lote de Recibos</CardTitle>
            <CardDescription>Selecione a empresa e o mês para processar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select value={empresa} onValueChange={setEmpresa} disabled={empresasLoading}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      empresasLoading ? 'Carregando empresas...' : 'Selecione uma empresa'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_COMPANIES}>
                    <span className="flex items-center gap-2 font-medium">
                      <Building2 className="h-4 w-4" />
                      Todas as Empresas
                    </span>
                  </SelectItem>
                  {empresas.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.codigo} - {e.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mês Referência</Label>
              <Input type="month" value={mes} onChange={(e) => setMes(e.target.value)} />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button onClick={handleCalcularLote} disabled={loading} className="flex-1">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Calculator className="mr-2 h-4 w-4" />
                )}
                Calcular Lote
              </Button>
              <Button
                onClick={handleGerarRelatorios}
                disabled={reportLoading}
                variant="secondary"
                className="flex-1"
              >
                {reportLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Printer className="mr-2 h-4 w-4" />
                )}
                Gerar Relatórios
              </Button>
            </div>
          </CardContent>
        </Card>

        {calculos.length > 0 && (
          <Card className="lg:col-span-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Resumo do Processamento</CardTitle>
                <CardDescription>
                  {calculos.length} recibos gerados para <strong>{empresaLabel}</strong>.
                </CardDescription>
              </div>
              <Button
                variant="default"
                onClick={() => exportarRecibosWord(calculos, empresaLabel, mes)}
              >
                <FileText className="mr-2 h-4 w-4" /> Exportar Lote (.doc)
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Funcionário</th>
                      <th className="px-4 py-3 font-medium text-right">Dias Úteis</th>
                      <th className="px-4 py-3 font-medium text-right">Faltas Int.</th>
                      <th className="px-4 py-3 font-medium text-right">Valor Diário</th>
                      <th className="px-4 py-3 font-medium text-right">Líquido a Receber</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {calculos.map((calc) => (
                      <tr key={calc.funcionario.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{calc.funcionario.nome}</td>
                        <td className="px-4 py-3 text-right">{calc.diasUteis}</td>
                        <td className="px-4 py-3 text-right text-red-500 font-semibold">
                          {calc.diasFaltados > 0 ? calc.diasFaltados : '-'}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {formatBRL(calc.valorDiario)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary">
                          {formatBRL(calc.valorTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
