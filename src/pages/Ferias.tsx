import { useState, useMemo } from 'react'
import { PlusCircle, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { initialRequests, VacationRequest } from '@/data/vacations'
import { VacationTable } from '@/components/vacation/VacationTable'
import { VacationForm } from '@/components/vacation/VacationForm'
import { VacationCalendar } from '@/components/vacation/VacationCalendar'

export default function Ferias() {
  const [requests, setRequests] = useState<VacationRequest[]>(initialRequests)
  const [deptFilter, setDeptFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchDept = deptFilter === 'Todos' || req.department === deptFilter
      const matchStatus = statusFilter === 'Todos' || req.status === statusFilter
      return matchDept && matchStatus
    })
  }, [requests, deptFilter, statusFilter])

  const handleAddRequest = (newReq: VacationRequest) => {
    setRequests((prev) => [newReq, ...prev])
    setIsFormOpen(false)
  }

  const handleUpdateStatus = (id: string, status: VacationRequest['status']) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)))
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Gestão de Férias</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie solicitações e o calendário de disponibilidade da equipe.
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Nova Solicitação
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <VacationCalendar requests={requests} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm border-blue-100/50 h-full flex flex-col">
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <CardTitle className="text-lg">Solicitações de Férias</CardTitle>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={deptFilter} onValueChange={setDeptFilter}>
                    <SelectTrigger className="w-[150px] bg-white">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos Deptos</SelectItem>
                      <SelectItem value="TI">TI</SelectItem>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="RH">RH</SelectItem>
                      <SelectItem value="Operações">Operações</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos Status</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Aprovado">Aprovado</SelectItem>
                      <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <VacationTable data={filteredRequests} onUpdateStatus={handleUpdateStatus} />
            </CardContent>
          </Card>
        </div>
      </div>

      <VacationForm open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleAddRequest} />
    </div>
  )
}
