import { useState } from 'react'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { vacationData } from '@/data/mock'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Ferias() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Gestão de Férias</h1>
        <Button className="bg-secondary text-secondary-foreground">Aprovar Solicitações</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-sm md:col-span-1 border-blue-100/50 h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="size-5 text-secondary" />
              Calendário
            </CardTitle>
            <CardDescription>Visão geral de ausências programadas</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm md:col-span-2 border-blue-100/50">
          <CardHeader>
            <CardTitle className="text-lg">Próximas Férias</CardTitle>
            <CardDescription>Colaboradores com férias agendadas ou em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {vacationData.map((vacation) => {
                const percent = ((vacation.total - vacation.remaining) / vacation.total) * 100

                return (
                  <div key={vacation.id} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarImage
                            src={`https://img.usecurling.com/ppl/thumbnail?seed=${vacation.id + 10}`}
                          />
                          <AvatarFallback>{vacation.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{vacation.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />
                            {vacation.start} até {vacation.end}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary">
                          {vacation.remaining} dias
                        </span>
                        <p className="text-xs text-muted-foreground">restantes</p>
                      </div>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
