import { useState, useEffect, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useFeriados } from '@/hooks/use-feriados'
import { CalendarDays, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  const [filters, setFilters] = useState({
    feriado: true,
    falta: true,
    medica: true,
    licenca: true,
  })

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

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

  const filteredFeriados = useMemo(
    () =>
      feriados
        .filter((f) => parseISO(f.date).getMonth() === date.getMonth())
        .filter(() => filters.feriado),
    [feriados, date, filters.feriado],
  )

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const isFalta = ['ausente', 'falta_injustificada', 'meio_periodo'].includes(l.status)
      const isMedica = ['atestado', 'licenca_medica'].includes(l.status)
      const isLicenca = !isFalta && !isMedica

      if (isFalta && !filters.falta) return false
      if (isMedica && !filters.medica) return false
      if (isLicenca && !filters.licenca) return false
      return true
    })
  }, [logs, filters])

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
              month={date}
              onMonthChange={setDate}
              locale={ptBR}
              modifiers={{
                feriado: filters.feriado ? feriadosDates : [],
                falta: filters.falta ? faltasDates : [],
                medica: filters.medica ? medicasDates : [],
                licenca: filters.licenca ? licencasDates : [],
              }}
              modifiersClassNames={{
                feriado:
                  'bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/50',
                falta:
                  'bg-red-500/20 text-red-700 dark:text-red-300 font-bold border border-red-500/50',
                medica:
                  'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 font-bold border border-yellow-500/50',
                licenca:
                  'bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/50',
              }}
              className="bg-transparent"
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
              <Filter className="h-3 w-3" /> Filtrar Visualização
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground w-full p-2 bg-muted/20 rounded-md border">
              <button
                onClick={() => toggleFilter('feriado')}
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-md transition-colors border',
                  filters.feriado
                    ? 'bg-blue-500/10 border-blue-500/30 text-foreground'
                    : 'bg-transparent border-transparent hover:bg-muted opacity-50 grayscale',
                )}
              >
                <span className="w-3 h-3 rounded-full bg-blue-500/40 border border-blue-500"></span>{' '}
                Feriados
              </button>
              <button
                onClick={() => toggleFilter('falta')}
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-md transition-colors border',
                  filters.falta
                    ? 'bg-red-500/10 border-red-500/30 text-foreground'
                    : 'bg-transparent border-transparent hover:bg-muted opacity-50 grayscale',
                )}
              >
                <span className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500"></span>{' '}
                Faltas / Atrasos
              </button>
              <button
                onClick={() => toggleFilter('medica')}
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-md transition-colors border',
                  filters.medica
                    ? 'bg-yellow-500/10 border-yellow-500/30 text-foreground'
                    : 'bg-transparent border-transparent hover:bg-muted opacity-50 grayscale',
                )}
              >
                <span className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500"></span>{' '}
                Licenças Médicas
              </button>
              <button
                onClick={() => toggleFilter('licenca')}
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-md transition-colors border',
                  filters.licenca
                    ? 'bg-purple-500/10 border-purple-500/30 text-foreground'
                    : 'bg-transparent border-transparent hover:bg-muted opacity-50 grayscale',
                )}
              >
                <span className="w-3 h-3 rounded-full bg-purple-500/40 border border-purple-500"></span>{' '}
                Outras Licenças
              </button>
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
                {filteredFeriados.map((f) => (
                  <li
                    key={`feriado-${f.date}`}
                    className="flex items-start gap-2 bg-blue-500/5 border border-blue-500/10 p-2 rounded-md"
                  >
                    <span className="mt-1 w-2 h-2 rounded-full shrink-0 bg-blue-500"></span>
                    <span className="font-mono bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs shrink-0">
                      {format(parseISO(f.date), 'dd/MM')}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-blue-700 dark:text-blue-400 leading-none">
                        Feriado Nacional
                      </span>
                      <span className="text-blue-600/80 dark:text-blue-300/80 text-[11px] leading-tight">
                        {f.name}
                      </span>
                    </div>
                  </li>
                ))}

                {filteredLogs.map((l) => {
                  const isFalta = ['ausente', 'falta_injustificada', 'meio_periodo'].includes(
                    l.status,
                  )
                  const isMedica = ['atestado', 'licenca_medica'].includes(l.status)

                  const dotColor = isFalta
                    ? 'bg-red-500'
                    : isMedica
                      ? 'bg-yellow-500'
                      : 'bg-purple-500'
                  const bgColor = isFalta
                    ? 'bg-red-500/5 border-red-500/10'
                    : isMedica
                      ? 'bg-yellow-500/5 border-yellow-500/10'
                      : 'bg-purple-500/5 border-purple-500/10'
                  const dateColor = isFalta
                    ? 'bg-red-500/10 text-red-700 dark:text-red-300'
                    : isMedica
                      ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
                      : 'bg-purple-500/10 text-purple-700 dark:text-purple-300'

                  return (
                    <li
                      key={l.id}
                      className={cn('flex items-start gap-2 p-2 rounded-md border', bgColor)}
                    >
                      <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${dotColor}`}></span>
                      <span
                        className={cn('font-mono px-2 py-0.5 rounded text-xs shrink-0', dateColor)}
                      >
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

                {filteredFeriados.length === 0 && filteredLogs.length === 0 && (
                  <li className="text-muted-foreground italic text-xs py-4 text-center border border-dashed rounded-md">
                    Nenhum registro encontrado para os filtros selecionados.
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
