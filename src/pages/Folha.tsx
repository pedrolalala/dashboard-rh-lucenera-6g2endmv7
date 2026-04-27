import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, parseISO } from 'date-fns'
import { Calculator, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i, 1).toLocaleString('pt-BR', { month: 'long' }),
}))

const YEARS = [
  String(new Date().getFullYear() - 1),
  String(new Date().getFullYear()),
  String(new Date().getFullYear() + 1),
]

export default function FolhaPagamento() {
  const [payrolls, setPayrolls] = useState<any[]>([])
  const [filterMonth, setFilterMonth] = useState(String(new Date().getMonth() + 1))
  const [filterYear, setFilterYear] = useState(String(new Date().getFullYear()))
  const [genMonth, setGenMonth] = useState(String(new Date().getMonth() + 1))
  const [genYear, setGenYear] = useState(String(new Date().getFullYear()))
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()

  const fetchPayrolls = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('folha_pagamento')
      .select('*, funcionarios(nome)')
      .eq('mes', Number(filterMonth))
      .eq('ano', Number(filterYear))
      .order('data_geracao', { ascending: false })

    if (!error && data) setPayrolls(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchPayrolls()
  }, [filterMonth, filterYear])

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const { data: existing } = await supabase
        .from('folha_pagamento')
        .select('id')
        .eq('mes', Number(genMonth))
        .eq('ano', Number(genYear))
        .limit(1)

      if (existing && existing.length > 0) {
        toast({ title: 'Folha já gerada para este período.', variant: 'destructive' })
        return
      }

      const { data: employees } = await supabase
        .from('funcionarios')
        .select('id, salario_base, valor_vr, valor_vt')
        .eq('status', 'Ativo')

      if (!employees || employees.length === 0) {
        toast({ title: 'Nenhum funcionário ativo encontrado.' })
        return
      }

      const start = startOfMonth(new Date(Number(genYear), Number(genMonth) - 1))
      const end = endOfMonth(new Date(Number(genYear), Number(genMonth) - 1))

      const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${genYear}`)
      const feriados = res.ok ? await res.json() : []
      const feriadosMes = feriados
        .filter((f: any) => {
          const d = parseISO(f.date)
          return d.getMonth() === Number(genMonth) - 1
        })
        .map((f: any) => format(parseISO(f.date), 'yyyy-MM-dd'))

      let diasUteis = 0
      eachDayOfInterval({ start, end }).forEach((d) => {
        if (!isWeekend(d)) {
          const formatted = format(d, 'yyyy-MM-dd')
          if (!feriadosMes.includes(formatted)) diasUteis++
        }
      })

      const { data: faltas } = await supabase
        .from('controle_ponto')
        .select('funcionario_id, status, data')
        .gte('data', format(start, 'yyyy-MM-dd'))
        .lte('data', format(end, 'yyyy-MM-dd'))

      const payload = employees.map((emp) => {
        const empFaltas = faltas?.filter((f) => f.funcionario_id === emp.id) || []

        let faltasInjustificadas = 0
        let atestados = 0
        let licenca = 0

        empFaltas.forEach((f) => {
          if (f.status === 'falta_injustificada' || f.status === 'ausente') faltasInjustificadas++
          else if (f.status === 'atestado') atestados++
          else if (f.status === 'licenca_maternidade') licenca++
        })

        const base = Number(emp.salario_base) || 0
        const valorVr = Number(emp.valor_vr) || 0
        const valorVt = Number(emp.valor_vt) || 0

        const descontoFalta = (base / 30) * faltasInjustificadas
        const descontosInssIr = base * 0.185
        const descontos = descontoFalta + descontosInssIr

        const diasSemBeneficio = faltasInjustificadas + atestados + licenca
        const diasVrVt = Math.max(0, diasUteis - diasSemBeneficio)
        const valor_vr_vt = diasVrVt * (valorVr + valorVt)

        const adicionais = valor_vr_vt || 800 // Fallback to 800 if no vr/vt registered
        const diasTrabalhados = Math.max(0, diasUteis - faltasInjustificadas - licenca)

        return {
          funcionario_id: emp.id,
          mes: Number(genMonth),
          ano: Number(genYear),
          salario_base: base,
          descontos,
          adicionais,
          comissao: 0,
          salario_liquido: base - descontos + adicionais,
          dias_trabalhados: diasTrabalhados,
          dias_abonados: atestados,
          dias_falta: faltasInjustificadas,
          valor_vr_vt: valor_vr_vt,
        }
      })

      const { error } = await supabase.from('folha_pagamento').insert(payload as any)
      if (error) throw error

      toast({ title: 'Folha de pagamento gerada com sucesso!' })
      setFilterMonth(genMonth)
      setFilterYear(genYear)
      fetchPayrolls()
    } catch (err: any) {
      toast({ title: 'Erro ao gerar folha', description: err.message, variant: 'destructive' })
    } finally {
      setIsGenerating(false)
    }
  }

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  const canGenerate = user?.app_role === 'admin' || user?.app_role === 'gerente'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Folha de Pagamento
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie os holerites e cálculos salariais mensais.
          </p>
        </div>
      </div>

      {canGenerate && (
        <Card className="shadow-none border-border">
          <CardHeader className="bg-transparent border-b border-border pb-4">
            <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
              <Calculator className="h-4 w-4" /> Nova Geração de Folha
            </CardTitle>
            <CardDescription>
              Calcule os salários base, descontos e adicionais automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-4">
            <Select value={genMonth} onValueChange={setGenMonth}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="capitalize">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={genYear} onValueChange={setGenYear}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto uppercase tracking-widest text-xs"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...
                </>
              ) : (
                'Gerar Folha'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-none border-border">
        <CardHeader className="pb-3 border-b border-border bg-transparent">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle className="text-sm uppercase tracking-widest">Registros Salariais</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="capitalize">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Ano" />
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
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10">
                <TableHead>Funcionário</TableHead>
                <TableHead>Salário Base</TableHead>
                <TableHead>Dias Trab.</TableHead>
                <TableHead>Faltas</TableHead>
                <TableHead>Abonados</TableHead>
                <TableHead>Adicionais(VR/VT)</TableHead>
                <TableHead className="text-right">Salário Líquido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : payrolls.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground text-xs uppercase tracking-widest"
                  >
                    Nenhum registro encontrado para o período selecionado.
                  </TableCell>
                </TableRow>
              ) : (
                payrolls.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.funcionarios?.nome || 'Desconhecido'}
                    </TableCell>
                    <TableCell>{formatBRL(p.salario_base)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.dias_trabalhados ?? '-'}
                    </TableCell>
                    <TableCell className="text-red-500">{p.dias_falta ?? '-'}</TableCell>
                    <TableCell className="text-blue-500">{p.dias_abonados ?? '-'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      +{formatBRL(p.adicionais)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      {formatBRL(p.salario_liquido)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
