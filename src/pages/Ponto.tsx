import { Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const timeData = [
  { name: 'Carlos Santos', date: 'Hoje', in: '08:55', out: '-', status: 'Regular' },
  { name: 'Bruna Costa', date: 'Hoje', in: '09:15', out: '-', status: 'Atraso' },
  { name: 'Diego Oliveira', date: 'Hoje', in: '08:45', out: '-', status: 'Regular' },
  { name: 'Ana Silva', date: 'Ontem', in: '09:00', out: '19:30', status: 'Hora Extra' },
  { name: 'Eduarda Lima', date: 'Ontem', in: '-', out: '-', status: 'Falta Injustificada' },
]

export default function Ponto() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Controle de Ponto</h1>
      </div>

      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
        <AlertCircle className="h-4 w-4 stroke-red-600" />
        <AlertTitle>Atenção</AlertTitle>
        <AlertDescription>
          Há 1 funcionário com falta injustificada registrada no dia anterior. Verifique os logs.
        </AlertDescription>
      </Alert>

      <Card className="shadow-sm border-blue-100/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" />
            Registros Recentes
          </CardTitle>
          <CardDescription>Visão geral de entradas e saídas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Saída</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeData.map((log, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{log.name}</TableCell>
                  <TableCell className="text-muted-foreground">{log.date}</TableCell>
                  <TableCell>{log.in}</TableCell>
                  <TableCell>{log.out}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        log.status === 'Regular'
                          ? 'bg-slate-100 text-slate-700'
                          : log.status === 'Atraso'
                            ? 'bg-amber-100 text-amber-800 border-transparent'
                            : log.status === 'Hora Extra'
                              ? 'bg-blue-100 text-blue-800 border-transparent'
                              : 'bg-red-100 text-red-800 border-transparent'
                      }
                    >
                      {log.status}
                    </Badge>
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
