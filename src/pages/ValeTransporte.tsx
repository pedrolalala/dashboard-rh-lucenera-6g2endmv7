import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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
import { Bus, FileText, Loader2, Calculator } from 'lucide-react'

const COMPANIES = [
  'Manoella Zauith Leite Lopes ME',
  'Foco Projetos de Iluminação',
  'islight Soluções em LED',
]

export default function ValeTransporte() {
  const [empresa, setEmpresa] = useState<string>('')
  const [mes, setMes] = useState<string>(format(new Date(), 'yyyy-MM'))

  const year = parseInt(mes.split('-')[0])
  const month = parseInt(mes.split('-')[1]) - 1

  const { feriados } = useFeriados(year)
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [calculos, setCalculos] = useState<any[]>([])

  const handleCalcularLote = async () => {
    if (!empresa || !mes) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const start = startOfMonth(new Date(year, month))
      const end = endOfMonth(new Date(year, month))
      const daysInMonth = eachDayOfInterval({ start, end })

      const feriadosMes = feriados
        .filter((f) => {
          const d = parseISO(f.date)
          return d.getMonth() === month && d.getFullYear() === year
        })
        .map((f) => format(parseISO(f.date), 'yyyy-MM-dd'))

      let diasUteis = 0
      daysInMonth.forEach((d) => {
        if (!isWeekend(d)) {
          const formatted = format(d, 'yyyy-MM-dd')
          if (!feriadosMes.includes(formatted)) diasUteis++
        }
      })

      const { data: funcs } = await supabase
        .from('funcionarios')
        .select('id, nome, empresa, cpf, valor_vt_dia')
        .eq('status', 'Ativo')
        .eq('empresa', empresa)

      if (!funcs || funcs.length === 0) {
        toast({
          title: 'Nenhum funcionário encontrado',
          description: 'Verifique se há funcionários ativos vinculados a esta empresa.',
        })
        setCalculos([])
        return
      }

      const funcIds = funcs.map((f) => f.id)
      const { data: faltas } = await supabase
        .from('controle_falta')
        .select('funcionario_id, status')
        .in('funcionario_id', funcIds)
        .gte('data', format(start, 'yyyy-MM-dd'))
        .lte('data', format(end, 'yyyy-MM-dd'))

      // Descontamos apenas faltas integrais
      const faltasIntegraisStatus = [
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

      const results = funcs.map((func) => {
        const funcFaltas = faltas?.filter((f) => f.funcionario_id === func.id) || []
        const diasFaltados = funcFaltas.filter(
          (f) => f.status && faltasIntegraisStatus.includes(f.status),
        ).length

        const diasEfetivos = Math.max(0, diasUteis - diasFaltados)
        const valorDiario = func.valor_vt_dia || 0
        const valorTotal = diasEfetivos * valorDiario

        return {
          funcionario: func,
          diasUteis,
          diasFaltados,
          diasEfetivos,
          valorDiario,
          valorTotal,
        }
      })

      setCalculos(results)
      toast({ title: 'Cálculo em lote realizado com sucesso' })
    } catch (e: any) {
      toast({ title: 'Erro ao calcular', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const export2Word = () => {
    if (calculos.length === 0) return

    const headerHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'><title>Recibos de Vale Transporte</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5; color: #000; }
          .page-break { page-break-after: always; }
          .header { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 20px; }
          .content { margin-bottom: 20px; text-align: justify; }
          .details { margin-bottom: 30px; }
          .signature { margin-top: 50px; text-align: center; }
          .signature-line { width: 300px; border-top: 1px solid #000; margin: 0 auto 10px auto; }
        </style>
      </head><body>
    `
    const footerHtml = '</body></html>'

    const receiptsHtml = calculos
      .map(
        (calc, index) => `
      <div ${index < calculos.length - 1 ? "class='page-break'" : ''}>
        <div class="header">RECIBO DE VALE TRANSPORTE</div>
        <div class="content">
          <p>
            Recebi da empresa <strong>${calc.funcionario.empresa || 'Lucenera'}</strong>, a importância de <strong>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calc.valorTotal)}</strong>, referente ao benefício de Vale Transporte do mês de <strong>${format(new Date(mes + '-01T12:00:00'), 'MMMM/yyyy', { locale: ptBR })}</strong>.
          </p>
        </div>
        <div class="details">
          <p>Dias Úteis: [${calc.diasUteis}]</p>
          <p>Faltas Integrais Descontadas: [${calc.diasFaltados}]</p>
          <p>Valor Líquido a Receber: R$ [${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calc.valorTotal)}]</p>
        </div>
        <div class="content">
          <p>Por ser verdade, firmo o presente recibo.</p>
        </div>
        <div class="signature">
          <div class="signature-line"></div>
          <p>${calc.funcionario.nome}</p>
          <p>CPF: ${calc.funcionario.cpf || 'Não informado'}</p>
          <p>Data: ${format(new Date(), 'dd/MM/yyyy')}</p>
        </div>
      </div>
    `,
      )
      .join('')

    const html = headerHtml + receiptsHtml + footerHtml

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)
    const filename = `Recibos_VT_${empresa.replace(/\s+/g, '_')}_${mes}.doc`

    const downloadLink = document.createElement('a')
    document.body.appendChild(downloadLink)

    // @ts-expect-error
    if (navigator.msSaveOrOpenBlob) {
      // @ts-expect-error
      navigator.msSaveOrOpenBlob(blob, filename)
    } else {
      downloadLink.href = url
      downloadLink.download = filename
      downloadLink.click()
    }
    document.body.removeChild(downloadLink)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-light uppercase tracking-widest text-foreground flex items-center gap-2">
          <Bus className="h-6 w-6" /> Gestão de Vale Transporte
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gere recibos de Vale Transporte em lote por empresa, desconsiderando faltas de meio
          período.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Lote de Recibos</CardTitle>
            <CardDescription>
              Selecione a empresa e o mês para processar os recibos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select value={empresa} onValueChange={setEmpresa}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mês Referência</Label>
              <Input type="month" value={mes} onChange={(e) => setMes(e.target.value)} />
            </div>

            <Button onClick={handleCalcularLote} disabled={loading} className="w-full mt-4">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="mr-2 h-4 w-4" />
              )}
              Calcular Lote
            </Button>
          </CardContent>
        </Card>

        {calculos.length > 0 && (
          <Card className="lg:col-span-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Resumo do Processamento</CardTitle>
                <CardDescription>
                  {calculos.length} recibos gerados para <strong>{empresa}</strong>.
                </CardDescription>
              </div>
              <Button variant="default" onClick={export2Word}>
                <FileText className="mr-2 h-4 w-4" />
                Exportar Lote (.doc)
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
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(calc.valorDiario)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(calc.valorTotal)}
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
