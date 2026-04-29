import { Edit2, Trash2 } from 'lucide-react'
import { type Employee } from '@/pages/Funcionarios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface EmployeeTableProps {
  data: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
}

export function EmployeeTable({ data, onEdit, onDelete }: EmployeeTableProps) {
  return (
    <Table>
      <TableHeader className="bg-muted/10">
        <TableRow>
          <TableHead>Colaborador</TableHead>
          <TableHead>Contato & Endereço</TableHead>
          <TableHead>Departamento</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Salários</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={8}
              className="h-24 text-center text-muted-foreground uppercase tracking-widest text-xs"
            >
              Nenhum colaborador encontrado.
            </TableCell>
          </TableRow>
        )}
        {data.map((emp) => (
          <TableRow key={emp.id} className="group">
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <Avatar className="size-8 border border-border">
                  <AvatarFallback className="bg-muted text-foreground font-medium text-xs">
                    {emp.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{emp.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm">{emp.email}</span>
                <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                  {emp.phone && <span>{emp.phone}</span>}
                  {emp.cpf && <span>CPF: {emp.cpf}</span>}
                </div>
                {emp.endereco_completo && (
                  <span
                    className="text-xs text-muted-foreground line-clamp-1"
                    title={emp.endereco_completo}
                  >
                    {emp.endereco_completo}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>{emp.departmentName}</TableCell>
            <TableCell>{emp.empresa || '-'}</TableCell>
            <TableCell>{emp.role || '-'}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm font-medium">R$ {Number(emp.salary || 0).toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">
                  Líq: R$ {Number(emp.salario_liquido || 0).toFixed(2)}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={emp.status === 'Ativo' ? 'default' : 'outline'}
                className={
                  emp.status === 'Ativo'
                    ? 'bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest text-[10px]'
                    : 'bg-transparent text-muted-foreground border-border uppercase tracking-widest text-[10px]'
                }
              >
                {emp.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => onEdit(emp)} title="Editar">
                  <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(emp.id)}
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
