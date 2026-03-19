import { Download, FileText, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { payrollData } from '@/data/mock'

export default function FolhaPagamento() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Folha de Pagamento</h1>
        <Button variant="outline" className="bg-white">
          <Download className="mr-2 h-4 w-4" /> Exportar Dados
        </Button>
      </div>

      <Card className="shadow-sm border-blue-100/50">
        <CardHeader>
          <CardTitle>Histórico de Processamento</CardTitle>
          <CardDescription>Consulte as folhas de pagamento mensais da Lucenera</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês de Referência</TableHead>
                <TableHead>Data de Processamento</TableHead>
                <TableHead>Valor Total Bruto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Recibos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-blue-50/30">
                <TableCell className="font-medium">Julho/2024</TableCell>
                <TableCell className="text-muted-foreground">-</TableCell>
                <TableCell>R$ 148.500,00</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-transparent"
                  >
                    Em processamento
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" disabled>
                    Indisponível
                  </Button>
                </TableCell>
              </TableRow>
              {payrollData.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{item.month}</TableCell>
                  <TableCell className="text-muted-foreground">{item.date}</TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-emerald-100 text-emerald-800 border-transparent flex w-max items-center gap-1"
                    >
                      <CheckCircle2 className="size-3" /> {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-secondary">
                      <FileText className="mr-2 h-4 w-4" /> Holerites
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
