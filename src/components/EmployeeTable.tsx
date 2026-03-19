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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface EmployeeTableProps {
  data: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
  canEdit?: boolean
}

export function EmployeeTable({ data, onEdit, onDelete, canEdit }: EmployeeTableProps) {
  return (
    <Table>
      <TableHeader className="bg-slate-50/50">
        <TableRow>
          <TableHead>Colaborador</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Departamento</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Status</TableHead>
          {canEdit && <TableHead className="text-right">Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={canEdit ? 6 : 5} className="h-24 text-center text-muted-foreground">
              Nenhum colaborador encontrado.
            </TableCell>
          </TableRow>
        )}
        {data.map((emp) => (
          <TableRow key={emp.id} className="group">
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={`https://img.usecurling.com/ppl/thumbnail?seed=${emp.id}`} />
                  <AvatarFallback>{emp.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span>{emp.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm">{emp.email}</span>
                <span className="text-xs text-muted-foreground">{emp.phone}</span>
              </div>
            </TableCell>
            <TableCell>{emp.department}</TableCell>
            <TableCell>{emp.role}</TableCell>
            <TableCell>
              <Badge
                variant={emp.status === 'Ativo' ? 'default' : 'secondary'}
                className={
                  emp.status === 'Ativo'
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-transparent'
                    : 'bg-slate-100 text-slate-600 border-transparent'
                }
              >
                {emp.status}
              </Badge>
            </TableCell>
            {canEdit && (
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(emp)} title="Editar">
                    <Edit2 className="h-4 w-4 text-secondary" />
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
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
