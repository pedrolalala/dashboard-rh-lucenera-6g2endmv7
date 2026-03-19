import { useState, useMemo } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { VacationRequest } from '@/pages/Ferias'
import { isWithinInterval, startOfDay } from 'date-fns'
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
    <Card className="shadow-none border-border flex flex-col h-full bg-card rounded-none">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle className="text-sm flex items-center gap-2 text-foreground uppercase tracking-widest font-light">
          <CalendarIcon className="size-4 text-muted-foreground" />
          Calendário de Férias
        </CardTitle>
        <CardDescription className="text-xs tracking-wide">
          Colaboradores com férias aprovadas
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center flex-1 p-0">
        <div className="w-full border-b border-border p-4 flex justify-center bg-card">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-full max-w-sm flex justify-center"
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
              vacation: 'bg-primary text-primary-foreground font-medium rounded-none',
            }}
          />
        </div>

        <div className="w-full p-4 space-y-4 flex-1 bg-background/50">
          <h4 className="text-[10px] font-medium border-b border-border pb-2 text-muted-foreground flex justify-between items-center uppercase tracking-widest">
            <span>
              {date
                ? date.toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Selecione uma data'}
            </span>
            <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-none">
              {activeOnDate.length}
            </span>
          </h4>

          <div className="max-h-[220px] overflow-y-auto pr-2 space-y-2">
            {activeOnDate.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6 bg-transparent border border-dashed border-border rounded-none uppercase tracking-wide">
                Nenhum colaborador
              </p>
            ) : (
              activeOnDate.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center gap-3 bg-card p-3 rounded-none border border-border transition-colors hover:bg-muted/50"
                >
                  <Avatar className="size-8 border border-border rounded-none">
                    <AvatarImage
                      src={`https://img.usecurling.com/ppl/thumbnail?seed=${req.employeeName}`}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground font-light text-xs rounded-none">
                      {req.employeeName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden flex-1">
                    <p className="font-medium text-xs truncate text-foreground tracking-wide uppercase">
                      {req.employeeName}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest mt-0.5">
                      {req.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-medium text-primary-foreground bg-primary px-2 py-1 rounded-none uppercase tracking-widest">
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
