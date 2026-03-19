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
import { VacationRequest } from '@/pages/Ferias'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'

interface VacationTableProps {
  data: VacationRequest[]
  onUpdateStatus: (id: string, status: VacationRequest['status']) => void
}

export function VacationTable({ data, onUpdateStatus }: VacationTableProps) {
  const { user } = useAuth()
  const canUpdate = user?.app_role === 'admin' || user?.app_role === 'gerente'

  return (
    <div className="max-h-[500px] overflow-auto border border-border">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10 border-b border-border">
          <TableRow className="hover:bg-transparent">
            <TableHead className="uppercase tracking-widest text-[10px]">Colaborador</TableHead>
            <TableHead className="uppercase tracking-widest text-[10px]">Período</TableHead>
            <TableHead className="text-center uppercase tracking-widest text-[10px]">
              Dias
            </TableHead>
            <TableHead className="uppercase tracking-widest text-[10px]">Status</TableHead>
            <TableHead className="text-right uppercase tracking-widest text-[10px]">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-32 text-center text-muted-foreground uppercase tracking-widest text-xs"
              >
                Nenhuma solicitação encontrada.
              </TableCell>
            </TableRow>
          ) : (
            data.map((req) => (
              <TableRow
                key={req.id}
                className="group hover:bg-muted/30 transition-colors border-b border-border"
              >
                <TableCell>
                  <div className="font-medium text-xs text-foreground uppercase tracking-wide">
                    {req.employeeName}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                    {req.department}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground whitespace-nowrap tracking-wide">
                    {req.startDate.toLocaleDateString('pt-BR')}
                    <span className="text-border mx-2">|</span>
                    {req.endDate.toLocaleDateString('pt-BR')}
                  </div>
                </TableCell>
                <TableCell className="text-center font-light text-xs">{req.days}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      req.status === 'Aprovado'
                        ? 'bg-primary text-primary-foreground border-transparent uppercase tracking-widest text-[9px] rounded-none py-1'
                        : req.status === 'Rejeitado'
                          ? 'bg-transparent text-muted-foreground border-muted-foreground/30 line-through opacity-70 uppercase tracking-widest text-[9px] rounded-none py-1'
                          : 'bg-muted text-foreground border-transparent uppercase tracking-widest text-[9px] rounded-none py-1'
                    }
                  >
                    {req.status === 'Pendente' && <Clock className="mr-1.5 size-3 opacity-50" />}
                    {req.status === 'Aprovado' && <Check className="mr-1.5 size-3 opacity-50" />}
                    {req.status === 'Rejeitado' && <X className="mr-1.5 size-3 opacity-50" />}
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {req.status === 'Pendente' && canUpdate ? (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 text-foreground hover:bg-primary hover:text-primary-foreground border-border rounded-none"
                              onClick={() => onUpdateStatus(req.id, 'Aprovado')}
                            >
                              <Check className="size-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="rounded-none border-border text-[10px] uppercase tracking-widest">
                            Aprovar
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive border-border rounded-none"
                              onClick={() => onUpdateStatus(req.id, 'Rejeitado')}
                            >
                              <X className="size-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="rounded-none border-border text-[10px] uppercase tracking-widest">
                            Rejeitar
                          </TooltipContent>
                        </Tooltip>
                      </>
                    ) : (
                      <span className="text-[10px] text-muted-foreground px-2 py-1 uppercase tracking-widest">
                        Processado
                      </span>
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
