import { useState, useMemo, useEffect } from 'react'
import { CalendarIcon, AlertTriangle } from 'lucide-react'
import { format, addYears } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import type { VacationRequest } from '@/pages/Ferias'

interface EmployeeOption {
  id: string
  name: string
}

interface VacationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  requestToEdit?: VacationRequest | null
}

export function VacationForm({ open, onOpenChange, onSuccess, requestToEdit }: VacationFormProps) {
  const [employeeId, setEmployeeId] = useState('')
  const [periodoId, setPeriodoId] = useState('')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [employees, setEmployees] = useState<EmployeeOption[]>([])
  const [balances, setBalances] = useState<any[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      const fetchEmps = async () => {
        let query = supabase
          .from('funcionarios')
          .select('id, nome, data_admissao')
          .eq('status', 'Ativo')
          .order('nome')
        if (user?.app_role === 'funcionario' && user.funcionario_id) {
          query = query.eq('id', user.funcionario_id)
        }
        const { data } = await query
        if (data) {
          setEmployees(
            data.map((d: any) => ({ id: d.id, name: d.nome, dataAdmissao: d.data_admissao })),
          )
          if (requestToEdit) {
            setEmployeeId(requestToEdit.employeeId)
            setStartDate(requestToEdit.startDate)
            setEndDate(requestToEdit.endDate)
            if (requestToEdit.periodoId) {
              setPeriodoId(requestToEdit.periodoId)
            }
          } else if (user?.app_role === 'funcionario' && user.funcionario_id) {
            setEmployeeId(user.funcionario_id)
          }
        }
      }
      fetchEmps()
    } else {
      if (user?.app_role !== 'funcionario') {
        setEmployeeId('')
        setPeriodoId('')
      }
      setStartDate(undefined)
      setEndDate(undefined)
    }
  }, [open, user, requestToEdit])

  useEffect(() => {
    if (employeeId && open) {
      supabase
        .from('vw_controle_ferias_clt')
        .select('*')
        .eq('funcionario_id', employeeId)
        .then(({ data }) => {
          setBalances(data || [])
          if (data && data.length > 0 && !requestToEdit) {
            setPeriodoId(data[0].periodo_id)
          } else if (requestToEdit && requestToEdit.periodoId) {
            setPeriodoId(requestToEdit.periodoId)
          }
        })
    } else {
      setBalances([])
      if (!requestToEdit) setPeriodoId('')
    }
  }, [employeeId, open, requestToEdit])

  const calculatedDays = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate.setHours(12, 0, 0, 0))
      const end = new Date(endDate.setHours(12, 0, 0, 0))
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays > 0 ? diffDays : 0
    }
    return 0
  }, [startDate, endDate])

  const selectedBalance = useMemo(() => {
    if (!periodoId) return null
    return balances.find((b) => b.periodo_id === periodoId)
  }, [periodoId, balances])

  const isExceedingBalance =
    selectedBalance && calculatedDays > (selectedBalance.saldo_disponivel || 0)

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === employeeId),
    [employees, employeeId],
  )
  const dataElegibilidade = useMemo(() => {
    if (selectedEmployee?.dataAdmissao) {
      return addYears(new Date(selectedEmployee.dataAdmissao), 1)
    }
    return null
  }, [selectedEmployee])

  const isEmAquisicao = useMemo(() => {
    if (dataElegibilidade) {
      return new Date() < dataElegibilidade
    }
    return false
  }, [dataElegibilidade])

  const isBloqueadoAquisicao = isEmAquisicao && user?.app_role !== 'admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeId || !startDate || !endDate || calculatedDays <= 0) return
    if (!periodoId) {
      toast({
        title: 'Período obrigatório',
        description: 'É necessário identificar e selecionar um período aquisitivo ativo.',
        variant: 'destructive',
      })
      return
    }
    if (isExceedingBalance) return

    if (requestToEdit) {
      const { error } = await supabase
        .from('ferias')
        .update({
          periodo_aquisitivo_id: periodoId,
          data_inicio: format(startDate, 'yyyy-MM-dd'),
          data_fim: format(endDate, 'yyyy-MM-dd'),
          dias: calculatedDays,
        })
        .eq('id', requestToEdit.id)

      if (!error) {
        onSuccess()
        onOpenChange(false)
      } else {
        toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
      }
    } else {
      const { error } = await supabase.from('ferias').insert({
        funcionario_id: employeeId,
        periodo_aquisitivo_id: periodoId,
        data_inicio: format(startDate, 'yyyy-MM-dd'),
        data_fim: format(endDate, 'yyyy-MM-dd'),
        dias: calculatedDays,
        status: 'Pendente',
      })

      if (!error) {
        onSuccess()
        onOpenChange(false)
      } else {
        toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-none border-border bg-card">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-widest text-sm font-light text-foreground">
            {requestToEdit ? 'Editar Solicitação de Férias' : 'Nova Solicitação de Férias'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground tracking-wide">
            {requestToEdit
              ? 'Altere as datas do período de ausência.'
              : 'Preencha os detalhes para solicitar um novo período de ausência.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Colaborador
            </Label>
            <Select
              value={employeeId}
              onValueChange={setEmployeeId}
              required
              disabled={user?.app_role === 'funcionario' || !!requestToEdit}
            >
              <SelectTrigger className="w-full rounded-none border-border">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border">
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id} className="rounded-none text-xs">
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Período Aquisitivo
            </Label>
            <Select
              value={periodoId}
              onValueChange={setPeriodoId}
              disabled={balances.length === 0 || !!requestToEdit}
            >
              <SelectTrigger className="w-full rounded-none border-border">
                <SelectValue
                  placeholder={
                    balances.length === 0 ? 'Nenhum período (sem CLT)' : 'Selecione o período'
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border">
                {balances.map((b) => (
                  <SelectItem
                    key={b.periodo_id}
                    value={b.periodo_id}
                    className="rounded-none text-xs"
                  >
                    {b.data_inicio ? format(new Date(b.data_inicio), 'dd/MM/yyyy') : ''} a{' '}
                    {b.data_fim ? format(new Date(b.data_fim), 'dd/MM/yyyy') : ''} (Saldo:{' '}
                    {b.saldo_disponivel} dias)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Data Início
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal rounded-none border-border text-xs',
                      !startDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {startDate ? format(startDate, 'dd/MM/yyyy') : <span>Selecione</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-none border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 flex flex-col">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Data Fim
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal rounded-none border-border text-xs',
                      !endDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {endDate ? format(endDate, 'dd/MM/yyyy') : <span>Selecione</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-none border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => (startDate ? date < startDate : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Dias Totais
            </Label>
            <Input
              type="number"
              value={calculatedDays}
              readOnly
              className={cn(
                'bg-muted text-foreground border-border rounded-none font-medium cursor-not-allowed text-xs',
                isExceedingBalance && 'border-destructive text-destructive',
              )}
            />
          </div>

          {isExceedingBalance && (
            <Alert variant="destructive" className="rounded-none border-border">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-[10px] uppercase tracking-widest ml-2">
                A quantidade de dias solicitados ({calculatedDays}) excede o saldo disponível (
                {selectedBalance?.saldo_disponivel || 0}).
                {selectedBalance?.total_faltas > 0 &&
                  ` Bloqueio ativo: O direito a férias foi reduzido devido a ${selectedBalance.total_faltas} falta(s) injustificada(s) no período.`}
              </AlertDescription>
            </Alert>
          )}

          {!periodoId && employeeId && balances.length === 0 && !isEmAquisicao && (
            <Alert variant="destructive" className="rounded-none border-border mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-[10px] uppercase tracking-widest ml-2">
                Não há períodos aquisitivos ativos para este colaborador. O registro é bloqueado.
              </AlertDescription>
            </Alert>
          )}

          {isEmAquisicao && (
            <Alert variant="destructive" className="rounded-none border-border mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-[10px] uppercase tracking-widest ml-2">
                EM AQUISIÇÃO: Colaborador com menos de 1 ano de empresa. Elegível a partir de{' '}
                {dataElegibilidade ? format(dataElegibilidade, 'dd/MM/yyyy') : ''}.
                {isBloqueadoAquisicao ? ' Agendamento bloqueado.' : ' (ADMIN: Bloqueio ignorado)'}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-none text-xs uppercase tracking-widest"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                !employeeId ||
                !periodoId ||
                calculatedDays <= 0 ||
                isExceedingBalance ||
                isBloqueadoAquisicao
              }
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none text-xs uppercase tracking-widest"
            >
              {requestToEdit ? 'Salvar' : 'Solicitar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
