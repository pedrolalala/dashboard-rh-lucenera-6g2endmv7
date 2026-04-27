import { useState, useEffect, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useFeriados } from '@/hooks/use-feriados'
import { CalendarDays } from 'lucide-react'

export function FaltasCalendario({ refreshTrigger }: { refreshTrigger: number }) {
  const [date, setDate] = useState<Date>(new Date())
  const { feriados } = useFeriados(date.getFullYear())
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    async function fetchLogs() {
      const { data } = await supabase
        .from('controle_ponto')
        .select('*, funcionarios!inner(nome)')
        .in('status', ['ausente', 'meio_periodo'])
        .gte('data', format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd'))
        .lte('data', format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy-MM-dd'))

      if (data) setLogs(data)
    }
    fetchLogs()
  }, [date.getMonth(), date.getFullYear(), refreshTrigger])

  const feriadosDates = useMemo(() => feriados.map((f) => parseISO(f.date)), [feriados])
  const ausenciasDates = useMemo(() => logs.map((l) => parseISO(l.data)), [logs])

  return (
    <Card className="shadow-none border-border bg-background">
      <CardHeader className="pb-4 border-b border-border bg-transparent">
        <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
          <CalendarDays className="h-4 w-4" /> Calendário de Faltas e Feriados
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col md:flex-row gap-8">
        <div className="flex justify-center md:justify-start">
          <Calendar
            mode="multiple"
            selected={[...feriadosDates, ...ausenciasDates]}
            month={date}
            onMonthChange={setDate}
            locale={ptBR}
            modifiers={{ feriado: feriadosDates, ausencia: ausenciasDates }}
            modifiersStyles={{
              feriado: {
                fontWeight: 'bold',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#1e3a8a',
              },
              ausencia: {
                fontWeight: 'bold',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#7f1d1d',
              },
            }}
            className="border rounded-md shadow-sm"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-4 uppercase tracking-widest">
            Detalhes do Mês: {format(date, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Feriados
              </h4>
              <ul className="text-sm space-y-2">
                {feriados
                  .filter((f) => parseISO(f.date).getMonth() === date.getMonth())
                  .map((f) => (
                    <li key={f.date} className="flex items-center gap-2">
                      <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">
                        {format(parseISO(f.date), 'dd/MM')}
                      </span>
                      <span>{f.name}</span>
                    </li>
                  ))}
                {feriados.filter((f) => parseISO(f.date).getMonth() === date.getMonth()).length ===
                  0 && (
                  <li className="text-muted-foreground italic text-xs">
                    Nenhum feriado neste mês.
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span> Faltas / Ausências
              </h4>
              <ul className="text-sm space-y-2">
                {logs.map((l) => (
                  <li key={l.id} className="flex items-center gap-2">
                    <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">
                      {format(parseISO(l.data), 'dd/MM')}
                    </span>
                    <span className="font-medium">{l.funcionarios?.nome}</span>
                    <span className="text-muted-foreground text-xs">
                      - {l.justificativa || l.status}
                    </span>
                  </li>
                ))}
                {logs.length === 0 && (
                  <li className="text-muted-foreground italic text-xs">
                    Nenhuma falta registrada.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
