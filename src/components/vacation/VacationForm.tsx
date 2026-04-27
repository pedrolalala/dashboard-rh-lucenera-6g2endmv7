import { useState, useMemo, useEffect } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
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
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
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
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [employees, setEmployees] = useState<EmployeeOption[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (open) {
      const fetchEmps = async () => {
        let query = supabase
          .from('funcionarios')
          .select('id, nome')
          .eq('status', 'Ativo')
          .order('nome')
        if (user?.app_role === 'funcionario' && user.funcionario_id) {
          query = query.eq('id', user.funcionario_id)
        }
        const { data } = await query
        if (data) {
          setEmployees(data.map((d) => ({ id: d.id, name: d.nome })))
          if (requestToEdit) {
            setEmployeeId(requestToEdit.employeeId)
            setStartDate(requestToEdit.startDate)
            setEndDate(requestToEdit.endDate)
          } else if (user?.app_role === 'funcionario' && user.funcionario_id) {
            setEmployeeId(user.funcionario_id)
          }
        }
      }
      fetchEmps()
    } else {
      if (user?.app_role !== 'funcionario') setEmployeeId('')
      setStartDate(undefined)
      setEndDate(undefined)
    }
  }, [open, user, requestToEdit])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeId || !startDate || !endDate || calculatedDays <= 0) return

    if (requestToEdit) {
      const { error } = await supabase
        .from('ferias')
        .update({
          data_inicio: format(startDate, 'yyyy-MM-dd'),
          data_fim: format(endDate, 'yyyy-MM-dd'),
          dias: calculatedDays,
        })
        .eq('id', requestToEdit.id)

      if (!error) {
        onSuccess()
        onOpenChange(false)
      }
    } else {
      const { error } = await supabase.from('ferias').insert({
        funcionario_id: employeeId,
        data_inicio: format(startDate, 'yyyy-MM-dd'),
        data_fim: format(endDate, 'yyyy-MM-dd'),
        dias: calculatedDays,
        status: 'Pendente',
      })

      if (!error) {
        onSuccess()
        onOpenChange(false)
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
              className="bg-muted text-foreground border-border rounded-none font-medium cursor-not-allowed text-xs"
            />
          </div>

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
              disabled={!employeeId || calculatedDays <= 0}
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
