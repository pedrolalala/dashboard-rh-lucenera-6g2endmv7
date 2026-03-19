import { useState, useMemo, useEffect } from 'react'
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
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

interface EmployeeOption {
  id: string
  name: string
}

interface VacationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function VacationForm({ open, onOpenChange, onSuccess }: VacationFormProps) {
  const [employeeId, setEmployeeId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [employees, setEmployees] = useState<EmployeeOption[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (open) {
      const fetchEmps = async () => {
        let query = supabase.from('funcionarios_rh').select('id, nome')
        if (user?.app_role === 'funcionario' && user.funcionario_id) {
          query = query.eq('id', user.funcionario_id)
        }
        const { data } = await query
        if (data) {
          setEmployees(data.map((d) => ({ id: d.id, name: d.nome })))
          if (user?.app_role === 'funcionario' && user.funcionario_id) {
            setEmployeeId(user.funcionario_id)
          }
        }
      }
      fetchEmps()
    } else {
      if (user?.app_role !== 'funcionario') setEmployeeId('')
      setStartDate('')
      setEndDate('')
    }
  }, [open, user])

  const calculatedDays = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(`${startDate}T12:00:00`)
      const end = new Date(`${endDate}T12:00:00`)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays > 0 ? diffDays : 0
    }
    return 0
  }, [startDate, endDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeId || !startDate || !endDate || calculatedDays <= 0) return

    const { error } = await supabase.from('ferias').insert({
      funcionario_id: employeeId,
      data_inicio: startDate,
      data_fim: endDate,
      dias: calculatedDays,
      status: 'Pendente',
    })

    if (!error) {
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Férias</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para solicitar um novo período de ausência.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Colaborador</Label>
            <Select
              value={employeeId}
              onValueChange={setEmployeeId}
              required
              disabled={user?.app_role === 'funcionario'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um funcionário" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dias Totais (Calculado)</Label>
            <Input
              type="number"
              value={calculatedDays}
              readOnly
              className="bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!employeeId || calculatedDays <= 0}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Solicitar Férias
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
