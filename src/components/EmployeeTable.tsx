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
import { formatCurrency, displayOrNa } from '@/lib/utils'

interface EmployeeTableProps {
  data: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
}

function RemunerationCell({ emp }: { emp: Employee }) {
  const hasBaseSalary = emp.salario_base > 0
  const hasLiquidSalary = emp.salario_liquido > 0
  const hasPorFora = emp.salario_por_fora > 0
  const hasCommission = emp.comissao_percentual > 0

  if (hasBaseSalary || hasLiquidSalary) {
    return (
      <div className="flex flex-col gap-0.5">
        {hasBaseSalary && (
          <span className="text-sm font-medium">Base: {formatCurrency(emp.salario_base)}</span>
        )}
        {hasLiquidSalary && (
          <span className="text-xs text-muted-foreground">
            Líq: {formatCurrency(emp.salario_liquido)}
          </span>
        )}
        {hasPorFora && (
          <span className="text-xs text-muted-foreground">
            Extra: {formatCurrency(emp.salario_por_fora)}
          </span>
        )}
      </div>
    )
  }

  if (hasPorFora || hasCommission) {
    return (
      <div className="flex flex-col gap-0.5">
        {hasPorFora && (
          <span className="text-sm font-medium text-primary">
            Extra: {formatCurrency(emp.salario_por_fora)}
          </span>
        )}
        {hasCommission && (
          <span className="text-xs text-muted-foreground">
            Comissão: {emp.comissao_percentual}%
          </span>
        )}
        <span className="text-[10px] text-muted-foreground italic">
          Sem salário base registrado
        </span>
      </div>
    )
  }

  return <span className="text-xs text-muted-foreground italic">Não informado</span>
}

export function EmployeeTable({ data, onEdit, onDelete }: EmployeeTableProps) {
  return (
    <Table>
      <TableHeader className="bg-muted/10">
        <TableRow>
          <TableHead>Colaborador</TableHead>
          <TableHead>Contato & Endereço</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Remuneração</TableHead>
          <TableHead>VT/dia</TableHead>
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
                    {emp.nome.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span>{emp.nome}</span>
                  {emp.data_admissao && (
                    <span className="text-xs text-muted-foreground">
                      Admissão: {new Date(emp.data_admissao).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm">{displayOrNa(emp.email)}</span>
                <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                  {emp.telefone ? <span>{emp.telefone}</span> : null}
                  {emp.cpf ? <span>CPF: {emp.cpf}</span> : null}
                </div>
                {emp.endereco ? (
                  <span className="text-xs text-muted-foreground line-clamp-1" title={emp.endereco}>
                    {emp.endereco}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Endereço: Não informado
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm">{displayOrNa(emp.cargo)}</span>
            </TableCell>
            <TableCell>
              {emp.empresa ? (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                  {emp.empresa}
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground italic">Não informado</span>
              )}
            </TableCell>
            <TableCell>
              <RemunerationCell emp={emp} />
            </TableCell>
            <TableCell>
              {emp.valor_vt_dia > 0 ? (
                <span className="text-sm">{formatCurrency(emp.valor_vt_dia)}</span>
              ) : (
                <span className="text-xs text-muted-foreground italic">Não informado</span>
              )}
            </TableCell>
            <TableCell>
              <Badge
                variant={emp.ativo ? 'default' : 'outline'}
                className={
                  emp.ativo
                    ? 'bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest text-[10px]'
                    : 'bg-transparent text-muted-foreground border-border uppercase tracking-widest text-[10px]'
                }
              >
                {emp.ativo ? 'Ativo' : 'Inativo'}
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
