import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Loader2, AlertCircle, Clock, UserX } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export function VacationBalances() {
  const [balances, setBalances] = useState<any[]>([])
  const [faltasHist, setFaltasHist] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      let query = supabase.from('vw_controle_ferias_clt').select('*')
      if (user?.app_role === 'funcionario' && user.funcionario_id) {
        query = query.eq('funcionario_id', user.funcionario_id)
      }

      const { data } = await query

      // Busca faltas para histórico apenas (sem abater saldo)
      let faltasQuery = supabase
        .from('controle_falta')
        .select('funcionario_id')
        .eq('status', 'ausente')
        .is('justificativa', null)
      if (user?.app_role === 'funcionario' && user.funcionario_id) {
        faltasQuery = faltasQuery.eq('funcionario_id', user.funcionario_id)
      }
      const { data: faltasData } = await faltasQuery

      const faltasMap = (faltasData || []).reduce((acc: any, curr: any) => {
        acc[curr.funcionario_id] = (acc[curr.funcionario_id] || 0) + 1
        return acc
      }, {})

      setFaltasHist(faltasMap)

      if (data) {
        // Remover possiveis duplicidades de retorno da view agrupando por id
        const uniqueData = Object.values(
          data.reduce((acc: any, curr: any) => {
            acc[curr.funcionario_id] = curr
            return acc
          }, {}),
        )

        const sortedData = uniqueData.sort((a: any, b: any) => {
          const aName = a.funcionario_nome?.toLowerCase() || ''
          const bName = b.funcionario_nome?.toLowerCase() || ''
          const isAPriority =
            aName.includes('thais') || aName.includes('tricia') || aName.includes('trícia')
          const isBPriority =
            bName.includes('thais') || bName.includes('tricia') || bName.includes('trícia')

          if (isAPriority && !isBPriority) return -1
          if (!isAPriority && isBPriority) return 1
          return aName.localeCompare(bName)
        })

        setBalances(sortedData)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [user])

  const attentionBalances = balances.filter(
    (b) => (b.saldo_disponivel || 0) > 30 && (b.saldo_disponivel || 0) <= 60,
  )
  const expiringBalances = balances.filter((b) => (b.saldo_disponivel || 0) > 60)

  return (
    <div className="space-y-6">
      {expiringBalances.length > 0 && user?.app_role !== 'funcionario' && (
        <Alert
          variant="destructive"
          className="border-destructive/50 bg-destructive/10 text-destructive animate-fade-in-down rounded-none"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="uppercase tracking-widest text-xs font-bold mb-2">
            Crítico: Férias Acumuladas
          </AlertTitle>
          <AlertDescription className="text-xs">
            Há {expiringBalances.length} colaborador(es) com mais de 60 dias de saldo de férias.
            Prioridade alta para o agendamento de períodos de gozo.
          </AlertDescription>
        </Alert>
      )}

      {attentionBalances.length > 0 && user?.app_role !== 'funcionario' && (
        <Alert className="border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-500 animate-fade-in-down rounded-none">
          <Clock className="h-4 w-4" />
          <AlertTitle className="uppercase tracking-widest text-xs font-bold mb-2">
            Atenção: Múltiplos Ciclos
          </AlertTitle>
          <AlertDescription className="text-xs">
            Há {attentionBalances.length} colaborador(es) com mais de 30 dias de saldo disponível.
            Acompanhe a marcação de férias para não acumular novos ciclos.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-sm font-light uppercase tracking-widest text-foreground">
          Saldos de Férias (Modelo Acumulativo Simples)
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : balances.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground text-xs uppercase tracking-widest border border-border">
          Nenhum saldo encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {balances.map((b) => {
            const isCritico = (b.saldo_disponivel || 0) > 60
            const isAlerta = (b.saldo_disponivel || 0) > 30 && !isCritico
            const isPriority =
              b.funcionario_nome?.toLowerCase().includes('thais') ||
              b.funcionario_nome?.toLowerCase().includes('tricia')

            // Acúmulo de ciclos: Cada 30 dias de direito equivalem a 1 ciclo
            const ciclosCompletados = Math.floor((b.direito_total_acumulado || 0) / 30)
            const totalFaltas = faltasHist[b.funcionario_id] || 0

            return (
              <Card
                key={b.funcionario_id}
                className={`shadow-none rounded-none border transition-colors ${
                  isCritico
                    ? 'border-destructive/50 bg-destructive/5'
                    : isAlerta
                      ? 'border-amber-500/50 bg-amber-500/5'
                      : isPriority && b.saldo_disponivel > 0
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border'
                }`}
              >
                <CardHeader className="pb-2 border-b border-border/50">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle
                      className="text-sm font-semibold truncate"
                      title={b.funcionario_nome}
                    >
                      {b.funcionario_nome}
                    </CardTitle>

                    {isCritico && (
                      <Badge
                        variant="destructive"
                        className="text-[9px] rounded-none px-1 uppercase shrink-0 h-5"
                      >
                        CRÍTICO
                      </Badge>
                    )}
                    {!isCritico && isAlerta && (
                      <Badge
                        variant="outline"
                        className="text-[9px] rounded-none px-1 uppercase shrink-0 h-5 border-amber-500 text-amber-600"
                      >
                        ALERTA
                      </Badge>
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                    Ciclos Completados:{' '}
                    <span className="font-bold text-foreground">{ciclosCompletados}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-3">
                  <div className="bg-muted/30 p-3 rounded-none border border-border/50 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Direito Total Acumulado
                      </span>
                      <span className="font-semibold">{b.direito_total_acumulado || 0} dias</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Dias Já Gozados
                      </span>
                      <span className="font-semibold text-amber-600">
                        {b.total_gozado || 0} dias
                      </span>
                    </div>

                    <div className="w-full h-px bg-border/50"></div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                        Saldo Disponível
                      </span>
                      <span className="font-bold text-primary text-sm">
                        {b.saldo_disponivel || 0} dias
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <UserX className="h-3 w-3" /> Faltas Históricas:
                    </span>
                    <span className="font-medium">{totalFaltas}</span>
                  </div>
                  {totalFaltas > 0 && (
                    <div className="text-[9px] text-muted-foreground mt-0 leading-tight opacity-70">
                      * Faltas servem para histórico, não abatem do saldo de férias.
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
