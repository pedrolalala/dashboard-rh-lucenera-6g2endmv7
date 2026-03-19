import { Check, X, Clock } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VacationRequest } from '@/data/vacations'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface VacationTableProps {
  data: VacationRequest[]
  onUpdateStatus: (id: string, status: VacationRequest['status']) => void
}

export function VacationTable({ data, onUpdateStatus }: VacationTableProps) {
  return (
    <div className="max-h-[500px] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
          <TableRow>
            <TableHead>Colaborador</TableHead>
            <TableHead>Período</TableHead>
            <TableHead className="text-center">Dias</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                Nenhuma solicitação encontrada para os filtros selecionados.
              </TableCell>
            </TableRow>
          ) : (
            data.map((req) => (
              <TableRow key={req.id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="font-medium text-sm text-slate-900">{req.employeeName}</div>
                  <div className="text-xs text-muted-foreground">{req.department}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm whitespace-nowrap">
                    {req.startDate.toLocaleDateString('pt-BR')}{' '}
                    <span className="text-muted-foreground mx-1">até</span>{' '}
                    {req.endDate.toLocaleDateString('pt-BR')}
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">{req.days}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      req.status === 'Aprovado'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : req.status === 'Rejeitado'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                    }
                  >
                    {req.status === 'Pendente' && <Clock className="mr-1.5 size-3" />}
                    {req.status === 'Aprovado' && <Check className="mr-1.5 size-3" />}
                    {req.status === 'Rejeitado' && <X className="mr-1.5 size-3" />}
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {req.status === 'Pendente' ? (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => onUpdateStatus(req.id, 'Aprovado')}
                            >
                              <Check className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Aprovar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => onUpdateStatus(req.id, 'Rejeitado')}
                            >
                              <X className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Rejeitar</TooltipContent>
                        </Tooltip>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground px-2 py-1">Processado</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
