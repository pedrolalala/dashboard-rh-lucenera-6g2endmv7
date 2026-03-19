import { useState, useMemo, useEffect } from 'react'
import { Search, Filter, PlusCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmployeeTable } from '@/components/EmployeeTable'
import { EmployeeForm } from '@/components/EmployeeForm'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export type Employee = {
  id: string
  name: string
  department: string
  role: string
  status: 'Ativo' | 'Inativo'
  email: string
  phone: string
  cpf: string
  admissionDate: string
  salary: number
}

export default function Funcionarios() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<{ id: string; nome: string }[]>([])
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('Todos')

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingEmp, setEditingEmp] = useState<Employee | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { user } = useAuth()
  const { toast } = useToast()

  const fetchEmployees = async () => {
    const { data } = await supabase.from('funcionarios_rh').select('*, departamentos_rh(nome)')
    if (data) {
      setEmployees(
        data.map((d) => ({
          id: d.id,
          name: d.nome,
          email: d.email,
          phone: d.telefone || '',
          cpf: d.cpf || '',
          admissionDate: d.data_admissao
            ? new Date(d.data_admissao).toISOString().split('T')[0]
            : '',
          department: (d.departamentos_rh as any)?.nome || '',
          role: d.cargo || '',
          salary: Number(d.salario_base) || 0,
          status: (d.status as 'Ativo' | 'Inativo') || 'Ativo',
        })),
      )
    }
  }

  useEffect(() => {
    fetchEmployees()
    supabase
      .from('departamentos_rh')
      .select('*')
      .then(({ data }) => {
        if (data) setDepartments(data)
      })
  }, [])

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase())
      const matchesDept = deptFilter === 'Todos' || emp.department === deptFilter
      return matchesSearch && matchesDept
    })
  }, [search, deptFilter, employees])

  const handleCreate = () => {
    setEditingEmp(undefined)
    setIsSheetOpen(true)
  }

  const handleEdit = (emp: Employee) => {
    setEditingEmp(emp)
    setIsSheetOpen(true)
  }

  const handleSave = async (data: any) => {
    const dept = departments.find((d) => d.nome === data.department)
    const payload = {
      nome: data.name,
      email: data.email,
      telefone: data.phone,
      cpf: data.cpf,
      data_admissao: data.admissionDate ? new Date(data.admissionDate).toISOString() : null,
      departamento_id: dept?.id,
      cargo: data.role,
      salario_base: data.salary,
      status: data.status,
    }

    if (editingEmp) {
      const { error } = await supabase
        .from('funcionarios_rh')
        .update(payload)
        .eq('id', editingEmp.id)
      if (!error) {
        toast({ title: 'Funcionário atualizado com sucesso!' })
        fetchEmployees()
        setIsSheetOpen(false)
      }
    } else {
      const { error } = await supabase.from('funcionarios_rh').insert(payload)
      if (!error) {
        toast({ title: 'Funcionário criado com sucesso!' })
        fetchEmployees()
        setIsSheetOpen(false)
      }
    }
  }

  const confirmDelete = async () => {
    if (deleteId) {
      const { error } = await supabase.from('funcionarios_rh').delete().eq('id', deleteId)
      if (!error) {
        toast({ title: 'Funcionário excluído.' })
        fetchEmployees()
      }
      setDeleteId(null)
    }
  }

  const canEdit = user?.app_role === 'admin' || user?.app_role === 'gerente'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Quadro de Funcionários</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os registros de todos os colaboradores da empresa.
          </p>
        </div>
        {canEdit && (
          <Button
            onClick={handleCreate}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Colaborador
          </Button>
        )}
      </div>

      <Card className="shadow-sm border-blue-100/50">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-b bg-slate-50/50">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                className="pl-9 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os Departamentos</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.nome}>
                      {d.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <EmployeeTable
            data={filteredEmployees}
            onEdit={handleEdit}
            onDelete={setDeleteId}
            canEdit={canEdit}
          />
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>{editingEmp ? 'Editar Funcionário' : 'Novo Funcionário'}</SheetTitle>
            <SheetDescription>
              {editingEmp
                ? 'Atualize as informações do colaborador abaixo.'
                : 'Preencha os dados para registrar um novo colaborador no sistema.'}
            </SheetDescription>
          </SheetHeader>
          <EmployeeForm
            employee={editingEmp}
            departments={departments}
            onSubmit={handleSave}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir este funcionário?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O registro do colaborador será removido
              permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
