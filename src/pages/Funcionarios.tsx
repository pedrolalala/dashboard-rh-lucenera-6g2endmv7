import { useState, useMemo } from 'react'
import { Search, Filter, PlusCircle } from 'lucide-react'
import { employees as initialEmployees, type Employee } from '@/data/mock'
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

export default function Funcionarios() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('Todos')

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingEmp, setEditingEmp] = useState<Employee | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

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

  const handleSave = (data: Omit<Employee, 'id'>) => {
    if (editingEmp) {
      setEmployees(
        employees.map((e) => (e.id === editingEmp.id ? ({ ...data, id: e.id } as Employee) : e)),
      )
    } else {
      setEmployees([{ ...data, id: Date.now().toString() } as Employee, ...employees])
    }
    setIsSheetOpen(false)
  }

  const confirmDelete = () => {
    if (deleteId) {
      setEmployees(employees.filter((e) => e.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Quadro de Funcionários</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os registros de todos os colaboradores da empresa.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Colaborador
        </Button>
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
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Operações">Operações</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <EmployeeTable data={filteredEmployees} onEdit={handleEdit} onDelete={setDeleteId} />
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
