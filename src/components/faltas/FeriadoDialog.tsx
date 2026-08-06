import { useState, useEffect } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import type { Feriado } from '@/hooks/use-feriados'

const TIPO_LABELS: Record<string, string> = {
  nacional: 'Nacional',
  estadual: 'Estadual',
  municipal: 'Municipal',
  ponto_facultativo: 'Ponto Facultativo',
  emenda: 'Emenda',
}

export function FeriadoDialog({
  open,
  onOpenChange,
  feriado,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  feriado?: Feriado | null
  onSuccess: () => void
}) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState('')
  const [descricao, setDescricao] = useState('')
  const [tipo, setTipo] = useState('estadual')
  const [observacao, setObservacao] = useState('')

  useEffect(() => {
    if (open) {
      if (feriado) {
        setData(feriado.date)
        setDescricao(feriado.name)
        setTipo(feriado.type)
        setObservacao(feriado.observacao || '')
      } else {
        setData('')
        setDescricao('')
        setTipo('estadual')
        setObservacao('')
      }
    }
  }, [open, feriado])

  const handleSave = async () => {
    if (!data || !descricao.trim()) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const payload = {
        data,
        descricao: descricao.trim(),
        tipo,
        observacao: observacao.trim() || null,
      }

      if (feriado?.id) {
        const { error } = await supabase.from('feriados').update(payload).eq('id', feriado.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('feriados')
          .insert({ ...payload, criado_por: user?.id })
        if (error) throw error
      }

      toast({ title: 'Feriado salvo com sucesso!' })
      onSuccess()
      onOpenChange(false)
    } catch (e: any) {
      toast({ title: 'Erro ao salvar feriado', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleRemover = async () => {
    if (!feriado?.id) return
    setLoading(true)
    try {
      const { error } = await supabase.from('feriados').update({ ativo: false }).eq('id', feriado.id)
      if (error) throw error
      toast({ title: 'Feriado removido' })
      onSuccess()
      onOpenChange(false)
    } catch (e: any) {
      toast({ title: 'Erro ao remover feriado', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{feriado ? 'Editar Feriado' : 'Novo Feriado / Emenda'}</DialogTitle>
          <DialogDescription>
            Feriados cadastrados aqui valem para todos os funcionários e reduzem os dias úteis do
            mês no cálculo do Vale Transporte.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Data</Label>
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Emenda de feriado, Aniversário da cidade..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TIPO_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Observação (opcional)</Label>
            <Textarea
              placeholder="Ex: Confirmado com o Filippo em reunião..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter className="flex items-center sm:justify-between gap-2">
          {feriado?.id ? (
            <Button
              variant="ghost"
              onClick={handleRemover}
              disabled={loading}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
