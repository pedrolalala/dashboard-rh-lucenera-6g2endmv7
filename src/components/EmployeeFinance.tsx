import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Employee } from '@/pages/Funcionarios'
import { Loader2, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i, 1).toLocaleString('pt-BR', { month: 'long' }),
}))

const YEARS = [
  String(new Date().getFullYear() - 1),
  String(new Date().getFullYear()),
  String(new Date().getFullYear() + 1),
]

export function EmployeeFinance({ employee }: { employee: Employee }) {
  const [salarioBase, setSalarioBase] = useState<string>(String(employee.salary || 0))
  const [comissao, setComissao] = useState<string>('0')
  const [mes, setMes] = useState(String(new Date().getMonth() + 1))
  const [ano, setAno] = useState(String(new Date().getFullYear()))
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const [folhaId, setFolhaId] = useState<string | null>(null)
  const [historico, setHistorico] = useState<any[]>([])

  useEffect(() => {
    fetchFolha()
    fetchHistorico()
  }, [mes, ano, employee.id])

  const fetchHistorico = async () => {
    const { data } = await supabase
      .from('folha_pagamento')
      .select('*')
      .eq('funcionario_id', employee.id)
      .order('ano', { ascending: false })
      .order('mes', { ascending: false })
      .limit(12)
    if (data) setHistorico(data)
  }

  const fetchFolha = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('folha_pagamento')
      .select('*')
      .eq('funcionario_id', employee.id)
      .eq('mes', Number(mes))
      .eq('ano', Number(ano))
      .maybeSingle()

    if (data) {
      setFolhaId(data.id)
      setSalarioBase(String(data.salario_base || 0))
      setComissao(String(data.comissao || 0))
    } else {
      setFolhaId(null)
      const { data: empData } = await supabase
        .from('funcionarios')
        .select('salario_base, comissao_padrao')
        .eq('id', employee.id)
        .single()
      setSalarioBase(String(empData?.salario_base || 0))
      setComissao(String(empData?.comissao_padrao || 0))
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const base = Number(salarioBase) || 0
      const com = Number(comissao) || 0

      await supabase
        .from('funcionarios')
        .update({ salario_base: base, comissao_padrao: com })
        .eq('id', employee.id)

      const descontos = base * 0.185
      const adicionais = 800
      const liquido = base - descontos + adicionais + com

      const payload = {
        funcionario_id: employee.id,
        mes: Number(mes),
        ano: Number(ano),
        salario_base: base,
        descontos,
        adicionais,
        comissao: com,
        salario_liquido: liquido,
      }

      if (folhaId) {
        const { error } = await supabase.from('folha_pagamento').update(payload).eq('id', folhaId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('folha_pagamento').insert([payload])
        if (error) throw error
      }

      toast({ title: 'Dados financeiros atualizados com sucesso!' })
      fetchFolha()
      fetchHistorico()
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const baseVal = Number(salarioBase) || 0
  const comVal = Number(comissao) || 0
  const descVal = baseVal * 0.185
  const adicVal = 800
  const liqVal = baseVal - descVal + adicVal + comVal

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-lg border border-border">
        <Select value={mes} onValueChange={setMes}>
          <SelectTrigger className="bg-transparent border-none shadow-none focus:ring-0">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value} className="capitalize">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="w-px h-6 bg-border mx-1"></div>
        <Select value={ano} onValueChange={setAno}>
          <SelectTrigger className="bg-transparent border-none shadow-none focus:ring-0">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Carregando dados...
          </span>
        </div>
      ) : (
        <Card className="shadow-none border-border">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="uppercase text-[10px] tracking-widest">Salário Base (R$)</Label>
                <Input
                  type="number"
                  value={salarioBase}
                  onChange={(e) => setSalarioBase(e.target.value)}
                  placeholder="0.00"
                  className="font-medium"
                />
                <p className="text-[11px] text-muted-foreground">
                  Atualiza o salário base do funcionário e o valor desta folha.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label className="uppercase text-[10px] tracking-widest text-primary">
                  Comissão Mensal (R$)
                </Label>
                <Input
                  type="number"
                  value={comissao}
                  onChange={(e) => setComissao(e.target.value)}
                  placeholder="0.00"
                  className="border-primary/30 focus-visible:ring-primary font-medium bg-primary/5"
                />
                <p className="text-[11px] text-muted-foreground">
                  Valor de comissão ou bônus adicional para este mês específico.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-md border border-border space-y-2">
              <Label className="uppercase text-[10px] tracking-widest text-muted-foreground mb-2 block">
                Resumo do Período
              </Label>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Salário Base:</span>
                <span className="font-medium">R$ {baseVal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Descontos (INSS/IR):</span>
                <span className="text-destructive">- R$ {descVal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Adicionais (VR/VT):</span>
                <span className="text-emerald-500">+ R$ {adicVal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Comissão:</span>
                <span className="text-emerald-500 font-medium">+ R$ {comVal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-3 border-t border-border mt-3 text-base">
                <span>Salário Líquido:</span>
                <span>R$ {liqVal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full uppercase tracking-widest text-[10px]"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <DollarSign className="h-4 w-4 mr-2" />
              )}
              Salvar Folha do Mês
            </Button>
          </CardContent>
        </Card>
      )}

      {historico.length > 0 && (
        <div className="space-y-3 mt-8">
          <Label className="uppercase text-[10px] tracking-widest text-muted-foreground">
            Histórico de Comissões e Folhas
          </Label>
          <div className="space-y-2">
            {historico.map((h) => (
              <div
                key={h.id}
                className="flex justify-between items-center p-3 rounded-md border border-border bg-muted/10 text-sm"
              >
                <div>
                  <span className="font-medium">
                    {String(h.mes).padStart(2, '0')}/{h.ano}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Liq: R$ {Number(h.salario_liquido).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-primary font-medium text-xs uppercase tracking-widest">
                    Comissão
                  </span>
                  <p className="text-emerald-500 font-bold">R$ {Number(h.comissao).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
