import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export function VacationBalances() {
  const [balances, setBalances] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    setIsLoading(true)
    let query = supabase.from('vw_controle_ferias_clt').select('*')
    if (user?.app_role === 'funcionario' && user.funcionario_id) {
      query = query.eq('funcionario_id', user.funcionario_id)
    }
    query.then(({ data }) => {
      setBalances(data || [])
      setIsLoading(false)
    })
  }, [user])

  return (
    <Card className="shadow-none border-border">
      <CardHeader className="pb-3 border-b border-border bg-transparent">
        <CardTitle className="text-sm uppercase tracking-widest">Saldos de Férias (CLT)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow>
              <TableHead className="uppercase tracking-widest text-[10px]">Colaborador</TableHead>
              <TableHead className="uppercase tracking-widest text-[10px]">
                Período Aquisitivo
              </TableHead>
              <TableHead className="text-center uppercase tracking-widest text-[10px]">
                Faltas Injustificadas
              </TableHead>
              <TableHead className="text-center uppercase tracking-widest text-[10px]">
                Dias de Direito
              </TableHead>
              <TableHead className="text-center uppercase tracking-widest text-[10px]">
                Dias Gozados
              </TableHead>
              <TableHead className="text-center uppercase tracking-widest text-[10px]">
                Saldo Disponível
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : balances.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground h-32 text-xs uppercase tracking-widest"
                >
                  Nenhum saldo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              balances.map((b, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-muted/30 transition-colors border-b border-border"
                >
                  <TableCell className="font-medium text-xs uppercase tracking-wide text-foreground">
                    {b.funcionario_nome}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground tracking-wide">
                    {b.data_inicio ? format(new Date(b.data_inicio), 'dd/MM/yyyy') : ''}
                    <span className="text-border mx-2">|</span>
                    {b.data_fim ? format(new Date(b.data_fim), 'dd/MM/yyyy') : ''}
                  </TableCell>
                  <TableCell className="text-center text-xs text-destructive font-medium">
                    {b.total_faltas || 0}
                  </TableCell>
                  <TableCell className="text-center text-xs">{b.dias_direito || 0}</TableCell>
                  <TableCell className="text-center text-xs">{b.dias_gozados || 0}</TableCell>
                  <TableCell className="text-center text-xs font-bold text-primary">
                    {b.saldo_disponivel || 0}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
