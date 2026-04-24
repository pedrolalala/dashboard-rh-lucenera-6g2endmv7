import { useState, useEffect } from 'react'
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
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export type Employee = {
  id: string
  name: string
  departmentId: string
  departmentName: string
  role: string
  status: 'Ativo' | 'Inativo'
  email: string
  phone: string
  cpf: string
  admissionDate: string
  salary: number
  comissao_padrao?: number
}

export default function Funcionarios() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<{ id: string; nome: string }[]>([])
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('Todos')
  const [isLoading, setIsLoading] = useState(true)

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingEmp, setEditingEmp] = useState<Employee | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const fetchEmployees = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('funcionarios').select('*, departamentos(nome)')
    if (data) {
      setEmployees(
        data.map((d: any) => ({
          id: d.id,
          name: d.nome,
          email: d.email,
          phone: d.telefone || '',
          cpf: d.cpf || '',
          admissionDate: d.data_admissao
            ? new Date(d.data_admissao).toISOString().split('T')[0]
            : '',
          departmentId: d.departamento_id || '',
          departmentName: d.departamentos?.nome || 'Sem Departamento',
          role: d.cargo || '',
          salary: Number(d.salario_base) || 0,
          comissao_padrao: Number(d.comissao_padrao) || 0,
          status: (d.status as 'Ativo' | 'Inativo') || 'Ativo',
        })),
      )
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (user && user.app_role === 'admin') {
      fetchEmployees()
      supabase
        .from('departamentos')
        .select('*')
        .then(({ data }) => {
          if (data) setDepartments(data)
        })
    }
  }, [user])

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
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase())
    const matchesDept = deptFilter === 'Todos' || emp.departmentId === deptFilter
    const isAtivo = emp.status === 'Ativo'
    return matchesSearch && matchesDept && isAtivo
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
    const payload = {
      nome: data.name,
      email: data.email,
      telefone: data.phone,
      cpf: data.cpf,
      data_admissao: data.admissionDate ? new Date(data.admissionDate).toISOString() : null,
      departamento_id: data.departmentId,
      cargo: data.role,
      salario_base: data.salary,
      comissao_padrao: data.comissao_padrao,
      status: data.status,
    }

    if (editingEmp) {
      const { error } = await supabase.from('funcionarios').update(payload).eq('id', editingEmp.id)
      if (!error) {
        toast({ title: 'Funcionário atualizado com sucesso!' })
        fetchEmployees()
        setIsSheetOpen(false)
      } else {
        toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' })
      }
    } else {
      const { error } = await supabase.from('funcionarios').insert(payload)
      if (!error) {
        toast({ title: 'Funcionário criado com sucesso!' })
        fetchEmployees()
        setIsSheetOpen(false)
      } else {
        toast({ title: 'Erro ao criar', description: error.message, variant: 'destructive' })
      }
    }
  }

  const confirmDelete = async () => {
    if (deleteId) {
      const { error } = await supabase.from('funcionarios').delete().eq('id', deleteId)
      if (!error) {
        toast({ title: 'Funcionário excluído.' })
        fetchEmployees()
      } else {
        toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
      }
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Funcionários Ativos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os registros do quadro atual de colaboradores ativos.
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
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-[200px] bg-transparent">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os Departamentos</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.nome}
                    </SelectItem>
                  ))}
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
              departments={departments}
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
                  departments={departments}
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
              Esta ação não pode ser desfeita. O registro será removido permanentemente.
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
