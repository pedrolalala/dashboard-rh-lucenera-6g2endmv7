import { useState, useEffect } from 'react'
import { format } from 'date-fns'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export function PontoDialog({
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
  const [horaEntrada, setHoraEntrada] = useState('')
  const [horaSaida, setHoraSaida] = useState('')
  const [motivo, setMotivo] = useState('')

  const isAdmin = user?.app_role === 'admin' || user?.app_role === 'gerente'

  useEffect(() => {
    if (open) {
      if (isAdmin && !record) {
        supabase
          .from('funcionarios_rh')
          .select('id, nome')
          .order('nome')
          .then(({ data }) => {
            if (data) setFuncionarios(data)
          })
      }

      if (record) {
        setFuncionarioId(record.funcionario_id)
        setData(record.data)
        setHoraEntrada(record.hora_entrada?.substring(0, 5) || '')
        setHoraSaida(record.hora_saida?.substring(0, 5) || '')
      } else {
        setFuncionarioId(user?.funcionario_id || '')
        setData(format(new Date(), 'yyyy-MM-dd'))
        setHoraEntrada('')
        setHoraSaida('')
      }
      setMotivo('')
    }
  }, [open, record, isAdmin, user])

  const calculateTotalHours = (entrada: string, saida: string) => {
    if (!entrada || !saida) return null
    const [inH, inM] = entrada.split(':').map(Number)
    const [outH, outM] = saida.split(':').map(Number)
    const totalMin = outH * 60 + outM - (inH * 60 + inM)
    return Number((Math.max(0, totalMin) / 60).toFixed(2))
  }

  const handleSave = async () => {
    if (!funcionarioId || !data) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
      return
    }
    if (!motivo.trim()) {
      toast({ title: 'O motivo da edição é obrigatório', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const entradaFull = horaEntrada ? `${horaEntrada}:00` : null
      const saidaFull = horaSaida ? `${horaSaida}:00` : null
      const totalHours = calculateTotalHours(horaEntrada, horaSaida)
      const novoStatus =
        totalHours !== null && totalHours >= 0
          ? 'presente'
          : entradaFull || saidaFull
            ? 'presente'
            : 'ausente'

      const historyEntry = {
        edited_by: user?.id,
        edited_at: new Date().toISOString(),
        old_entrada: record?.hora_entrada || null,
        new_entrada: entradaFull,
        old_saida: record?.hora_saida || null,
        new_saida: saidaFull,
        reason: motivo,
      }

      if (record) {
        const history = [...(record.edit_history || []), historyEntry]
        const updatePayload: any = {
          hora_entrada: entradaFull,
          hora_saida: saidaFull,
          total_horas: totalHours,
          is_edited: true,
          edit_history: history,
          status: novoStatus,
        }

        const { error } = await supabase
          .from('controle_ponto')
          .update(updatePayload)
          .eq('id', record.id)
        if (error) throw error
      } else {
        const { data: existing } = await supabase
          .from('controle_ponto')
          .select('*')
          .eq('funcionario_id', funcionarioId)
          .eq('data', data)
          .maybeSingle()

        if (existing) {
          const history = [
            ...(existing.edit_history || []),
            {
              ...historyEntry,
              old_entrada: existing.hora_entrada,
              old_saida: existing.hora_saida,
            },
          ]

          const updatePayload: any = {
            hora_entrada: entradaFull,
            hora_saida: saidaFull,
            total_horas: totalHours,
            is_edited: true,
            edit_history: history,
            status: novoStatus,
          }

          const { error } = await supabase
            .from('controle_ponto')
            .update(updatePayload)
            .eq('id', existing.id)
          if (error) throw error
        } else {
          const insertPayload: any = {
            funcionario_id: funcionarioId,
            data,
            hora_entrada: entradaFull,
            hora_saida: saidaFull,
            total_horas: totalHours,
            status: novoStatus,
            is_edited: true,
            edit_history: [historyEntry],
          }
          const { error } = await supabase.from('controle_ponto').insert(insertPayload)
          if (error) throw error
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
          <DialogTitle>{record ? 'Editar Ponto' : 'Novo Registro de Ponto'}</DialogTitle>
          <DialogDescription>
            {record
              ? 'Ajuste os horários de entrada e saída. Esta alteração ficará registrada no histórico.'
              : 'Insira um registro manual de ponto. Esta ação ficará registrada no histórico.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isAdmin && !record && (
            <div className="grid gap-2">
              <Label>Funcionário</Label>
              <Select value={funcionarioId} onValueChange={setFuncionarioId}>
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
          )}

          <div className="grid gap-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              disabled={!!record}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Entrada (HH:mm)</Label>
              <Input
                type="time"
                value={horaEntrada}
                onChange={(e) => setHoraEntrada(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Saída (HH:mm)</Label>
              <Input type="time" value={horaSaida} onChange={(e) => setHoraSaida(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Motivo da Alteração / Justificativa</Label>
            <Textarea
              placeholder="Ex: Esqueci de registrar o ponto no horário exato."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
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
