import { useState, useMemo } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { VacationRequest } from '@/pages/Ferias'
import { isWithinInterval, startOfDay, parseISO } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface VacationCalendarProps {
  requests: VacationRequest[]
}

export function VacationCalendar({ requests }: VacationCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const activeOnDate = useMemo(() => {
    if (!date) return []
    return requests.filter((req) => {
      if (req.status !== 'Aprovado') return false
      const d = startOfDay(date)
      const start = startOfDay(new Date(req.startDate))
      const end = startOfDay(new Date(req.endDate))
      return isWithinInterval(d, { start, end })
    })
  }, [date, requests])

  return (
    <Card className="shadow-sm border-blue-100/50 flex flex-col h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="size-5 text-secondary" />
          Calendário de Ausências
        </CardTitle>
        <CardDescription>Colaboradores com férias aprovadas</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center flex-1 pb-6 space-y-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow-sm w-full flex justify-center bg-white"
          modifiers={{
            vacation: (day) =>
              requests.some(
                (r) =>
                  r.status === 'Aprovado' &&
                  isWithinInterval(startOfDay(day), {
                    start: startOfDay(new Date(r.startDate)),
                    end: startOfDay(new Date(r.endDate)),
                  }),
              ),
          }}
          modifiersClassNames={{
            vacation: 'bg-blue-50 text-blue-700 font-bold border border-blue-200',
          }}
        />

        <div className="w-full space-y-4 pt-2">
          <h4 className="text-sm font-medium border-b pb-2 text-slate-700 flex justify-between items-center">
            <span>
              {date
                ? date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
                : 'Selecione uma data'}
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {activeOnDate.length}
            </span>
          </h4>

          <div className="max-h-[220px] overflow-y-auto pr-2 space-y-2">
            {activeOnDate.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                Nenhum colaborador de férias nesta data.
              </p>
            ) : (
              activeOnDate.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center gap-3 bg-white p-2.5 rounded-lg border shadow-sm animate-fade-in"
                >
                  <Avatar className="size-9 border border-blue-100">
                    <AvatarImage
                      src={`https://img.usecurling.com/ppl/thumbnail?seed=${req.employeeName}`}
                    />
                    <AvatarFallback className="bg-blue-50 text-blue-700 font-medium">
                      {req.employeeName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden flex-1">
                    <p className="font-medium text-sm truncate text-slate-900">
                      {req.employeeName}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{req.department}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      {req.days} dias
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
