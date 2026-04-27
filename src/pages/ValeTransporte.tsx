import { useState, useEffect, useRef } from 'react'
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

export default function ValeTransporte() {
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [selectedFuncionario, setSelectedFuncionario] = useState('')
  const [mes, setMes] = useState<string>(format(new Date(), 'yyyy-MM'))
  const [valorDiario, setValorDiario] = useState<string>('15.00')

  const year = parseInt(mes.split('-')[0])
  const month = parseInt(mes.split('-')[1]) - 1

  const { feriados } = useFeriados(year)
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [calculo, setCalculo] = useState<any>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase
      .from('funcionarios')
      .select('id, nome, empresa, cpf')
      .eq('status', 'Ativo')
      .order('nome')
      .then(({ data }) => {
        if (data) setFuncionarios(data)
      })
  }, [])

  const handleCalcular = async () => {
    if (!selectedFuncionario || !mes || !valorDiario) {
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

      const { data: faltas } = await supabase
        .from('controle_ponto')
        .select('data, status')
        .eq('funcionario_id', selectedFuncionario)
        .gte('data', format(start, 'yyyy-MM-dd'))
        .lte('data', format(end, 'yyyy-MM-dd'))
        .in('status', ['ausente'])

      const diasFaltados = faltas ? faltas.length : 0
      const diasTrabalhados = Math.max(0, diasUteis - diasFaltados)
      const valorTotal = diasTrabalhados * parseFloat(valorDiario)

      const funcInfo = funcionarios.find((f) => f.id === selectedFuncionario)

      setCalculo({
        funcionario: funcInfo,
        mes,
        diasUteis,
        diasFaltados,
        diasTrabalhados,
        valorDiario: parseFloat(valorDiario),
        valorTotal,
      })

      toast({ title: 'Cálculo realizado com sucesso' })
    } catch (e: any) {
      toast({ title: 'Erro ao calcular', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const export2Word = () => {
    if (!receiptRef.current) return

    const preHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'><title>Recibo de Vale Transporte</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5; color: #000; }
          .header { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 20px; }
          .content { margin-bottom: 30px; text-align: justify; }
          .signature { margin-top: 50px; text-align: center; }
          .signature-line { width: 300px; border-top: 1px solid #000; margin: 0 auto 10px auto; }
        </style>
      </head><body>
    `
    const postHtml = '</body></html>'
    const html = preHtml + receiptRef.current.innerHTML + postHtml

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)
    const filename = `Recibo_VT_${calculo.funcionario.nome.replace(/\s+/g, '_')}_${mes}.doc`

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
          Calcule os dias úteis e gere recibos de Vale Transporte considerando feriados e faltas.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurar Cálculo</CardTitle>
            <CardDescription>Selecione os parâmetros para calcular o VT do mês.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Funcionário</Label>
              <Select value={selectedFuncionario} onValueChange={setSelectedFuncionario}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome} - {f.empresa || 'Lucenera'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mês Referência</Label>
                <Input type="month" value={mes} onChange={(e) => setMes(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Valor Diário (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={valorDiario}
                  onChange={(e) => setValorDiario(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleCalcular} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="mr-2 h-4 w-4" />
              )}
              Calcular VT
            </Button>
          </CardContent>
        </Card>

        {calculo && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-lg">
                <span>Resumo do Cálculo</span>
                <Button variant="outline" size="sm" onClick={export2Word}>
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Recibo (.doc)
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                    Dias Úteis
                  </p>
                  <p className="font-semibold text-xl">{calculo.diasUteis}</p>
                </div>
                <div>
                  <p className="text-muted-foreground uppercase text-xs font-semibold tracking-wider text-red-500">
                    Faltas
                  </p>
                  <p className="font-semibold text-xl text-red-600">{calculo.diasFaltados}</p>
                </div>
                <div>
                  <p className="text-muted-foreground uppercase text-xs font-semibold tracking-wider text-green-600">
                    Dias Efetivos
                  </p>
                  <p className="font-semibold text-2xl text-green-700">{calculo.diasTrabalhados}</p>
                </div>
                <div>
                  <p className="text-muted-foreground uppercase text-xs font-semibold tracking-wider text-primary">
                    Valor Total
                  </p>
                  <p className="font-semibold text-2xl text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      calculo.valorTotal,
                    )}
                  </p>
                </div>
              </div>

              {/* Hidden Receipt for Word Export */}
              <div className="hidden">
                <div ref={receiptRef}>
                  <div className="header">RECIBO DE VALE TRANSPORTE</div>
                  <div className="content">
                    <p>
                      Recebi da empresa <strong>{calculo.funcionario.empresa || 'Lucenera'}</strong>
                      , a importância de{' '}
                      <strong>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(calculo.valorTotal)}
                      </strong>
                      , referente ao benefício de Vale Transporte do mês de{' '}
                      <strong>
                        {format(new Date(calculo.mes + '-01T12:00:00'), 'MMMM/yyyy', {
                          locale: ptBR,
                        })}
                      </strong>
                      .
                    </p>
                    <p>
                      Cálculo: {calculo.diasTrabalhados} dias trabalhados (Dias úteis:{' '}
                      {calculo.diasUteis} | Faltas: {calculo.diasFaltados}) x{' '}
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(calculo.valorDiario)}{' '}
                      (Valor Diário).
                    </p>
                    <p>Por ser verdade, firmo o presente recibo.</p>
                  </div>
                  <div className="signature">
                    <div className="signature-line"></div>
                    <p>{calculo.funcionario.nome}</p>
                    <p>CPF: {calculo.funcionario.cpf || 'Não informado'}</p>
                    <p>Data: {format(new Date(), 'dd/MM/yyyy')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
