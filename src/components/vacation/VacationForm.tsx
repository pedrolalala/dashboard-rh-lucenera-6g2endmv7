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
import { VacationRequest } from '@/data/vacations'
import { employees } from '@/data/mock'

interface VacationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (req: VacationRequest) => void
}

export function VacationForm({ open, onOpenChange, onSubmit }: VacationFormProps) {
  const [employeeId, setEmployeeId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const selectedEmployee = useMemo(() => employees.find((e) => e.id === employeeId), [employeeId])

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

  useEffect(() => {
    if (!open) {
      setEmployeeId('')
      setStartDate('')
      setEndDate('')
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee || !startDate || !endDate || calculatedDays <= 0) return

    const newReq: VacationRequest = {
      id: `req-${Date.now()}`,
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      department: selectedEmployee.department,
      startDate: new Date(`${startDate}T12:00:00`),
      endDate: new Date(`${endDate}T12:00:00`),
      days: calculatedDays,
      status: 'Pendente',
    }

    onSubmit(newReq)
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
            <Select value={employeeId} onValueChange={setEmployeeId} required>
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
