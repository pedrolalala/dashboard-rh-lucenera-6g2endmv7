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
  const [status, setStatus] = useState('ausente')
  const [justificativa, setJustificativa] = useState('')

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
        setStatus(record.status || 'ausente')
        setJustificativa(record.justificativa || '')
      } else {
        setFuncionarioId('')
        setData(format(new Date(), 'yyyy-MM-dd'))
        setStatus('ausente')
        setJustificativa('')
      }
    }
  }, [open, record, isAdmin, user])

  const handleSave = async () => {
    if (!funcionarioId || !data) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const payload: any = {
        funcionario_id: funcionarioId,
        data,
        status,
        justificativa,
      }

      if (record) {
        const { error } = await supabase.from('controle_ponto').update(payload).eq('id', record.id)
        if (error) throw error
      } else {
        const { data: existing } = await supabase
          .from('controle_ponto')
          .select('id')
          .eq('funcionario_id', funcionarioId)
          .eq('data', data)
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
          <DialogTitle>{record ? 'Editar Falta' : 'Registrar Nova Falta'}</DialogTitle>
          <DialogDescription>
            Preencha os dados para registrar a ausência do colaborador.
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
            <Label>Data</Label>
            <Input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              disabled={!!record}
            />
          </div>

          <div className="grid gap-2">
            <Label>Tipo de Ausência</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ausente">Falta Integral</SelectItem>
                <SelectItem value="meio_periodo">Meio Período</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Justificativa / Motivo</Label>
            <Textarea
              placeholder="Ex: Atestado médico entregue, Problemas de saúde, Ausência injustificada, etc."
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
