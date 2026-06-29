import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, PlusCircle, ShieldAlert, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmployeeTable } from '@/components/EmployeeTable'
import { EmployeeForm } from '@/components/EmployeeForm'
import { EmployeeFinance } from '@/components/EmployeeFinance'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type EmployeeComplete,
} from '@/services/funcionarios'

export type Employee = EmployeeComplete

export default function Funcionarios() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState('')
  const [empresaFilter, setEmpresaFilter] = useState('Todas')
  const [statusFilter, setStatusFilter] = useState('Ativos')
  const [isLoading, setIsLoading] = useState(true)

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingEmp, setEditingEmp] = useState<Employee | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const loadEmployees = async () => {
    setIsLoading(true)
    try {
      const data = await fetchEmployees()
      setEmployees(data)
    } catch (err: any) {
      toast({ title: 'Erro ao carregar', description: err.message, variant: 'destructive' })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (user && user.app_role === 'admin') {
      loadEmployees()
    }
  }, [user])

  const empresaOptions = useMemo(() => {
    const set = new Set<string>()
    employees.forEach((e) => {
      if (e.empresa) set.add(e.empresa)
    })
    return Array.from(set).sort()
  }, [employees])

  if (user && !user.app_role) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    )
  }

  if (user && user.app_role !== 'admin') {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 animate-fade-in-up">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h2 className="text-xl font-light uppercase tracking-widest text-foreground">
          Acesso Negado
        </h2>
        <p className="text-muted-foreground max-w-md text-center text-sm">
          Apenas usuários com perfil de administrador têm permissão para acessar e gerenciar o
          quadro de funcionários.
        </p>
        <Button onClick={() => navigate('/')} className="mt-4 uppercase tracking-widest text-xs">
          Voltar para o Início
        </Button>
      </div>
    )
  }

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.nome.toLowerCase().includes(search.toLowerCase())
    const matchesEmpresa = empresaFilter === 'Todas' || emp.empresa === empresaFilter
    const matchesStatus =
      statusFilter === 'Todos' ||
      (statusFilter === 'Ativos' && emp.ativo) ||
      (statusFilter === 'Inativos' && !emp.ativo)
    return matchesSearch && matchesEmpresa && matchesStatus
  })

  const handleCreate = () => {
    setEditingEmp(undefined)
    setIsSheetOpen(true)
  }

  const handleEdit = (emp: Employee) => {
    setEditingEmp(emp)
    setIsSheetOpen(true)
  }

  const handleSave = async (data: any) => {
    try {
      if (editingEmp) {
        await updateEmployee(editingEmp.id, data)
        toast({ title: 'Funcionário atualizado com sucesso!' })
      } else {
        await createEmployee(data)
        toast({ title: 'Funcionário criado com sucesso!' })
      }
      await loadEmployees()
      setIsSheetOpen(false)
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' })
    }
  }

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteEmployee(deleteId)
        toast({ title: 'Funcionário excluído.' })
        await loadEmployees()
      } catch (err: any) {
        toast({ title: 'Erro ao excluir', description: err.message, variant: 'destructive' })
      }
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Colaboradores
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão centralizada de colaboradores com dados cadastrais, financeiros e benefícios.
          </p>
        </div>
        <Button onClick={handleCreate} className="uppercase tracking-widest text-xs">
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Colaborador
        </Button>
      </div>

      <Card className="shadow-none border-border">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-b border-border bg-transparent">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                className="pl-9 bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
                <SelectTrigger className="w-full sm:w-[160px] bg-transparent">
                  <SelectValue placeholder="Empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas as Empresas</SelectItem>
                  {empresaOptions.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-transparent">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativos">Ativos</SelectItem>
                  <SelectItem value="Inativos">Inativos</SelectItem>
                  <SelectItem value="Todos">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : (
            <EmployeeTable data={filteredEmployees} onEdit={handleEdit} onDelete={setDeleteId} />
          )}
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="uppercase tracking-widest font-light">
              {editingEmp ? 'Gerenciar Funcionário' : 'Novo Funcionário'}
            </SheetTitle>
            <SheetDescription>
              {editingEmp
                ? 'Gerencie os dados cadastrais e financeiros do colaborador.'
                : 'Preencha os dados para registrar um novo colaborador no sistema.'}
            </SheetDescription>
          </SheetHeader>

          {!editingEmp ? (
            <EmployeeForm
              employee={undefined}
              onSubmit={handleSave}
              onCancel={() => setIsSheetOpen(false)}
            />
          ) : (
            <Tabs defaultValue="dados" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="dados" className="uppercase tracking-widest text-[10px]">
                  Dados Pessoais
                </TabsTrigger>
                <TabsTrigger value="financeiro" className="uppercase tracking-widest text-[10px]">
                  Financeiro / Folha
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dados" className="mt-0">
                <EmployeeForm
                  employee={editingEmp}
                  onSubmit={handleSave}
                  onCancel={() => setIsSheetOpen(false)}
                />
              </TabsContent>
              <TabsContent value="financeiro" className="mt-0">
                <EmployeeFinance employee={editingEmp} />
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="uppercase tracking-widest font-light">
              Excluir Funcionário?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O registro será removido permanentemente de todas as
              tabelas relacionadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="uppercase tracking-widest text-xs">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 uppercase tracking-widest text-xs"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
