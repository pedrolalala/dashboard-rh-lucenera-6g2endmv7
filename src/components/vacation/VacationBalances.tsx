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
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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

  const expiringBalances = balances.filter((b) => {
    if (!b.data_limite_gozo || b.saldo_disponivel <= 0) return false
    const limitDate = new Date(b.data_limite_gozo)
    const today = new Date()
    const diffDays = Math.ceil((limitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 60 && diffDays >= 0
  })

  return (
    <div className="space-y-6">
      {expiringBalances.length > 0 && user?.app_role !== 'funcionario' && (
        <Alert
          variant="destructive"
          className="border-destructive/50 bg-destructive/10 text-destructive animate-fade-in-down"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="uppercase tracking-widest text-xs font-bold mb-2">
            Atenção: Férias a Vencer
          </AlertTitle>
          <AlertDescription className="text-xs">
            Há {expiringBalances.length} colaborador(es) com o limite de gozo de férias expirando
            nos próximos 60 dias. Verifique os saldos abaixo.
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-none border-border">
        <CardHeader className="pb-3 border-b border-border bg-transparent">
          <CardTitle className="text-sm uppercase tracking-widest">
            Saldos de Férias (CLT)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="uppercase tracking-widest text-[10px]">Colaborador</TableHead>
                <TableHead className="uppercase tracking-widest text-[10px]">
                  Período Aquisitivo
                </TableHead>
                <TableHead className="uppercase tracking-widest text-[10px] text-center">
                  Limite Gozo
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
                  <TableCell colSpan={7} className="h-32 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : balances.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground h-32 text-xs uppercase tracking-widest"
                  >
                    Nenhum saldo encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                balances.map((b, i) => {
                  let isExpiring = false
                  if (b.data_limite_gozo && b.saldo_disponivel > 0) {
                    const limitDate = new Date(b.data_limite_gozo)
                    const diffDays = Math.ceil(
                      (limitDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )
                    isExpiring = diffDays <= 60 && diffDays >= 0
                  }

                  return (
                    <TableRow
                      key={i}
                      className={`hover:bg-muted/30 transition-colors border-b border-border ${isExpiring ? 'bg-destructive/5' : ''}`}
                    >
                      <TableCell className="font-medium text-xs uppercase tracking-wide text-foreground">
                        <div className="flex items-center gap-2">
                          {b.funcionario_nome}
                          {isExpiring && <AlertCircle className="h-3 w-3 text-destructive" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground tracking-wide">
                        {b.data_inicio ? format(new Date(b.data_inicio), 'dd/MM/yyyy') : ''}
                        <span className="text-border mx-2">|</span>
                        {b.data_fim ? format(new Date(b.data_fim), 'dd/MM/yyyy') : ''}
                      </TableCell>
                      <TableCell
                        className={`text-xs tracking-wide text-center ${isExpiring ? 'text-destructive font-bold' : 'text-muted-foreground'}`}
                      >
                        {b.data_limite_gozo
                          ? format(new Date(b.data_limite_gozo), 'dd/MM/yyyy')
                          : '-'}
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
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
