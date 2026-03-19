import { useState, useEffect } from 'react'
import { FileText, Download, Loader2, Calendar as CalendarIcon } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const REPORT_CONFIG = [
  {
    id: 'ferias',
    title: 'Relatório de Férias',
    desc: 'Exporta o histórico de solicitações e períodos de férias.',
    type: 'date',
  },
  {
    id: 'folha',
    title: 'Relatório de Folha',
    desc: 'Exporta registros de salários, descontos e adicionais.',
    type: 'month',
  },
  {
    id: 'avaliacoes',
    title: 'Relatório de Avaliações',
    desc: 'Exporta as notas e critérios de desempenho.',
    type: 'date',
  },
  {
    id: 'ponto',
    title: 'Relatório de Ponto',
    desc: 'Exporta as marcações de assiduidade e horas trabalhadas.',
    type: 'month',
  },
]

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i, 1).toLocaleString('pt-BR', { month: 'long' }),
}))
const YEARS = ['2023', '2024', '2025', '2026']

function ReportSection({ config, depts, emps, onExport, loadingType }: any) {
  const [deptId, setDeptId] = useState('Todos')
  const [empId, setEmpId] = useState('Todos')
  const [month, setMonth] = useState(String(new Date().getMonth() + 1))
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const filteredEmps = emps.filter((e: any) => deptId === 'Todos' || e.departamento_id === deptId)

  const handleExport = (format: string) => {
    onExport(config.id, format, {
      deptId,
      empId,
      month,
      year,
      startDate: dateRange?.from,
      endDate: dateRange?.to,
    })
  }

  return (
    <Card className="shadow-sm border-blue-100/50">
      <CardHeader className="pb-3 border-b bg-slate-50/50">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-secondary" /> {config.title}
        </CardTitle>
        <CardDescription>{config.desc}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select value={deptId} onValueChange={setDeptId}>
            <SelectTrigger>
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Deptos</SelectItem>
              {depts.map((d: any) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={empId} onValueChange={setEmpId}>
            <SelectTrigger>
              <SelectValue placeholder="Funcionário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Funcionários</SelectItem>
              {filteredEmps.map((e: any) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {config.type === 'month' ? (
          <div className="flex gap-4">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full">
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
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-full">
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
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
                  ) : (
                    format(dateRange.from, 'dd/MM/yyyy')
                  )
                ) : (
                  <span>Selecione o período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        )}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => handleExport('pdf')}
            disabled={!!loadingType}
            className="flex-1"
            variant="default"
          >
            {loadingType === `${config.id}-pdf` ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}{' '}
            PDF
          </Button>
          <Button
            onClick={() => handleExport('csv')}
            disabled={!!loadingType}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            {loadingType === `${config.id}-csv` ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}{' '}
            CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Relatorios() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [depts, setDepts] = useState([])
  const [emps, setEmps] = useState([])
  const [loadingType, setLoadingType] = useState('')

  useEffect(() => {
    supabase
      .from('departamentos_rh')
      .select('*')
      .then(({ data }) => data && setDepts(data as any))
    supabase
      .from('funcionarios_rh')
      .select('id, nome, departamento_id')
      .then(({ data }) => data && setEmps(data as any))
  }, [])

  if (user?.app_role !== 'admin' && user?.app_role !== 'gerente') {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Acesso restrito a administradores e gerentes.
      </div>
    )
  }

  const handleExport = async (reportType: string, format: string, filters: any) => {
    try {
      setLoadingType(`${reportType}-${format}`)
      const payload = { ...filters }
      if (payload.deptId === 'Todos') delete payload.deptId
      if (payload.empId === 'Todos') delete payload.empId
      if (payload.startDate) payload.startDate = payload.startDate.toISOString()
      if (payload.endDate) payload.endDate = payload.endDate.toISOString()

      const {
        data: { session },
      } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-report`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportType, format, filters: payload }),
      })

      if (!res.ok) throw new Error(await res.text())

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `relatorio-${reportType}-${Date.now()}.${format}`
      a.click()
    } catch (err: any) {
      toast({
        title: 'Erro ao gerar relatório',
        description: err.message || 'Falha na comunicação',
        variant: 'destructive',
      })
    } finally {
      setLoadingType('')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Relatórios e Exportações</h1>
        <p className="text-muted-foreground mt-1">
          Gere e faça o download de documentos consolidados em PDF ou CSV.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {REPORT_CONFIG.map((c) => (
          <ReportSection
            key={c.id}
            config={c}
            depts={depts}
            emps={emps}
            onExport={handleExport}
            loadingType={loadingType}
          />
        ))}
      </div>
    </div>
  )
}
