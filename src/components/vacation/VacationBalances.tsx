import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { useAuth } from '@/hooks/use-auth'
import { Loader2, AlertCircle, CalendarDays, UserX, CheckCircle2, Clock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

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
      if (data) {
        // Prioritize Thais Pegrucci and Tricia Silva
        const sortedData = data.sort((a, b) => {
          const aName = a.funcionario_nome?.toLowerCase() || ''
          const bName = b.funcionario_nome?.toLowerCase() || ''
          const isAPriority = aName.includes('thais pegrucci') || aName.includes('tricia silva')
          const isBPriority = bName.includes('thais pegrucci') || bName.includes('tricia silva')
          if (isAPriority && !isBPriority) return -1
          if (!isAPriority && isBPriority) return 1

          const aLimit = a.data_limite_gozo ? new Date(a.data_limite_gozo).getTime() : Infinity
          const bLimit = b.data_limite_gozo ? new Date(b.data_limite_gozo).getTime() : Infinity
          return aLimit - bLimit
        })
        setBalances(sortedData)
      }
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

  const attentionBalances = balances.filter((b) => {
    if (!b.data_limite_gozo || b.saldo_disponivel <= 0) return false
    const limitDate = new Date(b.data_limite_gozo)
    const today = new Date()
    const diffDays = Math.ceil((limitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays > 60 && diffDays <= 180 // Between 2 and 6 months
  })

  return (
    <div className="space-y-6">
      {expiringBalances.length > 0 && user?.app_role !== 'funcionario' && (
        <Alert
          variant="destructive"
          className="border-destructive/50 bg-destructive/10 text-destructive animate-fade-in-down rounded-none"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="uppercase tracking-widest text-xs font-bold mb-2">
            Crítico: Férias Vencendo (Menos de 60 dias)
          </AlertTitle>
          <AlertDescription className="text-xs">
            Há {expiringBalances.length} colaborador(es) com o limite de gozo de férias expirando
            nos próximos 60 dias. Verifique os saldos abaixo. Prioridade alta para evitar multas.
          </AlertDescription>
        </Alert>
      )}

      {attentionBalances.length > 0 && user?.app_role !== 'funcionario' && (
        <Alert className="border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-500 animate-fade-in-down rounded-none">
          <Clock className="h-4 w-4" />
          <AlertTitle className="uppercase tracking-widest text-xs font-bold mb-2">
            Atenção: Férias a Vencer (Menos de 6 meses)
          </AlertTitle>
          <AlertDescription className="text-xs">
            Há {attentionBalances.length} colaborador(es) entrando no período de atenção. Programe o
            gozo com antecedência.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-sm font-light uppercase tracking-widest text-foreground">
          Saldos de Férias (Cards de Período)
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
          {balances.map((b, i) => {
            let isExpiring = false
            let isAttention = false
            let diffDays = Infinity

            if (b.data_limite_gozo && b.saldo_disponivel > 0) {
              const limitDate = new Date(b.data_limite_gozo)
              diffDays = Math.ceil(
                (limitDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )
              isExpiring = diffDays <= 60 && diffDays >= 0
              isAttention = diffDays > 60 && diffDays <= 180
            }

            const isPriority =
              b.funcionario_nome?.toLowerCase().includes('thais pegrucci') ||
              b.funcionario_nome?.toLowerCase().includes('tricia silva')

            return (
              <Card
                key={i}
                className={`shadow-none rounded-none border transition-colors ${
                  isExpiring
                    ? 'border-destructive/50 bg-destructive/5'
                    : isAttention
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
                    {isExpiring && (
                      <Badge
                        variant="destructive"
                        className="text-[9px] rounded-none px-1 uppercase shrink-0 h-5"
                      >
                        Crítico
                      </Badge>
                    )}
                    {!isExpiring && isAttention && (
                      <Badge
                        variant="outline"
                        className="text-[9px] rounded-none px-1 uppercase border-amber-500 text-amber-600 shrink-0 h-5"
                      >
                        Atenção
                      </Badge>
                    )}
                    {!isExpiring && !isAttention && isPriority && b.saldo_disponivel > 0 && (
                      <Badge
                        variant="default"
                        className="text-[9px] rounded-none px-1 uppercase shrink-0 h-5"
                      >
                        Passivo
                      </Badge>
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1 mt-1">
                    <CalendarDays className="h-3 w-3" />
                    {b.data_inicio ? format(new Date(b.data_inicio), 'dd/MM/yy') : ''} -{' '}
                    {b.data_fim ? format(new Date(b.data_fim), 'dd/MM/yy') : ''}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <UserX className="h-3 w-3" /> Faltas Injustificadas:
                    </span>
                    <span className={`font-medium ${b.total_faltas > 0 ? 'text-destructive' : ''}`}>
                      {b.total_faltas || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Dias de Direito:
                    </span>
                    <span className="font-medium">{b.dias_direito || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Dias Gozados:
                    </span>
                    <span className="font-medium">{b.dias_gozados || 0}</span>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                        Limite de Gozo
                      </span>
                      <span
                        className={`text-xs font-medium ${isExpiring ? 'text-destructive' : isAttention ? 'text-amber-600' : ''}`}
                      >
                        {b.data_limite_gozo
                          ? format(new Date(b.data_limite_gozo), 'dd/MM/yyyy')
                          : '-'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                        Saldo
                      </span>
                      <span
                        className={`text-xl font-bold leading-none ${b.saldo_disponivel > 0 ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        {b.saldo_disponivel || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
