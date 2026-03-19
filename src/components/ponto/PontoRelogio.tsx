import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Fingerprint, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export function PontoRelogio({ onPunch }: { onPunch?: () => void }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [todayRecord, setTodayRecord] = useState<any>(null)
  const [punchLoading, setPunchLoading] = useState(false)

  const fetchTodayRecord = useCallback(async () => {
    if (!user?.funcionario_id) return
    const { data } = await supabase
      .from('controle_ponto')
      .select('*')
      .eq('funcionario_id', user.funcionario_id)
      .eq('data', format(new Date(), 'yyyy-MM-dd'))
      .maybeSingle()
    setTodayRecord(data)
  }, [user?.funcionario_id])

  useEffect(() => {
    fetchTodayRecord()
  }, [fetchTodayRecord])

  const handlePunch = async (type: 'in' | 'out') => {
    if (!user?.funcionario_id) return
    setPunchLoading(true)
    try {
      const now = new Date()
      const timeStr = format(now, 'HH:mm:ss')
      const dateStr = format(now, 'yyyy-MM-dd')
      if (type === 'in') {
        const { error } = await supabase.from('controle_ponto').insert({
          funcionario_id: user.funcionario_id,
          data: dateStr,
          hora_entrada: timeStr,
          status: timeStr <= '09:00:00' ? 'presente' : 'atraso',
        })
        if (error) throw error
        toast({ title: 'Entrada registrada com sucesso.' })
      } else {
        if (!todayRecord) return
        const [inH, inM] = todayRecord.hora_entrada.split(':').map(Number)
        const totalMin = now.getHours() * 60 + now.getMinutes() - (inH * 60 + inM)
        const totalHours = Number((Math.max(0, totalMin) / 60).toFixed(2))
        const { error } = await supabase
          .from('controle_ponto')
          .update({ hora_saida: timeStr, total_horas: totalHours })
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

  return (
    <Card className="shadow-none border-border bg-background">
      <CardHeader className="bg-transparent border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
              <Fingerprint className="h-4 w-4" /> Relógio de Ponto
            </CardTitle>
            <CardDescription>
              {format(new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR })}
            </CardDescription>
          </div>
          <div>
            {!todayRecord ? (
              <Button
                onClick={() => handlePunch('in')}
                disabled={punchLoading}
                className="uppercase tracking-widest text-xs bg-[#B87333] hover:bg-[#9e6029] text-white"
              >
                {punchLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Registrar
                Entrada
              </Button>
            ) : !todayRecord.hora_saida ? (
              <Button
                onClick={() => handlePunch('out')}
                disabled={punchLoading}
                variant="outline"
                className="uppercase tracking-widest text-xs border-[#B87333] text-[#B87333] hover:bg-[#B87333] hover:text-white"
              >
                {punchLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Registrar Saída
              </Button>
            ) : (
              <div className="text-xs text-muted-foreground uppercase tracking-widest border border-border px-4 py-2 font-medium">
                Jornada Concluída
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 flex gap-8 items-center">
        <div className="text-center w-24">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
            Entrada
          </p>
          <p className="text-2xl font-light text-foreground">
            {todayRecord?.hora_entrada ? todayRecord.hora_entrada.substring(0, 5) : '--:--'}
          </p>
        </div>
        <div className="h-10 w-px bg-border"></div>
        <div className="text-center w-24">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Saída</p>
          <p className="text-2xl font-light text-foreground">
            {todayRecord?.hora_saida ? todayRecord.hora_saida.substring(0, 5) : '--:--'}
          </p>
        </div>
        {todayRecord?.total_horas != null && (
          <>
            <div className="h-10 w-px bg-border hidden sm:block"></div>
            <div className="text-center w-24 hidden sm:block">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                Total
              </p>
              <p className="text-2xl font-light text-[#B87333]">
                {Number(todayRecord.total_horas).toFixed(2)}h
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
