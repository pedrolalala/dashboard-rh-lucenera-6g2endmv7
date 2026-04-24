import { useState, useMemo, useEffect } from 'react'
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
import { VacationTable } from '@/components/vacation/VacationTable'
import { VacationForm } from '@/components/vacation/VacationForm'
import { VacationCalendar } from '@/components/vacation/VacationCalendar'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export type VacationStatus = 'Pendente' | 'Aprovado' | 'Rejeitado'

export interface VacationRequest {
  id: string
  employeeId: string
  employeeName: string
  department: string
  startDate: Date
  endDate: Date
  days: number
  status: VacationStatus
}

export default function Ferias() {
  const [requests, setRequests] = useState<VacationRequest[]>([])
  const [deptFilter, setDeptFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()

  const fetchRequests = async () => {
    let query = supabase.from('ferias').select('*, funcionarios(id, nome, departamentos(nome))')

    if (user?.app_role === 'funcionario' && user?.funcionario_id) {
      query = query.eq('funcionario_id', user.funcionario_id)
    }

    const { data } = await query
    if (data) {
      setRequests(
        data.map((d: any) => ({
          id: d.id,
          employeeId: d.funcionarios?.id || '',
          employeeName: d.funcionarios?.nome || '',
          department: d.funcionarios?.departamentos?.nome || '',
          startDate: new Date(d.data_inicio),
          endDate: new Date(d.data_fim),
          days: d.dias,
          status: (d.status as VacationStatus) || 'Pendente',
        })),
      )
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [user])

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchDept = deptFilter === 'Todos' || req.department === deptFilter
      const matchStatus = statusFilter === 'Todos' || req.status === statusFilter
      return matchDept && matchStatus
    })
  }, [requests, deptFilter, statusFilter])

  const handleUpdateStatus = async (id: string, status: VacationRequest['status']) => {
    const { error } = await supabase.from('ferias').update({ status }).eq('id', id)
    if (!error) {
      toast({ title: `Solicitação marcada como ${status}` })
      fetchRequests()
    }
  }

  const handleSuccess = () => {
    toast({ title: 'Solicitação criada com sucesso' })
    fetchRequests()
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Gestão de Férias
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie solicitações e o calendário de disponibilidade da equipe.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="uppercase tracking-widest text-xs">
          <PlusCircle className="mr-2 h-4 w-4" /> Nova Solicitação
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <VacationCalendar requests={requests} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-none border-border h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border bg-transparent">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <CardTitle className="text-sm uppercase tracking-widest">
                  Solicitações de Férias
                </CardTitle>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={deptFilter} onValueChange={setDeptFilter}>
                    <SelectTrigger className="w-[150px] bg-transparent">
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
                    <SelectTrigger className="w-[140px] bg-transparent">
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

      <VacationForm open={isFormOpen} onOpenChange={setIsFormOpen} onSuccess={handleSuccess} />
    </div>
  )
}
