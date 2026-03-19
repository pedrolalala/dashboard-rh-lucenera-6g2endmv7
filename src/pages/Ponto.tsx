import { useState, useEffect, useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, Clock, Filter, Loader2 } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  presente: { label: 'Presente', color: 'bg-foreground text-background border-transparent' },
  ausente: { label: 'Ausente', color: 'bg-transparent text-destructive border-destructive' },
  atraso: { label: 'Atraso', color: 'bg-transparent text-muted-foreground border-border' },
}

export default function Ponto() {
  const [logs, setLogs] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedDept, setSelectedDept] = useState('Todos')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    supabase
      .from('departamentos_rh')
      .select('*')
      .then(({ data }) => {
        if (data) setDepartments(data)
      })
  }, [])

  useEffect(() => {
    if (!user) return
    const fetchLogs = async () => {
      setIsLoading(true)
      let query = supabase
        .from('controle_ponto')
        .select('*, funcionarios_rh!inner(nome, departamentos_rh(nome))')
        .order('data', { ascending: false })

      if (user?.app_role === 'funcionario' && user?.funcionario_id) {
        query = query.eq('funcionario_id', user.funcionario_id)
      }

      if (dateRange?.from) query = query.gte('data', format(dateRange.from, 'yyyy-MM-dd'))
      if (dateRange?.to) query = query.lte('data', format(dateRange.to, 'yyyy-MM-dd'))

      const { data } = await query
      if (data) setLogs(data)
      setIsLoading(false)
    }
    fetchLogs()
  }, [user, dateRange])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const dept = log.funcionarios_rh?.departamentos_rh?.nome || ''
      return selectedDept === 'Todos' || dept === selectedDept
    })
  }, [logs, selectedDept])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Controle de Ponto
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitore a assiduidade e jornada de trabalho da equipe.
          </p>
        </div>
      </div>

      <Card className="shadow-none border-border">
        <CardHeader className="pb-3 border-b border-border bg-transparent">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-4 w-4" /> Registros
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="w-full sm:w-[180px] bg-transparent">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos Deptos</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.nome}>
                      {d.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full sm:w-[260px] justify-start text-left font-normal bg-transparent',
                      !dateRange && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd/MM/yyyy')} -{' '}
                          {format(dateRange.to, 'dd/MM/yyyy')}
                        </>
                      ) : (
                        format(dateRange.from, 'dd/MM/yyyy')
                      )
                    ) : (
                      <span>Selecione o período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-border rounded-none" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Saída</TableHead>
                <TableHead className="text-center">Total Horas</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground text-xs uppercase tracking-widest"
                  >
                    Nenhum registro encontrado para os filtros selecionados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const status = STATUS_CONFIG[log.status] || {
                    label: log.status,
                    color: 'bg-transparent text-muted-foreground border-border',
                  }
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.funcionarios_rh?.nome || 'Desconhecido'}
                        <div className="text-[10px] text-muted-foreground font-normal uppercase tracking-widest mt-1">
                          {log.funcionarios_rh?.departamentos_rh?.nome}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(log.data + 'T12:00:00'), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        {log.hora_entrada ? log.hora_entrada.substring(0, 5) : '-'}
                      </TableCell>
                      <TableCell>{log.hora_saida ? log.hora_saida.substring(0, 5) : '-'}</TableCell>
                      <TableCell className="text-center font-medium">
                        {log.total_horas ? Number(log.total_horas).toFixed(2) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(status.color, 'uppercase tracking-widest text-[10px]')}
                        >
                          {status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
