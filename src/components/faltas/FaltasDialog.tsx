import { useState, useEffect } from 'react'
import { format, addDays } from 'date-fns'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export function FaltasDialog({
  open,
  onOpenChange,
  record,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  record?: any
  onSuccess: () => void
}) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [funcionarios, setFuncionarios] = useState<any[]>([])

  const [funcionarioId, setFuncionarioId] = useState('')
  const [data, setData] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [status, setStatus] = useState('ausente')
  const [justificativa, setJustificativa] = useState('')

  useEffect(() => {
    if (open) {
      let query = supabase.from('funcionarios').select('id, nome').order('nome')

      if (!record) {
        query = query.eq('status', 'Ativo')
      }

      query.then(({ data: fnData }) => {
        if (fnData) {
          setFuncionarios(fnData)
          if (!record && fnData.length === 1 && !funcionarioId) {
            setFuncionarioId(fnData[0].id)
          }
        }
      })

      if (record) {
        setFuncionarioId(record.funcionario_id)
        setData(record.data)
        setDataFim(record.data)
        setStatus(record.status || 'ausente')
        setJustificativa(record.justificativa || '')
      } else {
        const todayStr = format(new Date(), 'yyyy-MM-dd')
        if (!funcionarioId) setFuncionarioId('')
        setData(todayStr)
        setDataFim(todayStr)
        setStatus('ausente')
        setJustificativa('')
      }
    }
  }, [open, record, user])

  const adjustEndDate = (startDateStr: string, currentStatus: string) => {
    const startDate = new Date(startDateStr + 'T12:00:00')
    let daysToAdd = 0

    switch (currentStatus) {
      case 'licenca_maternidade':
        daysToAdd = 120
        break
      case 'licenca_paternidade':
        daysToAdd = 5
        break
      case 'licenca_obito':
        daysToAdd = 2
        break
      case 'licenca_casamento':
        daysToAdd = 3
        break
      case 'licenca_militar':
        daysToAdd = 30
        break
      case 'licenca_medica':
        daysToAdd = 1
        break
    }

    if (daysToAdd > 0) {
      const endDate = addDays(startDate, daysToAdd - 1)
      setDataFim(format(endDate, 'yyyy-MM-dd'))
    } else {
      setDataFim(startDateStr)
    }
  }

  const handleDataChange = (newData: string) => {
    setData(newData)
    if (!newData) {
      setDataFim('')
      return
    }
    adjustEndDate(newData, status)
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    if (!data) return
    adjustEndDate(data, newStatus)
  }

  const handleSave = async () => {
    if (!funcionarioId || !data) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      if (record) {
        const payload: any = {
          funcionario_id: funcionarioId,
          data,
          status,
          justificativa,
        }
        const { error } = await supabase.from('controle_ponto').update(payload).eq('id', record.id)
        if (error) throw error
      } else {
        const start = new Date(data + 'T12:00:00')
        const end = dataFim ? new Date(dataFim + 'T12:00:00') : start

        if (end < start) {
          toast({ title: 'A data final não pode ser menor que a inicial', variant: 'destructive' })
          setLoading(false)
          return
        }

        const datesToInsert = []
        let current = start
        while (current <= end) {
          datesToInsert.push(format(current, 'yyyy-MM-dd'))
          current = addDays(current, 1)
        }

        for (const d of datesToInsert) {
          const payload: any = {
            funcionario_id: funcionarioId,
            data: d,
            status,
            justificativa,
          }

          const { data: existing } = await supabase
            .from('controle_ponto')
            .select('id')
            .eq('funcionario_id', funcionarioId)
            .eq('data', d)
            .maybeSingle()

          if (existing) {
            const { error } = await supabase
              .from('controle_ponto')
              .update(payload)
              .eq('id', existing.id)
            if (error) throw error
          } else {
            const { error } = await supabase.from('controle_ponto').insert(payload)
            if (error) throw error
          }
        }
      }

      toast({ title: 'Registro salvo com sucesso!' })
      onSuccess()
      onOpenChange(false)
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{record ? 'Editar Registro' : 'Registrar Falta / Licença'}</DialogTitle>
          <DialogDescription>
            Preencha os dados para registrar a ausência ou licença do colaborador.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Funcionário</Label>
            <Select value={funcionarioId} onValueChange={setFuncionarioId} disabled={!!record}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o funcionário..." />
              </SelectTrigger>
              <SelectContent>
                {funcionarios.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Tipo de Ausência / Licença</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="pl-8 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Faltas e Atestados
                  </SelectLabel>
                  <SelectItem value="falta_injustificada">Falta Injustificada</SelectItem>
                  <SelectItem value="ausente">Falta Integral</SelectItem>
                  <SelectItem value="meio_periodo">Meio Período</SelectItem>
                  <SelectItem value="atestado">Atestado Médico (Abonado)</SelectItem>
                  <SelectItem value="licenca_medica">Licença Médica (1 dia)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel className="pl-8 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Licenças Especiais
                  </SelectLabel>
                  <SelectItem value="licenca_maternidade">
                    Licença Maternidade (120 dias)
                  </SelectItem>
                  <SelectItem value="licenca_paternidade">Licença Paternidade (5 dias)</SelectItem>
                  <SelectItem value="licenca_obito">Licença Óbito / Nojo (2 dias)</SelectItem>
                  <SelectItem value="licenca_casamento">
                    Licença Casamento / Gala (3 dias)
                  </SelectItem>
                  <SelectItem value="licenca_militar">Licença Serviço Militar (30 dias)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={data}
                onChange={(e) => handleDataChange(e.target.value)}
                disabled={!!record}
              />
            </div>
            <div className="grid gap-2">
              <Label>Data Fim {record ? '(Apenas leitura)' : ''}</Label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                disabled={!!record}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Justificativa / Motivo</Label>
            <Textarea
              placeholder="Ex: Atestado médico entregue, Motivos pessoais, etc."
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
