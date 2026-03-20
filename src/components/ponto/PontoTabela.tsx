import { useState, useEffect, useMemo, useCallback } from 'react'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, Clock, Loader2, Pencil, Info, Plus } from 'lucide-react'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { PontoDialog } from './PontoDialog'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  presente: {
    label: 'Presente',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  },
  ausente: {
    label: 'Ausente',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  },
  atraso: {
    label: 'Atraso',
    color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  },
}

export function PontoTabela({ refreshTrigger }: { refreshTrigger: number }) {
  const { user } = useAuth()
  const [logs, setLogs] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedDept, setSelectedDept] = useState('Todos')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [recordToEdit, setRecordToEdit] = useState<any>(null)

  const canManage = user?.app_role === 'admin' || user?.app_role === 'gerente'

  useEffect(() => {
    if (canManage) {
      supabase
        .from('departamentos_rh')
        .select('*')
        .then(({ data }) => data && setDepartments(data))
    }
  }, [canManage])

  const fetchLogs = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    let query = supabase
      .from('controle_ponto')
      .select('*, funcionarios_rh!inner(nome, departamentos_rh(nome))')
      .order('data', { ascending: false })

    if (user.app_role === 'funcionario' && user.funcionario_id) {
      query = query.eq('funcionario_id', user.funcionario_id)
    }
    if (dateRange?.from) query = query.gte('data', format(dateRange.from, 'yyyy-MM-dd'))
    if (dateRange?.to) query = query.lte('data', format(dateRange.to, 'yyyy-MM-dd'))

    const { data } = await query
    if (data) setLogs(data)
    setIsLoading(false)
  }, [user, dateRange])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs, refreshTrigger])

  const filteredLogs = useMemo(() => {
    return logs.filter(
      (log) =>
        selectedDept === 'Todos' || log.funcionarios_rh?.departamentos_rh?.nome === selectedDept,
    )
  }, [logs, selectedDept])

  const handleEdit = (record: any) => {
    setRecordToEdit(record)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setRecordToEdit(null)
    setDialogOpen(true)
  }

  return (
    <>
      <Card className="shadow-none border-border bg-background">
        <CardHeader className="pb-4 border-b border-border bg-transparent">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
            <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-4 w-4" /> Registros de Ponto
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAdd}
                  className="h-9 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" /> Novo Registro
                </Button>

                {canManage && (
                  <Select value={selectedDept} onValueChange={setSelectedDept}>
                    <SelectTrigger className="w-full sm:w-[160px] bg-transparent text-xs h-9">
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
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full sm:w-[240px] justify-start text-left font-normal bg-transparent text-xs h-9',
                        !dateRange && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {dateRange?.from
                        ? dateRange.to
                          ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
                          : format(dateRange.from, 'dd/MM/yyyy')
                        : 'Selecione o período'}
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
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora Entrada</TableHead>
                <TableHead>Hora Saída</TableHead>
                <TableHead className="text-center">Total Horas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground text-xs uppercase tracking-widest"
                  >
                    Nenhum registro encontrado no período.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const status = STATUS_CONFIG[log.status] || {
                    label: log.status || 'Desconhecido',
                    color: 'bg-transparent text-muted-foreground border-border',
                  }
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-sm">
                        {log.funcionarios_rh?.nome || 'Desconhecido'}
                        <div className="text-[10px] text-muted-foreground font-normal uppercase tracking-widest mt-1">
                          {log.funcionarios_rh?.departamentos_rh?.nome}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(log.data + 'T12:00:00'), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.hora_entrada ? log.hora_entrada.substring(0, 5) : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.hora_saida ? log.hora_saida.substring(0, 5) : '-'}
                      </TableCell>
                      <TableCell className="text-center font-medium text-sm">
                        {log.total_horas ? `${Number(log.total_horas).toFixed(2)}h` : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <Badge
                            variant="outline"
                            className={cn(
                              status.color,
                              'uppercase tracking-widest text-[10px] font-semibold',
                            )}
                          >
                            {status.label}
                          </Badge>
                          {log.is_edited && (
                            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium flex items-center gap-1">
                              <Pencil className="h-2 w-2" /> Editado
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {log.is_edited && log.edit_history && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-help">
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="left"
                                className="text-xs max-w-[250px] p-3 z-50"
                              >
                                <p className="font-semibold mb-2 uppercase tracking-widest text-[10px]">
                                  Histórico de Alterações
                                </p>
                                {log.edit_history.map((h: any, i: number) => (
                                  <div
                                    key={i}
                                    className="mb-2 last:mb-0 border-b border-border/50 pb-2 last:border-0 last:pb-0"
                                  >
                                    <span className="block text-muted-foreground text-[10px] mb-1">
                                      {new Date(h.edited_at).toLocaleString('pt-BR')}
                                    </span>
                                    <span className="block text-[11px] leading-tight mb-1">
                                      <span className="font-medium">Motivo:</span> {h.reason}
                                    </span>
                                    <span className="block text-[10px] text-muted-foreground">
                                      {h.old_entrada?.substring(0, 5) || '--:--'} às{' '}
                                      {h.old_saida?.substring(0, 5) || '--:--'}
                                      {' → '}
                                      {h.new_entrada?.substring(0, 5) || '--:--'} às{' '}
                                      {h.new_saida?.substring(0, 5) || '--:--'}
                                    </span>
                                  </div>
                                ))}
                              </TooltipContent>
                            </Tooltip>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(log)}
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PontoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={recordToEdit}
        onSuccess={fetchLogs}
      />
    </>
  )
}
