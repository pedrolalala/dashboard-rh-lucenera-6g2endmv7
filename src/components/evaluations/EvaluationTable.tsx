import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

export interface EvaluationData {
  id: string
  funcionario_id: string
  periodo_inicio: string
  periodo_fim: string
  produtividade: number
  qualidade: number
  pontualidade: number
  trabalho_equipe: number
  comentarios: string
  data_avaliacao: string
  avaliador_id: string
  funcionarios?: { nome: string }
  usuarios?: { nome: string }
}

export function EvaluationTable({ data }: { data: EvaluationData[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
        <FileText className="h-10 w-10 text-slate-300 mb-3" />
        <p className="text-xs uppercase tracking-widest mt-2">Nenhuma avaliação encontrada.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader className="bg-slate-50/50">
        <TableRow>
          <TableHead>Funcionário</TableHead>
          <TableHead>Período</TableHead>
          <TableHead className="text-center">Média</TableHead>
          <TableHead>Data da Avaliação</TableHead>
          <TableHead>Avaliador</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => {
          const media =
            (item.produtividade + item.qualidade + item.pontualidade + item.trabalho_equipe) / 4

          return (
            <TableRow key={item.id} className="group">
              <TableCell className="font-medium">
                {item.funcionarios?.nome || 'Desconhecido'}
              </TableCell>
              <TableCell className="text-muted-foreground whitespace-nowrap">
                {new Date(item.periodo_inicio).toLocaleDateString('pt-BR')} -{' '}
                {new Date(item.periodo_fim).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={media >= 4 ? 'default' : media >= 3 ? 'secondary' : 'destructive'}
                  className={
                    media >= 4 ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : ''
                  }
                >
                  {media.toFixed(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(item.data_avaliacao).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>{item.usuarios?.nome || 'Desconhecido'}</TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 uppercase tracking-widest text-[10px]"
                    >
                      Detalhes
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm border-b pb-2 uppercase tracking-widest text-xs">
                        Notas Detalhadas
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Produtividade:</div>
                        <div className="font-medium text-right">{item.produtividade}/5</div>
                        <div className="text-muted-foreground">Qualidade:</div>
                        <div className="font-medium text-right">{item.qualidade}/5</div>
                        <div className="text-muted-foreground">Pontualidade:</div>
                        <div className="font-medium text-right">{item.pontualidade}/5</div>
                        <div className="text-muted-foreground">Trabalho Eqp.:</div>
                        <div className="font-medium text-right">{item.trabalho_equipe}/5</div>
                      </div>
                      {item.comentarios && (
                        <div className="pt-2 border-t text-sm">
                          <span className="font-medium uppercase tracking-widest text-[10px]">
                            Comentários:
                          </span>
                          <p className="text-muted-foreground mt-1 whitespace-pre-wrap text-xs">
                            {item.comentarios}
                          </p>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
