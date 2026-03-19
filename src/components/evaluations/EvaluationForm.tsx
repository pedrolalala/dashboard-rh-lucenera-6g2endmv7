import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

interface EvaluationFormProps {
  employees: { id: string; nome: string }[]
  onSuccess: () => void
  onCancel: () => void
}

const RatingRow = ({
  name,
  label,
  value,
  onChange,
}: {
  name: string
  label: string
  value: number
  onChange: (n: string, v: number) => void
}) => (
  <div className="flex items-center justify-between py-2 border-b last:border-0 border-slate-100">
    <Label className="text-sm font-medium text-slate-700">{label}</Label>
    <RadioGroup
      value={String(value)}
      onValueChange={(v) => onChange(name, Number(v))}
      className="flex gap-3 sm:gap-4"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="flex flex-col items-center gap-1">
          <RadioGroupItem value={String(n)} id={`${name}-${n}`} />
          <Label htmlFor={`${name}-${n}`} className="text-xs text-muted-foreground">
            {n}
          </Label>
        </div>
      ))}
    </RadioGroup>
  </div>
)

export function EvaluationForm({ employees, onSuccess, onCancel }: EvaluationFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [funcId, setFuncId] = useState('')
  const [start, setStart] = useState<Date>()
  const [end, setEnd] = useState<Date>()
  const [date, setDate] = useState<Date>(new Date())
  const [comments, setComments] = useState('')
  const [ratings, setRatings] = useState({ prod: 3, qual: 3, pont: 3, trab: 3 })

  const handleRating = (name: string, val: number) =>
    setRatings((prev) => ({ ...prev, [name]: val }))

  const handleSubmit = async () => {
    if (!funcId || !start || !end || !date || !user?.id) return

    setLoading(true)
    const { error } = await supabase.from('avaliacoes').insert({
      funcionario_id: funcId,
      periodo_inicio: format(start, 'yyyy-MM-dd'),
      periodo_fim: format(end, 'yyyy-MM-dd'),
      produtividade: ratings.prod,
      qualidade: ratings.qual,
      pontualidade: ratings.pont,
      trabalho_equipe: ratings.trab,
      comentarios: comments,
      data_avaliacao: date.toISOString(),
      avaliador_id: user.id,
    })

    setLoading(false)
    if (!error) onSuccess()
  }

  const isReady = funcId && start && end && date

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>Funcionário</Label>
        <Select value={funcId} onValueChange={setFuncId}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Selecione o colaborador" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Período Início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal bg-white',
                  !start && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {start ? format(start, 'dd/MM/yyyy') : 'Data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={start} onSelect={setStart} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Período Fim</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal bg-white',
                  !end && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {end ? format(end, 'dd/MM/yyyy') : 'Data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={end} onSelect={setEnd} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-1">
        <RatingRow name="prod" label="Produtividade" value={ratings.prod} onChange={handleRating} />
        <RatingRow name="qual" label="Qualidade" value={ratings.qual} onChange={handleRating} />
        <RatingRow name="pont" label="Pontualidade" value={ratings.pont} onChange={handleRating} />
        <RatingRow
          name="trab"
          label="Trabalho em Equipe"
          value={ratings.trab}
          onChange={handleRating}
        />
      </div>

      <div className="space-y-2">
        <Label>Comentários / Feedback</Label>
        <Textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Observações adicionais..."
          className="bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label>Data da Avaliação</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal bg-white',
                !date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'dd/MM/yyyy') : 'Data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate as any} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isReady || loading}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Avaliação'}
        </Button>
      </div>
    </div>
  )
}
