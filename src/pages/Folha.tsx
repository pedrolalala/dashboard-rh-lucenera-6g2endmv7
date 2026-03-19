import { useState, useEffect } from 'react'
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
      .select('*, funcionarios_rh(nome)')
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
        .from('funcionarios_rh')
        .select('id, salario_base')
        .eq('status', 'Ativo')

      if (!employees || employees.length === 0) {
        toast({ title: 'Nenhum funcionário ativo encontrado.' })
        return
      }

      const payload = employees.map((emp) => {
        const base = Number(emp.salario_base) || 0
        const descontos = base * 0.185 // ~11% INSS + ~7.5% IR
        const adicionais = 800 // VR 600 + VT 200
        return {
          funcionario_id: emp.id,
          mes: Number(genMonth),
          ano: Number(genYear),
          salario_base: base,
          descontos,
          adicionais,
          salario_liquido: base - descontos + adicionais,
        }
      })

      const { error } = await supabase.from('folha_pagamento').insert(payload)
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
                <TableHead>Descontos (INSS/IR)</TableHead>
                <TableHead>Adicionais (VR/VT)</TableHead>
                <TableHead className="text-right">Salário Líquido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : payrolls.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground text-xs uppercase tracking-widest"
                  >
                    Nenhum registro encontrado para o período selecionado.
                  </TableCell>
                </TableRow>
              ) : (
                payrolls.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.funcionarios_rh?.nome || 'Desconhecido'}
                    </TableCell>
                    <TableCell>{formatBRL(p.salario_base)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      -{formatBRL(p.descontos)}
                    </TableCell>
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
