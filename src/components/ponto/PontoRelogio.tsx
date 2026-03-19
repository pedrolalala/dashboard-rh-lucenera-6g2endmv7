import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Fingerprint, Loader2, CheckCircle2, Clock, ArrowRight, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export function PontoRelogio({ onPunch }: { onPunch?: () => void }) {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [todayRecord, setTodayRecord] = useState<any>(null)
  const [punchLoading, setPunchLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [now, setNow] = useState(new Date())

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchTodayRecord = useCallback(async () => {
    if (!user?.funcionario_id) {
      if (!authLoading) setInitialLoading(false)
      return
    }
    const { data } = await supabase
      .from('controle_ponto')
      .select('*')
      .eq('funcionario_id', user.funcionario_id)
      .eq('data', format(new Date(), 'yyyy-MM-dd'))
      .maybeSingle()
    setTodayRecord(data)
    setInitialLoading(false)
  }, [user?.funcionario_id, authLoading])

  useEffect(() => {
    if (!authLoading) {
      fetchTodayRecord()
    }
  }, [fetchTodayRecord, authLoading])

  const handlePunch = async (type: 'in' | 'out') => {
    if (!user?.funcionario_id) return
    setPunchLoading(true)
    try {
      const punchTime = new Date()
      const timeStr = format(punchTime, 'HH:mm:ss')
      const dateStr = format(punchTime, 'yyyy-MM-dd')

      if (type === 'in') {
        const { error } = await supabase.from('controle_ponto').insert({
          funcionario_id: user.funcionario_id,
          data: dateStr,
          hora_entrada: timeStr,
          status: 'presente',
        })
        if (error) throw error
        toast({ title: 'Entrada registrada com sucesso.' })
      } else {
        if (!todayRecord) return
        const [inH, inM] = todayRecord.hora_entrada.split(':').map(Number)
        const totalMin = punchTime.getHours() * 60 + punchTime.getMinutes() - (inH * 60 + inM)
        const totalHours = Number((Math.max(0, totalMin) / 60).toFixed(2))

        const { error } = await supabase
          .from('controle_ponto')
          .update({
            hora_saida: timeStr,
            total_horas: totalHours,
            status: 'presente',
          })
          .eq('id', todayRecord.id)
        if (error) throw error
        toast({ title: 'Saída registrada com sucesso.' })
      }

      await fetchTodayRecord()
      onPunch?.()
    } catch (e: any) {
      toast({
        title: `Erro ao registrar ${type === 'in' ? 'entrada' : 'saída'}`,
        description: e.message,
        variant: 'destructive',
      })
    } finally {
      setPunchLoading(false)
    }
  }

  if (authLoading || initialLoading) {
    return (
      <Card className="border-border overflow-hidden bg-background shadow-sm h-[240px] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground uppercase tracking-widest">
          Carregando relógio de ponto...
        </p>
      </Card>
    )
  }

  // Fallback caso o usuário da plataforma não tenha um cadastro em funcionarios_rh correspondente.
  // Graças à nova migration, este cenário não deve ocorrer, mas o fallback é providenciado.
  if (!user?.funcionario_id) {
    return (
      <Card className="border-border overflow-hidden bg-background shadow-sm">
        <div className="p-10 flex flex-col items-center justify-center text-center bg-muted/10">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">Conta não vinculada</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Seu usuário ainda não possui um cadastro de funcionário associado no sistema. Por favor,
            contate o administrador (TI/RH) para realizar a vinculação e liberar o registro de
            ponto.
          </p>
        </div>
      </Card>
    )
  }

  const hasPunchedIn = !!todayRecord
  const hasPunchedOut = !!todayRecord?.hora_saida

  return (
    <Card className="border-border overflow-hidden bg-background shadow-sm">
      <div className="flex flex-col md:flex-row h-full">
        {/* Clock Section */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {format(now, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
          <div className="text-6xl md:text-7xl font-light tracking-tighter tabular-nums text-foreground flex items-baseline">
            {format(now, 'HH:mm')}
            <span className="text-3xl md:text-4xl text-muted-foreground ml-2 font-normal">
              {format(now, 'ss')}
            </span>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center bg-muted/10 relative">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                {!hasPunchedIn && 'Aguardando Início da Jornada'}
                {hasPunchedIn && !hasPunchedOut && 'Jornada em Andamento'}
                {hasPunchedIn && hasPunchedOut && 'Jornada Concluída'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {!hasPunchedIn && 'Registre sua entrada para iniciar o controle de horas de hoje.'}
                {hasPunchedIn &&
                  !hasPunchedOut &&
                  `Entrada registrada às ${todayRecord.hora_entrada.substring(0, 5)}.`}
                {hasPunchedIn &&
                  hasPunchedOut &&
                  `Total de horas trabalhadas: ${Number(todayRecord.total_horas).toFixed(2)}h.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {!hasPunchedIn ? (
                <Button
                  size="lg"
                  onClick={() => handlePunch('in')}
                  disabled={punchLoading}
                  className="w-full sm:w-auto uppercase tracking-widest text-sm bg-[#B87333] hover:bg-[#9e6029] text-white h-14 px-8"
                >
                  {punchLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Fingerprint className="mr-2 h-5 w-5" />
                  )}
                  Registrar Entrada
                </Button>
              ) : !hasPunchedOut ? (
                <Button
                  size="lg"
                  onClick={() => handlePunch('out')}
                  disabled={punchLoading}
                  variant="outline"
                  className="w-full sm:w-auto uppercase tracking-widest text-sm border-[#B87333] text-[#B87333] hover:bg-[#B87333] hover:text-white h-14 px-8 bg-transparent"
                >
                  {punchLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-5 w-5" />
                  )}
                  Registrar Saída
                </Button>
              ) : (
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-500 font-medium">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>Registro finalizado por hoje</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
