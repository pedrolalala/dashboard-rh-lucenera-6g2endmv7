import { useState, useEffect, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useFeriados } from '@/hooks/use-feriados'
import { CalendarDays } from 'lucide-react'

const STATUS_MAP: Record<string, string> = {
  ausente: 'Falta Integral',
  meio_periodo: 'Meio Período',
  falta_injustificada: 'Falta Injustificada',
  atestado: 'Atestado Médico',
  licenca_medica: 'Licença Médica',
  licenca_maternidade: 'Licença Maternidade',
  licenca_paternidade: 'Licença Paternidade',
  licenca_obito: 'Licença Óbito (Nojo)',
  licenca_casamento: 'Licença Casamento (Gala)',
  licenca_militar: 'Licença Serviço Militar',
}

export function FaltasCalendario({ refreshTrigger }: { refreshTrigger: number }) {
  const [date, setDate] = useState<Date>(new Date())
  const { feriados } = useFeriados(date.getFullYear())
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    async function fetchLogs() {
      const { data } = await supabase
        .from('controle_falta')
        .select('*, funcionarios!inner(nome)')
        .in('status', Object.keys(STATUS_MAP))
        .gte('data', format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd'))
        .lte('data', format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy-MM-dd'))

      if (data) setLogs(data)
    }
    fetchLogs()
  }, [date.getMonth(), date.getFullYear(), refreshTrigger])

  const feriadosDates = useMemo(() => feriados.map((f) => parseISO(f.date)), [feriados])

  const faltasDates = useMemo(
    () =>
      logs
        .filter((l) => ['ausente', 'falta_injustificada', 'meio_periodo'].includes(l.status))
        .map((l) => parseISO(l.data)),
    [logs],
  )

  const medicasDates = useMemo(
    () =>
      logs
        .filter((l) => ['atestado', 'licenca_medica'].includes(l.status))
        .map((l) => parseISO(l.data)),
    [logs],
  )

  const licencasDates = useMemo(
    () =>
      logs
        .filter((l) =>
          [
            'licenca_maternidade',
            'licenca_paternidade',
            'licenca_obito',
            'licenca_casamento',
            'licenca_militar',
          ].includes(l.status),
        )
        .map((l) => parseISO(l.data)),
    [logs],
  )

  return (
    <Card className="shadow-none border-border bg-background">
      <CardHeader className="pb-4 border-b border-border bg-transparent">
        <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
          <CalendarDays className="h-4 w-4" /> Calendário de Registros e Feriados
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="border rounded-md shadow-sm bg-background p-1 w-full max-w-[280px] sm:max-w-none flex justify-center">
            <Calendar
              mode="multiple"
              selected={[...feriadosDates, ...faltasDates, ...medicasDates, ...licencasDates]}
              month={date}
              onMonthChange={setDate}
              locale={ptBR}
              modifiers={{
                feriado: feriadosDates,
                falta: faltasDates,
                medica: medicasDates,
                licenca: licencasDates,
              }}
              modifiersStyles={{
                feriado: {
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: '#1e3a8a',
                },
                falta: {
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#7f1d1d',
                },
                medica: {
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(234, 179, 8, 0.1)',
                  color: '#854d0e',
                },
                licenca: {
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  color: '#581c87',
                },
              }}
              className="bg-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground w-full p-3 bg-muted/20 rounded-md border">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500"></span>{' '}
              Feriados
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></span>{' '}
              Faltas / Atrasos
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></span>{' '}
              Licenças Médicas
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500/20 border border-purple-500"></span>{' '}
              Outras Licenças
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-4 uppercase tracking-widest border-b pb-2">
            Detalhes do Mês: {format(date, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
                Listagem de Ocorrências
              </h4>
              <ul className="text-sm space-y-3">
                {feriados
                  .filter((f) => parseISO(f.date).getMonth() === date.getMonth())
                  .map((f) => (
                    <li
                      key={`feriado-${f.date}`}
                      className="flex items-start gap-2 bg-muted/10 p-2 rounded-md"
                    >
                      <span className="mt-1 w-2 h-2 rounded-full shrink-0 bg-blue-500"></span>
                      <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs shrink-0 border border-border/50 shadow-sm">
                        {format(parseISO(f.date), 'dd/MM')}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-blue-700 dark:text-blue-400 leading-none">
                          Feriado Nacional
                        </span>
                        <span className="text-muted-foreground text-[11px] leading-tight">
                          {f.name}
                        </span>
                      </div>
                    </li>
                  ))}

                {logs.map((l) => {
                  const isFalta = ['ausente', 'falta_injustificada', 'meio_periodo'].includes(
                    l.status,
                  )
                  const isMedica = ['atestado', 'licenca_medica'].includes(l.status)
                  const dotColor = isFalta
                    ? 'bg-red-500'
                    : isMedica
                      ? 'bg-yellow-500'
                      : 'bg-purple-500'

                  return (
                    <li key={l.id} className="flex items-start gap-2 bg-muted/10 p-2 rounded-md">
                      <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${dotColor}`}></span>
                      <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs shrink-0 border border-border/50 shadow-sm">
                        {format(parseISO(l.data), 'dd/MM')}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium leading-none">{l.funcionarios?.nome}</span>
                        <span className="text-muted-foreground text-[11px] leading-tight">
                          {STATUS_MAP[l.status] || l.status}{' '}
                          {l.justificativa ? `— ${l.justificativa}` : ''}
                        </span>
                      </div>
                    </li>
                  )
                })}

                {feriados.filter((f) => parseISO(f.date).getMonth() === date.getMonth()).length ===
                  0 &&
                  logs.length === 0 && (
                    <li className="text-muted-foreground italic text-xs py-4 text-center border border-dashed rounded-md">
                      Nenhum registro ou feriado neste mês.
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
