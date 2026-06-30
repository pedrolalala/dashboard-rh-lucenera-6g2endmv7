import { useState, useEffect } from 'react'
import { Download, User, Loader2, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import { fetchComissaoMensal, exportComissaoCSV, type ComissaoData } from '@/services/comissao'
import { cn } from '@/lib/utils'

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i, 1).toLocaleString('pt-BR', { month: 'long' }),
}))

const YEARS = [
  String(new Date().getFullYear() - 1),
  String(new Date().getFullYear()),
  String(new Date().getFullYear() + 1),
]

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function ComissaoCard({ data, isHighest }: { data: ComissaoData; isHighest: boolean }) {
  return (
    <Card
      className={cn(
        'shadow-none transition-all duration-300',
        isHighest ? 'border-primary border-2 shadow-md' : 'border-border',
      )}
    >
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              isHighest ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
            )}
          >
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{data.funcionario}</h3>
          </div>
          {isHighest && (
            <div className="flex items-center gap-1 text-primary">
              <Trophy className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Equipe:</span>
            <span className="font-medium text-foreground">{data.equipe}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Comissão:</span>
            <span className="font-medium text-foreground">{data.comissao_percentual}%</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Projetos no mês:</span>
            <span className="font-semibold text-foreground">{data.total_projetos}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor total:</span>
            <span className="font-semibold text-foreground">
              {formatBRL(data.valor_total_projetos)}
            </span>
          </div>
        </div>

        <Separator />

        <div className="text-center space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Comissão calculada
          </p>
          <p className={cn('text-xl font-bold', isHighest ? 'text-primary' : 'text-foreground')}>
            {formatBRL(data.comissao_calculada)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Comissao() {
  const [mes, setMes] = useState(String(new Date().getMonth() + 1))
  const [ano, setAno] = useState(String(new Date().getFullYear()))
  const [data, setData] = useState<ComissaoData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      const result = await fetchComissaoMensal(Number(mes), Number(ano))
      setData(result)
      setIsLoading(false)
    }
    loadData()
  }, [mes, ano])

  const maxComissao = Math.max(...data.map((d) => d.comissao_calculada), 0)
  const totalProjetos = data.reduce((sum, d) => sum + d.total_projetos, 0)
  const totalValor = data.reduce((sum, d) => sum + d.valor_total_projetos, 0)
  const totalComissao = data.reduce((sum, d) => sum + d.comissao_calculada, 0)

  const handleExport = () => {
    exportComissaoCSV(data, Number(mes), Number(ano))
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Comissão
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Acompanhe o desempenho e as comissões calculadas por equipe.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={mes} onValueChange={setMes}>
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
          <Select value={ano} onValueChange={setAno}>
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
          <Button
            onClick={handleExport}
            disabled={isLoading || data.length === 0}
            className="uppercase tracking-widest text-xs"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <ComissaoCard
                key={item.funcionario}
                data={item}
                isHighest={item.comissao_calculada === maxComissao && maxComissao > 0}
              />
            ))}
          </div>

          <Card className="shadow-none border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/10">
                    <TableHead className="uppercase text-[10px] tracking-widest">
                      Responsável
                    </TableHead>
                    <TableHead className="uppercase text-[10px] tracking-widest text-right">
                      Projetos
                    </TableHead>
                    <TableHead className="uppercase text-[10px] tracking-widest text-right">
                      Valor Total
                    </TableHead>
                    <TableHead className="uppercase text-[10px] tracking-widest text-right">
                      Comissão
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.funcionario}>
                      <TableCell className="font-medium">{item.funcionario}</TableCell>
                      <TableCell className="text-right">{item.total_projetos}</TableCell>
                      <TableCell className="text-right">
                        {formatBRL(item.valor_total_projetos)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {formatBRL(item.comissao_calculada)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <tfoot className="bg-muted/20 font-medium">
                  <tr>
                    <td className="p-4 align-middle font-bold text-foreground">Total</td>
                    <td className="p-4 text-right align-middle font-bold text-foreground">
                      {totalProjetos}
                    </td>
                    <td className="p-4 text-right align-middle font-bold text-foreground">
                      {formatBRL(totalValor)}
                    </td>
                    <td className="p-4 text-right align-middle font-bold text-primary">
                      {formatBRL(totalComissao)}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
