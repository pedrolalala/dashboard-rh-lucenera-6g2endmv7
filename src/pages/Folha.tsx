import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FolhaImportar from '@/components/FolhaImportar'
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
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth()

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
            Importe a folha exportada pela contabilidade e gere o Contas a Pagar. O sistema não recalcula a folha: a planilha da contabilidade é a fonte.
          </p>
        </div>
      </div>

      {canGenerate && <FolhaImportar onGerou={fetchPayrolls} />}

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
                <TableHead>Comissão</TableHead>
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
                    <TableCell className="text-emerald-500">
                      +{formatBRL(p.comissao || 0)}
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
