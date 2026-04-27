import { useState, useEffect, useMemo, useCallback } from 'react'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, Loader2, Pencil, Trash2, Plus, UserX } from 'lucide-react'
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
import { FaltasDialog } from './FaltasDialog'
import { useToast } from '@/hooks/use-toast'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  ausente: {
    label: 'Falta Integral',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  },
  falta_injustificada: {
    label: 'Falta Injustificada',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  },
  meio_periodo: {
    label: 'Meio Período',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  },
  atestado: {
    label: 'Atestado Médico',
    color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  },
  licenca_medica: {
    label: 'Licença Médica',
    color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  },
  licenca_maternidade: {
    label: 'Licença Maternidade',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  licenca_paternidade: {
    label: 'Licença Paternidade',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  licenca_obito: {
    label: 'Licença Óbito',
    color: 'bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20',
  },
  licenca_casamento: {
    label: 'Licença Casamento',
    color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  },
  licenca_militar: {
    label: 'Licença Militar',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  },
}

export function FaltasTabela({
  refreshTrigger,
  onRefresh,
}: {
  refreshTrigger: number
  onRefresh?: () => void
}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [logs, setLogs] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedDept, setSelectedDept] = useState('Todos')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [recordToEdit, setRecordToEdit] = useState<any>(null)

  const canManage = user?.app_role === 'admin' || user?.app_role === 'gerente'

  useEffect(() => {
    if (canManage) {
      supabase
        .from('departamentos')
        .select('*')
        .then(({ data }) => data && setDepartments(data))
    }
  }, [canManage])

  const fetchLogs = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    let query = supabase
      .from('controle_ponto')
      .select('*, funcionarios!inner(nome, departamentos(nome))')
      .in('status', Object.keys(STATUS_CONFIG))
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
      (log) => selectedDept === 'Todos' || log.funcionarios?.departamentos?.nome === selectedDept,
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja realmente remover este registro?')) return
    const { error } = await supabase.from('controle_ponto').delete().eq('id', id)
    if (error) {
      toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Registro removido com sucesso' })
      fetchLogs()
      onRefresh?.()
    }
  }

  return (
    <>
      <Card className="shadow-none border-border bg-background">
        <CardHeader className="pb-4 border-b border-border bg-transparent">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
            <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
              <UserX className="h-4 w-4" /> Histórico de Registros
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                {canManage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdd}
                    className="h-9 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Novo Registro
                  </Button>
                )}

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
                <TableHead>Tipo</TableHead>
                <TableHead>Justificativa</TableHead>
                {canManage && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={canManage ? 5 : 4} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={canManage ? 5 : 4}
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
                        {log.funcionarios?.nome || 'Desconhecido'}
                        <div className="text-[10px] text-muted-foreground font-normal uppercase tracking-widest mt-1">
                          {log.funcionarios?.departamentos?.nome}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {format(new Date(log.data + 'T12:00:00'), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            status.color,
                            'uppercase tracking-widest text-[10px] font-semibold whitespace-nowrap',
                          )}
                        >
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-[300px] truncate">
                        {log.justificativa || '-'}
                      </TableCell>
                      {canManage && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(log)}
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                              onClick={() => handleDelete(log.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <FaltasDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={recordToEdit}
        onSuccess={() => {
          fetchLogs()
          onRefresh?.()
        }}
      />
    </>
  )
}
