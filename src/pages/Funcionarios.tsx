import { useState, useMemo } from 'react'
import { Search, Filter, MoreHorizontal } from 'lucide-react'
import { employees } from '@/data/mock'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Funcionarios() {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('Todos')

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase())
      const matchesDept = deptFilter === 'Todos' || emp.department === deptFilter
      return matchesSearch && matchesDept
    })
  }, [search, deptFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Quadro de Funcionários</h1>
        <Button className="bg-secondary text-secondary-foreground">Adicionar Colaborador</Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-b">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-[180px]">
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

          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage
                          src={`https://img.usecurling.com/ppl/thumbnail?seed=${emp.id}`}
                        />
                        <AvatarFallback>{emp.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{emp.name}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {emp.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">#{emp.id}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={emp.status === 'Ativo' ? 'default' : 'secondary'}
                      className={
                        emp.status === 'Ativo'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600'
                      }
                    >
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhum colaborador encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
